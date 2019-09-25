# 6. 타입스크립트에서 리덕스 미들웨어 사용하기 (redux-thunk, redux-saga)

이번 튜토리얼에서는 redux-thunk 또는 redux-saga 미들웨어를 타입스크립트 환경에서 사용 할 때에는 어떻게 사용하는지 알아보도록 하겠습니다. 만약에 redux-thunk 및 redux-saga를 다루는 방법을 잘 모르신다면 [리덕스 미들웨어](https://react.vlpt.us/redux-middleware/) 튜토리얼을 먼저 읽어주세요.

리덕스 미들웨어를 사용하기 위하여 편의상 [이전 튜토리얼](./05-ts-redux.md)에서 사용하던 프로젝트를 재사용하겠습니다. 만약 이전 튜토리얼을 진행하지 않으셨다면 이전 튜토리얼을 참고하여 리덕스를 적용한 프로젝트를 새로 만드시거나, 다음 명령어를 사용하여 프로젝트를 준비해주세요.

```bash
$ git clone https://github.com/velopert/ts-react-redux-tutorial.git --branch refactor/counter2
```

## redux-thunk 적용하기

먼저, redux-thunk 를 타입스크립트와 함께 사용하는 방법을 배워봅시다. 해당 라이브러리를 설치해주세요.

```bash
$ yarn add redux-thunk
```

redux-thunk는 공식적으로 타입스크립트 지원이 되므로 @types/redux-thunk 를 따로 설치하실 필요 없습니다.

그리고 우리가 API 요청을 실제로 해볼 것이기 때문에 axios 를 설치해주세요.

```bash
$ yarn add axios
```

axios 또한 타입스크립트 지원이 공식적으로 되므로 @types/axios 를 설치하실 필요가 없습니다.

설치를 다 하셨으면 스토어에 미들웨어를 적용해보겠습니다.

#### src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import rootReducer from './modules';

const store = createStore(rootReducer, applyMiddleware(Thunk));

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

### GitHub 사용자 정보 가져오기

우리는 GitHub의 사용자 정보를 가져오는 기능을 구현해보도록 하겠습니다. GitHub의 사용자 정보를 가져올 떄에는 다음 API 를 사용합니다.

```
GET https://api.github.com/users/:username
```

`:username` 이 있는 자리에 여러분이 조회하고자 하는 사용자의 유저네임 (예: velopert) 를 넣으시면 됩니다. 다음과 같이 말이죠.

```
GET https://api.github.com/users/velopert
```

참고로 결과물은 다음과 같습니다.

```javascript
{
    "login": "velopert",
    "id": 17202261,
    "node_id": "MDQ6VXNlcjE3MjAyMjYx",
    "avatar_url": "https://avatars0.githubusercontent.com/u/17202261?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/velopert",
    "html_url": "https://github.com/velopert",
    "followers_url": "https://api.github.com/users/velopert/followers",
    "following_url": "https://api.github.com/users/velopert/following{/other_user}",
    "gists_url": "https://api.github.com/users/velopert/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/velopert/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/velopert/subscriptions",
    "organizations_url": "https://api.github.com/users/velopert/orgs",
    "repos_url": "https://api.github.com/users/velopert/repos",
    "events_url": "https://api.github.com/users/velopert/events{/privacy}",
    "received_events_url": "https://api.github.com/users/velopert/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Minjun Kim",
    "company": "@laftel-team ",
    "blog": "https://velopert.com/",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": "개발은 언제나 즐겁고 재밌어야 한다는 생각을 갖고 있는 개발자이며, 가르치는것을 굉장히 좋아하는 교육자이기도 합니다.",
    "public_repos": 64,
    "public_gists": 31,
    "followers": 1016,
    "following": 16,
    "created_at": "2016-02-12T16:43:22Z",
    "updated_at": "2019-09-04T16:23:39Z"
}
```

우리를 응답된 데이터에 대한 타입도 준비를 해주어야 하는데요, 이렇게 많은 종류의 데이터를 하나하나 직접 하기엔 번거로울수도 있습니다. 그럴 땐, [Quicktype](https://app.quicktype.io/?l=ts)라는 서비스를 사용하여 JSON 을 바로 타입스크립트 인터페이스로 변환 할 수 있습니다.

참고로, [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype)도 있습니다.

![](https://i.imgur.com/YLnloXu.png)

물론, 때에 따라 변환된 것을 그대로 복사해서 사용하면 안되고, 일부 값들은 수작업으로 조금 변경을 해줘야 할 수도 있습니다. 예를 들어 제가 복사한 JSON 안에 있는 `email` 값은 현재 `null`이지만, [GitHub API 토큰](https://github.com/settings/tokens)을 사용하여 인증된 계정을 통해 API 를 요청하게 되면 `email` 쪽에 문자열이 올 수도 있습니다. 여러분이 만약 실무에서 타입스크립트를 사용하고, 백엔드와 연동을 하게 될 때에도 비슷한 상황이 있을 수 있겠지요? 때문에 변환된 인터페이스를 그대로 사용하면 안되고, 실제 사용 케이스에 맞춰서 조금씩 변경해야 할 필요가 있을 수도 있다는 점 잘 기억해두세요.

지금은 그냥 그대로 사용을 하도록 하겠습니다.

src 디렉터리에 api 디렉터리를 만들고, github.ts 라는 파일을 생성 후 다음과 같이 코드를 작성해주세요.

#### src/api/github.ts
```javascript
import axios from 'axios';

export async function getUserProfile(username: string) {
  // Generic 을 통해 응답 데이터의 타입을 설정 할 수 있습니다.
  const response = await axios.get<GithubProfile>(
    `https://api.github.com/users/${username}`
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export interface GithubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: null;
  email: null;
  hireable: null;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}
```

### github 리덕스 모듈 만들기

이제 github 이라는 리덕스 모듈을 준비해봅시다. modules 디렉터리에 github 디렉터리를 만들고, 그 안에 액션부터 정의를 해봅시다.

#### 액션 정의하기

#### src/modules/github/actions.ts
```javascript
import { createStandardAction } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';
import { AxiosError } from 'axios';

export const GET_USER_PROFILE = 'github/GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'github/GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_ERROR = 'github/GET_USER_PROFILE_ERROR';

export const getUserProfile = createStandardAction(GET_USER_PROFILE)();
export const getUserProfileSuccess = createStandardAction(GET_USER_PROFILE_SUCCESS)<GithubProfile>();
export const getUserProfileError = createStandardAction(GET_USER_PROFILE_ERROR)<AxiosError>();
```

여기서 `GET_USER_PROFILE` 의 용도는 요청이 시작됐을 때 디스패치되는 액션이고, 나머지 두개의 액션들은 성공 / 실패 했을때 디스패치되는 액션들입니다.

typesafe-actions 에는 [createAsyncAction](https://www.npmjs.com/package/typesafe-actions#createasyncaction) 라는 유틸함수가 있는데요, 이를 사용하면 위 코드를 다음과 같이 리팩토링 할 수 있답니다.

#### src/modules/github/actions.ts
```javascript
import { createAsyncAction } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';
import { AxiosError } from 'axios';

export const GET_USER_PROFILE = 'github/GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'github/GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_ERROR = 'github/GET_USER_PROFILE_ERROR';

export const getUserProfileAsync = createAsyncAction(
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_ERROR
)<undefined, GithubProfile, AxiosError>();
```

이 유틸함수를 꼭 사용 할 필요는 없지만, 만약에 이 형태의 코드가 맘에 드신다면 잘 활용하시면 반복되는 코드를 덜 입력할 수 있어서 편합니다.

#### thunk 함수 작성하기

액션을 모두 작성하셨다면, 이제 thunk 함수를 만들어줍시다.

modules/github 디렉터리에 thunks.ts 파일을 만드시고 다음 코드를 작성하세요.


#### modules/github/thunks.ts
```javascript
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { GithubAction } from './types';
import { getUserProfile } from '../../api/github';
import { getUserProfileAsync } from './actions';

export function getUserProfileThunk(username: string): ThunkAction<void, RootState, null, GithubAction> {
  return async dispatch => {
    const { request, success, failure } = getUserProfileAsync;
    dispatch(request());
    try {
      const userProfile = await getUserProfile(username);
      dispatch(success(userProfile));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}
```

`ThunkAction` 의 Generics 로는 다음 값들을 순서대로 넣어주어야 합니다. `<TReturnType, TState, TExtraThunkArg, TBasicAction>`

1. **TReturnType**: thunk 함수에서 반환하는 값의 타입을 설정합니다.
2. **TState**: 스토어의 상태에 대한 타입을 설정합니다.
3. **TExtraThunkArg**: redux-thunk 미들웨어의 [Extra Argument](https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument)의 타입을 설정합니다.
4. **TBasicAction**: dispatch 할 수 있는 액션들의 타입을 설정합니다.

TReturnType 의 경우 아무것도 반환하지 않는다면 `void` 라고 넣으시면 됩니다. 현재 상황에서는 thunk 함수에서 `async` 를 사용하고 있으니 `Promise<void>`가 더 정확합니다. 하지만 그냥 `void` 라고 입력해도 문제가 되지는 않습니다.


#### 리듀서 작성하기

이제 리듀서를 작성해줄건데요, 리듀서를 작성하기전에 우선 github 리덕스 모듈에서 관리 할 상태에 대한 타입을 선언해주세요.

#### src/modules/github/types.ts
```javascript
import * as actions from './actions';
import { ActionType } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';

export type GithubAction = ActionType<typeof actions>;

export type GithubState = {
  userProfile: {
    loading: boolean;
    error: Error | null;
    data: GithubProfile | null;
  };
};
```

그 다음 리듀서를 작성하세요. 리듀서는 reducer.ts 파일을 만들어서 작성하시면 됩니다.

#### src/modules/github/reducer.ts
```javascript
import { createReducer } from 'typesafe-actions';
import { GithubState, GithubAction } from './types';
import { GET_USER_PROFILE, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_ERROR } from './actions';

const initialState: GithubState = {
  userProfile: {
    loading: false,
    error: null,
    data: null
  }
};

const github = createReducer<GithubState, GithubAction>(initialState, {
  [GET_USER_PROFILE]: state => ({
    ...state,
    userProfile: {
      loading: true,
      error: null,
      data: null
    }
  }),
  [GET_USER_PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    userProfile: {
      loading: false,
      error: null,
      data: action.payload
    }
  }),
  [GET_USER_PROFILE_ERROR]: (state, action) => ({
    ...state,
    userProfile: {
      loading: false,
      error: action.payload,
      data: null
    }
  })
});

export default github;
```

리듀서 작성도 모두 끝났습니다. 앞으로 API 한번 요청 할 때마다 이런 작업을 해주어야 하는데요, 그러면 비슷한 코드가 엄청나게 많이 늘어나겠지요? 걱정 마세요! 나중에 리팩토링해줄겁니다.

리듀서 작성이 끝나셨으면 github 디렉터리에 index.ts 를 만들어서 우리가 만든 리듀서, 액션, 타입, thunk 함수를 불러와서 내보내주세요.

#### src/modules/github/index.ts

```javascript
export { default } from './reducer';
export * from './actions';
export * from './types';
export * from './thunks';
```

그 다음에는 github 리듀서를 루트 리듀서에 등록해주세요.

#### src/modules/index.ts
```javascript
import { combineReducers } from 'redux';
import counter from './counter';
import todos from './todos';
import github from './github';

const rootReducer = combineReducers({
  counter,
  todos,
  github
});

// 루트 리듀서를 내보내주세요.
export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;
```

### GitHub 사용자 정보를 불러오기 위한 프리젠테이셔널 컴포넌트 준비

GitHub 사용자 정보를 불러오기 위한 프리젠테이셔널 컴포넌트를 준비해봅시다!

첫번째 컴포넌트 GithubUsernameForm 에서는 사용자 계정명을 입력 할 수 있는 인풋과, 클릭하면 정보를 조회해주는 버튼을 만들어주도록 하겠습니다. 스타일 없이 만들면 심심하니까 스타일 코드도 조금 작성하겠습니다.

#### src/components/GithubUsernameForm.tsx

```javascript
import React, { FormEvent, useState, ChangeEvent } from 'react';
import './GithubUsernameForm.css';

type GithubUsernameFormProps = {
  onSubmitUsername: (username: string) => void;
};

function GithubUsernameForm({ onSubmitUsername }: GithubUsernameFormProps) {
  const [input, setInput] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitUsername(input);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form className="GithubUsernameForm" onSubmit={onSubmit}>
      <input onChange={onChange} value={input} placeholder="Github 계정명을 입력하세요." />
      <button type="submit">조회</button>
    </form>
  );
}

export default GithubUsernameForm;
```

#### src/components/GithubUsernameForm.css

스타일 파일도 작성해줍시다!

```css
.GithubUsernameForm {
  width: 400px;
  display: flex;
  align-items: center;
  height: 32px;
  margin: 0 auto;
  margin-top: 16px;
  margin-bottom: 48px;
}

.GithubUsernameForm input {
  flex: 1;
  border: none;
  outline: none;
  border-bottom: 1px solid black;
  font-size: 21px;
  height: 100%;
  margin-right: 1rem;
}

.GithubUsernameForm button {
  background: black;
  color: white;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 16px;
  padding-right: 16px;
  height: 100%;
  font-weight: bold;
}

.GithubUsernameForm button:hover {
  background: #495057;
}
```

그 다음에는, 사용자 계정에 대한 정보를 보여줄 GithubProfileInfo 라는 컴포넌트를 만들어보겠습니다.

#### src/components/GithubProfileInfo.tsx
```javascript
import React from 'react';
import './GithubProfileInfo.css';

type GithubProfileInfoProps = {
  name: string;
  thumbnail: string;
  bio: string;
  blog: string;
};

function GithubProfileInfo({ name, thumbnail, bio, blog }: GithubProfileInfoProps) {
  return (
    <div className="GithubProfileInfo">
      <div className="profile-head">
        <img src={thumbnail} alt="user thumbnail" />
        <div className="name">{name}</div>
      </div>
      <p>{bio}</p>
      <div>{blog !== '' && <a href={blog}>블로그</a>}</div>
    </div>
  );
}

export default GithubProfileInfo;
```
이 컴포넌트에서는 이름, 프로필 사진, 자기소개, 그리고 블로그 링크를 보여줍니다. 블로그 링크의 경우엔 없는 경우도 있으니 있을 때에만 렌더링하도록 설정해주었습니다.

스타일도 작성해주세요

#### src/components/GithubProfileInfo.css
```javascript
.GithubProfileInfo {
  width: 400px;
  margin: 0 auto;
}

.GithubProfileInfo .profile-head {
  display: flex;
  align-items: center;
}

.GithubProfileInfo .profile-head img {
  display: block;
  width: 64px;
  height: 64px;
  border-radius: 32px;
  margin-right: 1rem;
}

.GithubProfileInfo .profile-head .name {
  font-weight: bold;
}

```

### Github 사용자 정보를 불러오기 위한 컨테이너 만들기

자, 이번에는 Github 사용자를 불러오기 위한 컨테이너를 만들어봅시다. 컨테이너 컴포넌트의 이름은 GithubProfileLoader 라고 하겠습니다.

#### src/containers/GithubProfileLoader.tsx
```javascript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import GithubUsernameForm from '../components/GithubUsernameForm';
import GithubProfileInfo from '../components/GithubProfileInfo';
import { getUserProfileThunk } from '../modules/github';

function GithubProfileLoader() {
  const { data, loading, error } = useSelector((state: RootState) => state.github.userProfile);
  const dispatch = useDispatch();

  const onSubmitUsername = (username: string) => {
    dispatch(getUserProfileThunk(username));
  };

  return (
    <>
      <GithubUsernameForm onSubmitUsername={onSubmitUsername} />
      {loading && <p style={{ textAlign: 'center' }}>로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <GithubProfileInfo bio={data.bio} blog={data.blog} name={data.name} thumbnail={data.avatar_url} />}
    </>
  );
}

export default GithubProfileLoader;
```

이제 App 컴포넌트에서 방금 만든 컨테이너를 렌더링하고 잘 작동하는지 확인해보세요. 


#### src/App.tsx
```javascript
import React from 'react';

import GithubProfileLoader from './containers/GithubProfileLoader';

const App: React.FC = () => {
  return <GithubProfileLoader />;
};

export default App;
```

인풋에는 여러분의 Github 계정명을 적어보시거나, 만약 Github 계정이 없으시다면 제 계정명을 입력해보세요 (velopert)

![](https://i.imgur.com/SwVYnTC.png)

([코드](https://github.com/velopert/ts-react-redux-tutorial/tree/middleware/thunk))


## thunk 함수와 리듀서 리팩토링하기

앞으로 API를 연동 하실 때 마다 우리가 이번에 했던 작업들을 반복적으로 하시게 될텐데요, 반복되는 코드들을 최대한 재사용 할 수 있도록 리팩토링을 하는 방법을 알아보도록 하겠습니다.

### Promise 기반 thunk 를 만들어주는 createAsyncThunk 함수 만들기

먼저 해야 할 것은 thunk 함수를 한줄로 만들어주는 `createAsyncThunk` 함수를 만드는 것 입니다. 이 함수는 `createAsyncAction` 로 만든 액션 생성함수와 Promise 를 만들어주는 함수를 파라미터로 가져와서 thunk 를 만들어줍니다.

src 디렉터리에 lib 디렉터리를 만들고, 다음 파일을 작성해주세요.

#### src/lib/createAsyncThunk.ts
```javascript
import { Dispatch } from 'redux';
import { AsyncActionCreator } from 'typesafe-actions';

type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;

export default function createAsyncThunk<A extends AnyAsyncActionCreator, F extends (...params: any[]) => Promise<any>>(
  asyncActionCreator: A,
  promiseCreator: F
) {
  type Params = Parameters<F>;
  return function thunk(...params: Params) {
    return async (dispatch: Dispatch) => {
      const { request, success, failure } = asyncActionCreator;
      dispatch(request(undefined)); // 파라미터를 비우면 타입 에러가 나기 때문에 undefined 전달
      try {
        const result = await promiseCreator(...params);
        dispatch(success(result));
      } catch (e) {
        dispatch(failure(e));
      }
    };
  };
}
```

위 코드의 `F extends (...params: any[]) => Promise<any>` 는, F 를 Generics 로 받아오는데 해당 타입은 프로미스를 리턴하는 함수형태만 받아올 수 있도록 설정해줍니다.

그리고, `type Params = Parameters<F>;` 는 함수의 파라미터들의 타입을 추론해줍니다. 이를 통하여 F 함수의 파라미터와 thunk 함수의 파라미터가 동일하게끔 설정을 해줄 수 있습니다.

이렇게 함수를 작성해주고 나면 우리가 기존에 작성했던 thunk 함수를 다음과 같이 한줄로 구현 할 수 있게됩니다.


#### src/modules/github/thunks.ts
```javascript
import { getUserProfile } from '../../api/github';
import { getUserProfileAsync } from './actions';
import createAsyncThunk from '../../lib/createAsyncThunk';

export const getUserProfileThunk = createAsyncThunk(getUserProfileAsync, getUserProfile);
```

정말 간결하지요? API 연동을 할 때마다 12줄 가량의 코드를 더 이상 작성 할 필요가 없게 됐습니다! 물론 모든 API 연동 작업에 대하여 이 유틸 함수를 사용 할 수는 없을 것입니다. 가끔씩은 까다로운 로직을 가지고 있는 thunk 함수의 경우엔 당연히 직접 작성해야 될 수도 있겠죠. 하지만 이렇게 단순히 데이터만 바로 조회하는 형태의 코드라면 `createAsyncThunk` 함수를 사용하여 구현하면 편할 것 입니다.

### 리듀서 리팩토링하기

이번에는 리듀서를 리팩토링 할 차례입니다. 우리는 현재 API 요청에 관련된 상태의 경우 `{ loading, error, data }` 형태로 관리를 하고 있는데요, 이 객체를 조금 더 쉽게 만들 수 있는 유틸 함수들을 만들어주겠습니다.

lib 디렉터리에 reducerUtils.ts 파일을 생성하고 다음 코드들을 작성해주세요.


#### src/lib/reducerUtils.ts
```javascript
export type AsyncState<T, E = any> = {
  data: T | null;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  // 다음 코드는 화살표 함수에 Generic 을 설정 한 것입니다.
  initial: <T, E = any>(initialData?: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData || null,
    error: null
  }),
  load: <T, E = any>(data?: T): AsyncState<T, E> => ({
    loading: true,
    data: data || null,
    error: null
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    data: null,
    error: error
  })
};
```

유틸을 모두 작성하셨으면, GithubState 의 타입을 다음과 같이 수정해주세요.

#### src/modules/github/types.ts
```javascript
import * as actions from './actions';
import { ActionType } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';
import { AsyncState } from '../../lib/reducerUtils';
export type GithubAction = ActionType<typeof actions>;

export type GithubState = {
  userProfile: AsyncState<GithubProfile, Error>;
};
```

`AsyncState` 를 사용해서 매번 `loading`, `data`, `error` 의 타입을 직접 입력해줄 필요 없이 한줄로 깔끔하게 작성 할 수 있게 됐습니다.

그 다음엔 리듀서를 다음과 같이 수정해주세요.

#### src/modules/github/reducer.ts
```javascript
import { createReducer } from 'typesafe-actions';
import { GithubState, GithubAction } from './types';
import { GET_USER_PROFILE, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_ERROR } from './actions';
import { asyncState } from '../../lib/reducerUtils';

const initialState: GithubState = {
  userProfile: asyncState.initial()
};

const github = createReducer<GithubState, GithubAction>(initialState, {
  [GET_USER_PROFILE]: state => ({
    ...state,
    userProfile: asyncState.load()
  }),
  [GET_USER_PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    userProfile: asyncState.success(action.payload)
  }),
  [GET_USER_PROFILE_ERROR]: (state, action) => ({
    ...state,
    userProfile: asyncState.error(action.payload)
  })
});

export default github;
```

코드가 훨씬 더 깔끔해졌죠? 그런데 여기서 더 욕심을 내봅시다. `createReducer` 를 사용해서 리듀서를 만들 때 `handleAction` 을 사용해서 메서드 체이닝을 하는 방식으로 구현을 하면, 다음과 같이 여러 액션에 대하여 하나의 업데이트 함수를 설정해줄 수가 있습니다.

```javascript
  .handleAction([add, increment], (state, action) =>
    state + (action.type === 'ADD' ? action.payload : 1)
  );
```

이러한 속성을 사용하여 우리가 만든 리듀서를 리팩토링 해보겠습니다. 먼저, createAsyncReducer 라는 함수를 reducerUtils.ts 에 다음과 같이 만들어보세요.

#### src/lib/reducerUtils.ts
```javascript
import { AnyAction } from 'redux';
import { getType } from 'typesafe-actions';

export type AsyncState<T, E = any> = {
  data: T | null;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  // 다음 코드는 화살표 함수에 Generic 을 설정 한 것입니다.
  initial: <T, E = any>(initialData?: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData || null,
    error: null
  }),
  load: <T, E = any>(data?: T): AsyncState<T, E> => ({
    loading: true,
    data: data || null,
    error: null
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    data: null,
    error: error
  })
};

type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;
export function createAsyncReducer<S, AC extends AnyAsyncActionCreator, K extends keyof S>(
  asyncActionCreator: AC,
  key: K
) {
  return (state: S, action: AnyAction) => {
    // 각 액션 생성함수의 type 을 추출해줍니다.
    const [request, success, failure] = [
      asyncActionCreator.request,
      asyncActionCreator.success,
      asyncActionCreator.failure
    ].map(getType);
    switch (action.type) {
      case request:
        return {
          ...state,
          [key]: asyncState.load()
        };
      case success:
        return {
          ...state,
          [key]: asyncState.success(action.payload)
        };
      case failure:
        return {
          ...state,
          [key]: asyncState.error(action.payload)
        };
      default:
        return state;
    }
  };
}
```

여기서 사용한 `AnyAsyncActionCreator` 는 `createAsyncThunk` 에서 사용했던 타입과 동일한데요, 원하신다면 따로 types.ts 파일로 추출해내서 분리하셔도 좋습니다. 

`createAsyncReducer`를 모두 다 작성하셨으면, github 리듀서를 다음과 같이 리팩토링해보세요.

#### src/modules/github/reducer.ts
```javascript
import { createReducer } from 'typesafe-actions';
import { GithubState, GithubAction } from './types';
import { getUserProfileAsync } from './actions';
import { asyncState, createAsyncReducer } from '../../lib/reducerUtils';

const initialState: GithubState = {
  userProfile: asyncState.initial()
};

const github = createReducer<GithubState, GithubAction>(initialState).handleAction(
  [getUserProfileAsync.request, getUserProfileAsync.success, getUserProfileAsync.failure],
  createAsyncReducer(getUserProfileAsync, 'userProfile')
);

export default github;
```

코드가 완전 짧아졌지요? 이제 만약 앞으로 새로운 API 를 요청하게 된다면 리듀서에 코드 4줄만 추가해주면 된답니다.

여기서 더 나아가자면 `[getUserProfileAsync.request, getUserProfileAsync.success, getUserProfileAsync.failure]` 이 부분을 다음과 같이 `transformToArray`라는 함수를 만들어서 리팩토링 할 수도 있습니다.

다음 함수를 reducerUtils.ts 에 추가를 해주시구요

#### src/lib/reducerUtils.ts
```javascript
(...)

export function transformToArray<AC extends AnyAsyncActionCreator>(asyncActionCreator: AC) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}
```

github 리듀서에서 다음과 같이 `transformToArray` 를 사용하시면 됩니다.
```javascript
import { createReducer } from 'typesafe-actions';
import { GithubState, GithubAction } from './types';
import { getUserProfileAsync } from './actions';
import { asyncState, createAsyncReducer, transformToArray } from '../../lib/reducerUtils';

const initialState: GithubState = {
  userProfile: asyncState.initial()
};

const github = createReducer<GithubState, GithubAction>(initialState).handleAction(
  transformToArray(getUserProfileAsync),
  createAsyncReducer(getUserProfileAsync, 'userProfile')
);

export default github;
```

하지만 꼭 이렇게 까지 하실 필요는 없답니다. 여러분의 취향에 맞게 여러분이 만족스러우실 정도로 리팩토링을 하시면 됩니다.


([코드](https://github.com/velopert/ts-react-redux-tutorial/tree/middleware/thunk-refactor))

## redux-saga 사용하기

이번에는 프로젝트에서 비동기 작업을 관리하기 위하여 redux-thunk 대신에 redux-saga 를 사용하는 방법을 알아보겠습니다. 프로젝트에 redux-saga 를 설치해주세요.  우리가 기존에 redux-thunk로 구현했던것을 redux-saga로 똑같이 구현을 해볼건데요, 이를 진행하기 위해선 우선 `GET_USER_PROFILE` 액션에서 payload 로 사용자명을 받아오도록 설정해야됩니다. github/actions.ts 파일을 다음과 같이 수정해보세요.

### 액션 수정하기

#### github/actions.ts
```javascript
import { createAsyncAction } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';
import { AxiosError } from 'axios';

export const GET_USER_PROFILE = 'github/GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'github/GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_ERROR = 'github/GET_USER_PROFILE_ERROR';

export const getUserProfileAsync = createAsyncAction(
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_ERROR
)<string, GithubProfile, AxiosError>();
```

기존에 `undefined` 였던 것을 `string` 으로 바꿔주시면 됩니다.

### saga 작성하기

그 다음에는 비동기 액션을 처리 할 saga 를 작성해주겠습니다. github 디렉터리에 sagas.ts 라는 파일을 만들어서 다음과 같이 작성해보세요.

#### src/modules/github/saga.ts
```javascript
import { getUserProfileAsync, GET_USER_PROFILE } from './actions';
import { getUserProfile, GithubProfile } from '../../api/github';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getUserProfileSaga(action: ReturnType<typeof getUserProfileAsync.request>) {
  try {
    const userProfile: GithubProfile = yield call(getUserProfile, action.payload);
    yield put(getUserProfileAsync.success(userProfile));
  } catch (e) {
    yield put(getUserProfileAsync.failure(e));
  }
}

export function* githubSaga() {
  yield takeEvery(GET_USER_PROFILE, getUserProfileSaga);
}
```

액션의 타입은 `ReturnType` 을 통해서 유추해내면 됩니다.

아직까지는 Generator 를 사용 할 때 `yield call` 를 통해서 프로미스를 만드는 특정 함수를 호출했을 경우 프로미스의 결과값에 대한 타입을 유추해내지 못합니다. 때문에 프로미스의 결과값은 force type 을 통해 타입을 지정해주어야 합니다.

최근 TypeScript 3.6 에서 [Generator 에 대한 타입 지원](https://devblogs.microsoft.com/typescript/announcing-typescript-3-6/) 기능이 업데이트 되었으므로, 조만간 redux-saga 에서 완벽한 타입지원을 받는것이 가능해질것 같기도 하지만, 아직까지는 안됩니다. 

saga를 다 작성하셨으면, github/index.ts 에서 불러와서 내보내주세요.

#### src/modules/github/index.ts
```javascript
export { default } from './reducer';
export * from './actions';
export * from './types';
export * from './thunks';
export * from './sagas';
```


그 다음엔 루트 사가를 만들어주세요.

#### src/modules/index.ts
```javascript
import { combineReducers } from 'redux';
import counter from './counter';
import todos from './todos';
import github from './github/reducer';
import { githubSaga } from './github';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  counter,
  todos,
  github
});

// 루트 리듀서를 내보내주세요.
export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;

// 루트 사가를 만들어서 내보내주세요.
export function* rootSaga() {
  yield all([githubSaga()]);
}
```

### 리덕스 스토어에 redux-saga 미들웨어 적용하기

이제 리덕스 스토어에 redux-saga 미들웨어를 적용해주세요. thunk 관련 코드는 이제 불필요하니 지워주시면 됩니다.

#### index.tsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

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

### GithubProfileLoader 컨테이너 컴포넌트 수정하기

기존에는 GithubProfileLoader 컨테이너에서 thunk 함수를 디스패치 했었는데요, 이제 일반 request 액션을 디스패치하도록 수정을 해주세요.

#### src/containers/GithubProfileLoader.tsx
```javascript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import GithubUsernameForm from '../components/GithubUsernameForm';
import GithubProfileInfo from '../components/GithubProfileInfo';
import { getUserProfileAsync } from '../modules/github';

function GithubProfileLoader() {
  const { data, loading, error } = useSelector((state: RootState) => state.github.userProfile);
  const dispatch = useDispatch();

  const onSubmitUsername = (username: string) => {
    dispatch(getUserProfileAsync.request(username));
  };

  return (
    <>
      <GithubUsernameForm onSubmitUsername={onSubmitUsername} />
      {loading && <p style={{ textAlign: 'center' }}>로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <GithubProfileInfo bio={data.bio} blog={data.blog} name={data.name} thumbnail={data.avatar_url} />}
    </>
  );
}

export default GithubProfileLoader;
```

컨테이너를 수정하셨으면, 잘 작동하는지 한번 확인해주세요.

([코드](https://github.com/velopert/ts-react-redux-tutorial/tree/middleware/saga/src))

## saga 리팩토링하기

이번에는 Promise를 기반으로 작동하는 saga 를 쉽게 만들 수 있게 해주는 유틸함수 `createAsyncSaga` 를 만들어서 코드를 리팩토링 해주도록 하겠습니다.

#### `src/lib/createAsyncSaga.ts`
```javascript
import { call, put } from 'redux-saga/effects';
import { AsyncActionCreator, PayloadAction } from 'typesafe-actions';

/* 
  유틸함수의 재사용성을 높이기 위하여 함수의 파라미터는 언제나 하나의 값을 사용하도록 하고,
  action.payload 를 그대로 파라미터로 넣어주도록 설정합니다.
  만약에 여러가지 종류의 값을 파라미터로 넣어야 한다면 객체 형태로 만들어줘야 합니다.
*/
type PromiseCreatorFunction<P, T> = ((payload: P) => Promise<T>) | (() => Promise<T>);

// action 이 payload 를 갖고 있는지 확인합니다.
// __ is __ 문법은 Type guard 라고 부릅니다 https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-type-assertions
function isPayloadAction<P>(action: any): action is PayloadAction<string, P> {
  return action.payload !== undefined;
}

export default function createAsyncSaga<T1, P1, T2, P2, T3, P3>(
  asyncActionCreator: AsyncActionCreator<[T1, P1], [T2, P2], [T3, P3]>,
  promiseCreator: PromiseCreatorFunction<P1, P2>
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    try {
      const result = isPayloadAction<P1>(action)
        ? yield call(promiseCreator, action.payload)
        : yield call(promiseCreator);
      yield put(asyncActionCreator.success(result));
    } catch (e) {
      yield put(asyncActionCreator.failure(e));
    }
  };
}

```

이제 기존의 `getUserProfileSaga` 를 한 줄로 구현해봅시다!

#### src/modules/github/sagas.ts
```javascript
import { getUserProfileAsync, GET_USER_PROFILE } from './actions';
import { getUserProfile } from '../../api/github';
import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from '../../lib/createAsyncSaga';

const getUserProfileSaga = createAsyncSaga(getUserProfileAsync, getUserProfile);

export function* githubSaga() {
  yield takeEvery(GET_USER_PROFILE, getUserProfileSaga);
}
```

코드가 정말 깔끔해졌죠? 이번에 만든 `createAsyncSaga` 의 경우엔 우리가 이전에 구현했던 `createAsyncThunk` 와 마찬가지로, 모든 상황에 사용 할 수는 없겠지만 단순히 복잡한 로직없이 API 요청만 해서 결과값을 받아와야 하는 경우에는 쉽게 saga 를 만들 수 있기 때문에 생산성에 큰 도움을 줄 수 있습니다.

코드를 저장하고 잘 작동하는지 확인해보세요.

## 정리

이제 타입스크립트 + 리덕스 미들웨어 활용 방법부터, 리팩토링까지 모두 끝났습니다! 코드를 작성하게 될 때 무조건 이렇게 리팩토링을 할 필요는 없습니다. 하지만, 생산성에 도움이 된다면, 유지보수성에 도움을 준다면 충분히 할만한 가치가 있습니다.