# 5. Promise

- Promise
- 3가지 State
- Promise Chaining



## 1.  Promise

- 서버에서 받아온 데이터를 화면에 표시

```js
function getData(callbackFunc) {
    $.get('https://abcde.com/data/1', function(response) {
        callbackFunc(response);
    })
}

getData(function(data) {
    console.log(data)
})
```

```js
function getData(callback) {
  // new Promise() 추가
  return new Promise(function(resolve, reject) {
    $.get('https://abcde.com/data/1', function(response) {
      // 데이터를 받으면 resolve() 호출
      resolve(response);
    });
  });
}

// getData()의 실행이 끝나면 호출되는 then()
getData().then(function(data) {
    // resolve()의 결과 값이 여기로 전달
    console.log(data)
})
```



## 2. 프로미스의 3가지 상태

- 프로미스의 처리 과정

### Pending(대기)

- 비동기 처리 로직이 아직 완료되지 않은 상태

```js
new Promise(function(resolve, reject) {
	//...
}
```

- new Promise() 메서드를 호출할 때 콜백함수 선언 가능
- resolve, reject : 콜백함수의 인자



### Fulfilled(이행)

- 비동기 처리가 완료되어 프로미스가 결과값을 반환해준 상태

```js
new Promise(function(resolve, reject) {
	resolve();
}
```

- then()을 이용해서 결과값을 받을 수 있음.



### Rejected(실패)

- 비동기 처리가 실패하거나 오류가 발생한 상태

```js
new Promise(function(resolve, reject) {
  reject();
});
```

- catch()로 실패 처리의 결과값을 받을 수 있음.



## 2. Promise Chaining

- 여러개의 프로미스를 연결해서 사용할 수 있음.

```js
function getData() {
  return new Promise({
    // ...
  });
}

// then() 으로 여러 개의 프로미스를 연결한 형식
getData()
  .then(function(data) {
    // ...
  })
  .then(function() {
    // ...
  })
  .then(function() {
    // ...
  });
```

- 예시 : 사용자 로그인 인증

```js
getData(userInfo)
  .then(parseValue)
  .then(auth)
  .then(diaplay);
```

```js
var userInfo = {
  id: 'test@abc.com',
  pw: '****'
};

function parseValue() {
  return new Promise({
    // ...
  });
}
function auth() {
  return new Promise({
    // ...
  });
}
function display() {
  return new Promise({
    // ...
  });
}
```

