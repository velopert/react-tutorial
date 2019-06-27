## 3. 나의 첫번째 리액트 컴포넌트

첫번째 리액트 컴포넌트를 만들어봅시다.

src 디렉터리에 Hello.js 라는 파일을 다음과 같이 작성해보세요.

#### Hello.js
```javascript
import React from 'react';

function Hello() {
  return <div>안녕하세요</div>
}

export default Hello;
```

리액트 컴포넌트를 만들 땐

```javascript
import React from 'react';
```

를 통하여 리액트를 불러와주어야 합니다.

리액트 컴포넌트는 함수형태로 작성 할 수도 있고 클래스형태로도 작성 할 수 있습니다. 지금 단계에서는 함수로 작성하는 방법에 대해서만 알아보겠습니다.

리액트 컴포넌트에서는 XML 형식의 값을 반환해줄 수 있는데 이를 JSX 라고 부릅니다. 이에 대해선 다음번에 알아보도록 하겠습니다.

코드의 최하단 

```javascript
export default Hello;
```

이 코드는 Hello 라는 컴포넌트를 내보내겠다는 의미입니다. 이렇게 해주면 다른 컴포넌트에서 불러와서 사용 할 수 있습니다.

이 컴포넌트를 한번 App.js 에서 불러와서 사용해보겠습니다. (CodeSandbox 의 경우 index.js 에서 불러오세요. 그리고 App 컴포넌트 코드 아래부분은 건드리지마세요.)

#### App.js
```javascript
import React from 'react';
import Hello from './Hello';

function App() {
  return (
    <div>
      <Hello />
    </div>
  );
}

export default App;
```

상단에 있던 

```javascript
import logo from './logo.svg';
import './App.css';
```

는 SVG 파일을 불러오고, CSS 를 적용하는 코드인데 이는 현재 불필요하므로 제거해주었습니다.

![](https://i.imgur.com/p3fHfm5.png)

컴포넌트는 일종의 UI 조각입니다. 그리고, 쉽게 재사용 할 수도 있습니다.


```javascript
import React from 'react';
import Hello from './Hello';


function App() {
  return (
    <div>
      <Hello />
      <Hello />
      <Hello />
    </div>
  );
}

export default App;
```

![](https://i.imgur.com/TraJKdn.png)

이제, index.js 를 열어보세요.

이런 코드가 보일 것입니다.

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

여기서 ReactDOM.render 의 역할은 브라우저에 있는 실제 DOM 내부에 리액트 컴포넌트를 렌더링하겠다는 것을 의미합니다. `id` 가 `root` 인 DOM 을 선택하고 있는데, 이 DOM 이 어디있는지 볼까요?

public/index.html 을 열어보시면 내부에 

```html
<div id="root"></div>
```

을 찾아보실 수 있습니다.

결국, 리액트 컴포넌트가 렌더링 될 때에는, 렌더링된 결과물이 위 div 내부에 렌더링되는 것 입니다.