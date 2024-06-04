// 在 global.d.ts 或其他 .d.ts 文件中
interface Screen {
  deviceXDPI?: number;
  logicalXDPI?: number;
}

export const detectZoom = (): number => {
  let ratio = 0;
  const screen = window.screen;
  const ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }

  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  
  return ratio;
};
