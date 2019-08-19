## 7. thunk에서 라우터 연동하기

프로젝트를 개발하다보면, thunk 함수 내에서 라우터를 사용해야 될 때도 있습니다. 예를 들자면, 로그인 요청을 하는데 로그인이 성공 할 시 `/` 경로로 이동시키고, 실패 할 시 경로를 유지 하는 형태로 구현 할 수도 있죠.

이번엔 그러한 상황엔 어떻게 구현을 해야하는지 알아보도록 하겠습니다.

일단, 컨테이너 컴포넌트내에서 그냥 단순히 [withRouter](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md)를 사용해서 props 로 `history` 를 가져와서 사용해도 상관은 없습니다. 하지만 thunk에서 처리를 하면 코드가 훨씬 깔끔해질 수 있습니다. 취향에 따라 택하시면 됩니다.

### customHistory 만들어서 적용하기

thunk 에서 라우터의 history 객체를 사용하려면, BrowserHistory 인스턴스를 직접 만들어서 적용해야합니다. index.js 를 다음과 같이 수정해주세요.

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
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const customHistory = createBrowserHistory();

const store = createStore(
  rootReducer,
  // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
  composeWithDevTools(applyMiddleware(ReduxThunk, logger))
); // 여러개의 미들웨어를 적용 할 수 있습니다.

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

그리고, redux-thunk 의 `withExtraArgument` 를 사용하면 thunk함수에서 사전에 정해준 값들을 참조 할 수 있습니다.

스토어를 만드는 코드를 다음과 같이 변경해주세요.


#### index.js - 스토어 인스턴스 생성
```javascript
const store = createStore(
  rootReducer,
  // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
  composeWithDevTools(
    applyMiddleware(
      ReduxThunk.withExtraArgument({ history: customHistory }),
      logger
    )
  )
); // 여러개의 미들웨어를 적용 할 수 있습니다.
```

### 홈 화면으로 가는 thunk 만들기
이제 홈 화면으로 가는 thunk를 작성해보도록 하겠습니다.

해당 함수를 posts 모듈에 추가해주세요.
#### modules/posts.js - goToHome
```javascript
// 3번째 인자를 사용하면 withExtraArgument 에서 넣어준 값들을 사용 할 수 있습니다.
export const goToHome = () => (dispatch, getState, { history }) => {
  history.push('/');
};
```

이제 PostContainer.js 에서 이 thunk 를 디스패치해볼까요?

#### containers/PostContainer.js
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, goToHome } from '../modules/posts';
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

  return (
    <>
      <button onClick={() => dispatch(goToHome())}>홈으로 이동</button>
      <Post post={data} />
    </>
  );
}

export default PostContainer;
```

![](https://i.imgur.com/qbkUppG.gif)

이제 잘 작동하는지 확인해보세요.

지금은 단순히 다른 작업을 하지 않고 바로 홈으로 이동하게끔 했지만, 실제 프로젝트에서는 `getState()` 를 사용하여 현재 리덕스 스토어의 상태를 확인하여 조건부로 이동을 하거나, 특정 API를 호출하여 성공했을 시에만 이동을 하는 형식으로 구현을 할 수 있답니다.

![](https://codesandbox.io/s/nob8f)