## 1. 리덕스에서 사용되는 키워드 숙지하기

리덕스를 사용하게 될 때 앞으로 접하게 될 키워드들을 미리 알아봅시다. 이 키워드들 중에서 대부분은 이전에 `useReducer`를 사용해볼때 접해본 개념이기도 합니다.


### 액션 (Action)

상태에 어떠한 변화가 필요하게 될 땐, 우리는 액션이란 것을 발생시킵니다. 이는, 하나의 객체로 표현되는데요, 액션 객체는 다음과 같은 형식으로 이뤄져있습니다.

```javascript
{
  type: "TOGGLE_VALUE"
}
```

액션 객체는 `type` 필드를 필수적으로 가지고 있어야하고 그 외의 값들은 개발자 마음대로 넣어줄 수 있습니다.


```javascript
{
  type: "ADD_TODO",
  data: {
    id: 0,
    text: "리덕스 배우기"
  }
}
```

```javascript
{
  type: "CHANGE_INPUT",
  text: "안녕하세요"
}
```

### 액션 생성함수 (Action Creator)

액션 생성함수는, 액션을 만드는 함수입니다. 단순히 파라미터를 받아와서 액션 객체 형태로 만들어주죠.

```javascript
export function addTodo(data) {
  return {
    type: "ADD_TODO",
    data
  };
}

// 화살표 함수로도 만들 수 있습니다.
export const changeInput = text => ({ 
  type: "CHANGE_INPUT",
  text
});
```

이러한 액션 생성함수를 만들어서 사용하는 이유는 나중에 컴포넌트에서 더욱 쉽게 액션을 발생시키기 위함입니다. 그래서 보통 함수 앞에 `export` 키워드를 붙여서 다른 파일에서 불러와서 사용합니다.

리덕스를 사용 할 때 액션 생성함수를 사용하는것이 필수적이진 않습니다. 액션을 발생 시킬 때마다 직접 액션 객체를 작성할수도 있습니다.

### 리듀서 (Reducer)

리듀서는 변화를 일으키는 함수입니다. 리듀서는 두가지의 파라미터를 받아옵니다.

```javascript
function reducer(state, action) {
  // 상태 업데이트 로직
  return alteredState;
}
```

리듀서는, 현재의 상태와, 전달 받은 액션을 참고하여 새로운 상태를 만들어서 반환합니다. 이 리듀서는 `useReducer` 를 사용할때 작성하는 리듀서와 똑같은 형태를 가지고 있습니다.

만약 카운터를 위한 리듀서를 작성한다면 다음과 같이 작성할 수 있습니다.

```javascript
function counter(state, action) {
  switch (action.type) {
    case 'INCREASE':
      return state + 1;
    case 'DECREASE':
      return state - 1;
    default:
      return state;
  }
}
```

`useReducer` 에선 일반적으로 `default:` 부분에 `throw new Error('Unhandled Action')`과 같이 에러를 발생시키도록 처리하는게 일반적인 반면 리덕스의 리듀서에서는 기존 `state`를 그대로 반환하도록 작성해야합니다.

리덕스를 사용 할 때에는 여러개의 리듀서를 만들고 이를 합쳐서 루트 리듀서 (Root Reducer)를 만들 수 있습니다. (루트 리듀서 안의 작은 리듀서들은 서브 리듀서라고 부릅니다.)

### 스토어 (Store)

리덕스에서는 한 애플리케이션당 하나의 스토어를 만들게 됩니다. 스토어 안에는, 현재의 앱 상태와, 리듀서가 들어가있고, 추가적으로 몇가지 내장 함수들이 있습니다.


### 디스패치 (dispatch)

디스패치는 스토어의 내장함수 중 하나입니다. 디스패치는 액션을 발생 시키는 것 이라고 이해하시면 됩니다. dispatch 라는 함수에는 액션을 파라미터로 전달합니다.. dispatch(action) 이런식으로 말이죠.

그렇게 호출을 하면, 스토어는 리듀서 함수를 실행시켜서 해당 액션을 처리하는 로직이 있다면 액션을 참고하여 새로운 상태를 만들어줍니다.

#### 구독 (subscribe)

구독 또한 스토어의 내장함수 중 하나입니다. subscribe 함수는, 함수 형태의 값을 파라미터로 받아옵니다. subscribe 함수에 특정 함수를 전달해주면, 액션이 디스패치 되었을 때 마다 전달해준 함수가 호출됩니다. 

리액트에서 리덕스를 사용하게 될 때 보통 이 함수를 직접 사용하는 일은 별로 없습니다. 그 대신에 react-redux 라는 라이브러리에서 제공하는 `connect` 함수 또는 `useSelector` Hook 을 사용하여 리덕스 스토어의 상태에 구독합니다.
