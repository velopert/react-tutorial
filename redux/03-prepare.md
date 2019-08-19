## 3. 리덕스 사용 할 준비하기

리덕스에서 리액트를 본격적으로 사용해보기 전에, 리액트 컴포넌트 없이, 리덕스에서 제공되는 기능들을 먼저 연습해보겠습니다. 

먼저 새로운 프로젝트를 만들어주세요.

> 앞으로 사용되는 코드는 모두 다음 코드샌드박스에서 확인 할 수 있습니다.
> [![Edit learn-redux](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/learn-redux-lv1ch?fontsize=14)

```
$ npx create-react-app learn-redux
```

그리고 해당 디렉터리에서 redux 라이브러리를 설치해주세요.

```
$ cd learn-redux
$ yarn add redux
```

그 다음에는, exercise.js 라는 파일을 src 에 생성하세요. 이 파일에서 redux 를 불러와서 redux에 내장된 API를 사용해보고, 연습해보도록 하겠습니다.

해당 파일에 우선 console 에 'Hello!' 를 출력하도록 코드를 작성해보세요.

#### exercise.js
```javascript
console.log('Hello!');
```

그 다음에는 index.js 에서 해당 파일을 다음과 같이 불러와보세요.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './exercise'

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

그리고 나서 `yarn start` 명령어를 실행하여 개발서버를 실행한뒤 브라우저에서 개발자 도구를 열어보세요.

콘솔에 다음과 같이 텍스트가 출력됐나요?

![](https://i.imgur.com/AWfUV8w.png)

그 다음에는 exercise.js 를 다음과 같이 작성해보세요. 주석을 하나하나 잘 읽어주세요.

#### exercise.js
```javascript
import { createStore } from 'redux';

// createStore는 스토어를 만들어주는 함수입니다.
// 리액트 프로젝트에서는 단 하나의 스토어를 만듭니다.

/* 리덕스에서 관리 할 상태 정의 */
const initialState = {
  counter: 0,
  text: '',
  list: []
};

/* 액션 타입 정의 */
// 액션 타입은 주로 대문자로 작성합니다.
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';
const CHANGE_TEXT = 'CHANGE_TEXT';
const ADD_TO_LIST = 'ADD_TO_LIST';

/* 액션 생성함수 정의 */
// 액션 생성함수는 주로 camelCase 로 작성합니다.
function increase() {
  return {
    type: INCREASE // 액션 객체에는 type 값이 필수입니다.
  };
}

// 화살표 함수로 작성하는 것이 더욱 코드가 간단하기에,
// 이렇게 쓰는 것을 추천합니다.
const decrease = () => ({
  type: DECREASE
});

const changeText = text => ({
  type: CHANGE_TEXT,
  text // 액션안에는 type 외에 추가적인 필드를 마음대로 넣을 수 있습니다.
});

const addToList = item => ({
  type: ADD_TO_LIST,
  item
});

/* 리듀서 만들기 */
// 위 액션 생성함수들을 통해 만들어진 객체들을 참조하여
// 새로운 상태를 만드는 함수를 만들어봅시다.
// 주의: 리듀서에서는 불변성을 꼭 지켜줘야 합니다!

function reducer(state = initialState, action) {
  // state 의 초깃값을 initialState 로 지정했습니다.
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        counter: state.counter + 1
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1
      };
    case CHANGE_TEXT:
      return {
        ...state,
        text: action.text
      };
    case ADD_TO_LIST:
      return {
        ...state,
        list: state.list.concat(action.item)
      };
    default:
      return state;
  }
}

/* 스토어 만들기 */
const store = createStore(reducer);

console.log(store.getState()); // 현재 store 안에 들어있는 상태를 조회합니다.

// 스토어안에 들어있는 상태가 바뀔 때 마다 호출되는 listener 함수
const listener = () => {
  const state = store.getState();
  console.log(state);
};

const unsubscribe = store.subscribe(listener);
// 구독을 해제하고 싶을 때는 unsubscribe() 를 호출하면 됩니다.

// 액션들을 디스패치 해봅시다.
store.dispatch(increase());
store.dispatch(decrease());
store.dispatch(changeText('안녕하세요'));
store.dispatch(addToList({ id: 1, text: '와우' }));
```

리덕스 스토어 안의 상태는 액션이 디스패치됨에 따라 업데이트됩니다. 위 코드에서는 우리가 `listener`라는 함수를 만들어서 리덕스 상태에 변화가 생겼을 때 마다 콘솔에 상태를 출력하도록 처리하였습니다. 

코드의 최하단에서는 여러가지 액션들을 디스패치 했는데요, 액션이 디스패치 될 때마다 상태가 바뀌고, 이에 따라 `listener` 함수가 호출 될 것입니다. 브라우저를 열어서 개발자 도구를 열어보세요.

![](https://i.imgur.com/1kwc0ML.png)

위와 같이 결과가 잘 나타났나요?

결과가 잘 나타난 것을 확인하셨다면 이제 본격적으로 리액트 프로젝트에 리덕스를 적용해보도록 하겠습니다. index.js 에서 방금 만든 exercise.js 를 불러오는 코드를 지워주세요.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

