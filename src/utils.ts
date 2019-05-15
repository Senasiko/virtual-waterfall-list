export const throttle = function (func: Function, wait: number) {
  var timer: number;
  var last: number = new Date().getTime();
  var currArgs: any[] = [];

  return function throttled(...args: any[]) {
    var curr = new Date().getTime();
    currArgs = args;
    var run = () => {
      clearTimeout(timer);
      timer = 0;
      func.apply(this, currArgs);
      last = new Date().getTime();
    }
    if (curr - last > wait) {
      run();
    } else if (!timer) {
      timer = window.setTimeout(run, wait);
    }
  }
}
