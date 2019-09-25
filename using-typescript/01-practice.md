## 01. 타입스크립트 연습

타입스크립트에서 가장 기본적인 것들을 연습해보겠습니다.

먼저 새로운 자바스크립트 프로젝트를 생성해보겠습니다. 

터미널에서 다음 명령어들을 입력하세요.

```bash
$ mkdir ts-practice # ts-practice 라는 디렉터리 생성
$ cd ts-practice # 해당 디렉터리로 이동
$ yarn init -y # 또는 npm init -y
```

이렇게 하면 ts-practice 디렉터리에 package.json 이라는 파일이 만들어집니다.

### 타입스크립트 설정파일 생성하기

이제 타입스크립트 설정파일 tsconfig.json 을 프로젝트 디렉터리 안에 생성해주겠습니다. 

이 파일을 생성 할 땐 직접 입력해서 만들 수도 있습니다.

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

하지만 일반적으로는 명령어를 사용해서 생성합니다.

먼저 typescript 를 글로벌로 설치해주세요.

```bash
$ yarn global add typescript
```

그리고 프로젝트 디렉터리 안에서 `tsc --init` 명령어를 입력하면 tsconfig.json 파일이 자동생성됩니다.

> 만약 명령어가 작동하지 않는다면 `npm install -g typescript` 를 해보시고 다시 명령어를 실행해보세요.

이 파일에서는 타입스크립트가 컴파일 될 때 필요한 옵션을 지정하는데요, `tsc --init` 명령어를 통해서 기본적으로 설정되어있는 것들이 어떤 의미를 갖고 있는지 한번 알아봅시다.

- **target**: 컴파일된 코드가 어떤 환경에서 실행될 지 정의합니다. 예를들어서 화살표 함수를 사용하고 target 을 es5 로 한다면 일반 function 키워드를 사용하는 함수로 변환을 해줍니다. 하지만 이를 es6 로 설정한다면 화살표 함수를 그대로 유지해줍니다.
- **module**: 컴파일된 코드가 어던 모듈 시스템을 사용할지 정의합니다. 예를 들어서 이 값을 common 으로 하면 `export default Sample` 을 하게 됐을 때 컴파일 된 코드에서는 `exports.default = helloWorld` 로 변환해주지만 이 값을 es2015 로 하면 `export default Sample` 을 그대로 유지하게 됩니다.
- **strict**: 모든 타입 체킹 옵션을 활성화한다는 것을 의미합니다.
- **esModuleInterop**: commonjs 모듈 형태로 이루어진 파일을 es2015 모듈 형태로 불러올 수 있게 해줍니다. [(참고)](https://stackoverflow.com/questions/56238356/understanding-esmoduleinterop-in-tsconfig-file)

현재 기본적으로 만들어진 설정에서 한가지 속성을 추가해봅시다. `outDir` 이라는 속성인데요, 이를 설정하면 컴파일된 파일들이 저장되는 경로를 지정 할 수 있습니다.

#### tsconfig.json
```javascript
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```

### 타입스크립트 파일 만들기

프로젝트에 src 디렉터리를 만들고, 그 안에 practice.ts 라는 파일을 만들어보세요.

#### src/practice.ts
```javascript
const message: string = 'hello world';
console.log(message);
```

타입스크립트는 이렇게 `*.ts` 확장자를 사용합니다. message 값이 선언된 코드를 보시면 `: string` 이라는 코드를 넣었지요? 이는 해당 상수 값이 문자열 이라는 것을 명시해줍니다.

만약에 해당 값을 숫자로 설정해버리게 된다면 에디터 상에서 오류가 나타나게 됩니다.

![](https://i.imgur.com/ehAqT3S.png)

코드를 모두 작성하셨으면 해당 프로젝트의 디렉터리에 위치한 터미널에서 `tsc` 명령어를 입력해보세요.

그러면 dist/practice.js 경로에 다음과 같이 파일이 생성될 것입니다.

```javascript
"use strict";
var message = 'hello world';
console.log(message);
```

우리가 ts 파일에서 명시한 값의 타입은 컴파일이 되는 과정에서 모두 사라지게 된답니다.

### 기본 타입

자, 그럼 계속해서 타입스크립트 연습을 해봅시다.

`let` 과 `const` 를 사용하여 특정 값을 선언 할 때 여러가지 기본 타입을 지정하여 선언하는 것을 연습해볼까요?

다음 코드를 한번 따라 작성해보세요.

#### src/practice.ts
```javascript
let count = 0; // 숫자
count += 1;
count = '갑자기 분위기 문자열'; // 이러면 에러가 납니다!

const message: string = 'hello world'; // 문자열

const done: boolean = true; // 불리언 값

const numbers: number[] = [1, 2, 3]; // 숫자 배열
const messages: string[] = ['hello', 'world']; // 문자열 배열

messages.push(1); // 숫자 넣으려고 하면.. 안된다!

let mightBeUndefined: string | undefined = undefined; // string 일수도 있고 undefined 일수도 있음
let nullableNumber: number | null = null; // number 일수도 있고 null 일수도 있음

let color: 'red' | 'orange' | 'yellow' = 'red'; // red, orange, yellow 중 하나임
color = 'yellow';
color = 'green'; // 에러 발생!
```

![](https://i.imgur.com/ZzDrLr9.png)

TypeScript 를 사용하면 이렇게 특정 변수 또는 상수의 타입을 지정 할 수 있고 우리가 사전에 지정한 타입이 아닌 값이 설정 될 때 바로 에러를 발생시킵니다.

이렇게 에러가 나타났을땐 컴파일이 되지 않습니다. 한번 `tsc` 명령어를 입력해서 컴파일을 하려고 하면 다음과 같이 실패할것입니다.

![](https://i.imgur.com/gC6VJWX.png)


### 함수에서 타입 정의하기

이번에는 함수에서 타입을 정의하는 방법을 알아보겠습니다. 

기존 코드를 모두 지우고 다음과 같이 코드를 작성해보세요.


#### src/practice.ts
```javascript
function sum(x: number, y: number): number {
  return x + y;
}

sum(1, 2);
```

타입스크립트를 사용하면 다음과 같이 코드를 작성하는 과정에서 함수의 파라미터로 어떤 타입을 넣어야 하는지 바로 알 수 있답니다.

![](https://i.imgur.com/ObAOm6n.png)

위 코드의 첫번째 줄의 가장 우측을 보면 `: number` 가 있지요? 이는 해당 함수의 결과물이 숫자라는것을 명시합니다.

만약에 이렇게 결과물이 number 라는 것을 명시해놓고 갑자기 null 을 반환한다면 오류가 뜨게 됩니다.

![](https://i.imgur.com/BaZ9F8j.png)

이번에는 숫자 배열의 총합을 구하는 `sumArray` 라는 함수를 작성해볼까요?

#### src/practice.ts
```javascript
function sumArray(numbers: number[]): number {
  return numbers.reduce((acc, current) => acc + current, 0);
}

const total = sumArray([1, 2, 3, 4, 5]);
```

타입스크립트를 사용했을때 참 편리한 점은, 배열의 내장함수를 사용 할 때에도 타입 유추가 매우 잘 이루어진다는 것 입니다.

![](https://i.imgur.com/xzJIkSY.png)


참고로 함수에서 만약 아무것도 반환하지 않아야 한다면 이를 반환 타입을 `void` 로 설정하면 됩니다.

```javascript
function returnNothing(): void {
  console.log('I am just saying hello world');
}
```

### interface 사용해보기

interface는 클래스 또는 객체를 위한 타입을 지정 할 때 사용되는 문법입니다.

#### 클래스에서 interface 를 implements 하기

다음 코드를 따라 작성해보세요.

#### practice.ts
```javascript
// Shape 라는 interface 를 선언합니다.
interface Shape {
  getArea(): number; // Shape interface 에는 getArea 라는 함수가 꼭 있어야 하며 해당 함수의 반환값은 숫자입니다.
}

class Circle implements Shape {
  // `implements` 키워드를 사용하여 해당 클래스가 Shape interface 의 조건을 충족하겠다는 것을 명시합니다.

  radius: number; // 멤버 변수 radius 값을 설정합니다.

  constructor(radius: number) {
    this.radius = radius;
  }

  // 너비를 가져오는 함수를 구현합니다.
  getArea() {
    return this.radius * this.radius * Math.PI;
  }
}

class Rectangle implements Shape {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(10, 5)];

shapes.forEach(shape => {
  console.log(shape.getArea());
});
```

여기까지 코드를 작성하고 `tsc` 명령어를 입력해보세요. 그 다음엔, `node dist/practice` 명령어를 입력하여 컴파일된 스크립트를 실행시켜보세요.

![](https://i.imgur.com/xpyFzd9.png)

잘 작동하지요?

우리가 기존에 작성했던 코드를 보면

```javascript
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
```

이런식으로 width, height 멤버 변수를 선언한 다음에 constructor 에서 해당 값들을 하나 하나 설정해주었는데요, 타입스크립트에서는 constructor 의 파라미터 쪽에 `public` 또는 `private` [accessor](https://www.typescriptlang.org/docs/handbook/classes.html#accessors) 를 사용하면 직접 하나하나 설정해주는 작업을 생략해줄 수 있습니다.

#### `src/practice.ts`
```javascript
// Shape 라는 interface 를 선언합니다.
interface Shape {
  getArea(): number; // Shape interface 에는 getArea 라는 함수가 꼭 있어야 하며 해당 함수의 반환값은 숫자입니다.
}

class Circle implements Shape {
  // `implements` 키워드를 사용하여 해당 클래스가 Shape interface 의 조건을 충족하겠다는 것을 명시합니다.
  constructor(public radius: number) {
    this.radius = radius;
  }

  // 너비를 가져오는 함수를 구현합니다.
  getArea() {
    return this.radius * this.radius * Math.PI;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}

const circle = new Circle(5);
const rectangle = new Rectangle(10, 5);

console.log(circle.radius);
console.log(rectangle.width);

const shapes: Shape[] = [new Circle(5), new Rectangle(10, 5)];

shapes.forEach(shape => {
  console.log(shape.getArea());
});
```

`public` 으로 선언된 값은 클래스 외부에서 조회 할 수 있으며 `private`으로 선언된 값은 클래스 내부에서만 조회 할 수 있습니다. 따라서 위 코드에서는 circle 의 radius 값은 클래스 외부에서 조회 할 수 있지만, rectangle 의 width 또는 height 값은 클래스 외부에서 조회 할 수 없습니다.

문제가 되는 `console.log(rectangle.width);` 코드를 지우고, `tsc` 명령어를 실행하여 코드를 컴파일 한뒤 `node dist/practice` 명령어를 실행해서 이전과 동일하게 작동되는지 확인해보세요.

#### 일반 객체를 interface 로 타입 설정하기

이번에는 클래스가 아닌 일반 객체를 interface 를 사용하여 타입을 지정하는 방법을 알아보도록 하겠습니다. 


#### src/practice.ts
```typescript
interface Person {
  name: string;
  age?: number; // 물음표가 들어갔다는 것은, 설정을 해도 되고 안해도 되는 값이라는 것을 의미합니다.
}
interface Developer {
  name: string;
  age?: number;
  skills: string[];
}

const person: Person = {
  name: '김사람',
  age: 20
};

const expert: Developer = {
  name: '김개발',
  skills: ['javascript', 'react']
};
```

지금 보면 Person 과 Developer 가 형태가 유사하지요? 이럴 땐 interface 를 선언 할 때 다른 interface 를 `extends` 키워드를 사용해서 상속받을 수 있습니다.

```typescript
interface Person {
  name: string;
  age?: number; // 물음표가 들어갔다는 것은, 설정을 해도 되고 안해도 되는 값이라는 것을 의미합니다.
}
interface Developer extends Person {
  skills: string[];
}

const person: Person = {
  name: '김사람',
  age: 20
};

const expert: Developer = {
  name: '김개발',
  skills: ['javascript', 'react']
};

const people: Person[] = [person, expert];
```

### Type Alias 사용하기

`type` 은 특정 타입에 별칭을 붙이는 용도로 사용합니다. 이를 사용하여 객체를 위한 타입을 설정할 수도 있고, 배열, 또는 그 어떤 타입이던 별칭을 지어줄 수 있습니다.

#### src/practice.ts
```javascript
type Person = {
  name: string;
  age?: number; // 물음표가 들어갔다는 것은, 설정을 해도 되고 안해도 되는 값이라는 것을 의미합니다.
};

// & 는 Intersection 으로서 두개 이상의 타입들을 합쳐줍니다.
// 참고: https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types
type Developer = Person & {
  skills: string[];
};

const person: Person = {
  name: '김사람'
};

const expert: Developer = {
  name: '김개발',
  skills: ['javascript', 'react']
};

type People = Person[]; // Person[] 를 이제 앞으로 People 이라는 타입으로 사용 할 수 있습니다.
const people: People = [person, expert];

type Color = 'red' | 'orange' | 'yellow';
const color: Color = 'red';
const colors: Color[] = ['red', 'orange'];
```

우리가 이번에 type 과 interface 를 배웠는데, 어떤 용도로 사용을 해야 할까요? 클래스와 관련된 타입의 경우엔 interface 를 사용하는게 좋고, 일반 객체의 타입의 경우엔 그냥 type을 사용해도 무방합니다. 사실 객체를 위한 타입을 정의할때 무엇이든 써도 상관 없는데 일관성 있게만 쓰시면 됩니다.

이에 대한 자세한 내용은 다음 링크에 자세히 서술되어 있습니다.

- https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c
- https://joonsungum.github.io/post/2019-02-25-typescript-interface-and-type-alias/


### Generics

제너릭(Generics)은 타입스크립트에서 함수, 클래스, interface, type alias 를 사용하게 될 때 여러 종류의 타입에 대하여 호환을 맞춰야 하는 상황에서 사용하는 문법입니다.

#### 함수에서 Generics 사용하기

예를 들어서 우리가 객체 A 와 객체 B 를 합쳐주는 merge 라는 함수를 만든다고 가정해봅시다. 그런 상황에서는 A 와 B 가 어떤 타입이 올 지 모르기 떄문에 이런 상황에서는 any 라는 타입을 쓸 수도 있습니다.

#### practice.ts
```javascript
function merge(a: any, b: any): any {
  return {
    ...a,
    ...b
  };
}

const merged = merge({ foo: 1 }, { bar: 1 });
```

그런데, 이렇게 하면 타입 유추가 모두 깨진거나 다름이 없습니다. 결과가 any 라는 것은 즉 merged 안에 무엇이 있는지 알 수 없다는 것 입니다.

![](https://i.imgur.com/AVikBS7.png)

이런 상황에 Generics 를 사용하면 됩니다. Generics 는 다음과 같이 사용합니다.

#### src/practice.ts
```typescript
function merge<A, B>(a: A, b: B): A & B {
  return {
    ...a,
    ...b
  };
}

const merged = merge({ foo: 1 }, { bar: 1 });
```

또 다른 예시를 알아볼까요?

#### src/practice.ts
```typescript
function wrap<T>(param: T) {
  return {
    param
  }
}

const wrapped = wrap(10);
```

![](https://i.imgur.com/OJmi5Xb.png)

이렇게 함수에서 Generics 를 사용하면 파라미터로 다양한 타입을 넣을 수도 있고 타입 지원을 지켜낼 수 있습니다.

#### interface 에서 Generics 사용하기
이번엔 interface 에서 Generics 를 사용하는 방법을 알아봅시다.

#### src/practice.ts
```javascript
interface Items<T> {
  list: T[];
}

const items: Items<string> = {
  list: ['a', 'b', 'c']
};
```

#### type 에서 Generics 사용하기

방금 interface 에서 Generics를 사용한것과 매우 유사합니다.

#### src/practice.ts
```javascript
type Items<T> = {
  list: T[];
};

const items: Items<string> = {
  list: ['a', 'b', 'c']
};
```

#### 클래스에서 Generics 사용하기

이번에는 클래스에서 Generics 를 사용해볼까요? Queue 라는 클래스를 만들어봅시다. Queue 는 데이터를 등록 할 수 있는 자료형이며, 먼저 등록(enqueue)한 항목을 먼저 뽑아올 수(dequeue) 있는 성질을 가지고 있습니다.

```javascript
class Queue<T> {
  list: T[] = [];
  get length() {
    return this.list.length;
  }
  enqueue(item: T) {
    this.list.push(item);
  }
  dequeue() {
    return this.list.shift();
  }
}

const queue = new Queue<number>();
queue.enqueue(0);
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
```

이제 해당 코드를 컴파일하고 실행해보세요.

```bash
$ tsc
$ node dist/practice

0
1
2
3
4
```

잘 작동하나요?

여기까지 쭉 잘 따라오셨다면, 타입스크립트를 리액트와 함께 쓰기위한 준비를 마치신 겁니다. 다음 섹션에서 본격적으로 리액트에서 타입스크립트를 사용해보도록 하겠습니다.