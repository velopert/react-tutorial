## 25. LifeCycle Method

LifeCycle Method 는 한국어로 "생명주기 메서드" 라고 부릅니다. 생명주기 메서드는 컴포넌트가 브라우저상에 나타나고, 업데이트되고, 사라지게 될 때 호출되는 메서드들 입니다. 추가적으로 컴포넌트에서 에러가 났을 때 호출되는 메서드도 있습니다.

생명주기 메서드는 클래스형 컴포넌트에서만 사용 할 수 있는데요, 우리가 기존에 배웠었던 `useEffect` 랑 은근히 비슷하다고 생각하시면 됩니다. (물론 작동방식은 많이 다릅니다. 커버하지 않는 기능들도 있습니다.)

리액트를 배우시게 될 때, 이 개념에 대하여 너무 많이 시간을 쏟지 않는 것을 권장드립니다. 앞으로 사용 할 일이 별로 없을 것입니다. 다만 어떤것들이 있는지만 알아두고, 나중에 사용 해야 할 일이 있다면 [매뉴얼](https://ko.reactjs.org/docs/react-component.html) 을 보고 사용 할 수 있는 정도만 학습해놓으면 됩니다.

이번 장에서는 따로 코드 작성은 하지 않고 이미 작성된 코드를 보면서 하나 하나 설명을 드리도록 하겠습니다.

[![Edit currying-bash-mrkjb](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/currying-bash-mrkjb?fontsize=14)

위 코드 샌드박스를 열어주세요.

![](https://i.imgur.com/vo44mLV.gif)

위 프로젝트에서는 총 3가지 버튼이 있습니다.

- "랜덤 색상" 버튼을 누르면 숫자의 색상이 바뀝니다.
- "토글" 버튼을 누르면 컴포넌트가 사라지거나 나타납니다.
- "더하기" 버튼을 누르면 숫자가 1씩 더해집니다.

이렇게 변화가 발생 할 때마다 생명주기 메서드들을 호출하게 되는데요, 이에 대하여 알아봅시다.

![](https://i.imgur.com/cNfpEph.png)

출처: http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

### 마운트

먼저 마운트될 때 발생하는 생명주기들을 알아봅시다.

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

#### constructor

`constructor` 는 컴포넌트의 생성자 메서드입니다. 컴포넌트가 만들어지면 가장 먼저 실행되는 메서드입니다.

```javascript
  constructor(props) {
    super(props);
    console.log("constructor");
  }
```

#### getDerivedStateFromProps

`getDerivedStateFromProps` 는 `props` 로 받아온 것을 `state` 에 넣어주고 싶을 때 사용합니다.

```javascript
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps");
    if (nextProps.color !== prevState.color) {
      return { color: nextProps.color };
    }
    return null;
  }
```

다른 생명주기 메서드와는 달리 앞에 `static` 을 필요로 하고, 이 안에서는 `this` 롤 조회 할 수 없습니다. 여기서 특정 객체를 반환하게 되면 해당 객체 안에 있는 내용들이 컴포넌트의 `state` 로 설정이 됩니다. 반면 `null` 을 반환하게 되면 아무 일도 발생하지 않습니다.

참고로 이 메서드는 컴포넌트가 처음 렌더링 되기 전에도 호출 되고, 그 이후 리렌더링 되기 전에도 매번 실행됩니다.

#### render

컴포넌트를 렌더링하는 메서드입니다. 이미 익숙하죠? :)

#### componentDidMount

컴포넌트의 첫번째 렌더링이 마치고 나면 호출되는 메서드입니다. 이 메서드가 호출되는 시점에는 우리가 만든 컴포넌트가 화면에 나타난 상태입니다. 여기선 주로 D3, masonry 처럼 DOM 을 사용해야하는 외부 라이브러리 연동을 하거나, 해당 컴포넌트에서 필요로하는 데이터를 요청하기 위해 axios, fetch 등을 통하여 ajax 요청을 하거나, DOM 의 속성을 읽거나 직접 변경하는 작업을 진행합니다.

### 업데이트

이번에는 컴포넌트가 업데이트 되는 시점에 어떤 생명주기 메서드들이 호출되는지 알아봅시다.

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

#### getDerivedStateFromProps

아까전에 이미 다뤘던 메서드이지요? 컴포넌트의 props 나 state 가 바뀌었을때도 이 메서드가 호출됩니다. 잘 알아두세요!

#### shouldComponentUpdate

`shouldComponentUpdate` 메서드는 컴포넌트가 리렌더링 할지 말지를 결정하는 메서드입니다.

```javascript
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate", nextProps, nextState);
    // 숫자의 마지막 자리가 4면 리렌더링하지 않습니다
    return nextState.number % 10 !== 4;
  }
```

주로 최적화 할 때 사용하는 메서드입니다. 우리가 이전에 `React.memo` 를 배웠었지요? 그 역할과 비슷하다고 이해하시면 됩니다.

#### render

이미 알고있는 메서드지요? 생략하겠습니다!

#### getSnapshotBeforeUpdate

`getSnapshotBeforeUpdate` 는 컴포넌트에 변화가 일어나기 직전의 DOM 상태를 가져와서 특정 값을 반환하면 그 다음 발생하게 되는 `componentDidUpdate` 함수에서 받아와서 사용을 할 수 있습니다.

```javascript
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate");
    if (prevProps.color !== this.props.color) {
      return this.myRef.style.color;
    }
    return null;
  }
```

#### componentDidUpdate

`componentDidUpdate` 는 리렌더링이 마치고, 화면에 우리가 원하는 변화가 모두 반영되고 난 뒤 호출되는 메서드입니다. 3번째 파라미터로 `getSnapshotBeforeUpdate` 에서 반환한 값을 조회 할 수 있습니다.

```javascript
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate", prevProps, prevState);
    if (snapshot) {
      console.log("업데이트 되기 직전 색상: ", snapshot);
    }
  }
```

`getSnapshotBeforeUpdate` 의 실제 사용사례는 다음 링크에서 확인 할 수 있는데요,

[![Edit getSnapshotBeforeUpdate 예제](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/getsnapshotbeforeupdate-yeje-vpmle?fontsize=14)

```javascript
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // DOM 업데이트가 일어나기 직전의 시점입니다.
    // 새 데이터가 상단에 추가되어도 스크롤바를 유지해보겠습니다.
    // scrollHeight 는 전 후를 비교해서 스크롤 위치를 설정하기 위함이고,
    // scrollTop 은, 이 기능이 크롬에 이미 구현이 되어있는데,
    // 이미 구현이 되어있다면 처리하지 않도록 하기 위함입니다.
    if (prevState.array !== this.state.array) {
      const { scrollTop, scrollHeight } = this.list;

      // 여기서 반환 하는 값은 componentDidMount 에서 snapshot 값으로 받아올 수 있습니다.
      return {
        scrollTop,
        scrollHeight
      };
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      const { scrollTop } = this.list;
      if (scrollTop !== snapshot.scrollTop) return; // 기능이 이미 구현되어있다면 처리하지 않습니다.
      const diff = this.list.scrollHeight - snapshot.scrollHeight;
      this.list.scrollTop += diff;
    }
  }
```

Chrome 브라우저에서는 브라우저 자체적으로 이미 구현되어있는 기능중에 하나인데, 새로운 내용이 추가되었을 때 사용자의 스크롤 위치를 유지시키는 기능입니다. Safari 브라우저를 포함한 일부 브라우저는 이 기능이 구현되어있지 않아서 다음과 같이 작동하게 됩니다.

![](https://i.imgur.com/1POUOrQ.gif)

새로운 항목이 위에서 추가가 되면 사용자가 보는 구간이 한칸씩 계속 밀리게 되지요? `getSnapshotBeforeUpdate` 를 활용하면 다음과 같이 유지를 할 수 있습니다.

![](https://i.imgur.com/gS01iZ9.gif)

`getSnapshotBeforeUpdate` 는 사실 사용되는 일이 그렇게 많지 않습니다. 그냥 이런게 있다.. 정도만 알아두시면 충분합니다.

참고로 함수형 컴포넌트 + Hooks 를 사용 할 때에는 이 `getSnapshotBeforeUpdate` 를 대체 할 수 있는 기능이 아직 없습니다. DOM 에 변화가 반영되기 직전에 DOM 의 속성을 확인하고 싶을 때 이 생명주기 메서드를 사용하면 된다는 것을 알아두세요.

### 언마운트

언마운트라는것은, 컴포넌트가 화면에서 사라지는것을 의미합니다. 언마운트에 관련된 생명주기 메서드는 `componentWillUnmount` 하나입니다.

#### componentWillUnmount

`componentWillUnmount` 는 컴포넌트가 화면에서 사라지기 직전에 호출됩니다.

```javascript
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
```

여기서는 주로 DOM에 직접 등록했었던 이벤트를 제거하고, 만약에 `setTimeout` 을 걸은것이 있다면 `clearTimeout` 을 통하여 제거를 합니다. 추가적으로, 외부 라이브러리를 사용한게 있고 해당 라이브러리에 dispose 기능이 있다면 여기서 호출해주시면 됩니다.

## 정리

강의 초반에 봤던 이미지를 다시 한번 보면서 복습해봅시다.

![](https://i.imgur.com/cNfpEph.png)

출처: http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

이전에 언급했듯이, 클래스형 컴포넌트를 쓰게 되는 일은 앞으로 많지 않을 것이므로, 그냥 이런게 있다 정도만 알아두시면 됩니다.

아직 다루지 않은 생명주기 메서드 중에서 `componentDidCatch` 라는 것도 있는데요, 이에 대해서는 다음 섹션에서 알아보도록 하겠습니다.
