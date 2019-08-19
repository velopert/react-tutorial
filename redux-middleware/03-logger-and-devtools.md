## 3. redux-logger 사용 및 미들웨어와 DevTools 함께 사용하기

이번에는 redux-logger 를 설치해서 적용을 해보고, 또 Redux DevTools 와 리덕스 미들웨어를 함께 사용해야 할 때에는 어떻게 해야하는지 배워보겠습니다.

### redux-logger 사용하기

우선 [redux-logger](https://github.com/LogRocket/redux-logger) 를 설치해주세요.

```bash
$ yarn add redux-logger
```

그 다음에 index.js 에서 불러와서 적용을 해보겠습니다. 리덕스에 미들웨어를 적용 할 때에는 다음과 같이 여러개의 미들웨어를 등록 할 수 있답니다.

#### index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import myLogger from './middlewares/myLogger';
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(myLogger, logger)); // 여러개의 미들웨어를 적용 할 수 있습니다.

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

이제, 결과를 확인해볼까요? 버튼을 클릭하고 콘솔을 확인해보세요.

![](https://i.imgur.com/eFhKgv0.png)

이제 리덕스 관련 정보들이 예쁘게 콘솔에 출력됐지요? 그럼 이제 우리가 만든 myLogger는 비활성화 해주세요. 불필요합니다.


#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(logger)); // 여러개의 미들웨어를 적용 할 수 있습니다.

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

![](https://i.imgur.com/M9CCIyp.png)

비활성화 하고 나면 위와 같이 redux-logger 쪽에서만 출력이 될 것입니다.

### Redux DevTools 사용하기
만약 Redux DevTools 를 미들웨어와 함께 사용해야 한다면 어떻게 코드를 작성해야하는지 알아봅시다.

[매뉴얼 상의 사용법](https://www.npmjs.com/package/redux-devtools-extension#usage)은 다음과 같습니다.

```javascript
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
 
const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```

그럼 이에 맞춰 우리 index.js 를 수정해볼까요? 그 전에 우선 redux-devtools-extension 을 설치해주세요.

```bash
$ yarn add redux-devtools-extension
```

다음, index.js 를 수정해보세요.

#### index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
); // 여러개의 미들웨어를 적용 할 수 있습니다.

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


serviceWorker.unregister();
```

이제 Redux DevTool이 잘 작동하는지 확인해보세요.

![](https://i.imgur.com/XPvce3i.png)