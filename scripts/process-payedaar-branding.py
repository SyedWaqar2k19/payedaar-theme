"""Rebuild sharp Payedaar logos — preserve dark wordmark (do NOT punch near-black to transparent)."""
from PIL import Image
import os

src = r"e:\Projects\shopify-store\payedaar-shopify-theme\store-assets-dump\store-logo-without-background-icon+text.png"
out_dir = r"e:\Projects\shopify-store\payedaar-shopify-theme\payedaar\assets"

logo = Image.open(src).convert("RGBA")
bbox = logo.getbbox()
logo = logo.crop(bbox)

# Light padding only
pad = 8
canvas = Image.new("RGBA", (logo.width + pad * 2, logo.height + pad * 2), (0, 0, 0, 0))
canvas.paste(logo, (pad, pad), logo)

# Full-res master for crisp retina (display ~160–200 CSS px → need 600–800+ native)
# Keep near source width for sharpness
master_w = min(canvas.width, 1600)
if canvas.width != master_w:
    master_h = int(canvas.height * (master_w / canvas.width))
    master = canvas.resize((master_w, master_h), Image.Resampling.LANCZOS)
else:
    master = canvas

master_path = os.path.join(out_dir, "logo-payedaar.png")
master.save(master_path, "PNG", optimize=True)
print("logo-payedaar.png", master.size, "aspect", round(master.width / master.height, 4))

# Also write 2x display helper at 800w (optional mid)
mid = master.resize((800, int(master.height * 800 / master.width)), Image.Resampling.LANCZOS)
mid.save(os.path.join(out_dir, "logo-payedaar-800.png"), "PNG", optimize=True)

# Dark-bg: recolor charcoal wordmark/handle to white, keep orange
def to_white_text(img):
    out = img.copy()
    p = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = p[x, y]
            if a < 15:
                continue
            # orange / yellow brand ink — keep
            if r >= 160 and g >= 50 and b <= 130 and r > b + 40:
                continue
            # charcoal / near-black → white (preserve alpha)
            if max(r, g, b) <= 70:
                p[x, y] = (255, 255, 255, a)
    return out


dark = to_white_text(master)
dark.save(os.path.join(out_dir, "logo-payedaar-on-dark.png"), "PNG", optimize=True)
print("logo-payedaar-on-dark.png", dark.size)

# Icon only: left content before wordmark (~32% of width after trim)
icon = master.crop((0, 0, int(master.width * 0.34), master.height))
ib = icon.getbbox()
if ib:
    icon = icon.crop(ib)
side = max(icon.size) + 24
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(icon, ((side - icon.width) // 2, (side - icon.height) // 2), icon)
sq.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(out_dir, "icon-payedaar.png"), "PNG", optimize=True)

# Favicon: orange tile + white silhouette from icon alpha
from PIL import ImageDraw

fav = Image.new("RGBA", (180, 180), (0, 0, 0, 0))
draw = ImageDraw.Draw(fav)
draw.rounded_rectangle([0, 0, 179, 179], radius=36, fill=(241, 122, 1, 255))
ic = Image.open(os.path.join(out_dir, "icon-payedaar.png")).convert("RGBA").resize((112, 112), Image.Resampling.LANCZOS)
white = Image.new("RGBA", ic.size, (255, 255, 255, 0))
ip, wp = ic.load(), white.load()
for y in range(ic.height):
    for x in range(ic.width):
        r, g, b, a = ip[x, y]
        if a > 40:
            wp[x, y] = (255, 255, 255, min(255, a + 40))
fav.alpha_composite(white, ((180 - 112) // 2, (180 - 112) // 2))
fav.save(os.path.join(out_dir, "favicon-payedaar.png"), "PNG", optimize=True)
fav.resize((180, 180)).save(os.path.join(out_dir, "apple-touch-icon-payedaar.png"), "PNG", optimize=True)
print("done")
