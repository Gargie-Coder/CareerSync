# CareerSync — Enhancement Session Notes

Detailed record of everything added/fixed, in the order it happened. Written so you can explain each change and the reasoning behind it in an interview.

---

## 1. Modal dark mode fix

**What was wrong:** `Modal.jsx` (the Add/Edit Application form) had every class hardcoded to light mode — `bg-amber-50`, `text-black`, `border-gray-300` — while every other page in the app respected the `ThemeContext` dark mode toggle. Opening the modal in dark mode looked broken/inconsistent.

**What changed:** Replaced every hardcoded light class with a paired `dark:` variant, matching the pattern already used elsewhere in the app (e.g. `bg-white dark:bg-slate-800`). Also matched the gradient submit button style used on Dashboard/Navbar instead of a plain blue button, and made the modal title change dynamically ("Update Application" vs "Apply Now and Track later" depending on whether you're editing or creating).

**How to explain it:** "I noticed one component hadn't been updated when dark mode was added to the rest of the app — a common real-world scenario when a design system evolves incrementally. I fixed it by applying the same `dark:` variant pattern already established elsewhere, rather than inventing new styling."

---

## 2. Modal centering bug (a real CSS bug, worth knowing well)

**What happened:** While fixing dark mode, I added `max-h-[90vh] overflow-y-auto` to make the modal scrollable on smaller screens. This introduced a **new** bug: at 100% browser zoom, the modal's title and close button became completely invisible — not just off-screen, genuinely inaccessible, even by scrolling.

**Root cause (the important part):** The modal box had `flex flex-col justify-center items-center` — meaning its content was vertically centered using `justify-center`. When you combine `justify-content: center` with `overflow-y: auto` on the same flex container, and the content is taller than the container, browsers center the overflow — hiding equal amounts above and below — but the scrollable area often can't reach the hidden top portion. This is a known CSS flexbox + overflow interaction bug, not something specific to this project.

**The fix:** Removed `justify-center` from that box, keeping only `items-center` (which centers children horizontally, and doesn't have this overflow interaction problem). Content now starts at the top and scrolls downward normally — completely standard behavior.

**Follow-up mistake worth mentioning honestly:** When first told to remove `justify-center`, it was removed from the wrong element — the *outer* backdrop overlay div (which centers the whole modal box in the viewport) instead of the *inner* modal box (which centers the form fields inside the box). This caused the modal to shift to the left edge of the screen. Fixed by restoring `justify-center` to the outer div and removing it only from the inner one. Two nearly-identical-looking lines of code, easy to confuse — a good example of why reading class names carefully (and knowing what each wrapping div is for) matters.

**How to explain it:** "I introduced a subtle CSS bug myself while fixing something else, diagnosed it correctly by understanding how flexbox centering interacts with overflow, and fixed it with a one-word change. It's a good example of how a well-intentioned fix can introduce a new problem, and why testing across zoom levels/screen sizes matters."

---

## 3. Modal spacing tightened

Reduced padding (`p-6` → `p-5`), title size (`text-3xl` → `text-2xl`), title margin (`pb-4` → `pb-2`), field gaps (`gap-4` → `gap-3`), and Notes textarea rows (4 → 3). Also bumped `max-h-[90vh]` → `max-h-[94vh]`. Purely cosmetic, reduces how much the modal needs to scroll at full browser zoom without removing any fields.

---

## 4. Dashboard: stats summary strip

**What it is:** Four small cards above the toolbar showing Total Applications, Active Pipeline, In Interviews, and Offers — computed live from the existing `applications` array using plain `.filter(...).length` calls. No new state, no new libraries.

**Why it's useful:** Gives an at-a-glance pipeline overview without navigating to the separate Analytics page.

**Key implementation detail:** The counts are derived from `applications` (the full, unfiltered list) — not `filteredApplications` or `sortedApplications` — so the numbers stay stable while searching/filtering, rather than changing as you type in the search box.

---

## 5. Dashboard: sorting

**What it is:** A dropdown next to the existing search/status filter, with three options: Newest first, Oldest first, Company A-Z.

**Implementation:** `[...filteredApplications].sort((a, b) => {...})` — the spread (`[...array]`) copies the array before sorting, so the original `filteredApplications` reference is never mutated. `.sort()` mutates in place, so sorting a copy instead of the original is a deliberate defensive habit.

```jsx
const sortedApplications = [...filteredApplications].sort((a, b) => {
  if (sortBy === "company-asc") return a.company.localeCompare(b.company)
  if (sortBy === "oldest") return new Date(a.date) - new Date(b.date)
  return new Date(b.date) - new Date(a.date) // "newest" (default)
})
```

**How to explain it:** "Sorting happens after filtering, on a defensive copy of the array, so the original filtered list stays untouched in case other code depends on it."

---

## 6. Dashboard: CSV export

**What it is:** A download button that exports all applications as a `.csv` file, openable in Excel/Sheets.

**How it works, no libraries used:**
1. Builds a 2D array: header row + one row per application.
2. Wraps every cell in quotes and escapes existing quotes (`cell.replace(/"/g, '""')`) — this handles the case where a note or company name contains a comma or a quote character, which would otherwise corrupt the CSV structure.
3. Joins everything into one big string with commas between cells and newlines between rows.
4. Uses the browser's `Blob` API to turn that string into a file-like object, `URL.createObjectURL()` to get a temporary downloadable link, and a programmatically-created `<a>` tag with `.click()` to trigger the download — then `URL.revokeObjectURL()` to clean up the temporary URL afterward.

**How to explain it:** "This uses only standard browser APIs — Blob and object URLs — rather than a CSV library, since the format is simple enough to build by hand, and it's a good demonstration of understanding how file downloads work at the browser level."

---

## 7. Dashboard: stale-application badges

**The helper function:**
```jsx
function daysSince(dateString) {
  const appliedDate = new Date(dateString)
  const today = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const diffInMs = today - appliedDate
  return Math.floor(diffInMs / msPerDay)
}
```
Subtracting two `Date` objects in JavaScript automatically coerces them to numbers (milliseconds since Jan 1 1970), giving elapsed time in milliseconds. Dividing by milliseconds-per-day and flooring gives a whole number of days.

**The badge logic:**
```jsx
const isStale = app.status !== "Rejected" && app.status !== "Offer" && daysSince(app.date) >= STALE_THRESHOLD_DAYS
```
`STALE_THRESHOLD_DAYS = 14` is a named constant (not a magic number) so it's easy to justify and tune. Rejected/Offer are deliberately excluded — they're closed outcomes, so flagging them as "needs follow-up" would be noise.

**Structural JS detail worth knowing:** Because computing `isStale` requires a line of logic *before* returning JSX, the `.map()` callback had to change from an **implicit return** arrow function (`(app) => (<div>...</div>)`) to a **block-bodied** one with an explicit `return` (`(app) => { const isStale = ...; return (<div>...</div>) }`). This meant the closing brackets at the end of the map also had to change to match — a common source of bugs when converting between the two arrow function styles.

**How to explain it:** "The staleness check reuses the same `daysSince()` helper as elsewhere, and I deliberately excluded terminal statuses so the signal stays meaningful — only applications that are still 'in flight' get flagged."

---

## 8. Google Sign-In — code side

**Files touched:** `AuthContext.jsx`, `Login.jsx`, `Signup.jsx`, `authErrors.jsx`.

**AuthContext.jsx:**
```jsx
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
```
Exposed via the context `value` object alongside the existing `login`/`signup`, so any page can call `useAuth().signInWithGoogle()`.

**Login.jsx / Signup.jsx:** Added a "Continue with Google" button below the existing form, separated by an "OR" divider, using the `FcGoogle` icon from `react-icons/fc`. Critically, the button has `type="button"` — without this, since it sits inside a `<form>`, clicking it would have submitted the surrounding email/password form instead of triggering Google sign-in.

**authErrors.jsx:** Added a message for `auth/popup-closed-by-user` — the error Firebase throws when someone opens the Google popup and closes it without picking an account. This is normal user behavior, not a real error, so it needed its own friendly message rather than falling through to the generic "Something went wrong."

---

## 9. Google Sign-In — infrastructure side (the long part)

This is the part most tutorials skip, and the part actually worth understanding deeply for an interview, since it's genuine system-design/debugging experience.

### 9a. Enabling the provider
Firebase Console → Authentication → Sign-in method → Google → toggle Enable, set a support email, Save. This alone is not enough to make it work — it just tells *Firebase* to accept Google as a login method.

### 9b. "Access blocked: This app's request is invalid" / redirect_uri_mismatch
This error came from **Google's** side, not Firebase's — a separate system. The underlying cause: Google's OAuth system checks two different things independently:

- **Authorized JavaScript origins** — checked the moment your page calls Google to start the sign-in flow. Answers "which website is allowed to initiate this request?"
- **Authorized redirect URIs** — checked when Google needs to hand control back after the user picks an account. Answers "which exact destination is this handoff allowed to go to?"

Firebase's `signInWithPopup` always redirects through a fixed URL on Firebase's own domain — `https://<project-id>.firebaseapp.com/__/auth/handler` — regardless of what domain your actual app is running on. That page then relays the login result back to your app's popup window using `window.opener` and `postMessage`.

**Why this matters / why it's designed this way:** if Google redirected straight back to *your* app's domain instead of Firebase's fixed handler, every domain you ever deployed to (localhost, Vercel, a future custom domain) would need a *new* redirect URI registered. By always bouncing through Firebase's own domain first, the redirect URI never needs to change — only the JavaScript origin list needs a new entry per domain.

**Fix:** In Google Cloud Console → Google Auth Platform → Clients → the auto-created Web client → added the Firebase handler URL to Authorized redirect URIs, and `http://localhost:5173` to Authorized JavaScript origins.

### 9c. A real bug: doubled project name in `.env`
`VITE_FIREBASE_AUTH_DOMAIN` in the local `.env` file somehow contained `careersync-careersync-f6ec9.firebaseapp.com` — the project name duplicated. This only broke Google sign-in specifically (not email/password), because `authDomain` is only used by the popup/redirect OAuth flow, not by direct email/password authentication. Fixed by correcting it to the actual single value from Firebase Console → Project settings → Your apps → SDK config.

### 9d. Same bug did NOT carry over to Vercel automatically
Key concept: **`.env` files are gitignored and never pushed to GitHub.** Vercel has its own, completely separate copy of every environment variable, set manually in its dashboard. Fixing the local `.env` file had zero effect on the deployed site — Vercel's stored value needed to be checked/corrected independently, then the site **redeployed** (env var changes don't apply retroactively to an already-built deployment — a new build is required).

### 9e. Same redirect_uri_mismatch problem again, once deployed
Even with the env var fixed, Google sign-in failed with the same class of error once live on Vercel, for a distinct reason: the *deployed* domain (`career-sync-ns6u.vercel.app`) had never been added to either allow-list — only `localhost` had. Fixed by adding:
- `career-sync-ns6u.vercel.app` to Firebase Console → Authentication → Settings → Authorized domains
- `https://career-sync-ns6u.vercel.app` to Google Cloud Console's Authorized JavaScript origins

No new redirect URI was needed for Vercel — the existing Firebase handler URL already covers every domain the app runs on, by design (see 9b).

**How to explain the whole Google Sign-In saga in an interview:** "Implementing the button itself was the easy part. The real work was understanding that OAuth has two independent trust checks — where a request originates, and where Google is allowed to hand control back to — and that Firebase deliberately fixes the second one to its own domain so you only ever have to manage the first one per environment. I also learned that environment variables aren't portable between local dev and a hosting platform like Vercel — they have to be configured and redeployed independently."

---

## 10. Priority Score feature — built, then deliberately removed

**What was built:** A rule-based (not AI/ML) score per application: a base score by status (Applied=10, Phone Screen=20, HR Interview=30, Technical Interview=40, Offer=100, Rejected=0), with a −20 point penalty if the application was stale (reusing the same `daysSince()`/`STALE_THRESHOLD_DAYS` logic), mapped to a HIGH/MEDIUM/LOW label.

**Why it was removed:** Testing against real data revealed a genuine design flaw — the staleness penalty was dragging down applications that had progressed furthest (e.g. reached Phone Screen or HR Interview, then gone quiet) into the same LOW bucket as brand-new, unpromising applications. This is backwards: an advanced-but-stale application usually deserves *more* attention, not less. The score was conflating two different questions — "how good is this opportunity" and "how urgently does it need action" — into one confusing number.

**Why this is worth mentioning in an interview anyway:** Building a feature, testing it against real data, catching that its output didn't actually make sense, and removing it rather than shipping something misleading is a legitimate and honest engineering story — arguably more interesting than a feature that "just worked." It also demonstrates the difference between a feature being *technically correct* (it built, it ran, no bugs) and *conceptually sound* (its output actually made sense) — two different bars, and only the code was checked for the first one until real data exposed the second.

---

## Quick feature list (for a slide / summary)

- Dark mode fix for the Add/Edit modal
- Fixed a flexbox + overflow CSS bug hiding the modal's header
- Pipeline stats summary (Total / Active / Interviews / Offers)
- Sort control (Newest / Oldest / Company A-Z)
- CSV export of all applications
- Stale-application detection (14+ days untouched) with visible badges
- Google Sign-In via Firebase Authentication (OAuth 2.0)
- Fixed a duplicated-project-name bug in Firebase config
- Configured OAuth domain allow-listing across local dev and production (Vercel) environments independently

## Honest gaps (if asked "what would you improve")

- `isStale` is computed slightly differently in two places (inline in the render, and previously inside the removed priority function) — could be consolidated into one shared helper.
- No automated tests (Jest/Vitest) — validated manually via build + visual check each time.
- The 14-day staleness threshold and CSV export are not currently configurable by the user (hardcoded constants) — a reasonable "future work" answer.