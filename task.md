[진행 기록]
claude.md의 [장기 로드맵] 토픽 번호 기준으로 기록. 날짜 없음, 완료 여부만 표시.

1. Todo CRUD (todo-app/) — 완료 · 토픽 1(React 기본기)
   - useState 기반 CRUD, controlled input, crypto.randomUUID()
   - 인라인 편집(editingTodoId), Esc로 편집 취소, localStorage 영속화(useEffect)

2. 스톱워치 (stop-watch/) — 완료 · 토픽 1(React 기본기)
   - useEffect+cleanup(setInterval), useRef의 두 가지 용도(값 저장 vs DOM 참조) 비교
   - keydown 이벤트 리스너 등록/해제(cleanup), 커스텀 훅(useStopwatch)으로 로직 분리 연습

3. 디바운스 검색 (debounced-search/) — 완료 · 토픽 1(React 기본기)
   - useEffect+setTimeout 기반 디바운스, cleanup으로 이전 타이머 취소
   - 커스텀 훅 파라미터 설계: 값의 소유권을 컴포넌트에 둘지 훅에 둘지 판단하는 연습(useDebounce(value, delay) 형태로 정리)

4. 회원가입 폼 검증 (sign-up/) — 완료 · 토픽 1(React 기본기)
   - useRef로 DOM 포커스 제어(마운트 시 자동 포커스, 에러 필드로 포커스 이동)
   - 커스텀 훅이 ref/state를 통째로 소유하는 패턴(useFormValidation), 폼 유효성 검사

5. Todo 다중 페이지 라우팅 — 다음 과제 · 토픽 2(라우팅)
   - 아래 [다음 과제 상세] 참고

[12주 과제 계획] 2026-10-09 ~ 2026-12-31
- 목표: React → TypeScript → Next.js 순서로 1회독. 주 1과제 기준, 밀리면 순서만 지키고 날짜는 미룬다
- 📖 = 시작 전에 가볍게 훑을 곳 (깊게 읽는 건 리뷰에서 지적받은 부분 위주로). 약칭/색인은 books.md
- 각 과제의 "판단 포인트"는 리뷰 때 말로 설명할 수 있어야 하는 것 = 완료 기준
- 과제가 "다음 과제"가 되면 아래 [다음 과제 상세]에 진행 순서를 자세히 풀어서 적는다

Phase 1. React 마무리 (라우팅 · 데이터 페칭)
T5. Todo 다중 페이지 라우팅 — W1 (10/09~10/18) · 토픽 2
   - 상세는 아래 [다음 과제 상세]
   - 판단 포인트: 상태를 레이아웃에 두고 Outlet context로 내리는 이유 / URL에 둘 상태(id)와 메모리에 둘 상태의 구분
   - 📖 [한입리액트] 9장 > 리액트 라우터로 페이지 라우팅하기 / 리액트 라우터로 동적 경로 라우팅하기

T6. 로그인 가드 + 중첩 레이아웃 — W2 (10/19~10/25) · 토픽 2
   - T5 앱에 가짜 로그인 추가(아이디만 입력, localStorage에 저장). /login, /mypage
   - 로그인 안 했으면 /todos/* 접근 시 /login으로 보내고, 로그인 후 원래 가려던 페이지로 복귀(location.state)
   - 공통 헤더(로그인 상태/로그아웃 버튼)는 레이아웃 라우트로, 404 페이지 추가
   - 판단 포인트: 가드를 "감싸는 컴포넌트" vs "레이아웃 라우트" 중 무엇으로 / `<Navigate>`와 `useNavigate()`를 언제 각각 쓰나
   - 📖 [JS딥] 40장 이벤트(폼 submit, preventDefault 복습) · 중첩 라우트는 React Router 공식 문서

T7. 게시글 목록/상세 데이터 페칭 — W3 (10/26~11/01) · 토픽 3
   - 새 Vite 프로젝트(fetch-posts/). JSONPlaceholder(/posts, /posts/:id, /posts/:id/comments) 사용
   - loading / error / success 3상태를 화면에 모두 표시. 일부러 잘못된 URL로 에러 화면 확인
   - 상세 페이지에서 이전/다음 버튼을 빠르게 연타 → race condition 재현 후 AbortController로 해결
   - StrictMode에서 요청이 두 번 나가는 것을 네트워크 탭으로 확인하고 이유 설명
   - 판단 포인트: isLoading/isError/data 3개 state vs status 1개 / cleanup에서 abort하는 이유
   - 📖 [JS딥] 45장 프로미스, 46장 async/await · [리액트딥] 1.5 이벤트 루프와 비동기 통신 · [리액트딥] 10.2 (StrictMode)

T8. API 레이어 분리 + 검색/페이지네이션 — W4 (11/02~11/08) · 토픽 3, 10
   - T7을 확장. api/ 폴더에 fetch 래퍼(공통 에러 변환, 토큰 헤더 자리) 분리, useFetch 커스텀 훅
   - 검색어/페이지를 useSearchParams로 URL에 저장(새로고침·뒤로가기 유지), 검색은 기존 useDebounce 재사용
   - (선택) 같은 화면을 TanStack Query로 다시 짜고 "라이브러리가 대신해준 것" 목록 작성
   - 판단 포인트: 컴포넌트 / 훅 / api 함수 각각의 책임 경계 / 이 상태는 URL에 둘까 state에 둘까
   - 📖 [JS딥] 43장 Ajax, 44장 REST API, 47장 에러 처리 · [리액트딥] 3.2 사용자 정의 훅

Phase 2. TypeScript
T9. 기존 프로젝트 TS 전환 — W5 (11/09~11/15) · 토픽 4
   - stop-watch와 sign-up을 .tsx로 전환 (tsconfig strict 켜고 시작)
   - props / state / 이벤트 핸들러 / useRef 제네릭 타입 직접 작성, any 금지
   - 자바와 비교 노트 작성(java-vs-ts.md): 구조적 타이핑, null 처리, 제네릭, enum vs 유니언 리터럴, interface 의미 차이
   - 판단 포인트: 타입을 직접 쓸 곳 vs 추론에 맡길 곳 / useRef<HTMLInputElement>(null)과 useRef<number>()의 차이
   - 📖 [TS교과서] 2.1~2.9, 2.13 구조적 타이핑 · [TS교과서] 7.1 React Hooks 분석하기, 7.2 JSX 타입 · 10.4 js 프로젝트를 ts로 전환하기

T10. 타입부터 설계하는 API 앱 — W6 (11/16~11/22) · 토픽 4, 3
   - T8을 react-ts 템플릿으로 새로 작성. 코드보다 types.ts를 먼저 쓴다
   - API 응답 타입, 제네릭 request<T>(), 비동기 상태를 판별 유니언으로: { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: string }
   - 게시글 작성 폼 추가: 요청 타입은 Omit<Post, 'id'> 같은 유틸리티 타입으로 파생
   - 판단 포인트: type vs interface 선택 기준 / 판별 유니언이 boolean 3개보다 나은 이유 / 응답 타입을 믿어도 되는가(런타임 검증 필요성)
   - 📖 [TS교과서] 2.6 유니언, 2.14 제네릭, 2.23 타입 좁히기, 3.1~3.2 유틸리티 타입, 3.10 Promise/Awaited

Phase 3. 상태관리 · 최적화 · 테스트 (TS로 진행)
T11. 장바구니 — 상태 위치 판단 — W7 (11/23~11/29) · 토픽 5
   - 상품 목록 / 장바구니 / 헤더 배지(개수) 3영역. 같은 기능을 3번 구현해서 비교
     1) prop drilling  2) useReducer + Context  3) Zustand
   - 비교 노트: 각 방식에서 "어떤 컴포넌트가 리렌더되는지" DevTools로 확인한 결과 포함
   - 판단 포인트: 이 상태를 로컬/Context/외부 스토어 중 어디에 둘지 / Context 하나에 다 넣으면 생기는 문제
   - 📖 [한입리액트] 7장 useReducer, 9장 Context · [리액트딥] 5.1, 5.2 상태 관리

T12. 최적화 + 테스트 — W8 (11/30~12/06) · 토픽 7, 8
   - T11(Context 버전)에 상품 1000개 → React DevTools Profiler로 병목 찾기, memo/useMemo/useCallback 적용 전후 비교
   - "메모이제이션 안 해도 되는 곳" 1군데 이상 일부러 남기고 이유 적기
   - Vitest + React Testing Library: 장바구니 담기/수량 변경/삭제 테스트, reducer 단위 테스트
   - 판단 포인트: 최적화가 필요한 지점인가 판단 근거 / 구현 세부가 아닌 사용자 행동 기준으로 테스트 쓰기 / mock 범위
   - 📖 [한입리액트] 8장 최적화 · [리액트딥] 2.4 렌더링, 2.5 메모이제이션 · [리액트딥] 8.2 리액트 테스트 라이브러리

Phase 4. Next.js (T10의 게시글 API를 계속 재사용 → CSR vs SSR 비교가 자연스럽게 됨)
T13. Page Router로 빠르게 — W9 (12/07~12/13) · 토픽 12
   - next-pages-blog/. 목록은 SSG, 상세는 SSR, 그 다음 ISR(revalidate)로 바꿔보기
   - 각 방식에서 빌드 결과물(next build 로그)과 페이지 소스 보기로 HTML에 데이터가 들어있는지 확인
   - 판단 포인트: 어떤 페이지에 SSR/SSG/ISR을 쓸지 / Vite(CSR) 버전과 첫 화면이 어떻게 다른지
   - 📖 [한입Next] 2장, 3장 · [리액트딥] 4.1 서버 사이드 렌더링이란?

T14. App Router + 서버 컴포넌트 — W10 (12/14~12/20) · 토픽 12
   - next-app-blog/. 같은 블로그를 App Router로. layout.tsx, 동적 라우트, not-found, error.tsx
   - 데이터는 서버 컴포넌트에서 async/await로 직접 fetch. 검색 입력·좋아요 버튼만 'use client'
   - fetch 캐시 옵션(force-cache / no-store / revalidate) 바꿔가며 동작 차이 기록
   - 판단 포인트: 'use client' 경계를 어디에 긋는가(최대한 아래로) / useEffect 페칭이 여기선 왜 필요 없는가
   - 📖 [한입Next] 4장 > 서버 컴포넌트 이해하기, 5장 데이터 페칭 · [리액트딥] 11.2, 11.3 서버 컴포넌트

T15. 스트리밍 + 서버 액션 — W11 (12/21~12/27) · 토픽 12, 9
   - loading.tsx와 <Suspense>로 느린 영역(댓글)만 늦게 보여주기, 스켈레톤 UI
   - 서버 액션으로 댓글 작성/삭제 (저장소는 서버 메모리 배열 또는 JSON 파일), revalidatePath로 갱신
   - 판단 포인트: 서버 액션 vs API 라우트 + fetch / 어떤 캐시가 갱신을 막고 있었는지 설명
   - 📖 [한입Next] 6장 페이지 캐시, 7장 스트리밍, 8장 서버 액션

T16. 배포 + 12주 회고 — W12 (12/28~12/31, 1월 첫 주까지 밀려도 OK) · 토픽 11, 12
   - 메타데이터/이미지 최적화 적용 후 Vercel 배포, 환경변수(.env.local vs 배포 환경) 분리
   - (선택) 가로채기 라우트로 상세를 모달로 띄우기
   - 회고: 각 과제의 "판단 포인트"를 남에게 설명하듯 retrospective.md로 정리 → 2차 로드맵 결정
   - 📖 [한입Next] 9장 고급 라우터 기법, 10장 최적화 및 배포 · [리액트딥] 14.2 서버 컴포넌트 보안

[여유 생기면 끼워넣을 보강 과제]
- 폼 라이브러리(토픽 6): sign-up을 react-hook-form + zod로 다시 짜고 직접 구현 버전과 비교
- 에러 바운더리(토픽 9): T8에 react-error-boundary 적용, 렌더링 에러 vs 비동기 에러 차이
- 실무 코드 읽기(토픽 10): Next.js 공식 예제 repo 하나 골라 폴더 구조/데이터 레이어 분석 노트

[다음 과제 상세] Todo 다중 페이지 라우팅
- 목표: 기존 todo-app을 react-router-dom으로 목록/추가/상세 3개 페이지로 나누기
- 진행 순서:
  1. `npm install react-router-dom`
  2. main.jsx를 `<BrowserRouter>`로 감싸기
  3. 라우트 구조: "/"(목록), "/new"(추가 페이지), "/todos/:id"(상세/수정 페이지)
  4. 기존 todos state(및 add/edit/delete 함수)는 최상위 레이아웃 컴포넌트에 그대로 두고, `<Outlet context={{ todos, addTodo, editTodo, deleteTodo }} />`로 하위 라우트에 전달 — 각 페이지는 `useOutletContext()`로 꺼내 쓰기 (Context API 없이 라우트 간 상태 공유하는 표준 패턴 연습)
  5. 목록 페이지: 기존 리스트 렌더링 재사용, 각 항목을 `<Link to={`/todos/${todo.id}`}>`로 감싸기, "추가" 버튼은 `<Link to="/new">`
  6. 추가 페이지: 폼 제출 시 addTodo 호출 후 `useNavigate()`로 "/"로 이동
  7. 상세 페이지: `useParams()`로 id 추출 → todos에서 찾아 표시/수정, 삭제 시 deleteTodo 호출 후 "/"로 이동
  8. (여유되면) 존재하지 않는 id로 접근했을 때 "찾을 수 없음" 처리
- 이번에도 자동완성 끄고 직접 타이핑, 막히면 질문 남기고 다 되면 리뷰 요청
