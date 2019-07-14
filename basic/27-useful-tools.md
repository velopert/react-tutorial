## 27. 리액트 개발 할 때 사용하면 편리한 도구들 - Prettier, ESLint, Snippet

이번에는 리액트 개발을 할 때 사용하면 편리한 도구들에 대하여 알아보도록 하겠습니다. 이번에 다루게 되는 도구들은 모두 VS Code 와 연동해서 사용하는 도구들인데요, 이 도구들은 VS Code 만 지원 하는 것이 아니라 WebStorm, Atom 등의 에디터에서도 사용이 가능하니, 만약 VS Code 가 아닌 에디터를 사용하고 계신 경우 따로 검색해서 적용해보시길 바랍니다.

### Prettier

[Prettier](https://prettier.io/) 는 자동으로 코드의 스타일을 관리해주는 도구입니다. 가령, 문자열을 사용 할 때 ' 를 쓸지 " 를 쓸지, 또는 세미콜론 (;) 를 코드 뒤에 붙일지 말지, 들여쓰기는 얼마나 할지, 이런 것들을 관리해줄 수 있습니다. 이 도구는 CLI 를 통해 명령어를 입력하여 사용 할 수도 있고, 다양한 에디터와 연동해서 사용 할 수도 있습니다.

![](https://i.imgur.com/ePTIDs2.png)

이 도구의 특징은, 코드의 스타일을 여러분의 마음대로 쉽게 커스터마이징 할 수 있다는 점입니다.

![](https://i.imgur.com/UTLbYtM.png)

이 도구는 자바스크립트 뿐만 아니라, HTML, CSS 코드의 코드 스타일을 관리 할 수도 있고, React, Angular, Vue 등의 라이브러리도 지원 해주고 플러그인을 통하여 다른 언어도 관리해줄 수 있습니다.

가장 기본적인 사용 방법은 [명령어](https://prettier.io/docs/en/cli.html)를 사용하여 쓰는 것이고, [Git을 통해 commit](https://prettier.io/docs/en/precommit.html#option-2-pretty-quick-https-githubcom-azz-pretty-quick) 할 때마다 자동으로 실행되도록 설정을 해줄 수도 있습니다.

제가 권장드리는 방법은 에디터와 연동해서 사용하는 것 입니다 (정말 편합니다!).

적용방법은 굉장히 간단한데요, 일단 CRA 를 사용하여 새 프로젝트를 만들어봅시다.

```
$ npx create-react-app useful-tools
```

그리고 해당 디렉터리를 에디터로 열어주세요.

그리고 루트 디렉터리 (최상위 디렉터리)에 .prettierrc 파일을 만드세요.

#### .prettierrc

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

이는 Prettier 의 기본 설정인데요 [여기](https://prettier.io/docs/en/configuration.html)에서 확인 할 수도 있습니다.

위 설정에 대해서 설명을 드리자면

**trailingComma**: `"none"`, `"es5"`, `"all"` 으로 설정을 할 수 있는데, 객체 또는 배열이 여러줄로 구성되어 있으면 다음과 같이 맨 마지막 줄에 쉼표를 붙여줍니다.

```javascript
const object = {
  a: 1,
  b: 2,
};
```

`"none"` 이면 쉼표를 붙이지 않고, `"es5"` 이면 객체, 배열을 사용하게 될 떄 쉼표를 붙이고, `"all"` 이면 함수를 사용 할 때 인자를 전달 할 때도 쉼표를 붙입니다.

**tabWidth**: 들여쓰기의 크기를 정합니다. 저는 개인적으로 2칸을 선호합니다. 여러분이 4칸이 좋다면 4로 설정을 하셔도 됩니다.

**semi**: 세미콜론 (;) 을 쓸지 말지 정합니다. 저는 개인적으로 사용하는것을 선호합니다. 사용하고 싶다면 `true` 로 설정하세요.

**singleQuote**: 문자열을 입력 할 때 `"` 를 쓸지 `'` 를 쓸지 정합니다. 저는 `'` 를 사용하는것을 선호합니다. 만약에 `"` 만 쓰고 싶다면 `false` 로 설정하세요.

이 외에도 다른 옵션들이 많은데 [여기](https://prettier.io/docs/en/options.html)서 참고 할 수 있습니다.

참고로 저는 앞으로 이 설정으로 사용을 합니다:

#### .prettierrc
```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

파일을 만드셨으면, 에디터에서 Prettier 익스텐션을 설치하세요.

![](https://i.imgur.com/5GYe5oQ.png)

그 다음에는 `⌘ + ,` (윈도우/리눅스에서는 `Ctrl + ,`) 키를 눌러서 VS Code 환경 설정을 열은 뒤 Format On Save 검색 후 를 체크하시면 앞으로 저장 할 때마다 설정한 코딩 스타일에 따라 자동으로 코드가 변형됩니다.

![](https://i.imgur.com/eQU17oa.png)

만약에 저장 할 때 마다 코드를 변형하지 않고 수동으로 해주고 싶다면 `F1` 키 또는 `⌘ + ⇧ + P` (윈도우는 `Ctrl + Shift + P`) 를 눌러서 Format Document 를 입력해보세요. 그러면 이 명령을 위한 단축키도 나타날 것입니다.

![](https://i.imgur.com/zRT586X.png)


설정이 끝났다면 App.js 를 열어서 코드를 다음과 같이 수정해보시고 저장을 해보세요.


#### App.js

```javascript
import React from 'react';
import './App.css';

function App() {
  const a = "hello"

              return (
    <div>
                      <p>와우</p>
    </div>
          );
}

export default App;
```

이렇게 코드를 엉망진창으로 작성하고 저장을 하면 다음과 같이 자동으로 코드의 스타일이 우리가 .prettierrc 에서 지정한대로 고쳐집니다.

```javascript
import React from 'react';
import './App.css';

function App() {
  const a = 'hello';

  return (
    <div>
      <p>와우</p>
    </div>
  );
}

export default App;
```


### ESLint

ESLint 는 자바스크립트의 문법을 확인해주는 도구입니다. CRA 로 만든 프로젝트에는 이미 적용이 되어있어서 만약에 우리가 자바스크립트 실수를 하게 되면 터미널에 오류 또는 경고가 나타나게 되죠. 예를 들어서 아까 수정한 코드처럼 `a` 라는 값을 선언 후 사용하지 않으면, 터미널에서 다음과 같은 결과물이 나타나게 됩니다.

```
Compiled with warnings.

./src/App.js
  Line 5:  'a' is assigned a value but never used  no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.
```


이번에는 ESLint 의 VS Code 익스텐션을 설치해보세요.

![](https://i.imgur.com/3VvqRv4.png)

이를 설치하고 나면 터미널에서만 보이던 경고가 에디터상에서도 보이게 됩니다.

![](https://i.imgur.com/M9QdSb7.png)

하단의 경고 정보는 에디터 가장 아래에 있는 경고 아이콘을 누르면 볼 수 있습니다.

VS Code 와의 연동은 우리가 `useEffect` 같은 Hook 을 사용 할 때 사용하면 굉장히 유용한데요, 한번 다음 코드를 작성해보세요.

#### App.js
```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState('');
  useEffect(() => {
    console.log(value);
  }, []);

  return (
    <div>
      <p>와우</p>
    </div>
  );
}

export default App;
```


![](https://i.imgur.com/WmpTISF.png)

`useEffect` 에 등록한 함수에서 `value` 상태를 참조하는데, `deps` 배열에 이를 빠뜨리게 되면 이렇게 경고가 나타납니다. 여기서 초록색 줄에 마우스를 올리고 "빠른 수정" 을 눌러서 "Fix this ..."  메뉴를 누르게 되면 자동으로 `deps` 에 우리가 넣어야 하는 값이 포함됩니다.

![](https://i.imgur.com/XgXjwtW.png)

이런 작업을 코드를 저장 할 때 자동으로 처리되도록 할 수 도있는데요,  `⌘ + ,` (윈도우/리눅스에서는 `Ctrl + ,`) 키를 눌러서 VS Code 환경 설정을 열은 뒤, Auto Fix on Save 를 검색해서 이를 체크하세요. 그러면, 앞으로 ESLint 가 자동으로 고칠 수 있는 것들은 저장을 할 때 자동으로 고쳐줍니다.

![](https://i.imgur.com/9N2K9cY.png)


### ESLint 까다로운 규칙 적용

ESLint 에는 정말 다양한 규칙들이 있습니다. 지금은 기본적인 규칙들만 적용된 상태인데요, 다양한 ESLint 설정이 되어있는 묶어서 라이브러리로 제공이 되기도 합니다.

- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-config-google](https://www.npmjs.com/package/eslint-config-google)
- [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard)

저의 경우에는 이전엔 eslint-config-airbnb 를 사용했었는데, 요즘은 기본 설정 외의 다른 설정은 적용하지 않고 코드를 작성하고 있습니다.

참고로 위 규칙들을 적용하게 되면 좀 까다로운 면이 은근히 많습니다. 한번, 이번에 eslint-config-airbnb 를 적용해보겠습니다.

우선 설치를 해주세요.

```bash
$ yarn add eslint-config-airbnb
```

그 다음에 packge.json 파일을 열어서 "eslintConfig" 부분을 변경해보세요.

#### package.json
```javascript
  "eslintConfig": {
    "extends": [
      "react-app",
      "airbnb"
    ]
  },
```

저장하고 나면 App.js 에서 여기저기서 빨간줄이 나타나기 시작합니다.

![](https://i.imgur.com/N8D1dLC.png)


만약에 ESLint 추가 설정을 하게 되는 경우에는 `eslint-config-prettier` 라는 것도 적용을 하셔야 하는데요, 이를 적옹해야 Prettier 에서 관리하는 스타일이 ESLint 에서 비활성화 됩니다.

```
$ yarn add eslint-config-prettier
```

package.json 도 수정해주세요.

#### package.json

```javascript
  "eslintConfig": {
    "extends": [
      "react-app",
      "airbnb",
      "prettier"
    ]
  },
```

이번에는, 규칙을 비활성화 하는 방법을 알아보도록 하겠습니다.

App.js 을 열으면 빨간줄이 나타나는 곳이 있을텐데요, 예를 들어서 JSX 쪽에 나타나는 빨간줄에 커서를 올려보면 다음과 같이 규칙 이름이 나타나게 될텐데

![](https://i.imgur.com/H2CD64p.png)

현재 위 규칙은 "react/jsx-filename-extension" 이라는 이름을 가진 규칙인데요, 리액트 관련 파일은 .jsx 확장자로 설정해야 한다는 규칙입니다. 이를 비활성화 하고 싶다면 다음과 같이 package.json 에서 `"rules"` 값을 설정하면 됩니다.

#### package.json
```javascript
  "eslintConfig": {
    "extends": [
      "react-app",
      "airbnb",
      "prettier"
    ],
    "rules": {
      "react/jsx-filename-extension": 0
    }
  },
```

값을 0으로 설정해주면 규칙이 비활성화 됩니다.

![](https://i.imgur.com/vj3u4DR.png)

사용되지 않는 값의 경우에도 "no-unused-vars" 라는 이름으로 빨간줄이 그어지고 있는데, 만약에 이를 오류까지는 아니고 경고 수준으로만 간주하고 싶다면 위 규칙에 대하여 값을 1로 설정해주면 됩니다.

#### package.json
```javascript
  "eslintConfig": {
    "extends": [
      "react-app",
      "airbnb",
      "prettier"
    ],
    "rules": {
      "react/jsx-filename-extension": 0,
      "no-unused-vars": 1
    }
  },
```

그러면 이렇게 초록색 줄만 나타나게 되지요.

![](https://i.imgur.com/MihUsKQ.png)

ESLint 에 airbnb / standard / google 같은 설정을 적용하게 되면 굉장히 까다롭기 때문에, 여럿이서 협업하는 프로젝트가 아니라면, 저는 개인적으로 Prettier 와 ESLint 의 기본 설정만 적용하고 개발을 진행하는 것을 추천드립니다.


### Snippet

Snippet 은 도구라기보단, 에디터마다 내장되어있는 기능입니다. 한국어로는 "코드 조각" 이라고도 부르는데요, Snippet 의 용도는 자주 사용되는 코드에 대하여 단축어를 만들어서 코드를 빠르게 생성해내는 것 입니다.

VS Code 의 확장 마켓플레이스에서 React Snippet 이라고 검색해봐도 다양한 확장 프로그램들이 나오는데요, 저는 그런 확장 프로그램을 쓰는 것 보다 직접 만들어서 사용하는 것을 선호합니다. 왜냐하면 확장 프로그램을 통해서 스니펫을 사용하게 되면 실제로 사용하지 않는 스니펫들도 있고 마음에 들지 않는 단축어일때도 있기 때문이죠.

우선, 여러분들이 우선적으로 해야 할 것은 VS Code 에서 .js 확장자에 대하여 언어 모드를 JavaScript React 로 설정하는 것 입니다. 기본 설정으로는 일반 JavaScript 로 되어있는데 이를 JavaScript React 로 바꿔주세요.

![](https://i.imgur.com/0Zdnhoz.gif)

그 다음에는, 여러분이 만들고 싶은 스니펫을 위한 샘플 코드를 생성하세요. src 디렉터리에 Sample.js 파일을 만들어서 다음 코드를 작성해보세요.


#### Sample.js
```javascript
import React from 'react';

function Sample() {
  return (
    <div>
      Hello React!
    </div>
  );
}

export default Sample;
```

정말 간단한 함수형 컴포넌트이죠? 이를 스니펫으로 만들어보겠습니다. 우선, Sample 이라는 키워드가 있는 곳에 파일 이름이 들어가게 하고 싶기 때문에 Sample 을 `${TM_FILENAME_BASE}` 로 바꿔주세요. 이 값은 스니펫에서 사용 할 수 있는 변수인데 [여기](https://code.visualstudio.com/docs/editor/userdefinedsnippets) 에서 자세한 내용을 볼 수 있습니다.


```javascript
import React from 'react';

function ${TM_FILENAME_BASE}() {
  return (
    <div>
      Hello React!
    </div>
  );
}

export default ${TM_FILENAME_BASE};
```

그 다음, Hello React 부분을 ${1} 이라고 작성해주세요. 이 부분이 나중에 스니펫을 통해 코드를 생성하게 됐을 때 텍스트 커서가 맨 처음 위치할 곳입니다.

```javascript
import React from 'react';

function ${TM_FILENAME_BASE}() {
  return (
    <div>
      ${1}
    </div>
  );
}

export default ${TM_FILENAME_BASE};
```

그 다음에 이 코드를 복사해서 [Snippet Generator](https://snippet-generator.app/) 웹서비스를 열어서 좌측 코드 에디터에 붙여넣으세요.

![](https://i.imgur.com/1u23TG2.png)

상단에 Description 과 Tab Trigger 라는 입력창이 있는데, Description 에는 설명을, Tab Trigger 에는 단축어를 넣으시면 됩니다. 저는 **f**unctional **c**omponent 라는 의미로, fc 라고 넣었습니다. 또는, react functional component 라는 의미로 rfc 라고 입력을 해도 됩니다. 여러분의 마음대로 설정하세요.

그럼 우측에 코드 스니펫 코드가 생성되는데, 이를 복사하세요.

그 다음에는 VS Code 에서 `F1` 키 또는 `⌘ + ⇧ + P` (윈도우는 `Ctrl + Shift + P`) 를 누르고 Configure Snippet 을 검색하세요.

![](https://i.imgur.com/0IIpxrK.png)

그리고 javascriptreact.json 을 선택하면 snippet 을 위한 json 파일이 열리는데 거기에 방금 복사한 내용을 붙여넣으면 됩니다.

![](https://i.imgur.com/KlxNu4T.png)

```javascript
{
  "Functional Component": {
    "prefix": "fc",
    "body": [
      "import React from 'react';",
      "",
      "function ${TM_FILENAME_BASE}() {",
      "  return (",
      "    <div>",
      "      ${1}",
      "    </div>",
      "  );",
      "}",
      "",
      "export default ${TM_FILENAME_BASE};"
    ],
    "description": "Functional Component"
  }
}
```

이제 다시 Sample.js 파일을 열어서 모든 코드를 지운 후 fc 라고 입력 후 엔터를 눌러보세요.

![](https://i.imgur.com/Kr63aw6.png)

그러면 다음과 같이 자동으로 코드가 생성됩니다.

![](https://i.imgur.com/U1JtK95.png)

여러분이 앞으로 리액트 개발을 하면서 자주 사용되는 코드가 있다면 이렇게 스니펫을 만들어서 관리를 하게 된다면 개발 생산성을 높여줄 수 있을 것 입니다. 여러분의 마음대로 만들어서 사용할 수 있다는 점 때문에 직접 만들어서 사용 하는 것을 추천드리지만, 하나 하나 만들어서 사용하는게 귀찮다고 느껴지신다면 맘에드는 Snippet 확장 프로그램을 찾아서 사용해보는 것도 나쁘지는 않습니다.

