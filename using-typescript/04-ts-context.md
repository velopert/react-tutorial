## 4. TypeScript 와 Context API 활용하기

이번에는 TypeScript 와 Context API 를 활용하는 방법을 배워보겠습니다. 이번에 배울 것은 3장의 [섹션2 Context API를 활용한 상태관리](https://react.vlpt.us/mashup-todolist/02-manage-state.html)와 매우 유사합니다. State를 위한 Context 를 만들고, Dispatch를 위한 Context를 만들 것입니다. 그리고, 해당 Context에서 관리하고 있는 값을 쉽게 조회할 수 있도록 커스텀 Hooks 도 작성 할 것입니다.

우리가 기존에 작성했던 ReducerSample 컴포넌트를 기반으로 SampleContext 라는 Context 를 준비해봅시다.

#### src/SampleContext.tsx
```javascript
import React, { useReducer, useContext, createContext, Dispatch } from 'react';

// 필요한 타입들을 미리 선언

type Color = 'red' | 'orange' | 'yellow';

// 상태를 위한 타입
type State = {
  count: number;
  text: string;
  color: Color;
  isGood: boolean;
};

// 모든 액션들을 위한 타입
type Action =
  | { type: 'SET_COUNT'; count: number }
  | { type: 'SET_TEXT'; text: string }
  | { type: 'SET_COLOR'; color: Color }
  | { type: 'TOGGLE_GOOD' };

// 디스패치를 위한 타입 (Dispatch 를 리액트에서 불러올 수 있음), 액션들의 타입을 Dispatch 의 Generics로 설정
type SampleDispatch = Dispatch<Action>;

// Context 만들기
const SampleStateContext = createContext<State | null>(null);
const SampleDispatchContext = createContext<SampleDispatch | null>(null);

// 리듀서
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

// SampleProvider 에서 useReduer를 사용하고
// SampleStateContext.Provider 와 SampleDispatchContext.Provider 로 children 을 감싸서 반환합니다.
export function SampleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    text: 'hello',
    color: 'red',
    isGood: true
  });

  return (
    <SampleStateContext.Provider value={state}>
      <SampleDispatchContext.Provider value={dispatch}>
        {children}
      </SampleDispatchContext.Provider>
    </SampleStateContext.Provider>
  );
}

// state 와 dispatch 를 쉽게 사용하기 위한 커스텀 Hooks
export function useSampleState() {
  const state = useContext(SampleStateContext);
  if (!state) throw new Error('Cannot find SampleProvider'); // 유효하지 않을땐 에러를 발생
  return state;
}

export function useSampleDispatch() {
  const dispatch = useContext(SampleDispatchContext);
  if (!dispatch) throw new Error('Cannot find SampleProvider'); // 유효하지 않을땐 에러를 발생
  return dispatch;
}
```

우리가 만든 커스텀 Hooks인 `useSampleState` 와 `useSampleDispatch` 에서는 null 체킹을 해주는것이 매우 중요합니다. 만약에 Context가 지니고 있는 값이 유효하지 않으면 에러를 발생시는 코드를 작성해주었는데요, 이를 통하 추후 Hooks 를 사용하게 될 때 각 Hooks 함수들이 반환하는 값이 언제나 유효하다는 것을 보장 할 수 있습니다. 만약에 이렇게 null 체킹을 하지 않는다면 예를 들어 `useSampleState` 의 결과값의 타입은 `State | null` 이 됩니다. null 체킹ㅇ르 하면 `State` 가 되는 것이구요.

Context 를 모두 준비하셨으면 App에서 ReducerSample을 SampleProvider 로 감싸세요.

#### App.js
```javascript
import React from 'react';
import ReducerSample from './ReducerSample';
import { SampleProvider } from './SampleContext';

const App: React.FC = () => {
  return (
    <SampleProvider>
      <ReducerSample />
    </SampleProvider>
  );
};

export default App;
```


그러면 이제 ReducerSample 컴포넌트에서 `state` 와 `dispatch` 를 우리가 만들었던 커스텀 Hooks 를 사용하여 쉽게 조회하여 사용 할 수 있답니다.

#### src/ReducerSample.tsx

```javascript
import React from 'react';
import { useSampleState, useSampleDispatch } from './SampleContext';

function ReducerSample() {
  const state = useSampleState();
  const dispatch = useSampleDispatch();

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

코드를 저장하고, ReducerSample 이 이전과 똑같이 잘 작동하는지 브라우저에서 버튼들을 눌러 확인해보세요.

만약 여러분이 TypeScript 를 사용하는 리액트 프로젝트에서 Context API를 사용 할 때에는 이러한 구조로 구현을 하시면 됩니다. 이렇게 구현을 함으로써 Context 안에 들어있는 상태를 조회 할 때, 그리고 새로운 액션을 디스패치해야 할 때 자동완성이 되므로 여러분들의 개발 생산성을 높여줄 수 있습니다.