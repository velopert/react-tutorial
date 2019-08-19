## 2. 미들웨어 만들어보고 이해하기

이번 섹션에서는 미들웨어를 직접 만들어보도록 하겠습니다. 사실 실무에서는 리덕스 미들웨어를 직접 만들게 되는 일은 거의 없습니다. 하지만, 한번 직접 만들어보게 된다면 미들웨어가 어떤 역할인지 훨씬 쉽게 이해 할 수 있습니다.

### 리덕스 미들웨어의 템플릿

리덕스 미들웨어를 만들 땐 다음 [템플릿](https://redux.js.org/advanced/middleware#the-final-approach)을 사용합니다.

```javascript
const middleware = store => next => action => {
  // 하고 싶은 작업...
}
```

미들웨어는 결국 하나의 함수입니다. 함수를 연달아서 두번 리턴하는 함수죠. 화살표가 여러번 나타나는게 도대체 뭐지, 하고 헷갈릴 수도 있을텐데요, 이 함수를 `function` 키워드를 사용하여 작성한다면 다음과 같습니다.

```javascript
function middleware(store) {
  return function (next) {
    return function (action) {
      // 하고 싶은 작업...
    };
  };
};
```

이제 여기서 각 함수에서 받아오는 파라미터가 어떤 것을 의미하는지 알아보겠습니다.

첫번째 `store`는 리덕스 스토어 인스턴스입니다. 이 안에 `dispatch`, `getState`, `subscribe` 내장함수들이 들어있죠.

두번째 `next` 는 액션을 다음 미들웨어에게 전달하는 함수입니다. `next(action)` 이런 형태로 사용합니다. 만약 다음 미들웨어가 없다면 리듀서에게 액션을 전달해줍니다. 만약에 `next` 를 호출하지 않게 된다면 액션이 무시처리되어 리듀서에게로 전달되지 않습니다.

세번째 `action` 은 현재 처리하고 있는 액션 객체입니다.

![](https://i.imgur.com/fZs5yvY.png)

미들웨어는 위와 같은 구조로 작동합니다. 리덕스 스토어에는 여러 개의 미들웨어를 등록할 수 있습니다. 새로운 액션이 디스패치 되면 첫 번째로 등록한 미들웨어가 호출됩니다. 만약에 미들웨어에서 `next(action)`을 호출하게 되면 다음 미들웨어로 액션이 넘어갑니다. 그리고 만약 미들웨어에서 `store.dispatch` 를 사용하면 다른 액션을 추가적으로 발생시킬 수 도 있습니다.

### 미들웨어 직접 작성해보기

그럼 미들웨어를 직접 작성을 해봅시다! src 디렉터리에 middlewares 라는 디렉터리를 만들고, myLogger.js 라는 파일을 다음과 같이 작성해보세요.

#### middlewares/myLogger.js
```javascript
const myLogger = store => next => action => {
  console.log(action); // 먼저 액션을 출력합니다.
  const result = next(action); // 다음 미들웨어 (또는 리듀서) 에게 액션을 전달합니다.
  return result; // 여기서 반환하는 값은 dispatch(action)의 결과물이 됩니다. 기본: undefined
};

export default myLogger;
```

지금은 단순히 전달받은 액션을 출력하고 다음으로 넘기는 작업을 구현했습니다.

### 미들웨어 적용하기

이제 미들웨어를 스토어에 적용해봅시다! 스토어에 미들웨어를 적용 할 때에는 `applyMiddleware` 라는 함수를 사용합니다.

index.js를 다음과 같이 수정해보세요.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import myLogger from './middlewares/myLogger';

const store = createStore(rootReducer, applyMiddleware(myLogger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

이제 카운터에서 버튼을 눌러보세요. 액션이 잘 출력되고 있나요?

![](https://i.imgur.com/VpVmo3t.png)

### 미들웨어 수정하기

미들웨어를 조금 더 수정해봅시다. 만약 액션이 리듀서까지 전달되고 난 후의 새로운 상태를 확인하고 싶다면 다음과 같이 수정 할 수 있습니다.

```javascript
const myLogger = store => next => action => {
  console.log(action); // 먼저 액션을 출력합니다.
  const result = next(action); // 다음 미들웨어 (또는 리듀서) 에게 액션을 전달합니다.

  // 업데이트 이후의 상태를 조회합니다.
  console.log('\t', store.getState()); // '\t' 는 탭 문자 입니다.

  return result; // 여기서 반환하는 값은 dispatch(action)의 결과물이 됩니다. 기본: undefined
};

export default myLogger;
```

![](https://i.imgur.com/ymhkBpD.png)

업데이트 후의 상태가 잘 나타나고 있나요?

미들웨어 안에서는 무엇이든지 할 수 있습니다. 예를 들어서 액션 값을 객체가 아닌 함수도 받아오게 만들어서 액션이 함수타입이면 이를 실행시키게끔 할 수도 있습니다 (이게 우리가 추후 배워볼 redux-thunk 입니다). 한번 예시를 확인해볼까요?

```javascript
const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action)
```

그러면 나중엔 dispatch 할 때 다음과 같이 할 수도 있는거죠.
```javascript
const myThunk = () => (dispatch, getState) => {
  dispatch({ type: 'HELLO' });
  dispatch({ type: 'BYE' });
}

dispatch(myThunk());
```

우리가 이번에 이렇게 미들웨어를 직접 만들어보면서 객체와 상태를 로깅하는 작업을 해보았습니다. 리덕스 관련 값들을 콘솔에 로깅하는건 이렇게 직접 만드는 것 보단 ]redux-logger](https://github.com/LogRocket/redux-logger) 라는 미들웨어를 사용하는게 더욱 좋습니다. 

다음 섹션에서는 redux-logger 라는 라이브러리를 설치 및 적용을 하고, 또 미들웨어를 사용하게 되는 경우에는 Redux DevTools를 어떻게 사용하는지 알아보도록 하겠습니다.

