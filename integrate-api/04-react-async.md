## 04. react-async 로 요청 상태 관리하기

[react-use](https://github.com/streamich/react-use/blob/master/docs/useAsync.md) 는 우리가 지난 섹션에서 만들었던 `useAsync` 와 비슷한 함수가 들어있는 라이브러리입니다.

이 라이브러리 안에 들어있는 함수 이름도 `useAsync` 인데요, 사용법이 조금 다릅니다.

만약에 여러분이 매번 프로젝트를 만들 때 마다 직접 요청 상태 관리를 위한 커스텀 Hook 을 만들기 귀찮다면, 이 라이브러리를 사용하시면 됩니다. 정말 많은 기능들이 내장되어있답니다. 다만, 사용법이 조금 다릅니다. 우리가 만들었던 커스텀 Hook 은 결과물을 배열로 반환하는 반면 이 Hook 은 객체 형태로 반환합니다.

우선, 해당 라이브러리를 설치해주세요.

```bash
$ yarn add react-use
```

react-async 의 [README](https://github.com/ghengeveld/react-async) 에 있는 공식 사용법을 확인해볼까요?

```javascript
import {useAsync} from 'react-use';

const Demo = ({url}) => {
  const state = useAsync(async () => {
    const response = await fetch(url);
    const result = await response.text();
    return result
  }, [url]);

  return (
    <div>
      {state.loading
        ? <div>Loading...</div>
        : state.error
          ? <div>Error: {state.error.message}</div>
          : <div>Value: {state.value}</div>
      }
    </div>
  );
};
```
우리가 실습해왔던 코드와 형태가 좀 다르죠? 그래도 당황하지 않고, 공식 사용법에서 파악하면 되는 내용은 아래와 같습니다.
* react-async 의 `useAsync` 를 사용 할 때 **첫 번째 파라미터**로 넣는 옵션 객체에는 **호출 할 비동기 함수**를 넣는다.
* **두 번째 파라미터**로 들어가는 **배열**에는 값이 변경될 경우 다시 호출 할 수 있도록, **관찰할 값**을 넣어준다는 것입니다. 편의상 **watch 배열**이라고 지칭하겠습니다. 

### User 컴포넌트 전환

* 한번 User 컴포넌트를 react-async 의 `useAsync` 로 전환해봅시다. 
* 공식 사용법에서는 api를 호출할 때에 `fetch`함수를 사용했지만, 실습해왔던 코드를 그대로 사용하여 우리는 `axios`를 그대로 사용해보겠습니다.

#### User.js
```javascript
import React from 'react'
import axios from 'axios'
import { useAsync } from 'react-use'

async function getUser(id) {
  const url = `https://jsonplaceholder.typicode.com/users/${id}`
  const response = await axios.get(url)
  return response.data
}

function User({ id }) {
  const state = useAsync(() => getUser(id), [id])
  const { loading, error, value: user } = state

  if (loading) return <div>로딩중..</div>
  if (error) return <div>Error Occured: {error.message}</div>
  if (!user) return null
  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  )
}

export default User
```

그리고, `useAsync` 를 사용 할 때 `watch` 배열에 특정 값을 넣어주면 이 값이 바뀔 때마다 첫 번째 변수로 넣어준 비동기 함수를 다시 호출해줍니다.


### Users 컴포넌트 전환

* 이번에는 Users 컴포넌트를 react-use 의 `useAsyncRetry` 를 사용하는 코드로 전환을 해봅시다.

#### Users.js
```javascript
```jsx
import React from 'react'
import axios from 'axios'
import { useAsync } from 'react-use'

async function getUser(id) {
  const url = `https://jsonplaceholder.typicode.com/users/${id}`
  const response = await axios.get(url)
  return response.data
}

function User({ id }) {
  **const state = useAsync(() => getUser(id), [id])**
  const { loading, error, value: user } = state

  if (loading) return <div>로딩중..</div>
  if (error) return <div>Error Occured: {error.message}</div>
  if (!user) return null
  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  )
}

export default User
```

어떤가요? 잘 작동하고 있나요? `retry` 함수를 사용하면, 데이터를 다시 불러올 수 있습니다.

지금은 이전에 Users 컴포넌트를 만들 때, 불러오기 버튼을 눌러야만 데이터를 불러오도록 만들어줬었는데요, 이렇게 해주면, 컴포넌트를 렌더링하는 시점부터 데이터를 불러오게 됩니다.

만약에 우리가 이전 섹션에서 배웠던 `skip`처럼, 렌더링하는 시점이 아닌 사용자의 특정 인터랙션에 따라 API 를 호출하고 싶을 땐!
    - `useAsync` 대신 `useAsyncFn`을 사용하고,
    - state에서 비구조화할당으로 받는 `retry`대신, state와 함께 useAsyncFn이 반환해주는, `dofetch` 함수를 사용하면 됩니다.

#### Users.js
```javascript
import axios from 'axios'
import User from './User'
import React, { useState } from 'react'
import { useAsyncFn } from 'react-use'

async function getUsers() {
  const url = 'https://jsonplaceholder.typicode.com/users'
  const response = await axios.get(url)
  return response.data
}

const Users = () => {
  const [userId, setUserId] = useState(null)
  const [state, doFetch] = useAsyncFn(getUsers)
  const { loading, error, value: users, retry } = state

  if (loading) return <div>로딩중..</div>
  if (error) return <div>Error Occured: {error.message}</div>
  if (!users) return <button onClick={doFetch}>불러오기</button>
  return (
    <>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{ cursor: 'pointer' }}
          >
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={doFetch}>again</button>
      {userId && <User id={userId} />}
    </>
  )
}

export default Users
```

이제 렌더링 시에는 데이터 요청을 하지 않고, 불러오기 버튼을 눌렀을때 데이터 요청을 하게 되는지 확인해보세요.

### 정리

react-use 라이브러리는 정말 쓸만하고, 편합니다. 다만, 우리가 이전에 직접 만들었던 `useAsync` 와 크게 다를 건 없죠. 어떤 측면에서는 우리가 직접 만든 Hook 이 편하기도 합니다. 예를 들어서 Hook 의 옵션이 굉장히 간단하죠. 그리고, `watch` 같은 것 대신에 `deps` 를 사용하기도 하고, 반환 값이 배열 형태이기 때문에 (리액트 자체 내장 Hook 과 사용성이 비슷하다는 측면에서) 더욱 Hook 스럽습니다.

반면에 react-use 의 `useAsync` 는 옵션이 다양하고 (+ `useAsyncFn`, `useAsyncRetry`) 결과 값도 객체 안에 다양한 값이 들어있어서 (`retry`, `doFetch`, ...) 헷갈릴 수 있는 단점이 있긴 하지만 Hook 을 직접 만들 필요 없이 바로 불러와서 사용 할 수 있는 측면에서는 정말 편합니다.

그렇다면 과연 Hook 을 직접 만들어서 써야 할까요 아니면 라이브러리로 불러와서 사용 해야 할까요? 정해진 답은 없습니다.

만약 우리가 직접 만들었던 `useAsync` 의 작동 방식을 완벽히 이해하셨다면 여러분의 필요에 따라 커스터마이징 해가면서 사용 할 수 있으니까 직접 만들어서 사용하는 것을 추천드립니다. 특히나, 연습용 프로젝트가 아니라, 오랫동안 유지보수 할 수도 있게 되는 프로젝트라면 더더욱 추천합니다.

반면, 작은 프로젝트이거나, 직접 만든 `useAsync` 의 작동 방식이 조금 어렵게 느껴지신다면 라이브러리로 설치해서 사용하는것도 좋습니다.

