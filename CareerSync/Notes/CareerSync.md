# CareerSync — Complete Build Notes & Interview Prep

A full reference of everything built in this project, organized by concept, with interview questions at the end of each section.

---

## 1. Project Setup (Vite + Tailwind)

**What & why:**
- Vite compiles JSX (not valid JS on its own) into `React.createElement()` calls the browser understands.
- Vite chosen over Create React App: faster dev server (native ES modules + esbuild), CRA is largely unmaintained.
- Tailwind v4 uses `@import "tailwindcss";` in `index.css` (not the old `@tailwind base/components/utilities`).

**Folder structure rationale:**
- `pages/` = one file per route.
- `components/` = reusable UI, no route of its own.
- `services/` = all external (Firebase) calls — isolates the app from any one backend, keeps components ignorant of Firebase.
- `context/` = shared global state.
- `constants/` = fixed values used across the app (status labels, colors) — avoids magic strings.

**Interview Q&A**
- *Why does React need a build step?* Browsers can't parse JSX; Vite/esbuild transpile it to plain JS.
- *Dependency vs devDependency?* Runtime-needed (React) vs build/dev-only (Vite, Tailwind) — devDependencies never ship to the browser.
- *Why separate services/ from components/?* Separation of concerns — swap backend without touching UI; testable in isolation.

---

## 2. Components, Props, `children`

- `Navbar`, `Layout` built as reusable components.
- `children` is a special prop: whatever sits between `<Component></Component>` tags is automatically passed as `children`. This is what makes a `Layout` component possible — it wraps arbitrary page content without knowing what that content is.

**Interview Q&A**
- *What is the `children` prop?* Built-in prop containing nested JSX; enables composition (Layout, Modal, ProtectedRoute all use it).
- *Component vs page?* A page maps to a route; a component is reusable across pages.

---

## 3. Lists & `key` (the `.map()` pattern)

- Never hand-index arrays (`arr[0]`, `arr[1]`) — always `.map()`.
- `key` must be **stable and unique**, not the array index if the list can reorder/change — index-as-key breaks React's ability to track which DOM node maps to which data item across re-renders (can cause wrong item retaining state, animation glitches).
- Why it matters: React uses `key` to diff old vs new render and decide what to reuse vs recreate — this is a reference-based optimization, not a deep comparison.

**Interview Q&A**
- *Why do lists need `key`?* Lets React track identity of items across re-renders efficiently (O(1) diffing) instead of re-rendering everything.
- *Why is index-as-key risky?* If the list reorders/items are removed, indices shift but don't represent the same underlying item — can cause stale state or misapplied DOM updates. Safe only for static, never-reordered lists.

---

## 4. React Router (v6)

- Client-side routing: one `index.html`, URL changes swap components without full page reload (unlike traditional multi-page sites).
- `BrowserRouter` (top-level, must wrap everything with routes) → `Routes` (container) → `Route path="..." element={<Component/>}` (individual mapping).
- `Link` vs `<a>`: `Link` does client-side nav (no reload); `<a href>` forces a full page reload.
- Catch-all 404: `<Route path="*" element={<NotFound/>} />` — `*` is React Router's wildcard.
- `useNavigate()` — programmatic redirect from inside event handlers (e.g., after login success), as opposed to `<Navigate/>` — a component that redirects the instant it renders (used in ProtectedRoute/PublicRoute).

**Interview Q&A**
- *Difference between `Link` and `<a>`?* Link avoids full page reload; uses History API.
- *`Navigate` component vs `useNavigate()` hook?* `Navigate` redirects on render (declarative, good inside conditional JSX); `useNavigate()` gives you a function to call imperatively inside event handlers.
- *How do SPAs handle unknown URLs?* A wildcard route (`path="*"`) matches anything not caught by earlier routes.

---

## 5. Controlled Components & Forms

- Controlled component: input's `value` is driven by React state; `onChange` updates that state on every keystroke. React is the single source of truth, not the DOM.
- Pattern: `value={state}` + `onChange={(e) => setState(e.target.value)}`.
- `onSubmit={handleSubmit}` on `<form>`, with `e.preventDefault()` inside to stop the native page-reload behavior.
- **Single state object + computed property names** for multi-field forms:
```js
const [formData, setFormData] = useState({ company: "", role: "", ... })
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value })
}
```
  - `[e.target.name]` = computed property name — evaluates the *variable* as the object key, rather than using a literal key. Requires every input to have a matching `name` attribute.
  - One handler for every field instead of one per field.

**Interview Q&A**
- *What's a controlled component?* Input whose value is fully driven by React state via `value` + `onChange`.
- *Why computed property names in `handleChange`?* Lets a single function update the correct key in a state object dynamically, based on which input fired the event.
- *Why call `e.preventDefault()`?* Stops the browser's native form submission (full page reload) so React can handle it via state.

---

## 6. Firebase Authentication

- `initializeApp(config)` → `getAuth(app)` → exported `auth` object.
- `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut` — all return Promises.
- `.env` for config keys, `.gitignore` must include `.env` — check `git status` before first commit to ensure it was never tracked.
- `onAuthStateChanged(auth, callback)` — a **live subscription**, not a one-time fetch. Fires immediately on mount (to check for an existing session) and again automatically whenever auth state changes, forever, without re-calling it.
  - Set up inside `useEffect(() => {...}, [])` — empty array = run once, ever, on mount. The subscription itself persists and keeps firing independently of re-renders.
  - Return the `unsubscribe` function from `onAuthStateChanged` so React can clean it up if the component ever unmounts (`useEffect`'s cleanup function).

**Interview Q&A**
- *Why not roll your own password hashing/auth?* Security-critical, easy to get wrong; managed providers handle this safely.
- *Why does `onAuthStateChanged` go in `useEffect` with `[]`?* You want to subscribe exactly once; the subscription itself keeps firing on its own afterward (like `addEventListener`) — re-running the effect on every render would create duplicate subscriptions (a memory leak).
- *What does the returned `unsubscribe` do and why return it from `useEffect`?* Prevents the listener from lingering after the component unmounts, avoiding memory leaks / stale updates.

---

## 7. Context API (built TWICE — AuthContext & ApplicationsContext)

**Why Context exists — prop drilling problem:** passing a value through many intermediate components that don't need it themselves, just to reach a deeply nested child.

**The three pieces, always the same shape:**
1. `const XContext = createContext()` — creates an empty "channel."
2. `XProvider` component — owns the actual state (`useState`), fetches/subscribes to data (`useEffect`), and supplies it via `<XContext.Provider value={...}>{children}</XContext.Provider>`.
3. `useX()` custom hook — `return useContext(XContext)` — a shortcut so components never import `useContext`/`XContext` directly.

**Placement rule:** Provider must sit *above* every component that needs the value, in the component tree. `ApplicationsProvider` had to sit **inside** `AuthProvider` because it needed `useAuth()` internally.

**AuthContext specifics:**
- `loading` state exists to prevent a flash of "logged out" UI before Firebase's first `onAuthStateChanged` response arrives: `{!loading && children}`.

**ApplicationsContext specifics:**
- Built to avoid duplicating the Firebase subscription logic across `Dashboard` and `Analytics` — one subscription, shared read access.
- Reused the *existing* `subscribeToApplications` service function rather than reinventing Firebase logic inside the Context.

**Interview Q&A**
- *What problem does Context solve?* Avoids prop drilling — global-ish state accessible to any descendant without manual prop passing at every level.
- *Does Context make data available everywhere in the app?* No — only to descendants of the Provider in the component tree.
- *Why build a custom hook (`useAuth`, `useApplications`) instead of calling `useContext` directly everywhere?* Encapsulation — consumers don't need to import/know about the Context object itself.
- *Why did ApplicationsProvider need to be nested inside AuthProvider?* It depends on `useAuth()` internally to know which user's data to subscribe to.

---

## 8. Protected & Public Routes

- `ProtectedRoute`: if `user` exists, render `children`; else `<Navigate to="/login" replace />`.
- `PublicRoute` (inverse): if `user` exists, redirect to `/`; else render `children` (used to keep logged-in users off `/login`/`/signup`).
- Both are just conditional wrappers using the `children` pattern — no special React feature beyond what you already know.
- Solves the redirect-after-login problem: since `user` updates via Context after successful login, a `PublicRoute` guard on `/login` catches that state change on next render and redirects automatically — no manual `navigate()` needed inside the login handler.

**Interview Q&A**
- *How do protected routes work in React Router v6 (no built-in feature for this)?* Build a wrapper component that checks auth state and either renders children or issues a `<Navigate>` redirect.
- *Why does redirecting after login "just work" via PublicRoute instead of manual navigation?* Login success updates Context state → triggers re-render → PublicRoute's condition (`user` exists) re-evaluates → redirects. Reactive, not imperative.

---

## 9. Firebase Realtime Database — Full CRUD

**Data model — nested per-user (chosen over flat + `userId` field):**
```
applications/{uid}/{pushId}: { company, role, status, date, ... }
```
Chosen because separation is *structural* — you can't accidentally query across users, unlike a flat collection requiring a `userId` filter every single time (easy to forget → data leak risk).

**Create:**
```js
const applicationsRef = ref(db, `applications/${uid}`)
const newRef = push(applicationsRef)   // generates a unique, collision-free key
return set(newRef, data)               // writes the data
```
`push()` before `set()`: two-step because `push()` alone gives you the generated key (useful to know separately), and Realtime DB keys are timestamp-based, avoiding collisions in concurrent/multi-tab writes (unlike sequential indices).

**Read (live subscription):**
```js
onValue(ref(db, `applications/${uid}`), (snapshot) => {
  const data = snapshot.val() || {}     // fallback for new users with no data
  const array = Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
  callback(array)
})
```
- Firebase stores lists as nested objects (`{key: value}`), not arrays — `Object.entries()` converts to `[key, value]` pairs so you can rebuild an array with `id` attached.
- `snapshot.val() || {}` guards against `null` (brand new user) before calling `Object.entries()` on it (which would crash on `null`).

**Update:**
```js
update(ref(db, `applications/${uid}/${appId}`), updatedData)
```
`update()` vs `set()`: `update()` only overwrites the fields provided, leaving others untouched. `set()` completely replaces the node — using it for edits risks wiping fields not included in the payload.

**Delete:**
```js
remove(ref(db, `applications/${uid}/${appId}`))
```
No data argument — deleting just needs a location, not a payload.

**Interview Q&A**
- *Why nested per-user data instead of a flat collection with a `userId` field?* Structural isolation — impossible to accidentally query another user's data; no risk of forgetting a filter.
- *Why `push()` then `set()` instead of one call?* `push()`'s generated key avoids write collisions in concurrent scenarios (unlike incrementing indices); the two-step also exposes the key if needed.
- *Difference between Realtime DB `onValue` and a normal fetch?* `onValue` is a persistent subscription — fires on every change automatically; a fetch is one-and-done.
- *Why `update()` instead of `set()` for edits?* `set()` overwrites the entire node; `update()` patches only the given fields, preventing accidental data loss.
- *Why `Object.entries()` on the snapshot data?* Firebase returns nested objects, not arrays; this converts to `[key, value]` pairs so you can reconstruct an array (which `.map()` in JSX needs) while preserving each item's unique key as an `id`.

---

## 10. `useState`, Immutability & Why `.push()` on State Is Wrong

- React decides whether to re-render by checking if new state is a **different reference** than old state — a fast `===` check, not a deep comparison.
- `array.push(x)` **mutates in place** — same reference, so React thinks nothing changed even though contents did → UI silently fails to update.
- Fix: always create a **new** array/object: `setState([...array, newItem])` or `{...obj, key: newVal}`.
- Tradeoff: creates extra objects (minor memory overhead, garbage-collected automatically) in exchange for O(1) reference-based change detection instead of expensive deep comparisons.

**Interview Q&A**
- *Why does React require immutable state updates?* Change detection is a cheap reference comparison; mutating in place produces the same reference, so React can't tell anything changed.
- *What's the tradeoff of creating new objects/arrays on every update?* Slightly more memory churn (garbage collected quickly) vs. the alternative of expensive deep-equality checks on every render — a deliberate performance tradeoff.

---

## 11. Async/Await, Race Conditions

- `handleAddApplication` is `async`; calling it *without* `await` means the calling code moves on immediately, not waiting for the Firebase write to actually finish.
- Bug caught in this project: Modal's `handleSubmit` closed and reset the form *before* confirming the save succeeded — fixed by making `handleSubmit` `async` and `await`-ing the call, so the UI only reacts after the operation truly completes (success or failure).

**Interview Q&A**
- *What happens if you call an async function without `await`?* Execution continues immediately without waiting; you lose the ability to know if/when it finished, and can't reliably sequence dependent code after it.
- *Why does UI feedback need to wait for a write to actually resolve?* Otherwise the UI can show false success (e.g. modal closing) even if the underlying operation failed.

---

## 12. Search & Filter (Client-Side, Not Server Queries)

- Chose client-side `.filter()` over a new Firebase query per keystroke — faster, no network round-trip for a simple substring/status match.
```js
applications.filter((app) =>
  app.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (statusFilter ? app.status === statusFilter : true)
)
```
- Both sides lowercased for case-insensitive match.
- `"".includes("")` is always `true` → empty search matches everything by default (no special-casing needed).
- `statusFilter ? ... : true` — empty string is falsy, so an unset filter short-circuits to "always true," meaning no status restriction.
- Distinguishing "genuinely zero applications" from "search matched nothing" required checking `applications.length === 0` (original list) separately from `filteredApplications.length === 0` (post-filter list) to show the right empty-state message.

**Interview Q&A**
- *Why filter client-side instead of querying Firebase per keystroke?* Data is already loaded locally via the live subscription; filtering in-memory is instant and avoids unnecessary network calls for what's essentially string matching on already-fetched data.
- *How does `.includes("")` always returning true simplify the "no filter applied" case?* No need for a separate `if (searchQuery === "") return true` branch — the empty string naturally matches everything.

---

## 13. Modals & Reusable Form Component (Add/Edit in One)

- Overlay: `fixed inset-0 bg-black/50` + `flex justify-center items-center` to center content.
- **Event bubbling bug & fix:** clicking inside the modal box also triggered the overlay's `onClick={onClose}` because clicks bubble up the DOM tree. Fixed with `onClick={(e) => e.stopPropagation()}` on the inner box, stopping the click from reaching the overlay.
- **Stacking context bug:** a card's `hover:scale-105` (uses `transform`) created a new CSS stacking context, letting a hovered card render *above* the modal despite the modal being `fixed`. Fixed with an explicit `z-50` on the modal overlay to force it to the top regardless of sibling stacking contexts.
- **One Modal, two modes (add vs edit):** controlled by a single `editingApp` prop/state — `null` = add mode, an application object = edit mode.
  - `useEffect` watching `[editingApp]` re-syncs `formData` whenever `editingApp` changes (since the Modal doesn't unmount/remount between add and edit — same instance, different props), including resetting to blank when going back to `null`.
  - `handleSubmit` branches: `editingApp ? onUpdateApplication(editingApp.id, formData) : onAddApplication(formData)`.

**Interview Q&A**
- *Why does a click inside a modal sometimes close it unintentionally?* Event bubbling — the inner click event propagates up to the overlay's own click handler unless stopped.
- *How do you stop a click from closing a modal it's inside?* `e.stopPropagation()` on the inner content's `onClick`.
- *Why did a hover effect break the modal's stacking order?* `transform` creates a new CSS stacking context; without an explicit `z-index` on the modal, sibling stacking contexts can render above it unpredictably.
- *How do you build one modal that both creates and edits records?* A single piece of state (`editingApp`, null or an object) drives both the pre-filled form data (via a `useEffect` reacting to that prop) and which write operation `handleSubmit` calls.

---

## 14. Recharts — Pie Chart

- Data must be shaped as `[{status, count}, ...]` before handing to Recharts.
- Built via `.map()` (one entry per status) + `.filter().length` (count of applications matching that status) inside the map callback.
- `<Pie dataKey="count" nameKey="status">` tells Recharts which fields to use for slice size vs label.
- `<Cell>` elements generated via `.map()` over the data, cycling through a fixed `COLORS` array with `COLORS[index % COLORS.length]` (modulo wraps around if more categories than colors).

**Interview Q&A**
- *How do you transform raw records into chart-ready data?* `.map()` over the category list, using `.filter().length` inside to compute each category's count.
- *What does the modulo trick (`index % COLORS.length`) accomplish?* Cycles through a fixed color palette indefinitely, reusing colors gracefully instead of running out or erroring.

---

## 15. Custom SVG Circular Progress Rings (Hand-Built, No Library)

**The core trick:** `stroke-dasharray` + `stroke-dashoffset` fake a partial circle fill.
- `stroke-dasharray = circumference` → makes the "dash" exactly as long as the full circle outline (looks solid).
- `stroke-dashoffset = circumference - (percentage/100) × circumference` → shifts the dash's starting point, hiding a proportional chunk of it.
  - `percentage = 100` → `dashoffset = 0` → nothing hidden, full ring shows.
  - `percentage = 0` → `dashoffset = circumference` → entire dash shifted out of view, ring looks empty.
- Two stacked `<circle>` elements: a gray "track" (always full) behind a colored "fill" circle using the dashoffset math.
- `transform="rotate(-90 60 60)"` — SVG circles start drawing from 3 o'clock by default; rotate -90° to start from 12 o'clock.
- `Math.PI` — built-in constant, more precise than typing 3.14159.

**Interview Q&A**
- *How do you render a percentage-based progress ring without a charting library?* SVG `stroke-dasharray`/`stroke-dashoffset` on a `<circle>`, computing dashoffset from `circumference - (percentage/100) × circumference`.
- *Why two circles (not one)?* One acts as the static background track; the other is the dynamically-offset colored fill layered on top.

---

## 16. `.find()` vs `.filter()` vs `.sort()`

- `.filter()` → returns a **new array** of all matches.
- `.find()` → returns the **first single matching item** (or `undefined` if none match) — wrong tool if you need to combine multiple matches (a real bug hit in this project: using `.find()` for two interview sub-statuses silently dropped one of them).
- `.sort((a, b) => ...)` → **mutates the array in place** (unlike map/filter). Comparator returns negative (a before b), positive (b before a), or 0 (equal).
  - For dates: `new Date(b.date) - new Date(a.date)` → descending (most recent first). Subtracting `Date` objects yields milliseconds difference, a meaningful number; subtracting raw date strings would not work.
  - Because `.sort()` mutates, always copy first when the array is shared elsewhere: `[...applications].sort(...)`, to avoid corrupting a shared Context's data.

**Interview Q&A**
- *When would `.find()` give a wrong result?* When you actually need to combine or count *multiple* matches — `.find()` stops at the first one and ignores the rest.
- *Why must you spread-copy an array before `.sort()`ing it if it's shared state?* `.sort()` mutates in place; sorting a shared reference (e.g. from Context) would silently reorder it for every other consumer too.
- *Why does `new Date(b.date) - new Date(a.date)` work for descending date sort?* Subtracting two `Date` objects yields a numeric millisecond difference; positive/negative sign tells `.sort()` which item goes first. Raw string subtraction wouldn't produce a meaningful number.

---

## 17. CSS/Layout Debugging — Real Bugs Solved

**Full-bleed sections inside a max-width layout:**
```css
w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]
```
Breaks an element out of a parent's `max-width` constraint to span the full viewport width, by using negative margins based on the difference between the viewport (`50vw`) and the parent's center point (`50%`).

**Horizontal scrollbar bug:** `100vw` includes the vertical scrollbar's width in some browsers, causing content to be marginally wider than the visible viewport → phantom horizontal scroll. Fixed narrowly with `overflow-x: hidden` on `html` only (not `body`).

**Sticky navbar breaking:** `position: sticky` requires no ancestor to be a "scroll container." Setting `overflow-x: hidden` on **both** `html` and `body` turned `body` into a scroll container, breaking sticky for everything inside it. Fix: apply the rule to `html` only.

**Fixed-height Navbar overlap on mobile:** `h-32` (fixed height) + wrapped content (multiple lines on narrow screens) caused overflow beyond the fixed box, with page content rendering on top of it. Fixed by removing the fixed height and letting padding size the element naturally.

**Responsive text sizing:** `text-4xl sm:text-6xl md:text-8xl lg:text-9xl` — different sizes apply progressively as the viewport crosses each breakpoint; the base (unprefixed) class is the mobile default.

**Interview Q&A**
- *How do you make a section break out of a max-width container to span the full viewport?* Negative margins calculated as `calc(50% - 50vw)` on both sides, with `width: 100vw`.
- *Why can `overflow-x: hidden` on `body` break `position: sticky`?* Any ancestor with a non-visible `overflow` becomes a scrolling container; sticky positioning is then constrained to that container's scroll area rather than the full page, breaking the intended "stick to viewport" behavior.
- *How does responsive Tailwind text sizing work?* Unprefixed class = default/mobile; each breakpoint prefix (`sm:`, `md:`, `lg:`) overrides it once the viewport reaches that width — mobile-first, progressively enhanced.

---

## 18. Miscellaneous Debugging Lessons

- **Tailwind never errors on invalid class names** (e.g. `bg-blue/60`, `border 2` with a space instead of hyphen) — they're silently ignored. No console warning. Always visually verify styling actually applied.
- **Default vs named exports** must match exactly between file and import (`export default X` → `import X from`; `export const X` → `import { X } from`).
- **`useContext`/hooks can only be called inside a component or another hook** — calling at module top-level throws.
- **Function declaration order matters** — using a `const` before its declaration line throws a reference error (hoisting doesn't apply to `const`/`let` the way it does to function declarations).
- **`git status` before committing** to verify sensitive files (like `.env`) aren't accidentally staged.

---

# Consolidated Interview Question Bank

1. Why does React need a build step (Vite/esbuild) for JSX?
2. What's the difference between a dependency and a devDependency?
3. What is the `children` prop and what pattern does it enable?
4. Why is using array index as a `key` risky, and when is it actually safe?
5. How does client-side routing differ from traditional multi-page navigation?
6. `Link` vs `<a>` — what's the practical difference?
7. What makes an input a "controlled component" in React?
8. Why use computed property names (`[e.target.name]`) in a shared `handleChange`?
9. Why does Firebase Auth's `onAuthStateChanged` go inside a `useEffect` with an empty dependency array?
10. What problem does the Context API solve, and what are its limits (who can access the value)?
11. Why did `ApplicationsProvider` need to be nested inside `AuthProvider`?
12. How do you build protected/public routes in React Router v6 (no built-in feature)?
13. Why is `applications/{uid}/{id}` (nested) safer than a flat collection with a `userId` field?
14. Why call `push()` before `set()` when creating a new database record?
15. What's the difference between Firebase's `onValue` and a normal one-time fetch?
16. Why use `update()` instead of `set()` when editing an existing record?
17. Why does React require new object/array references for state updates instead of mutating in place?
18. What happens if you call an `async` function without `await`, and why does that matter for UI correctness?
19. Why filter search results client-side instead of querying the database on every keystroke?
20. What causes a click inside a modal to accidentally close it, and how do you prevent that?
21. Why can a `hover:scale` effect break a modal's `z-index` stacking?
22. How do you transform raw records into chart-ready `{label, value}` data?
23. How do SVG `stroke-dasharray`/`stroke-dashoffset` fake a partial circular progress ring?
24. When would `.find()` silently give you a wrong result, and what's the fix?
25. Why must you copy an array before `.sort()`-ing it if that array is shared state?
26. How do you make a section break out of a max-width parent to span the full viewport?
27. Why can setting `overflow-x: hidden` on `body` break `position: sticky` elsewhere on the page?
28. How does Tailwind's responsive prefix system (`sm:`, `md:`, `lg:`) resolve which class applies at a given width?
29. Why does Tailwind silently ignore invalid/misspelled class names instead of erroring?
30. What's the tradeoff of storing an "add or edit" mode as a single object-or-null prop rather than a separate boolean flag?


# CareerSync — Milestone 13 & Security Rules Notes

Continuation of the main build notes. Covers form validation, auth error handling, and the Firebase Realtime Database security rules fix.

---

## 19. Custom Form Validation (No HTML `required`)

**Why custom over the native `required` attribute:** full control over error styling/messages to match the app's theme, instead of the browser's default validation tooltip.

**The pattern — three pieces:**

1. **`errors` state** — an object tracking which fields currently have a problem:
```js
const [errors, setErrors] = useState({})
```

2. **A `validateForm` function** — loops over just the *required* field names (not all of `formData`), checks each for emptiness, and builds an errors object:
```js
const validateForm = () => {
  const requiredFields = ["company", "role", "status", "date"]
  const newErrors = {}
  requiredFields.forEach((field) => {
    if (formData[field] === "") {
      newErrors[field] = `${field} is required`
    }
  })
  return newErrors
}
```
   - `formData[field]` — computed property *access* (reading a dynamic key), same underlying idea as `[e.target.name]` used earlier for *writing*.
   - `.forEach()` chosen over `.map()` here because the goal is a side effect (building up `newErrors`), not producing a new array from return values — `.map()` would be the wrong tool since its return value (an array of `undefined`s from an assignment expression) isn't what's needed.

3. **Gate `handleSubmit` on validation result:**
```js
const handleSubmit = async (e) => {
  e.preventDefault()
  const newErrors = validateForm()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return   // stop here — do NOT submit
  }
  setErrors({})
  // ...proceed with the actual add/update call
}
```
   - `e.preventDefault()` called **before** the validation check — ensures the page never reloads regardless of whether validation passes or fails. If it were called only *after* a passing check, a failed submission would fall through to the browser's native reload behavior.
   - `Object.keys(obj).length` — the standard way to check "does this object have any properties at all," used here to mean "are there any errors."

**Displaying errors inline, per field:**
```jsx
{errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
```
   - Conditional rendering with `&&`: if `errors.company` is `undefined` (no error), the `&&` short-circuits and renders nothing; if it's a truthy string, the `<p>` renders.
   - Placed directly inside each field's own wrapper `<div>`, immediately after that field's input — not in some central error-list block, since errors need to sit next to the field they describe.

**Interview Q&A**
- *Why validate manually instead of using HTML's `required` attribute?* Full control over error message content and visual styling; native validation UI is browser-default and inconsistent-looking across browsers.
- *Why call `e.preventDefault()` before the validation check rather than after?* So the page never reloads on a failed submission either — the native form-submit behavior needs to be stopped unconditionally, not only on success.
- *Why `.forEach()` instead of `.map()` when building the errors object?* `.forEach()` is for side effects (mutating `newErrors` as you go); `.map()` is for producing a new array from each item's return value — not what's needed here.
- *How does `{errors.field && <JSX>}` work as a conditional render?* Short-circuit evaluation — `undefined && anything` is `undefined` (renders nothing); `"some string" && <JSX>` evaluates to the JSX (renders it).

---

## 20. Mapping Raw Firebase Error Codes to User-Friendly Messages

**Problem:** Firebase's `error.message` is often technical/unfriendly (e.g. `"Firebase: Error (auth/wrong-password)."`), while `error.code` is a stable, predictable string identifier (e.g. `"auth/wrong-password"`).

**Pattern — a lookup object, same shape as `STATUS_COLORS`:**
```js
// utils/authErrors.js
export const getAuthErrorMessage = (errorCode) => {
  const messages = {
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/user-not-found": "No account found with this email.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-credential": "Incorrect email or password.",
  }
  return messages[errorCode] || "Something went wrong. Please try again."
}
```
- `messages[errorCode] || "Something went wrong..."` — same falsy-fallback pattern used elsewhere (`snapshot.val() || {}`). If the code isn't in the map, `messages[errorCode]` is `undefined` (falsy), so the fallback string is used instead — guarantees the user never sees `undefined` or a raw code for an error case that wasn't explicitly anticipated.
- Built as one **shared** file, imported into both `Login.jsx` and `Signup.jsx`, rather than duplicating the mapping in each — same reasoning as centralizing `STATUS_COLORS`/`STATUS_LABELS`.

**Interview Q&A**
- *Why use `error.code` instead of `error.message` for building custom error UI?* `code` is a stable, known set of string identifiers safe to map against; `message` is meant for developers/logs and can be verbose or inconsistent.
- *Why centralize this mapping in one shared file instead of writing it inline in each form?* Avoids duplicating the same lookup logic in multiple places — a single source of truth, easier to extend later.

---

## 21. Firebase Realtime Database Security Rules

**Why this exists:** Realtime Database defaults to one of two modes when created — **test mode** (open access, no restrictions, meant only for early development) or **locked mode** (denies everyone by default). Test mode rules **automatically expire** (Firebase emails a warning beforehand) and revert to a fully locked, deny-all state — meaning an app relying on test mode will break entirely for every user once the window closes, unless real rules are published first.

**The rule structure — mirrors the actual data tree:**
```json
{
  "rules": {
    "applications": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

**Breaking it down:**
- `"applications"` — matches the literal top-level key in the data tree.
- `"$uid"` — a **wildcard segment**. The `$` prefix means "match any key at this level in the tree, and let this rule refer to that specific key's value as `$uid`." This lets one rule apply uniformly to every user's branch, rather than needing a hardcoded rule per user.
- `".read"` / `".write"` — special rule keys (not real data) whose values are JavaScript-like boolean expressions, evaluated per request.
- `auth != null` — checks a request is coming from an authenticated (logged-in) user at all.
- `auth.uid === $uid` — the actual access-control check: compares **who is making the request** (`auth.uid`, from their Firebase Auth session) against **which user's branch they're trying to access** (`$uid`, from the path itself). These are two independently-determined values — a malicious or careless client could construct a request pointing at any path (Firebase config is public, visible in frontend JS), but this rule ensures the request is only fulfilled if the requester's own identity matches the branch being requested.

**Why `&&` order matters (short-circuit evaluation):** if `auth != null` evaluates to `false`, JavaScript never evaluates `auth.uid === $uid` at all — the whole expression short-circuits to `false` immediately. This matters practically too: attempting `auth.uid` when `auth` is `null` would itself be invalid (`null.uid`), so checking `auth != null` first isn't just a logical convenience, it prevents a runtime error in the rule evaluation.

**Interview Q&A**
- *What happens to a Firebase Realtime Database if test-mode rules expire and nothing replaces them?* Access is denied to everyone, including the app's own legitimate authenticated users — the database locks down completely, not just "loses some security."
- *What does the `$` prefix mean in a Realtime Database rule path?* A wildcard — matches any key at that position in the tree, and binds its actual value to that variable name for use inside the rule expression.
- *Explain `auth.uid === $uid` — why are these two different things?* `$uid` is the user-branch being *requested* (from the path); `auth.uid` is the identity of *whoever is making the request* (from their session). The rule only allows access when they match — otherwise, any authenticated user could read/write any other user's data by simply pointing at a different path.
- *Why check `auth != null` before `auth.uid === $uid` rather than the reverse order?* Short-circuit evaluation avoids evaluating `auth.uid` when `auth` doesn't exist (which would error), and also serves as the first, cheapest gate — reject unauthenticated requests immediately without further checks.
- *Is a Firebase project's config (API keys, project ID) sensitive information that needs to be hidden from the client?* No — it's expected to be publicly visible in frontend code; real security comes from properly scoped Security Rules, not from hiding the config.

---

# Additional Interview Questions (Milestone 13 + Security)

31. Why choose custom form validation over the browser's native `required` attribute?
32. Why must `e.preventDefault()` run regardless of whether validation passes or fails?
33. What's the difference in intent between `.forEach()` and `.map()`, and how do you decide which to use?
34. How does `{condition && <JSX/>}` work as a lightweight conditional render?
35. Why map Firebase's `error.code` to custom messages instead of showing `error.message` directly to users?
36. What is the practical risk of leaving a Realtime Database in test mode indefinitely?
37. What does a `$variable` wildcard do in a Firebase Security Rule path?
38. Walk through how `auth.uid === $uid` prevents one authenticated user from accessing another's data.
39. Why is it safe for Firebase config values to be publicly visible in client-side code?
40. Why does evaluation order matter in a rule like `auth != null && auth.uid === $uid`?