#!/usr/bin/env python3
"""Plan B: مرشحات موسّعة (webp/Compose/ويب) + تعدين README.md عن أي صورة أيقونة/شعار.
ينزّل أول نتيجة مقبولة إلى public/apps-icons/{slug}.png"""
import json, os, re, urllib.request, struct

apps = json.load(open('src/content/apps.json'))
OUT = 'public/apps-icons'
os.makedirs(OUT, exist_ok=True)

CANDIDATES = [
    # أندرويد كلاسيكي
    'app/src/main/ic_launcher-playstore.png',
    'app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    'app/src/main/res/mipmap-xxxhdpi/ic_launcher.webp',
    'app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
    'app/src/main/res/mipmap-xxhdpi/ic_launcher.webp',
    'app/src/main/res/mipmap-xhdpi/ic_launcher.png',
    'app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png',
    # أندرويد بوحدات بديلة (KMP/Compose)
    'composeApp/src/androidMain/res/mipmap-xxxhdpi/ic_launcher.png',
    'composeApp/src/commonMain/composeResources/drawable/ic_launcher.png',
    'androidApp/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    'mobile/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    # ويب / أدوات
    'public/icon.png', 'public/logo.png', 'static/icon.png', 'static/logo.png',
    'src/assets/icon.png', 'src/assets/logo.png', 'assets/icon.png', 'assets/logo.png',
    'docs/icon.png', 'images/icon.png', 'img/icon.png', 'media/icon.png', 'art/icon.png', 'artwork/icon.png',
    'build/icon.png', 'electron/icon.png', 'dist/icon.png',
    'icon.png', 'logo.png', '.github/icon.png', '.github/logo.png',
    'app/src/main/res/drawable-xxxhdpi/ic_launcher.png',
    'app/src/main/res/drawable/ic_launcher_foreground.png',
]

UA = {'User-Agent': 'cto-drs-store'}

def fetch(url: str):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status == 200:
                return r.read()
    except Exception:
        pass
    return None

def png_size(data: bytes):
    if data[:8] != b'\x89PNG\r\n\x1a\n': return None
    try:
        w, h = struct.unpack('>II', data[16:24]); return w, h
    except Exception: return None

def webp_size(data: bytes):
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP': return None
    try:
        fmt = data[12:16]
        if fmt == b'VP8X':
            w = int.from_bytes(data[24:27],'little')+1; h = int.from_bytes(data[27:30],'little')+1; return w,h
        if fmt == b'VP8 ':
            w = int.from_bytes(data[26:28],'little') & 0x3fff; h = int.from_bytes(data[28:30],'little') & 0x3fff; return w,h
        if fmt == b'VP8L':
            b = data[21]; w = ((data[22]&0x3f)<<8 | (b&0xf0)>>4)+1; h = (((b&0xf)<<10) | (data[23]<<2) | (data[24]>>6))+1; return w,h
    except Exception: pass
    return None

def mine_readme(repo: str):
    raw = fetch(f'https://raw.githubusercontent.com/{repo}/HEAD/README.md')
    if not raw: return []
    text = raw.decode('utf-8', 'ignore')
    imgs = []
    for m in re.finditer(r'!\[[^\]]*\]\(([^)\s]+)', text):
        imgs.append(m.group(1))
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', text, re.I):
        imgs.append(m.group(1))
    picked = []
    for u in imgs:
        ul = u.lower()
        is_icon_kw = any(k in ul for k in ('icon', 'logo', 'launcher', 'brand'))
        is_asset = u.startswith('http') and ('user-attachments' in u or 'raw.githubusercontent' in u or 'github.com' in u)
        is_local = not u.startswith('http') and not u.startswith('#')
        if is_icon_kw and (is_asset or is_local):
            if is_local:
                u = f'https://raw.githubusercontent.com/{repo}/HEAD/' + u.lstrip('./')
            picked.append(u)
    return picked[:6]

report = {}
for a in apps:
    repo = (a.get('repository') or '').replace('https://github.com/', '')
    slug = a['slug']
    dest = f'{OUT}/{slug}.png'
    if os.path.exists(dest):
        report[slug] = ('HAVE', 'already downloaded'); continue
    if not repo or '/' not in repo:
        report[slug] = ('skip', 'no repo'); continue

    got = None  # (rank, path, data)
    for i, cand in enumerate(CANDIDATES):
        data = fetch(f'https://raw.githubusercontent.com/{repo}/HEAD/{cand}')
        if data and len(data) > 300:
            size = png_size(data) or webp_size(data) or (0, 0)
            if size[0] < 64:  # صغيرة جدًا ليست أيقونة
                continue
            rank = (9 - min(i, 8), min(size))
            if got is None or rank > got[0]:
                got = (rank, cand, data)
            if size[0] >= 192 and i <= 5: break

    if got is None:
        # تعدين README
        for u in mine_readme(repo):
            data = fetch(u)
            if data and 300 < len(data) < 3_000_000:
                size = png_size(data) or webp_size(data) or (0, 0)
                if size[0] >= 64:
                    got = ((0, min(size)), f'README:{u[:60]}', data); break

    if got:
        _, path, data = got
        with open(dest, 'wb') as f: f.write(data)
        size = png_size(data) or webp_size(data) or ('?', '?')
        report[slug] = ('OK', f'{path} ({size[0]}x{size[1]}, {len(data)//1024}KB)')
    else:
        report[slug] = ('MISS', 'not found')

for slug, (st, info) in report.items():
    print(f'{st:4} {slug:16} {info}')
