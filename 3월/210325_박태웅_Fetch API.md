# Fetch API

Fetch API는 리소스 비동기 요청을 위한 Web API로, 기존의 XHR(XMLHttpRequest)을 대체하기 위해 추가되었습니다. 다음과 같은 장점을 가지고 있습니다.

- HTTP 요청에 최적화
- Promise 기반이기 때문에 상태에 따라 로직을 추가하고 처리하는 데 최적화
- 간결한 인터페이스

## 사용 방법

### basic

가장 기본적인 사용 방법은 다음과 같습니다.

``` js
fetch('http://example.com/samples')
.then(callback_ok(response))
.catch(callback_error(error));
```

Window 인터페이스에 구현되어 있어, 바로 `fetch()` 메서드로 접근할 수 있습니다.
Promise 기반이기 때문에,  `resolve` 또는 `reject`로 반환되는 `fetch()`의 결과 상태에 따라 `then` , `catch` 메서드 체이닝을 사용할 수 있습니다.

> 주의 : 어떤 [HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)가 반환되어도 fetch는 response를 반환합니다.
> error를 반환하는 경우는 HTTP 요청 자체가 실패하거나, 네트워크 오류가 발생하는 경우입니다.

``` js
fetch('https://api.thecatapi.com/v1/images/search')
.then(response => response.json())
```

HTTP 요청이 성공한 경우, [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 객체를 반환합니다.
Response 객체는 [Body](https://developer.mozilla.org/en-US/docs/Web/API/Body) 인터페이스를 구현하는데, Body의 `json()` 메서드를 통해 Response 스트림을 자바스크립트 자료형으로 변환할 수 있습니다. 문자열로 이루어진 자료가 아니라 이미지를 요청한 경우에는 `blob()` 메서드를 사용할 수 있습니다.

### advanced

HTTP 요청의 기본적인 구성 요소는 method, header, body가 있습니다.
method는 GET, POST, PUT, DELETE 등으로 요청의 타입을 구분하고, header는 요청에 대한 정보 그리고 body에는 요청과 함께 보내는 payload을 포함할 수 있습니다.

이를 구현하기 위해 `fetch()` 메서드는 `resource`와 `init` 파라미터를 받습니다.
기본적으로는 GET 메서드를 사용하기 때문에, `init`에서 method를 정의하지 않아도 GET 요청을 보내게 됩니다.

``` js
fetch(resource, [, init]);
```

`resource`는 자원의 위치를 표시하는 것으로, 일반적으로 URL 또는 URI를 작성하게 됩니다.
`init` 은 옵셔널 파라미터로 method, header, body 등을 객체의 형태로 정의할 수 있습니다.

``` js
const URL = 'http://example.com/...';
const headers = new Headers({
  'api-key': '....',
  'content-type': '....',
});
const init = {
  method: 'GET',
  headers,
};

fetch(URL, init);
```

