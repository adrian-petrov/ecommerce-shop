export default function throttle<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) {
  let timeout: number;
  let startTime = _now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - _now();

      if (timeout) clearTimeout(timeout);

      if (startTime + waitFor <= _now()) {
        _resetStartTime();
        resolve(func(...args));
      } else {
        timeout = window.setTimeout(() => {
          _resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });

  function _now(): number {
    return Date.now();
  }

  function _resetStartTime(): void {
    startTime = _now();
  }
}
