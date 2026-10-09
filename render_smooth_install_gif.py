import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FRAMES_DIR = r"E:\programming\digikala-pure-search\assets\frames"
OUTPUT_GIF = r"E:\programming\digikala-pure-search\assets\install.gif"

def ease_in_out(t):
    return t * t * (3 - 2 * t)

def draw_cursor(img_np, pos, clicked=False):
    x, y = int(pos[0]), int(pos[1])
    h, w = img_np.shape[:2]
    # Draw a clean modern cursor pointer
    cursor_pts = np.array([
        [x, y],
        [x, y + 24],
        [x + 6, y + 19],
        [x + 12, y + 28],
        [x + 16, y + 26],
        [x + 10, y + 17],
        [x + 18, y + 17]
    ], np.int32)
    
    overlay = img_np.copy()
    if clicked:
        # Draw a subtle click ripple
        cv2.circle(overlay, (x, y), 16, (0, 160, 255), 2, cv2.LINE_AA)
        cv2.circle(overlay, (x, y), 8, (0, 200, 255), -1, cv2.LINE_AA)
        cv2.addWeighted(overlay, 0.6, img_np, 0.4, 0, img_np)

    cv2.fillPoly(img_np, [cursor_pts], (255, 255, 255), cv2.LINE_AA)
    cv2.polylines(img_np, [cursor_pts], True, (20, 20, 20), 2, cv2.LINE_AA)
    return img_np

def crop_and_scale(img_np, target_box, zoom_factor, target_size=(1000, 625)):
    # target_box: (cx, cy)
    # zoom_factor: 1.0 (no zoom) to e.g. 2.2 (high zoom)
    h, w = img_np.shape[:2]
    cx, cy = target_box
    
    # Calculate crop width and height
    crop_w = int(w / zoom_factor)
    crop_h = int(h / zoom_factor)
    
    x1 = max(0, min(w - crop_w, int(cx - crop_w / 2)))
    y1 = max(0, min(h - crop_h, int(cy - crop_h / 2)))
    x2 = x1 + crop_w
    y2 = y1 + crop_h
    
    cropped = img_np[y1:y2, x1:x2]
    scaled = cv2.resize(cropped, target_size, interpolation=cv2.INTER_LANCZOS4)
    return scaled

def add_header_banner(frame_bgr, text_fa, step_num=1):
    # Add a clean modern step badge at the bottom
    h, w = frame_bgr.shape[:2]
    overlay = frame_bgr.copy()
    
    # Bottom banner bar
    bar_h = 56
    cv2.rectangle(overlay, (0, h - bar_h), (w, h), (15, 23, 42), -1)
    cv2.addWeighted(overlay, 0.9, frame_bgr, 0.1, 0, frame_bgr)
    
    # Draw border line
    cv2.line(frame_bgr, (0, h - bar_h), (w, h - bar_h), (56, 189, 248), 2)
    
    # Convert to PIL to draw text nicely
    img_pil = Image.fromarray(cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(img_pil)
    
    try:
        font = ImageFont.truetype("arial.ttf", 20)
        bold_font = ImageFont.truetype("arialbd.ttf", 22)
    except:
        font = ImageFont.load_default()
        bold_font = font

    # Draw step text
    step_str = f"STEP {step_num}"
    draw.rectangle([(20, h - 44), (110, h - 12)], fill=(14, 165, 233))
    draw.text((28, h - 40), step_str, fill=(255, 255, 255), font=bold_font)
    draw.text((125, h - 38), text_fa, fill=(241, 245, 249), font=font)
    
    return cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

def render_gif():
    print("[*] Loading captured stage images...")
    stage1 = cv2.imread(os.path.join(FRAMES_DIR, "stage1_clean_off.png"))
    stage2 = cv2.imread(os.path.join(FRAMES_DIR, "stage2_dev_on_toolbar.png"))
    stage3 = cv2.imread(os.path.join(FRAMES_DIR, "stage3_card_loaded.png"))
    stage4 = cv2.imread(os.path.join(FRAMES_DIR, "stage4_digikala_clean.png"))
    popup = cv2.imread(os.path.join(FRAMES_DIR, "popup_preview.png"))

    # Stage 5: Composite popup onto stage 4
    s4_h, s4_w = stage4.shape[:2]
    stage5 = stage4.copy()
    ph, pw = popup.shape[:2]
    # Place popup in top right
    px = s4_w - pw - 40
    py = 40
    stage5[py:py+ph, px:px+pw] = popup
    # Add border and shadow effect around popup
    cv2.rectangle(stage5, (px-2, py-2), (px+pw+2, py+ph+2), (56, 189, 248), 2)

    frames = []
    FPS = 15
    TARGET_SIZE = (960, 600)

    # Coordinates in 1280x800 base images:
    # DevMode toggle: around x=1230, y=36
    # Load Unpacked button: around x=85, y=105
    # Extension Card: around x=520, y=370

    # -------------------------------------------------------------
    # SCENE 1: Overview & Zoom in to Developer Mode (Top Right)
    # -------------------------------------------------------------
    print("[*] Rendering Scene 1: Toggle Developer Mode ON...")
    # Static overview (1.0 sec)
    for _ in range(int(FPS * 0.8)):
        frame = crop_and_scale(stage1, (640, 400), 1.0, TARGET_SIZE)
        frame = add_header_banner(frame, "1. Open chrome://extensions & Turn ON Developer mode", 1)
        frames.append(frame)

    # Zoom in to (1220, 36) over 12 frames
    zoom_frames = 12
    for i in range(zoom_frames):
        t = ease_in_out((i + 1) / zoom_frames)
        zf = 1.0 + (1.9 - 1.0) * t
        # Interpolate center toward dev toggle
        cx = 640 + (1160 - 640) * t
        cy = 400 + (60 - 400) * t
        frame = crop_and_scale(stage1, (cx, cy), zf, TARGET_SIZE)
        # Cursor moves in
        cursor_pos = (TARGET_SIZE[0] - 120 + 40 * t, 50 + 20 * t)
        draw_cursor(frame, cursor_pos)
        frame = add_header_banner(frame, "1. Turn ON Developer mode (Top Right)", 1)
        frames.append(frame)

    # Click toggle (flash and toggle on)
    click_pos = (TARGET_SIZE[0] - 80, 70)
    for _ in range(4):
        frame = crop_and_scale(stage1, (1160, 60), 1.9, TARGET_SIZE)
        draw_cursor(frame, click_pos, clicked=True)
        frame = add_header_banner(frame, "1. Developer mode toggled ON!", 1)
        frames.append(frame)

    # Show dev toggle ON zoomed in (0.8 sec)
    for _ in range(int(FPS * 0.8)):
        frame = crop_and_scale(stage2, (1160, 60), 1.9, TARGET_SIZE)
        draw_cursor(frame, (click_pos[0] + 10, click_pos[1] + 15))
        frame = add_header_banner(frame, "Developer mode is now Active", 1)
        frames.append(frame)

    # -------------------------------------------------------------
    # SCENE 2: Pan & Zoom to 'Load unpacked' Button (Top Left)
    # -------------------------------------------------------------
    print("[*] Rendering Scene 2: Click Load Unpacked...")
    pan_frames = 14
    for i in range(pan_frames):
        t = ease_in_out((i + 1) / pan_frames)
        cx = 1160 - (1160 - 150) * t
        cy = 60 + (105 - 60) * t
        zf = 1.9 - 0.2 * t
        frame = crop_and_scale(stage2, (cx, cy), zf, TARGET_SIZE)
        frame = add_header_banner(frame, "2. Click 'Load unpacked' button", 2)
        frames.append(frame)

    # Hold on 'Load unpacked' with cursor hovering
    btn_click_pos = (120, 115)
    for i in range(8):
        frame = crop_and_scale(stage2, (150, 105), 1.7, TARGET_SIZE)
        draw_cursor(frame, (btn_click_pos[0] + (7 - i), btn_click_pos[1]))
        frame = add_header_banner(frame, "2. Click 'Load unpacked'", 2)
        frames.append(frame)

    # Click on 'Load unpacked'
    for _ in range(4):
        frame = crop_and_scale(stage2, (150, 105), 1.7, TARGET_SIZE)
        draw_cursor(frame, btn_click_pos, clicked=True)
        frame = add_header_banner(frame, "2. Select 'extension' folder", 2)
        frames.append(frame)

    # -------------------------------------------------------------
    # SCENE 3: Zoom Out to Extension Card Loaded
    # -------------------------------------------------------------
    print("[*] Rendering Scene 3: Digikala Pure Search Card Loaded...")
    card_zoom_frames = 14
    for i in range(card_zoom_frames):
        t = ease_in_out((i + 1) / card_zoom_frames)
        cx = 150 + (500 - 150) * t
        cy = 105 + (380 - 105) * t
        zf = 1.7 - 0.3 * t
        frame = crop_and_scale(stage3, (cx, cy), zf, TARGET_SIZE)
        frame = add_header_banner(frame, "3. Extension Loaded: Digikala Pure Search v2.0.0", 3)
        frames.append(frame)

    # High focus on the Card (1.6 sec)
    for _ in range(int(FPS * 1.6)):
        frame = crop_and_scale(stage3, (500, 380), 1.4, TARGET_SIZE)
        frame = add_header_banner(frame, "3. Digikala Pure Search is now Installed & Active!", 3)
        frames.append(frame)

    # -------------------------------------------------------------
    # SCENE 4: Testing on Digikala Live Page & Popup Results
    # -------------------------------------------------------------
    print("[*] Rendering Scene 4: Digikala Live Result & Popup...")
    # Transition to live page (zoom out to full view of digikala clean results)
    trans_frames = 10
    for i in range(trans_frames):
        t = ease_in_out((i + 1) / trans_frames)
        alpha = t
        f_card = crop_and_scale(stage3, (640, 400), 1.0, TARGET_SIZE)
        f_digi = crop_and_scale(stage4, (640, 400), 1.0, TARGET_SIZE)
        frame = cv2.addWeighted(f_digi, alpha, f_card, 1.0 - alpha, 0)
        frame = add_header_banner(frame, "4. Open Digikala: All Sponsored Ads Automatically Removed!", 4)
        frames.append(frame)

    # Digikala clean page hold (1.0 sec)
    for _ in range(int(FPS * 1.0)):
        frame = crop_and_scale(stage4, (640, 400), 1.0, TARGET_SIZE)
        frame = add_header_banner(frame, "4. 100% Organic Results — Zero Sponsored Ads", 4)
        frames.append(frame)

    # Show Extension Popup Dashboard (1.8 sec)
    for _ in range(int(FPS * 1.8)):
        frame = crop_and_scale(stage5, (640, 400), 1.0, TARGET_SIZE)
        frame = add_header_banner(frame, "5. Pure Search Panel: 14 Ads Blocked in Real-Time!", 5)
        frames.append(frame)

    print(f"[*] Total frames generated: {len(frames)}")
    print("[*] Converting frames to optimized GIF via Pillow...")

    pil_images = [
        Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB)).quantize(
            colors=128, method=Image.Resampling.LANCZOS
        )
        for f in frames
    ]

    pil_images[0].save(
        OUTPUT_GIF,
        save_all=True,
        append_images=pil_images[1:],
        duration=int(1000 / FPS),
        loop=0,
        optimize=True
    )
    print(f"[SUCCESS] GIF created successfully at: {OUTPUT_GIF}")
    print(f"File size: {os.path.getsize(OUTPUT_GIF) / 1024:.1f} KB")

if __name__ == "__main__":
    render_gif()
