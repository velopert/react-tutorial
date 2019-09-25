## 2. 리액트 컴포넌트 타입스크립트로 작성하기

이번 섹션에서는 리액트 컴포넌트를 타입스크립트로 작성하는 방법을 알아보도록 하겠습니다.

### 프로젝트 생성

우선, 타입스크립트를 사용하는 리액트 프로젝트를 만들어볼까요?

타입스크립트를 사용하는 리액트 프로젝트를 만들때는 다음과 같이 명령어를 사용하세요.

```bash
$ npx create-react-app ts-react-tutorial --typescript
```

위와 같이 뒤에 `--typescript` 가 있으면 타입스크립트 설정이 적용된 프로젝트가 생성된답니다.

만약, 이미 만든 프로젝트에 타입스크립트를 적용하고 싶으시다면 이 [링크](https://create-react-app.dev/docs/adding-typescript)를 확인해주세요.

이제 프로젝트를 열어보시면 src 디렉터리 안에 App.tsx 라는 파일이 있을것입니다. 타입스크립트를 사용하는 리액트 컴포넌트는 이와 같이 `*.tsx` 확장자를 사용한답니다. 해당 파일을 한번 열어볼까요?


#### App.tsx
```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

이 컴포넌트를 보시면, `const App: React.FC = () => { ... }` 와 같이 화살표함수를 사용하여 컴포넌트가 선언되었습니다. 우리가 지금까지 강의에서 다뤄왔던 컴포넌트들은 `function` 키워드를 사용해서 선언했었는데요, 컴포넌트를 선언 할 때 이렇게 화살표함수를 사용하여 선언해도 무방합니다. 리액트 공식 문서나 해외의 유명 개발자들 ([링크1](https://overreacted.io/a-complete-guide-to-useeffect/), [링크2](https://kentcdodds.com/blog/how-to-use-react-context-effectively))은 보통 `function` 키워드를 사용하여 함수형 컴포넌트를 선언하는 것이 추세이기에, 이 튜토리얼에서는 지금까지 `function` 키워드를 사용해왔습니다. 반면 위 코드에서는 화살표함수로 선언이 되었고 `React.FC` 라는 것을 사용하여 컴포넌트의 타입을 지정했는데요, 이렇게 타입을 지정하는것이 좋을수도 있고 나쁠수도 있습니다.

한번 새로운 컴포넌트를 선언하면서 `React.FC` 를 사용하고 사용하지 않는것이 어떤 차이가 있는지 알아보도록 하겠습니다.

### 새로운 컴포넌트 만들기

Greetings 라는 새로운 컴포넌트를 작성해봅시다. 

#### src/Greetings.tsx
```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
};

const Greetings: React.FC<GreetingsProps> = ({ name }) => (
  <div>Hello, {name}</div>
);

export default Greetings;
```

`React.FC` 를 사용 할 때는 props 의 타입을 Generics 로 넣어서 사용합니다. 이렇게 `React.FC`를 사용해서 얻을 수 있는 이점은 두가지가 있습니다.

첫번째는, props 에 기본적으로 `children` 이 들어가있다는 것 입니다.

![](https://i.imgur.com/hmQz26Q.png)

> 중괄호 안에서 Ctrl + Space 를 눌러보면 확인 할 수 있습니다.

두번째는 컴포넌트의 defaultProps, propTypes, contextTypes 를 설정 할 때 자동완성이 될 수 있다는 것 입니다.

![](https://i.imgur.com/SxdC0x0.png)


한편으로는 단점도 존재하긴 합니다. `children` 이 옵셔널 형태로 들어가있다보니까 어찌 보면 컴포넌트의 props 의 타입이 명백하지 않습니다. 예를 들어 어떤 컴포넌트는 `children`이 무조건 있어야 하는 경우도 있을 것이고, 어떤 컴포넌트는 `children` 이 들어가면 안되는 경우도 있을 것입니다. `React.FC` 를 사용하면 기본적으로는 이에 대한 처리를 제대로 못하게 됩니다. 만약에 하고 싶다면 결국 Props 타입 안에 `children` 을 설정해야하죠.

예를 들자면 다음과 같습니다.

```javascript
type GreetingsProps = {
  name: string;
  children: React.ReactNode;
};
```


그리고, React.FC는 (아직까지는) `defaultProps` 가 제대로 작동하지 않습니다. 예를 들어서 코드를 다음과 같이 작성했다고 가정해봅시다.

#### src/Greetings.tsx
```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
};

const Greetings: React.FC<GreetingsProps> = ({ name, mark }) => (
  <div>
    Hello, {name} {mark}
  </div>
);

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```

그리고 App 에서 해당 컴포넌트를 렌더링한다면

#### src/App.tsx
```javascript
import React from 'react';
import Greetings from './Greetings';

const App: React.FC = () => {
  return <Greetings name="Hello" />;
};

export default App;
```

![](https://i.imgur.com/cHzXsu4.png)

`mark` 를 `defaultProps` 로 넣었음에도 불구하고 `mark`값이 없다면서 제대로 작동하지 않습니다. 반면, `React.FC` 를 생략하면 어떨까요?

#### src/Greetings.tsx
```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
};

const Greetings = ({ name, mark }: GreetingsProps) => (
  <div>
    Hello, {name} {mark}
  </div>
);

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```

생략을 하면 오히려 아주 잘됩니다!

이러한 이슈때문에 `React.FC` 를 쓰지 말라는 [팁](https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680#78b9)도 존재합니다. 이를 쓰고 안쓰고는 여러분의 자유이지만, 저는 사용하지 않는 것을 권장합니다.

취향에 따라, 화살표 함수도 만약에 사용하지 않는다면 다음과 같은 형태겠지요?

#### src/Greetings.tsx
```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
};

function Greetings({ name, mark }: GreetingsProps) {
  return (
    <div>
      Hello, {name} {mark}
    </div>
  );
}

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```

컴포넌트에 만약 있어도 되고 없어도 되는 `props` 가 있다면 `?` 문자를 사용하면 됩니다.

```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
  optional?: string;
};

function Greetings({ name, mark, optional }: GreetingsProps) {
  return (
    <div>
      Hello, {name} {mark}
      {optional && <p>{optional}</p>}
    </div>
  );
}

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```

만약 이 컴포넌트에서 특정 함수를 props 로 받아와야 한다면 다음과 같이 타입을 지정 할 수 있답니다.

#### src/Greetings.tsx
```javascript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
  optional?: string;
  onClick: (name: string) => void; // 아무것도 리턴하지 않는다는 함수를 의미합니다.
};

function Greetings({ name, mark, optional, onClick }: GreetingsProps) {
  const handleClick = () => onClick(name);
  return (
    <div>
      Hello, {name} {mark}
      {optional && <p>{optional}</p>}
      <div>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
}

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```

그러면, App 에서 해당 컴포넌트를 사용해야 할 때 다음과 같이 작성해야겠지요.

#### App.tsx
```javascript
import React from 'react';
import Greetings from './Greetings';

const App: React.FC = () => {
  const onClick = (name: string) => {
    console.log(`${name} says hello`);
  };
  return <Greetings name="Hello" onClick={onClick} />;
};

export default App;
```

이제 `yarn start`를 해서 잘 작동하는지 확인해보세요. 버튼도 눌러보시고 콘솔에 메시지가 잘 출력되는지도 확인해보세요.

![](https://i.imgur.com/kvHMUf2.png)

TypeScript 를 사용하신다면 만약 여러분이 컴포넌트를 렌더링 할 때 필요한 props 를 빠뜨리게 된다면 다음과 같이 에디터에 오류가 나타나게 됩니다.

![](https://i.imgur.com/xXF6lrj.png)

그리고 만약 컴포넌트를 사용하는 과정에서 이 컴포넌트에서 무엇이 필요했더라? 하고 기억이 안날때는 단순히 커서를 컴포넌트 위에 올려보시거나, 컴포넌트의 props 를 설정하는 부분에서 Ctrl + Space 를 눌러보시면 됩니다.

![](https://i.imgur.com/BmfsA3j.png)

이제, 여러분들은 함수형 컴포넌트를 타입스크립트로 작성하는 기본적인 방법을 배우셨습니다.

다음 섹션에서는 상태관리를 하는 방법도 알아보도록 하겠습니다.