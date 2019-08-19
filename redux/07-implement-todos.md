## 7. 할 일 목록 구현하기

이번에는 할 일 목록을 구현해보도록 하겠습니다.

### 프리젠테이셔널 컴포넌트 구현하기

먼저 Todos 라는 프리젠테이셔널 컴포넌트를 구현하겠습니다. components 디렉터리에 Todos.js 파일을 생성하세요.

이 파일에는 TodoItem, TodoList, Todos 이렇게 총 3가지의 컴포넌트를 작성 할 것입니다. 이렇게 여러개의 컴포넌트를 만드는 이유는 컴포넌트의 리렌더링 성능을 최적화하기 위함입니다. 지금은 편의상 한 파일에 모두 작성을 할건데, 취향에 따라 각각 다른 파일에 분리하셔도 상관 없습니다.

#### components/Todos.js
```javascript
import React, { useState } from 'react';

// 컴포넌트 최적화를 위하여 React.memo를 사용합니다
const TodoItem = React.memo(function TodoItem({ todo, onToggle }) {
  return (
    <li
      style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
      onClick={() => onToggle(todo.id)}
    >
      {todo.text}
    </li>
  );
});

// 컴포넌트 최적화를 위하여 React.memo를 사용합니다
const TodoList = React.memo(function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
});

function Todos({ todos, onCreate, onToggle }) {
  // 리덕스를 사용한다고 해서 모든 상태를 리덕스에서 관리해야하는 것은 아닙니다.
  const [text, setText] = useState('');
  const onChange = e => setText(e.target.value);
  const onSubmit = e => {
    e.preventDefault(); // Submit 이벤트 발생했을 때 새로고침 방지
    onCreate(text);
    setText(''); // 인풋 초기화
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={text}
          placeholder="할 일을 입력하세요.."
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <TodoList todos={todos} onToggle={onToggle} />
    </div>
  );
}

export default Todos;
```

### 컨테이너 컴포넌트 만들기

이제 컨테이너 컴포넌트도 만듭시다. containers 디렉터리에 TodosContainer.js 파일을 생성해서 다음과 같이 작성해보세요.

```javascript
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Todos from '../components/Todos';
import { addTodo, toggleTodo } from '../modules/todos';

function TodosContainer() {
  // useSelector 에서 꼭 객체를 반환 할 필요는 없습니다.
  // 한 종류의 값만 조회하고 싶으면 그냥 원하는 값만 바로 반환하면 됩니다.
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const onCreate = text => dispatch(addTodo(text));
  const onToggle = useCallback(id => dispatch(toggleTodo(id)), [dispatch]); // 최적화를 위해 useCallback 사용

  return <Todos todos={todos} onCreate={onCreate} onToggle={onToggle} />;
}

export default TodosContainer;
```

이제 이 컴포넌트를 App에서 렌더링해볼까요?


#### App.js
```javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';
import TodosContainer from './containers/TodosContainer';

function App() {
  return (
    <div>
      <CounterContainer />
      <hr />
      <TodosContainer />
    </div>
  );
}

export default App;
```

![](https://i.imgur.com/5Jqntqc.png)

새 항목이 잘 등록되는지, 그리고 항목을 클릭했을때 토글이 잘되는지 확인해보세요.

