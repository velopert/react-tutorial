## 1. 컴포넌트 만들기

투두리스트의 기능을 구현하기 전에, 우리 프로젝트에서 필요한 모든 컴포넌트들의 UI 를 미리 만들어보겠습니다.

우선 create-react-app 을 사용하여 새로운 프로젝트를 만들어주세요.

```bash
$ npx create-react-app mashup-todolist
```

그리고, 해당 디렉터리에 들어가서 이번 프로젝트에서 필요한 라이브러리 react-icons 와 styled-components 를 설치하세요.

```bash
$ cd mashup-todolist
$ yarn add react-icons styled-components
```

그 다음에는 에디터로 해당 디렉터리를 열고 `yarn start` 를 하여 개발 서버를 실행해주세요.

> 이번에 사용 될 코드들은 다음 CodeSandbox 에서 확인 가능합니다.
> 
> [![Edit mashup-todolist](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mashup-todolist-hp21n?fontsize=14)

### 만들어야 할 컴포넌트 확인하기

우리가 이번에 만들어야 할 컴포넌트는 총 5개 입니다. 컴포넌트를 만들기전에 앞으로 어떤 컴포넌트를 만들게 될 지, 그리고 각 컴포넌트가 어떤 역할을 하는지 알아봅시다.

#### TodoTemplate 

이 컴포넌트는 우리가 만들 투두리스트의 레이아웃을 설정하는 컴포넌트입니다. 페이지의 중앙에 그림자가 적용된 흰색 박스를 보여줍니다.

#### TodoHead

이 컴포넌트는 오늘의 날짜와 요일을 보여주고, 앞으로 해야 할 일이 몇개 남았는지 보여줍니다.

#### TodoList

이 컴포넌트는 할 일에 대한 정보가 들어있는 todos 배열을 내장함수 `map` 을 사용하여 여러개의 TodoItem 컴포넌트를 렌더링해줍니다.

#### TodoItem

각 할 일에 대한 정보를 렌더링해주는 컴포넌트입니다. 좌측에 있는 원을 누르면 할 일의 완료 여부를 toggle 할 수 있습니다. 할 일이 완료됐을 땐 좌측에 체크가 나타나고 텍스트의 색상이 연해집니다. 그리고, 마우스를 올리면 휴지통 아이콘이 나타나고 이를 누르면 항목이 삭제됩니다.


#### TodoCreate

새로운 할 일을 등록할 수 있게 해주는 컴포넌트입니다. TodoTemplate 의 하단부에 초록색 원 버튼을 렌더링해주고, 이를 클릭하면 할 일을 입력 할 수 있는 폼이 나타납니다. 버튼을 다시 누르면 폼이 사라집니다.


### 페이지에 회색 배경색상 적용

먼저 페이지에 회색 (`#e9ecef`) 배경색상을 적용해보겠습니다. 페이지의 배경 색상을 설정하려면 `body` 태그에 CSS 를 적용해주면 되는데요, 이를 하기 위해서는 index.css 에서 해도 무방하지만, 만약에 styled-components 를 사용해서 적용을 하고 싶을땐 어떻게 할 수 있는지 알아봅시다.

styled-components 에서 특정 컴포넌트를 만들어서 스타일링 하는게 아니라 글로벌 스타일을 추가하고 싶을 땐 [`createGlobalStyle`](https://www.styled-components.com/docs/api#createglobalstyle) 이라는 것을 사용합니다. 이 함수를 사용하면 컴포넌트가 만들어지는데, 이 컴포넌트를 렌더링하면 됩니다.

App.js 를 다음과 같이 수정해보세요.

#### App.js

```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <div>안녕하세요</div>
    </>
  );
}

export default App;
```

![](https://i.imgur.com/zd2bRkY.png)

회색 배경이 잘 적용 됐나요?


### TodoTemplate 만들기

TodoTemplate 컴포넌트를 만들어서 중앙에 정렬된 흰색 박스를 보여줘봅시다. src 디렉터리에 components 디렉터리를 만들고, 그 안에 TodoTemplate.js 를 만드세요. 앞으로 만들 컴포넌트들은 모두 components 디렉터리에 만들도록 하겠습니다.

#### components/TodoTemplate.js
```javascript
import React from 'react';
import styled from 'styled-components';

const TodoTemplateBlock = styled.div`
  width: 512px;
  height: 768px;

  position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
  background: white;
  border-radius: 16px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);

  margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */

  margin-top: 96px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
`;

function TodoTemplate({ children }) {
  return <TodoTemplateBlock>{children}</TodoTemplateBlock>;
}

export default TodoTemplate;
```

다 작성하셨으면 이 컴포넌트를 App 에서 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import TodoTemplate from './components/TodoTemplate';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <TodoTemplate>안녕하세요</TodoTemplate>
    </>
  );
}

export default App;

```

![](https://i.imgur.com/9IcpkS6.png)

흰색 박스가 나타났나요?

### TodoHead 만들기

이 컴포넌트에서는 오늘의 날짜, 요일, 그리고 남은 할 일 개수를 보여줍니다. 

#### components/TodoHead.js
```javascript
import React from 'react';
import styled from 'styled-components';

const TodoHeadBlock = styled.div`
  padding-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
  h1 {
    margin: 0;
    font-size: 36px;
    color: #343a40;
  }
  .day {
    margin-top: 4px;
    color: #868e96;
    font-size: 21px;
  }
  .tasks-left {
    color: #20c997;
    font-size: 18px;
    margin-top: 40px;
    font-weight: bold;
  }
`;

function TodoHead() {
  return (
    <TodoHeadBlock>
      <h1>2019년 7월 10일</h1>
      <div className="day">수요일</div>
      <div className="tasks-left">할 일 2개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;
```

이 컴포넌트에서는 TodoHeadBlock 안에 들어있는 내용들에 대하여 일일이 컴포넌트를 만드는 대신에 그냥 일반 HTML 태그를 사용하고 TodoHeadBlock 의 스타일에서 CSS Selector 를 사용하여 스타일링을 해주었습니다.

물론, 하나하나 컴포넌트로 만들으셔도 상관 없지만, 이렇게 조건부 스타일링을 할 필요가 없고, 기능적으로도 크게 중요하지 않은 내용이라면 CSS Selector 를 사용하는 것도 좋은 방법입니다. 이는 취향에 따라 여러분이 결정 할 수 있으니 원한다면 하나하나 컴포넌트로 만들으셔서 작업을 하셔도 됩니다.

이제 이 컴포넌트를 App 에서 렌더링해주세요.

#### App.js
```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import TodoTemplate from './components/TodoTemplate';
import TodoHead from './components/TodoHead';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <TodoTemplate>
        <TodoHead />
      </TodoTemplate>
    </>
  );
}

export default App;
```

![](https://i.imgur.com/3UBWsYt.png)

내용이 잘 보여지나요?

### TodoList 만들기

이번에는 여러개의 할 일 항목을 보여주게 될 TodoList 를 만들어보겠습니다.

#### components/TodoList.js
```javascript
import React from 'react';
import styled from 'styled-components';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
  background: gray; /* 사이즈 조정이 잘 되고 있는지 확인하기 위한 임시 스타일 */
`;

function TodoList() {
  return <TodoListBlock>TodoList</TodoListBlock>;
}

export default TodoList;
```

지금은 특별한 내용을 보여주지 않고, 사이즈에 관련한 설정만 해주었습니다. `flex: 1` 스타일을 설정함으로써 자신이 차지 할 수 있는 영역을 꽉 채우도록 설정을 했는데요, 이게 잘 작동했는지 확인하기 위하여 임시적으로 회색 배경을 설정해주었습니다.

이 컴포넌트를 App 에서 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import TodoTemplate from './components/TodoTemplate';
import TodoHead from './components/TodoHead';
import TodoList from './components/TodoList';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <TodoTemplate>
        <TodoHead />
        <TodoList />
      </TodoTemplate>
    </>
  );
}

export default App;
```

TodoList 가 회색으로 잘 나타났나요? 회색으로 잘 나타난것을 확인하셨다면 `background: gray` 속성을 없애주세요.

![](https://i.imgur.com/N5IJ7fR.png)

#### TodoItem 만들기

이번 컴포넌트에서는 각 할 일 항목들을 보여주는 TodoItem 컴포넌트를 만들어보겠습니다.  이 컴포넌트에서는 [react-icons](https://react-icons.netlify.com/#/icons/md) 에서 MdDone 과 MdDelete 아이콘을 사용합니다.

<div style="display: flex">
  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(51, 51, 51);"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(51, 51, 51);"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
</div>

#### TodoItem.js
```javascript
import React from 'react';
import styled, { css } from 'styled-components';
import { MdDone, MdDelete } from 'react-icons/md';

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #ff6b6b;
  }
  display: none;
`;

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  &:hover {
    ${Remove} {
      display: initial;
    }
  }
`;

const CheckCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid #ced4da;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  cursor: pointer;
  ${props =>
    props.done &&
    css`
      border: 1px solid #38d9a9;
      color: #38d9a9;
    `}
`;

const Text = styled.div`
  flex: 1;
  font-size: 21px;
  color: #495057;
  ${props =>
    props.done &&
    css`
      color: #ced4da;
    `}
`;

function TodoItem({ id, done, text }) {
  return (
    <TodoItemBlock>
      <CheckCircle done={done}>{done && <MdDone />}</CheckCircle>
      <Text done={done}>{text}</Text>
      <Remove>
        <MdDelete />
      </Remove>
    </TodoItemBlock>
  );
}

export default TodoItem;
```

위 코드에서 TodoItemBlock 의 코드가 조금 생소하지요?

```javascript
const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  &:hover {
    ${Remove} {
      display: initial;
    }
  }
`;
```

여기서 사용된 기능은 [Component Selector](https://www.styled-components.com/docs/advanced#referring-to-other-components) 라는 기능입니다. 이 스타일은 TodoItemBlock 위에 커서가 있을 때, Remove 컴포넌트를 보여주라는 의미를 가지고 있습니다.

이제 이 컴포넌트를 TodoList 에서 렌더링해보세요.

#### components/TodoList.js
```javascript
import React from 'react';
import styled from 'styled-components';
import TodoItem from './TodoItem';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
`;

function TodoList() {
  return (
    <TodoListBlock>
      <TodoItem text="프로젝트 생성하기" done={true} />
      <TodoItem text="컴포넌트 스타일링 하기" done={true} />
      <TodoItem text="Context 만들기" done={false} />
      <TodoItem text="기능 구현하기" done={false} />
    </TodoListBlock>
  );
}

export default TodoList;
```

![](https://i.imgur.com/H7ALrk2.png)

각 할 일 항목이 잘 나타났나요? 커서를 올렸을 때, 삭제 아이콘이 나타나는지도 확인해보세요.

### TodoCreate 만들기

이번에는 새로운 항목을 등록 할 수 있는 컴포넌트를 만들어보겠습니다. 이 컴포넌트에서는 react-icons 의 MdAdd 를 사용합니다.

<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(51, 51, 51);"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

이 컴포넌트에서는 `useState` 를 사용하여 토글 할 수 있는 open 값을 관리하며, 이 값이 `true` 일 때에는 아이콘을 45도 돌려서 X 모양이 보여지게 한 후, 버튼 색상을 빨간색으로 바꿔줍니다. 그리고, 할 일을 입력 할 수 있는 폼도 보여줍니다.

#### components/TodoCreate.js
```javascript
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';

const CircleButton = styled.button`
  background: #38d9a9;
  &:hover {
    background: #63e6be;
  }
  &:active {
    background: #20c997;
  }

  z-index: 5;
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: block;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, 50%);
  color: white;
  border-radius: 50%;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.125s all ease-in;
  ${props =>
    props.open &&
    css`
      background: #ff6b6b;
      &:hover {
        background: #ff8787;
      }
      &:active {
        background: #fa5252;
      }
      transform: translate(-50%, 50%) rotate(45deg);
    `}
`;

const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
`;

const InsertForm = styled.form`
  background: #f8f9fa;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 32px;
  padding-bottom: 72px;

  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  width: 100%;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;
`;

function TodoCreate() {
  const [open, setOpen] = useState(false);

  const onToggle = () => setOpen(!open);

  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm>
            <Input autoFocus placeholder="할 일을 입력 후, Enter 를 누르세요" />
          </InsertForm>
        </InsertFormPositioner>
      )}
      <CircleButton onClick={onToggle} open={open}>
        <MdAdd />
      </CircleButton>
    </>
  );
}

export default TodoCreate;
```

이제 이 컴포넌트를 App 에서 렌더링해보세요.

#### App.js
```javascript
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import TodoTemplate from './components/TodoTemplate';
import TodoHead from './components/TodoHead';
import TodoList from './components/TodoList';
import TodoCreate from './components/TodoCreate';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <TodoTemplate>
        <TodoHead />
        <TodoList />
        <TodoCreate />
      </TodoTemplate>
    </>
  );
}

export default App;
```

TodoCreate 의 버튼을 눌러보세요. UI 가 잘 바뀌고 있나요?

![](https://i.imgur.com/gV1krZI.png)

![](https://i.imgur.com/oNgZ3sh.png)

이제 프로젝트의 UI 가 모두 완성됐습니다. 다음 섹션에서는 프로젝트의 상태 관리를 해주겠습니다.