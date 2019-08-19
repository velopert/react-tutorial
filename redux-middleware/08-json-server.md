## 8. json-server

프런트엔드 개발 연습을 하게 될 때마다 연습을 하는 것 분인데 직접 백엔드 개발을 하는것은 조금 귀찮습니다. 특히나 아직 백엔드쪽 지식이 없다면 더욱 힘들죠.

우리는 연습을 위해서 프런트엔드 프로젝트에서 실무와 비슷한 느낌으로 하기 위하여 가짜 API 서버를 만들어볼건데요, 이 때 사용되는 도구가 json-server 입니다. 이 도구를 사용하면 json 파일 하나만 있으면 연습용 서버를 쉽게 구성 할 수 있습니다.

참고로 이 도구는 프로덕션에서 사용하기위하여 만들어진것이 아니기 때문에 이 서버를 사용하여 실제 프로젝트를 개발 하시면 안됩니다. 실제 프로젝트 개발 할 때에는 백엔드쪽 공부를 하셔서 서버를 직접 준비하시거나 [Firebase](http://firebase.google.com) 를 사용해서 구현을 하셔야합니다.

### 가짜 API 서버 열기

먼저 프로젝트 디렉터리에 (src 디렉터리 밖에) data.json 이라는 파일을 다음과 같이 작성하세요.

#### data.json

```json
{
  "posts": [
    {
      "id": 1,
      "title": "리덕스 미들웨어를 배워봅시다",
      "body": "리덕스 미들웨어를 직접 만들어보면 이해하기 쉽죠."
    },
    {
      "id": 2,
      "title": "redux-thunk를 사용해봅시다",
      "body": "redux-thunk를 사용해서 비동기 작업을 처리해봅시다!"
    },
    {
      "id": 3,
      "title": "redux-saga도 사용해봅시다",
      "body": "나중엔 redux-saga를 사용해서 비동기 작업을 처리하는 방법도 배워볼 거예요."
    }
  ]
}
```

이 파일을 기반으로 서버를 열어보겠습니다.

```bash
$ npx json-server ./data.json --port 4000
```

또는 json-server 를 글로벌로 설치해서 다음과 같이 사용 할 수도 있습니다.

```bash
$ yarn global add json-server
$ json-server ./data.json --port 4000
```

만약 yarn 을 통한 글로벌 설치가 잘 작동하지 않는다면 https://yarnpkg.com/en/docs/install 페이지의 Path setup 부분을 참고해보세요 (윈도우의 경우 yarn 삭제 후 재설치를 하면 해결 될 수 있습니다). 또는 `npm install -g json-server` 를 해보셔도 됩니다.


json-server 를 실행하시면 터미널에 다음과 같이 결과물이 뜹니다.

```javascript
  \{^_^}/ hi!

  Loading ./data.json
  Done

  Resources
  http://localhost:4000/posts

  Home
  http://localhost:4000
```

그러면 우리의 가짜 API 서버가 4000 포트로 열립니다. 한번 다음 링크에 들어가보세요.

- http://localhost:4000/posts
- http://localhost:4000/posts/1

각각 데이터가 잘 조회되나요?

![](https://i.imgur.com/oRpNjJ4.png)
![](https://i.imgur.com/NvlxE4U.png)

서버가 모두 준비 완료 되었습니다. 이제 기존 가짜 API 함수들이 실제 API 를 요청하게끔 구현을 해보겠습니다.

### axios 를 사용하여 API 요청하기

우선 프로젝트에 REST API Client인 axios를 설치해주세요.

```bash
$ yarn add axios
```

그리고, api/posts.js 파일을 실제 API 요청을 하도록 수정해주겠습니다.

#### api/posts.js
```javascript
import axios from 'axios';

export const getPosts = async () => {
  const response = await axios.get('http://localhost:4000/posts');
  return response.data;
};

export const getPostById = async id => {
  const response = await axios.get(`http://localhost:4000/posts/${id}`);
  return response.data;
};
```

이제 브라우저를 확인해보세요. 기존과 동일하게 작동하나요?

![](https://i.imgur.com/YqjJ0qW.gif)

