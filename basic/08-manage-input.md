## 8. input 상태 관리하기

이번에는 리액트에서 사용자가 입력 할 수 있는 input 태그의 상태를 관리하는 방법을 알아보겠습니다.

우선, src 디렉터리에 InputSample.js 라는 파일을 생성하세요.

#### InputSample.js
```javascript
import React from 'react';

function InputSample() {
  return (
    <div>
      <input />
      <button>초기화</button>
      <div>
        <b>값: </b>
      </div>
    </div>
  );
}

export default InputSample;
```

그 다음에는, 이 컴포넌트를 App 에서 렌더링하세요.

#### App.js
```javascript
import React from 'react';
import InputSample from './InputSample';

function App() {
  return (
    <InputSample />
  );
}

export default App;
```

![](https://i.imgur.com/tsDzOFM.png)

input 에 입력하는 값이 하단에 나타나게 하고, 초기화 버튼을 누르면 input 이 값이 비워지도록 구현을 해보겠습니다.

이번에도, `useState` 를 사용합니다. 이번에는 input 의 `onChange` 라는 이벤트를 사용하는데요, 이벤트에 등록하는 함수에서는 이벤트 객체 `e` 를 파라미터로 받아와서 사용 할 수 있는데 이 객체의 `e.target` 은 이벤트가 발생한 DOM 인 input DOM 을 가르키게됩니다. 이 DOM 의 `value` 값, 즉 `e.target.value` 를 조회하면 현재 input 에 입력한 값이 무엇인지 알 수 있습니다.

이 값을 `useState` 를 통해서 관리를 해주면 됩니다.

한번 코드를 다음과 같이 수정해보세요.

#### InputSample.js

```javascript
import React, { useState } from 'react';

function InputSample() {
  const [text, setText] = useState('');

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onReset = () => {
    setText('');
  };

  return (
    <div>
      <input onChange={onChange} value={text}  />
      <button onClick={onReset}>초기화</button>
      <div>
        <b>값: {text}</b>
      </div>
    </div>
  );
}

export default InputSample;
```

input 의 상태를 관리할 때에는 input 태그의 `value` 값도 설정해주는 것이 중요합니다. 그렇게 해야, 상태가 바뀌었을때 input 의 내용도 업데이트 됩니다.

