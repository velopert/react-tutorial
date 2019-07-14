## 3. useAsync 커스텀 Hook 만들어서 사용하기

데이터를 요청해야 할 때마다 리듀서를 작성하는 것은 번거로운 일 입니다. 매번 반복되는 코드를 작성하는 대신에, 커스텀 Hook 을 만들어서 요청 상태 관리 로직을 쉽게 재사용하는 방법을 알아봅시다.

src 디렉터리에 useAsync.js 파일을 생성하고, 다음 코드를 작성해보세요.

#### useAsync.js
```javascript
import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;
```

`useAsync` 함수는 두가지 파라미터를 받아옵니다. 첫번째 파라미터는 API 요청을 시작하는 함수이고, 두번째 파라미터는 `deps` 인데 이 `deps` 값은 해당 함수 안에서 사용하는  `useEffect` 의 `deps` 로 설정됩니다.

이 값은 나중에 우리가 사용 할 비동기 함수에서 파라미터가 필요하고, 그 파라미터가 바뀔 때 새로운 데이터를 불러오고 싶은 경우에 활용 할 수 있습니다 (현재 Users 컴포넌트에서는 불필요한 부분입니다). 이 값의 기본값은 `[]` 입니다. 즉, 컴포넌트가 가장 처음 렌더링 할 때만 API 를 호출하고 싶다는 의미죠.

이 Hook 에서 반환하는 값은 요청 관련 상태와, `fetchData` 함수입니다. 이렇게 `fetchData` 함수를 반환하여서 나중에 데이터를 쉽게 리로딩을 해줄 수 있습니다.

이제 이 Hook 을 사용해봅시다.

#### Users.js
```javascript
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.
async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [state, refetch] = useAsync(getUsers, []);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-6ifxz?fontsize=14)

코드를 저장하고 잘 작동하고 있는지 확인해보세요. 어떤가요? 코드가 훨씬 깔끔해졌죠? 재사용하기도 정말 쉽습니다. 


### 데이터 나중에 불러오기

Users 컴포넌트는 컴포넌트가 처음 렌더링 되는 시점부터 API 를 요청하고 있습니다. 만약에 특정 버튼을 눌렀을 때만 API 를 요청하고 싶다면, 어떻게 해야할까요? 예를 들어서, POST, DELETE, PUT, PATCH 등의 HTTP 메서드를 사용하게 된다면 필요한 시점에만 API 를 호출해야 하기 때문에, 필요할 때에만 요청 할 수 있는 기능이 필요합니다.

한번 구현해볼까요? `useAsync` 에 다음과 같이 세번째 파라미터 `skip` 을 넣어보세요.

#### useAsync.js
```javascript
import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;
```

`skip` 파라미터의 기본 값을 `false` 로 지정하고, 만약 이 값이 `true` 라면 `useEffect` 에서 아무런 작업도 하지 않도록 설정해주었습니다.

이에 따라 Users 컴포넌트를 수정해봅시다.



#### Users.js
```javascript
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.
async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

`useAsync`의 세번째 파라미터에 `true` 를 넣어줬고, `!users` 인 상황에 불러오기 버튼을 렌더링해주었습니다.

![](https://i.imgur.com/fMCGGLX.gif)

잘 작동하고 있나요? 

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-5jd34?fontsize=14)



### API 에 파라미터가 필요한 경우

이번에는, API 를 요청 할 때 파라미터가 필요한 경우에 어떻게 해야 하는지 알아보겠습니다.

우리는 User 라는 컴포넌트를 만들 것이구요, `id` 값을 props 로 받아와서 

https://jsonplaceholder.typicode.com/users/1

이런 식으로 맨 뒤에 `id` 를 넣어서 API 를 요청 할 것 입니다.

src 디렉터리에 User.js 를 생성 후 다음 코드를 작성해보세요.

#### User.js
```javascript
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const [state] = useAsync(() => getUser(id), [id]);
  const { loading, data: user, error } = state;

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

`useAsync` 를 사용 할 때, 파라미터를 포함시켜서 함수를 호출하는 새로운 함수를 만들어서 등록해주었습니다. 그리고, `id` 가 바뀔 때 마다 재호출 되도록 `deps` 에 `id` 를 넣어주었습니다.

그 다음에는, Users.js 에서 `useState` 를 사용하여 `userId` 상태를 관리해주겠습니다. 초깃값은 `null` 이며, 리스트에 있는 항목을 클릭하면 클릭한 사용자의 `id` 를 `userId` 값으로 설정해줍니다.

#### Users.js
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import useAsync from './useAsync';
import User from './User';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.
async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;
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
      <button onClick={refetch}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

![](https://i.imgur.com/e8haRtq.gif)

항목을 클릭 했을 때 데이터가 새로 불러와지고 있나요?

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-x0z9x?fontsize=14)


## 정리

API 를 연동 할 때 이렇게 커스텀 Hook 을 직접 만들어서 사용하면 편합니다. 그리고, 이 Hook 이 어떻게 만들어졌는지 잘 이해하셨다면, 여러분의 용도에 따라 기능을 조금 더 커스터마이징 해서 쓸 수도 있습니다.

