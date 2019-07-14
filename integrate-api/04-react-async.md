## 04. react-async 로 요청 상태 관리하기

[react-async](https://github.com/ghengeveld/react-async) 는 우리가 지난 섹션에서 만들었던 `useAsync` 와 비슷한 함수가 들어있는 라이브러리입니다.

이 라이브러리 안에 들어있는 함수 이름도 `useAsync` 인데요, 사용법이 조금 다릅니다.

만약에 여러분이 매번 프로젝트를 만들 때 마다 직접 요청 상태 관리를 위한 커스텀 Hook 을 만들기 귀찮다면, 이 라이브러리를 사용하시면 됩니다. 정말 많은 기능들이 내장되어있답니다. 다만, 사용법이 조금 다릅니다. 우리가 만들었던 커스텀 Hook 은 결과물을 배열로 반환하는 반면 이 Hook 은 객체 형태로 반환합니다.

우선, 해당 라이브러리를 설치해주세요.

```bash
$ yarn add react-async
```

react-async 의 [README](https://github.com/ghengeveld/react-async) 에 있는 공식 사용법을 확인해볼까요?

```javascript
import { useAsync } from "react-async"

const loadCustomer = async ({ customerId }, { signal }) => {
  const res = await fetch(`/api/customers/${customerId}`, { signal })
  if (!res.ok) throw new Error(res)
  return res.json()
}

const MyComponent = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: loadCustomer, customerId: 1 })
  if (isLoading) return "Loading..."
  if (error) return `Something went wrong: ${error.message}`
  if (data)
    return (
      <div>
        <strong>Loaded some data:</strong>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  return null
}
```

react-async 의 `useAsync` 를 사용 할 때 파라미터로 넣는 옵션 객체에는 호출 할 함수 `promiseFn` 을 넣고, 파라미터도 필드 이름과 함께 (`customerId`) 넣어주어야 합니다.

### User 컴포넌트 전환

한번 User 컴포넌트를 react-async 의 `useAsync` 로 전환해봅시다.

#### User.js
```javascript
import React from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';

async function getUser({ id }) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const { data: user, error, isLoading } = useAsync({
    promiseFn: getUser,
    id,
    watch: id
  });

  if (isLoading) return <div>로딩중..</div>;
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

`useAsync` 를 사용할 때에는 프로미스를 반환하는 함수의 파라미터를 객체형태로 해주어야 합니다.

```javascript
async function getUser({ id }) {}
```

이렇게 말이죠. 그래야, `id` 값을 따로 받아와서 사용 할 수 있게 됩니다.

그리고, `useAsync` 를 사용 할 때 `watch` 값에 특정 값을 넣어주면 이 값이 바뀔 때마다 `promiseFn` 에 넣은 함수를 다시 호출해줍니다.

조금 더 복잡한 비교를 해야 하는 경우 [watchFn](https://github.com/ghengeveld/react-async#watchfn) 을 사용 할 수 있습니다.


### Users 컴포넌트 전환

이번에는 Users 컴포넌트를 react-async 의 `useAsync` 를 사용하는 코드로 전환을 해봅시다.

#### Users.js
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';
import User from './User';

async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);
  const { data: users, error, isLoading, reload } = useAsync({
    promiseFn: getUsers
  });

  if (isLoading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={reload}>불러오기</button>;
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
      <button onClick={reload}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

어떤가요? 잘 작동하고 있나요? `reload` 함수를 사용하면, 데이터를 다시 불러올 수 있습니다.

지금은 이전에 Users 컴포넌트를 만들 때, 불러오기 버튼을 눌러야만 데이터를 불러오도록 만들어줬었는데요, 이렇게 해주면, 컴포넌트를 렌더링하는 시점부터 데이터를 불러오게 됩니다.

만약에 우리가 이전 섹션에서 배웠던 `skip` 처럼, 렌더링하는 시점이 아닌 사용자의 특정 인터랙션에 따라 API 를 호출하고 싶을 땐 `promiseFn` 대신 `deferFn` 을 사용하고, `reload` 대신 `run` 함수를 사용하면 됩니다.

#### Users.js
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';
import User from './User';

async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);
  const { data: users, error, isLoading, run } = useAsync({
    deferFn: getUsers
  });

  if (isLoading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={run}>불러오기</button>;

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
      <button onClick={run}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

이제 렌더링 시에는 데이터 요청을 하지 않고, 불러오기 버튼을 눌렀을때 데이터 요청을 하게 되는지 확인해보세요.

### 정리

react-async 라이브러리는 정말 쓸만하고, 편합니다. 다만, 우리가 이전에 직접 만들었던 `useAsync` 와 크게 다를 건 없죠. 어떤 측면에서는 우리가 직접 만든 Hook 이 편하기도 합니다. 예를 들어서 Hook 의 옵션이 굉장히 간단하죠. 그리고, `watch` 같은 것 대신에 `deps` 를 사용하기도 하고, 반환 값이 배열 형태이기 때문에 (리액트 자체 내장 Hook 과 사용성이 비슷하다는 측면에서) 더욱 Hook 스럽습니다.

반면에 react-async 의 `useAsync` 는 옵션이 다양하고 (`promiseFn`, `deferFn`, `watch`, ...) 결과 값도 객체 안에 다양한 값이 들어있어서 (`run`, `reload`, ...) 헷갈릴 수 있는 단점이 있긴 하지만 다양한 기능이 이미 내장되어있고 (예를 들어서 요청을 [취소](https://github.com/ghengeveld/react-async#cancel) 할 수도 있습니다.) Hook 을 직접 만들 필요 없이 바로 불러와서 사용 할 수 있는 측면에서는 정말 편합니다.

그렇다면 과연 Hook 을 직접 만들어서 써야 할까요 아니면 라이브러리로 불러와서 사용 해야 할까요? 정해진 답은 없습니다.

만약 우리가 직접 만들었던 `useAsync` 의 작동 방식을 완벽히 이해하셨다면 여러분의 필요에 따라 커스터마이징 해가면서 사용 할 수 있으니까 직접 만들어서 사용하는 것을 추천드립니다. 특히나, 연습용 프로젝트가 아니라, 오랫동안 유지보수 할 수도 있게 되는 프로젝트라면 더더욱 추천합니다.

반면, 작은 프로젝트이거나, 직접 만든 `useAsync` 의 작동 방식이 조금 어렵게 느껴지신다면 라이브러리로 설치해서 사용하는것도 좋습니다.

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-m5v26?fontsize=14)
