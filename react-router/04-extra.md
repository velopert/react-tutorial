## 4. 리액트 라우터 부가기능

이번엔 알아두면 유용한 리액트 라우터의 부가기능들을 알아보겠습니다.

### history 객체

[history](https://reacttraining.com/react-router/web/api/history) 객체는 라우트로 사용된 컴포넌트에게 match, location 과 함께 전달되는 props 중 하나입니다. 이 객체를 통하여, 우리가 컴포넌트 내에 구현하는 메소드에서 라우터에 직접 접근을 할 수 있습니다 - 뒤로가기, 특정 경로로 이동, 이탈 방지 등..

한번, 이 객체를 사용하는 예제 페이지를 작성해보겠습니다.

#### src/HistorySample.js
```javascript
import React, { useEffect } from 'react';

function HistorySample({ history }) {
  const goBack = () => {
    history.goBack();
  };

  const goHome = () => {
    history.push('/');
  };

  useEffect(() => {
    console.log(history);
    const unblock = history.block('정말 떠나실건가요?');
    return () => {
      unblock();
    };
  }, [history]);

  return (
    <div>
      <button onClick={goBack}>뒤로가기</button>
      <button onClick={goHome}>홈으로</button>
    </div>
  );
}

export default HistorySample;
```

다음, App 에서 렌더링하고 버튼들을 눌러보세요.

#### src/App.js
```javascript
import React from 'react';
import { Route, Link } from 'react-router-dom';
import About from './About';
import Home from './Home';
import Profiles from './Profiles';
import HistorySample from './HistorySample';

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
        <li>
          <Link to="/profiles">프로필 목록</Link>
        </li>
        <li>
          <Link to="/history">예제</Link>
        </li>
      </ul>
      <hr />
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/history" component={HistorySample} />
    </div>
  );
};

export default App;
```

![](https://i.imgur.com/dJwXyc8.png)

이렇게 history 객체를 사용하면 조건부로 다른 곳으로 이동도 가능하고, 이탈을 메시지박스를 통하여 막을 수 도 있습니다.

[![Edit router-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zlxjzrjjyp)

### withRouter HoC

withRouter HoC 는 라우트 컴포넌트가 아닌곳에서 match / location / history 를 사용해야 할 때 쓰면 됩니다.

#### src/WithRouterSample.js
```javascript
import React from 'react';
import { withRouter } from 'react-router-dom';
const WithRouterSample = ({ location, match, history }) => {
  return (
    <div>
      <h4>location</h4>
      <textarea value={JSON.stringify(location, null, 2)} readOnly />
      <h4>match</h4>
      <textarea value={JSON.stringify(match, null, 2)} readOnly />
      <button onClick={() => history.push('/')}>홈으로</button>
    </div>
  );
};

export default withRouter(WithRouterSample);
```

이제 이걸 Profiles.js 에서 렌더링해보겠습니다.

#### src/Profiles.js
```javascript
import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './Profile';
import WithRouterSample from './WithRouterSample';

const Profiles = () => {
  return (
    <div>
      <h3>유저 목록:</h3>
      <ul>
        <li>
          <Link to="/profiles/velopert">velopert</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong</Link>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact
        render={() => <div>유저를 선택해주세요.</div>}
      />
      <Route path="/profiles/:username" component={Profile} />
      <WithRouterSample />
    </div>
  );
};

export default Profiles;
```

![](https://i.imgur.com/5OI6H2h.png)

withRouter 를 사용하면, 자신의 부모 컴포넌트 기준의 match 값이 전달됩니다. 보시면, 현재 gildong 이라는 URL Params 가 있는 상황임에도 불구하고 params 쪽이 `{}` 이렇게 비어있죠? WithRouterSample 은 Profiles 에서 렌더링 되었고, 해당 컴포넌트는 `/profile` 규칙에 일치하기 때문에 이러한 결과가 나타났습니다.


[![Edit router-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k5y28vlk8r)

### Switch

Switch 는 여러 Route 들을 감싸서 그 중 규칙이 일치하는 라우트 단 하나만을 렌더링시켜줍니다.  Switch 를 사용하면, 아무것도 일치하지 않았을때 보여줄  Not Found 페이지를 구현 할 수도 있습니다.

한번 App.js 를 다음과 같이 수정해보세요:

```javascript
import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import About from './About';
import Home from './Home';
import Profiles from './Profiles';
import HistorySample from './HistorySample';

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
        <li>
          <Link to="/profiles">프로필 목록</Link>
        </li>
        <li>
          <Link to="/history">예제</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/about" component={About} />
        <Route path="/profiles" component={Profiles} />
        <Route path="/history" component={HistorySample} />
        <Route
          // path 를 따로 정의하지 않으면 모든 상황에 렌더링됨
          render={({ location }) => (
            <div>
              <h2>이 페이지는 존재하지 않습니다:</h2>
              <p>{location.pathname}</p>
            </div>
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
```

![](https://i.imgur.com/DLXWLIz.png)

### NavLink

NavLink 는 Link 랑 비슷한데, 만약 현재 경로와 Link 에서 사용하는 경로가 일치하는 경우 특정 스타일 혹은 클래스를 적용 할 수 있는 컴포넌트입니다.

한번 Profiles 애서 사용하는 컴포넌트에서 Link 대신 NavLink 를 사용해보겠습니다.

#### src/Profiles.js
```javascript
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Profile from './Profile';
import WithRouterSample from './WithRouterSample';

const Profiles = () => {
  return (
    <div>
      <h3>유저 목록:</h3>
      <ul>
        <li>
          <NavLink
            to="/profiles/velopert"
            activeStyle={{ background: 'black', color: 'white' }}
          >
            velopert
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profiles/gildong"
            activeStyle={{ background: 'black', color: 'white' }}
          >
            gildong
          </NavLink>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact
        render={() => <div>유저를 선택해주세요.</div>}
      />
      <Route path="/profiles/:username" component={Profile} />
      <WithRouterSample />
    </div>
  );
};

export default Profiles;
```

만약에 스타일이 아니라 CSS 클래스를 적용하시고 싶으면 `activeStyle` 대신  `activeClassName` 을 사용하시면 됩니다.

![](https://i.imgur.com/5CiLoVB.png)

[![Edit router-tutorial](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/router-tutorial-pmtve?fontsize=14)


### 기타

지금까지 다룬 것들을 알아두시면 앞으로 리액트 라우터를 사용 할 때 구현하고싶은 것들을 충분히 만들 수 있을 것입니다.

이 외에도 다른 기능들이 있는데요.. 

- **[Redirect](https://reacttraining.com/react-router/web/example/auth-workflow)**: 페이지를 리디렉트 하는 컴포넌트
- **[Prompt](https://reacttraining.com/react-router/web/example/preventing-transitions)**: 이전에 사용했던 history.block 의 컴포넌트 버전
- **[Route Config](https://reacttraining.com/react-router/web/example/route-config)**: JSX 형태로 라우트를 선언하는 것이 아닌 Angular 나 Vue 처럼 배열/객체를 사용하여 라우트 정의하기
- **[Memory Router](https://reacttraining.com/react-router/web/api/MemoryRouter)** 실제로 주소는 존재하지는 않는 라우터. 리액트 네이티브나, 임베디드 웹앱에서 사용하면 유용하다.

그 외의 것들은 [공식 매뉴얼](https://reacttraining.com/react-router/web/guides/philosophy) 을 참고하시길 바랍니다.
