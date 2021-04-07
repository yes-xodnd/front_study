export default [
  sumForLoop1,
  sumForLoop2,
  sumWhile,
  sumForOf,
  sumForIn,
  sumForEach,
  sumReduce,
];

function sumForLoop1(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}

function sumForLoop2(arr) {
  const N = arr.length;
  let result = 0;

  for (let i = 0; i < N; i++) {
    result += arr[i];
  }
  return result;
}

function sumWhile(arr) {
  const N = arr.length;
  let result = 0;
  let i = 0;
  
  while (i < N) {
    result += arr[i];
    i += 1;
  }
  return result;
}

function sumForOf(arr) {
  let result = 0;

  for (let item of arr) {
    result += item;
  }
  return result;
}

function sumForIn(arr) {
  let result = 0;

  for (let i in arr) {
    result += arr[i];
  }
  return result;
}

function sumForEach(arr) {
  let result = 0;
  arr.forEach(n => result += n);
  return result;
}

function sumReduce(arr) {
  return arr.reduce((result, n) => result + n, 0); 
}