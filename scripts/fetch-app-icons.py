#!/usr/bin/env python3
"""اكتشاف أيقونات التطبيقات الحقيقية من مستودعات GitHub عبر raw.githubusercontent.com
(بلا API وبلا rate-limit) وتنزيل الأفضل إلى public/apps-icons/{slug}.png"""
import json, os, urllib.request, struct

apps = json.load(open('src/content/apps.json'))
OUT = 'public/apps-icons'
os.makedirs(OUT, exist_ok=True)

# مسارات مرشحة من الأقوى للأضعف (أيقونات أندرويد عالية الدقة أولًا)
CANDIDATES = [
    'app/src/main/ic_launcher-playstore.png',
    'app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    'app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
    'app/src/main/res/mipmap-xhdpi/ic_launcher.png',
    'app/src/main/res/drawable-xxxhdpi/ic_launcher.png',
    'app/src/main/res/drawable/ic_launcher.png',
    'fastlane/metadata/android/en_US/icon.png',
    'assets/icon.png', 'assets/logo.png', 'art/icon.png', 'artwork/icon.png',
    'icon.png', 'logo.png', '.github/icon.png', '.github/logo.png',
    'app/src/main/res/mipmap-xxxhdpi/logo.png',
    'app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
]

def png_size(data: bytes):
    if data[:8] != b'\x89PNG\r\n\x1a\n': return None
    w, h = struct.unpack('>II', data[16:24])
    return w, h

def probe(owner_repo: str, path: str):
    url = f'https://raw.githubusercontent.com/{owner_repo}/HEAD/{path}'
    req = urllib.request.Request(url, headers={'User-Agent': 'cto-drs-store'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status == 200:
                return r.read()
    except Exception:
        return None
    return None

report = {}
for a in apps:
    repo = (a.get('repository') or '').replace('https://github.com/', '')
    slug = a['slug']
    if not repo or '/' not in repo:
        report[slug] = ('skip', 'no repo'); continue
    best = None  # (score, path, data)
    for i, cand in enumerate(CANDIDATES):
        data = probe(repo, cand)
        if data and len(data) > 500:
            size = png_size(data) or (0, 0)
            # الأفضلية: ترتيب المرشح ثم الأبعاد الأكبر
            score = (10 - i, min(size))
            if best is None or score > best[0]:
                best = (score, cand, data)
            if size[0] >= 512 and i <= 2:
                break  # كافٍ جدًا، لا داعي للمواصلة
    if best:
        _, path, data = best
        ext = '.png' if path.endswith('.png') else os.path.splitext(path)[1]
        dest = f'{OUT}/{slug}{ext}'
        with open(dest, 'wb') as f: f.write(data)
        w, h = png_size(data) or (0, 0)
        report[slug] = ('OK', f'{path} ({w}x{h}, {len(data)//1024}KB) -> {dest}')
    else:
        report[slug] = ('MISS', 'no icon found')

for slug, (st, info) in report.items():
    print(f'{st:4} {slug:16} {info}')
