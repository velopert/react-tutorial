## 6. 리덕스 개발자도구 적용하기

이번에는 리덕스 개발자 도구를 사용하는 방법에 대해서 알아보겠습니다.


![](https://i.imgur.com/bw9MfbA.png)

리덕스 개발자 도구를 사용하면 현재 스토어의 상태를 개발자 도구에서 조회 할 수 있고 지금까지 어떤 액션들이 디스패치 되었는지, 그리고 액션에 따라 상태가 어떻게 변화했는지 확인 할 수 있습니다. 추가적으로, 액션을 직접 디스패치 할 수도 있답니다.

우선 [크롬 웹 스토어](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) 에서 확장 프로그램을 설치해주세요. (참고로 [파이어폭스](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)에서도 사용 가능합니다.)

그 다음에는 프로젝트에 [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension)을 설치하세요.

```
$ yarn add redux-devtools-extension
```

그 다음에는 index.js를 다음과 같이 수정하시면 적용이 끝납니다.

#### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import { composeWithDevTools } from 'redux-devtools-extension'; // 리덕스 개발자 도구

const store = createStore(rootReducer, composeWithDevTools()); // 스토어를 만듭니다.
// composeWithDevTools 를 사용하여 리덕스 개발자 도구 활성화

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


serviceWorker.unregister();
```

이제 크롬 개발자 도구를 열어서 Redux 탭을 열어보세요. 현재 상태와 액션 기록들이 잘 보이나요?