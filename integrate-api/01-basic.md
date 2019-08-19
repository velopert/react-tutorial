## 1. API 연동의 기본

API 연동을 하기 위해서, 우선 프로젝트를 새로 만들어주도록 하겠습니다.

```bash
$ npx create-react-app api-integrate
```

그리고, API 를 호출하기 위해서 [axios](https://github.com/axios/axios) 라는 라이브러리를 설치하세요.

```bash
$ cd api-integrate
$ yarn add axios
```

axios를 사용해서 GET, PUT, POST, DELETE 등의 메서드로 API 요청을 할 수 있는데요, 만약 이 메서드들에 대하여 잘 모르시는 경우에는 [REST API](https://meetup.toast.com/posts/92) 에 대한 글을 한번 읽어보세요.

간단하게 설명을 드리자면, REST API 를 사용 할 때에는 하고 싶은 작업에 따라 다른 메서드로 요청을 할 수 있는데 메서드들은 다음 의미를 가지고 있습니다.

- **GET**: 데이터 조회
- **POST**: 데이터 등록
- **PUT**: 데이터 수정
- **DELETE**: 데이터 제거

참고로 이 메서드 외에도 [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH), [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) 와 같은 메서드들도 있습니다.

axios 의 사용법은 다음과 같습니다.

```javascript
import axios from 'axios';

axios.get('/users/1');
```

`get` 이 위치한 자리에는 메서드 이름을 소문자로 넣습니다. 예를 들어서 새로운 데이터를 등록하고 싶다면 `axios.post()` 를 사용하면 됩니다.

그리고, 파라미터에는 API 의 주소를 넣습니다.

`axios.post()` 로 데이터를 등록 할 때에는 두번째 파라미터에 등록하고자 하는 정보를 넣을 수 있습니다.

```javascript
axios.post('/users', {
  username: 'blabla',
  name: 'blabla'
});
```

우리가 이번에 API 연동 실습을 할 때에는 [JSONPlaceholder](https://jsonplaceholder.typicode.com/) 에 있는 연습용 API 를 사용해볼 것입니다.

그 중에서 사용 할 API 는 다음 주소인데요

https://jsonplaceholder.typicode.com/users

결과물은 다음과 같은 형식으로 이루어져있습니다.

```javascript
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  },
  (...)
]
```

### useState 와 useEffect 로 데이터 로딩하기

`useState` 를 사용하여 요청 상태를 관리하고, `useEffect` 를 사용하여 컴포넌트가 렌더링되는 시점에 요청을 시작하는 작업을 해보겠습니다.

요청에 대한 상태를 관리 할 때에는 다음과 같이 총 3가지 상태를 관리해주어야합니다.

1. 요청의 결과
2. 로딩 상태
3. 에러 

src 컴포넌트에 Users.js 를 생성하고 다음 코드를 작성해보세요.

#### Users.js
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setUsers(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/users'
        );
        setUsers(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.username} ({user.name})
        </li>
      ))}
    </ul>
  );
}

export default Users;
```

참고로, `useEffect` 에 첫번째 파라미터로 등록하는 함수에는 `async` 를 사용 할 수 없기 때문에 함수 내부에서 `async` 를 사용하는 새로운 함수를 선언해주어야 합니다.

로딩 상태가 활성화 됐을 땐 `로딩중..` 이라는 문구를 보여줬습니다.

그리고, `users` 값이 아직 없을 때에는 `null` 을 보여주도록 처리했습니다.

맨 마지막에서는 `users` 배열을 렌더링하는 작업을 해주었습니다.



이제 이 컴포넌트가 잘 작동하는지 확인해봅시다. App 컴포넌트에서 User 컴포넌트를 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import Users from './Users';

function App() {
  return <Users />;
}

export default App;
```

![](https://i.imgur.com/y0oXOGZ.gif)

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-ihvxi?fontsize=14)

잘 작동하고 있나요?

### 에러 발생 확인하기

에러가 발생하는지도 확인해봅시다. 에러가 발생하는것을 확인하기 위하여 주소를 이상하게 바꿔봅시다.


```javascript
const response = await axios.get(
  'https://jsonplaceholder.typicode.com/users/showmeerror'
);
```

![](https://i.imgur.com/h8apZXX.png)

에러가 잘 나타났나요? 에러가 발생 한 것을 확인하셨다면 다시 원상복구하세요.

### 버튼을 눌러서 API 재요청하기

이번에는 버튼을 눌러서 API를 재요청하는 기능을 구현해보겠습니다. 그렇게 하려면, 아까 구현했던 `fetchUsers` 함수를 바깥으로 꺼내주고, 버튼을 만들어서 해당 함수를 연결해주면 됩니다.

#### Users.js
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);
      setUsers(null);
      // loading 상태를 true 로 바꿉니다.
      setLoading(true);
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      setUsers(response.data); // 데이터는 response.data 안에 들어있습니다.
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <button onClick={fetchUsers}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

![](https://i.imgur.com/njEgHrb.gif)

[![Edit api-integrate](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/api-integrate-yfwg7?fontsize=14)

다시 불러오기 버튼이 잘 작동하고 있나요?
