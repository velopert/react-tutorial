## 10. useRef 로 특정 DOM 선택하기

JavaScript 를 사용 할 때에는, 우리가 특정 DOM 을 선택해야 하는 상황에 `getElementById`, `querySelector` 같은 DOM Selector 함수를 사용해서 DOM 을 선택합니다.

리액트를 사용하는 프로젝트에서도 가끔씩 DOM 을 직접 선택해야 하는 상황이 발생 할 때도 있습니다. 예를 들어서 특정 엘리먼트의 크기를 가져와야 한다던지, 스크롤바 위치를 가져오거나 설정해야된다던지, 또는 포커스를 설정해줘야된다던지 등 정말 다양한 상황이 있겠죠. 추가적으로 Video.js, JWPlayer 같은 HTML5 Video 관련 라이브러리, 또는 D3, chart.js 같은 그래프 관련 라이브러리 등의 외부 라이브러리를 사용해야 할 때에도 특정 DOM 에다 적용하기 때문에 DOM 을 선택해야 하는 상황이 발생 할 수 있습니다.

그럴 땐, 리액트에서 `ref` 라는 것을 사용합니다.

함수형 컴포넌트에서 `ref` 를 사용 할 때에는 `useRef` 라는 Hook 함수를 사용합니다. 클래스형 컴포넌트에서는 콜백 함수를 사용하거나  `React.createRef` 라는 함수를 사용하는데, 이에 대해서는 나중에 클래스 컴포넌트를 배울 때 다뤄보도록 하겠습니다. (참고로, 클래스 컴포넌트를 나중에 다루는 이유는, 이제 별로 중요하지 않기 때문입니다.)

우리가 만든 InputSample 에서는 초기화 버튼을 누르면 포커스가 초기화 버튼에 그대로 남아있게 됩니다.

한번, 초기화 버튼을 클릭했을 때 이름 input 에 포커스가 잡히도록 `useRef` 를 사용하여 기능을 구현해보겠습니다.


#### InputSample.js
```javascript
import React, { useState, useRef } from 'react';

function InputSample() {
  const [inputs, setInputs] = useState({
    name: '',
    nickname: ''
  });
  const nameInput = useRef();

  const { name, nickname } = inputs; // 비구조화 할당을 통해 값 추출

  const onChange = e => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });
  };

  const onReset = () => {
    setInputs({
      name: '',
      nickname: ''
    });
    nameInput.current.focus();
  };

  return (
    <div>
      <input
        name="name"
        placeholder="이름"
        onChange={onChange}
        value={name}
        ref={nameInput}
      />
      <input
        name="nickname"
        placeholder="닉네임"
        onChange={onChange}
        value={nickname}
      />
      <button onClick={onReset}>초기화</button>
      <div>
        <b>값: </b>
        {name} ({nickname})
      </div>
    </div>
  );
}

export default InputSample;
```

`useRef()` 를 사용하여 Ref 객체를 만들고, 이 객체를 우리가 선택하고 싶은 DOM 에 `ref` 값으로 설정해주어야 합니다. 그러면, Ref 객체의 `.current` 값은 우리가 원하는 DOM 을 가르키게 됩니다.

위 예제에서는 `onReset` 함수에서 input 에 포커스를 하는 `focus()` DOM API 를 호출해주었습니다.

이제 브라우저에서 인풋에 값을 입력한 다음에 초기화를 눌러보세요. 이름 input 에 포커스가 잘 잡히나요?