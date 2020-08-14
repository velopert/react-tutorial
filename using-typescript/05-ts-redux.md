## 5. TypeScript 에서 리덕스 프로처럼 사용하기

이번 튜토리얼에서는 TypeScript 에서 리덕스를 프로처럼 사용하는 방법을 배워보도록 하겠습니다. 왜 제목이 "프로처럼" 이냐! 사실 조금 주관적입니다. 이 튜토리얼에서는 제가 여러 형태의 구조를 삽질을 거듭한 끝의 결과물을 소개시켜드릴건데요, 이 튜토리얼에서 사용하는 구조가 무조건 정답은 아닙니다. 다만, 충분히 괜찮고, 쓸만하다고 생각합니다.

근데 프로처럼 사용해보기 전에는 당연히 기초부터 알아보아야겠죠. 먼저, 진짜 기본적인 방법을 알아보고, "프로처럼" 사용하는것도 해보겠습니다.

우리는 리덕스를 적용한 리액트 프로젝트를 만들어볼건데요, 우리가 이전 [리덕스 튜토리얼](https://react.vlpt.us/redux/)에서 만들어봤었던 카운터와, 할 일 목록을 구현할것입니다. 리덕스를 잘 모르신다면 해당 튜토리얼을 먼저 보시고 이 튜토리얼을 읽어주시길 바랍니다.

### 프로젝트 만들고, 준비하기

새 프로젝트를 만들고 리덕스를 설치하겠습니다.

```bash
$ npx create-react-app ts-react-redux-tutorial --typescript
$ cd ts-react-redux-tutorial
$ yarn add redux react-redux @types/react-redux
```

redux 의 경우엔 자체적으로 타입스크립트 지원이 됩니다. 하지만 react-redux는 그렇지 않은데요, 이렇게 라이브러리에 자체적으로 타입스크립트 지원이 되지 않는 경우엔 `@types/` 를 앞에 붙여서 설치하면 됩니다.

라이브러리에서 공식 타입스크립트 지원이 되는지 되지 않는지 확인 할 때에는 직접 설치해서 불러와서 확인을 해보셔도 되고, GitHub 레포를 열어서 `index.d.ts` 라는 파일이 있는지 확인해보셔도 됩니다 [(리덕스의 index.d.ts)](https://github.com/reduxjs/redux/blob/master/index.d.ts). 

`@types`는 라이브러리에 타입스크립트 지원을 할 수 있도록 추가된 써드파티 라이브러리입니다. 라이브러리에 써드 파티 타입스크립트 지원이 되는지 확인해보시려면 [npm](https://www.npmjs.com/search?q=%40types%2Freact-redux) 에서 `@types/라이브러리명` 을 입력해보셔도 되고 [TypeSearch](https://microsoft.github.io/TypeSearch/) 에서 라이브러리명을 검색해보셔도 됩니다.


### 카운터 리덕스 모듈 작성하기

가장 간단한 예시인 카운터를 구현해보도록 하겠습니다. 우리는 리덕스 관련 코드를 작성할 때 [Ducks 패턴](https://github.com/erikras/ducks-modular-redux)을 사용 할 것입니다. 즉, 액션타입, 액션생성함수, 리듀서를 모두 한 파일에 작성하겠다는 의미이죠. 

src 디렉터리에 modules 디렉터리를 만들고, 그 안에 counter.ts 파일을 작성하세요.

각 코드에 대한 정보가 주석에 적혀있으니 주석 하나하나 꼼꼼히 읽어보세요.

#### src/modules/counter.ts
```javascript
// 액션 타입을 선언합니다
// 뒤에 as const 를 붙여줌으로써 나중에 액션 객체를 만들게 action.type 의 값을 추론하는 과정에서
// action.type 이 string 으로 추론되지 않고 'counter/INCREASE' 와 같이 실제 문자열 값으로 추론 되도록 해줍니다.
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;

// 액션 생성함수를 선언합니다
export const increase = () => ({
  type: INCREASE
});

export const decrease = () => ({
  type: DECREASE
});

export const increaseBy = (diff: number) => ({
  type: INCREASE_BY,
  // 액션에 부가적으로 필요한 값을 payload 라는 이름으로 통일합니다
  // 이는 FSA (https://github.com/redux-utilities/flux-standard-action) 라는 규칙인데
  // 이 규칙을 적용하면 액션들이 모두 비슷한 구조로 이루어져있게 되어 추후 다룰 때도 편하고
  // 읽기 쉽고, 액션 구조를 일반화함으로써 액션에 관련돤 라이브러리를 사용 할 수 있게 해줍니다.
  // 다만, 무조건 꼭 따를 필요는 없습니다.
  payload: diff
});

// 모든 액션 겍체들에 대한 타입을 준비해줍니다.
// ReturnType<typeof _____> 는 특정 함수의 반환값을 추론해줍니다
// 상단부에서 액션타입을 선언 할 떄 as const 를 하지 않으면 이 부분이 제대로 작동하지 않습니다.
type CounterAction =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseBy>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number;
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};

// 리듀서를 작성합니다.
// 리듀서에서는 state 와 함수의 반환값이 일치하도록 작성하세요.
// 액션에서는 우리가 방금 만든 CounterAction 을 타입으로 설정합니다.
function counter(
  state: CounterState = initialState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case INCREASE: // case 라고 입력하고 Ctrl + Space 를 누르면 어떤 종류의 action.type들이 있는지 확인 할 수 있습니다.
      return { count: state.count + 1 };
    case DECREASE:
      return { count: state.count - 1 };
    case INCREASE_BY:
      return { count: state.count + action.payload };
    default:
      return state;
  }
}

export default counter;
```

모듈을 모두 작성하셨나요? 

### 프로젝트에 리덕스 적용하기

이제 프로젝트에 리덕스를 적용해주겠습니다. 지금은 모듈이 하나 뿐이지만 우리가 추후 하나 더 만들 것이므로 루트 리듀서를 만들어주도록 하겠습니다.

modules 디렉터리에 index.ts 파일을 만들어주세요.

#### modules/index.ts
```javascript
import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
  counter
});

// 루트 리듀서를 내보내주세요.
export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;
```

그 다음에는, index.tsx 에서 스토어를 만들고, Provider 컴포넌트를 사용하여 스토어를 프로젝트에 적용하세요.

#### index.tsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './modules';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

이제 프로젝트에 리덕스를 사용하기 위한 준비가 모두 끝났습니다.

### 카운터 프리젠테이셔널 컴포넌트 만들기

src 디렉터리에 components 디렉터리를 생성하고, 그 안에 Counter.tsx 파일을 만드세요. 리액트 컴포넌트를 작성 할 때에는 `.tsx` 확장자를 사용한다는것 주의하세요.

#### src/components/Counter.tsx
```javascript
import React from 'react';

type CounterProps = {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onIncreaseBy: (diff: number) => void;
}

function Counter({
  count,
  onIncrease,
  onDecrease,
  onIncreaseBy
}: CounterProps) {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
      <button onClick={() => onIncreaseBy(5)}>+5</button>
    </div>
  );
}

export default Counter;
```

컴포넌트에서 필요한 값과 함수들을 모두 props 로 받아오게 했습니다.

### 카운터 컨테이너 컴포넌트 만들기

그럼 이제 리덕스의 값을 불러와서 사용하고, 액션도 디스패치를 하는 컨테이너 컴포넌트를 만들어볼까요? 

src 디렉터리에 containers 디렉터리를 만들어서 그 안에 CounterContainer.tsx 파일을 작성해보세요.

#### src/containers/CounterContainer.tsx
```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { increase, decrease, increaseBy } from '../modules/counter';
import Counter from '../components/Counter';

function CounterContainer () {
  // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다

  // 각 액션들을 디스패치하는 함수들을 만들어줍니다
  const onIncrease = () => {
    dispatch(increase());
  };

  const onDecrease = () => {
    dispatch(decrease());
  };

  const onIncreaseBy = (diff: number) => {
    dispatch(increaseBy(diff));
  };

  return (
    <Counter
      count={count}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onIncreaseBy={onIncreaseBy}
    />
  );
};

export default CounterContainer;
```

꽤나 간단하죠? 신경 쓸 부분은 `useSelector((state: RootState) => state.counter.count);` 가 전부입니다. `count` 값의 타입은 `useSelector` 가 알아서 유추해주니 굳이 `:number` 라고 타입을 설정 할 필요 없습니다.

그럼 이제 잘 작동하는지 확인해볼까요?

App 에서 CounterContainer 를 렌더링하고, `yarn start` 를 입력하여 개발 서버를 구동하세요.

#### App.tsx
```javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';

const App: React.FC = () => {
  return <CounterContainer />;
};

export default App;
```

![](https://i.imgur.com/preTy1s.png)
잘 작동하는지 확인해보세요!

[코드](https://github.com/velopert/ts-react-redux-tutorial/tree/basics/counter/src)

### 투두리스트 리덕스 모듈 만들기

자, 그 다음에는 할 일 목록 (투두리스트)를 구현해봅시다. 먼저 리덕스 모듈부터 준비해줄게요. 아까 작성했던 카운터 모듈이랑 별반 다를 것 없습니다. 그냥 배열을 다룰 뿐이죠.

modules 디렉터리에 todos.ts 파일을 만들어서 다음과 같이 작성하세요.

#### src/modules/todos.ts
```javascript
// 액션 타입 선언
const ADD_TODO = 'todos/ADD_TODO' as const;
const TOGGLE_TODO = 'todos/TOGGLE_TODO' as const;
const REMOVE_TODO = 'todos/REMOVE_TODO' as const;

let nextId = 1; // 새로운 항목을 추가 할 때 사용 할 고유 ID 값

// 액션 생성 함수
export const addTodo = (text: string) => ({
  type: ADD_TODO,
  payload: {
    id: nextId++,
    text
  }
});

export const toggleTodo = (id: number) => ({
  type: TOGGLE_TODO,
  payload: id
});

export const removeTodo = (id: number) => ({
  type: REMOVE_TODO,
  payload: id
});

// 모든 액션 객체들에 대한 타입 준비
type TodosAction =
  | ReturnType<typeof addTodo>
  | ReturnType<typeof toggleTodo>
  | ReturnType<typeof removeTodo>;

// 상태에서 사용 할 할 일 항목 데이터 타입 정의
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// 이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
export type TodosState = Todo[];

// 초기 상태 선언
const initialState: TodosState = [];

// 리듀서 작성
function todos(
  state: TodosState = initialState,
  action: TodosAction
): TodosState {
  switch (action.type) {
    case ADD_TODO:
      return state.concat({
        // action.payload 객체 안의 값이 모두 유추됩니다.
        id: action.payload.id,
        text: action.payload.text,
        done: false
      });
    case TOGGLE_TODO:
      return state.map(todo =>
        // payload 가 number 인 것이 유추됩니다.
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case REMOVE_TODO:
      // payload 가 number 인 것이 유추됩니다.
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}

export default todos;
```

모듈을 다 만드셨으면 루트 리듀서에 todos 리듀서를 등록하세요.

#### modules/index.ts
```javascript
import { combineReducers } from 'redux';
import counter from './counter';
import todos from './todos';

const rootReducer = combineReducers({
  counter,
  todos
});

// 루트 리듀서를 내보내주세요.
export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;
```

### 투두리스트를 위한 프리젠테이셔널 컴포넌트 준비하기

이제 투두리스트를 구현하기 위한 프리젠테이셔널 컴포넌트들을 준비해주겠습니다.
우리가 앞으로 만들 프리젠테이셔널 컴포넌트는 총 3개입니다.

- TodoInsert: 새 항목을 등록하는 용도
- TodoItem: 할 일 정보을 보여주는 용도
- TodoList: 여러개의 TodoItem 을 렌더링하는 용도

그럼, components 디렉터리에 하나 하나 작성해볼까요?

#### src/components/TodoInsert.tsx

새 항목을 등록 할 수 있는 TodoInsert 컴포넌트를 만들어봅시다. 이 컴포넌트에서는 `onInsert` 라는 props 를 받아와서 이 함수를 호출하여 새 항목을 추가하며, input 의 상태는 컴포넌트 내부에서 로컬 상태로 관리합니다.

```javascript
import React, { ChangeEvent, FormEvent, useState } from 'react';

type TodoInsertProps = {
  onInsert: (text: string) => void;
};

function TodoInsert({ onInsert }: TodoInsertProps) {
  const [value, setValue] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onInsert(value);
    setValue('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="할 일을 입력하세요."
        value={value}
        onChange={onChange}
      />
      <button type="submit">등록</button>
    </form>
  );
}

export default TodoInsert;
```


#### src/components/TodoItem.tsx

TodoItem 컴포넌트는 각 할 일 항목에 대한 정보를 보여주는 컴포넌트이며, 텍스트 영역을 클릭하면 `done` 값이 바뀌고, 우측의 (X) 를 클릭하면 항목이 삭제됩니다. 이 컴포넌트에서는 할 일 정보를 지니고 있는 `todo`, 그리고 상태 토글 및 삭제를 해주는 함수 `onToggle` 과 `onRemove` 를 props 로 받아옵니다.

```javascript
import React, { CSSProperties } from 'react';
import { Todo } from '../modules/todos';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  // CSSProperties 는 style 객체의 타입입니다.
  const textStyle: CSSProperties = {
    textDecoration: todo.done ? 'line-through' : 'none'
  };
  const removeStyle: CSSProperties = {
    marginLeft: 8,
    color: 'red'
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleRemove = () => {
    onRemove(todo.id);
  };

  return (
    <li>
      <span onClick={handleToggle} style={textStyle}>
        {todo.text}
      </span>
      <span onClick={handleRemove} style={removeStyle}>
        (X)
      </span>
    </li>
  );
}

export default TodoItem;
```

#### src/components/TodoList.tsx

이 컴포넌트는 여러개의 TodoItem 컴포넌트를 렌더링해줍니다. 할 일 정보들을 지니고 있는 배열인 `todos`와 각 TodoItem 컴포넌트들에게 전달해줘야 할 `onToggle` 과 `onRemove` 를 props 로 받아옵니다.

```javascript
import React from 'react';
import { Todo } from '../modules/todos';
import TodoItem from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) return <p>등록된 항목이 없습니다.</p>;
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          key={todo.id}
        />
      ))}
    </ul>
  );
}

export default TodoList;
```

이제 프리젠테이셔널 컴포넌트들의 준비는 끝났습니다.

### 투두리스트를 위한 컨테이너 컴포넌트 만들기

이번에는 투두리스트를 위한 컴포넌트를 작성할 차례입니다. 컨테이너 컴포넌트의 이름은 TodoApp 으로 하겠습니다. containers 디렉터리에 TodoApp.tsx 를 다음과 같이 작성하세요.

#### src/containers/TodoApp.ts
```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { toggleTodo, removeTodo, addTodo } from '../modules/todos';
import TodoInsert from '../components/TodoInsert';
import TodoList from '../components/TodoList';

function TodoApp() {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const onInsert = (text: string) => {
    dispatch(addTodo(text));
  };

  const onToggle = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const onRemove = (id: number) => {
    dispatch(removeTodo(id));
  };

  return (
    <>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onToggle={onToggle} onRemove={onRemove} />
    </>
  );
}

export default TodoApp;
```

정말 간단하지요? 이제 이 컴포넌트를 App 에서 렌더링해보세요.

#### src/App.tsx
```javascript
import React from 'react';
import TodoApp from './containers/TodoApp';

const App: React.FC = () => {
  return <TodoApp />;
};

export default App;
```

![](https://i.imgur.com/SiZD66F.png)

잘 작동하고있나요?

[코드](https://github.com/velopert/ts-react-redux-tutorial/tree/basics/todos/src)

### typesafe-actions 로 리팩토링

[typesafe-actions](https://www.npmjs.com/package/typesafe-actions) 는 리덕스를 사용하는 프로젝트에서 액션 생성 함수와 리듀서를 훨씬 쉽고 깔끔하게 작성 할 수 있게 해주는 라이브러리입니다. 

이 라이브러리를 프로젝트에 설치해주세요.

```bash
$ yarn add typesafe-actions
```

그 다음에 카운터 리덕스 모듈을 typesafe-actions 를 사용하여 리팩토링 해보겠습니다.

#### counter 리덕스 모듈 리팩토링하기

counter.ts 를 다음과 같이 수정해보세요.

#### src/modules/counter.ts
```javascript
import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions';

// 액션 type 선언
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_BY = 'counter/INCREASE_BY';

// 액션 생성함수를 선언합니다
export const increase = createStandardAction(INCREASE)();
export const decrease = createStandardAction(DECREASE)();
export const increaseBy = createStandardAction(INCREASE_BY)<number>(); // payload 타입을 Generics 로 설정해주세요.

// 액션 객체 타입 준비
const actions = { increase, decrease, increaseBy }; // 모든 액션 생성함수들을 actions 객체에 넣습니다
type CounterAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number;
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
// Generics로 리듀서에서 관리할 상태, 그리고 리듀서에서 처리 할 모든 액션 객체들의 타입을 넣어야합니다
const counter = createReducer<CounterState, CounterAction>(initialState, {
  [INCREASE]: state => ({ count: state.count + 1 }), // 액션을 참조 할 필요 없으면 파라미터로 state 만 받아와도 됩니다
  [DECREASE]: state => ({ count: state.count - 1 }),
  [INCREASE_BY]: (state, action) => ({ count: state.count + action.payload }) // 액션의 타입을 유추 할 수 있습니다.
});

export default counter;
```

코드가 훨씬 깔끔해졌지요? 액션 생성 함수를 매번 직접 만들 필요 없이 [`createStandardAction`](https://www.npmjs.com/package/typesafe-actions#createstandardaction) 을 사용해서 한 줄로 쉽게 작성 할 수 있게 되었습니다.

[`createReducer`](https://www.npmjs.com/package/typesafe-actions#createreducer) 는 리듀서를 `switch` 문이 아닌 객체 형태로 작성 할 수 있게 해줍니다. 취향에 따라 다르긴 하겠지만, 저는 이 방식이 `switch` 문을 사용하는 것 보다 코드가 훨씬 간결하다고 생각합니다.

이제, App 에서 CounterContainer 를 렌더링해서 이전과 똑같이 잘 작동하는지 확인해보세요.

#### src/App.tsx
```javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';

const App: React.FC = () => {
  return <CounterContainer />;
};

export default App;
```

#### counter 리덕스 모듈 또 다른 방식으로 리팩토링하기

`createReducer` 를 사용 할 때 우리는 객체 형태로 작성을 해주었는데요, 이 함수에서는 [메서드 체이닝 방식](https://www.npmjs.com/package/typesafe-actions#using-createreducer-api-with-type-free-syntax)을 통해서 구현하는 기능도 지원해줍니다.

한번 메서드 체이닝 방식으로 구현을 해볼까요?

#### src/modules/counter.ts

```javascript
import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions';

// 액션 type 선언
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_BY = 'counter/INCREASE_BY';

// 액션 생성함수를 선언합니다
export const increase = createStandardAction(INCREASE)();
export const decrease = createStandardAction(DECREASE)();
export const increaseBy = createStandardAction(INCREASE_BY)<number>(); // payload 타입을 Generics 로 설정해주세요.

// 액션 객체 타입 준비
const actions = { increase, decrease, increaseBy }; // 모든 액션 생성함수들을 actions 객체에 넣습니다
type CounterAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number;
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
// Generics로 리듀서에서 관리할 상태, 그리고 리듀서에서 처리 할 모든 액션 객체들의 타입을 넣어야합니다
const counter = createReducer<CounterState, CounterAction>(initialState)
  .handleAction(INCREASE, state => ({ count: state.count + 1 }))
  .handleAction(DECREASE, state => ({ count: state.count - 1 }))
  .handleAction(INCREASE_BY, (state, action) => ({
    count: state.count + action.payload
  }));

export default counter;
```

취향에 따라 이렇게 구현 하는 것을 선호하신다면 객체 형태 말고 메서드 체이닝 형태로 구현하시는것도 좋습니다. 아마 대부분의 경우엔 객체 형태로 구현하는게 코드가 조금 더 깔끔하다고 생각하실것입니다. 그렇긴 하지만.. 메서드 체이닝 형태로 구현하게 됐을 때 얻을 수 있는 정말 큰 장점이 있습니다. 바로 `handleAction` 의 첫번째 인자에 타입에 액션의 `type` 를 넣는것이 아니라 액션 생성함수 자체를 넣어도 작동한다는 것 입니다. 그렇게 하면, 액션의 `type` 을 굳이 선언 할 필요가 없어집니다.

```javascript
import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions';

// 액션 생성함수를 선언합니다
export const increase = createStandardAction('counter/INCREASE')();
export const decrease = createStandardAction('counter/DECREASE')();
export const increaseBy = createStandardAction('counter/INCREASE_BY')<number>(); // payload 타입을 Generics 로 설정해주세요.

// 액션 객체 타입 준비
const actions = { increase, decrease, increaseBy }; // 모든 액션 생성함수들을 actions 객체에 넣습니다
type CounterAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number;
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
// Generics로 리듀서에서 관리할 상태, 그리고 리듀서에서 처리 할 모든 액션 객체들의 타입을 넣어야합니다
const counter = createReducer<CounterState, CounterAction>(initialState)
  .handleAction(increase, state => ({ count: state.count + 1 }))
  .handleAction(decrease, state => ({ count: state.count - 1 }))
  .handleAction(increaseBy, (state, action) => ({
    count: state.count + action.payload
  }));

export default counter;
```

이렇게 액션의 `type` 대신에 생성 함수를 참조하여 리듀서를 구현을 해주면 모든 액션 객체들의 타입인 `CounterAction` 을 준비하는것도 생략 할 수 있습니다. 그리고, `createReducer` 를 사용 할 때 해당 함수의 Generics 자체를 생략해도 상관 없게 됩니다.

```javascript
import { createStandardAction, createReducer } from 'typesafe-actions';

// 액션 생성함수를 선언합니다
export const increase = createStandardAction('counter/INCREASE')();
export const decrease = createStandardAction('counter/DECREASE')();
export const increaseBy = createStandardAction('counter/INCREASE_BY')<number>(); // payload 타입을 Generics 로 설정해주세요.

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number;
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};

// 리듀서를 만듭니다
// 상태의 타입은 initialState 를 참조하여 바로 유추 할 수 있고,
// 액션 객체의 타입은 액션 생성함수를 참조하여 유추 할 수 있기 때문에 Generics를 생략해도 무방합니다.
const counter = createReducer(initialState)
  .handleAction(increase, state => ({ count: state.count + 1 }))
  .handleAction(decrease, state => ({ count: state.count - 1 }))
  .handleAction(increaseBy, (state, action) => ({
    count: state.count + action.payload
  }));

export default counter;
```

코드가 정말 많이 줄었지요? 만약 redux-saga, redux-observable 같은 미들웨어를 사용 할 때에는 액션들의 type 또는 모든 액션 객체들의 타입을 사용해야 하는 일이 발생 할 수 있으므로 위와 같은 구조가 적합하지 않을 수도 있습니다 (만약에 위 구조로 작성을 하게 된다면 해당 미들웨어들을 사용하게 될 때 [getType](https://www.npmjs.com/package/typesafe-actions#gettype) 를 활용하면 되긴 합니다.)

### todos 리덕스 모듈 리팩토링하기

todos 리덕스 모듈도 방금 했던 것 처럼 `typesafe-actions` 를 사용하여 리팩토링해봅시다.

#### src/modules/todos.ts
```javascript
import {
  /* action, */
  createStandardAction,
  createAction,
  ActionType,
  createReducer
} from 'typesafe-actions';

// 액션 타입 선언
const ADD_TODO = 'todos/ADD_TODO';
const TOGGLE_TODO = 'todos/TOGGLE_TODO';
const REMOVE_TODO = 'todos/REMOVE_TODO';

let nextId = 1; // 새로운 항목을 추가 할 때 사용 할 고유 ID 값

// 액션 생성 함수

// 이 액션 생성 함수의 경우엔 파라미터를 기반하여 커스터마이징된 payload를 설정해주므로,
// createAction 이라는 함수를 사용합니다.
// 여기서 action은 액션 객체를 만드는 함수입니다
export const addTodo = createAction(ADD_TODO, action => (text: string) =>
  action({
    id: nextId++,
    text
  })
);
// 위 코드는 다음과 같은 형태로도 구현 할 수 있지만, createAction 말고 action 만 사용하면
// Action Helpers (https://www.npmjs.com/package/typesafe-actions#action-helpers-api) 지원이 안됩니다.
// export const addTodo = (text: string) => action(ADD_TODO, { id: nextId++, text })

// payload가 그대로 들어가는 액션생성함수는 정말 간단합니다.
export const toggleTodo = createStandardAction(TOGGLE_TODO)<number>();
export const removeTodo = createStandardAction(REMOVE_TODO)<number>();

// 모든 액션 객체들에 대한 타입 준비
const actions = {
  addTodo,
  toggleTodo,
  removeTodo
};
type TodosAction = ActionType<typeof actions>;

// 상태에서 사용 할 할 일 항목 데이터 타입 정의
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// 이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
export type TodosState = Todo[];

// 초기 상태 선언
const initialState: TodosState = [];

// 리듀서 작성
const todos = createReducer<TodosState, TodosAction>(initialState, {
  [ADD_TODO]: (state, action) =>
    state.concat({
      ...action.payload, // id, text 를 이 안에 넣기
      done: false
    }),
  // 바구조화 할당을 활용하여 payload 값의 이름을 바꿀 수 있음
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter(todo => todo.id !== id)
});

export default todos;
```

이제 App에서 다시 TodoApp 을 렌더링해주세요. 이전과 동일하게 작동하고있나요?

#### src/App.tsx
```javascript
import React from 'react';
import TodoApp from './containers/TodoApp';

const App: React.FC = () => {
  return <TodoApp />;
};

export default App;
```

### todos 리덕스 모듈 여러파일로 분리하기

현재 todos 리덕스 모듈은 주석을 제외하면 53줄 정도 됩니다. 지금은 코드가 그렇게 긴 것은 아니지만, 현재 이 파일에서 액션 type, 액션 생성 함수, 액션 객체들의 타입, 상태의 타입, 리듀서를 선언하고 있기 때문에 나중에 액션의 수가 더 많아지면 코드가 너무 길어지게 될 텐데요, 그러면 개발 할 때 찾고자 하는 것을 찾기 위하여 스크롤을 많이 해야 돼서 생산성을 저하시킬 수 있습니다.

그렇다고 해서 src 디렉터리안에서 actions 디렉터리, reducers 디렉터리를 따로 분류해서 하는 것은 서로 너무 멀리 떨어져있기 때문에 오히려 더 불편해질수도 있다는 단점이 있습니다. 

다음과 같은 구조를 한번 상상해보세요.

```
actions
  A
  B
  C
  D
  E
components
  ...
containers
  ...
lib
  ...
styles
  ...
reducers
  A
  B
  C
  D
  E
```

위와 같은 형식으로 분리시키는 것 대신에, 제가 추천드리는 분리 방식은 todos 라는 디렉터리를 만들어서 그안에 여러 개의 파일을 작성하는 것 입니다.

```
modules
  todos
    actions.ts
    index.ts
    reducer.ts
    types.td
  counter.ts # 파일이 그렇게 길지 않은 경우 그냥 파일 하나로 작성
```

이런 구조로 작성하면 꽤나 편하답니다. 한번 직접 파일을 분리해볼까요?

modules 디렉터리에 todos 디렉터리를 만들고, 먼저 actions.ts 부터 작성을 해주세요.

#### src/modules/todos/actions.ts
```javascript
import { createAction, createStandardAction } from 'typesafe-actions';

// 리듀서에서 사용 할 수 있도록 타입도 내보내줍니다.
export const ADD_TODO = 'todos/ADD_TODO';
export const TOGGLE_TODO = 'todos/TOGGLE_TODO';
export const REMOVE_TODO = 'todos/REMOVE_TODO';

let nextId = 1; // 새로운 항목을 추가 할 때 사용 할 고유 ID 값

// 액션 생성 함수

// 이 액션 생성 함수의 경우엔 파라미터를 기반하여 커스터마이징된 payload를 설정해주므로,
// createAction 이라는 함수를 사용합니다.
// 여기서 action은 액션 객체를 만드는 함수입니다
export const addTodo = createAction(ADD_TODO, action => (text: string) =>
  action({
    id: nextId++,
    text
  })
);
// 위 코드는 다음과 같은 형태로도 구현 할 수 있지만, createAction 말고 action 만 사용하면
// Action Helpers (https://www.npmjs.com/package/typesafe-actions#action-helpers-api) 지원이 안됩니다.
// export const addTodo = (text: string) => action(ADD_TODO, { id: nextId++, text })

// payload가 그대로 들어가는 액션생성함수는 정말 간단합니다.
export const toggleTodo = createStandardAction(TOGGLE_TODO)<number>();
export const removeTodo = createStandardAction(REMOVE_TODO)<number>();
```

그 다음에는 액션객체들의 타입과 상태의 타입들을 선언 할 types.ts 를 todos 디렉터리에 다음과 같이 작성해보세요.

#### src/modules/todos/types.ts
```javascript
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

// 한번에 모두 import 해와서 actions 에 담았기 때문에
// 이 부분이 액션의 종류가 만하져도 한 줄로 작성 할 수 있어서 매우 간편합니다.
export type TodosAction = ActionType<typeof actions>;

// 상태에서 사용 할 할 일 항목 데이터 타입 정의
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// 이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열
export type TodosState = Todo[];
```

타입들을 모두 정의하셨으면, 리듀서를 reducer.ts 에 작성해줍시다.

#### src/modules/todos/reducer.ts
```javascript
import { TodosState, TodosAction } from './types';
import { createReducer } from 'typesafe-actions';
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO } from './actions';

// 초기 상태 선언
const initialState: TodosState = [];

// 리듀서 작성
const reducer = createReducer<TodosState, TodosAction>(initialState, {
  [ADD_TODO]: (state, action) =>
    state.concat({
      ...action.payload, // id, text 를 이 안에 넣기
      done: false
    }),
  // 바구조화 할당을 활용하여 payload 값의 이름을 바꿀 수 있음
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter(todo => todo.id !== id)
});

export default reducer;
```

기존 todos.ts 파일에서 리듀서 관련 코드를 복사해오고, `import`가 필요한 곳에서는 키워드 뒤에 텍스트 커서를 둔 뒤 Ctrl + Enter 를 하시면 쉽게 불러올 수 있습니다.

여기까지 다 작성하셨으면 todos 디렉터리에 index.ts 를 만들어주세요. 이 파일의 용도는 기존에 todos.ts 를 불러와서 사용하던 코드들이 (컨테이너 및 루트 리듀서) 별도의 import 경로 수정 없이 제대로 동작하게 하기 위함입니다. 

#### src/modules/todos/index.ts
```javascript
export { default } from './reducer'; // reducer 를 불러와서 default로 내보내겠다는 의미
export * from './actions'; // 모든 액션 생성함수들을 불러와서 같은 이름들로 내보내겠다는 의미
export * from './types'; // 모든 타입들을 불러와서 같은 이름들로 내보내겠다는 의미
```

이 파일을 다 작성하셨으면 기존의 modules/todos.ts 를 지워주시고, 개발서버를 종료 후 다시 실행해주세요. 그러면 이제 modules 의 todos 디렉터리가 기존의 todos.ts를 완벽히 대체하게 됩니다.

브라우저 상에서 잘 작동하는지 확인도 해보세요!

[코드](https://github.com/velopert/ts-react-redux-tutorial/tree/refactor/todos2)

앞으로 리덕스 코드를 작성하게 될 때 만약 처리하는 액션의 수가 그렇게 많지 않다면 파일 하나로도 충분 할 수 있겠지만, 처리 할 액션의 수가 많아진다면 이렇게 여러개의 파일로 분리해서 작성하는 것을 권장드립니다.

다음 섹션에서는 리덕스 미들웨어 redux-thunk 와 redux-saga 를 사용 할 때 타입스크립트를 어떻게 활용 할 수 있는지 다뤄보도록 하겠습니다.
