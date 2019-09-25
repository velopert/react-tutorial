## 6. API 재로딩 문제 해결하기

이번에는, 사용자에게 나쁜 경험을 제공 할 수 있는 API 재로딩 문제를 해결해보도록 하겠습니다.

### 포스트 목록 재로딩 문제 해결하기

포스트 목록이 재로딩 되는 문제를 해결하는 방법은 두가지가 있습니다. 첫번째는 만약 데이터가 이미 존재한다면 요청을 하지 않도록 하는 방법입니다. 한번 PostListContainer를 다음과 같이 수정해보세요.


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
    if (data) return;
    dispatch(getPosts());
  }, [data, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;
  return <PostList posts={data} />;
}

export default PostListContainer;
```

이렇게 하고나면 포스트 목록이 이미 있는데 재로딩하는 이슈를 수정 할 수 있습니다.

두번째 방법은 로딩을 새로하긴 하는데, 로딩중... 을 띄우지 않는 것입니다. 두번째 방법의 장점은 사용자에게 좋은 경험을 제공하면서도 뒤로가기를 통해 다시 포스트 목록을 조회 할 때 최신 데이터를 보여줄 수 있다는 것 입니다.

우선, asyncUtils.js 의 handleAsyncActions 함수를 다음과 같이 수정해주세요.

#### lib/asyncUtils.js - handleAsyncActions.js
```javascript
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
          [key]: reducerUtils.error(action.error)
        };
      default:
        return state;
    }
  };
};
```

`keepData` 라는 파라미터를 추가하여 만약 이 값이 `true`로 주어지면 로딩을 할 때에도 데이터를 유지하도록 수정을 해주었습니다.

이제 posts 리덕스 모듈의 리듀서 부분도 다음과 같이 수정해보세요.

#### modules/posts.js - posts 리듀서
```javascript
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, 'posts', true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActions(GET_POST, 'post')(state, action);
    default:
      return state;
  }
}
```

그리고 나서 PostListContainer를 다음과 같이 수정해주세요.


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

  if (loading && !data) return <div>로딩중...</div>; // 로딩중이면서, 데이터가 없을 때에만 로딩중... 표시
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <PostList posts={data} />;
}

export default PostListContainer;
```

이렇게 구현을 해주고 나면 뒤로가기를 눌렀을 때 새 데이터를 요청하긴 하지만, '로딩중...'이라는 문구를 보여주지 않게 된답니다.

### 포스트 조회시 재로딩 문제 해결하기

특정 포스트를 조회하는 과정에서 재로딩 문제를 해결하려면, 방금 했던 방식으로는 처리 할 수 없습니다. 왜냐하면 어떤 파라미터가 주어졌냐에 따라 다른 결과물이 있기 때문이죠.

이 문제를 해결하는 방식 또한 두가지가 있습니다.

첫번째 해결방식은 컴포넌트가 언마운트될때 포스트 내용을 비우도록 하는 것 입니다.

이 작업을 하려면 posts 리덕스 모듈에 CLEAR_POST 라는 액션을 준비해주어야 합니다.

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

// 포스트 비우기
const CLEAR_POST = 'CLEAR_POST';

// 아주 쉽게 thunk 함수를 만들 수 있게 되었습니다.
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

export const clearPost = () => ({ type: CLEAR_POST });

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
      return handleAsyncActions(GET_POST, 'post')(state, action);
    case CLEAR_POST:
      return {
        ...state,
        post: reducerUtils.initial()
      };
    default:
      return state;
  }
}
```

그리고 PostContainer 컴포넌트의 useEffect 의 cleanup 함수 (useEffect 에서 반환하는 함수)에서 해당 액션을 디스패치해주면 됩니다.

#### containers/PostContainer.js
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, clearPost } from '../modules/posts';
import Post from '../components/Post';

function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(state => state.posts.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));
    return () => {
      dispatch(clearPost());
    };
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
```

이렇게 해주면, 포스트 페이지에서 떠날때마다 포스트를 비우게 되므로, 다른 포스트를 읽을 때 이전 포스트가 보여지는 문제가 해결되버립니다. 이 방법은 충분히 편하고, 쉽기도 하지만, 한가지 아쉬운점이 있습니다.

바로, 이미 읽었던 포스트를 불러오려고 할 경우에도 새로 요청을 한다는 것이죠.

![](https://i.imgur.com/iwmbFvC.gif)

이 문제를 개선하려면, posts 모듈에서 관리하는 상태의 구조를 바꿔야 합니다.

지금은 다음과 같이 이루어져있는데요.

```javascript
{
  posts: {
    data,
    loading,
    error
  },
  post: {
    data,
    loading,
    error,
  }
}
```

이를 다음과 같이 구성해야합니다.

```javascript
{
  posts: {
    data,
    loading,
    error
  },
  post: {
    '1': {
      data,
      loading,
      error
    },
    '2': {
      data,
      loading,
      error
    },
    [id]: {
      data,
      loading,
      error
    }
  }
}
```

이를 진행하려면 기존에 asyncUtils 에 만든 여러 함수를 커스터마이징 해야하는데요, 기존 함수를 수정하는 대신에 새로운 이름으로 다음 함수들을 작성해주도록 하겠습니다.

1. createPromiseThunkById
2. handleAsyncActionsById

다음 코드를 asyncUtils.js 에 작성해주세요.

이제부터 비동기 작업에 관련된 액션이 어떤 id를 가르키는지 알아야 하는데요, 그렇게 하기 위해서 앞으로 action.meta 값에 id를 넣어주도록 하겠습니다.

#### lib/asyncUtils.js

```javascript
(...)


// 특정 id 를 처리하는 Thunk 생성함수
const defaultIdSelector = param => param;
export const createPromiseThunkById = (
  type,
  promiseCreator,
  // 파라미터에서 id 를 어떻게 선택 할 지 정의하는 함수입니다.
  // 기본 값으로는 파라미터를 그대로 id로 사용합니다.
  // 하지만 만약 파라미터가 { id: 1, details: true } 이런 형태라면
  // idSelector 를 param => param.id 이런식으로 설정 할 수 있곘죠.
  idSelector = defaultIdSelector
) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return param => async dispatch => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      dispatch({ type: ERROR, error: true, payload: e, meta: id });
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

이제 posts 리덕스 모듈을 수정해주세요.

#### modules/posts.js
```javascript
import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import {
  createPromiseThunk,
  reducerUtils,
  handleAsyncActions,
  createPromiseThunkById,
  handleAsyncActionsById
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
export const getPost = createPromiseThunkById(GET_POST, postsAPI.getPostById);

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: {}
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
      return handleAsyncActionsById(GET_POST, 'post')(state, action);
    default:
      return state;
  }
}
```

기존의 CLEAR_POST 액션은 더이상 필요하지 않으므로 제거해주었습니다.

이번에도 우리가 이전에 포스트 목록 재로딩을 방지하기 위해서 했던 것 처럼 아예 요청을 안하는 방법이 있고, 요청은 하지만 로딩중을 보여주지 않는 방법이 있습니다.

이제 PostContainer는 다음과 같이 수정해주세요.

#### containers/PostContainer.js
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../modules/posts';
import Post from '../components/Post';

function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(
    state => state.posts.post[postId]
  ) || {
    loading: false,
    data: null,
    error: null
  }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) return; // 포스트가 존재하면 아예 요청을 하지 않음
    dispatch(getPost(postId));
  }, [postId, dispatch, data]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
```

위 방식은 아예 요청을 하지 않는 방식으로 해결한 것입니다.

만약, 요청은 하지만 로딩중은 다시 보여주지 않는 방식으로 해결하려면 리듀서를 다음과 같이 수정하고

#### modules/posts.js - posts
```javascript
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

PostContainer는 다음과 같이 수정하면 됩니다.

#### containers/PostContainer.js
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../modules/posts';
import Post from '../components/Post';

function PostContainer({ postId }) {
  const { data, loading, error } = useSelector(
    state => state.posts.post[postId]
  ) || {
    loading: false,
    data: null,
    error: null
  }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(postId));
  }, [dispatch, postId]);

  if (loading && !data) return <div>로딩중...</div>; // 로딩중이고 데이터 없을때만
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
```

![](https://i.imgur.com/HtnzvtX.gif)

잘 작동하고 있나요? 

데이터를 제대로 캐싱하고 싶다면 아예 요청을 하지 않는 방식을 택하시고, 포스트 정보가 바뀔 수 있는 가능성이 있다면 새로 불러오긴 하지만 로딩중은 표시하지 않는 형태로 구현을 하시면 되겠습니다.

> 지금까지의 코드는 다음 코드샌드박스에서 확인 할 수 있습니다.
> [![Edit learn-redux-middleware](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/learn-redux-middleware-ty1zy?fontsize=14)