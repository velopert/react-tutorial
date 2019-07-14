## 02. CSS Module

이번에는 CSS Module 이라는 기술에 대해서 알아봅시다. 리액트 프로젝트에서 컴포넌트를 스타일링 할 때 CSS Module 이라는 기술을 사용하면, CSS 클래스가 중첩되는 것을 완벽히 방지할 수 있습니다.

CRA 로 만든 프로젝트에서 CSS Module 를 사용 할 때에는, CSS 파일의 확장자를 `.module.css` 로 하면 되는데요, 예를 들어서 다음과 같이 `Box.module.css` 라는 파일을 만들게 된다면

#### Box.module.css
```css
.Box {
  background: black;
  color: white;
  padding: 2rem;
}
```

리액트 컴포넌트 파일에서 해당 CSS 파일을 불러올 때 CSS 파일에 선언한 클래스 이름들이 모두 고유해집니다. 고유 CSS 클래스 이름이 만들어지는 과정에서는 파일 경로, 파일 이름, 클래스 이름, 해쉬값 등이 사용 될 수 있습니다.

예를 들어서 Box 컴포넌트를 만든다면 다음과 같이 코드를 작성하는데요


#### Box.js

```javascript
import React from "react";
import styles from "./Box.module.css";

function Box() {
  return <div className={styles.Box}>{styles.Box}</div>;
}

export default Box;
```

`className` 을 설정 할 때에는 `styles.Box` 이렇게 `import`로 불러온 `styles` 객체 안에 있는 값을 참조해야 합니다.

![](https://i.imgur.com/kEE8Swd.png)

[![Edit restless-morning-9rvik](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/restless-morning-9rvik?fontsize=14)

클래스 이름에 대하여 고유한 이름들이 만들어지기 때문에, 실수로 CSS 클래스 이름이 다른 관계 없는 곳에서 사용한 CSS 클래스 이름과 중복되는 일에 대하여 걱정 할 필요가 없습니다.

이 기술은 다음과 같은 상황에 사용하면 유용합니다.

- 레거시 프로젝트에 리액트를 도입할 때 (기존 프로젝트에 있던 CSS 클래스와 이름이 중복되어도 스타일이 꼬이지 않게 해줍니다.)
- CSS 클래스를 중복되지 않게 작성하기 위하여 CSS 클래스 네이밍 규칙을 만들기 귀찮을 때

리액트 컴포넌트를 위한 클래스를 작성 할 때 제가 자주 사용하는 CSS 클래스 네이밍 규칙은 다음과 같습니다.

1. 컴포넌트의 이름은 다른 컴포넌트랑 중복되지 않게 한다.
2. 컴포넌트의 최상단 CSS 클래스는 컴포넌트의 이름과 일치시킨다. (예: `.Button`
3. 컴포넌트 내부에서 보여지는 CSS 클래스는 CSS Selector 를 잘 활용한다. (예: `.MyForm .my-input`)

이런 규칙 외에도 [BEM Convention](http://getbem.com/naming/) 이란 것 도 있는데, 개인적으로 리액트 컴포넌트와 사용하기엔 불편한 점이 있어서 부적합하다고 생각합니다 (주관적인 의견입니다.)

만약 CSS 클래스 네이밍 규칙을 만들고 따르기 싫다면, CSS Module 을 사용하시면 됩니다. 

이번 튜토리얼에서는, 새로운 리액트 프로젝트를 생성해서 CSS Module 기술을 사용하여 커스텀 체크박스 컴포넌트를 만드는 방법을 배워보도록 하겠습니다.

우선 새로운 프로젝트를 생성해주세요.

```bash
$ npx create-react-app styling-with-css-module
```

그리고, CSS Module 별도로 설치해야 할 라이브러리는 없습니다. 이 기능은 webpack 에서 사용하는 [css-loader](https://github.com/webpack-contrib/css-loader) 에서 지원되는데, CRA 로 만든 프로젝트에는 이미 적용이 되어있으니 바로 사용하면 됩니다.

프로젝트를 에디터로 열어주시고, src 디렉터리에 components 디렉터리를 만든 후 , 그 안에 CheckBox.js 를 생성해주세요. 먼저 CheckBox 컴포넌트의 틀 부터 준비해주겠습니다.

#### components/CheckBox.js
```javascript
import React from 'react';

function CheckBox({ children, checked, ...rest }) {
  return (
    <div>
      <label>
        <input type="checkbox" />
        <div>{checked ? '체크됨' : '체크 안됨'}</div>
      </label>
      <span>{children}</span>
    </div>
  );
}

export default CheckBox;
```

지금 당장은, 스타일링도 하지 않고, 체크 아이콘도 사용하지 않고 그냥 이 컴포넌트에 필요한 HTML 태그들만 미리 선언을 해주었습니다.

여기서 `...rest` 를 사용한 이유는, CheckBox 컴포넌트에게 전달하게 될 `name`, `onChange` 같은 값을 그대로 `input` 에게 넣어주기 위함입니다.

다 만드셨으면 App 컴포넌트에서 렌더링해보세요.

#### App.js
```javascript
import React, { useState } from 'react';

import CheckBox from './components/CheckBox';

function App() {
  const [check, setCheck] = useState(false);
  const onChange = e => {
    setCheck(e.target.checked);
  };
  return (
    <div>
      <CheckBox onChange={onChange} checked={check}>
        다음 약관에 모두 동의
      </CheckBox>
      <p>
        <b>check: </b>
        {check ? 'true' : 'false'}
      </p>
    </div>
  );
}

export default App;
```

이제  `yarn start` 명령어를 사용하여 개발 서버를 열으신 뒤, 다음과 같이 `체크 안됨` 문구를 눌렀을 때 체크박스의 값이 잘 바뀌는지 확인해보세요.

![](https://i.imgur.com/NP3wRfp.gif)

지금 input 이 아닌 텍스트 부분을 선택했는데도 값이 바뀌는 이유는 현재 우리가 해당 내용을 `label` 태그로 감싸줬기 때문입니다.

이제, 스타일링을 해봅시다! 스타일링을 하기 전에 `react-icons` 라는 라이브러리를 설치해주세요. 

```bash
$ yarn add react-icons
```
이 라이브러리를 사용하면 Font Awesome, Ionicons, Material Design Icons, 등의 아이콘들을 컴포넌트 형태로 쉽게 사용 할 수 있습니다. 해당 라이브러리의 [문서](https://react-icons.netlify.com/#/) 를 열으셔서 원하는 아이콘들을 불러와서 사용하시면 되는데요, 우리는 [Material Design Icons](https://react-icons.netlify.com/#/icons/md) 의 MdCheckBox, MdCheckBoxOutline 을 사용하겠습니다.

![](https://i.imgur.com/lVvd6tL.png)

CheckBox 컴포넌트를 다음과 같이 수정해보세요.

#### components/CheckBox.js
```javascript
import React from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

function CheckBox({ children, checked, ...rest }) {
  return (
    <div>
      <label>
        <input type="checkbox" checked={checked} {...rest} />
        <div>{checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}</div>
      </label>
      <span>{children}</span>
    </div>
  );
}

export default CheckBox;
```

이렇게 수정을 해주면, 텍스트 대신 아이콘이 나타나게 될 것입니다. 이제 컴포넌트를 스타일링 해봅시다.

CheckBox.module.css 파일을 components 디렉터리에 생성 후 다음 코드를 입력해주세요.

#### components/CheckBox.module.css
```css
.checkbox {
  display: flex;
  align-items: center;
}

.checkbox label {
  cursor: pointer;
}

/* 실제 input 을 숨기기 위한 코드 */
.checkbox input {
  width: 0;
  height: 0;
  position: absolute;
  opacity: 0;
}

.checkbox span {
  font-size: 1.125rem;
  font-weight: bold;
}

.icon {
  display: flex;
  align-items: center;
  /* 아이콘의 크기는 폰트 사이즈로 조정 가능 */
  font-size: 2rem;
  margin-right: 0.25rem;
  color: #adb5bd;
}

.checked {
  color: #339af0;
}
```

CSS Module 을 작성 할 때에는 CSS 클래스 이름이 다른 곳에서 사용되는 CSS 클래스 이름과 중복될 일이 없기 때문에 `.icon`, `.checkbox` 같은 짧고 흔한 이름을 사용해도 상관이 없습니다.

CSS 코드를 다 작성하셨으면 CheckBox.js 에서 사용을 해보겠습니다.

#### components/CheckBox.js
```javascript
import React from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import styles from './CheckBox.module.css';

function CheckBox({ children, checked, ...rest }) {
  return (
    <div className={styles.checkbox}>
      <label>
        <input type="checkbox" checked={checked} {...rest} />
        <div className={styles.icon}>
          {checked ? (
            <MdCheckBox className={styles.checked} />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </div>
      </label>
      <span>{children}</span>
    </div>
  );
}

export default CheckBox;
```

이제, 우리 컴포넌트의 스타일이 잘 반영됐는지 확인해보세요.

![](https://i.imgur.com/HBYIos7.gif)

개발자 도구로 엘리먼트를 선택해보시면 다음과 같이 고유한 클래스 이름이 만들어진 것을 확인 할 수 있습니다.

![](https://i.imgur.com/fiBh9Ay.png)

[![Edit styling-with-css-module](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-css-module-y4qlj?fontsize=14)

CSS Module 을 사용 할 때에는 `styles.icon` 이런 식으로 객체안에 있는 값을 조회해야 하는데요, 만약 클래스 이름에 `-` 가 들어가 있다면 다음과 같이 사용해야합니다: `styles['my-class']`

그리고, 만약에 여러개가 있다면 다음과 같이 작성해합니다: `${styles.one} ${styles.two}`

조건부 스타일링을 해야 한다면 더더욱 번거롭겠지요? `${styles.one} ${condition ? styles.two : ''}`

우리가 이전 섹션에서 Sass 를 배울 때 썼었던 [classnames](https://github.com/JedWatson/classnames) 라이브러리에는 [bind](https://github.com/JedWatson/classnames#alternate-bind-version-for-css-modules) 기능이 있는데요, 이 기능을 사용하면 CSS Module 을 조금 더 편하게 사용 할 수 있습니다.

우선, 설치를 해주세요.

```bash
$ yarn add classnames
```

그 다음, CheckBox.js 를 다음과 같이 수정해보세요.

#### components/CheckBox.js
```javascript
import React from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import styles from './CheckBox.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CheckBox({ children, checked, ...rest }) {
  return (
    <div className={cx('checkbox')}>
      <label>
        <input type="checkbox" checked={checked} {...rest} />
        <div className={cx('icon')}>
          {checked ? (
            <MdCheckBox className={cx('checked')} />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </div>
      </label>
      <span>{children}</span>
    </div>
  );
}

export default CheckBox;
```

classnames 의 `bind` 기능을 사용하면, CSS 클래시 이름을 지정해 줄 때 `cx('클래스이름')` 과 같은 형식으로 편하게 사용 할 수 있습니다. 여러개의 CSS 클래스를 사용해야하거나, 조건부 스타일링을 해야 한다면 더더욱 편하겠지요?

```javascript
cx('one', 'two')
cx('my-component', {
  condition: true
})
cx('my-component', ['another', 'classnames'])
```

[![Edit styling-with-css-module](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-css-module-s3jlk?fontsize=14)

### 기타 내용

참고로, CSS Module 은 Sass 에서도 사용 할 수 있습니다. 그냥 확장자를 `.module.scss` 로 바꿔주면 됩니다. 물론, 그 전에 `node-sass` 를 설치해야합니다.

그리고, CSS Module 을 사용하고 있는 파일에서 클래스 이름을 고유화 하지 않고 전역적 클래스이름을 사용하고 싶다면 다음과 작성하면 됩니다.

```css
:global .my-global-name {

}
```

만약 Sass 를 사용한다면 다음과 같이 할 수도 있겠죠.
```scss
:global {
  .my-global-name {

  }
}
```

반대로, CSS Module 을 사용하지 않는 곳에서 특정 클래스에서만 고유 이름을 만들어서 사용하고 싶다면 다음과 같이 할 수 있습니다.

```css
:local .make-this-local {

}
```

Sass 라면 이렇게 표현 할수 있겠죠?

```scss
:local {
  .make-this-local {

  }
}
```

## 정리

이번 튜토리얼에서는 CSS Module을 사용하는 방법을 배웠습니다. 이 기술은 레거시 프로젝트에 리액트를 도입하게 될 때, 또는 클래스 이름 짓는 규칙을 정하기 힘든 상황이거나 번거로울 때 사용하면 편합니다. 