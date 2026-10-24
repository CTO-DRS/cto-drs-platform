#!/usr/bin/env python3
"""استخراج أيقونات المشغّل الحقيقية من ملفات APK — إصدار قرصي متين:
- تنزيل إلى ملف مؤقت على القرص (لا تضخم الذاكرة) بخيوط متوازية
- أرشيفات بأسماء موارد معماة: فحص كل PNG مربع (48..512px) واختيار الأكبر مساحة
- تحويل webp→PNG وتوحيد 192x192 → public/apps-icons/{slug}.png"""
import json, os, io, zipfile, tempfile, urllib.request, shutil
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

apps = json.load(open('src/content/apps.json'))
OUT = 'public/apps-icons'
os.makedirs(OUT, exist_ok=True)
UA = {'User-Agent': 'cto-drs-store'}

DENSITY_ORDER = ['xxxhdpi', 'xxhdpi', 'xhdpi', 'hdpi', 'mdpi', '']

def icon_score(name: str):
    low = name.lower()
    if not low.endswith(('.png', '.webp')): return None
    if low.endswith('.9.png'): return None
    base = low.rsplit('/', 1)[-1]
    if 'ic_launcher-playstore' in base: name_rank = 0
    elif base in ('ic_launcher.png', 'ic_launcher.webp'): name_rank = 1
    elif 'ic_launcher' in base and 'foreground' not in base and 'round' not in base: name_rank = 2
    elif 'ic_launcher' in base and 'foreground' not in base: name_rank = 3
    else: return None
    dens = len(DENSITY_ORDER) - 1
    for i, d in enumerate(DENSITY_ORDER):
        if d and f'-{d}' in low: dens = i; break
    return (name_rank, dens)

def dims(data: bytes):
    try:
        im = Image.open(io.BytesIO(data))
        return im.size
    except Exception:
        return None

def pick_from_apk(zf: zipfile.ZipFile):
    """أفضل أيقونة: مسمّاة ic_launcher أولًا، وإلا أكبر PNG مربع 48..512px"""
    best = None  # key: (named_rank>-1, name_rank, -dens, square_area)
    for info in zf.infolist():
        name = info.filename
        if name.endswith('/'): continue
        s = icon_score(name)
        if s:
            key = (1, s[0], -s[1], info.file_size)
            if best is None or key > best[0]:
                best = (key, name)
            continue
        # ماسح المعمّى: PNG مربع معقول الحجم (وليس 9-patch)
        low = name.lower()
        if low.startswith('res/') and low.endswith('.png'):
            try:
                data = zf.read(info)
            except Exception:
                continue
            d = dims(data)
            if not d: continue
            w, h = d
            if w == h and 48 <= w <= 512:
                key = (0, 1, 0, w * h)
                if best is None or key > best[0]:
                    best = (key, name, data)
    if best is None: return None
    name = best[1]
    return name, zf.read(name)

def process(a):
    slug = a['slug']
    try:
        dest = f'{OUT}/{slug}.png'
        if os.path.exists(dest):
            print(f'HAVE {slug:16} already', flush=True); return
        apk_url = next((d['url'] for d in a.get('downloads', [])
                        if d.get('kind') == 'apk' and d.get('url', '').startswith('http')), None)
        if not apk_url:
            print(f'SKIP {slug:15} لا يوجد رابط APK', flush=True); return
        tmp = tempfile.NamedTemporaryFile(suffix='.apk', delete=False)
        try:
            req = urllib.request.Request(apk_url, headers=UA)
            with urllib.request.urlopen(req, timeout=300) as r, open(tmp.name, 'wb') as f:
                shutil.copyfileobj(r, f, length=1024 * 512)
            with zipfile.ZipFile(tmp.name) as zf:
                found = pick_from_apk(zf)
        finally:
            os.unlink(tmp.name)
        if not found:
            print(f'MISS {slug:15} لا أيقونة داخل APK', flush=True); return
        name, raw = found
        im = Image.open(io.BytesIO(raw))
        if im.mode not in ('RGBA', 'RGB'): im = im.convert('RGBA')
        if im.size[0] > 192: im = im.resize((192, 192), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'PNG')
        with open(dest, 'wb') as f: f.write(buf.getvalue())
        print(f'OK   {slug:15} {name} ({im.size[0]}x{im.size[1]})', flush=True)
    except Exception as e:
        print(f'ERR  {slug:15} {type(e).__name__}: {e}', flush=True)

if __name__ == '__main__':
    import sys
    only = set(sys.argv[1:])
    targets = [a for a in apps if not only or a['slug'] in only]
    with ThreadPoolExecutor(max_workers=2) as ex:
        list(ex.map(process, targets))
    print('ALL_DONE', flush=True)
