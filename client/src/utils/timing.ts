export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ): ((...args: Parameters<F>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<F>): void => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  };
  
  export const formatTime = (milliseconds: number): string => {
    if (milliseconds < 1) {
      return `${(milliseconds * 1000).toFixed(2)} μs`;
    }
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)} ms`;
    }
    return `${(milliseconds / 1000).toFixed(2)} s`;
  };