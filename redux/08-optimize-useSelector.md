## 8. useSelector 최적화

리액트 컴포넌트에서 리덕스 상태를 조회해서 사용 할 때 최적화를 하기 위해서 어떤 사항을 고려해야 하는지 알아보도록 하겠습니다.

지난 섹션에서 할 일 목록을 만들 때에는 프리젠테이셔널 컴포넌트에서 React.memo를 사용하여 리렌더링 최적화를 해줬었는데요, 컨테이너 컴포넌트에서는 어떤 것들을 검토해야 하는지 알아보겠습니다.

우선, 리액트 개발자 도구의 톱니바퀴를 눌러서 Highlight Updates 를 체크하세요.

![](https://i.imgur.com/nkUAJbh.png)

![](https://i.imgur.com/RYJ7fL9.png)

그리고 나서 카운터의 +, - 를 눌러보시면 하단의 할 일 목록이 리렌더링되진 않지만 할 일 목록의 항목을 토글 할 때에는 카운터가 리렌더링되는 것을 확인 할 수 있습니다.

![](https://i.imgur.com/PhazYbT.gif)

기본적으로, `useSelector`를 사용해서 리덕스 스토어의 상태를 조회 할 땐 만약 상태가 바뀌지 않았으면 리렌더링하지 않습니다.

TodosContainer 의 경우 카운터 값이 바뀔 때 `todos` 값엔 변화가 없으니까, 리렌더링되지 않는것이죠.

```javascript
const todos = useSelector(state => state.todos);
```

반면 CounterContainer 를 확인해볼까요?

```javascript
const { number, diff } = useSelector(state => ({
  number: state.counter.number,
  diff: state.counter.diff
}));
```

CounterContainer에서는 사실상 `useSelector` Hook 을 통해 매번 렌더링 될 때마다 새로운 객체 `{ number, diff }`를 만드는 것이기 때문에 상태가 바뀌었는지 바뀌지 않았는지 확인을 할 수 없어서 낭비 렌더링이 이루어지고 있는 것 입니다.

이를 최적화 하기 위해선 두가지 방법이 있습니다.

첫번째는, `useSelector` 를 여러번 사용하는 것 입니다.

```javascript
const number = useSelector(state => state.counter.number);
const diff = useSelector(state => state.counter.diff);
```

이렇게 하면 해당 값들 하나라도 바뀌었을 때에만 컴포넌트가 리렌더링 됩니다.

두번째는, react-redux의 `shallowEqual` 함수를 `useSelector`의 두번째 인자로 전달해주는 것 입니다.

```javascript
import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease, setDiff } from '../modules/counter';

function CounterContainer() {
  // useSelector는 리덕스 스토어의 상태를 조회하는 Hook입니다.
  // state의 값은 store.getState() 함수를 호출했을 때 나타나는 결과물과 동일합니다.
  const { number, diff } = useSelector(
    state => ({
      number: state.counter.number,
      diff: state.counter.diff
    }),
    shallowEqual
  );
  
  (...)
```

`useSelector` 의 두번째 파라미터는 `equalityFn` 인데요, 

```javascript
equalityFn?: (left: any, right: any) => boolean
```

이전 값과 다음 값을 비교하여 `true`가 나오면 리렌더링을 하지 않고 `false`가 나오면 리렌더링을 합니다.

`shallowEqual`은 react-redux에 내장되어있는 함수로서, 객체 안의 가장 겉에 있는 값들을 모두 비교해줍니다.

여기서 겉에 있는 값이란, 만약 다음과 같은 객체가 있다면
```javascript
const object = {
  a: {
    x: 3,
    y: 2,
    z: 1
  },
  b: 1,
  c: [{ id: 1 }]
}
```

가장 겉에 있는 값은 `object.a`, `object.b`, `object.c` 입니다. `shallowEqual` 에서는 해당 값들만 비교하고 `object.a.x` 또는 `object.c[0]` 값은 비교하지 않습니다.

---


이렇게 둘 중 하나의 방식으로 최적화를 해주면, 컨테이너 컴포넌트가 필요한 상황에서만 리렌더링 될 것입니다.