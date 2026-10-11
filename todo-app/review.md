# 코드 리뷰 — T5. Todo 다중 페이지 라우팅 (2026-10-11)

- 대상: staged 상태의 `src/App.jsx`, `ListPage.jsx`, `AddPage.jsx`, `DetailPage.jsx`
- `npm run lint`는 통과. 아래 지적은 대부분 lint가 못 잡는 **동작/설계** 문제
- 우선순위: 🔴 버그(화면이 깨짐) → 🟠 설계(판단 포인트와 직결) → 🟡 다듬기

## 잘한 점
- 진행 순서(BrowserRouter → 레이아웃 라우트 → `<Outlet context>` → `useOutletContext`)를 그대로 따라 구조를 잡았다.
- AddPage를 `FormData` + `defaultValue`(비제어 입력)로 짠 건 좋은 선택이다. 제출할 때 한 번만 값을 읽으면 되는 폼이라 state가 필요 없다. 지난번 `inputValue` 전역 state를 걷어낸 것도 맞는 방향이다.
- `handleDeleteTodo`에서 `navigate()`를 빼고 페이지(`DetailPage.remove`)로 옮겼다. "어디로 갈지"는 화면이 정할 일이고, 데이터 함수가 정할 일이 아니다. 책임을 잘 나눴다.

---

## 🔴 1. 없는 id로 들어가면 앱 전체가 흰 화면이 됨

**지적** — `src/DetailPage.jsx:21`, `:24`

```jsx
{todo === undefined || todo === null && (<span>찾을 수 없음</span>)}
{editingTodoId !== todo.id && ( ... )}
```

**이유**
- `&&`가 `||`보다 **우선순위가 높다.** 그래서 21번 줄은 `todo === undefined || (todo === null && <span/>)`로 해석된다.
  - todo가 없으면 → 결과는 `true` → React는 `true`를 아무것도 그리지 않는다. "찾을 수 없음"이 **절대 안 나온다.**
- 이어서 24번 줄의 `todo.id`가 `undefined.id`가 되어 `TypeError` → 컴포넌트 트리 전체가 언마운트된다(흰 화면).
- 재현: 주소창에 `/todos/abc` 입력. 또는 **할 일 삭제 → 브라우저 뒤로가기**(지운 항목의 상세 페이지로 돌아감). 두 번째가 실제 사용자가 겪을 경로다.

**TODO 질문에 대한 답** ("undefined나 null로만 비교하면 될까?")
- `Array.prototype.find`는 못 찾으면 **항상 `undefined`**를 돌려준다. `null`은 나올 일이 없다.
- 그래서 `todo === undefined`면 충분하고, 관용적으로는 `!todo`를 쓴다(객체는 항상 truthy라서 안전).
- 핵심은 비교식이 아니라 **"없으면 그 아래 코드를 아예 실행하지 않게" 막는 것**이다. JSX 안에서 `&&`로 처리하면 아래쪽 JSX는 여전히 평가되기 때문에 크래시를 못 막는다. → **early return**을 쓴다.

**수정 사항 + 예제 코드**

Before
```jsx
const todo = todos.find((x) => x.id === id);
...
return (
    <>
        {todo === undefined || todo === null && (<span>찾을 수 없음</span>)}
        {editingTodoId !== todo.id && ( ... )}
```

After
```jsx
const todo = todos.find((x) => x.id === id);

if (!todo) {
    return (
        <>
            <p>찾을 수 없는 할 일입니다.</p>
            <Link to="/">목록으로</Link>
        </>
    );
}

// 여기부터는 todo가 반드시 있다고 믿고 써도 된다
return ( ... );
```

> 자바로 치면 `Optional`을 꺼내기 전에 `if (opt.isEmpty()) return ...;`로 가드하는 것과 같다. 리액트 컴포넌트도 그냥 함수라서 중간에 `return` 해도 된다.
> (단, **훅 호출보다 위에서** return 하면 안 된다. 지금 코드는 훅이 전부 위에 있으므로 `find` 다음 위치가 맞다.)

📖 [JS딥] 7장 연산자 — 논리 연산자 / 연산자 우선순위 부분 (절 번호 추정)
📖 [한입리액트] 2장 > 단락 평가

---

## 🔴 2. 삭제 후 뒤로가기하면 1번 버그로 직행

**지적** — `src/DetailPage.jsx:13-16`

```jsx
function remove(id){
    handleDeleteTodo(id);
    navigate('/');
}
```

**이유**
- `navigate('/')`는 히스토리에 `/`를 **쌓는다(push).** 히스토리가 `/ → /todos/123 → /`가 되므로, 뒤로가기를 누르면 방금 지운 `/todos/123`으로 돌아간다.
- 1번을 고치면 크래시는 안 나지만, 사용자 입장에선 "지웠는데 뒤로가기 하니까 '찾을 수 없음'"이 뜬다. 없어진 페이지는 히스토리에서도 **교체(replace)** 해 주는 게 자연스럽다.
- AddPage도 같다. 등록 후 뒤로가기 하면 빈 등록 폼이 다시 나온다. 이건 취향 영역이지만, "등록 완료된 폼으로는 돌아갈 이유가 없다"면 replace가 맞다.

**수정 사항 + 예제 코드**

Before
```jsx
handleDeleteTodo(id);
navigate('/');
```

After
```jsx
handleDeleteTodo(id);
navigate('/', { replace: true }); // 지운 상세 페이지를 히스토리에서 교체
```

> 판단 기준: "이 페이지로 **다시 돌아올 의미가 있나?**" → 없으면 `replace: true`. T6의 로그인 후 리다이렉트에서도 똑같이 쓰게 된다.

📖 React Router 공식 문서 — `useNavigate`의 `replace` 옵션 (책에는 해당 내용이 얇음)
📖 [한입리액트] 9장 > 리액트 라우터로 페이지 라우팅하기 — useNavigate 부분

---

## 🟠 3. `editingTodoId`가 레이아웃(전역)에 있다 — 판단 포인트 직결

**지적** — `src/App.jsx:8`, `:46`, `:56` / `src/DetailPage.jsx:4-6`

**이유**
- 이번 과제의 판단 포인트가 "**레이아웃에 둘 상태 / URL에 둘 상태 / 메모리(로컬)에 둘 상태**를 구분"이다. 하나씩 따져 보면:
  - `todos` → 목록·추가·상세 **세 페이지가 다 쓴다** → 레이아웃 ✅
  - `id` → 새로고침·링크 공유해도 유지돼야 한다 → URL(`/todos/:id`) ✅
  - `editingTodoId` → **상세 페이지 하나만** 쓴다, 그리고 페이지를 떠나면 의미가 없다 → 상세 페이지 로컬 state가 맞다 ❌
- 지금 구조에서 생기는 실제 문제:
  - 상세에서 "수정"을 눌러 입력창을 연 상태로 브라우저 뒤로가기 → 다시 같은 항목에 들어오면 **입력창이 열린 채로** 나온다(state가 레이아웃에 남아 있어서).
  - `handleEditTodo`(데이터 변경 함수)가 `setEditingTodoId(null)`(화면 상태)까지 건드린다. 2번에서 `navigate`를 페이지로 옮긴 것과 같은 이유로, 이것도 페이지가 할 일이다.
- 그리고 상세 페이지는 한 번에 todo 하나만 보이므로 "**어떤 id**를 편집 중인가"를 저장할 필요도 없다. `isEditing` boolean이면 충분하다.

**수정 사항 + 예제 코드**

Before (App.jsx)
```jsx
const [editingTodoId, setEditingTodoId] = useState(null);
...
function handleEditTodo(id, text) {
    ...
    setTodos(...);
    setEditingTodoId(null);
}
...
<Outlet context={{ todos, handleAddTodo, handleEditTodo, handleDeleteTodo, editingTodoId, setEditingTodoId }} />
```

After (App.jsx) — 데이터만 다룬다
```jsx
function handleEditTodo(id, text) {
    if (text.trim() === '') return false;
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text } : todo));
    return true;
}
...
<Outlet context={{ todos, handleAddTodo, handleEditTodo, handleDeleteTodo }} />
```

After (DetailPage.jsx) — 화면 상태는 페이지가 소유
```jsx
const { todos, handleEditTodo, handleDeleteTodo } = useOutletContext();
const { id } = useParams();
const navigate = useNavigate();
const [isEditing, setIsEditing] = useState(false);

const todo = todos.find((x) => x.id === id);
if (!todo) { /* 1번의 early return */ }

function handleKeyDown(e) {
    if (e.key === 'Enter') {
        if (handleEditTodo(id, e.currentTarget.value)) setIsEditing(false);
    } else if (e.key === 'Escape') {
        setIsEditing(false);
    }
}

return (
    <>
        {isEditing ? (
            <input
                autoFocus
                defaultValue={todo.text}
                onBlur={() => setIsEditing(false)}
                onKeyDown={handleKeyDown}
            />
        ) : (
            <>
                <span>{todo.text}</span>
                <button onClick={() => setIsEditing(true)}>수정</button>
            </>
        )}
        <button onClick={remove}>삭제</button>
    </>
);
```

덤으로 바뀐 것들:
- `A && ...` / `!A && ...` 두 블록 → 삼항 하나. 조건이 정확히 둘로 갈릴 땐 삼항이 "둘 중 하나"라는 의도를 더 잘 드러낸다.
- `handleEditTodo`의 `text === null` 체크 제거. `input.value`는 항상 문자열이라 null이 들어올 수 없다.
- `autoFocus` — "수정"을 누르면 바로 타이핑 가능. 지금은 입력창이 떠도 포커스가 없어서, 한 번 클릭해야 하고 그 전엔 `onBlur`도 안 걸린다.
- `remove`는 `id`를 인자로 받을 필요 없이 `useParams`의 `id`를 바로 쓰면 된다.

📖 [리액트딥] 5.1 상태 관리는 왜 필요한가? — 상태를 어디에 둘지의 기준
📖 [한입리액트] 5장 > 컴포넌트와 상태

---

## 🟠 4. `key`가 엉뚱한 요소에 붙어 있고, `<ul>` 바로 아래에 `<a>`가 있다

**지적** — `src/ListPage.jsx:16-17`

```jsx
{todos.map(todo => (
    <Link to={`/todos/${todo.id}`}>
        <li key={todo.id}>{todo.text}</li>
    </Link>
))}
```

**이유**
- `key`는 **`map`이 돌려주는 가장 바깥 요소**에 붙여야 한다. React는 형제끼리 key를 비교하는데, 지금 형제는 `<Link>`들이고 `<li>`는 각 Link의 외동 자식이다. 그래서 key가 없는 것과 같다 → 콘솔에 `Each child in a list should have a unique "key" prop` 경고가 뜬다(ESLint 설정에 이 규칙이 없어서 lint는 통과).
  - key가 없으면 항목 삭제/순서 변경 시 React가 인덱스로 매칭해서, 나중에 항목에 체크박스·입력창 같은 상태가 생기면 **엉뚱한 항목에 상태가 붙는 버그**로 이어진다.
- `<ul>`의 자식은 `<li>`만 허용된다. `<Link>`는 `<a>`로 렌더링되므로 HTML 규칙 위반이고, 스크린리더가 "목록, 항목 N개"를 제대로 읽지 못한다.

**수정 사항 + 예제 코드**

After
```jsx
<ul>
    {todos.map(todo => (
        <li key={todo.id}>
            <Link to={`/todos/${todo.id}`}>{todo.text}</Link>
        </li>
    ))}
</ul>
```

> 순서 기억법: **목록 구조(ul > li)가 먼저, 링크는 그 안의 내용물.**

📖 [리액트딥] 2.2 가상 DOM과 리액트 파이버 — key가 재조정에서 하는 일
📖 [한입리액트] 6장 > Project 2 [할 일 관리] 앱 — 리스트 렌더링(Read) 부분

---

## 🟡 5. `<Link>` 안에 `<button>`

**지적** — `src/ListPage.jsx:8-12`

**이유**
- `<a>` 안에 `<button>`처럼 **클릭 가능한 요소를 중첩**하는 건 HTML 규칙 위반이다. 키보드 Tab 시 포커스가 두 번 잡히고, 스크린리더는 "링크, 버튼"을 둘 다 읽는다.
- 원칙: **주소가 바뀌면 `<Link>`, 같은 페이지에서 동작만 하면 `<button>`.** "추가"는 `/new`로 이동하므로 Link 하나면 된다. 버튼처럼 보이게 하고 싶으면 CSS로 처리.

**수정 사항 + 예제 코드**

Before
```jsx
<Link to="/new"><button>추가</button></Link>
```

After
```jsx
<Link to="/new" className="button">추가</Link>
```

📖 [한입리액트] 9장 > 리액트 라우터로 페이지 라우팅하기 — Link vs useNavigate 비교 부분
📖 (접근성은 책보다 MDN `<a>` / `<button>` 문서가 정확함)

---

## 🟡 6. `index` 라우트와 `path="/"` 라우트가 중복

**지적** — `src/App.jsx:57-60`

**이유**
- 부모 레이아웃 라우트에 `path`가 없으므로 `index` 라우트가 곧 `/`다. `path="/"`를 또 쓰면 **같은 URL에 라우트가 두 개**가 된다. 지금은 우연히 같은 컴포넌트라 티가 안 나지만, 한쪽만 고치면 "왜 안 바뀌지?"가 된다.
- 자식이 없는 `<Route>`는 self-closing으로, 문자열 prop은 `{"..."}` 없이 쓰면 읽기 쉽다.

**수정 사항 + 예제 코드**

After
```jsx
<Routes>
    <Route element={<Outlet context={{ todos, handleAddTodo, handleEditTodo, handleDeleteTodo }} />}>
        <Route index element={<ListPage />} />
        <Route path="new" element={<AddPage />} />
        <Route path="todos/:id" element={<DetailPage />} />
    </Route>
</Routes>
```

> 중첩 라우트의 자식 path는 앞에 `/` 없이 **상대 경로**로 쓰는 게 관례다. T6에서 레이아웃이 `/todos` 같은 path를 갖게 되면 차이가 드러난다.
> 그리고 T6에서 공통 헤더를 붙일 때는 `element={<Outlet .../>}`를 `TodoLayout` 컴포넌트로 빼게 될 것이다. 지금 미리 빼 둬도 좋다.

📖 [한입리액트] 9장 > 리액트 라우터로 동적 경로 라우팅하기
📖 React Router 공식 문서 — Routing > Index Routes / Layout Routes

---

## 🟡 7. 빈 값으로 등록하면 아무 말 없이 목록으로 튕김

**지적** — `src/AddPage.jsx:14-17`

**이유**
- 빈 값이면 `handleAddTodo` 안에서 `return` 되지만, AddPage는 그걸 모르고 `navigate('/')`를 실행한다. 사용자는 "등록됐나?" 하고 목록을 봐야 실패를 안다.
- 검증 결과를 **호출한 쪽이 알 수 있어야** 다음 동작(이동 / 머무르기)을 고를 수 있다.

**수정 사항 + 예제 코드**

After
```jsx
const handleSubmit = (e) => {
    e.preventDefault();
    const text = new FormData(e.currentTarget).get('addInput');

    if (!handleAddTodo(text)) return;   // 실패하면 페이지에 머무름 (3번처럼 boolean 반환)
    navigate('/', { replace: true });
};
```
```jsx
// App.jsx
function handleAddTodo(text) {
    if (text.trim() === '') return false;
    setTodos([...todos, { id: crypto.randomUUID(), text }]);
    return true;
}
```

> 더 간단하게는 `<input required />`만 붙여도 브라우저가 빈 제출을 막아준다(공백만 입력은 못 막음). sign-up 과제의 검증 로직을 재사용해 보는 것도 방법.
> 사소한 것: `// 1.`, `// 4.` 주석은 이전 코드(2·3번 단계)의 흔적이라 번호가 비어 있다. 정리하자.

📖 [JS딥] 40장 이벤트 — preventDefault / 폼 submit 부분
📖 [한입리액트] 5장 > 이벤트 처리하기

---

## 💬 TODO 질문 답변: `value={todo.text}`일 때 콘솔 경고가 뜬 이유 (`DetailPage.jsx:35`)

"가변 설계가 필요해서?" → 방향은 맞다. 정확히는 **제어(controlled) vs 비제어(uncontrolled) 입력** 문제다.

- `value`를 주면 React가 **"이 입력창의 값은 내가 책임진다"(제어 컴포넌트)** 로 받아들인다. 그런데 `onChange`가 없으면 값을 바꿀 방법이 없으므로 키보드를 쳐도 글자가 안 바뀐다. 그래서 React가 경고한다:
  `You provided a 'value' prop to a form field without an 'onChange' handler...`
- 해결은 두 가지 중 **선택**:
  1. 비제어: `defaultValue={todo.text}` — 초기값만 넣고 이후는 DOM이 관리. 값은 이벤트에서 `e.currentTarget.value`로 읽는다. **지금 코드가 이 방식이고, 이 화면에선 이게 맞다.**
  2. 제어: `value={draft}` + `onChange={e => setDraft(e.target.value)}` — 입력마다 state가 갱신. 입력 중에 글자 수 표시, 실시간 검증 같은 게 필요할 때 선택.
- 판단 기준: **"입력하는 도중에 그 값을 화면/로직이 알아야 하나?"** → 예면 제어, 아니면(제출/엔터 시점에만 필요) 비제어.
- 주의: `defaultValue`는 **마운트될 때 한 번만** 적용된다. 같은 입력창이 그대로 있는 채로 `todo`만 바뀌면 값이 안 따라온다. (지금은 수정 모드 진입 때마다 새로 마운트되므로 문제 없음)

📖 [한입리액트] 5장 > 사용자 입력 처리하기 (색인에 없음, 목차 기준 추정)
📖 [리액트딥] 3.1 리액트의 모든 훅 파헤치기 — useRef 부분(비제어 입력을 ref로 읽는 방식과 연결)

---

## 🧹 저장소 정리 (리뷰 범위 밖, 참고)
- 루트 `node_modules/`가 git에 커밋돼 있었다(지금 working tree에서 삭제됨, 262개 파일). 루트에 `.gitignore`를 만들고 `node_modules/`를 넣은 뒤 삭제를 커밋하자.
- HEAD 커밋(`31d02ca`)은 리뷰한 버전보다 이전 상태다. 지금 staged 변경을 커밋해 두면 리뷰 기준점이 명확해진다.

---

## ✅ 판단 포인트 셀프 체크 (말로 설명해 보기)
1. `todos`를 각 페이지가 아니라 레이아웃에 두고 `Outlet context`로 내리는 이유는? 페이지마다 `useState(todos)`를 따로 두면 무슨 일이 생기나?
2. `id`는 URL에, `isEditing`은 로컬 state에 두는 이유는? (힌트: 새로고침/링크 공유/뒤로가기 때 살아남아야 하는가)
3. `navigate('/')`와 `navigate('/', { replace: true })`를 각각 언제 쓰나?

→ 3번 지적을 반영하고 위 1~2를 막힘없이 설명할 수 있으면 T5 완료.

## 📚 이번 과제 복습 읽기 (우선순위 순)
1. [한입리액트] 9장 > 리액트 라우터로 페이지 라우팅하기 / 리액트 라우터로 동적 경로 라우팅하기 — Link·useNavigate·useParams 사용법 재확인 (2·5·6번)
2. [한입리액트] 2장 > 단락 평가 + [JS딥] 7장 연산자(우선순위) — JSX 조건부 렌더링에서 `&&`/`||`가 어떻게 평가되는지 (1번)
3. [리액트딥] 2.2 가상 DOM과 리액트 파이버 — key가 왜 형제 레벨에 있어야 하는지 (4번)

---

## ❓ 후속 질문 정리 (2026-10-11)

**Q1. `todo === undefined || todo === null && <span/>`에서 todo가 없으면 왜 아무것도 안 그려지나?**
- `&&`가 먼저 묶여서 `A || (B && <span/>)`가 된다.
- todo가 없으면 A가 `true` → `||`는 왼쪽이 truthy면 **오른쪽을 보지도 않고 왼쪽 값(`true`)을 그대로 반환**한다.
- React는 `true`, `false`, `null`, `undefined`를 아무것도 그리지 않는다. → `<span>`은 todo가 있어도 없어도 절대 안 나온다.

**Q2. "객체는 truthy"란?**
- JS는 `if`, `!`, `&&`, `||` 자리에 boolean이 아닌 값도 넣을 수 있고, 그때 true/false로 취급(변환)한다.
- falsy(거짓 취급)는 딱 8개: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. 나머지는 전부 truthy — **빈 객체 `{}`, 빈 배열 `[]`도 truthy**.
- 그래서 `find` 결과가 객체 또는 `undefined`뿐이면 `!todo`로 안전하게 "없음"을 판별할 수 있다.
- 주의: 숫자 배열에서 `find`가 `0`을 찾았다면 `!0 === true`라 "없음"으로 오판한다. 그땐 `=== undefined`로 비교.

**Q3. "JSX 안의 `&&`는 아래쪽 JSX가 여전히 평가된다"란?**
- JSX는 결국 함수 호출(값 만들기)이다. return 안의 `{...}`들은 **배열 원소처럼 위에서부터 전부 계산된 뒤** React에 넘어간다.
  ```js
  return jsx(Fragment, { children: [
      식1,                              // todo === undefined || ...
      editingTodoId !== todo.id && ..., // 식2 — 식1 결과와 상관없이 계산됨 → todo.id에서 TypeError
  ]});
  ```
- `&&`는 **자기 오른쪽만** 건너뛸 수 있다. 형제 `{}`의 실행은 막지 못한다. 함수 실행 자체를 끝내려면 `return`이 필요하다.

**Q4. early return은 useEffect처럼 첫 로드 때 자동으로 실행되나?**
- useEffect와는 다른 개념이다. **컴포넌트 함수 본문은 렌더링할 때마다 위에서 아래로 그대로 실행되는 평범한 코드**다.
  - 렌더링 시점: 처음 마운트될 때 + state/props/context(여기선 Outlet context의 todos)가 바뀔 때마다.
  - 그러니 `if (!todo) return ...`은 첫 로드는 물론, 나중에 todos가 바뀌어 다시 렌더링될 때마다 매번 다시 검사된다.
- useEffect는 "화면을 그린 **뒤에** 실행할 부수 효과(localStorage 저장, 타이머, 구독)"를 예약하는 것. 본문은 "**무엇을 그릴지 계산**"하는 곳.
  - 비유: 본문 = 컨트롤러 메서드가 응답을 만드는 로직, useEffect = 응답 보낸 뒤 실행되는 후처리 리스너.
- 규칙: early return은 **모든 훅 호출보다 아래**에 둔다. React는 훅을 "호출 순서"로 기억하는데, return 아래에 훅이 있으면 렌더링마다 훅 개수가 달라져 `Rendered fewer hooks than expected` 에러가 난다.

📖 [JS딥] 9장 타입 변환과 단락 평가 — truthy/falsy, 단락 평가 부분
📖 [리액트딥] 2.4 렌더링은 어떻게 일어나는가? — 함수 본문이 렌더링마다 실행된다는 것
📖 [리액트딥] 3.1 리액트의 모든 훅 파헤치기 — 훅의 규칙 부분
