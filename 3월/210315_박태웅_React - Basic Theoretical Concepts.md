# React - Basic Theoretical Concepts

> 이 문서는 [Facebook 개발자 Sebastian Markbåge의 문서](https://github.com/reactjs/react-basic/blob/master/README.md#react---basic-theoretical-concepts)를 번역한 것입니다.

The actual implementation of React.js is full of pragmatic solutions, incremental steps, algorithmic optimizations, legacy code, debug tooling and things you need to make it actually useful. Those things are more fleeting, can change over time if it is valuable enough and have high enough priority. The actual implementation is much more difficult to reason about.

React의 실제 구현은 실용적인 해결책들, 더 많은 단계들, 알고리즘 최적화, 레거시 코드, 디버그 도구 등 React를 유용하게 만드는 것으로 가득합니다. 이것들은 일시적이어서, 그럴 가치가 있고 우선 순위가 충분히 높다면 나중에 변경될 수도 있습니다.실제 구현은 훨씬 더 추론하기 어렵습니다.

저는 더 단순한 개념적 모델을 사용하는 걸 좋아합니다.

## Transformation 변화

The core premise for React is that UIs are simply a projection of data into a different form of data. The same input gives the same output. A simple pure function.

React의 핵심 전제는, UI는 단순히 데이터를 다른 형태의 데이터로 투사한 형상화(projection)라는 것입니다. 같은 입력에 같은 출력이 나오는 단순한 순수 함수죠.

```
function NameBox(name) {
  return { fontWeight: 'bold', labelContent: name };
}
'Sebastian Markbåge' ->
{ fontWeight: 'bold', labelContent: 'Sebastian Markbåge' };
```

## Abstraction 추상화

You can't fit a complex UI in a single function though. It is important that UIs can be abstracted into reusable pieces that don't leak their implementation details. Such as calling one function from another.

그렇지만 복잡한 UI를 함수 하나에 끼워넣을 수는 없습니다. UI가 재사용 가능한, 구현 내용을 노출하지 않는 조각들로 추상화될 수 있는 것은 중요합니다. 한 함수에서 다른 함수를 호출하는 것 처럼 말이죠.

```
function FancyUserBox(user) {
  return {
    borderStyle: '1px solid blue',
    childContent: [
      'Name: ',
      NameBox(user.firstName + ' ' + user.lastName)
    ]
  };
}
{ firstName: 'Sebastian', lastName: 'Markbåge' } ->
{
  borderStyle: '1px solid blue',
  childContent: [
    'Name: ',
    { fontWeight: 'bold', labelContent: 'Sebastian Markbåge' }
  ]
};
```

## Composition 컴포지션

To achieve truly reusable features, it is not enough to simply reuse leaves and build new containers for them. You also need to be able to build abstractions from the containers that *compose* other abstractions. The way I think about "composition" is that they're combining two or more different abstractions into a new one.

정말로 재사용 가능하려면, 그저 리프를 재사용하고 컨테이너를 구축하는 것으로는 부족합니다. 다른 추상화를 구성하는 구성하는 컨테이너로부터 추상화를 구축할 수 있어야 합니다. "컴포지션"에 대해 내가 생각하는 방식은, 둘 이상의 서로 다른 추상화들이 새로운 무언가로 합쳐져야한다는 것입니다.

```
function FancyBox(children) {
  return {
    borderStyle: '1px solid blue',
    children: children
  };
}

function UserBox(user) {
  return FancyBox([
    'Name: ',
    NameBox(user.firstName + ' ' + user.lastName)
  ]);
}
```

## State 상태

A UI is NOT simply a replication of server / business logic state. There is actually a lot of state that is specific to an exact projection and not others. For example, if you start typing in a text field. That may or may not be replicated to other tabs or to your mobile device. Scroll position is a typical example that you almost never want to replicate across multiple projections.

We tend to prefer our data model to be immutable. We thread functions through that can update state as a single atom at the top.

UI는 단순히 서버 / 비즈니스 로직 상태의 복제가 아닙니다.  실제로 특정한 형상화(UI)에만 있는 수많은 상태가 있습니다. 예를 들어, 텍스트 필드에 입력을 시작했다고 칩시다. 그건 다른 탭이나 모바일 디바이스로 복제될 수도 있고, 아닐 수도 있습니다. 스크롤 위치는 다른 수많은 형상화에 절대로 복제하고 싶지 않은 상태값의 전형적인 예시일 것입니다.

우리는 불변하는 데이터 모델을 선호하는 경향이 있죠. 상태를 업데이트할 수 있는 함수들은 하나의 원자로서 맨 위에서 끼워넣습니다.

```
function FancyNameBox(user, likes, onClick) {
  return FancyBox([
    'Name: ', NameBox(user.firstName + ' ' + user.lastName),
    'Likes: ', LikeBox(likes),
    LikeButton(onClick)
  ]);
}

// Implementation Details

var likes = 0;
function addOneMoreLike() {
  likes++;
  rerender();
}

// Init

FancyNameBox(
  { firstName: 'Sebastian', lastName: 'Markbåge' },
  likes,
  addOneMoreLike
);
```

*NOTE: These examples use side-effects to update state. My actual mental model of this is that they return the next version of state during an "update" pass. It was simpler to explain without that but we'll want to change these examples in the future.*

*주 : 이 예시들은 상태를 업데이트하기 위해 side-effect를 사용합니다. 나의 진짜 개념적인 모델에서는 "업데이트" 단계에서 다음 버전의 상태를 반환합니다. 이런 개념이 없으면 설명하기는 더 편리하지만 이 예시는 나중에 수정될 것입니다.*

## Memoization 메모이제이션

Calling the same function over and over again is wasteful if we know that the function is pure. We can create a memoized version of a function that keeps track of the last argument and last result. That way we don't have to reexecute it if we keep using the same value.

어떤 함수가 순수함수라는 걸 알고 있다면, 같은 함수를 반복해서 호출하는 것은 낭비입니다. 마지막 인수(arguments)와 마지막 반환값을 계속 추적하는 memoized 버전 함수를 만들 수 있습니다. 이렇게 하면 같은 값을 사용할 때 함수를 재실행할 필요가 없습니다.

```
function memoize(fn) {
  var cachedArg;
  var cachedResult;
  return function(arg) {
    if (cachedArg === arg) {
      return cachedResult;
    }
    cachedArg = arg;
    cachedResult = fn(arg);
    return cachedResult;
  };
}

var MemoizedNameBox = memoize(NameBox);

function NameAndAgeBox(user, currentTime) {
  return FancyBox([
    'Name: ',
    MemoizedNameBox(user.firstName + ' ' + user.lastName),
    'Age in milliseconds: ',
    currentTime - user.dateOfBirth
  ]);
}
```

## Lists 목록

Most UIs are some form of lists that then produce multiple different values for each item in the list. This creates a natural hierarchy.

To manage the state for each item in a list we can create a Map that holds the state for a particular item.

대부분의 UI는 목록의 각 항목에 대해 여러 다른 값을 생성하는 일종의 목록입니다. 이것은 자연스러운 계층 구조를 만듭니다.

목록의 각 항목의 상태를 관리하기 위해 ,특정 항목의 상태를 갖는 Map을 생성할 수 있습니다.

```
function UserList(users, likesPerUser, updateUserLikes) {
  return users.map(user => FancyNameBox(
    user,
    likesPerUser.get(user.id),
    () => updateUserLikes(user.id, likesPerUser.get(user.id) + 1)
  ));
}

var likesPerUser = new Map();
function updateUserLikes(id, likeCount) {
  likesPerUser.set(id, likeCount);
  rerender();
}

UserList(data.users, likesPerUser, updateUserLikes);
```

*NOTE: We now have multiple different arguments passed to FancyNameBox. That breaks our memoization because we can only remember one value at a time. More on that below.*

*주: FancyNameBox에 여러 개의 인수를 전달했는데, 한 번에 하나의 값만 기억할 수 있기 때문에 메모이제이션이 제대로 작동하지 않습니다. *

## Continuations 연속

Unfortunately, since there are so many lists of lists all over the place in UIs, it becomes quite a lot of boilerplate to manage that explicitly.

We can move some of this boilerplate out of our critical business logic by deferring execution of a function. For example, by using "currying" ([`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) in JavaScript). Then we pass the state through from outside our core functions that are now free of boilerplate.

This isn't reducing boilerplate but is at least moving it out of the critical business logic.

안타깝게도 UI에는 수많은 목록의 목록들이 산재해 있기 때문에, 이것을 관리하기 위한 보일러플레이트가 꽤 많아지게 됩니다. 

함수 실행을 지연시켜 보일러플레이트 일부를 핵심적인 비즈니스 로직에서 들어낼 수 있습니다. 예를 들어, "커링"(자바스크립트에서 bind)을 사용하는 방법이 있습니다. 그다음 보일러플레이트에서 자유로워진 핵심 함수에 외부에서 상태를 전달합니다.

보일러플레이트를 줄이는 것은 아니지만, 적어도 핵심적인 비즈니스 로직에서 빼낼 수 있는 것입니다.

```
function FancyUserList(users) {
  return FancyBox(
    UserList.bind(null, users)
  );
}

const box = FancyUserList(data.users);
const resolvedChildren = box.children(likesPerUser, updateUserLikes);
const resolvedBox = {
  ...box,
  children: resolvedChildren
};
```

## State Map 상태 맵

We know from earlier that once we see repeated patterns we can use composition to avoid reimplementing the same pattern over and over again. We can move the logic of extracting and passing state to a low-level function that we reuse a lot.

위에서 보았듯이, 반복되는 패턴이 있으면 컴포지션을 통해 같은 패턴의 재구현을 피할 수 있는 걸 알고 있습니다. 자주 재사용하는 저수준 함수에 ㅇ

```

unction FancyBoxWithState(
  children,
  stateMap,
  updateState
) {
  return FancyBox(
    children.map(child => child.continuation(
      stateMap.get(child.key),
      updateState
    ))
  );
}

function UserList(users) {
  return users.map(user => {
    continuation: FancyNameBox.bind(null, user),
    key: user.id
  });
}

function FancyUserList(users) {
  return FancyBoxWithState.bind(null,
    UserList(users)
  );
}

const continuation = FancyUserList(data.users);
continuation(likesPerUser, updateUserLikes);
```

## Memoization Map

Once we want to memoize multiple items in a list memoization becomes much harder. You have to figure out some complex caching algorithm that balances memory usage with frequency.

Luckily, UIs tend to be fairly stable in the same position. The same position in the tree gets the same value every time. This tree turns out to be a really useful strategy for memoization.

We can use the same trick we used for state and pass a memoization cache through the composable function.

```
function memoize(fn) {
  return function(arg, memoizationCache) {
    if (memoizationCache.arg === arg) {
      return memoizationCache.result;
    }
    const result = fn(arg);
    memoizationCache.arg = arg;
    memoizationCache.result = result;
    return result;
  };
}

function FancyBoxWithState(
  children,
  stateMap,
  updateState,
  memoizationCache
) {
  return FancyBox(
    children.map(child => child.continuation(
      stateMap.get(child.key),
      updateState,
      memoizationCache.get(child.key)
    ))
  );
}

const MemoizedFancyNameBox = memoize(FancyNameBox);
```

## Algebraic Effects

It turns out that it is kind of a PITA to pass every little value you might need through several levels of abstractions. It is kind of nice to sometimes have a shortcut to pass things between two abstractions without involving the intermediates. In React we call this "context".

Sometimes the data dependencies don't neatly follow the abstraction tree. For example, in layout algorithms you need to know something about the size of your children before you can completely fulfill their position.

Now, this example is a bit "out there". I'll use [Algebraic Effects](http://math.andrej.com/eff/) as [proposed for ECMAScript](https://esdiscuss.org/topic/one-shot-delimited-continuations-with-effect-handlers). If you're familiar with functional programming, they're avoiding the intermediate ceremony imposed by monads.

```
function ThemeBorderColorRequest() { }

function FancyBox(children) {
  const color = raise new ThemeBorderColorRequest();
  return {
    borderWidth: '1px',
    borderColor: color,
    children: children
  };
}

function BlueTheme(children) {
  return try {
    children();
  } catch effect ThemeBorderColorRequest -> [, continuation] {
    continuation('blue');
  }
}

function App(data) {
  return BlueTheme(
    FancyUserList.bind(null, data.users)
  );
}
```