## 9. connect 함수


### 소개

[`connect`](https://react-redux.js.org/api/connect) 함수는 컨테이너 컴포넌트를 만드는 또 다른 방법입니다. 이 함수는 사실 앞으로 사용 할 일이 별로 없습니다. `useSelector`, `useDispatch`가 워낙 편하기 때문이죠. 때문에 이 내용은 이렇게 리덕스 튜토리얼의 후반부에서 다루게 되었습니다.

솔직히 말씀드리자면 앞으로 여러분이 리덕스를 사용하게 될 때에는 `connect` 함수를 더 이상 사용하게 될 일이 그렇게 많지 않을 것입니다.

우리가 리액트 컴포넌트를 만들 때에는 함수형 컴포넌트로 만드는 것을 우선시해야 하고, 꼭 필요할 때에만 클래스형 컴포넌트로 작성을 해야 합니다. 만약 클래스형 컴포넌트로 작성을 하게 되는 경우에는 Hooks 를 사용하지 못하기 때문에 `connect` 함수를 사용하셔야 됩니다.

추가적으로, 2019년 이전에 작성된 리덕스와 연동된 컴포넌트들은 `connect` 함수로 작성되었을 것입니다. `connect` 함수가 사라지는 것은 아니기 때문에 옛날에 만든 컨테이너 컴포넌트들을 함수형으로 변환을 하실 필요는 없습니다. 때문에, 여러분들이 나중에 리액트 프로젝트를 유지보수하게 될 일이 있다면 `connect` 함수를 종종 접하게 될 수 있습니다.

따라서! 새로운 컨테이너 컴포넌트를 만들 때에는 `connect` 를 사용하는 일이 별로 없긴 하겠지만, 이 함수가 어떻게 작동하는지 이해는 해야하기 때문에, 다뤄보도록 하겠습니다.

### HOC란?

`connect`는 [HOC](https://velopert.com/3537)입니다. HOC란, Higher-Order Component 를 의미하는데요, 이는 리액트 컴포넌트를 개발하는 하나의 패턴으로써, 컴포넌트의 로직을 재활용 할 때 유용한 패턴입니다. 예를 들어서, 특정 함수 또는 값을 props 로 받아와서 사용하고 싶은 경우에 이러한 패턴을 사용합니다. 리액트에 Hook이 도입되기 전에는 HOC 패턴이 자주 사용되어왔으나, 리액트에 Hook 이 도입된 이후에는 HOC를 만들 이유가 없어졌습니다. 대부분의 경우 Hook으로 대체 할 수 있기 때문이지요. 심지어, 커스텀 Hook을 만드는건 굉장히 쉽기도 합니다.

HOC를 직접 구현하게 되는 일은 거의 없기 때문에 지금 시점에 와서 HOC를 직접 작성하는 방법을 배워보거나, 이해하기 위해 시간을 쏟을 필요는 없습니다.

HOC의 용도는 "컴포넌트를 특정 함수로 감싸서 특정 값 또는 함수를 props로 받아와서 사용 할 수 있게 해주는 패턴"이라는 것 정도만 알아두시면 됩니다.

HOC 컬렉션 라이브러리인 [recompose](https://github.com/acdlite/recompose)라는 라이브러리를 보시면 HOC를 통해서 어떤 것을 하는지 갈피를 잡을 수 있습니다.

```javascript
const enhance = withState('counter', 'setCounter', 0)
const Counter = enhance(({ counter, setCounter }) =>
  <div>
    Count: {counter}
    <button onClick={() => setCounter(n => n + 1)}>Increment</button>
    <button onClick={() => setCounter(n => n - 1)}>Decrement</button>
  </div>
)
```

어디선가 많이 본 느낌이죠? 마치 `useState` 같습니다. `withState` 함수를 사용해서 `enhance`라는 컴포넌트에 props로 특정 값과 함수를 넣어주는 함수를 만들었습니다. 그리고, 컴포넌트를 만들 때 `enhance`로 감싸주는 원하는 값과 함수를 props를 통하여 사용 할 수 있게 됩니다.

### connect 사용해보기

`connect` 함수는 리덕스 스토어안에 있는 상태를 props로 넣어줄수도있고, 액션을 디스패치하는 함수를 props 로 넣어줄수도 있습니다.

한번 CounterContainer 를 `connect` 함수로 구현해볼까요? CounterContainer 코드를 다음과 같이 수정해보세요.

#### containers/CounterContainer.js

```javascript
import React from 'react';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease, setDiff } from '../modules/counter';

function CounterContainer({ number, diff, onIncrease, onDecrease, onSetDiff }) {
  return (
    <Counter
      // 상태와
      number={number}
      diff={diff}
      // 액션을 디스패치 하는 함수들을 props로 넣어줍니다.
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onSetDiff={onSetDiff}
    />
  );
}

// mapStateToProps 는 리덕스 스토어의 상태를 조회해서 어떤 것들을 props 로 넣어줄지 정의합니다.
// 현재 리덕스 상태를 파라미터로 받아옵니다.
const mapStateToProps = state => ({
  number: state.counter.number,
  diff: state.counter.diff
});

// mapDispatchToProps 는 액션을 디스패치하는 함수를 만들어서 props로 넣어줍니다.
// dispatch 를 파라미터로 받아옵니다.
const mapDispatchToProps = dispatch => ({
  onIncrease: () => dispatch(increase()),
  onDecrease: () => dispatch(decrease()),
  onSetDiff: diff => dispatch(setDiff(diff))
});

// connect 함수에는 mapStateToProps, mapDispatchToProps 를 인자로 넣어주세요.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainer);

/* 위 코드는 다음과 동일합니다.
  const enhance = connect(mapStateToProps, mapDispatchToProps);
  export defualt enhance(CounterContainer);
*/
```

카운터가 잘 작동하는지 확인해보세요.

`mapStateToProps`는 컴포넌트에 props로 넣어줄 리덕스 스토어 상태에 관련된 함수이고, `mapDispatchToProps`는 컴포넌트에 props로 넣어줄 액션을 디스패치하는 함수들에 관련된 함수입니다.

여기서 `mapDispatchToProps` 는 redux 라이브러리에 내장된 `bindActionCreators` 라는 함수를 사용하면 다음과 같이 리팩토링 할 수 있습니다.


#### containers/CounterContainer.js
```javascript
import React from 'react';
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease, setDiff } from '../modules/counter';

// 액션 생성함수 이름이 바뀌어서 props 이름도 바뀌었습니다.
// 예: onIncrease -> increase
function CounterContainer({ number, diff, increase, decrease, setDiff }) {
  return (
    <Counter
      // 상태와
      number={number}
      diff={diff}
      // 액션을 디스패치 하는 함수들을 props로 넣어줍니다.
      onIncrease={increase}
      onDecrease={decrease}
      onSetDiff={setDiff}
    />
  );
}

// mapStateToProps 는 리덕스 스토어의 상태를 조회해서 어떤 것들을 props 로 넣어줄지 정의합니다.
// 현재 리덕스 상태를 파라미터로 받아옵니다.
const mapStateToProps = state => ({
  number: state.counter.number,
  diff: state.counter.diff
});

// mapDispatchToProps 는 액션을 디스패치하는 함수를 만들어서 props로 넣어줍니다.
// dispatch 를 파라미터로 받아옵니다.
const mapDispatchToProps = dispatch =>
  // bindActionCreators 를 사용하면, 자동으로 액션 생성 함수에 dispatch 가 감싸진 상태로 호출 할 수 있습니다.
  bindActionCreators(
    {
      increase,
      decrease,
      setDiff
    },
    dispatch
  );

// connect 함수에는 mapStateToProps, mapDispatchToProps 를 인자로 넣어주세요.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainer);

/* 위 코드는 다음과 동일합니다.
  const enhance = connect(mapStateToProps, mapDispatchToProps);
  export defualt enhance(CounterContainer);
*/
```


`connect` 함수에서는 `mapDispatchToProps`가 함수가 아니라 아예 객체형태일때에는 `bindActionCreators`를 대신 호출해줍니다. 한번 코드를 다음과 같이 수정해보세요.

#### containers/CounterContainer.js
```javascript
import React from 'react';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease, setDiff } from '../modules/counter';

function CounterContainer({ number, diff, increase, decrease, setDiff }) {
  return (
    <Counter
      // 상태와
      number={number}
      diff={diff}
      // 액션을 디스패치 하는 함수들을 props로 넣어줍니다.
      onIncrease={increase}
      onDecrease={decrease}
      onSetDiff={setDiff}
    />
  );
}

// mapStateToProps 는 리덕스 스토어의 상태를 조회해서 어떤 것들을 props 로 넣어줄지 정의합니다.
// 현재 리덕스 상태를 파라미터로 받아옵니다.
const mapStateToProps = state => ({
  number: state.counter.number,
  diff: state.counter.diff
});

// mapDispatchToProps가 함수가 아니라 객체면
// bindActionCreators 를 connect 에서 대신 해줍니다.
const mapDispatchToProps = {
  increase,
  decrease,
  setDiff
};

// connect 함수에는 mapStateToProps, mapDispatchToProps 를 인자로 넣어주세요.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainer);

/* 위 코드는 다음과 동일합니다.
  const enhance = connect(mapStateToProps, mapDispatchToProps);
  export defualt enhance(CounterContainer);
*/
```

### connect 함수 더 깔끔하게 작성하기

취향에 따라 다르게 생각 할 수 있긴 하지만, `mapStateToProps`와 `mapDispatchToProps`를 따로 선언하지 않고 `connect` 함수를 사용 할 때 인자 쪽에서 익명함수로 바로 만들어서 사용하면 코드가 꽤나 깔끔해집니다.

한번 TodosContainer를 다음과 같이 `connect`를 사용해서 구현해보세요.

#### containers/TodosContainer.js
```javascript
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import Todos from '../components/Todos';
import { addTodo, toggleTodo } from '../modules/todos';

function TodosContainer({ todos, addTodo, toggleTodo }) {
  const onCreate = text => addTodo(text);
  const onToggle = useCallback(id => toggleTodo(id), [toggleTodo]); // 최적화를 위해 useCallback 사용

  return <Todos todos={todos} onCreate={onCreate} onToggle={onToggle} />;
}

export default connect(
  state => ({ todos: state.todos }),
  {
    addTodo,
    toggleTodo
  }
)(TodosContainer);
```

(개인적으로 `connect`를 쓸 때에는 이런 형태를 선호합니다만 꼭 이렇게 할 필요는 없습니다)

### connect, 알아둬야 하는 것들

이번에 다뤄본 예시들은 정말 기본적인것들만 있었고, `connect`에서 다루지는 않았지만 알아두면 유용 할 수 있는 내용 몇가지들을 다뤄보겠습니다.

#### 1. [mapStateToProps](https://react-redux.js.org/api/connect#mapstatetoprops-state-ownprops-object) 의 두번째 파라미터 ownProps

`mapStateToProps`에서는 두번째 파라미터 `ownProps`를 받아올 수 있는데요 이 파라미터는 생략해도 되는 파라미터입니다. 이 값은 우리가 컨테이너 컴포넌트를 렌더링 할때 직접 넣어주는 `props` 를 가르킵니다. 예를 들어서

`<CounterContainer myValue={1} />` 이라고 하면 `{ myValue: 1 }` 값이 `ownProps`가 되죠.

이 두번째 파라미터는 다음과 같은 용도로 활용 할 수 있습니다.

```javascript
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id]
})
```

리덕스에서 어떤 상태를 조회 할 지 설정하는 과정에서 현재 받아온 props에 따라 다른 상태를 조회 할 수 있죠.

#### 2. connect 의 3번째 파라미터 [mergeProps](https://react-redux.js.org/api/connect#mergeprops-stateprops-dispatchprops-ownprops-object)

`mergeProps`는 `connect` 함수의 세번째 파라미터이며, 생략해도 되는 파라미터입니다. 이 파라미터는 컴포넌트가 실제로 전달받게 될 `props` 를 정의합니다. 

```javascript
(stateProps, dispatchProps, ownProps) => Object
```

이 함수를 따로 지정하지 않으면 결과는 `{ ...ownProps, ...stateProps, ...dispatchProps }` 입니다.

(사실상 사용하게 될 일이 없습니다.)

#### 3. connect의 4번째 파라미터 [options](https://react-redux.js.org/api/connect#options-object)

`connect` 함수를 사용 할 때 이 컨테이너 컴포넌트가 어떻게 동작할지에 대한 옵션을 4번째 파라미터를 통해 설정 할 수 있습니다. 이는 생략해도 되는 파라미터입니다. 이 옵션들은 따로 커스터마이징하게 되는일이 별로 없습니다. 자세한 내용은 링크를 [참조](https://react-redux.js.org/api/connect#options-object)하세요. 이 옵션을 통하여 Context 커스터마이징, 최적화를 위한 비교 작업 커스터마이징, 및 ref 관련 작업을 할 수 있습니다.

