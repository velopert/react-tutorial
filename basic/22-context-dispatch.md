## 22. Context API 를 사용한 전역 값 관리

이번에 사용되는 코드는 다음 CodeSandbox 에서 확인 할 수 있습니다.

[![Edit begin-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/begin-react-ltusw?fontsize=14)

우리가 현재 만들고 있는 프로젝트를 보면, App 컴포넌트에서 `onToggle`, `onRemove` 가 구현이 되어있고 이 함수들은 UserList 컴포넌트를 거쳐서 각 User 컴포넌트들에게 전달이 되고 있죠.

여기서 UserList 컴포넌트의 경우에는 `onToggle` 과 `onRemove` 를 전달하기 위하여 중간 다리역할만 하고 있습니다.

```javascript
function UserList({ users, onRemove, onToggle }) {
  return (
    <div>
      {users.map(user => (
        <User
          user={user}
          key={user.id}
          onRemove={onRemove}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
```

UserList 에서는 해당 함수들을 직접 사용하는 일도 없죠.

지금과 같이 특정 함수를 특정 컴포넌트를 거쳐서 원하는 컴포넌트에게 전달하는 작업은 리액트로 개발을 하다보면 자주 발생 할 수 있는 작업인데요, 위와 같이 컴포넌트 한개정도를 거쳐서 전달하는건 사실 그렇게 큰 불편함도 없지만, 만약 3~4개 이상의 컴포넌트를 거쳐서 전달을 해야 하는 일이 발생하게 된다면 이는 매우 번거로울 것 입니다.

그럴 땐, 리액트의 Context API 와 이전 섹션에서 배웠던 dispatch 를 함께 사용하면 이러한 복잡한 구조를 해결 할 수 있습니다.

리액트의 Context API 를 사용하면, 프로젝트 안에서 전역적으로 사용 할 수 있는 값을 관리 할 수 있습니다. 여기서 제가 "상태" 가 아닌 "값" 이라고 언급을 했는데요, 이 값은 꼭 상태를 가르키지 않아도 됩니다. 이 값은 함수일수도 있고, 어떤 외부 라이브러리 인스턴스일수도 있고 심지어 DOM 일 수도 있습니다.

물론, Context API 를 사용해서 프로젝트의 상태를 전역적으로 관리 할 수도 있긴한데요, 이에 대해서는 나중에 더 자세히 알아보도록 하겠습니다.

우선, Context API 를 사용해여 새로운 Context 를 만드는 방법을 알아보겠습니다.

Context 를 만들 땐 다음과 같이 `React.createContext()` 라는 함수를 사용합니다.

```javascript
const UserDispatch = React.createContext(null);
```

`createContext` 의 파라미터에는 Context 의 기본값을 설정할 수 있습니다. 여기서 설정하는 값은 Context 를 쓸 때 값을 따로 지정하지 않을 경우 사용되는 기본 값 입니다.

Context 를 만들면, Context 안에 Provider 라는 컴포넌트가 들어있는데 이 컴포넌트를 통하여 Context 의 값을 정할 수 있습니다. 이 컴포넌트를 사용할 때, `value` 라는 값을 설정해주면 됩니다.

```javascript
<UserDispatch.Provider value={dispatch}>...</UserDispatch.Provider>
```

이렇게 설정해주고 나면 Provider 에 의하여 감싸진 컴포넌트 중 어디서든지 우리가 Context 의 값을 다른 곳에서 바로 조회해서 사용 할 수 있습니다. 조회하는 방법은 잠시 후 알아보도록 하고, 지금은 우선 App 컴포넌트 에서 Context 를 만들고, 사용하고, 내보내는 작업을 해주세요.

#### App.js

```javascript
import React, { useRef, useReducer, useMemo, useCallback } from 'react';
import UserList from './UserList';
import CreateUser from './CreateUser';
import useInputs from './hooks/useInputs';

function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}

const initialState = {
  users: [
    {
      id: 1,
      username: 'velopert',
      email: 'public.velopert@gmail.com',
      active: true
    },
    {
      id: 2,
      username: 'tester',
      email: 'tester@example.com',
      active: false
    },
    {
      id: 3,
      username: 'liz',
      email: 'liz@example.com',
      active: false
    }
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        users: state.users.concat(action.user)
      };
    case 'TOGGLE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.id ? { ...user, active: !user.active } : user
        )
      };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.id)
      };
    default:
      return state;
  }
}

// UserDispatch 라는 이름으로 내보내줍니다.
export const UserDispatch = React.createContext(null);

function App() {
  const [{ username, email }, onChange, onReset] = useInputs({
    username: '',
    email: ''
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const nextId = useRef(4);

  const { users } = state;

  const onCreate = useCallback(() => {
    dispatch({
      type: 'CREATE_USER',
      user: {
        id: nextId.current,
        username,
        email
      }
    });
    onReset();
    nextId.current += 1;
  }, [username, email, onReset]);

  const onToggle = useCallback(id => {
    dispatch({
      type: 'TOGGLE_USER',
      id
    });
  }, []);

  const onRemove = useCallback(id => {
    dispatch({
      type: 'REMOVE_USER',
      id
    });
  }, []);

  const count = useMemo(() => countActiveUsers(users), [users]);
  return (
    <UserDispatch.Provider value={dispatch}>
      <CreateUser
        username={username}
        email={email}
        onChange={onChange}
        onCreate={onCreate}
      />
      <UserList users={users} onToggle={onToggle} onRemove={onRemove} />
      <div>활성사용자 수 : {count}</div>
    </UserDispatch.Provider>
  );
}

export default App;
```

지금은 우리가 UserDispatch 라는 Context 를 만들어서, 어디서든지 `dispatch` 를 꺼내 쓸 수 있도록 준비를 해준 것입니다.

그리고, UserDispatch 를 만들 때 다음과 같이 내보내주는 작업을 했는데요

```javascript
export const UserDispatch = React.createContext(null);
```

이렇게 내보내주면 나중에 사용하고 싶을 때 다음과 같이 불러와서 사용 할 수 있습니다.

```javascript
import { UserDispatch } from './App';
```

Context 를 다 만드셨으면, App 에서 `onToggle` 과 `onRemove` 를 지우시고, UserList 에게 props를 전달하는것도 지우세요.

#### App.js

```javascript
import React, { useRef, useReducer, useMemo, useCallback } from 'react';
import UserList from './UserList';
import CreateUser from './CreateUser';
import useInputs from './hooks/useInputs';

function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}

const initialState = {
  users: [
    {
      id: 1,
      username: 'velopert',
      email: 'public.velopert@gmail.com',
      active: true
    },
    {
      id: 2,
      username: 'tester',
      email: 'tester@example.com',
      active: false
    },
    {
      id: 3,
      username: 'liz',
      email: 'liz@example.com',
      active: false
    }
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        users: state.users.concat(action.user)
      };
    case 'TOGGLE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.id ? { ...user, active: !user.active } : user
        )
      };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.id)
      };
    default:
      return state;
  }
}

// UserDispatch 라는 이름으로 내보내줍니다.
export const UserDispatch = React.createContext(null);

function App() {
  const [{ username, email }, onChange, onReset] = useInputs({
    username: '',
    email: ''
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const nextId = useRef(4);

  const { users } = state;

  const onCreate = useCallback(() => {
    dispatch({
      type: 'CREATE_USER',
      user: {
        id: nextId.current,
        username,
        email
      }
    });
    onReset();
    nextId.current += 1;
  }, [username, email, onReset]);

  const count = useMemo(() => countActiveUsers(users), [users]);
  return (
    <UserDispatch.Provider value={dispatch}>
      <CreateUser
        username={username}
        email={email}
        onChange={onChange}
        onCreate={onCreate}
      />
      <UserList users={users} />
      <div>활성사용자 수 : {count}</div>
    </UserDispatch.Provider>
  );
}

export default App;
```

이제 UserList 컴포넌트에서 에서 onToggle 과 onRemove 와 관련된 코드들을 지워주세요.

#### UserList.js

```javascript
import React from 'react';

const User = React.memo(function User({ user }) {
  return (
    <div>
      <b
        style={{
          cursor: 'pointer',
          color: user.active ? 'green' : 'black'
        }}
        onClick={() => {}}
      >
        {user.username}
      </b>
      &nbsp;
      <span>({user.email})</span>
      <button onClick={() => {}}>삭제</button>
    </div>
  );
});

function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <User user={user} key={user.id} />
      ))}
    </div>
  );
}

export default React.memo(UserList);
```

이제, User 컴포넌트에서 바로 `dispatch` 를 사용 할건데요, 그렇게 하기 위해서는 `useContext` 라는 Hook 을 사용해서 우리가 만든 UserDispatch Context 를 조회해야합니다.

```javascript
import React, { useContext } from 'react';
import { UserDispatch } from './App';

const User = React.memo(function User({ user }) {
  const dispatch = useContext(UserDispatch);

  return (
    <div>
      <b
        style={{
          cursor: 'pointer',
          color: user.active ? 'green' : 'black'
        }}
        onClick={() => {
          dispatch({ type: 'TOGGLE_USER', id: user.id });
        }}
      >
        {user.username}
      </b>
      &nbsp;
      <span>({user.email})</span>
      <button
        onClick={() => {
          dispatch({ type: 'REMOVE_USER', id: user.id });
        }}
      >
        삭제
      </button>
    </div>
  );
});

function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <User user={user} key={user.id} />
      ))}
    </div>
  );
}

export default React.memo(UserList);
```

자, 작업이 끝났습니다. 이렇게 Context API 를 사용해서 `dispatch` 를 어디서든지 조회해서 사용해줄 수 있게 해주면 코드의 구조가 훨씬 깔끔해질 수 있습니다.

### 숙제

User 컴포넌트에게 따로 `onToggle` / `onRemove` 를 props로 전달하지 않고 바로 `dispatch` 를 사용했던 것 처럼, CreateUser 컴포넌트에서도 `dispatch` 를 직접 하도록 구현을 해보세요.

- CreateUser 에게는 아무 props 도 전달하지 마세요.
- CreateUser 컴포넌트 내부에서 useInputs 를 사용하세요.
- useRef 를 사용한 `nextId` 값을 CreateUser 에서 관리하세요.

정답은 다음 CodeSandbox 를 참고하세요.

[![Edit begin-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/begin-react-b7c16?fontsize=14)

### 정리

이로써 `useState` 를 사용하는 것과 `useReducer` 를 사용하는 것의 큰 차이를 발견했지요? `useReducer` 를 사용하면 이렇게 `dispatch` 를 Context API 를 사용해서 전역적으로 사용 할 수 있게 해주면 컴포넌트에게 함수를 전달해줘야 하는 상황에서 코드의 구조가 훨씬 깔끔해질 수 있습니다.

만약에 깊은 곳에 위치하는 컴포넌트에게 여러 컴포넌트를 거쳐서 함수를 전달해야 하는 일이 있다면 이렇게 Context API 를 사용하시면 됩니다.
