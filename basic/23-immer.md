## 23. Immer 를 사용한 더 쉬운 불변성 관리

리액트에서 배열이나 객체를 업데이트 해야 할 때에는 직접 수정 하면 안되고 불변성을 지켜주면서 업데이트를 해주어야 합니다.

예를 들자면 다음과 같이 하면 안되고

```javascript
const object = {
  a: 1,
  b: 2
};

object.b = 3;
```

다음과 같이 ... 연산자를 사용해서 새로운 객체를 만들어주어야 하죠.

```javascript
const object = {
  a: 1,
  b: 2
};

const nextObject = {
  ...object,
  b: 3
};
```

배열도 마찬가지로, `push`, `splice` 등의 함수를 사용하거나 n 번째 항목을 직접 수정하면 안되고 다음과 같이 `concat`, `filter`, `map` 등의 함수를 사용해야 합니다.

```javascript
const todos = [
  {
    id: 1,
    text: '할 일 #1',
    done: true
  },
  {
    id: 2
    text: '할 일 #2',
    done: false
  }
];

const inserted = todos.concat({
  id: 3,
  text: '할 일 #3',
  done: false
});

const filtered = todos.filter(todo => todo.id !== 2);

const toggled = todos.map(
  todo => todo.id === 2
    ? {
      ...todo,
      done: !todo.done,
    }
    : todo
);
```

대부분의 경우 ... 연산자 또는 배열 내장함수를 사용하는건 그렇게 어렵지는 않지만 데이터의 구조가 조금 까다로워지면 불변성을 지켜가면서 새로운 데이터를 생성해내는 코드가 조금 복잡해집니다.

가령 다음과 같은 객체가 있다고 가정해봅시다.

```javascript
const state = {
  posts: [
    {
      id: 1,
      title: '제목입니다.',
      body: '내용입니다.',
      comments: [
        {
          id: 1,
          text: '와 정말 잘 읽었습니다.'
        }
      ]
    },
    {
      id: 2,
      title: '제목입니다.',
      body: '내용입니다.',
      comments: [
        {
          id: 2,
          text: '또 다른 댓글 어쩌고 저쩌고'
        }
      ]
    }
  ],
  selectedId: 1
};
```

여기서 `posts` 배열 안의 id 가 1 인 `post` 객체를 찾아서, `comments` 에 새로운 댓글 객체를 추가해줘야 한다고 가정해봅시다. 그렇다면, 다음과 같이 업데이트 해줘야 할 것입니다.

```javascript
const nextState = {
  ...state,
  posts: state.posts.map(post =>
    post.id === 1
      ? {
          ...post,
          comments: post.comments.concat({
            id: 3,
            text: '새로운 댓글'
          })
        }
      : post
  )
};
```

이게 어려운건 아닌데, 솔직히 코드의 구조가 좀 복잡해져서 코드를 봤을 때 한 눈에 들어오질 않습니다.

이럴 때, immer 라는 라이브러리를 사용하면 다음과 같이 구현을 할 수 있답니다.

```javascript
const nextState = produce(state, draft => {
  const post = draft.posts.find(post => post.id === 1);
  post.comments.push({
    id: 3,
    text: '와 정말 쉽다!'
  });
});
```

어떤가요? 코드가 훨씬 깔끔하고 잘 읽혀지죠?

Immer 를 배우기전에 간단하게 요약을 해드리겠습니다. Immer 를 사용하면 우리가 상태를 업데이트 할 때, 불변성을 신경쓰지 않으면서 업데이트를 해주면 Immer 가 불변성 관리를 대신 해줍니다.

### Immer 사용법

이번 섹션에서는 우리가 기존에 만들었던 사용자 관리 프로젝트에 Immer 를 적용해보면서 Immer 의 사용법을 알아보겠습니다.

우선 프로젝트에서 다음 명령어를 실행하여 Immer 를 설치해주세요.

```bash
$ yarn add immer
```

이 라이브러리를 사용 할 땐 다음과 같이 사용합니다.

우선 코드의 상단에서 immer 를 불러와주어야 합니다. 보통 `produce` 라는 이름으로 불러옵니다.

```javascript
import produce from 'immer';
```

그리고 `produce` 함수를 사용 할 때에는 첫번째 파라미터에는 수정하고 싶은 상태, 두번째 파라미터에는 어떻게 업데이트하고 싶을지 정의하는 함수를 넣어줍니다.

두번째 파라미터에 넣는 함수에서는 불변성에 대해서 신경쓰지 않고 그냥 업데이트 해주면 다 알아서 해줍니다.

```javascript
const state = {
  number: 1,
  dontChangeMe: 2
};

const nextState = produce(state, draft => {
  draft.number += 1;
});

console.log(nextState);
// { number: 2, dontChangeMe: 2 }
```

다음 링크를 열어서 CodeSandbox 를 열으시면, Immer 를 쉽게 연습해보실 수 있습니다.
[![Edit pedantic-grass-ojocz](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/pedantic-grass-ojocz?fontsize=14)

연습 해보고 싶으시면 위 CodeSandbox 에서 해보시고, 우리 프로젝트에서 사용해보겠습니다.

### 리듀서에서 Immer 사용하기

미리 말씀을 드리자면, Immer 를 사용해서 간단해지는 업데이트가 있고, 오히려 코드가 길어지는 업데이트 들이 있습니다.

예를들어서 우리가 만들었던 프로젝트의 상태의 경우 `users` 배열이 객체의 깊은곳에 위치하지 않기 때문에 새 항목을 추가하거나 제거 할 때는 Immer 를 사용하는 것 보다 `concat` 과 `filter` 를 사용하는것이 더 코드가 짧고 편합니다.

하지만, 사용법을 잘 배워보기 위하여 해당 업데이트도 이번 강좌에서 Immer 를 사용하여 처리를 해주겠습니다.

#### App.js

```javascript
import React, { useReducer, useMemo } from 'react';
import UserList from './UserList';
import CreateUser from './CreateUser';
import produce from 'immer';

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
      return produce(state, draft => {
        draft.users.push(action.user);
      });
    case 'TOGGLE_USER':
      return produce(state, draft => {
        const user = draft.users.find(user => user.id === action.id);
        user.active = !user.active;
      });
    case 'REMOVE_USER':
      return produce(state, draft => {
        const index = draft.users.findIndex(user => user.id === action.id);
        draft.users.splice(index, 1);
      });
    default:
      return state;
  }
}

// UserDispatch 라는 이름으로 내보내줍니다.
export const UserDispatch = React.createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { users } = state;

  const count = useMemo(() => countActiveUsers(users), [users]);
  return (
    <UserDispatch.Provider value={dispatch}>
      <CreateUser />
      <UserList users={users} />
      <div>활성사용자 수 : {count}</div>
    </UserDispatch.Provider>
  );
}

export default App;
```

[![Edit begin-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/begin-react-1lzz8?fontsize=14)

`TOGGLE_USER` 액션의 경우엔 확실히 Immer 를 사용하니 코드가 깔끔해졌지만 나머지의 경우에는 오히려 코드가 좀 복잡해졌지요? 상황에 따라 잘 선택하여 사용하시면 됩니다. Immer 를 사용한다고 해서 모든 업데이트 로직에서 사용을 하실 필요는 없습니다.

### Immer 와 함수형 업데이트

우리가 이전에 `useState` 를 사용 할 때 함수형 업데이트란걸 할 수 있다고 배웠습니다. 예를 들자면,

```javascript
const [todo, setTodo] = useState({
  text: 'Hello',
  done: false
});

const onClick = useCallback(() => {
  setTodo(todo => ({
    ...todo,
    done: !todo.done
  }));
}, []);
```

이렇게 `setTodo` 함수에 업데이트를 해주는 함수를 넣음으로써, 만약 `useCallback` 을 사용하는 경우 두번째 파라미터인 `deps` 배열에 `todo` 를 넣지 않아도 되게 되지요.

이렇게 함수형 업데이트를 하는 경우에, Immer 를 사용하면 상황에 따라 더 편하게 코드를 작성 할 수 있습니다.

만약에 `produce` 함수에 두개의 파라미터를 넣게 된다면, 첫번째 파라미터에 넣은 상태를 불변성을 유지하면서 새로운 상태를 만들어주지만,
만약에 첫번째 파라미터를 생략하고 바로 업데이트 함수를 넣어주게 된다면, 반환 값은 새로운 상태가 아닌 상태를 업데이트 해주는 함수가 됩니다. 설명으로 이해하기가 조금 어려울 수 있는데 코드를 보면 조금 더 이해가 쉬워집니다.

```javascript
const todo = {
  text: 'Hello',
  done: false
};

const updater = produce(draft => {
  draft.done = !draft.done;
});

const nextTodo = updater(todo);

console.log(nextTodo);
// { text: 'Hello', done: true }
```

결국 `produce` 가 반환하는것이 업데이트 함수가 되기 때문에 `useState` 의 업데이트 함수를 사용 할 떄 다음과 같이 구현 할 수 있게 되지요.

```javascript
const [todo, setTodo] = useState({
  text: 'Hello',
  done: false
});

const onClick = useCallback(() => {
  setTodo(
    produce(draft => {
      draft.done = !draft.done;
    })
  );
}, []);
```

이러한 속성을 잘 알아두시고, 나중에 필요할때 잘 사용하시면 되겠습니다.

Immer 은 분명히 정말 편한 라이브러리인것은 사실입니다. 하지만, 확실히 알아둘 점은, 성능적으로는 Immer 를 사용하지 않은 코드가 조금 더 빠르다는 점 입니다.

![](https://github.com/immerjs/immer/raw/master/images/performance.png)

위 성능 분석표는 50,000개의 원소중에서 5,000 개의 원소를 업데이트 하는 코드를 비교 했을때의 결과입니다. 보시면, Immer 의 경우 31ms 걸리는 작업이 (map 을 사용하는) Native Reducer 에서는 6ms 걸린 것을 확인 할 수 있습니다.

그런데, 이렇게 데이터가 많은데도 31ms 가 걸린다는 것은 사실 큰 문제가 아닙니다. 인간이 시각적으로 인지 할 수있는 최소 딜레이는 13ms 라고 합니다 ([참고](https://www.pubnub.com/blog/how-fast-is-realtime-human-perception-and-technology/)]) 그런 것을 생각하면 25ms 의 차이는, 사실 그렇게 큰 차이가 아니기 때문에 걱정할 필요 없습니다. 심지어, 데이터가 50,000개 가량 있는게 아니라면 별로 성능 차이가 별로 없을 것이기 때문에 더더욱 걱정하지 않아도 됩니다.

단, Immer 는 JavaScript 엔진의 [Proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 라는 기능을 사용하는데, 구형 브라우저 및 react-native 같은 환경에서는 지원되지 않으므로 (Proxy 처럼 작동하지만 Proxy는 아닌) ES5 fallback 을 사용하게 됩니다. ES5 fallback 을 사용하게 되는경우는 191ms 정도로, 꽤나 느려지게 됩니다. 물론, 여전히 데이터가 별로 없다면 크게 걱정 할 필요는 없습니다.

Immer 라이브러리는 확실히 편하기 때문에, 데이터의 구조가 복잡해져서 불변성을 유지하면서 업데이트하려면 코드가 복잡해지는 상황이 온다면, 이를 사용하는 것을 권장드립니다.

다만, 무조건 사용을 하진 마시고, 가능하면 데이터의 구조가 복잡해지게 되는 것을 방지하세요. 그리고 어쩔 수 없을 때 Immer 를 사용하는것이 좋습니다. Immer 를 사용한다고 해도, 필요한곳에만 쓰고, 간단히 처리 될 수 있는 곳에서는 그냥 일반 JavaScript 로 구현하시길 바랍니다.
