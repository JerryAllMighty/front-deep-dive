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
