## 21. 커스텀 Hooks 만들기

이번에 사용 될 코드는 다음 CodeSandbox 에서 확인 할 수 있습니다.

[![Edit begin-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/begin-react-6b98p?fontsize=14)

컴포넌트를 만들다보면, 반복되는 로직이 자주 발생합니다. 예를 들어서 input 을 관리하는 코드는 관리 할 때마다 꽤나 비슷한 코드가 반복되죠.

이번에는 그러한 상황에 커스텀 Hooks 를 만들어서 반복되는 로직을 쉽게 재사용하는 방법을 알아보겠습니다.

src 디렉터리에 hooks 라는 디렉터리를 만들고, 그 안에 useInputs.js 라는 파일을 만드세요.

커스텀 Hooks 를 만들 때에는 보통 이렇게 `use` 라는 키워드로 시작하는 파일을 만들고 그 안에 함수를 작성합니다.

커스텀 Hooks 를 만드는 방법은 굉장히 간단합니다. 그냥, 그 안에서 `useState`, `useEffect`, `useReducer`, `useCallback` 등 Hooks 를 사용하여 원하는 기능을 구현해주고, 컴포넌트에서 사용하고 싶은 값들을 반환해주면 됩니다.

#### useInputs.js

```javascript
import { useState, useCallback } from 'react';

function useInputs(initialForm) {
  const [form, setForm] = useState(initialForm);
  // change
  const onChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }));
  }, []);
  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return [form, onChange, reset];
}

export default useInputs;
```

이제 우리가 만든 `useInputs` Hook 을 App.js 에서 사용해볼까요? 이 작업을 하기 위해서는 먼저 `useReducer` 쪽에서 사용하는 `inputs` 를 없애고 이에 관련된 작업을 `useInputs` 를 대체해주어야 합니다. 새로운 항목을 추가 할 때 input 값을 초기화해야 하므로 데이터 등록 후 `reset()` 을 호출해주세요.

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
        users: state.users.map(user =>
          user.id === action.id ? { ...user, active: !user.active } : user
        )
      };
    case 'REMOVE_USER':
      return {
        users: state.users.filter(user => user.id !== action.id)
      };
    default:
      return state;
  }
}

function App() {
  const [{ username, email }, onChange, reset] = useInputs({
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
    reset();
    nextId.current += 1;
  }, [username, email, reset]);

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
    <>
      <CreateUser
        username={username}
        email={email}
        onChange={onChange}
        onCreate={onCreate}
      />
      <UserList users={users} onToggle={onToggle} onRemove={onRemove} />
      <div>활성사용자 수 : {count}</div>
    </>
  );
}

export default App;
```

이렇게 커스텀 Hook 을 만들어서 사용하면 컴포넌트의 로직을 분리시켜서 필요 할 때 쉽게 재사용 할 수도 있습니다.

### 숙제

`useInputs` 커스텀 Hook 을 한번 `useReducer` 를 사용해서 구현해보세요.

[답안](https://gist.github.com/velopert/e0d5a027f60a7368b2bb6f9277e3f742)
