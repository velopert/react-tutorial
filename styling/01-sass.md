# 01. Sass

Sass (Syntactically Awesome Style Sheets: 문법적으로 짱 멋진 스타일시트) 는 CSS pre-processor 로서, 복잡한 작업을 쉽게 할 수 있게 해주고, 코드의 재활용성을 높여줄 뿐 만 아니라, 코드의 가독성을 높여주어 유지보수를 쉽게해줍니다.

이 튜토리얼에서는 Sass 의 기초적인 내용만 다루게 됩니다. 만약에 Sass 에 대해서 더 제대로 알아보시고 싶다면, [제가 쓴 포스트](https://velopert.com/1712)와 [Sass 가이드](https://sass-guidelin.es/ko/) 를 참고해보시는것을 권장드립니다.


Sass 에서는 두가지의 확장자 (.scss/.sass) 를 지원합니다. Sass 가 처음 나왔을떈 sass 만 지원되었고, sass 는 문법이 아주 다른데요:

#### sass

```sass
$font-stack:    Helvetica, sans-serif
$primary-color: #333

body
  font: 100% $font-stack
  color: $primary-color
```


#### scss
```scss
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

더 많은 차이점들은 [여기](https://sass-lang.com/guide) 서 비교해볼 수 있습니다. 보통 scss 문법이 더 많이 사용되므로, 우리는 .scss 확장자로 스타일을 작성하겠습니다. 


### 시작하기

본격적으로 Sass 를 사용해봅시다. 먼저 새로운 리액트 프로젝트를 만드세요.

```bash
$ npx create-react-app styling-with-sass
```

그 다음에는, 해당 프로젝트 디렉터리에 [`node-sass`](https://github.com/sass/node-sass) 라는 라이브러리를 설치하세요.

```bash
$ cd styling-with-sass
$ yarn add node-sass
```

이 라이브러리는 Sass 를 CSS 로 변환해주는 역할을 합니다.

### Button 컴포넌트 만들기

Button 이라는 컴포넌트를 만들고, Sass 를 사용해서 스타일링을 해봅시다.

src 디렉터리에 components 디렉터리를 생성 후 그 안에 Button 이라고 만들어보세요.


#### components/Button.js
```javascript
import React from 'react';
import './Button.scss';

function Button({ children }) {
  return <button className="Button">{children}</button>;
}

export default Button;
```

그리고, components 디렉터리에 Button.scss 파일도 만들어보세요.

#### components/Button.scss
```scss
$blue: #228be6; // 주석 선언

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1rem;

  background: $blue; // 주석 사용
  &:hover {
    background: lighten($blue, 10%); // 색상 10% 밝게
  }

  &:active {
    background: darken($blue, 10%); // 색상 10% 어둡게
  }
}
```

기존 css 에서는 사용하지 못하던 문법들을 사용했습니다.`$blue: #228be6;` 이런 식으로 스타일 파일에서 사용 할 수 있는 변수를 선언 할 수도 있고 
[`lighten()`](https://sass-lang.com/documentation/functions#lighten-instance_method) 또는 [`darken()`](https://sass-lang.com/documentation/functions/color#darken) 과 같이 색상을 더 밝게하거나 어둡게 해주는 함수도 사용 할 수 있습니다.

이 버튼을 App 컴포넌트에서 사용해봅시다.

#### App.js
```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button>BUTTON</Button>
      </div>
    </div>
  );
}

export default App;
```

기존의 App.css 를 App.scss 로 파일 이름을 수정한 뒤, 내용을 다음과 같이 적어보세요.

#### App.css
```scss
.App {
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
}
```

![](https://i.imgur.com/mEaMjwp.png)

버튼이 잘 나타났나요?

[![Edit styling-with-sass](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-sass-6exuz?fontsize=14)

우리는 앞으로 다음과 같이 다양한 옵션들을 가진 버튼들을 만들어볼 것입니다.

![](https://i.imgur.com/FpOKZg9.png)


### 버튼 사이즈 조정하기

우선 버튼 크기에 `large`, `medium`, `small` 를 설정해줄 수 있도록 구현을 해봅시다.

Button.js 에서 다음과 같이 `defaultProps` 를 통하여 `size` 의 기본값을 `medium` 으로 설정하고, 이 값은 `button` 의 `className` 에 넣어보세요.

#### Button.js
```javascript
import React from 'react';
import './Button.scss';

function Button({ children, size }) {
  return <button className={['Button', size].join(' ')}>{children}</button>;
}

Button.defaultProps = {
  size: 'medium'
};

export default Button;
```

className 에 CSS 클래스 이름을 동적으로 넣어주고 싶으면 이렇게 설정을 해주어야 합니다.

```javascript
className={['Button', size].join(' ')}
```

또는 이렇게 처리 할 수도 있습니다.
```javascript
className={`Button ${size}`}
```

하지만, 조건부로 CSS 클래스를 넣어주고 싶을때 이렇게 문자열을 직접 조합해주는 것 보다 [classnames](https://github.com/JedWatson/classnames) 라는 라이브러리를 사용하는 것이 훨씬 편합니다.

classNames 를 사용하면 다음과 같이 조건부 스타일링을 할 때 함수의 인자에 문자열, 배열, 객체 등을 전달하여 손쉽게 문자열을 조합 할 수 있습니다.

```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
classNames(['foo', 'bar']); // => 'foo bar'

// 동시에 여러개의 타입으로 받아올 수 도 있습니다.
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// false, null, 0, undefined 는 무시됩니다.
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

우리 프로젝트에 설치를 해봅시다.

```bash
$ yarn add classnames
```

그리고 Button.js 에서 사용해보세요.

#### Button.js
```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size }) {
  return <button className={classNames('Button', size)}>{children}</button>;
}

Button.defaultProps = {
  size: 'medium'
};

export default Button;
```

이제 props 로 받은 props 값이 button 태그의 `className` 으로 전달이 될 것 입니다. 이제 이에 따라 Button.scss 에서 다른 크기를 지정해줘봅시다.


#### Button.scss
```scss
$blue: #228be6;

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  background: $blue;
  &:hover {
    background: lighten($blue, 10%);
  }

  &:active {
    background: darken($blue, 10%);
  }
}
```

위 코드에서 

```scss
.Button {
  &.large {

  }
}
```

가 의미 하는 것은 

```css
.Button.large {

}
```

입니다. 결국, `Button` 과 `large` CSS 클래스가 함께 적용되어 있으면 우리가 원하는 스타일을 적용하겠다는 것을 의미하죠.

코드를 다 작성하셨으면 App.js 에서 버튼들을 2개 더 렌더링 하고, `size` 값도 설정해주세요.

#### App.js
```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button size="large">BUTTON</Button>
        <Button>BUTTON</Button>
        <Button size="small">BUTTON</Button>
      </div>
    </div>
  );
}

export default App;
```

그러면, 이런 결과가 나타나게 됩니다.

![](https://i.imgur.com/8vGWqeR.png)

버튼들끼리 함께 있을 때에는 여백이 있도록 Button.scss 를 다음과 같이 수정해보세요.

#### Button.scss
```scss
$blue: #228be6;

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  background: $blue;
  &:hover {
    background: lighten($blue, 10%);
  }

  &:active {
    background: darken($blue, 10%);
  }

  & + & {
    margin-left: 1rem;
  }
}
```

맨 아래에 `& + &` 가 의미 하는 것은 `.Button + .Button` 입니다. 만약 함께 있다면 우측에 있는 버튼에 여백을 설정 한 것이죠.

이제, 이런 결과가 나타났나요?

![](https://i.imgur.com/V8uUPSr.png)


### 버튼 색상 설정하기

이번에는 버튼에 파란색 외의 다른 색상을 설정하는 작업에 대해서 알아보겠습니다. 우리는, 버튼의 색상에 `blue`, `gray`, `pink` 색을 설정 할 수 있도록 구현을 할 것입니다.

> 개발을 할 때 색상에 대하여 고민이 들 때에는 [open-color](https://yeun.github.io/open-color/) 를 참조해보세요.

우선, Button 에서 `color` 라는 `props` 를 받아올 수 있도록 해주고, 기본 값을 `blue` 로 설정해주세요. 그리고, `size` 와 마찬가지로 `color` 값을 `className` 에 포함시켜주세요.


#### components/Button.js
```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color }) {
  return (
    <button className={classNames('Button', size, color)}>{children}</button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

이제 Button.scss 파일도 수정해봅시다.

### components/Button.scss

```scss
$blue: #228be6;
$gray: #495057;
$pink: #f06595;

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  // 색상 관리
  &.blue {
    background: $blue;
    &:hover {
      background: lighten($blue, 10%);
    }

    &:active {
      background: darken($blue, 10%);
    }
  }

  &.gray {
    background: $gray;
    &:hover {
      background: lighten($gray, 10%);
    }

    &:active {
      background: darken($gray, 10%);
    }
  }

  &.pink {
    background: $pink;
    &:hover {
      background: lighten($pink, 10%);
    }

    &:active {
      background: darken($pink, 10%);
    }
  }

  & + & {
    margin-left: 1rem;
  }
}
```

코드의 상단에서 색상 변수를 선언해주었고, 하단에서 CSS 클래스에 따라 다른 색상이 적용되도록 코드를 작성해주었습니다. 위 코드를 보면, 반복되는 코드들이 있지요?


```scss
  &.blue {
    background: $blue;
    &:hover {
      background: lighten($blue, 10%);
    }

    &:active {
      background: darken($blue, 10%);
    }
  }

  &.gray {
    background: $gray;
    &:hover {
      background: lighten($gray, 10%);
    }

    &:active {
      background: darken($gray, 10%);
    }
  }

  &.pink {
    background: $pink;
    &:hover {
      background: lighten($pink, 10%);
    }

    &:active {
      background: darken($pink, 10%);
    }
  }
```

이렇게 반복이 되는 코드는 Sass 의 [mixin](https://sass-guidelin.es/ko/#mixins) 이라는 기능을 사용하여 쉽게 재사용 할 수 있습니다. 한번, `button-color`라는 mixin 을 만들어서 사용해보겠습니다.

#### components/Button.scss

```scss
$blue: #228be6;
$gray: #495057;
$pink: #f06595;

@mixin button-color($color) {
  background: $color;
  &:hover {
    background: lighten($color, 10%);
  }
  &:active {
    background: darken($color, 10%);
  }
}

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  // 색상 관리
  &.blue {
    @include button-color($blue);
  }

  &.gray {
    @include button-color($gray);
  }

  &.pink {
    @include button-color($pink);
  }

  & + & {
    margin-left: 1rem;
  }
}
```

어떤가요? 색상 관리쪽 코드가 훨씬 깔끔해졌지요?

이제, 이 색상 관리가 잘 이루어지고 있는지 확인해봅시다. App 컴포넌트에서 다음과 같이 다른 색상을 가진 버튼들도 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button size="large">BUTTON</Button>
        <Button>BUTTON</Button>
        <Button size="small">BUTTON</Button>
      </div>
      <div className="buttons">
        <Button size="large" color="gray">
          BUTTON
        </Button>
        <Button color="gray">BUTTON</Button>
        <Button size="small" color="gray">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="pink">
          BUTTON
        </Button>
        <Button color="pink">BUTTON</Button>
        <Button size="small" color="pink">
          BUTTON
        </Button>
      </div>
    </div>
  );
}

export default App;
```

그러면 이런 결과가 보여질 것입니다.

![](https://i.imgur.com/4SRWyRA.png)

맨 왼쪽에 있는 버튼들이 서로 너무 붙어있죠? App.scss 를 다음과 같이 수정해보세요.

#### App.scss
```scss
.App {
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
  .buttons + .buttons {
    margin-top: 1rem;
  }
}
```

그럼 이제 다음과 같이 나타나게 될 것입니다.

![](https://i.imgur.com/cTVR2WZ.png)

[![Edit styling-with-sass](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-sass-qv3ni?fontsize=14)



### outline 옵션 만들기

이번에는 `outline` 이라는 옵션을 주면 버튼에서 테두리만 보여지도록 설정을 해보겠습니다.

Button.js 를 다음과 같이 수정해보세요.

#### components/Button.js
```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color, outline }) {
  return (
    <button className={classNames('Button', size, color, { outline })}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

여기서는 `outline` 값을 props 로 받아와서 객체 안에 집어 넣은 다음에 `classNames()` 에 포함시켜줬는데요, 이렇게 하면 `outline` 값이 `true` 일 때에만 `button` 에 `outline` CSS 클래스가 적용됩니다.

만약 `outline` CSS 클래스가 있다면, 테두리만 보여지도록 스타일쪽 코드도 수정해보세요.

#### components/Button.scss
```scss
$blue: #228be6;
$gray: #495057;
$pink: #f06595;

@mixin button-color($color) {
  background: $color;
  &:hover {
    background: lighten($color, 10%);
  }
  &:active {
    background: darken($color, 10%);
  }
  &.outline {
    color: $color;
    background: none;
    border: 1px solid $color;
    &:hover {
      background: $color;
      color: white;
    }
  }
}

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  // 색상 관리
  &.blue {
    @include button-color($blue);
  }

  &.gray {
    @include button-color($gray);
  }

  &.pink {
    @include button-color($pink);
  }

  & + & {
    margin-left: 1rem;
  }
}
```

`button-color` mixin 을 만들었었기 때문에 작업이 굉장히 간단하지요?

그럼 이제 App 에서 사용을 해봅시다.

#### App.js
```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button size="large">BUTTON</Button>
        <Button>BUTTON</Button>
        <Button size="small">BUTTON</Button>
      </div>
      <div className="buttons">
        <Button size="large" color="gray">
          BUTTON
        </Button>
        <Button color="gray">BUTTON</Button>
        <Button size="small" color="gray">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="pink">
          BUTTON
        </Button>
        <Button color="pink">BUTTON</Button>
        <Button size="small" color="pink">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="blue" outline>
          BUTTON
        </Button>
        <Button color="gray" outline>
          BUTTON
        </Button>
        <Button size="small" color="pink" outline>
          BUTTON
        </Button>
      </div>
    </div>
  );
}

export default App;
```

![](https://i.imgur.com/Z5JSqEf.png)

[![Edit styling-with-sass](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-sass-364fr?fontsize=14)


### 전체 너비 차지하는 옵션

이번에는 `fullWidth` 라는 옵션이 있으면 버튼이 전체 너비를 차지하도록 구현을 해보겠습니다. 구현 방식은 방금 했었던 `outline`과 굉장히 유사 합니다.

Button.js 를 다음과 같이 수정해주세요.

#### components/Button.js

```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color, outline, fullWidth }) {
  return (
    <button
      className={classNames('Button', size, color, { outline, fullWidth })}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

그 다음, 스타일도 수정해봅시다.

#### components/Button.scss

```scss
$blue: #228be6;
$gray: #495057;
$pink: #f06595;

@mixin button-color($color) {
  background: $color;
  &:hover {
    background: lighten($color, 10%);
  }
  &:active {
    background: darken($color, 10%);
  }
  &.outline {
    color: $color;
    background: none;
    border: 1px solid $color;
    &:hover {
      background: $color;
      color: white;
    }
  }
}

.Button {
  display: inline-flex;
  color: white;
  font-weight: bold;
  outline: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 사이즈 관리
  &.large {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.25rem;
  }

  &.medium {
    height: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }

  &.small {
    height: 1.75rem;
    font-size: 0.875rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  // 색상 관리
  &.blue {
    @include button-color($blue);
  }

  &.gray {
    @include button-color($gray);
  }

  &.pink {
    @include button-color($pink);
  }

  & + & {
    margin-left: 1rem;
  }

  &.fullWidth {
    width: 100%;
    justify-content: center;
    & + & {
      margin-left: 0;
      margin-top: 1rem;
    }
  }
}
```

App 에서 사용을 해봅시다!

#### App.js
```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button size="large">BUTTON</Button>
        <Button>BUTTON</Button>
        <Button size="small">BUTTON</Button>
      </div>
      <div className="buttons">
        <Button size="large" color="gray">
          BUTTON
        </Button>
        <Button color="gray">BUTTON</Button>
        <Button size="small" color="gray">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="pink">
          BUTTON
        </Button>
        <Button color="pink">BUTTON</Button>
        <Button size="small" color="pink">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="blue" outline>
          BUTTON
        </Button>
        <Button color="gray" outline>
          BUTTON
        </Button>
        <Button size="small" color="pink" outline>
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" fullWidth>
          BUTTON
        </Button>
        <Button size="large" fullWidth color="gray">
          BUTTON
        </Button>
        <Button size="large" fullWidth color="pink">
          BUTTON
        </Button>
      </div>
    </div>
  );
}

export default App;
```

결과가 잘 나타났나요?

![](https://i.imgur.com/b842QKz.png)

[![Edit styling-with-sass](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-sass-n8f3q?fontsize=14)


## ...rest props 전달하기

이제 우리가 버튼 컴포넌트는 다 만들었는데요, 만약에 이 컴포넌트에 onClick 을 설정해주고 싶다면 어떻게 해야 할까요?

#### components/Button.js
```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color, outline, fullWidth, onClick }) {
  return (
    <button
      className={classNames('Button', size, color, { outline, fullWidth })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

만약 onMouseMove 이벤트를 관리하고 싶다면..?

```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color, outline, fullWidth, onClick, onMouseMove }) {
  return (
    <button
      className={classNames('Button', size, color, { outline, fullWidth })}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

필요한 이벤트가 있을 때 마다 매번 이렇게 넣어주는건 귀찮습니다. 이러한 문제를 해결 해줄 수 있는 문법이 있는데요! 바로 [spread 와 rest](https://learnjs.vlpt.us/useful/07-spread-and-rest.html) 입니다. 이 문법은 주로 배열과 객체, 함수의 파라미터, 인자를 다룰 때 사용하는데, 컴포넌트에서도 사용 할 수 있답니다.

Button 컴포넌트를 다음과 같이 수정해보세요.

#### components/Button.js

```javascript
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

function Button({ children, size, color, outline, fullWidth, ...rest }) {
  return (
    <button
      className={classNames('Button', size, color, { outline, fullWidth })}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: 'medium',
  color: 'blue'
};

export default Button;
```

이렇게 `...rest`를 사용해서 우리가 지정한 props 를 제외한 값들을 `rest` 라는 객체에 모아주고, `<button>` 태그에 `{...rest}` 를 해주면, `rest` 안에 있는 객체안에 있는 값들을 모두 `<button>` 태그에 설정을 해준답니다.

그래서, 만약에 App.js 에서 사용한 가장 첫번째 버튼에 `onClick` 을 설정해준다면,


#### App.js

```javascript
import React from 'react';
import './App.scss';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <div className="buttons">
        <Button size="large" onClick={() => console.log('클릭됐다!')}>
          BUTTON
        </Button>
        <Button>BUTTON</Button>
        <Button size="small">BUTTON</Button>
      </div>
      <div className="buttons">
        <Button size="large" color="gray">
          BUTTON
        </Button>
        <Button color="gray">BUTTON</Button>
        <Button size="small" color="gray">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="pink">
          BUTTON
        </Button>
        <Button color="pink">BUTTON</Button>
        <Button size="small" color="pink">
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" color="blue" outline>
          BUTTON
        </Button>
        <Button color="gray" outline>
          BUTTON
        </Button>
        <Button size="small" color="pink" outline>
          BUTTON
        </Button>
      </div>
      <div className="buttons">
        <Button size="large" fullWidth>
          BUTTON
        </Button>
        <Button size="large" color="gray" fullWidth>
          BUTTON
        </Button>
        <Button size="large" color="pink" fullWidth>
          BUTTON
        </Button>
      </div>
    </div>
  );
}

export default App;
```

다음과 같이 버튼을 클릭 했을 때 `onClick` 이 잘 호출이 됩니다.

![](https://i.imgur.com/rPKB6x4.png)

그래서 이렇게 컴포넌트가 어떤 props 를 받을 지 확실치는 않지만 그대로 다른 컴포넌트 또는 HTML 태그에 전달을 해주어야 하는 상황에는 이렇게 `...rest` 문법을 활용하시면 됩니다!

[![Edit styling-with-sass](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/styling-with-sass-xcjyz?fontsize=14)

## 정리

이번 튜토리얼에서는 Sass 를 활용하는 방법에 대해서 알아보았습니다. Sass 를 사용하면 스타일 파일에 다양한 유용한 문법을 사용해서 컴포넌트 스타일링 생산성을 높여줄 수 있습니다. 앞으로 여러분이 리액트로 프로젝트를 개발하게 될 때 한 프로젝트에서 다양한 버튼을 만들 수 있게 될 수도 있을텐데, 매번 버튼을 만들때마다 새로운 컴포넌트를 만들게 아니라 위와 같이 다양한 옵션을 넣을 수 있게 해서 그때 그때 커스터마이징 해서 사용하는 것이 효율적입니다.

