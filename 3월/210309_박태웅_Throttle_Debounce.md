# 2021.03.09 Debounce & Throttle

디바운싱과 쓰로틀링 모두 반복적인 입력에 대한 이벤트 처리를 일정한 규칙에 따라 제한함으로써, 발생하는 이벤트의 양을 줄이고 성능의 향상, 비용의 절감을 가져올 수 있는 기법입니다.

## Debounce

debounce는 같은 함수가 연속으로 호출될 때, 마지막 함수만 호출하도록 제어하는 것을 의미합니다.
예를 들어, 키보드 입력이 멈추면 자동으로 입력창의 내용을 ajax로 요청하는 경우가 있습니다. 이 때, 키보드를 누를 때마다 API에 요청을 보내는 것은 불필요한 함수 실행으로 성능을 떨어뜨리고 네트워크 비용을 증가시키게 됩니다. 

이를 제어하기 위한 debounce 코드는 다음과 같이 작성할 수 있습니다.

``` js
function debounce(callback, t = 200) {
  let timer;

  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, t);
  }
}
```

`debounce()`는 두 개의 파라미터를 전달받습니다.

- `callback` : 실제로 실행되어야 하는 로직을 담은 콜백함수
- `t`   : 타이머가 유지되는 시간(ms), 200을 기본값으로 설정

그리고 `timer` 변수를 선언한 뒤, 파라미터와 `timer`를 참조하는 클로저를 반환합니다.

- 반환된 클로저는 실행될 때마다 같은 `timer`를 참조하게 되므로, 이전 호출에서 설정된 `timer`가 아직 남아있다면 그 실행을 취소시키고, 자신의 `timer`를 설치합니다.
- `t`의 시간만큼 새로운 호출이 실행되지 않는다면  `callback`이 실행되게 됩니다.

정의한 함수는 다음과 같이 활용할 수 있습니다.

``` js
const callback = () => alert('resized');
window.addEventListener('resize', debounce(callback));
```



## Throttle

위에서 본 것처럼 debounce는 모든 연속적인 입력이 끝난 뒤 마지막 입력에 대해서만 콜백을 실행합니다. 반면 throttle은 일정한 시간 간격마다의 실행을 보장합니다.  

``` js
export function throttle(callback, t = 200) {
  let timer;
  
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
				callback();
        timer = null;
      }, t);
    }
  }
}
```

`throttle()`도 마찬가지로 `callback`과 `t`를 인자로 전달받고, `timer`를 참조하는 클로저를 반환합니다.
`debounce()`와 다른 점은, `timer`가 존재하지 않을 때만 `timer`에 `setTimeout()`을 설정해주는 것입니다.

-  `setTimeout()`의 반환값은 0이 아닌 숫자 `timeoutID` 로,  타임아웃이 실행되고 난 뒤에도 사라지지 않습니다. 
- 따라서 `setTimeout()`의 콜백에는 실행 후 `timer`의 값을 초기화하는 코드가 포함되어야 합니다.

정의한 함수는 다음과 같은 방식으로 사용할 수 있습니다. 

``` js
const callback = () => console.log('scrolled');
window.addEventListener('scroll', throttle(callback));
```

