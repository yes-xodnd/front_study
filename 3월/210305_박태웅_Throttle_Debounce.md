# 2021.03.03 Throttling & Debouncing



``` js
export function createDebouncer(t = 200) {
  let timer;

  return (action, beforeAction) => {
    if (timer) clearTimeout(timer);
    if (beforeAction) beforeAction();
    timer = setTimeout(() => action(), t);
  }
}


export function createThrottler(t = 2000) {
  let timer;
  
  return (action) => {
    if (!timer) {
      timer = setTimeout(() => {
        action();
        timer = null;
      }, t);
    } else {
      console.log('busy now');
    }
  }
}
```

