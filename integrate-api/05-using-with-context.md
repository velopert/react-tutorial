## 5. Context 와 함께 사용하기

이번에는, 리액트의 Context 와 API 연동을 함께 하고 싶다면 어떻게 해야 되는지 알아보도록 하겠습니다. 컴포넌트에서 필요한 외부 데이터들은 컴포넌트 내부에서 `useAsync` 같은 Hook 을 사용해서 작업을 하면 충분하지만, 가끔씩 특정 데이터들은 다양한 컴포넌트에서 필요하게 될 때도 있는데 (예: 현재 로그인된 사용자의 정보, 설정 등) 그럴 때에는 Context 를 사용하면 개발이 편해집니다.

### Context 준비하기

src 디렉터리에 UsersContext.js 라는 파일을 만들고, 다음 코드의 주석을 꼼꼼히 읽어가면서 코드를 따라 작성해보세요.

#### UsersContext.js

```javascript
import React, { createContext, useReducer, useContext } from 'react';

// UsersContext 에서 사용 할 기본 상태
const initialState = {
  users: {
    loading: false,
    data: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  }
};

// 로딩중일 때 바뀔 상태 객체
const loadingState = {
  loading: true,
  data: null,
  error: null
};

// 성공했을 때의 상태 만들어주는 함수
const success = data => ({
  loading: false,
  data,
  error: null
});

// 실패했을 때의 상태 만들어주는 함수
const error = error => ({
  loading: false,
  data: null,
  error: error
});

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
function usersReducer(state, action) {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        users: loadingState
      };
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        users: success(action.data)
      };
    case 'GET_USERS_ERROR':
      return {
        ...state,
        users: error(action.error)
      };
    case 'GET_USER':
      return {
        ...state,
        user: loadingState
      };
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        user: success(action.data)
      };
    case 'GET_USER_ERROR':
      return {
        ...state,
        user: error(action.error)
      };
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const UsersStateContext = createContext(null);
const UsersDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
export function UsersProvider({ children }) {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  return (
    <UsersStateContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
}

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
export function useUsersState() {
  const state = useContext(UsersStateContext);
  if (!state) {
    throw new Error('Cannot find UsersProvider');
  }
  return state;
}

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
export function useUsersDispatch() {
  const dispatch = useContext(UsersDispatchContext);
  if (!dispatch) {
    throw new Error('Cannot find UsersProvider');
  }
  return dispatch;
}
```

우리가 만약에 id 를 가지고 특정 사용자의 정보를 가져오는 API 를 호출하고 싶다면 이런 형식으로 해주어야 합니다.

```javascript
dispatch({ type: 'GET_USER' });
try {
  const response = await getUser();
  dispatch({ type: 'GET_USER_SUCCESS', data: response.data });
} catch (e) {
  dispatch({ type: 'GET_USER_ERROR', error: e });
}
```

요청이 시작 했을때 액션을 디스패치해주고, 요청이 성공하거나 실패했을 때 또 다시 디스패치 해주는 것이죠.

### API 처리 함수 만들기

우리는 이러한 작업을 처리하는 함수를 만들어주겠습니다. UsersContext.js 를 열어서 상단에 axios 를 불러오고, 코드의 하단 부분에 `getUsers` 와 `getUser` 함수를 작성해주세요. 이 함수들은 `dispatch` 를 파라미터로 받아오고, API 에 필요한 파라미터도 받아오게 됩니다.

```javascript
import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

// (...)

export async function getUsers(dispatch) {
  dispatch({ type: 'GET_USERS' });
  try {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    dispatch({ type: 'GET_USERS_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_USERS_ERROR', error: e });
  }
}

export async function getUser(dispatch, id) {
  dispatch({ type: 'GET_USER' });
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    dispatch({ type: 'GET_USER_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_USER_ERROR', error: e });
  }
}
```

중복되는 코드들이 좀 있지요? 이 부분은 나중에 리팩토링해주도록 하겠습니다.

### Context 사용하기

이제 우리가 만든 Context 를 사용해보겠습니다. App 컴포넌트를 열어서 UsersProvider 로 감싸주세요.

#### App.js
```javascript
import React from 'react';
import Users from './Users';
import { UsersProvider } from './UsersContext';

function App() {
  return (
    <UsersProvider>
      <Users />
    </UsersProvider>
  );
}

export default App;
```

그 다음에, Users 컴포넌트의 코드를 Context 를 사용하는 형태의 코드로 전환해보겠습니다.

#### Users.js
```javascript
import React, { useState } from 'react';
import { useUsersState, useUsersDispatch, getUsers } from './UsersContext';
import User from './User';

function Users() {
  const [userId, setUserId] = useState(null);
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  const { data: users, loading, error } = state.users;
  const fetchData = () => {
    getUsers(dispatch);
  };

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={fetchData}>불러오기</button>;

  return (
    <>
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{ cursor: 'pointer' }}
          >
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchData}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

`useUsersState()` 와 `useUsersDispatch()` 를 사용해서 `state` 와 `dispatch` 를 가져오고, 요청을 시작 할 때에는 `getUsers()` 함수 안에 `dispatch` 를 넣어서 호출을 해주었습니다.

간단하죠? 코드를 저장하고, 잘 작동하는지 확인해보세요.

그 다음엔 User 컴포넌트도 전환해보세요.

#### User.js
```javascript
import React, { useEffect } from 'react';
import { useUsersState, useUsersDispatch, getUser } from './UsersContext';

function User({ id }) {
  const state = useUsersState();
  const dispatch = useUsersDispatch();
  useEffect(() => {
    getUser(dispatch, id);
  }, [dispatch, id]);

  const { data: user, loading, error } = state.user;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!user) return null;
  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  );
}

export default User;
```

여기선 `useEffect` 를 사용해서 `id` 값이 바뀔 때마다 `getUser()` 함수를 호출해주도록 하면 됩니다. 여기서 `getUser()` 함수를 호출 할 때에는 두번째 파라미터에 현재 props 로 받아온 `id` 값을 넣어주었습니다.

코드를 저장 후, 잘 작동하는지 확인해보세요~

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-gtpcb?fontsize=14)


### 반복되는 코드를 줄이자!

이번에 우리가 배운 것은, Context + 비동기 API 연동의 정석이라고 볼 수 있습니다. 이 패턴에 대하여 잘 이해하시고, 앞으로 이런 패턴을 잘 활용하시면 됩니다.

이제 여기서 조금 더 나아가서 반복되는 로직들을 함수화하여 재활용 하는 방법을 알아보겠습니다.

#### 반복된 코드

```javascript
export async function getUsers(dispatch) {
  dispatch({ type: 'GET_USERS' });
  try {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    dispatch({ type: 'GET_USERS_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_USERS_ERROR', error: e });
  }
}

export async function getUser(dispatch, id) {
  dispatch({ type: 'GET_USER' });
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    dispatch({ type: 'GET_USER_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_USER_ERROR', error: e });
  }
}
```

우리는 이 부분을 리팩토링 해보겠습니다. 우선, api 들이 들어있는 파일을 따로 분리해주겠습니다. src 디렉터리에 api.js 파일을 만들고 다음과 같이 코드를 적어주세요.

#### api.js
```javascript
import axios from 'axios';

export async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

export async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}
```

그 다음에는, src 디렉터리에 asyncActionUtils.js 라는 파일을 만들고 다음 코드를 작성하세요.

#### asyncActionUtils.js
```javascript
// 이 함수는 파라미터로 액션의 타입 (예: GET_USER) 과 Promise 를 만들어주는 함수를 받아옵니다.
export default function createAsyncDispatcher(type, promiseFn) {
  // 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // 새로운 함수를 만듭니다.
  // ...rest 를 사용하여 나머지 파라미터를 rest 배열에 담습니다.
  async function actionHandler(dispatch, ...rest) {
    dispatch({ type }); // 요청 시작됨
    try {
      const data = await promiseFn(...rest); // rest 배열을 spread 로 넣어줍니다.
      dispatch({
        type: SUCCESS,
        data
      }); // 성공함
    } catch (e) {
      dispatch({
        type: ERROR,
        error: e
      }); // 실패함
    }
  }

  return actionHandler; // 만든 함수를 반환합니다.
}
```

이렇게 `createAsyncDispatcher` 를 만들어주면, UsersContext 의 코드를 다음과 같이 리팩토링 할 수 있답니다.


#### UsersContext.js
```javascript
import React, { createContext, useReducer, useContext } from 'react';
import createAsyncDispatcher from './createAsyncDispatcher';
import * as api from './api'; // api 파일에서 내보낸 모든 함수들을 불러옴

(...)

export const getUsers = createAsyncDispatcher('GET_USERS', api.getUsers);
export const getUser = createAsyncDispatcher('GET_USER', api.getUser);
```

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-61o6w?fontsize=14)

훨씬 코드가 깔끔해졌지요?

그리고 리듀서쪽 코드도 리팩토링을 할 수 있답니다. UsersContext 의 `loadingState`, `success`, `error` 를 잘라내서 asyncActionUtils.js 안에 붙여넣으세요.

그리고, 다음과 같이 `initialAsyncState` 객체를 만들어서 내보내고, `createAsyncHandler` 라는 함수도 만들어서 내보내세요.

#### asyncActionUtils.js
```javascript
// 이 함수는 파라미터로 액션의 타입 (예: GET_USER) 과 Promise 를 만들어주는 함수를 받아옵니다.
export function createAsyncDispatcher(type, promiseFn) {
  // 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // 새로운 함수를 만듭니다.
  // ...rest 를 사용하여 나머지 파라미터를 rest 배열에 담습니다.
  async function actionHandler(dispatch, ...rest) {
    dispatch({ type }); // 요청 시작됨
    try {
      const data = await promiseFn(...rest); // rest 배열을 spread 로 넣어줍니다.
      dispatch({
        type: SUCCESS,
        data
      }); // 성공함
    } catch (e) {
      dispatch({
        type: ERROR,
        error: e
      }); // 실패함
    }
  }

  return actionHandler; // 만든 함수를 반환합니다.
}

export const initialAsyncState = {
  loading: false,
  data: null,
  error: null
};

// 로딩중일 때 바뀔 상태 객체
const loadingState = {
  loading: true,
  data: null,
  error: null
};

// 성공했을 때의 상태 만들어주는 함수
const success = data => ({
  loading: false,
  data,
  error: null
});

// 실패했을 때의 상태 만들어주는 함수
const error = error => ({
  loading: false,
  data: null,
  error: error
});

// 세가지 액션을 처리하는 리듀서를 만들어줍니다
// type 은 액션 타입, key 는 리듀서서 사용할 필드 이름입니다 (예: user, users)
export function createAsyncHandler(type, key) {
  // 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // 함수를 새로 만들어서
  function handler(state, action) {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: loadingState
        };
      case SUCCESS:
        return {
          ...state,
          [key]: success(action.data)
        };
      case ERROR:
        return {
          ...state,
          [key]: error(action.error)
        };
      default:
        return state;
    }
  }

  // 반환합니다
  return handler;
}
```

이제 UsersContext 에서 방금 만든 `initialAsyncState` 와 `createAsyncHandler` 를 사용해서 코드를 고쳐봅시다.

#### UsersContext.js

```javascript
import React, { createContext, useReducer, useContext } from 'react';
import {
  createAsyncDispatcher,
  createAsyncHandler,
  initialAsyncState
} from './asyncActionUtils';
import * as api from './api'; // api 파일에서 내보낸 모든 함수들을 불러옴

// UsersContext 에서 사용 할 기본 상태
const initialState = {
  users: initialAsyncState,
  user: initialAsyncState
};

const usersHandler = createAsyncHandler('GET_USERS', 'users');
const userHandler = createAsyncHandler('GET_USER', 'user');

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
function usersReducer(state, action) {
  switch (action.type) {
    case 'GET_USERS':
    case 'GET_USERS_SUCCESS':
    case 'GET_USERS_ERROR':
      return usersHandler(state, action);
    case 'GET_USER':
    case 'GET_USER_SUCCESS':
    case 'GET_USER_ERROR':
      return userHandler(state, action);
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

(...)
```

위 코드에서는 각 요청에 대하여 3가지 (시작, 성공, 실패) 액션을 처리하는 함수를 만들었습니다. 하단의 `switch` 문에서는, 만약 `return` 또는 `break` 를 하지 않으면, 여러개의 `case` 에 대하여 동일한 코드를 실행해줍니다. 예를 들자면 `GET_USERS`, `GET_USERS_SUCCESS`, `GET_USERS_ERROR` 액션이 발생하게 된다면 `usersHandler(state, action)` 을 호출해서 반환을 해주지요.

어떤가요? 반복되는 코드가 많이 사라졌지요? 꼭 이렇게 까지 리팩토링을 할 필요가 없지만, 이런 코드가 맘에 든다면, 자주 사용되는 코드를 함수화해서 재사용하시면 좋습니다.

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-c3rli?fontsize=14)
