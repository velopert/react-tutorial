## 12. saga에서 라우터 연동하기

우리가 이전에 redux-thunk를 배울 때 thunk함수에서 리액트 라우터의 history 를 사용하는 방법을 배워보았습니다. 

예를 들어서 로그인 요청을 할 때 성공 할 시 특정 주소로 이동시키고, 실패 할 시엔 그대로 유지하는 기능을 구현 해야 된다면, 컨테이너 컴포넌트에서 `withRouter`를 사용해서 구현을 하는 것 보다 사가 내부에서 처리를 하는것이 훨씬 편합니다.

구현 방식은 redux-thunk에서 했던 방식과 꽤나 비슷합니다. 미들웨어를 만들 때 `context`를 설정해주면 추후 사가에서 `getContext` 함수를 통해 조회 할 수 있습니다.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { rootSaga } from './modules';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

const customHistory = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware({
  context: {
    history: customHistory
  }
}); // 사가 미들웨어를 만듭니다.

const store = createStore(
  rootReducer,
  // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
  composeWithDevTools(
    applyMiddleware(
      ReduxThunk.withExtraArgument({ history: customHistory }),
      sagaMiddleware, // 사가 미들웨어를 적용하고
      logger
    )
  )
); // 여러개의 미들웨어를 적용 할 수 있습니다.

sagaMiddleware.run(rootSaga); // 루트 사가를 실행해줍니다.
// 주의: 스토어 생성이 된 다음에 위 코드를 실행해야합니다.

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

그 다음엔, `GOTO_HOME` 이라는 액션이 디스패치 되면 `/` 경로로 이동하는 기능을 사가로 구현을 해보겠습니다.

#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import {
  reducerUtils,
  handleAsyncActions,
  handleAsyncActionsById,
  createPromiseSaga,
  createPromiseSagaById
} from '../lib/asyncUtils';
import { takeEvery, getContext } from 'redux-saga/effects';

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';
const GO_TO_HOME = 'GO_TO_HOME';

export const getPosts = () => ({ type: GET_POSTS });
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });
export const goToHome = () => ({ type: GO_TO_HOME });

const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);
function* goToHomeSaga() {
  const history = yield getContext('history');
  history.push('/');
}
// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
}

(...)
```

이제 `GO_TO_HOME` 액션이 디스패치되면 / 경로로 이동 될 것입니다.

> 지금까지의 코드는 [여기](https://codesandbox.io/s/dxiz0)서 확인 할 수 있습니다.