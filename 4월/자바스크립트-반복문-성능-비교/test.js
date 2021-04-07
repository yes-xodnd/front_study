export default pipe(
  batchTest,
  sortByTime,
  addMultiplier
);


function pipe(...fns) {
  return arg => fns.reduce((result, fn) => fn(result), arg);
}

function batchTest({ fns, L, N }) {
  return fns.map(fn => test(fn, L, N));
}

function sortByTime(arr) {
  return arr.sort((a, b) => a.time - b.time);
}

function addMultiplier(arr) {
  const t = arr[0].time;
  return arr.map(item => (
    { 
      ...item,
      M: (item.time/t).toFixed(2)
    }
  )); 
}

function test(fn, L, N) {
  const name = fn.name;
  const _time = measurePerfTimeMean(fn, L, N);
  const time = (_time * 1000).toFixed(2);
  return { name, time }
}


function measurePerfTimeMean(fn, L, N) {
  let sum = 0;
  for (let i = 0; i < N; i++) {
    sum += measurePerfTime(fn, L);
  }
  return sum / N;
}

function measurePerfTime(fn, L) {
  const arr = getRandomArr(L);
  const t0 = performance.now();
  fn(arr);
  const t1 = performance.now();
  return (t1 - t0);
}

function getRandomArr(L) {
  Math.random();
  return Array(L).fill(0).map(_ => getRandomInt(1, 100));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
