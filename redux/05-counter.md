## 5. 카운터 구현하기

카운터를 구현해봅시다.

### 프리젠테이셔널 컴포넌트 만들기

프리젠테이셔널 컴포넌트란, 리덕스 스토어에 직접적으로 접근하지 않고 필요한 값 또는 함수를 props 로만 받아와서 사용하는 컴포넌트입니다.

src 디렉터리에 components 디렉터리를 만들고, 그 안에 Counter.js 를 다음과 같이 만들어주세요.

#### Counter.js
```javascript
import React from 'react';

function Counter({ number, diff, onIncrease, onDecrease, onSetDiff }) {
  const onChange = e => {
    // e.target.value 의 타입은 문자열이기 때문에 숫자로 변환해주어야 합니다.
    onSetDiff(parseInt(e.target.value, 10));
  };
  return (
    <div>
      <h1>{number}</h1>
      <div>
        <input type="number" value={diff} min="1" onChange={onChange} />
        <button onClick={onIncrease}>+</button>
        <button onClick={onDecrease}>-</button>
      </div>
    </div>
  );
}

export default Counter;

```

프리젠테이셔널 컴포넌트에선 주로 이렇게 UI를 선언하는 것에 집중하며, 필요한 값들이나 함수는 props 로 받아와서 사용하는 형태로 구현합니다.


### 컨테이너 컴포넌트 만들기

컨테이너 컴포넌트란, 리덕스 스토어의 상태를 조회하거나, 액션을 디스패치 할 수 있는 컴포넌트를 의미합니다. 그리고, HTML 태그들을 사용하지 않고 다른 프리젠테이셔널 컴포넌트들을 불러와서 사용합니다.

src 디렉터리에 containers 디렉터리를 만들고 CounterContainer.js 라는 파일을 만드세요.

#### CounterContainer.js
```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Counter from '../components/Counter';
import { increase, decrease, setDiff } from '../modules/counter';

function CounterContainer() {
  // useSelector는 리덕스 스토어의 상태를 조회하는 Hook입니다.
  // state의 값은 store.getState() 함수를 호출했을 때 나타나는 결과물과 동일합니다.
  const { number, diff } = useSelector(state => ({
    number: state.counter.number,
    diff: state.counter.diff
  }));

  // useDispatch 는 리덕스 스토어의 dispatch 를 함수에서 사용 할 수 있게 해주는 Hook 입니다.
  const dispatch = useDispatch();
  // 각 액션들을 디스패치하는 함수들을 만드세요
  const onIncrease = () => dispatch(increase());
  const onDecrease = () => dispatch(decrease());
  const onSetDiff = diff => dispatch(setDiff(diff));

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

export default CounterContainer;
```

이제 App 컴포넌트에서 CounterContainer를 불러와서 렌더링하세요.

```javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';

function App() {
  return (
    <div>
      <CounterContainer />
    </div>
  );
}

export default App;
```

![](https://i.imgur.com/Y60kM3K.png)

+, - 버튼을 눌러보세요. 그리고 input 의 숫자도 변경해본다음에 또 +, - 버튼을 눌러보세요. 카운터가 잘 작동하고 있나요?

### 프리젠테이셔널 컴포넌트와 컨테이너 컴포넌트

우리가 이번에 리액트 컴포넌트에서 리덕스를 사용 할 때 프리젠테이셔널 컴포넌트와 컨테이너 컴포넌트를 분리해서 작업을 했습니다. [이러한 패턴](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)을 리덕스의 창시자 Dan Abramov가 소개하게 되면서 이렇게 컴포넌트들을 구분지어서 진행하는게 당연시 됐었습니다.

하지만, 꼭 이렇게 하실 필요는 없습니다. Dan Abramov 또한 2019년에 자신이 썼던 포스트를 수정하게 되면서 꼭 이런 형태로 할 필요는 없다고 명시하였습니다.

순전히 여러분이 편하다고 생각하는 방식을 택하시면 됩니다. 

저는 개인적으로 프리젠테이셔널 / 컨테이너 컴포넌트를 구분지어서 작성하긴 하지만 디렉터리 상으로는 따로 구분 짓지 않는 것을 선호합니다. 

하지만 컴포넌트를 분리해서 작성하는 것이 아직까진 정석이긴 하기 때문에 이번 리덕스 강의에서는 분리해서 작성을 하겠습니다.