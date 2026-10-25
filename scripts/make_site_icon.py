#!/usr/bin/env python3
"""Build premium DRS site icon set from AI-generated art (icon-art-b.png).
Outputs: icon-512/192, maskable-512, apple-touch-icon(180), favicon-32 into public/."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = "/home/z/my-project"
SRC = os.path.join(ROOT, "download", "icon-art-b.png")
PUB = os.path.join(ROOT, "public")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

art = Image.open(SRC).convert("RGB")
W, H = art.size  # 1024

# ---- 1) locate the rounded-square artwork inside the dark surround ----
corner = art.getpixel((8, 8))
def bright(px):
    return (px[0] + px[1] + px[2]) / 3
def row_span(y):
    xs = [x for x in range(W) if bright(art.getpixel((x, y))) > bright(corner) + 28]
    return (min(xs), max(xs)) if xs else (0, W - 1)
def col_span(x):
    ys = [y for y in range(H) if bright(art.getpixel((x, y))) > bright(corner) + 28]
    return (min(ys), max(ys)) if ys else (0, H - 1)

l, r = row_span(H // 2)
t, b = col_span(W // 2)
# squareify around center
cx, cy = (l + r) // 2, (t + b) // 2
side = min(r - l, b - t)
half = side // 2
crop = art.crop((cx - half, cy - half, cx + half, cy + half))
side = crop.size[0]
print(f"crop bounds l={l} r={r} t={t} b={b} -> side={side}")

navy = corner  # surround color for full-bleed variants
print(f"navy sample: {navy}")

SS = 4  # supersampling for mask/overlays

def rounded(img, radius_ratio=0.225):
    """Apply anti-aliased rounded corners -> RGBA with transparent corners."""
    s = img.size[0]
    mask = Image.new("L", (s * SS, s * SS), 0)
    d = ImageDraw.Draw(mask)
    rad = int(s * radius_ratio) * SS
    d.rounded_rectangle([0, 0, s * SS - 1, s * SS - 1], radius=rad, fill=255)
    mask = mask.resize((s, s), Image.LANCZOS)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out

# ---- 2) overlay: bold white D + halo dot (drawn crisp, brand-identical) ----
def draw_brand(img):
    s = img.size[0]
    hi = img.resize((s * SS, s * SS), Image.LANCZOS)
    d = ImageDraw.Draw(hi)
    # letter D — centered slightly left/below like the current brand icon
    fsize = int(s * 0.56) * SS
    font = ImageFont.truetype(FONT, fsize)
    txt = "D"
    bb = d.textbbox((0, 0), txt, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx = int(s * 0.44) * SS - tw // 2 - bb[0]
    ty = int(s * 0.55) * SS - th // 2 - bb[1]
    # soft drop shadow for depth
    sh = Image.new("L", hi.size, 0)
    ds = ImageDraw.Draw(sh)
    ds.text((tx + 4 * SS, ty + 6 * SS), txt, font=font, fill=160)
    sh = sh.filter(ImageFilter.GaussianBlur(6 * SS))
    black = Image.new("RGBA", hi.size, (10, 10, 40, 255))
    hi.paste(black, (0, 0), sh)
    d = ImageDraw.Draw(hi)
    d.text((tx, ty), txt, font=font, fill=(255, 255, 255, 255))
    # halo dot top-right (brand signature: update dot)
    dx, dy = int(s * 0.735) * SS, int(s * 0.235) * SS
    r_out = int(s * 0.105) * SS
    halo = Image.new("RGBA", hi.size, (0, 0, 0, 0))
    dh = ImageDraw.Draw(halo)
    dh.ellipse([dx - r_out, dy - r_out, dx + r_out, dy + r_out],
               fill=(255, 255, 255, 95))
    halo = halo.filter(ImageFilter.GaussianBlur(int(s * 0.02) * SS))
    hi = Image.alpha_composite(hi.convert("RGBA"), halo)
    d = ImageDraw.Draw(hi)
    r_dot = int(s * 0.058) * SS
    d.ellipse([dx - r_dot, dy - r_dot, dx + r_dot, dy + r_dot],
              fill=(255, 255, 255, 255))
    return rounded(hi.resize((s, s), Image.LANCZOS))

branded = draw_brand(crop)

# ---- 3) exports ----
# rounded transparent icons (browser/PWA "any")
for size, name in [(512, "icon-512.png"), (192, "icon-192.png"), (32, "favicon-32.png")]:
    branded.resize((size, size), Image.LANCZOS).save(os.path.join(PUB, name))
    print(f"wrote {name}")

# full-bleed square on brand navy (maskable + apple-touch: launchers/apple crop edges)
def full_bleed(art_rgba, size, art_ratio=0.94):
    canvas = Image.new("RGBA", (size, size), (*navy, 255))
    inner = int(size * art_ratio)
    a = art_rgba.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(a, (off, off), a)
    return canvas.convert("RGB")

full_bleed(branded, 512).save(os.path.join(PUB, "maskable-512.png"))
full_bleed(branded, 180).save(os.path.join(PUB, "apple-touch-icon.png"))
print("wrote maskable-512.png, apple-touch-icon.png")

# user preview
branded.resize((512, 512), Image.LANCZOS).save(os.path.join(ROOT, "download", "drs-icon-new.png"))
print("preview: download/drs-icon-new.png")
