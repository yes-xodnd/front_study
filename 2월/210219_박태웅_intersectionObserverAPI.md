# 2021.02.19 IntersectionObserver API



## 0. IntersectionObserver API란?

- 특정 요소가 화면에 표시되었는지 여부를 확인하는 데 사용하는 Web API 입니다.
- 조금 더 정확하게 표현하면, 타겟 요소와 상위 요소 또는 최상위 document 의 뷰포트 사이의 intersection 내의 변화를 비동기적으로 관찰하는 방법입니다.
- 이미지나 컨텐츠의 지연 로딩, infinite scroll 구현, 화면에 표시되지 않는 애니메이션의 수행 중지 등을 위해 사용할 수 있습니다.

- 기존에는 Scroll 이벤트의 핸들러에서 `Element.getBoundingClientRect()` 메서드를 이용해 요소의 뷰포트 상에서의 포지션 값을 받고 연산하는 방법을 사용하였습니다.
- 위의 방법은 Scroll 이벤트 발생 횟수가 굉장히 많기 때문에 여러 요소에서 사용하면 수많은 교차 탐지 로직이 메인스레드에서 동작하게 되기 때문에 성능을 저하시킬 수 있었고, 이를 개선하기 위해 도입된 것이 Intersection Observer API 입니다.
- Intersection Observer는 별도의 스레드에서 비동기적으로 작동하기 때문에 성능을 최적화할 수 있습니다.
- 두 요소(타겟 요소와 상위요소 또는 뷰포트)의 교차 비율(intersectionRatio)이 일정 수준(threshold) 이상일 때 실행할 콜백함수를 등록할 수 있습니다.



## 1. 사용법

- 콜백함수와 옵션을 작성하고, 생성자로 `IntersectionObserver` 인스턴스를 생성합니다.

``` js
// 대상 요소가 보이는 비율(교차비율; intersectionRatio)이 설정한 역치값보다 클 때 호출되는 함수
const callback = (entries, observer) => {
    // entries  : IntersectionObserverEntry 객체의 배열
    // observer : 자신을 호출한 IntersectionObserver 인스턴스
};

// Optional
const options = {
    // root       : 대상이 교차할 요소. 작성하지 않으면 기본값으로 브라우저의 뷰포트 사용
    // rootMargin : root가 가지는 여백. css margin처럼 "10px 20px 10px 20px"로 작성
    // threshold  : 콜백을 실행하기 위한 교차비율의 역치값, 0 - 1.0 사이
    //              [0, 0.5, 1] 처럼 배열을 전달해 여러 교차비율에서 실행할 수 있음
    rootMargin: "10px 5px 10px 5px",
    threshold: 0.5,
};

const observer = new IntersectionObserver(callback, options);
```

- 요소를 선택하고, 인스턴스의 `observe()` 메서드로 요소를 등록합니다.

``` js
const target = document.querySelector('.target');
observer.observe(target);
```





---

### 참고자료

> - [MDN - IntersectionObserver API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)
> - [MDN - timeing element visibility with the IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility)
> - [google developers - IntersectionObserver's coming into view](https://developers.google.com/web/updates/2016/04/intersectionobserver)