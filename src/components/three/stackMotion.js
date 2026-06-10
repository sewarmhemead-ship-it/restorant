/**
 * حالة حركة مشتركة بين GSAP ScrollTrigger (يكتب) و React Three Fiber (يقرأ كل إطار).
 * كائن عادي قابل للـ tween — بلا setState، بلا re-render، بلا فقدان إطارات.
 */
export const stackMotion = {
  /** تكبير المجموعة كلها (فصل Discover → 1.16) */
  scale: 1,
  /** رفع المجموعة عمودياً (وحدات مشهد) */
  lift: 0,
  /** انفصال الطبقات 0..1 (Exploded view) */
  explode: 0,
  /** تفكك حشوة السلطة إلى مكونات منفردة 0..1 */
  ingredients: 0,
  /** دنوّ الكاميرا (dolly) */
  zoom: 0,
  /** ميلان عرضي خفيف للستاك في فصل Create */
  tilt: 0,
}

/** مؤشر الماوس المنعَّم — يكتبه مستمع window، يقرأه rig الكاميرا */
export const pointerState = { x: 0, y: 0 }
