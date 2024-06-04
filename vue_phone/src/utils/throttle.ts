function throttle<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let inThrottle: boolean, lastFunc: number, lastRan: number;
  return function(this: any, ...args: Parameters<F>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(() => {
        if (Date.now() - lastRan >= wait) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastRan), 0));
    }
  };
}
export { throttle };