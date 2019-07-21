## 3. 기능 구현하기

Context 를 만들어주었으니, 이제 Context 와 연동을 하여 기능을 구현해봅시다. Context 에 있는 `state` 를 받아와서 렌더링을 하고, 필요한 상황에는 특정 액션을 `dispatch` 하면 됩니다.

> 이번 섹션의 코드는 다음 CodeSandbox 에서 확인 할 수 있습니다.
> [![Edit mashup-todolist](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mashup-todolist-pn3ch?fontsize=14)

### TodoHead 완성하기

TodoHead 에서는 `done` 값이 `false` 인 항목들의 개수를 화면에 보여줍니다. 

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
  const undoneTasks = todos.filter(todo => !todo.done);

  return (
    <TodoHeadBlock>
      <h1>2019년 7월 10일</h1>
      <div className="day">수요일</div>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;
```

코드 저장 후, 브라우저에서 "할 일 2개 남음" 이 여전히 잘 보여지고 있는지 확인해보세요.

그 다음에는, 날짜가 보여지는 부분을 작업해주겠습니다. 이 과정에서는 Date 의 [toLocaleString](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) 이라는 함수를 사용합니다.

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
  const undoneTasks = todos.filter(todo => !todo.done);

  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dayName = today.toLocaleDateString('ko-KR', { weekday: 'long' });

  return (
    <TodoHeadBlock>
      <h1>{dateString}</h1>
      <div className="day">{dayName}</div>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;
```

코드를 저장하고 오늘의 날짜가 잘 보여지는지 확인해보세요.

### TodoList 완성하기

TodoList 에서는 `state` 를 조회하고 이를 렌더링해주어야 합니다. 그리고, `onToggle`, `onRemove` 와 같이 항목에 변화를 주는 작업은 이 컴포넌트에서 신경 쓸 필요 없습니다. 이 작업은 우리가 각 `TodoItem` 에서 해줄 것입니다.

#### components/TodoList.js

```javascript
import React from 'react';
import styled from 'styled-components';
import TodoItem from './TodoItem';
import { useTodoState } from '../TodoContext';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
`;

function TodoList() {
  const todos = useTodoState();

  return (
    <TodoListBlock>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          done={todo.done}
        />
      ))}
    </TodoListBlock>
  );
}

export default TodoList;
```

작업이 끝났습니다. 정말 간단하죠? 코드를 저장하고 항목들이 이전과 같이 오류없이 잘 나타나는지 확인하세요.


### TodoItem 완성하기

이번에는 `dispatch` 를 사용해서 토글 기능과 삭제 기능을 구현해보겠습니다.

#### components/TodoItem.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { MdDone, MdDelete } from 'react-icons/md';
import { useTodoDispatch } from '../TodoContext';

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;
  opacity: 0;
  &:hover {
    color: #ff6b6b;
  }
`;

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  &:hover {
    ${Remove} {
      opacity: 1;
    }
  }
`;

const CheckCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid #ced4da;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  cursor: pointer;
  ${props =>
    props.done &&
    css`
      border: 1px solid #38d9a9;
      color: #38d9a9;
    `}
`;

const Text = styled.div`
  flex: 1;
  font-size: 21px;
  color: #495057;
  ${props =>
    props.done &&
    css`
      color: #ced4da;
    `}
`;

function TodoItem({ id, done, text }) {
  const dispatch = useTodoDispatch();
  const onToggle = () => dispatch({ type: 'TOGGLE', id });
  const onRemove = () => dispatch({ type: 'REMOVE', id });
  return (
    <TodoItemBlock>
      <CheckCircle done={done} onClick={onToggle}>
        {done && <MdDone />}
      </CheckCircle>
      <Text done={done}>{text}</Text>
      <Remove onClick={onRemove}>
        <MdDelete />
      </Remove>
    </TodoItemBlock>
  );
}

export default TodoItem;
```

이제 기능이 잘 작동하는지 확인해보세요.

![](https://i.imgur.com/u3y0tOU.gif)

잘 작동했다면, 맨 마지막줄 내보내는 부분에서 `React.memo` 를 사용해주세요.

```javascript
export default React.memo(TodoItem);
```

이렇게 하면, 다른 항목이 업데이트 될 때, 불필요한 리렌더링을 방지하게 되어 성능을 최적화 할 수 있게 됩니다.


### TodoCreate 완성하기

이번에는 TodoCreate 의 기능을 완성해줄 차례입니다. 이 컴포넌트에서는 자체적으로 관리해야 할 input 상태도 있습니다. 코드를 다음과 같이 작성해보세요.

#### components/TodoCreate.js
```javascript
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useTodoDispatch, useTodoNextId } from '../TodoContext';

const CircleButton = styled.button`
  background: #38d9a9;
  &:hover {
    background: #63e6be;
  }
  &:active {
    background: #20c997;
  }

  z-index: 5;
  cursor: pointer;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, 50%);
  color: white;
  border-radius: 50%;
  border: none;
  outline: none;


  transition: 0.125s all ease-in;
  ${props =>
    props.open &&
    css`
      background: #ff6b6b;
      &:hover {
        background: #ff8787;
      }
      &:active {
        background: #fa5252;
      }
      transform: translate(-50%, 50%) rotate(45deg);
    `}
`;

const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
`;

const InsertForm = styled.form`
  background: #f8f9fa;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 32px;
  padding-bottom: 72px;

  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  width: 100%;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;
`;

function TodoCreate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const dispatch = useTodoDispatch();
  const nextId = useTodoNextId();

  const onToggle = () => setOpen(!open);
  const onChange = e => setValue(e.target.value);
  const onSubmit = e => {
    e.preventDefault(); // 새로고침 방지
    dispatch({
      type: 'CREATE',
      todo: {
        id: nextId.current,
        text: value,
        done: false
      }
    });
    setValue('');
    setOpen(false);
    nextId.current += 1;
  };

  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onSubmit={onSubmit}>
            <Input
              autoFocus
              placeholder="할 일을 입력 후, Enter 를 누르세요"
              onChange={onChange}
              value={value}
            />
          </InsertForm>
        </InsertFormPositioner>
      )}
      <CircleButton onClick={onToggle} open={open}>
        <MdAdd />
      </CircleButton>
    </>
  );
}

export default React.memo(TodoCreate);
```

이 컴포넌트의 onSubmit 에서는 새로운 항목을 추가하는 액션을 `dispatch` 한 후, `value` 초기화 및 `open` 값을 `false` 로 전환해주었습니다.

그리고 맨 마지막 줄에서는 `React.memo` 로 감싸주었는데요, 이렇게 함으로써 TodoContext 에서 관리하고 있는 `state` 가 바뀔 때 때 TodoCreate 의 불필요한 리렌더링을 방지 할 수 있습니다. 만약 우리가 Context 를 하나만 만들었다면 이런 최적화를 하지 못하게 됩니다.


![](https://i.imgur.com/lfzbcSi.gif)

이제 이번 프로젝트의 모든 기능 구현이 끝났습니다!
