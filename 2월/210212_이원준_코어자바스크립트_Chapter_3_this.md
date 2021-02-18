# Chapter 3: this



### 1. 상황에 따라 달라지는 this

- this는 실행 컨텍스트가 생성될 때 결정 됩니다.
- 실행 컨텍스트가 생성되는 경우는 함수를 호출하는 경우 이므로 this는 함수를 호출할 때 결정됩니다.



##### 1 - 1. 전역 공간에서의 this

> this === window, this === global

- JavaScript 는 변수를 선언하면 특정 객체의 프로퍼티로 할당합니다.

  ```javascript
  var a = 1;
  window.b = 2;
  console.log(a, window.a, this.a); // 1 1 1
  console.log(b, window.b, this.b); // 2 2 2
  
  window.a = 3;
  b = 4
  console.log(a, window.a, this.a); // 3 3 3 
  console.log(b, window.b, this.b); // 4 4 4
  ```
  
  ```javascript
    var a = 1;
    delete window.a; // false
    console.log(a, window.a, this.a); // 1 1 1
    
    var b = 2;
    delete b;  // false
    console.log(b, window.b, this.b); // 2 2 2
    
    window.c = 3;
    delete window.c; // true
    console.log(c, window.c, this.c); // Uncaught ReferenceError: c is not defined
    
    window.d = 4;
    delete d; // true
    console.log(d, window.d, this.d); // Uncaught ReferenceError: d is not defined
  ```



##### 1 - 2. 메서드로서 호출할 때 그 메서드 내부에서의 this

> this === 호출한 주체입니다.

- **`.`** 을 통해 호출한 주체가 this가 됩니다

  ```javascript
  var obj = {
      method: function () { console.log(this); }
  };
  obj.method(); // this === obj
  ```



##### 1 - 3. 함수로서 호출할 때 그 함수 내부에서의 this

> this === window 입니다.

- 함수 내부에서의 this

  어떤 함수를 함수로서 호출할 경우 this가 지정되지 않습니다.
  함수로서 호출하는 경우 호출 주체를 명시하지 않고 개발자가 직접 관연해서 실행한 것이기 때문입니다.

  

- 메서드의 내부함수에서의 this

  ```javascript
  var obj1 = {
      outer: function () {
          console.log(this);  // obj1
          var innerFunc = function () {
              console.log(this); // 2번: window, 3번: obj2
          }
          innerFunc();  // 2번
          
          var obj2 = {
              innerMethod: innerFunc
          };
          obj2.innerMethod();  // 3번
      }
  };
  obj1.outer();
  ```

  

- 우회 방법

  1. 변수를 추가하는 방법 (ES 6 이전)

     ```javascript
     var obj1 = {
         outer: function () {
             var self = this
             console.log(this);
             var innerFunc = function () {
                 console.log(self); 
             }
             innerFunc();
         }
     };
     obj1.outer();
     ```

  2. 화살표 함수를 이용하는 방법(ES 6 이후)

     ```javascript
     // 화살표 함수의 경우 실행 컨텍스트 생성시 this바인딩 과정 자체가 없기 때문에 상위 스코프의 this를 그대로 활용 가능합니다. 
     var obj1 = {
         outer: function () {
             console.log(this);
             var innerFunc = () => {
                 console.log(this);
             };
             innerFunc();
         }
     };
     obj1.outer();
     ```



##### 1 - 4. 콜백 함수 호출 시 그 함수 내부에서의 this

> 기본적으로 this === widow, 제어권을 가진 함수의 내부로직의 상황에 따라 달라짐

```javascript
setTimeout(function () { console.log(this); }, 300);
// this === window

[1, 2, 3, 4, 5].forEach(function (x) {
    console.log(this, x);
    // this === window
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a')
	.addEventListener('click', function (e) {
    	console.log(this, e); // this === button Element
    // addEventLister는 콜백 함수를 호출할 때 자신의 this를 상속하도록 정의돼 있기 때문입니다.
});
```



##### 1 - 5. 생성자 함수 내부에서의 this

> this === 새로 만들 구체적인 인스턴스 자신

```javascript
var Cat = function (name, age) {
    this.bark = '야옹';
    this.name = name;
    this.age = age;
};

var choco = new Cat('초코', 7); // new이용해서 새로운 객체를 생성
```



### 2. 명시적으로 this를 바인딩하는 방법

##### 2 - 1. call 메서드

> 함수 / 메서드를 실행하며 바인딩 : bind 와의 차이점

```javascript
// Function.prototype.call(thisArg[, arg1[, arg2[, ...]]])

// 함수 실행시 명시적 바인딩
var func = function (a, b, c) {
    console.log(this, a, b, c)
};
func(1, 2, 3);  // Window 1 2 3
func.call({ x: 1 }, 4, 5, 6); // { x: 1 } 4 5 6


// 메서드 실행시 명시적 바인딩
var obj = {
    a: 1,
    method: function (x, y) {
        console.log(this.a, x, y);
    }
};
obj.method(2, 3); // 1 2 3
obj.method.call({ a: 4 }, 5, 6); // 4 5 6
```



##### 2 - 2. apply 메서드

- call 메서드와 기능적으로 완전히 동일하지만 두번째 인자를 배열로 받는 다는 차이가 있습니다.

```javascript
// Function.prototype.apply(thisArg[, argsArray])

// 함수 실행시 바인딩
var func = function (a, b, c) {
    console.log(this, a, b, c);
};
func.apply({x: 1}, [4, 5, 6]); // { x: 1 } 4 5 6

// 메서드 실행시 바인딩
var obj = {
    a: 1,
    method: function (x, y) {
        console.log(this.a, x, y);
    }
};
obj.method.apply({ a: 4 }, [5, 6]); // 4 5 6
```

##### 2 - 3. call / apply 메서드의 활용

1. 유사배열객체 (array-like-object)에 배열 메서드를 적용
   `유사배열객체` : 키가 0 또는 양의 정수인 프로퍼티가 존재하고 length 프로퍼티의 값이 0 또는 양의 정수인 객체

   ```javascript
   var obj = {
       0: 'a',
       1: 'b',
       2: 'c',
       length: 3
   };
   Array.prototype.push.call(obj, 'd');
   // { 0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 }
   
   var arr = Array.prototype.slice.call(obj);
   // [ 'a', 'b', 'c', 'd' ]
   ```

   - 문자열의 경우 length 프로퍼티가 읽기 전용이기 때문에 원본 문자열에 변경을 가하는 메서드(push, pop, shift, unshift, splice 등) 는 에러를 던집니다
   - concat 처럼 대상이 반드시 배열이어야 하는 경우에는 에러는 나지 않지만 제대로된 결과를 얻을 수 없습니다.
   - 이와 같은 방법은 본래의 call / apply 메서드와 의도와는 다른 동떨어진 활용법입니다.
     ES6 에서 Array.form 메서드를 도입했습니다.

2. 생성자 내부에서 다른 생성자를 호출

   ```javascript
   function Person(name, gender) {
       this.name = name;
       this.gender = gender;
   }
   function Student(name, gender, school) {
       Person.call(this, name, gender);
       this.school = school;
   }
   function Employee(name, gender, company) {
       Person.apply(this, [name, gender]);
       this.company = company;
   }
   var kd = new Student('길동', 'male', '도산서원');
   var jn = new Employee('재난', 'female', 'google');
   ```

3. 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때 - apply

   - ES6 환경에서는 spread operator를 사용하는 것이 더욱 간단합니다.



##### 2 - 4. bind 메서드

> ES5에 추가된 기능, call 과 비슷하지만 즉시 호출하지 않고 새로운 함수를 반환하는 메서드

```javascript
// 원본 함수: bind: X
var func = function (a, b, c, d) {
    console.log(this, a, b, c, d);
};
func(1, 2, 3, 4) // window 1 2 3 4

// bind: O, 인수들은 넘기지 않음
var bindFunc1 = func.bind({ x: 1 });
bindFunc1(5, 6, 7, 8); // { x: 1} 5 6 7 8


// bind: O, 인수들도 넘김
var bindFunc2 = func.bind({ x: 1 }, 4, 5);
bindFunc2(6, 7) // { x: 1} 4 5 6 7
```

- bind 메서드를 적용해서 새로 만든 함수는 name 프로퍼티에 bound라는 접두어가 붙게 됩니다. 이런한 특성으로 call 이나 apply보다 코드를 추적하기 더 수월한 면이 있습니다.



##### 2 - 5. 화살표 함수의 예외사항

> 화살표 함수는 실행 컨텍스트를 생성할 때 바인딩 과정이 생략되기 때문에 this에 접근하고자 하면 가장 가까운 this에 접근하게 됩니다.



##### 2 - 6. 별도의 인자로 this를 받는 경우 (콜백 함수 내에서의 this)

1. **`Array.prototype.forEach(callback[, thisArg])`**
2. **`Array.prototype.map(callback[, thisArg])`**
3. **`Array.prototype.filter(callback[, thisArg])`**
4. **`Array.prototype.some(callback[, thisArg])`**
5. **`Array.prototype.every(callback[, thisArg])`**
6. **`Array.prototype.find(callback[, thisArg])`**
7. **`Array.prototype.findIndex(callback[, thisArg])`**
8. **`Array.prototype.flatMap(callback[, thisArg])`**
9. **`Array.prototype.from(arraylike[, callback[, thisArg]])`**
10. **`Set.prototype.forEach(callback[, thisArg])`**
11. **`Map.prototype.forEach(callback[, thisArg])`**