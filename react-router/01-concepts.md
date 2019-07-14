## 1. 프로젝트 준비 및 기본적인 사용법

우선 리액트 라우터를 사용할 프로젝트를 준비해주겠습니다.

```bash
$ npx create-react-app router-tutorial
```

그 다음엔 해당 프로젝트 디렉토리로 이동하여 라우터 관련 라이브러리를 설치하겠습니다.

```bash
$ cd router-tutorial
$ yarn add react-router-dom
```

### 프로젝트에 라우터 적용

라우터 적용은 index.js 에서  `BrowserRouter` 라는 컴포넌트를 사용하여 구현하시면 됩니다.

#### src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // * BrowserRouter 불러오기
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// * App 을 BrowserRouter 로 감싸기
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

## 페이지 만들기

이제 라우트로 사용 할 페이지 컴포넌트를 만들 차례입니다. 웹사이트에 가장 처음 들어왔을 때 보여줄 Home 컴포넌트와, 웹사이트의 소개를 보여주는 About 페이지를 만들어보겠습니다.


#### src/Home.js
```javascript
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>홈</h1>
      <p>이곳은 홈이에요. 가장 먼저 보여지는 페이지죠.</p>
    </div>
  );
};

export default Home;
```

#### src/About.js
```javascript
import React from 'react';

const About = () => {
  return (
    <div>
      <h1>소개</h1>
      <p>이 프로젝트는 리액트 라우터 기초를 실습해보는 예제 프로젝트랍니다.</p>
    </div>
  );
};

export default About;
```

이제 페이지로 사용 할 모든 컴포넌트가 완료되었습니다.

### Route: 특정 주소에 컴포넌트 연결하기

사용자가 요청하는 주소에 따라 다른 컴포넌트를 보여줘보겠습니다. 이 작업을 할 때에는 `Route` 라는 컴포넌트를 사용합니다.

사용 방식은 다음과 같습니다:
```javascript
<Route path="주소규칙" component={보여주고싶은 컴포넌트}>
```

한번 App.js 에서 기존 코드들을 날리고, Route 들을 렌더링해주겠습니다.

#### src/App.js
```javascript
import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```

여기까지 하고 한번 `yarn start` 를 하여 개발서버를 시작해보세요.

이렇게 `/` 경로로 들어가면 홈 컴포넌트가 뜨고,

![](https://i.imgur.com/ofLWuuX.png)

`/about` 경로로 들어가면, 예상과 다르게 두 컴포넌트가 모두 보여집니다!

![](https://i.imgur.com/Wu2kMh4.png)

이는 `/about` 경로가 `/` 규칙과도 일치하기 때문에 발생한 현상인데요, 이를 고치기 위해선 Home 을 위한 라우트에 exact 라는 props 를 true 로 설정하시면 됩니다.

#### src/App.js
```javascript
import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```

이렇게 하면 경로가 완벽히 똑같을때만 컴포넌트를 보여주게 되어 이슈가 해결됩니다.

![](https://i.imgur.com/l1wim3k.png)

[![Edit router-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2o7n6lywqy)

### Link: 누르면 다른 주소로 이동시키기

Link 컴포넌트는 클릭하면 다른 주소로 이동시키는 컴포넌트입니다. 리액트 라우터를 사용할땐 일반 `<a href="...">...</a>` 태그를 사용하시면 안됩니다. 만약에 하신다면 onClick 에 `e.preventDefault()` 를 호출하고 따로 자바스크립트로 주소를 변환시켜주어야 합니다.

그 대신에 Link 라는 컴포넌트를 사용해야하는데요, 그 이유는 a 태그의 기본적인 속성은 페이지를 이동시키면서, 페이지를 아예 새로 불러오게됩니다. 그렇게 되면서 우리 리액트 앱이 지니고있는 상태들도 초기화되고, 렌더링된 컴포넌트도 모두 사라지고 새로 렌더링을 하게됩니다. 그렇기 때문에 a 태그 대신에 Link 컴포넌트를 사용하는데요, 이 컴포넌트는 [HTML5 History API](https://developer.mozilla.org/ko/docs/Web/API/History) 를 사용하여 브라우저의 주소만 바꿀뿐 페이지를 새로 불러오지는 않습니다. 

그럼 어디 한번 사용해볼까요?

#### src/App.js
```javascript
import React from 'react';
import { Route, Link } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
      </ul>
      <hr />
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```
![](https://i.imgur.com/a4OJekp.png)

[![Edit router-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1q6pxkz3rq)