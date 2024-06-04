function debounce<F extends (...args: any[]) => any>(fn: F, delay: number): (...args: Parameters<F>) => void {
  let timeoutId: number | null = null;
  return function(...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
export { debounce };