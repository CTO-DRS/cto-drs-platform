#!/usr/bin/env python3
"""استخراج نهائي بأيقونات ملونة فقط: استبعاد الصور الأحادية (أيقونات الإشعارات)
وتفضيل الأسماء المعماة وأحجام المشغّل القياسية."""
import io, os, zipfile, tempfile, urllib.request, shutil
from PIL import Image

apps = {
    'masar-al-lugha': 'https://github.com/CTO-DRS/masar-al-lugha/releases/download/v4.8.0/masar-al-lugha-v4.8.0.apk',
    'drs-nexus':      'https://github.com/CTO-DRS/drs-nexus/releases/download/v5.4.0/DRS-Nexus-v5.4.0-release-signed.apk',
    'nexuslink':      'https://github.com/CTO-DRS/NexusLink/releases/download/v3.0.0/NexusLink-3.0.0-release.apk',
}
OUT = 'public/apps-icons'
LAUNCHER_SIZES = {192, 144, 108, 96, 48, 512}

def colorfulness(im):
    small = im.convert('RGB').resize((24, 24))
    px = list(small.getdata())
    return sum(max(p) - min(p) for p in px) / len(px)

def candidates(zf):
    found = []
    for info in zf.infolist():
        low = info.filename.lower()
        if not low.startswith('res/') or not low.endswith(('.png', '.webp')) or low.endswith('.9.png'):
            continue
        try:
            data = zf.read(info)
            im = Image.open(io.BytesIO(data)); im.load()
        except Exception:
            continue
        w, h = im.size
        if w != h or not (48 <= w <= 512):
            continue
        sat = colorfulness(im)
        if sat < 15:  # أحادية اللون = أيقونة إشعار/قناع — ليست أيقونة مشغّل
            continue
        base = low.rsplit('/', 1)[-1]
        is_launcher_named = 'ic_launcher' in base
        obfuscated = len(base.rsplit('.', 1)[0]) <= 4 and '_' not in base.rsplit('.', 1)[0]
        size_pref = 0 if w in LAUNCHER_SIZES else 1
        rank = (0 if is_launcher_named else 1 if obfuscated else 2, size_pref, -w)
        found.append((rank, info.filename, data))
    found.sort(key=lambda x: x[0])
    return found

for slug, url in apps.items():
    try:
        tmp = tempfile.NamedTemporaryFile(suffix='.apk', delete=False)
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'cto-drs-store'}), timeout=300) as r, open(tmp.name, 'wb') as f:
            shutil.copyfileobj(r, f, 1024 * 512)
        with zipfile.ZipFile(tmp.name) as zf:
            cands = candidates(zf)
        os.unlink(tmp.name)
        if not cands:
            print(f'MISS {slug}'); continue
        rank, name, data = cands[0]
        im = Image.open(io.BytesIO(data)); im.load()
        if im.mode not in ('RGBA', 'RGB'): im = im.convert('RGBA')
        if im.size[0] > 192: im = im.resize((192, 192), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'PNG')
        with open(f'{OUT}/{slug}.png', 'wb') as f: f.write(buf.getvalue())
        print(f'OK   {slug:15} {name} ({im.size[0]}x{im.size[1]})')
        for r2, n2, _ in cands[1:3]:
            print(f'      بديل: {n2} rank={r2}')
    except Exception as e:
        print(f'ERR  {slug}: {type(e).__name__} {e}')
