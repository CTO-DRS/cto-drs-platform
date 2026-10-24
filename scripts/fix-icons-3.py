#!/usr/bin/env python3
"""إعادة استخراج مدروسة لثلاثة تطبيقات: استثناء أصول المكتبات، تفضيل الأسماء المعماة
وأحجام المشغّل القياسية، وتخطي الملفات غير القابلة للفك."""
import io, os, zipfile, tempfile, urllib.request, shutil
from PIL import Image

apps = {
    'securenet-vpn': 'https://github.com/CTO-DRS/SecureNetVPN/releases/download/v1.0.0/SecureNetVPN-debug-v1.0.0.apk',
    'novafiles':     'https://github.com/CTO-DRS/NovaFiles/releases/download/v0.40.0/NovaFiles_v0.40.0_iOS_debug.apk',
    'lumina-studio': 'https://github.com/CTO-DRS/Lumina-Studio/releases/download/v1.1.0/LuminaStudio-v1.1.0-debug.apk',
}
OUT = 'public/apps-icons'
LIB_PREFIXES = ('abc_', 'mtrl_', 'exo_', 'design_', 'notification_', 'ic_call_', 'btn_',
                'core_', 'material_', 'test_', 'browser_', 'media', 'tooltip', 'm3_',
                'android_', 'platform_', 'support_')
LAUNCHER_SIZES = {192, 144, 108, 96, 48, 512}

def candidates(zf):
    found = []
    for info in zf.infolist():
        n = info.filename
        low = n.lower()
        if not low.startswith('res/') or not low.endswith(('.png', '.webp')) or low.endswith('.9.png'):
            continue
        base = low.rsplit('/', 1)[-1]
        try:
            data = zf.read(info)
        except Exception:
            continue
        try:
            im = Image.open(io.BytesIO(data)); im.load()
        except Exception:
            continue  # ملف تالف — تخطَّ
        w, h = im.size
        if w != h or not (48 <= w <= 512):
            continue
        is_lib = base.startswith(LIB_PREFIXES)
        is_launcher_named = 'ic_launcher' in base
        obfuscated = len(base.rsplit('.', 1)[0]) <= 4 and '_' not in base.rsplit('.', 1)[0]
        size_pref = 0 if w in LAUNCHER_SIZES else 1
        rank = (
            0 if is_launcher_named else 1 if obfuscated and not is_lib else 2 if not is_lib else 3,
            size_pref, -w,
        )
        found.append((rank, n, data))
    found.sort(key=lambda x: x[0])
    return found

for slug, url in apps.items():
    dest = f'{OUT}/{slug}.png'
    try:
        tmp = tempfile.NamedTemporaryFile(suffix='.apk', delete=False)
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'cto-drs-store'}), timeout=300) as r, open(tmp.name, 'wb') as f:
            shutil.copyfileobj(r, f, 1024 * 512)
        with zipfile.ZipFile(tmp.name) as zf:
            cands = candidates(zf)
        os.unlink(tmp.name)
        if not cands:
            print(f'MISS {slug}: لا مرشحين صالحين'); continue
        rank, name, data = cands[0]
        im = Image.open(io.BytesIO(data)); im.load()
        if im.mode not in ('RGBA', 'RGB'): im = im.convert('RGBA')
        if im.size[0] > 192: im = im.resize((192, 192), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'PNG')
        with open(dest, 'wb') as f: f.write(buf.getvalue())
        print(f'OK   {slug:15} {name} ({im.size[0]}x{im.size[1]}) rank={rank}')
        for r2, n2, _ in cands[1:4]:
            print(f'      بديل: {n2} rank={r2}')
    except Exception as e:
        print(f'ERR  {slug}: {type(e).__name__} {e}')
