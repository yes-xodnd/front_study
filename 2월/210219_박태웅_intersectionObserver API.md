# 2021.02.19 IntersectionObserver API









### 인스턴스 생성

``` js
// 대상 요소가 보이는 비율(intersectionRatio)이 역치( = options.threshold)보다 클 때 호출되는 함수
const callback = (entries, observer) => {
    // entries  : IntersectionObserverEntry 객체의 배열
    // observer : 자신을 호출한 IntersectionObserver 인스턴스
};

// Optional
const options = {
    // root       : 가시성을 확인하기 위해 사용되는 뷰포트 요소. 기본값은 브라우저의 뷰포트
    // rootMargin : root가 가지는 여백
    // threshold  : 콜백을 실행하기 위한 intersectionRatio의 역치값
    root: someElement,
    rootMargin: "10px 5px 10px 5px",
    threshold: 0.5,
};

const observer = new IntersectionObserver(callback, options);
```





---

### 참고자료

> - [MDN - IntersectionObserver API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)
> - [MDN - timeing element visibility with the IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility)
> - [google developers - IntersectionObserver's coming into view](https://developers.google.com/web/updates/2016/04/intersectionobserver)