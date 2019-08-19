## 1. 리덕스 프로젝트 준비하기

리덕스 미들웨어를 공부해보기 전에, 리덕스 프로젝트를 먼저 새로 생성해주도록 하겠습니다.

다음 명령어를 사용하여 새로운 프로젝트를 준비해주세요.

```bash
$ npx create-react-app learn-redux-middleware
```

> 이 섹션의 코드는 [여기](https://codesandbox.io/s/vzui1)서 확인 가능합니다.

그리고 해당 디렉터리에서 redux와 react-redux를 설치해주세요.

```bash
$ cd learn-redux-middleware
$ yarn add redux react-redux
```

이제, 카운터 예제를 만들어보도록 하겠습니다.

### 리덕스 모듈 준비

우리는 액션 타입, 액션 생성함수, 리듀서를 한 파일에 작성하는 Ducks 패턴을 사용하도록 하겠습니다. src 디렉터리에 modules 디렉터리를 만들고, 그 안에 counter.js 라는 파일을 생성해서 다음과 같이 작성해주세요.

원래 Ducks 패턴을 따르는 리덕스 모듈에서는 액션 이름에 `'counter/INCREASE'` 이런식으로 앞부분에 접두어를 두지만, 이번에는 액션이름이 중복되는 일이 없으니, 편의상 생략하도록 하겠습니다.

#### modules/counter.js
```javascript
// 액션 타입
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

// 액션 생성 함수
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// 초깃값 (상태가 객체가 아니라 그냥 숫자여도 상관 없습니다.)
const initialState = 0;

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
}
```

그 다음에는 루트 리듀서를 만들어주세요. 물론 지금은 서브리듀서가 하나밖에 없는 상황이지만, 나중에 몇개 더 만들 것입니다.

#### modules/index.js
```javascript
import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({ counter });

export default rootReducer;
```


### 프로젝트에 리덕스 적용

프로젝트에 리덕스를 적용해주세요. 프로젝트에 리덕스를 적용 할 때에는 src 디렉터리의 index.js 에서 루트리듀서를 불러와서 이를 통해 새로운 스토어를 만들고 Provider 를 사용해서 프로젝트에 적용을 합니다.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```


### 프리젠테이셔널 컴포넌트 준비

그 다음, 프리젠테이셔널 컴포넌트 Counter 를 준비해주겠습니다. components 디렉터리에 Counter.js 파일을 만드세요. 해당 컴포넌트에서는 number, onIncrease, onDecrease를 props로 받아옵니다.

#### components/Counter.js
```javascript
import React from 'react';

function Counter({ number, onIncrease, onDecrease }) {
  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}

export default Counter;
```

### 컨테이너 만들기

그리고 컨테이너도 만들어줍시다. 

#### containers/CounterContainer.js
```javascript
import React from 'react';
import Counter from '../components/Counter';
import { useSelector, useDispatch } from 'react-redux';
import { increase, decrease } from '../modules/counter';

function CounterContainer() {
  const number = useSelector(state => state.counter);
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increase());
  };
  const onDecrease = () => {
    dispatch(decrease());
  };

  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
}

export default CounterContainer;
```

이제 App 에서 CounterContainer를 렌더링을 하고, `yarn start` 를 해서 개발 서버를 구동해보세요.

#### App.js
```javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';

function App() {
  return <CounterContainer />;
}

export default App;
```


이제 카운터가 작동하는지 확인해보세요.

![](https://i.imgur.com/MTeKPV9.png)

이제 리덕스 미들웨어를 직접 만들어볼 준비가 끝났습니다.