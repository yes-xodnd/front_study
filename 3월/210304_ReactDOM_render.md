# ReactDOM.render()

`ReactDOM.render()` 함수는 react로 만든 컴포넌트들을 DOM과 연결하고 렌더링하기 위한 진입점 역할을 합니다. 어떻게 작동하는지 궁금하기도 하고, 페이스북의 개발자들이 작성한 좋은 코드를 볼 수 있는 기회라고 생각해 한 번 소스코드를 찾아보았습니다.

## render()

react 깃헙 저장소에서 `ReactDOM.render()` 함수를 찾아 들어가면 [ReactDOMLegacy.js](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMLegacy.js)에서 음과 같은 코드를 볼 수 있습니다.

``` js
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  if (__DEV__) {
    const isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;
    if (isModernRoot) {
      console.error(
        'You are calling ReactDOM.render() on a container that was previously ' +
          'passed to ReactDOM.createRoot(). This is not supported. ' +
          'Did you mean to call root.render(element)?',
      );
    }
  }
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```



### render() - parameters

먼저 인자를 살펴보면 다음과 같습니다.

- `element` : subtree의 root가 되는 reactElement
- `container` : subtree가 삽입될 `Element` 또는 `Document` 타입의 객체
- `callback` : 렌더 후 실행될 콜백 함수

이 인자들을 받아 몇 개의 검증를 거친 후 `legacyRenderSubtreeIntoContainer()` 함수를 실행합니다. 이름에서 알 수 있듯이 subtree를 `container`에 삽입하는 함수입니다. 함수명이 길기는 해도 확실히 이해하기에 쉽습니다.



### render() - invariant()

가장 먼저 실행된 함수는 `invariant()`입니다. 많은 리액트 소스코드에서 `invariant()` 함수를 볼 수 있는데,  import된 소스코드는 다음과 같이 정의되어 있습니다.

``` js
export default function invariant(condition, format, a, b, c, d, e, f) {
  throw new Error(
    'Internal React error: invariant() is meant to be replaced at compile ' +
      'time. There is no runtime version.',
  );
}
```

"런타임 버전은 없고, 컴파일 타임에 다른 함수로 교체된다"는 내용의 오류를 던지는 것을 보니, 그냥 오류를 던지는 함수가 아니라 다른 함수가 있는 것 같습니다. npm에 [미러 버전 패키지](https://www.npmjs.com/package/invariant)가 있어서, 다행히 [소스 코드](https://github.com/facebook/react/blob/ee432635724d5a50301448016caa137ac3c0a7a2/packages/shared/invariant.js#L20)를 볼 수 있었습니다.

``` js
/**
*Use invariant() to assert state which your program assumes to be true.
*/
```

주석에서 요약하고 있는 바와 같이 특정한 state의 값을 true임을 확고히 하기 위해 사용하는 함수입니다. `condition`이 falsy하면 `format`에 작성한 오류 메세지에 `a`부터 `f` 까지의 인수를 넣어 출력합니다.

컴파일된 개발 버전의 node module 패키지를 살펴보면 아래와 같이 변경되어 있는 것을 볼 수 있습니다.

``` js
  if (!isValidContainer(container)) {
    {
      throw Error( "Target container is not a DOM element." );
    }
  }
```



### render() - isModernRoot

그 다음은 `isModernRoot` 검증입니다. `container`가 이미 reactDOM의 root로 설정된 노드라면 오류 로그를 출력합니다. 출력만 하는 것을 보면 실행이 불가능한 것은 아닌 것 같습니다.



## legacyRenderSubtreeIntoContainer()

검증을 마친 뒤, `render()`함수는 이 함수의 실행결과를 반환합니다.

``` js
function render() {
    //...
	return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}

function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  if (__DEV__) {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  }

  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```



### legacyRenderSubtreeIntoContainer() - parameters

`render()`에서의  `element`가 `children`으로 바뀐 것을 제외하면 같은 이름으로 전달되었습니다.
다른 곳에서도 쓰이는 함수인지 `parentComponent`를 전달할 수도 있지만, `render()` 컨텍스트에서는 전달하지 않습니다. `forceHydrate`는 SSR에 관련되어있으므로 지금은 넘어가도록 하겠습니다.



### legacyRenderSubtreeIntoContainer() - root

여기서부터 수많은 함수를 호출하기 때문에 복잡해지므로, 코드의 핵심적인 부분만 요약해서 따라가보았습니다.
최초 마운트 시 `root`를 설정하는 로직입니다.

``` js
// function legacyRenderSubtreeIntoContainer()
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
    container,
    forceHydrate,
);

// legacyCreateRootFromDOMContainer()
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
	// ...
    // container의 자식 노드를 모두 삭제합니다.
    // ...
    
    return createLegacyRoot(container, shouldHydrate ? {
	    hydrate: true
    } : undefined);
}

function createLegacyRoot(container, options) {
    return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

// container._reactRootContainer = new ReactDOMBlockingRoot()
function ReactDOMBlockingRoot(container, tag, options) {
    this._internalRoot = createRootImpl(container, tag, options);
}

function createRootImpl(container, tag, options) {
    // ...
    var root = createContainer(container, tag, hydrate);
    // ...
    return root;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate);
}

function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  // ...
  return root;
}

// container._reactRootContainer._internalRoot = new FiberRootNode()
function FiberRootNode(containerInfo, tag, hydrate) {
	this.tag = tag;
    this.containerInfo = containerInfo;
    this.pendingChildren = null;
    this.current = null;
  	// ...
}
```

핵심적인 부분만 보면, 아래와 같이 요약할 수 있겠습니다.

- `container._reactRootContainer` = `ReactDOMBlockingRoot()` 인스턴스

- `container._reactRootContainer._internalRoot` = `FiberRootNode()` 인스턴스

  

### legacyRenderSubtreeIntoContainer() - unbatchedUpdates()