## 02. Context API 를 활용한 상태 관리

우리가 만든 투두 리스트 애플리케이션에서, 만약 상태 관리를 한다면 다음과 같은 구조로 구현 할 수 있습니다.

![](https://i.imgur.com/hX8jjXG.png)

App 에서 todos 상태와, onToggle, onRemove, onCreate 함수를 지니고 있게 하고, 해당 값들을 props 를 사용해서 자식 컴포넌트들에게 전달해주는 방식으로 구현 할 수 있죠.

이렇게 구현하는것도 큰 문제는 없습니다. 이 프로젝트는 정말 작고 단순하기 때문이죠.

하지만, 프로젝트의 규모가 커지게 된다면 최상위 컴포넌트인 App 에서 모든 상태 관리를 하기엔 App 컴포넌트의 코드가 너무 복잡해질 수도 있고, props 를 전달해줘야 하는 컴포넌트가 너무 깊숙히 있을 수도 있습니다 (여러 컴포넌트를 거쳐서 전달해야 하는 경우를 의미합니다)

만약 Context API 를 활용한다면 다음과 같이 구현 할 수 있습니다.

![](https://i.imgur.com/lYiiIZF.png)

선이 많아서 구조가 복잡해 보일 수도 있지만, 실제로 코드는 굉장히 깔끔하답니다. 우리가 리액트 입문 챕터에서 Context API를 다룰 때에는 `dispatch` 만 Context API 를 사용하여 컴포넌트에서 `dispatch` 를 바로 참조하는 방법만 다뤘었는데요, 이번에는 상태도 함께 다뤄보도록 하겠습니다.

> 이번 섹션의 코드는 다음 CodeSandbox 에서 확인 할 수 있습니다.
> [![Edit mashup-todolist](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mashup-todolist-r6ozk?fontsize=14)

### 리듀서 만들기

먼저, src 디렉터리에 TodoContext.js 파일을 생성하고, 그 안에  `useReducer` 를 사용하여 상태를 관리하는 TodoProvider 라는 컴포넌트를 만들어보세요.

#### TodoContext.js
```javascript
import React, { useReducer } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  return children;
}
```

### Context 만들기

이제, `state` 와 `dispatch` 를 Context 통하여 다른 컴포넌트에서 바로 사용 할 수 있게 해줄건데요, 우리는 하나의 Context 를 만들어서 `state` 와 `dispatch` 를 함께 넣어주는 대신에, 두개의 Context 를 만들어서 따로 따로 넣어줄 것입니다. 이렇게 하면 `dispatch` 만 필요한 컴포넌트에서 불필요한 렌더링을 방지 할 수 있습니다. 추가적으로, 사용하게 되는 과정에서 더욱 편리하기도 합니다.

#### TodoContext.js
```javascript
import React, { useReducer, createContext } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}
```

Context 에서 사용 할 값을 지정 할 때에는 위와 같이 Provider 컴포넌트를 렌더링 하고 `value` 를 설정해주면 됩니다. 그리고, props 로 받아온 `children` 값을 내부에 렌더링해주세요.

이렇게 하면 다른 컴포넌트에서 `state` 나 `dispatch`를 사용하고 싶을 때 다음과 같이 할 수 있습니다.

```javascript
import React, { useContext } from 'react';
import { TodoStateContext, TodoDispatchContext } from '../TodoContext';

function Sample() {
  const state = useContext(TodoStateContext);
  const dispatch = useContext(TodoDispatchContext);
  return <div>Sample</div>;
}
```

### 커스텀 Hook 만들기

우리는 컴포넌트에서 `useContext` 를 직접 사용하는 대신에, `useContext` 를 사용하는 커스텀 Hook 을 만들어서 내보내주겠습니다.

#### TodoContext.js
```javascript
import React, { useReducer, createContext, useContext } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

export function useTodoState() {
  return useContext(TodoStateContext);
}

export function useTodoDispatch() {
  return useContext(TodoDispatchContext);
}
```

이렇게 해주면 나중에 이렇게 사용 할 수 있답니다.

```javascript
import React from 'react';
import { useTodoState, useTodoDispatch } from '../TodoContext';

function Sample() {
  const state = useTodoState();
  const dispatch = useTodoDispatch();
  return <div>Sample</div>;
}
```

이렇개 사용하면 조금 더 사용성이 편합니다. 하지만, 취향에 따라 `useContext` 를 컴포넌트에서 바로 사용해도 상관은 없습니다.

### nextId 값 관리하기

우리는 이제 `state` 를 위한 Context 와 `dispatch` 를 위한 Context 를 만들었는데요, 여기서 추가적으로 `nextId` 값을 위한 Context 를 만들어주겠습니다. 여기서 `nextId` 가 의미하는 값은 새로운 항목을 추가 할 때 사용 할 고유 ID 입니다. 이 값은, `useRef` 를 사용하여 관리해주도록 하겠습니다.

#### TodoContext.js
```javascript
import React, { useReducer, createContext, useContext, useRef } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

export function useTodoState() {
  return useContext(TodoStateContext);
}

export function useTodoDispatch() {
  return useContext(TodoDispatchContext);
}

export function useTodoNextId() {
  return useContext(TodoNextIdContext);
}
```

`nextId` 값을 위한 Context 를 만들 때에도 마찬가지로 `useTodoNextId` 라는 커스텀 Hook을 따로 만들어주었습니다.

### 커스텀 Hook 에서 에러 처리

우리가 만든 `useTodoState`, `useTodoDispatch`, `useTodoNextId` Hook 을 사용하려면, 해당 컴포넌트가 TodoProvider 컴포넌트 내부에 렌더링되어 있어야 합니다 (예: App 컴포넌트에서 모든 내용을 TodoProvider 로 감싸기). 만약 TodoProvider 로 감싸져있지 않다면 에러를 발생시키도록 커스텀 Hook 을 수정해보겠습니다.

#### TodoProvider.js
```javascript
import React, { useReducer, createContext, useContext, useRef } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}
```

꼭 이렇게 해줄 필요는 없지만, Context 사용을 위한 커스텀 Hook 을 만들 때 이렇게 에러 처리를 해준다면, 나중에 실수를 하게 됐을 때 문제점을 빨리 발견 할 수 있습니다.

### 컴포넌트 TodoProvider 로 감싸기

우리 프로젝트 모든 곳에서 Todo 관련 Context 들을 사용 할 수 있도록, App 컴포넌트에서 TodoProvider 를 불러와서 모든 내용을 TodoProvider 로 감싸주겠습니다.

#### App.js

```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import TodoTemplate from './components/TodoTemplate';
import TodoHead from './components/TodoHead';
import TodoList from './components/TodoList';
import TodoCreate from './components/TodoCreate';
import { TodoProvider } from './TodoContext';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <TodoProvider>
      <GlobalStyle />
      <TodoTemplate>
        <TodoHead />
        <TodoList />
        <TodoCreate />
      </TodoTemplate>
    </TodoProvider>
  );
}

export default App;
```

이제 한번 TodoHead 컴포넌트에서 `useTodoState` 를 사용해볼까요?

#### components/TodoHead.js
```javascript
import React from 'react';
import styled from 'styled-components';
import { useTodoState } from '../TodoContext';

const TodoHeadBlock = styled.div`
  padding-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
  h1 {
    margin: 0;
    font-size: 36px;
    color: #343a40;
  }
  .day {
    margin-top: 4px;
    color: #868e96;
    font-size: 21px;
  }
  .tasks-left {
    color: #20c997;
    font-size: 18px;
    margin-top: 40px;
    font-weight: bold;
  }
`;

function TodoHead() {
  const todos = useTodoState();
  console.log(todos);
  return (
    <TodoHeadBlock>
      <h1>2019년 7월 10일</h1>
      <div className="day">수요일</div>
      <div className="tasks-left">할 일 2개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;

```

![](https://i.imgur.com/ary9WfO.png)

콘솔에 현재 Context 가 지니고 있는 `state` 가 잘 출력됐나요?