## 11. redux-saga 로 프로미스 다루기

이번에는 redux-saga를 사용하여 프로미스를 다루는 방법을 배워보도록 하겠습니다. 우리가 이전에 redux-thunk를 배울 때에는 thunk함수를 만들어서 이 함수가 디스패치 될 때 비동기 작업을 처리하고, 액션 객체를 디스패치하거나 스토어의 현재 상태를 조회 할 수도 있죠.

redux-thunk를 배울 때 사용했던 thunk 함수를 다시 한번 확인해볼까요?

```javascript
export const getPosts = () => async dispatch => {
  dispatch({ type: GET_POSTS }); // 요청이 시작됨
  try {
    const posts = await postsAPI.getPosts(); // API 호출
    dispatch({ type: GET_POSTS_SUCCESS, posts }); // 성공
  } catch (e) {
    dispatch({ type: GET_POSTS_ERROR, error: e }); // 실패
  }
};
```

redux-thunk에서는 이렇게 함수를 만들어서 해당 함수에서 비동기 작업을 하고 필요한 시점에 특정 액션을 디스패치합니다. redux-saga는 비동기 작업을 처리 할 때 다른 방식으로 처리합니다.

redux-saga에서는 특정 액션을 모니터링하도록 하고, 해당 액션이 주어지면 이에 따라 제너레이터 함수를 실행하여 비동기 작업을 처리 후 액션을 디스패치합니다.

기존에 redux-thunk로 구현했던 posts 모듈을 redux-saga로 구현해봅시다.

#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import {
  reducerUtils,
  handleAsyncActions,
  handleAsyncActionsById
} from '../lib/asyncUtils';
import { call, put, takeEvery } from 'redux-saga/effects';

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

export const getPosts = () => ({ type: GET_POSTS });
// payload는 파라미터 용도, meta는 리듀서에서 id를 알기위한 용도
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });

function* getPostsSaga() {
  try {
    const posts = yield call(postsAPI.getPosts); // call 을 사용하면 특정 함수를 호출하고, 결과물이 반환 될 때까지 기다려줄 수 있습니다.
    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts
    }); // 성공 액션 디스패치
  } catch (e) {
    yield put({
      type: GET_POSTS_ERROR,
      error: true,
      payload: e
    }); // 실패 액션 디스패치
  }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용 할 수 있습니다.
function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;
  try {
    const post = yield call(postsAPI.getPostById, param); // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 됩니다.
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id
    });
  } catch (e) {
    yield put({
      type: GET_POST_ERROR,
      error: true,
      payload: e,
      meta: id
    });
  }
}

// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

// 3번째 인자를 사용하면 withExtraArgument 에서 넣어준 값들을 사용 할 수 있습니다.
export const goToHome = () => (dispatch, getState, { history }) => {
  history.push('/');
};

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, 'posts', true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionsById(GET_POST, 'post', true)(state, action);
    default:
      return state;
  }
}
```

> 기존 redux-thunk 튜토리얼을 생략하고 바로 이 튜토리얼로 오신 분들을 위해 미리 설명 드리자면, 여기서 사용된 asyncUtils.js 는 [여기](https://gist.github.com/velopert/36505bad9fc5e38d1be49f3c3263ff30)에서 확인 할 수 있습니다. 

기존에 redux-thunk로 구현 할 때에는 `getPosts` 와 `getPost` 는 thunk 함수였는데, 이제는 redux-saga를 사용하니까 순수 액션 객체를 반환하는 액션 생성 함수로 구현 할 수 있습니다.

액션을 모니터링해서 특정 액션이 발생했을 때 호출할 사가 함수에서는 파라미터로 해당 액션을 받아올 수 있습니다. 그래서 `getPostSaga`의 경우엔 액션을 파라미터로 받아와서 해당 액션의 `id` 값을 참조 할 수 있죠.

예를 들어서, `dispatch({ type: GET_POST, payload: 1, meta: 1 })`이란 코드가 실행 되면 액션에서 `action.payload`값을 추출하여 API를 호출 할 때 인자로 넣어서 호출하는 것 입니다. 여기서 `meta` 값이 있는 이유는 우리가 이전에 만들었던 `handleAsyncActionsById` 를 호환시키기 위함입니다. 만약 `handleAsyncActionsById`를 사용하지 않는다면 `meta` 를 생략하셔도 됩니다. 그리고 추후 우리가 리팩토링 과정에서 프로미스를 처리하는 사가 함수를 쉽게 만드는 함수를 만들건데요, 만약에 리팩토링을 하지 않을거라면 사실상 `{ type: GET_POST, id }` 이런식으로 파라미터를 꼭 `payload` 라고 설정 할 필요는 없습니다.

코드를 다 작성하셨다면 rootSaga에 우리가 방금 만든 postsSaga를 등록해주세요.

#### `modules/index.js`
```javascript
import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import posts, { postsSaga } from './posts';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({ counter, posts });
export function* rootSaga() {
  yield all([counterSaga(), postsSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

export default rootReducer;
```

이제 기존의 컨테이너 컴포넌트들이 잘 작동하는지 확인해보세요. redux-saga를 사용하면 이렇게 순수 액션 객체만을 디스패치해서 비동기 작업을 처리 할 수 있게 됩니다.


> 지금까지의 코드는 [여기](https://codesandbox.io/s/mpltq)서 확인 할 수 있습니다.

### 프로미스를 처리하는 사가 리팩토링

기존에 우리가 작성했던 사가함수들을 다시 확인해봅시다.

```javascript
function* getPostsSaga() {
  try {
    const posts = yield call(postsAPI.getPosts); // call 을 사용하면 특정 함수를 호출하고, 결과물이 반환 될 때까지 기다려줄 수 있습니다.
    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts
    }); // 성공 액션 디스패치
  } catch (e) {
    yield put({
      type: GET_POSTS_ERROR,
      error: true,
      payload: e
    }); // 실패 액션 디스패치
  }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용 할 수 있습니다.
function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;
  try {
    const post = yield call(postsAPI.getPostById, param); // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 됩니다.
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id
    });
  } catch (e) {
    yield put({
      type: GET_POST_ERROR,
      error: true,
      payload: e,
      meta: id
    });
  }
}
```

우리가 까다로운 사가 함수를 만들게 될 때에는 사가 함수 안에서 여러 종류의 비동기 작업을 할 수 있습니다. 하지만, 우리가 방금 만든 기능 처럼 단순히 하나의 API를 요청해서 결과물을 가지고 액션을 디스패치 하는일이 꽤나 많이 발생하기도 합니다.

까다로운 작업을 할 때에는 사가 함수를 직접 작성하고, 지금처럼 간단한 비동기 작업을 처리 할 때에는 우리가 이전에 redux-thunk를 배울 때 `createPromiseThunk`, `createPromiseThunkById` 를 만들어서 사용했던 것 처럼 비슷한 방식으로 반복되는 로직들을 함수화 하여 재사용하면 훨씬 깔끔한 코드로 작성을 할 수 있고, 생산성도 높일 수 있습니다.

그럼, `createPromiseSaga`와 `createPromiseSagaById`를 작성해보도록 하겠습니다.

기존 `createPromiseThunk`, `createPromiseSaga` 는 지우도록 하겠습니다(원하시면 유지하시거나 주석처리만 하셔도 좋습니다). 참고로 `handleAsyncActions` 와 `handleAsyncActionsById`는 변동사항 없습니다.

#### lib/asyncUtils.js
```javascript
import { call, put } from 'redux-saga/effects';

// 프로미스를 기다렸다가 결과를 디스패치하는 사가
export const createPromiseSaga = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    try {
      // 재사용성을 위하여 promiseCreator 의 파라미터엔 action.payload 값을 넣도록 설정합니다.
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload });
    } catch (e) {
      yield put({ type: ERROR, error: true, payload: e });
    }
  };
};

// 특정 id의 데이터를 조회하는 용도로 사용하는 사가
// API를 호출 할 때 파라미터는 action.payload를 넣고,
// id 값을 action.meta로 설정합니다.
export const createPromiseSagaById = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    const id = action.meta;
    try {
      const payload = yield call(promiseCreator, action.payload);
      yield put({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      yield put({ type: ERROR, error: e, meta: id });
    }
  };
};

// 리듀서에서 사용 할 수 있는 여러 유틸 함수들입니다.
export const reducerUtils = {
  // 초기 상태. 초기 data 값은 기본적으로 null 이지만
  // 바꿀 수도 있습니다.
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null
  }),
  // 로딩중 상태. prevState의 경우엔 기본값은 null 이지만
  // 따로 값을 지정하면 null 로 바꾸지 않고 다른 값을 유지시킬 수 있습니다.
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null
  }),
  // 성공 상태
  success: payload => ({
    loading: false,
    data: payload,
    error: null
  }),
  // 실패 상태
  error: error => ({
    loading: false,
    data: null,
    error: error
  })
};

// 비동기 관련 액션들을 처리하는 리듀서를 만들어줍니다.
// type 은 액션의 타입, key 는 상태의 key (예: posts, post) 입니다.
export const handleAsyncActions = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(keepData ? state[key].data : null)
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload)
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload)
        };
      default:
        return state;
    }
  };
};

// id별로 처리하는 유틸함수
export const handleAsyncActionsById = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    const id = action.meta;
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              // state[key][id]가 만들어져있지 않을 수도 있으니까 유효성을 먼저 검사 후 data 조회
              keepData ? state[key][id] && state[key][id].data : null
            )
          }
        };
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload)
          }
        };
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload)
          }
        };
      default:
        return state;
    }
  };
};
```

이제 사가를 통해 비동기 작업을 처리 할 때에는 API 함수의 인자는 액션에서부터 참조합니다. 액션 객체에서 사용 할 함수의 인자의 이름은 `payload` 로 통일 시키도록 하겠습니다. 그리고, 특정 id를 위한 비동기작업을 처리하는 `createPromiseSagaById`와 `handleAsyncActionsById`에서는 id 값을 `action.meta` 에서 참조하도록 하겠습니다.

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
import { takeEvery } from 'redux-saga/effects';

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

export const getPosts = () => ({ type: GET_POSTS });
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });

const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);

// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

// 3번째 인자를 사용하면 withExtraArgument 에서 넣어준 값들을 사용 할 수 있습니다.
export const goToHome = () => (dispatch, getState, { history }) => {
  history.push('/');
};

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, 'posts', true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionsById(GET_POST, 'post', true)(state, action);
    default:
      return state;
  }
}
```

코드가 훨씬 깔끔해졌지요? 매번 API 함수 호출을 위한 사가를 준비 할 때마다 사가 함수를 매번 직접 작성하는 것 보단, 간단한 로직을 가지고 있는 사가 함수의 경우 우리가 만든 유틸 함수로 새로운 사가를 손쉽게 만들어서 쓰면 굉장히 편합니다.

> 지금까지의 코드는 [여기](https://codesandbox.io/s/391ur)서 확인 할 수 있습니다.
