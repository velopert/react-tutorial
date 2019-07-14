## 03. styled-components

이번에 배워볼 기술은 CSS in JS 라는 기술입니다. 이 문구가 뜻하는 그대로, 이 기술은 JS 안에 CSS 를 작성하는 것을 의미하는데요, 우리는 이번 튜토리얼에서 해당 기술을 사용하는 라이브러리인 [styled-components](https://www.styled-components.com/) 를 다뤄볼 것입니다.

styled-components 는 현존하는 CSS in JS 관련 리액트 라이브러리 중에서 가장 인기 있는 라이브러리입니다. 이에 대한 대안으로는 [emotion](https://github.com/emotion-js/emotion) 와 [styled-jsx](https://github.com/zeit/styled-jsx)가 있습니다. 

### Tagged Template Literal 

styled-components 를 사용하기 전에, Tagged Template Literal 이라는 문법에 대하여 짚고 넘어가면, styled-components 가 내부적으로 어떻게 작동하는지 이해 할 수 있습니다. 참고로 이번에 다룰 내용은 조금 이해하기 어려울 수도 있는데요, 완벽히 이해하지 않아도 앞으로 styled-components 를 사용하는데 전혀 지장이 가지 않으니 가볍게 읽고 넘어가 주셔도 됩니다.

아마, [Template Literal](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals) 에 대해서는 익숙하실 것입니다. 문자열 조합을 더욱 쉽게 할 수 있게 해주는 ES6 문법이죠.


```javascript
const name = 'react';
const message = `hello ${name}`;

console.log(message);
// "hello react"
```

만약에, 우리가 Template Literal 을 사용 할 때 `${}` 안에 일반 문자열 / 숫자가 아닌 객체를 넣는다면 어떻게 될까요?

```javascript
const object = { a: 1 };
const text = `${object}`
console.log(text);
// "[object Object]"
```

아니면, 만약에 함수를 넣는다면 어떻게 될까요?

```javascript
const fn = () => true
const msg = `${fn}`;
console.log(msg);
// "() => true"
```

만약에, 우리가 Template Literal 을 사용하면서도, 그 내부에 넣은 자바스크립트 값을 조회하고 싶을 땐 Tagged Template Literal 문법을 사용 할 수 있습니다.

```javascript
const red = '빨간색';
const blue = '파란색';
function favoriteColors(texts, ...values) {
  console.log(texts);
  console.log(values);
}
favoriteColors`제가 좋아하는 색은 ${red}과 ${blue}입니다.`
```

![](https://i.imgur.com/869yKxk.png)

> 여기서 함수 파라미터쪽에서는 [파라미터의 rest 문법](https://learnjs.vlpt.us/useful/07-spread-and-rest.html#함수-파라미터에서의-rest)이 사용되었습니다.
우리가 입력한 문자열이 모두 분해되어서, 우리가 넣어준 텍스트와 `${}` 를 통해 넣어준 자바스크립트 값을 따로 따로 볼 수 있는데요 이 값들을 조합하여 우리는 이런 작업을 할 수 있습니다.


```javascript
const red = '빨간색';
const blue = '파란색';
function favoriteColors(texts, ...values) {
   return texts.reduce((result, text, i) => `${result}${text}${values[i] ? `<b>${values[i]}</b>` : ''}`, '');
}
favoriteColors`제가 좋아하는 색은 ${red}과 ${blue}입니다.`
// 제가 좋아하는 색은 <b>빨간색</b>과 <b>파란색</b>입니다.
```

코드가 좀 복잡하지요? 우리가 앞으로 개발하면서 `favoriteColors` 같은 함수를 작성할 일은 없으니 이해가기 어려워도 너무 걱정할 필요는 없습니다. 지금은 그냥 저런 문법이 있구나, 정도로 알아두기만헤도 충분합니다.

styled-components 에서는 이런 문법을 사용해서 컴포넌트의 props 를 읽어오기도 하는데요, 지금은 맛보기로만 한번 확인해보세요.

```javascript
const StyledDiv = styled`
  background: ${props => props.color};
`;
```

Tagged Template Literal 을 사용하면 만약 `${}` 을 통하여 함수를 넣어줬다면, 해당 함수를 사용해줄 수도 있답니다.

얘시 코드를 한번 확인해볼까요?

```javascript
function sample(texts, ...fns) {
  const mockProps = {
    title: '안녕하세요',
    body: '내용은 내용내용 입니다.'
  };
  return texts.reduce((result, text, i) => `${result}${text}${fns[i] ? fns[i](mockProps) : ''}`, '');
}
sample`
  제목: ${props => props.title}
  내용: ${props => props.body}
`
/*
"
  제목: 안녕하세요
  내용: 내용은 내용내용 입니다.
"
*/
```

### styled-components 사용하기

이제 본격적으로 styled-components 를 본격적으로 사용해보겠습니다.

새로운 프로젝트를 만들고, styled-components 를 설치해주세요.

```bash
$ npx create-react-app styling-with-styled-components
$ cd styling-with-styled-components
$ yarn add styled-components
```

그리고, 에디터로 해당 프로젝트를 열어주세요.

그 다음에는 App 컴포넌트를 열어서 다음과 같이 styled-components 로 스타일링한 첫번째 컴포넌트를 만들어보세요.

#### App.js


```javascript
import React from 'react';
import styled from 'styled-components';

const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  background: black;
  border-radius: 50%;
`;

function App() {
  return <Circle />;
}

export default App;
```

`yarn start` 명령어를 사용하여 개발 서버를 실행해보세요. 다음과 같은 결과가 나타났나요?

![](https://i.imgur.com/p5gVuZS.png)

styled-components 를 사용하면 이렇게 스타일을 입력함과 동시에 해당 스타일을 가진 컴포넌트를 만들 수 있습니다. 만약에 `div` 를 스타일링 하고 싶으면 `styled.div`, `input` 을 스타일링 하고 싶으면 `styled.input` 이런식으로 사용하면 되는거죠.

이번에는, Circle 컴포넌트에 color 라는 props 를 넣어줘보겠습니다.

#### App.js
```javascript
import React from 'react';
import styled from 'styled-components';

const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  background: ${props => props.color || 'black'};
  border-radius: 50%;
`;

function App() {
  return <Circle color="blue" />;
}

export default App;
```

![](https://i.imgur.com/PIfXvbf.png)

파란색 원이 나타났나요?

Circle 컴포넌트에서는 `color` props 값을 설정해줬으면 해당 값을 배경색으로 설정하고, 그렇지 않으면 검정색을 배경색으로 사용하도록 설정되었습니다.

이번에는, `huge` 라는 props 를 설정됐을 때 크기를 더 키워서 보여주도록 작업을 해보겠습니다.

#### App.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';

const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  background: ${props => props.color || 'black'};
  border-radius: 50%;
  ${props =>
    props.huge &&
    css`
      width: 10rem;
      height: 10rem;
    `}
`;

function App() {
  return <Circle color="red" huge />;
}

export default App;

```

거대한 빨간색 원이 나타났나요?

![]https://i.imgur.com/gze44f6.png)

이런식으로 여러 줄의 CSS 코드를 조건부로 보여주고 싶다면 `css` 를 사용해야합니다., `css` 를 불러와서 사용을 해야 그 스타일 내부에서도 다른 `props` 를 조회 할 수 있습니다.

### Button 만들기 

이제 우리가 이전 Sass 를 배울 때 만들었던 재사용성 높은 Button 컴포넌트를 styled-components 로 구현을 해보겠습니다.

기본적인것부터 단계적으로 구현해봅시다.

src 안에 components 디렉터리를 생성 후, 그 안에 Button.js 파일을 생성하세요.

#### components/Button.js

```javascript
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  background: #228be6;
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
```

그 다음엔 App.js 에서 Button 을 사용해봅시다.


#### App.js

```javascript
import React from 'react';
import styled from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

function App() {
  return (
    <AppBlock>
      <Button>BUTTON</Button>
    </AppBlock>
  );
}

export default App;
```

![](https://i.imgur.com/NXAbljm.png)

버튼이 잘 나타났나요?

### polished의 스타일 관련 유틸 함수 사용하기

Sass 를 사용 할 때에는 `lighten()` 또는 `darken()` 과 같은 유틸 함수를 사용하여 색상에 변화를 줄 수 있었는데요, CSS in JS 에서도 비슷한 유틸 함수를 사용하고 싶다면 [polished](https://polished.js.org/docs/) 라는 라이브러리를 사용하면 됩니다.

우선, 패키지를 설치를 해주세요.

```bash
$ yarn add polished
```

그럼, 기존에 색상 부분을 polished 의 유틸 함수들로 대체를 해보겠습니다.

#### Button.js
```javascript
import React from 'react';
import styled from 'styled-components';
import { darken, lighten } from 'polished';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  background: #228be6;
  &:hover {
    background: ${lighten(0.1, '#228be6')};
  }
  &:active {
    background: ${darken(0.1, '#228be6')};
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
```

버튼에 커서를 올렸을 때 색상이 잘 바뀌고 있나요?

이제 회색, 핑크색 버튼들을 만들어볼건데요, 색상 코드를 지닌 변수를 Button.js 에서 선언을 하는 대신에 [ThemeProvider](https://www.styled-components.com/docs/api#themeprovider) 라는 기능을 사용하여 styled-components 로 만드는 모든 컴포넌트에서 조회하여 사용 할 수 있는 전역적인 값을 설정해보겠습니다.

App.js 를 다음과 같이 수정해보세요.

#### App.js
```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <AppBlock>
        <Button>BUTTON</Button>
      </AppBlock>
    </ThemeProvider>
  );
}

export default App;
```

이렇게 <ThemeProvider> 에서 `theme` 을 설정하면 ThemeProvider 내부에 렌더링된 styled-components 로 만든 컴포넌트에서 `palette` 를 조회하여 사용 할 수 있습니다. 한번 Button 컴포넌트에서 우리가 방금 선언한 `palette.blue` 값을 조회해봅시다.

#### Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  ${props => {
    const selected = props.theme.palette.blue;
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
```

`ThemeProvider` 로 설정한 값은 styled-components 에서 `props.theme` 로 조회 할 수 있습니다. 지금은 `selected` 값을 무조건 `blue` 값을 가르키게 했는데요, 이 부분을 Button 컴포넌트가 `color` props 를 를 통하여 받아오게 될 색상을 사용하도록 수정해보겠습니다.

#### Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  ${props => {
    const selected = props.theme.palette[props.color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

Button.defaultProps = {
  color: 'blue'
};

export default Button;
```

지금은 기본 색상이 `blue` 가 되도록 설정해주었습니다.

이제 App 컴포넌트를 열어서 회색, 핑크색 버튼을 렌더링해봅시다.

#### App.js
```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <AppBlock>
        <Button>BUTTON</Button>
        <Button color="gray">BUTTON</Button>
        <Button color="pink">BUTTON</Button>
      </AppBlock>
    </ThemeProvider>
  );
}

export default App;
```

결과가 잘 나타났나요?

![](https://i.imgur.com/fmdaQOk.png)

Button 컴포넌트의 코드는 다음과 같이 리팩토링 할 수 있습니다.


#### components/Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, color, ...rest }) {
  return <StyledButton color={color} {...rest}>{children}</StyledButton>;
}

Button.defaultProps = {
  color: 'blue'
};

export default Button;
```

`props.theme.palett.blue` 이런식으로 값을 조회하는 대신에 비구조화 할당 문법을 사용하여 가독성을 높여주었습니다.

참고로 위 로직은 다음과 같이 색상에 관련된 코드를 분리하여 사용 할 수도 있습니다.

#### Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const colorStyles = css`
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}
`;

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  ${colorStyles}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, color, ...rest }) {
  return <StyledButton color={color} {...rest}>{children}</StyledButton>;
}

Button.defaultProps = {
  color: 'blue'
};

export default Button;
```

작업을 다 하셨다면, 이전과 동일하게 작동하는지 확인해보세요.

그 다음에는, `size` props 를 설정하여 버튼의 크기도 다양하게 만들어보겠습니다.

#### components/Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const colorStyles = css`
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}
`;

const sizeStyles = css`
  ${props =>
    props.size === 'large' &&
    css`
      height: 3rem;
      font-size: 1.25rem;
    `}

  ${props =>
    props.size === 'medium' &&
    css`
      height: 2.25rem;
      font-size: 1rem;
    `}

    ${props =>
      props.size === 'small' &&
      css`
        height: 1.75rem;
        font-size: 0.875rem;
      `}
`;

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  ${sizeStyles}
  
  /* 색상 */
  ${colorStyles}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, color, size,  ...rest }) {
  return (
    <StyledButton color={color} size={size} {...rest}>
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  color: 'blue'
};

export default Button;
```

참고로 `sizeStyles` 에 해당하는 코드를 따로 분리하지 않고 StyledButton 의 스타일 내부에 바로 적어도 상관은 없습니다. 다만, 이렇게 분리해두면 나중에 유지보수를 할 때 더 편해질 수 있습니다.

이제 사이즈가 커스터마이징된 버튼들을 렌더링해봅시다.


#### App.js
```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <AppBlock>
        <ButtonGroup>
          <Button size="large">BUTTON</Button>
          <Button>BUTTON</Button>
          <Button size="small">BUTTON</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="gray" size="large">
            BUTTON
          </Button>
          <Button color="gray">BUTTON</Button>
          <Button color="gray" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="pink" size="large">
            BUTTON
          </Button>
          <Button color="pink">BUTTON</Button>
          <Button color="pink" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
      </AppBlock>
    </ThemeProvider>
  );
}

export default App;
```

이 과정에서 ButtonGroup 이라는 컴포넌트를 만들어서 서로간의 여백을 `1rem` 으로 설정을 해주었습니다.

![](https://i.imgur.com/SBNRkC1.png)

위와 같이 여러 색들을 지닌 버튼들이 나타났나요?

우리가 아까전에 작성했던 `sizeStyles` 를 보면, 중복되는 코드들이 은근히 있습니다. 해당 코드를 리팩토링한다면 다음과 같이 할 수 있습니다.


#### App.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const colorStyles = css`
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
    `;
  }}
`;

const sizes = {
  large: {
    height: '3rem',
    fontSize: '1.25rem'
  },
  medium: {
    height: '2.25rem',
    fontSize: '1rem'
  },
  small: {
    height: '1.75rem',
    fontSize: '0.875rem'
  }
};

const sizeStyles = css`
  ${({ size }) => css`
    height: ${sizes[size].height};
    font-size: ${sizes[size].fontSize};
  `}
`;

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  ${sizeStyles}

  /* 색상 */
  ${colorStyles}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, color, size, ...rest }) {
  return (
    <StyledButton color={color} size={size} {...rest}>
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  color: 'blue',
  size: 'medium'
};

export default Button;
```

컴포넌트들이 여전히 잘 나오고 있나요?

그 다음에는, Button 컴포넌트에 `outline` 이라는 props 를 설정하여 이 값이 `true` 일 때에는 테두리만 지닌 버튼을 보여주도록 설정해보겠습니다. 이 작업을 할 때에는 `colorStyles` 만 수정해주면 됩니다.

#### components/Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const colorStyles = css`
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
      ${props =>
        props.outline &&
        css`
          color: ${selected};
          background: none;
          border: 1px solid ${selected};
          &:hover {
            background: ${selected};
            color: white;
          }
        `}
    `;
  }}
`;

const sizes = {
  large: {
    height: '3rem',
    fontSize: '1.25rem'
  },
  medium: {
    height: '2.25rem',
    fontSize: '1rem'
  },
  small: {
    height: '1.75rem',
    fontSize: '0.875rem'
  }
};

const sizeStyles = css`
  ${({ size }) => css`
    height: ${sizes[size].height};
    font-size: ${sizes[size].fontSize};
  `}
`;

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  ${sizeStyles}

  /* 색상 */
  ${colorStyles}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, color, size, outline, ...rest }) {
  return (
    <StyledButton color={color} size={size} outline={outline} {...rest}>
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  color: 'blue',
  size: 'medium'
};

export default Button;
```

`outline` 스타일을 가진 버튼들을 렌더링해봅시다!

#### App.js
```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <AppBlock>
        <ButtonGroup>
          <Button size="large">BUTTON</Button>
          <Button>BUTTON</Button>
          <Button size="small">BUTTON</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="gray" size="large">
            BUTTON
          </Button>
          <Button color="gray">BUTTON</Button>
          <Button color="gray" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="pink" size="large">
            BUTTON
          </Button>
          <Button color="pink">BUTTON</Button>
          <Button color="pink" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="large" outline>
            BUTTON
          </Button>
          <Button color="gray" outline>
            BUTTON
          </Button>
          <Button color="pink" size="small" outline>
            BUTTON
          </Button>
        </ButtonGroup>
      </AppBlock>
    </ThemeProvider>
  );
}

export default App;
```

이제 Button 컴포넌트에서 해야 할 마지막 작업이 한가지 더 남았습니다. `fullWidth` 라는 props 가 주어졌다면 버튼의 크기가 100% 를 차지하도록 만들어보세요.


#### components/Button.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

const colorStyles = css`
  ${({ theme, color }) => {
    const selected = theme.palette[color];
    return css`
      background: ${selected};
      &:hover {
        background: ${lighten(0.1, selected)};
      }
      &:active {
        background: ${darken(0.1, selected)};
      }
      ${props =>
        props.outline &&
        css`
          color: ${selected};
          background: none;
          border: 1px solid ${selected};
          &:hover {
            background: ${selected};
            color: white;
          }
        `}
    `;
  }}
`;

const sizes = {
  large: {
    height: '3rem',
    fontSize: '1.25rem'
  },
  medium: {
    height: '2.25rem',
    fontSize: '1rem'
  },
  small: {
    height: '1.75rem',
    fontSize: '0.875rem'
  }
};

const sizeStyles = css`
  ${({ size }) => css`
    height: ${sizes[size].height};
    font-size: ${sizes[size].fontSize};
  `}
`;

const fullWidthStyle = css`
  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
      justify-content: center;
      & + & {
        margin-left: 0;
        margin-top: 1rem;
      }
    `}
`;

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  ${sizeStyles}

  /* 색상 */
  ${colorStyles}

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }

  ${fullWidthStyle}
`;

function Button({ children, color, size, outline, fullWidth, ...rest }) {
  return (
    <StyledButton
      color={color}
      size={size}
      outline={outline}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  color: 'blue',
  size: 'medium'
};

export default Button;
```

`fullWidth` 스타일을 지닌 컴포넌트들도 렌더링해봅시다!

#### App.js
```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <AppBlock>
        <ButtonGroup>
          <Button size="large">BUTTON</Button>
          <Button>BUTTON</Button>
          <Button size="small">BUTTON</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="gray" size="large">
            BUTTON
          </Button>
          <Button color="gray">BUTTON</Button>
          <Button color="gray" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button color="pink" size="large">
            BUTTON
          </Button>
          <Button color="pink">BUTTON</Button>
          <Button color="pink" size="small">
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="large" outline>
            BUTTON
          </Button>
          <Button color="gray" outline>
            BUTTON
          </Button>
          <Button color="pink" size="small" outline>
            BUTTON
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="large" fullWidth>
            BUTTON
          </Button>
          <Button size="large" color="gray" fullWidth>
            BUTTON
          </Button>
          <Button size="large" color="pink" fullWidth>
            BUTTON
          </Button>
        </ButtonGroup>
      </AppBlock>
    </ThemeProvider>
  );
}

export default App;
```

![](https://i.imgur.com/A8bAHW6.png) 이런 결과가 잘 나타났나요?


### Dialog 만들기

이번에는 기존 화면을 가리게 되면서 정보를 보여주게 되는 Dialog 컴포넌트를 만들어보겠습니다.

![](https://i.imgur.com/qgKmhsH.gif)

이 컴포넌트를 만드는 과정에서 우리가 아까 만들었던 Button 컴포넌트를 재사용하게 됩니다.

위 미리보기를 보시면 트랜지션 효과도 있는데요, 이는 나중에 구현을 해주겠습니다.

우선 components 디렉터리에 Dialog.js 파일을 생성 후 다음 코드를 입력해보세요.

#### components/Dialog.js

```javascript
import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

function Dialog({ title, children, confirmText, cancelText }) {
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <Button color="gray">{cancelText}</Button>
          <Button color="pink">{confirmText}</Button>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

우리가 h3, 과 p 를 스타일링 때 굳이 다음과 같이 따로 따로 컴포넌트를 만들어주지 않아도

```javascript
const Title = styled.h3``;
const Description = styled.p``;
```

styled-components 에서도 Nested CSS 문법을 사용 할 수 있기 때문에 DialogBlock 안에 있는 h3 와 p  에게 특정 스타일을 주고 싶다면 다음과 같이 작성 할 수 있답니다.

```javascript
const DialogBlock = styled.div`
  h3 {}
  p {}
`;
```

자, 이제 이 컴포넌트를 App 에 렌더링해보세요.

#### App.js

```javascript
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';
import Dialog from './components/Dialog';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;

function App() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <>
        <AppBlock>
          <ButtonGroup>
            <Button size="large">BUTTON</Button>
            <Button>BUTTON</Button>
            <Button size="small">BUTTON</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button color="gray" size="large">
              BUTTON
            </Button>
            <Button color="gray">BUTTON</Button>
            <Button color="gray" size="small">
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button color="pink" size="large">
              BUTTON
            </Button>
            <Button color="pink">BUTTON</Button>
            <Button color="pink" size="small">
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button size="large" outline>
              BUTTON
            </Button>
            <Button color="gray" outline>
              BUTTON
            </Button>
            <Button color="pink" size="small" outline>
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button size="large" fullWidth>
              BUTTON
            </Button>
            <Button size="large" color="gray" fullWidth>
              BUTTON
            </Button>
            <Button size="large" color="pink" fullWidth>
              BUTTON
            </Button>
          </ButtonGroup>
        </AppBlock>
        <Dialog
          title="정말로 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
        >
          데이터를 정말로 삭제하시겠습니까?
        </Dialog>
      </>
    </ThemeProvider>
  );
}

export default App;
```

Dialog 컴포넌트를 예시 내용과 함께 AppBlock 하단에 넣어주었으며, ThemeProvider 내부는 하나의 리액트 엘리먼트로 감싸져있어야 하기 때문에 AppBlock 과 Dialog 를 `<></>` 으로 감싸주었습니다.

이런 결과가 나타났나요?

![](https://i.imgur.com/XIqIL0h.png)


지금 보면 이 Dialog 에서는 취소 버튼과 삭제 버튼의 간격이 조금 넓어보이는 느낌이 있는데요, 만약에 styled-components로 컴포넌트의 스타일을 특정 상황에서 덮어쓰는 방법에 대해서 알아보겠습니다.

Dialog.js 에서 다음과 같이 ShortMarginButton 을 만들고 기존 Button 을 대체시켜보세요.

#### components/Dialog.js

```javascript
import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

const ShortMarginButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;

function Dialog({ title, children, confirmText, cancelText }) {
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <ShortMarginButton color="gray">{cancelText}</ShortMarginButton>
          <ShortMarginButton color="pink">{confirmText}</ShortMarginButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

![](https://i.imgur.com/omDNCeo.png)

여백이 줄어들었나요? 이렇게 컴포넌트의 스타일을 커스터마이징 할 때에는 해당 컴포넌트에서 `className` props 를 내부 엘리먼트에게 전달이 되고 있는지 확인해주어야 합니다.

```javascript
const MyComponent = ({ className }) => {
  return <div className={className}></div>
};

const ExtendedComponent = styled(MyComponent)`
  background: black;
`;
```

참고로 우리가 만든 Button 컴포넌트의 경우에는 `...rest` 를 통하여 전달이 되고 있습니다.

컴포넌트의 모양새를 모두 갖추었으면 열고 닫을 수 있는 기능을 구현해봅시다. Dialog 에서 `onConfirm` 과 `onCancel` 을 props 로 받아오도록 하고 해당 함수들을 각 버튼들에게 `onClick` 으로 설정해주세요.

그리고, `visible` props 도 받아와서 이 값이 `false` 일 때 컴포넌트에서 `null` 을 반환하도록 설정해주세요.

#### components/Dialog.js
```javascript
import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

const ShortMarginButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;

function Dialog({
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  visible
}) {
  if (!visible) return null;
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <ShortMarginButton color="gray" onClick={onCancel}>
            {cancelText}
          </ShortMarginButton>
          <ShortMarginButton color="pink" onClick={onConfirm}>
            {confirmText}
          </ShortMarginButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

그 다음에는, App 컴포넌트에서 `useState` 를 사용하여 Dialog 를 가시성 상태를 관리해보세요.

#### App.js
```javascript
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from './components/Button';
import Dialog from './components/Dialog';

const AppBlock = styled.div`
  width: 512px;
  margin: 0 auto;
  margin-top: 4rem;
  border: 1px solid black;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;

function App() {
  const [dialog, setDialog] = useState(false);
  const onClick = () => {
    setDialog(true);
  };
  const onConfirm = () => {
    console.log('확인');
    setDialog(false);
  };
  const onCancel = () => {
    console.log('취소');
    setDialog(false);
  };

  return (
    <ThemeProvider
      theme={{
        palette: {
          blue: '#228be6',
          gray: '#495057',
          pink: '#f06595'
        }
      }}
    >
      <>
        <AppBlock>
          <ButtonGroup>
            <Button size="large">BUTTON</Button>
            <Button>BUTTON</Button>
            <Button size="small">BUTTON</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button color="gray" size="large">
              BUTTON
            </Button>
            <Button color="gray">BUTTON</Button>
            <Button color="gray" size="small">
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button color="pink" size="large">
              BUTTON
            </Button>
            <Button color="pink">BUTTON</Button>
            <Button color="pink" size="small">
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button size="large" outline>
              BUTTON
            </Button>
            <Button color="gray" outline>
              BUTTON
            </Button>
            <Button color="pink" size="small" outline>
              BUTTON
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button size="large" fullWidth>
              BUTTON
            </Button>
            <Button size="large" color="gray" fullWidth>
              BUTTON
            </Button>
            <Button size="large" color="pink" fullWidth onClick={onClick}>
              삭제
            </Button>
          </ButtonGroup>
        </AppBlock>
        <Dialog
          title="정말로 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={onConfirm}
          onCancel={onCancel}
          visible={dialog}
        >
          데이터를 정말로 삭제하시겠습니까?
        </Dialog>
      </>
    </ThemeProvider>
  );
}

export default App;
```

맨 아래에 있는 큰 핑크색 버튼의 이름을 "삭제" 로 변경 후 해당 버튼을 누르면 우리가 만든 Dialog 가 보여지도록 설정을 했고, Dialog 에 `onConfirm`, `onCancel`, `visible` 값을 전달해주었습니다.

브라우저에서 삭제 버튼을 눌러서 Dialog 가 잘 작동하는지 확인해보세요. 버튼 눌렀을 때 콘솔에 확인/취소 텍스트가 출력되는지도 확인하세요.

![](https://i.imgur.com/FY1ps8j.png)

### 트랜지션 구현하기

이제 Dialog 의 기능은 모두 구현을 해주었습니다. 이번에는 Dialog 가 나타나거나 사라질 때 트랜지션 효과를 적용해보겠습니다. 트랜지션 효과를 적용 할 때에는 [CSS Keyframe](https://developer.mozilla.org/ko/docs/Web/CSS/@keyframes) 을 사용하며, styled-components 에서 이를 사용 할 때에는 [`keyframes`](https://www.styled-components.com/docs/api#keyframes) 라는 유틸을 사용합니다.

Dialog가 나타날 때 DarkBackground 쪽에는 서서히 나타나는 fadeIn 효과를 주고, DialogBlock 에는 아래에서부터 위로 올라오는 효과를 보여주는 slideUp 효과를 줘보겠습니다. 애니메이션의 이름은 여러분들이 마음대로 지정 할 수 있습니다.

#### components/Dialog.js
```javascript
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from './Button';

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(200px);
  }
  to {
    transform: translateY(0px);
  }
`;

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

const ShortMarginButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;

function Dialog({
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  visible
}) {
  if (!visible) return null;
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <ShortMarginButton color="gray" onClick={onCancel}>
            {cancelText}
          </ShortMarginButton>
          <ShortMarginButton color="pink" onClick={onConfirm}>
            {confirmText}
          </ShortMarginButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

이렇게 하면 컴포넌트가 나타날 때 트랜지션 효과가 나타날 것입니다. 이제 사라지는 트랜지션 효과도 만들어볼건데요, 이는 구현하기 조금 까다롭지만, 원리만 알면 굉장히 쉽습니다.

사라지는 효과를 구현하려면 Dialog 컴포넌트에서 두개의 로컬 상태를 관리해주어야 합니다. 하나는 현재 트랜지션 효과를 보여주고 있는 중이라는 상태를 의미하는 `animate`, 나머지 하나는 실제로 컴포넌트가 사라지는 시점을 지연시키기 위한 `localVisible` 값입니다.

그리고 `useEffect` 를 하나 작성해주어야 하는데요, `visible` 값이 `true` 에서 `false` 로 바뀌는 시점을 감지하여 `animate` 값을 `true` 로 바꿔주고 `setTimeout` 함수를 사용하여 250ms 이후 `false`로 바꾸어 주어야 합니다.

추가적으로, `!visible` 조건에서 `null` 를 반환하는 대신에 `!animate && !localVisible` 조건에서 `null` 을 반환하도록 수정해주어야 합니다. 



#### components/Dialog.js
```javascript
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from './Button';

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(200px);
  }
  to {
    transform: translateY(0px);
  }
`;

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

const ShortMarginButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;

function Dialog({
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  visible
}) {
  const [animate, setAnimate] = useState(false);
  const [localVisible, setLocalVisible] = useState(visible);

  useEffect(() => {
    // visible 값이 true -> false 가 되는 것을 감지
    if (localVisible && !visible) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    }
    setLocalVisible(visible);
  }, [localVisible, visible]);

  if (!animate && !localVisible) return null;
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <ShortMarginButton color="gray" onClick={onCancel}>
            {cancelText}
          </ShortMarginButton>
          <ShortMarginButton color="pink" onClick={onConfirm}>
            {confirmText}
          </ShortMarginButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

이제 확인 / 취소를 눌렀을 때 약간의 딜레이 이후에 Dialog 가 사라지는 것을 확인해보세요. 만약에 잘 모르겠다면 기존에 `setTimeout` 에서 250 으로 설정했던 것을 1000 으로 설정을 해보세요 (확인했다면 다시 250으로 되돌려놓으세요).

이제 DarkBackground 와 DialogBlock 에 `disappear` 라는 props 를 주어서 사라지는 효과가 나타나도록 설정을 해보겠습니다.

각 컴포넌트의 `disappear` 값은 `!visible` 로 해주시면 됩니다.

#### components/Dialog.js
```javascript
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Button from './Button';

const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1
  }
  to {
    opacity: 0
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(200px);
  }
  to {
    transform: translateY(0px);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(200px);
  }
`;

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;

  ${props =>
    props.disappear &&
    css`
      animation-name: ${fadeOut};
    `}
`;

const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    font-size: 1.125rem;
  }

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;

  ${props =>
    props.disappear &&
    css`
      animation-name: ${slideDown};
    `}
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
`;

const ShortMarginButton = styled(Button)`
  & + & {
    margin-left: 0.5rem;
  }
`;

function Dialog({
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  visible
}) {
  const [animate, setAnimate] = useState(false);
  const [localVisible, setLocalVisible] = useState(visible);

  useEffect(() => {
    // visible 값이 true -> false 가 되는 것을 감지
    if (localVisible && !visible) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    }
    setLocalVisible(visible);
  }, [localVisible, visible]);

  if (!animate && !localVisible) return null;
  return (
    <DarkBackground disappear={!visible}>
      <DialogBlock disappear={!visible}>
        <h3>{title}</h3>
        <p>{children}</p>
        <ButtonGroup>
          <ShortMarginButton color="gray" onClick={onCancel}>
            {cancelText}
          </ShortMarginButton>
          <ShortMarginButton color="pink" onClick={onConfirm}>
            {confirmText}
          </ShortMarginButton>
        </ButtonGroup>
      </DialogBlock>
    </DarkBackground>
  );
}

Dialog.defaultProps = {
  confirmText: '확인',
  cancelText: '취소'
};

export default Dialog;
```

트랜지션 효과가 잘 작동하나요?

![](https://i.imgur.com/qgKmhsH.gif)


## 정리

CSS in JS 의 경우 기존 css 파일을 분리하여 작성하는 방식과 개발 흐름이 조금 다르기 때문에 처음에 조금 적응 기간이 필요 할 수도 있습니다. 그 적응 기간을 거치고 나면 정말 편하게 사용 할 수 있습니다.

