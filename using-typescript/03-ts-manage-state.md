## 3. 타입스크립트로 리액트 상태 관리하기

이번 섹션에서는 타입스크립트를 사용하는 리액트 컴포넌트에서 `useState` 와 `useReducer` 를 사용하여 컴포넌트의 상태를 관리하는 방법을 알아보도록 하겠습니다.

### 카운터 만들어보기

정말 간단한 예제인 `useState`를 사용하는 카운터부터 만들어봅시다!

#### src/Counter.tsx
```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);
  const onIncrease = () => setCount(count + 1);
  const onDecrease = () => setCount(count - 1);
  return (
    <div>
      <h1>{count}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
}

export default Counter;
```

TypeScript 없이 리액트 컴포넌트를 작성하는 것과 별반 차이가 없습니다. `useState` 를 사용하실때 `useState<number>()` 와 같이 Generics 를 사용하여 해당 상태가 어떤 타입을 가지고 있을지 설정만 해주시면 됩니다.

이 컴포넌트가 잘 작동하는지 App 에서 렌더링해서 확인을 해볼까요?

#### src/App.tsx
```javascript
import React from 'react';
import Counter from './Counter';

const App: React.FC = () => {
  return <Counter />;
};

export default App;
```

![](https://i.imgur.com/sA0zbGs.png)

아주 잘 작동하고 있습니다. 그런데 참고로 `useState`를 사용 할 때 `Generics` 를 사용하지 않아도 알아서 타입을 유추하기 때문에 생략해도 상관없습니다.

#### src/Counter.tsx
```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const onIncrease = () => setCount(count + 1);
  const onDecrease = () => setCount(count - 1);
  return (
    <div>
      <h1>{count}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
}

export default Counter;
```

![](https://i.imgur.com/EARVf95.png)

그래서 사실상 안하셔도 무방합니다..! 그렇다면 `useState` 를 사용 할 때 어떤 상황에 Generics 를 사용하는게 좋을까요?

바로, 상태가 `null`일 수도 있고 아닐수도 있을때 Generics 를 활용하시면 좋습니다.

```javascript
type Information = { name: string; description: string };
const [info, setInformation] = useState<Information | null>(null);
```


### 인풋 상태 관리하기

이번에는 인풋의 상태를 관리하는 방법을 다뤄보도록 하겠습니다. 이벤트를 다뤄야 하기 때문에 타입을 지정하는것이 처음엔 어떻게 해야 할지 헷갈릴수도 있을텐데, 한번 어떻게하는지 알고나면 매우 쉽습니다.

MyForm 이라는 컴포넌트를 다음과 같이 작성해보세요.

#### src/MyForm.tsx
```javascript
import React, { useState } from 'react';

type MyFormProps = {
  onSubmit: (form: { name: string; description: string }) => void;
};

function MyForm({ onSubmit }: MyFormProps) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const { name, description } = form;

  const onChange = (e: any) => {
    // e 값을 무엇으로 설정해야할까요?
    // 일단 모를떄는 any 로 설정합니다.
  };

  const handleSubmit = (e: any) => {
    // 여기도 모르니까 any 로 하겠습니다.
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={name} onChange={onChange} />
      <input name="description" value={description} onChange={onChange} />
      <button type="submit">등록</button>
    </form>
  );
}

export default MyForm;
```

여기서 e 객체의 타입이 무엇일지, 타입스크립트를 처음 쓰는 사람이라면 모르실겁니다. 그렇다고 해서 구글에 "TypeScript react onChange event" 라고 검색하실 필요는 없습니다! e 객체의 타입이 무엇인지 외우실 필요도 없습니다. 그냥 커서를 `onChange` 에 올려보세요.

![](https://i.imgur.com/PzrJW06.png)

커서를 올리면 어떤 타입을 해야하는지 알려줍니다. 그러면 그냥 마우스로 드래그해서 복사하시면 됩니다. (마우스 커서가 박스 밖으로 나가지 않게 조심히 움직이셔야 합니다)

그럼, `onChange` 의 e 객체의 타입을 `React.ChangeEvent<HTMLInputElement>`로 지정해서 구현을 하고, onSubmit도 마찬가지로 커서를 올리면 나타나는 `React.FormEvent<HTMLFormElement>` 를 e 객체의 타입으로 지정해서 구현해보겠습니다.

#### src/MyForm.tsx
```javascript
import React, { useState } from 'react';

type MyFormProps = {
  onSubmit: (form: { name: string; description: string }) => void;
};

function MyForm({ onSubmit }: MyFormProps) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const { name, description } = form;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 여기도 모르니까 any 로 하겠습니다.
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: '',
      description: ''
    }); // 초기화
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={name} onChange={onChange} />
      <input name="description" value={description} onChange={onChange} />
      <button type="submit">등록</button>
    </form>
  );
}

export default MyForm;
```

이제, 잘 작동하는지 App 에서 렌더링해서 확인을 해볼까요?

#### src/App.js
```javascript
import React from 'react';
import MyForm from './MyForm';

const App: React.FC = () => {
  const onSubmit = (form: { name: string; description: string }) => {
    console.log(form);
  };
  return <MyForm onSubmit={onSubmit} />;
};

export default App;
```

![](https://i.imgur.com/1cX7HgO.png)

매우 잘 작동하고 있습니다!


### useReducer 사용해보기

타입스크립트와 `useReducer` 를 쓸때는 어떻게 해야하는지 알아봅시다.

한번 Counter 를 `useReducer`를 사용하는 코드로 전환해볼까요?

#### src/Counter.tsx
```javascript
import React, { useReducer } from 'react';

type Action = { type: 'INCREASE' } | { type: 'DECREASE' }; // 이렇게 액션을 | 으로 연달아서 쭉 나열하세요.

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREASE':
      return state + 1;
    case 'DECREASE':
      return state - 1;
    default:
      throw new Error('Unhandled action');
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0);
  const onIncrease = () => dispatch({ type: 'INCREASE' });
  const onDecrease = () => dispatch({ type: 'DECREASE' });

  return (
    <div>
      <h1>{count}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
}

export default Counter;
```

지금은 액션들이 `type` 값만 있어서 굉장히 간단한데요, 만약 액션 객체에 필요한 다른 값들이 있는 경우엔 다른 값들도 타입안에 명시를 해주면 추후 리듀서를 작성 할 때 자동완성도 되고 `dispatch` 를 할 때 타입검사도 해줍니다.

이를 확인해보기 위하여 다른 예시 컴포넌트 ReducerSample 라는 컴포넌트를 만들어봅시다.

코드를 작성하는 과정에서 자동완성이 되는 것도 볼 수 있을 것이고, 만약에 필요한 값을 빠뜨리면 에러가 발생하는것도 보실 수 있을거예요.

#### src/ReducerSample.tsx
```javascript
import React, { useReducer } from 'react';

type Color = 'red' | 'orange' | 'yellow';

type State = {
  count: number;
  text: string;
  color: Color;
  isGood: boolean;
};

type Action =
  | { type: 'SET_COUNT'; count: number }
  | { type: 'SET_TEXT'; text: string }
  | { type: 'SET_COLOR'; color: Color }
  | { type: 'TOGGLE_GOOD' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COUNT':
      return {
        ...state,
        count: action.count // count가 자동완성되며, number 타입인걸 알 수 있습니다.
      };
    case 'SET_TEXT':
      return {
        ...state,
        text: action.text // text가 자동완성되며, string 타입인걸 알 수 있습니다.
      };
    case 'SET_COLOR':
      return {
        ...state,
        color: action.color // color 가 자동완성되며 color 가 Color 타입인걸 알 수 있습니다.
      };
    case 'TOGGLE_GOOD':
      return {
        ...state,
        isGood: !state.isGood
      };
    default:
      throw new Error('Unhandled action');
  }
}

function ReducerSample() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    text: 'hello',
    color: 'red',
    isGood: true
  });

  const setCount = () => dispatch({ type: 'SET_COUNT', count: 5 }); // count 를 넣지 않으면 에러발생
  const setText = () => dispatch({ type: 'SET_TEXT', text: 'bye' }); // text 를 넣지 않으면 에러 발생
  const setColor = () => dispatch({ type: 'SET_COLOR', color: 'orange' }); // orange 를 넣지 않으면 에러 발생
  const toggleGood = () => dispatch({ type: 'TOGGLE_GOOD' });

  return (
    <div>
      <p>
        <code>count: </code> {state.count}
      </p>
      <p>
        <code>text: </code> {state.text}
      </p>
      <p>
        <code>color: </code> {state.color}
      </p>
      <p>
        <code>isGood: </code> {state.isGood ? 'true' : 'false'}
      </p>
      <div>
        <button onClick={setCount}>SET_COUNT</button>
        <button onClick={setText}>SET_TEXT</button>
        <button onClick={setColor}>SET_COLOR</button>
        <button onClick={toggleGood}>TOGGLE_GOOD</button>
      </div>
    </div>
  );
}

export default ReducerSample;
```

이 컴포넌트를 App 에서 렌더링 한 다음에 각 버튼들을 눌러보세요. 상태가 잘 업데이트 되고 있나요?


#### App.tsx
```javascript
import React from 'react';
import ReducerSample from './ReducerSample';

const App: React.FC = () => {
  return <ReducerSample />;
};

export default App;
```

![](https://i.imgur.com/h0sQne9.png)
![](https://i.imgur.com/8t3aK0Y.png)

[![Edit ts-react-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ts-react-tutorial-y0nkq?fontsize=14)