## 5. redux-thunk로 프로미스 다루기

이번에는 redux-thunk를 사용하여 프로미스를 다루는 방법을 알아보겠습니다.

이 튜토리얼은 여러분이 프로미스에 대하여 잘 알고있다는 전제하에 진행됩니다. 혹시나 잘 모르신다면 다음 링크들을 참조하세요.

- https://learnjs.vlpt.us/async/
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise


### 가짜 API 함수 만들기

먼저, Promise 를 사용하여 데이터를 반환하는 가짜 API 함수를 만들어보도록 하겠습니다.

src 디렉터리에 api 디렉터리를 만들고, posts.js 라는 파일을 생성하여 코드를 다음과 같이 작성하세요.

#### api/posts.js

```javascript
// n 밀리세컨드동안 기다리는 프로미스를 만들어주는 함수
const sleep = n => new Promise(resolve => setTimeout(resolve, n));

// 가짜 포스트 목록 데이터
const posts = [
  {
    id: 1,
    title: '리덕스 미들웨어를 배워봅시다',
    body: '리덕스 미들웨어를 직접 만들어보면 이해하기 쉽죠.'
  },
  {
    id: 2,
    title: 'redux-thunk를 사용해봅시다',
    body: 'redux-thunk를 사용해서 비동기 작업을 처리해봅시다!'
  },
  {
    id: 3,
    title: 'redux-saga도 사용해봅시다',
    body:
      '나중엔 redux-saga를 사용해서 비동기 작업을 처리하는 방법도 배워볼 거예요.'
  }
];

// 포스트 목록을 가져오는 비동기 함수
export const getPosts = async () => {
  await sleep(500); // 0.5초 쉬고
  return posts; // posts 배열
};

// ID로 포스트를 조회하는 비동기 함수
export const getPostById = async id => {
  await sleep(500); // 0.5초 쉬고
  return posts.find(post => post.id === id); // id 로 찾아서 반환
};
```


### posts 리덕스 모듈 준비하기

이제, posts 라는 리덕스 모듈을 준비해주겠습니다.

프로미스를 다루는 리덕스 모듈을 다룰 땐 다음과 같은 사항을 고려해야합니다.

1. 프로미스가 시작, 성공, 실패했을때 다른 액션을 디스패치해야합니다.
2. 각 프로미스마다 thunk 함수를 만들어주어야 합니다.
3. 리듀서에서 액션에 따라 로딩중, 결과, 에러 상태를 변경해주어야 합니다.

#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

// thunk 를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없습니다.
// 그냥 thunk 함수에서 바로 액션 객체를 만들어주어도 괜찮습니다.

export const getPosts = () => async dispatch => {
  dispatch({ type: GET_POSTS }); // 요청이 시작됨
  try {
    const posts = postsAPI.getPosts(); // API 호출
    dispatch({ type: GET_POSTS_SUCCESS, posts }); // 성공
  } catch (e) {
    dispatch({ type: GET_POSTS_ERROR, error: e }); // 실패
  }
};

// thunk 함수에서도 파라미터를 받아와서 사용 할 수 있습니다.
export const getPost = id => async dispatch => {
  dispatch({ type: GET_POST }); // 요청이 시작됨
  try {
    const post = postsAPI.getPostById(id); // API 호출
    dispatch({ type: GET_POST_SUCCESS, post }); // 성공
  } catch (e) {
    dispatch({ type: GET_POST_ERROR, error: e }); // 실패
  }
};

const initialState = {
  posts: {
    loading: false,
    data: null,
    error: null
  },
  post: {
    loading: false,
    data: null,
    error: null
  }
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: null
        }
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          loading: true,
          data: action.posts,
          error: null
        }
      };
    case GET_POSTS_ERROR:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: action.error
        }
      };
    case GET_POST:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: null
        }
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        post: {
          loading: true,
          data: action.post,
          error: null
        }
      };
    case GET_POST_ERROR:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
```

코드를 모두 다 작성하셨나요? 반복되는 코드들이 상당히 많지요? 이런 반복되는 코드는 따로 함수화하여 코드를 리팩토링하는 것이 좋은 자세입니다.

### 리덕스 모듈 리팩토링하기

src 디렉터리에 lib 디렉터리를 만들고, 그 안에 asyncUtils.js 파일을 만드세요. 그 다음에 함수들을 다음과 같이 작성해주세요.

#### `lib/asyncUtils.js`
```javascript
// Promise에 기반한 Thunk를 만들어주는 함수입니다.
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성되었습니다.
  // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 됩니다.
  // 예: writeComment({ postId: 1, text: '댓글 내용' });
  return param => async dispatch => {
    // 요청 시작
    dispatch({ type, param });
    try {
      // 결과물의 이름을 payload 라는 이름으로 통일시킵니다.
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload }); // 성공
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true }); // 실패
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
```


이제 이 함수들을 사용하여 기존 posts 모듈을 리팩토링해볼까요?


#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import { createPromiseThunk, reducerUtils } from '../lib/asyncUtils';

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

// 아주 쉽게 thunk 함수를 만들 수 있게 되었습니다.
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial()
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: reducerUtils.loading()
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: reducerUtils.success(action.payload) // action.posts -> action.payload 로 변경됐습니다.
      };
    case GET_POSTS_ERROR:
      return {
        ...state,
        posts: reducerUtils.error(action.error)
      };
    case GET_POST:
      return {
        ...state,
        post: reducerUtils.loading()
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        post: reducerUtils.success(action.payload) // action.post -> action.payload 로 변경됐습니다.
      };
    case GET_POST_ERROR:
      return {
        ...state,
        post: reducerUtils.error(action.error)
      };
    default:
      return state;
  }
}
```


어떤가요? 반복되는 코드가 많이 줄었지요?

그런데 아직 리듀서쪽에서는 여전히 반복되는 코드가 많이 있습니다. 이 또한, 원하신다면 리팩토링 할 수도 있습니다!

asyncUtils.js 에서 `handleAsyncActions` 라는 함수를 다음과 같이 작성해보세요.

#### lib/asyncUtils.js

```javascript
// Promise에 기반한 Thunk를 만들어주는 함수입니다.
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성되었습니다.
  // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 됩니다.
  // 예: writeComment({ postId: 1, text: '댓글 내용' });
  return param => async dispatch => {
    // 요청 시작
    dispatch({ type, param });
    try {
      // 결과물의 이름을 payload 라는 이름으로 통일시킵니다.
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload }); // 성공
    } catch (e) {
      dispatch({ type: ERROR, payload: e, error: true }); // 실패
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
export const handleAsyncActions = (type, key) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading()
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
```

`handleAsyncActions` 함수를 만들어주셨으면, posts 리듀서를 다음과 같이 리팩토링 할 수 있습니다.

최종 리팩토링 결과는 다음과 같습니다.

#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import {
  createPromiseThunk,
  reducerUtils,
  handleAsyncActions
} from '../lib/asyncUtils';

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

// 아주 쉽게 thunk 함수를 만들 수 있게 되었습니다.
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

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
      return handleAsyncActions(GET_POSTS, 'posts')(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActions(GET_POST, 'post')(state, action);
    default:
      return state;
  }
}
```

참고로 다음 코드는

```javascript
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, 'posts')(state, action);
```

이렇게 표현 할 수도 있답니다.

```javascript
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
      return postsReducer(state, action);
```

여러분이 마음에 드는 형태로 코드를 작성하시면 됩니다.

리팩토링이 끝났으면 이제 이 모듈을 루트 리듀서에 등록해줍시다.

#### modules/index.js
```javascript
import { combineReducers } from 'redux';
import counter from './counter';
import posts from './posts';

const rootReducer = combineReducers({ counter, posts });

export default rootReducer;
```

### 포스트 목록 구현하기

이제 포스트 목록을 보여줄 프리젠테이셔널 컴포넌트를 준비해주겠습니다.

#### components/PostList.js
```javascript
import React from 'react';

function PostList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          {post.title}
        </li>
      ))}
    </ul>
  );
}

export default PostList;
```

이제는 PostList 를 위한 컨테이너 컴포넌트인 PostListContainer 를 만들어봅시다.

#### containers/PostListContainer.js
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostList from '../components/PostList';
import { getPosts } from '../modules/posts';

function PostListContainer() {
  const { data, loading, error } = useSelector(state => state.posts.posts);
  const dispatch = useDispatch();

  // 컴포넌트 마운트 후 포스트 목록 요청
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;
  return <PostList posts={data} />;
}

export default PostListContainer;
```

이제 이 컴포넌트를 App 에서 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import PostListContainer from './containers/PostListContainer';

function App() {
  return <PostListContainer />;
}

export default App;
```

비동기 작업이 잘 처리되고 있나요?

![](https://i.imgur.com/W2u4pVz.gif)

> 지금까지의 코드는 [여기](https://codesandbox.io/s/13yow)서 모두 확인 할 수 있습니다.

### 리액트 라우터 적용하기

이제 리액트 라우터를 프로젝트에 적용해서 특정 포스트를 읽는 기능도 구현해보겠습니다.

리액트 라우터를 설치해주세요.

```bash
$ yarn add react-router-dom
```

그리고 index.js 를 다음과 같이 구현해주세요.

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
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

const store = createStore(
  rootReducer,
  // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
  composeWithDevTools(applyMiddleware(ReduxThunk, logger))
); // 여러개의 미들웨어를 적용 할 수 있습니다.

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

### 포스트 조회하기

이번에는 포스트 하나를 조회하는 기능을 구현해보겠습니다. 우선 프리젠테이셔널 컴포넌트 Post.js 를 만들어주세요.

#### components/Post.js

```javascript
import React from 'react';

function Post({ post }) {
  const { title, body } = post;
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

export default Post;
```

이제 PostContainer 컴포넌트도 만들어보겠습니다.

#### containers/PostContainer.js

```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../modules/posts';
import Post from '../components/Post';

function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(state => state.posts.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
```


이 컴포넌트는 `postId` 값을 props로 받아옵니다. 해당 값은 라우트의 URL 파라미터에서 읽어올 것입니다.


### 라우트 설정하기

이제 라우트를 설정해봅시다. pages 디렉터리에 PostListPage.js 와 PostPage.js 를 다음과 같이 작성해주세요.

#### pages/PostListPage.js
```javascript
import React from 'react';
import PostListContainer from '../containers/PostListContainer';

function PostListPage() {
  return <PostListContainer />;
}

export default PostListPage;
```


#### pages/PostPage.js
```javascript
import React from 'react';
import PostContainer from '../containers/PostContainer';

function PostPage({ match }) {
  const { id } = match.params; // URL 파라미터 조회하기

  // URL 파라미터 값은 문자열이기 때문에 parseInt 를 사용하여 숫자로 변환해주어야 합니다.
  return <PostContainer postId={parseInt(id, 10)} />;
}

export default PostPage;
```

페이지 관련 컴포넌트들을 모두 다 작성하셨으면, App 에서 라우트 설정을 해봅시다.

#### App.js
```javascript
import React from 'react';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <>
      <Route path="/" component={PostListPage} exact={true} />
      <Route path="/:id" component={PostPage} />
    </>
  );
}

export default App;
```

그 다음에는, PostList 를 열어서 Link 컴포넌트를 사용해주세요.


#### components/PostList.js
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function PostList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
```

이제 특정 포스트를 읽는 작업도 잘 작동하는지 확인해보세요.

![](https://i.imgur.com/8a7uQJQ.gif)

잘 작동하긴 하는데 두 가지 문제점이 있습니다. 위 스크린 녹화 결과에서도 확인 할 수 있는데요,

1. 특정 포스트를 열은다음에 뒤로 갔을 때, 포스트 목록을 또 다시 불러오게 되면서 로딩중...이 나타나게 됩니다.
2. 특정 포스트를 읽고, 뒤로 간 다음에 다른 포스트를 열면 이전에 열었던 포스트가 잠깐 보여졌다가 로딩중... 이 보여지게됩니다.

위 두가지 문제로 인하여 사용자에게 좋지 못한 경험을 제공하게 될 수 있습니다.

이 문제를 해결하는 방법은 다음 섹션에서 다뤄보도록 하겠습니다.

> 지금까지 작성한 코드들은 다음 코드 샌드박스에서 확인 할 수 있습니다.
> [![Edit learn-redux-middleware](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/learn-redux-middleware-jm03o?fontsize=14)