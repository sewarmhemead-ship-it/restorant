"""Remove white backgrounds via edge flood-fill (preserves isolated white regions like cheese)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(r"C:\Users\sewar\.cursor\projects\c-Users-sewar-Desktop-pizza\assets")
OUT = ROOT / "public" / "assets"

SOURCES = [
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG1-7df9f0f0-f02e-4519-ad08-82750f52793e.png",
        "manakish-top.png",
        {"brightness_min": 238, "sat_max": 0.14, "blur": 0.4},
    ),
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG1.CedX._vF5dkR-5b654a78-4af7-4d92-be72-4b5e3d7249d6.png",
        "filling.png",
        {"brightness_min": 248, "sat_max": 0.06, "blur": 0.4},  # stricter — keep cheese cubes
    ),
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG2-ac396a59-769b-47b7-8910-87bde3170644.png",
        "manakish-bottom.png",
        {"brightness_min": 252, "sat_max": 0.05, "blur": 0},
    ),
    # Filling variants — Muhammara, Lahm bi Ajeen, Labneh
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG4-bf59fca1-41e5-4af7-a611-4d45718ed34b.png",
        "filling-muhammara.png",
        {"brightness_min": 240, "sat_max": 0.12, "blur": 0.4},
    ),
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG4__1_-12cfe7d3-5bbd-4306-98e0-92cfa658f13d.png",
        "filling-lahm.png",
        {"brightness_min": 242, "sat_max": 0.10, "blur": 0.4},
    ),
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG3-a0cf79ca-bfd0-419f-ada9-38c319fb4252.png",
        "filling-labneh.png",
        {"brightness_min": 248, "sat_max": 0.06, "blur": 0.4},
    ),
    (
        "c__Users_sewar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_OIG1-b36c1146-28ff-4a9a-af8c-d4b65728aff2.png",
        "filling-zaatar.png",
        {"brightness_min": 248, "sat_max": 0.08, "blur": 0.4},
    ),
]


def pixel_stats(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    brightness = (r.astype(np.float32) + g + b) / 3.0
    mx = np.maximum(np.maximum(r, g), b).astype(np.float32)
    mn = np.minimum(np.minimum(r, g), b).astype(np.float32)
    saturation = np.where(mx > 0, (mx - mn) / mx, 0.0)
    return brightness, saturation


def is_background_pixel(
    rgb: np.ndarray, brightness_min: float, sat_max: float
) -> bool:
    r, g, b = float(rgb[0]), float(rgb[1]), float(rgb[2])
    brightness = (r + g + b) / 3.0
    mx, mn = max(r, g, b), min(r, g, b)
    saturation = (mx - mn) / mx if mx > 0 else 0.0
    return brightness >= brightness_min and saturation <= sat_max


def flood_remove_background(
    img: Image.Image, brightness_min: float, sat_max: float
) -> Image.Image:
    rgba = img.convert("RGBA")
    data = np.array(rgba)
    rgb = data[..., :3]
    h, w = rgb.shape[:2]

    removable = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        queue.append((0, x))
        queue.append((h - 1, x))
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w - 1))

    while queue:
        y, x = queue.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        visited[y, x] = True
        if not is_background_pixel(rgb[y, x], brightness_min, sat_max):
            continue
        removable[y, x] = True
        queue.extend([(y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)])

    alpha = data[..., 3].astype(np.float32)
    alpha[removable] = 0

    # Soft edge: fade pixels near removed background
    brightness, saturation = pixel_stats(rgb)
    edge_mask = (~removable) & (brightness > brightness_min - 18) & (saturation < sat_max + 0.08)
    fade = np.clip((brightness - (brightness_min - 22)) / 24.0, 0, 1)
    fade = 1.0 - fade
    alpha[edge_mask] = np.minimum(alpha[edge_mask], fade[edge_mask] * 255.0)

    data[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(data, "RGBA")


def trim_and_square(img: Image.Image, padding_ratio: float = 0.06) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    cropped = img.crop(bbox)
    cw, ch = cropped.size
    side = int(max(cw, ch) * (1 + padding_ratio * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - cw) // 2
    oy = (side - ch) // 2
    canvas.paste(cropped, (ox, oy), cropped)
    return canvas


def process_one(src_name: str, out_name: str, opts: dict) -> None:
    src = SRC / src_name
    out = OUT / out_name
    out.parent.mkdir(parents=True, exist_ok=True)

    img = Image.open(src)
    cut = flood_remove_background(img, opts["brightness_min"], opts["sat_max"])
    blur = opts.get("blur", 0.4)
    if blur:
        cut = cut.filter(ImageFilter.GaussianBlur(radius=blur))
    final = trim_and_square(cut)
    final.save(out, "PNG", optimize=True)
    print(f"OK  {out_name}  ({final.size[0]}x{final.size[1]})")


def main() -> None:
    for src_name, out_name, opts in SOURCES:
        process_one(src_name, out_name, opts)


if __name__ == "__main__":
    main()
