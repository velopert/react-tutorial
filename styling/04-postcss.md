## 04. PostCSS

### PostCSS 란?

PostCSS 는 자바스크립트로 만들어진 플러그인을 사용하여 CSS 코드를 변환하는 도구입니다. PostCSS 플러그인들을 사용하여 CSS 코드를 검증 할 수도 있고, 변수, 믹스인 같은 추가 기능을 지원 할 수도 있고, 차기 CSS 문법을 사용 할 수도 있고, [inline-image](https://www.npmjs.com/package/postcss-image-inliner) 및 많은 작업을 할 수 있습니다. [(링크)](https://github.com/postcss/postcss)

Sass, LESS 는 기존 CSS 를 보완하는 "스타일 시트 언어" 인 반면에, PostCSS 는 플러그인들을 사용하여 CSS 코드를 변환을 해주는 "도구" 입니다. JavaScript 로 따지자면 Babel 과 비슷한 도구로 이해해도 무방합니다.

PostCSS 는 주로 [autoprefixer](https://github.com/postcss/autoprefixer) 기능을 위하여 많이 사용합니다. 

autoprefixer 는 CSS 코드가 모든 브라우저에서 정상적으로 보여주도록 앞에 `prefix` 를 자동으로 붙여주는 작업을 대신 해줍니다. 예를 들어서

```css
.sample {
  display: flex;
}
```

이런 코드를 

```css
.sample {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

이렇게 변환해주지요. 이 기능은 postcss 플러그인의 일부일뿐이고 이 외에도 정말 [수많은](https://github.com/postcss/postcss/blob/master/docs/plugins.md) 플러그인들이 있습니다. PostCSS 를 사용하면 기존에 Sass 로 할 수 있던 기능들을 대체 할 수도 있죠.


### Sass 를 쓸까 PostCSS 를 쓸까?

우리가 스타일링의 첫번째 섹션에서 배운 Sass 는 CSS Processor 중에서 가장 인기도 많고, 충분히 편리하기도 합니다.

![](https://2019.stateofcss.com/images/captures/technologies_pre-post-processors_tools-section-overview.png)

[2019 State Of CSS](https://2019.stateofcss.com/technologies/pre-post-processors/) 를 보면 인지도와 관심도는 Sass 가 가장 큰데, 만족도의 경우에는 PostCSS 가 가장 높았습니다.

Sass 는 사실 충분히 사용성이 좋고 편하지만 다음과 같은 사항때문에 PostCSS 를 더 선호하는 사람이 은근히 있습니다.

1. Sass 는 자체적인 CSS 비표준 언어를 CSS 로 변환해주는 도구인 반면, PostCSS 는 미래에 브라우저에 실제로 도입대상인 차기 표준 CSS 를 여러 플러그인을 적용하여 미리 쓸 수 있도록 해주는 도구입니다.
2. Sass 를 사용 할 때 설치하는 node-sass 는 C++ 로 만들어져있고 node-sass 를 설치하는 과정에서 [node-gyp](https://github.com/nodejs/node-gyp) 를 사용하여 컴파일 작업이 진행되는데, 이로 인하여 서버에서 설치 할 때 간혹 패키지 설치가 실패하는 경우가 있습니다. 
3. create-react-app 으로 만든 프로젝트에는 이미 PostCSS 가 설치되어있습니다.

사실 Sass 를 사용 한다고 해서 치명적인 문제가 발생하는 것이긴 아니기 때문에 그냥 사용을 해도 상관은 없지만, Sass 로 할 수 있는것들을 PostCSS 로도 할 수 있기 때문에, 만약에 여러분이 새로운 프로젝트를 진행하는 경우엔 Sass 대신 PostCSS 를 사용 하는 것도 고려해볼만한 가치가 있습니다.

유일한 단점으로는, create-react-app 에서 설정하는 작업이 조금 까다롭다는 점 입니다.

create-react-app 으로 만든 프로젝트의 환경설정은 기본적으로 node_modules 안에 숨겨져있고, 세부 커스터마이징이 불가능합니다. 그 대신에, 리액트 팀에서 CRA 에 설정해둔 최신 설정을 쉽게 쉽게 업데이트 할 수가 있죠. `yarn eject` 명령어를 사용하면 프로젝트 설정을 커스터마이징 할 수는 있지만, 나중에 CRA 버전이 업그레이드 됐을 때 수작업으로 프로젝트 환경설정을 업데이트 해줘야 하기 때문에 번거로워질 수 있습니다 (그 작업이 그렇게 힘들지는 않습니다.)

create-react-app 으로 만든 프로젝트에는 이미 PostCSS 가 설치되어있지만, Sass 처럼 변수, nested css 등을 사용하려면 플러그인을 적용해주어야 하는데 그러려면 `yarn eject` 를 해주어야 합니다. 다행히도, `yarn eject` 를 하지 않고도 커스터마이징 하는 방법이 존재하기는 합니다 (다만 공식적인 방법은 아니지만, 충분히 쓸만합니다.) 우리는 이번 섹션에서는 `yarn eject` 를 하는 대신에, [craco](https://github.com/sharegate/craco)라는 도구를 사용하여 create-react-app 환경 설정을 eject 하지 않으면서 PostCSS 설정을 커스터마이징 하는 방법을 알아보도록 하겠습니다. (craco 말고도 [react-app-rewired](https://github.com/timarney/react-app-rewired) 라는 도구도 있지만, GitHub 레포 메인테이너 본인이 더 이상 사용하지 않게 됨에 따라 커뮤니티에 의하여 유지보수가 되고 있기 때문에 유지보수가 활발하게 되고있지 않습니다)

우선 새로운 프로젝트를 만들어주세요.

```bash
$ npx create-react-app styling-with-postcss
$ cd styling-with-postcss
$ yarn add @craco/craco
```

그 다음, 해당 디렉터리를 에디터로 열은 뒤, 프로젝트의 최상위 디렉터리에 craco.config.js 를 다음과 같이 입력하세요.

#### craco.config.js

```javascript
const { POSTCSS_MODES } = require("@craco/craco");

module.exports = {  
    style: {
        postcss: {
            mode: POSTCSS_MODES.file
        }
    }
};
```

그리고, 최상위 디렉터리에 postcss.config.js 파일도 만들어주세요.

#### postcss.config.js

```javascript
const postcssNormalize = require('postcss-normalize');

module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3,
    }),
    postcssNormalize()
  ]
};
```

이것은 create-react-app 의 자체 PostCSS 설정을 그대로 적은 것 입니다. 여기서 조금 커스터마이징을 해주겠습니다.

#### postcss.config.js
```javascript
const postcssNormalize = require('postcss-normalize');

module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 0
    }),
    postcssNormalize()
  ]
};
```

stage 값을 0 으로 바꿔주었는데요, 이렇게하면 차기 CSS 의 모든 문법들을 사용 할수 있게 됩니다.

이제 package.json 에서 scripts 부분을 다음과 같이 변경해주세요.

```javascript
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
```

이제 프로젝트쪽에서 준비는 다 끝났습니다.

에디터에서 VS Code 를 사용하는 경우 [postcss-sugarss-language](https://marketplace.visualstudio.com/items?itemName=mhmadhamster.postcss-language) 패키지를 설치하세요 (이를 설치하지 않으면 CSS 코드를 작성 할 때 에디터에서 오류가 떴다고 나타날 수 있습니다.)

그리고, App.css 를 열은 다음 에디터 우측 하단의 CSS 를 누른뒤 'css'에 대한 파일 연결 구성 을 PostCSS 로 설정해주세요.

![](https://i.imgur.com/SSM2MC1.png)

에디터에서 PostCSS 를 사용할 준비도 끝났습니다. 한번 간단한 CSS 코드를 작성해볼까요?

#### App.css

```css
/* 변수 선언 */
:root {
  --bg-color: black;
  --font-color: white;
}

.App {
  /* 변수 사용 */
  background: var(--bg-color);
  color: var(--font-color);

  padding: 1rem;

  /* nesting rules */
  &:hover {
    opacity: 0.8;
  }

  & .circle {
    --size: 32px;
    background: green;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
  }
}

```

App.js 도 다음과 같이 수정 후 `yarn start` 를 해보세요.
#### App.js
```javascript
import React from 'react';
import './App.css';

function App() {
  return <div className="App">Hey there</div>;
}

export default App;
```