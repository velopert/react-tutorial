## 5. useReactRouter Hook 사용하기

지난 섹션에서 `withRouter` 라는 함수를 사용해서 라우트로 사용되고 있지 않은 컴포넌트에서도 라우트 관련 props 인 `match`, `history`, `location` 을 조회하는 방법을 확인해보았습니다.

`withRouter` 를 사용하는 대신에 Hook 을 사용해서 구현을 할 수도 있는데요, 아직은 리액트 라우터에서 공식적인 Hook 지원은 되고 있지 않습니다 (될 [예정](https://github.com/ReactTraining/react-router/issues/6497)이긴 합니다).

그 전까지는, 다른 라이브러리를 설치해서 Hook 을 사용하여 구현을 할 수 있습니다. 이번 튜토리얼에서는 라이브러리를 설치해서 라우터에 관련된 값들을 Hook 으로 사용하는 방법을 알아보도록 하겠습니다.

우리가 사용 할 라이브러리의 이름은 [use-react-router](https://github.com/CharlesStover/use-react-router) 입니다. yarn 을 사용하여 설치해주세요.

```bash
$ yarn add use-react-router
```

그 다음에, RouterHookSample.js 라는 파일을 생성 후 다음 코드를 작성해보세요.

#### RouterHookSample.js
```javascript
import useReactRouter from 'use-react-router';

function RouterHookSample() {
  const { history, location, match } = useReactRouter;
  console.log({ history, location, match });
  return null;
}

export default RouterHookSample;
```

이제 이 컴포넌트를 Profiles 컴포넌트에서 WithRouterSample 하단에 렌더링해보세요.

#### Profiles.js
```javascript
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Profile from './Profile';
import WithRouterSample from './WithRouterSample';
import RouterHookSample from './RouterHookSample';

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
      <RouterHookSample />
    </div>
  );
};

export default Profiles;
```

![](https://i.imgur.com/eEy0Qlk.png)

콘솔을 확인해보세요. 위와 같이 프로필 목록 페이지를 열었을 때 `location`, `match`, `history` 객체들을 조회 할 수 있게 되었나요?

이 Hook 이 정식 릴리즈는 아니기 때문에 만약에 여러분들이 `withRouter` 가 너무 불편하다고 느낄 경우에만 사용하시는 것을 권장드립니다. 

사용 한다고 해서 나쁠 것은 없지만, 나중에 정식 릴리즈가 나오게 되면 해당 라이브러리를 제거하고 코드를 수정해야 하는 일이 발생 할 것입니다. 적어도, `withRouter` 를 사용하셨다면, 레거시 코드로 유지해도 큰 문제는 없죠. 물론 추후 `useReactRouter` 를 사용하는 코드도 방치해도 될 지도 모르지만, 불필요한 라이브러리의 코드가 프로젝트에 포함된다는점, 그리고 정식 릴리즈가 되는 순간부터 `useReactRouter` 의 유지보수가 더 이상 이루어지지 않을 것 이라는 점을 생각하면, 중요한 프로젝트라면 사용을 하지 않는 편이 좋을 수도 있습니다.