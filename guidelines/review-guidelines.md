# Code Review Guidelines for LLMs

These rules are designed to guide a local LLM through reviewing code in a consistent, safe, and maintainable manner. Each section outlines best practices and anti-patterns the model should recognize and respond to during file-by-file review.

## Supported Environments

### Browsers
- Edge 79+
- Chrome 71+
- Firefox 67+
- Safari 13.1+

### Node.js Versions
- 20.x.x

### ECMAScript Versions
- ES2020

## Prerequisites for Reviewing Pull Requests

1. Go to the Jira task and thoroughly read the requirements. Consider how you would approach solving this task.
2. Run the branch with the code on your local machine. Ensure that all requirements are met and check for any errors or warnings in the console.

## Coding Standards and Best Practices

### JavaScript Review Objectives
When reviewing JavaScript code, ensure the following:

### 1. JavaScript
Always use ES imports instead of CommonJS.

#### 1.0 Component Files Structure

```
Button/
├── Button.module.scss
├── index.tsx
├── Button.constants.ts
├── Button.types.ts
├── hooks/
│   └── useSmth.ts
├── utils/
│   ├── transformSmth.ts
│   └── getInitialProps.ts
├── components/
│   └── SubButton/
│       ├── SubButton.tsx
│       └── Button.module.scss
├── index.ts
└── tests/
    ├── mockedData/
    │   └── Button.ts
    └── Button.test.tsx
```

#### 1.1 Variable Names

❌ Do not use variable names that are not nouns.  
❌ Do not include special symbols in variable names.  
✅ Name boolean variables as questions.

```javascript
// ❌
const price$10 = 10;
const valid = false;

// ✅
const price10Dollars = 10;
const isValid = false;
```

#### 1.2 Function Names

❌ Function names should not be ambiguous or non-verbs.  
✅ Function names must clearly and accurately describe what the function does and should be verbs.

```javascript
// ❌
function age() {} // bad naming

// ✅
function verifyAge() {}

// ❌
getAge(user) {
  validateName(user.name) // "name" shouldn't be validated here
  return user.age
}

// ✅
getAge(user) {
  return user.age
}
```

#### 1.3 Multiple Nested Ternary Operators

❌ Do not allow nested ternary operators.  
✅ Instead, suggest breaking the logic into separate variables or `if` statements.

```javascript
// ❌
return isUS ? (isStateAllowed ? thirdValue : fourthValue) : secondValue;

// ✅
const isUS = firstValue ? thirdValue : fourthValue;
return isSomeConditionTruly ? isUS : secondValue;
```

#### 1.4 Do Not Use Empty Returns

❌ Avoid returning nothing explicitly (empty return).  
✅ Return `undefined` explicitly when needed.

```javascript
// ❌
function validateCondition() {
  if(!value) {
    return
  }
}

// ✅
function validateCondition() {
  if(!value) {
    return undefined
  }
}
```

#### 1.5 Use Constants Instead of Plain Text/Number

❌ Do not use plain numbers or text literals directly in code.  
✅ Use constants with descriptive names.

```javascript
// ❌
if (user.type === 4) {
  // do smth here
}

// ✅
const GUEST_TYPE = 4;
if (user.type === GUEST_TYPE) { 
  //do smth here 
}
```

#### 1.6 Multiple Async Functions With Promise.all([…])

❌ Avoid awaiting async functions sequentially when they are independent.  
✅ Use `Promise.all()` to run async operations in parallel.

```javascript
// ❌
const translationProps = await getTranslationProps()
const translations = await getTranslationsFromMemory()

// ✅
let [translationProps, translations] = await Promise.all([
  getTranslationProps(),
  getTranslationsFromMemory(),
])
```

#### 1.7 Prefer Relative Imports Based on TS Config

❌ Avoid unnecessary path segments in imports when configured in `tsconfig.json`.  
✅ Use simplified relative imports to improve readability.

```javascript
// ❌
import Custom404 from 'src/pageContainers/Custom404';

// ✅
import Custom404 from 'pageContainers/Custom404';
```

### React/Next.js Standards Review Objectives
When reviewing React/Next.js code, ensure the following:

### 2. React/Next.js Standards

#### 2.1 Avoid Large Components

❌ Component exceeds 70 lines.  
✅ Divide large components into smaller, focused components.  
✅ Component name must clearly describe its purpose.  
✅ Only one React component per file.

```javascript
// ❌
const Component = () => {
  // Component exceeds 70 lines
};

// ✅
const Component = () => {
  // Code related only to a particular component. Less than 70 lines...
};
```

#### 2.2 Do Not Perform Any Calculation in the Render

❌ Do not perform calculations or data transformations inside the render method or JSX.  
❌ Do not use custom rendering functions inside JSX like `{renderInput()}`.  
✅ Move sorting/calculation logic to selectors or utility functions outside the component.  
✅ Avoid nested components inside render.

```javascript
// ❌
const Component = () => {
  return (
    <Formik>
      {renderInput()}
      ... other code
    </Formik>
  )
};

// ✅
const Input = () => {  
  return ( /* code */ )
};
const Component = () => {  
  return (
    <Formik>
      <Input />
      ... other code
    </Formik>
  )
};

// --------------------------------------------------------

// ❌
const Component = () => {
  const allGames = useAppSelector(getGamesSelector)
  const newGames = allGames.filter(i => i.tags.includes('new')).sort(...)  
  return (
    <GamesList games={newGames} />
  )
};

// ✅
const Component = () => {
  const newGames = useAppSelector(getNewGamesSelector) // selector returns already sorted games
  return (
    <GamesList games={newGames} />
  )
};

// --------------------------------------------------------

// ❌
export default function ParentComponent(props) {
  function InnerComponent() { // nested component inside render
    // ...
  }
  return (
    <InnerComponent />
  );
}

// ✅
function InnerComponent() { // move nested component out of render
  // ...
}
export default function ParentComponent(props) {
  return (
    <InnerComponent />
  );
}
```

#### 2.3 Do Not Use Interfaces for Props Validation

❌ Do not use `interface` for props.  
✅ Use `type` for props validation.

```typescript
// ❌
interface ComponentProps {
  name: string
}
const Component = (props: ComponentProps) => {
  // code
}

// ✅
type Props = {
  name: string
}
const Component = (props: Props) => {  
  // code
}
```

#### 2.4 Keep All Texts in translation CMS

❌ Do not hardcode text strings inside components.  
✅ Store all text strings in CMS.  
✅ Use Rich text component for multi-line strings.

```jsx
// ❌
const Component = (props: Props) => {
  return <span>Promo page</span>
}

// ✅
const Component = (props: Props) => {
  const t = useTranslation()
  return <span>{t('promo_page_title')}</span>
}

// --------------------------------------------------------

// ❌
<span>
  {t('for')} {t('gold_coin_gc')} {t('jackpots')}
<span>

// ✅
<RichText
  field={t('jackpotbottombar.gc_desc_text')}
  components={{
    paragraph: ({ children }) => <p className={classes.extraInfo}>{children}</p>,
    strong: ({ children }) => (
      <span>
        {children} {GCContribute}
      </span>
    ),
  }}
/>
```

#### 2.5 Do Not Use Old Next Router

❌ Do not use `useRouter` from `'next/router'`.  
✅ Use `useRouter` from `'next/navigation'`.  
✅ Prefer custom navigation hook wrappers that support multi-language mode.

```javascript
// ❌
import { useRouter } from 'next/router'

// Better:
import { useRouter } from 'next/navigation'

// ✅
import { useRouter } from 'app/context/navigation'
```

#### 2.6 Try to Move Additional Logic from Component to Custom Hook

❌ Do not keep complex logic or state management inside components.  
✅ Extract logic into custom hooks.

```javascript
// ❌
function SomeComponent() {
  const [username, setUsername] = useState(null)
  const [isError, setIsError] = useState(false)
  useEffect(() => {
    const username = getUserAccount()
    if (username) {
      setUsername(username)
    } else {
      setIsError(true)
    }
  }, [])
  if(username) {
    return <Username username={username} />
  }
  return null
}

// ---------------------------------------------------------

// ✅
// file useUsername.ts
function useUsername() {
  const [name, setName] = useState(null);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const username = getName();
    if (username) {
      setName(username);
    } else {
      setIsError(true);
    }
  }, []);
  return { name, isError };
}

// file SomeComponent.tsx
function SomeComponent(){
  const { name, isError } = useUsername();
  if (isError) {
    return <ErrorPage />;
  }
  return name ? <Username username={username} /> : <Spinner />;
}
```

#### 2.7 Avoid Using 2+ Lines of Code Within Inline Functions

❌ Do not use multi-line inline functions inside JSX props.  
✅ Define handler functions outside JSX and pass them as references.

```javascript
// ❌
function SomeComponent() {
return <Button onClick={() => {
doSomething()
doSomethingElse()
}} />
}

// ✅
function SomeComponent() {
const handleClick = () => {
doSomething()
doSomethingElse()
}

return <Button onClick={handleClick} />
}
```

#### 2.8 Run Unrelated Async Operations in Parallel Whenever Possible

❌ Avoid awaiting unrelated async operations sequentially.  
✅ Use `Promise.all()` or `Promise.allSettled()` to run them in parallel.  
✅ Prefer making components independent and use `<Suspense>` wrappers for async operations.

```javascript
// ❌
export default async function SomePage() {
// 🚫 avoid doing this, it’s slow
const thing1 = await asyncThing1()
console.log(thing1)

const thing2 = await asyncThing2()
console.log(thing2)

return (
<PageContainer thing={thing1}>
<NestedPageContainer thing={thing2} />
</PageContainer>
)
}

// Better:
export default async function SomePage() {  
const [thing1, thing2] = await Promise.allSettled([asyncThing1(), asyncThing2()]);

return (
<PageContainer thing={thing1}>
<NestedPageContainer thing={thing2} />
</PageContainer>
)
}

// ✅
// every component wrapped with <Suspense> and async operations performed inside components

// PageContainer.tsx
export default async function PageContainer() {
const thing1 = await asyncThing1()

  <PageContainerContent thing1={thing1} />
}

// NestedPageContainer.tsx
export default async function NestedPageContainer() {
const thing2 = await asyncThing2()

  <NestedPageContainerContent thing1={thing2} />
}

// SomePage.tsx
export default async function SomePage() {  
return (
<>
<Suspense fallback={<PageContainerSkeleton />}>
<PageContainer />
</Suspense>

      <Suspense fallback={<NestedPageSkeleton />}>
        <NestedPageContainer />
      </Suspense>
    </>
)
}
```

#### 2.9 Always Test Negative Scenarios. Do Not Test "Happy Path" Only

❌ Do not test only success cases.  
✅ Always include negative scenarios, especially for async code.

```javascript
// ❌
const data = await getData()
const parsedData = parseData(data)

// ✅
try {
const data = await getData()
const parsedData = parseData(data)

return parsedData
} catch (error) {
// log error message in console or report it into Sentry
}
```

#### 2.10 Prevent Multiple Form Submissions and API Calls on Clicking Submit Buttons

❌ Do not allow multiple form submissions by clicking submit buttons repeatedly.  
✅ Add disabled state to buttons during async operations to prevent redundant API calls.

```javascript
// ❌
const saveInfo = async () => {
fetch(...)
}
// without disabling button it is possible to click it multiple times, which triggers redundant API calls
<button onClick={saveInfo}>Save</button>

// ✅
const saveInfo = async () => {
setIsSaving(true)
fetch(...)
}
<button disabled={isSaving} onClick={saveInfo}>Save</button>
```

#### 2.11 Avoid Using "sweepstake" Keyword in Components Props

❌ Avoid using the keyword "sweepstake" in component prop names to prevent issues with SSR and marketing platforms.  
✅ Use alternative naming conventions.

```typescript
// ❌
type Props = {
sweepstakeEnabled: bool,
minBetSweepstake: number,
goldSweepstakeText: string
}

function SomeComponent(props: Props) {
return <p> some text </p>
}

// ✅
type Props = {
scEnabled: bool,
minBetSc: number,
goldLackycoinText: string
}

function SomeComponent(props: Props) {
return <p> some text </p>
}
```

#### 2.12 Do Not Use "next/image" for Images Stored in Google Cloud

❌ Do not use `next/image` for images hosted on Google Cloud.  
✅ Use standard HTML `<img>` tags or custom components that directly use Google Cloud URLs.

```jsx
// ❌
import Image from 'next/image'

function GmailImg() {
return <Image src={`${process.env.IMG_ORIGIN}/icons/gmail.svg`} alt='gmail icon' width={24} height={24} />
}

// ✅
function GmailImg() {
return <img src={`${process.env.IMG_ORIGIN}/icons/gmail.svg`} alt='gmail icon' width={24} height={24} />
}
```

### HTML/CSS Review Objectives
When reviewing HTML and CSS code, ensure the following:

### 3. HTML/CSS

#### 3.1 Utilize Semantic Tags as Much as Possible

❌ Avoid using non-semantic tags like `<div>` and `<span>` for structural elements.  
✅ Use semantic HTML elements such as `<section>`, `<header>`, `<h3>`, etc. for accessibility.

```jsx
// ❌
<div className={cx(classes.root, 'mt-modal')}>
  <div className='mt-modal-header'>
    <span className={cx(classes.header, 'modal-title')}>{t('modal.title')}</span>
  </div>
</div>

// ✅
<section className={cx(classes.root, 'mt-modal')}>
  <header className='mt-modal-header'>
    <h3 className={cx(classes.header, 'modal-title')}>{t('modal.title')}</h3>
  </header>
</section>
```

#### 3.2 Do Not Animate Left, Right, Width and Other CSS Properties

❌ Avoid animating CSS properties that cause layout shifts (e.g., left, right, width).  
✅ Animate safe properties like `translate`, `rotate`, `opacity` to avoid CLS and improve performance.

Read more - [How to create high-performance CSS animations | Articles | web.dev](https://web.dev/articles/animations-guide)

#### 3.3 Ensure That Inline Elements Do Not Contain Block Elements

❌ Do not put block elements inside inline elements.

```html
<!-- ❌ -->
<span>
  <p>Some text</p>
</span>
```

#### 3.4 Make Sure That Interactive Elements Have Clear Focus Indication

✅ Buttons, links, form elements, etc. must have clear focus indication for accessibility.

#### 3.5 Keep the DOM Tree as Small as Possible. Avoid Using Redundant Wrappers

✅ Avoid adding unnecessary wrapper elements. Use Flexbox and Grid techniques to reduce DOM nodes.

#### 3.6 Avoid Deep Nesting in CSS Selectors

❌ Avoid deep nesting of CSS selectors.  
✅ Create new classes to reduce nesting depth for maintainability and performance.

```css
/* ❌ */
.root {
  div {
    h2 {
    }
  }
}

/* ✅ */
.root {}
.container {}
.title {}
```

### 4. General Requirements

- **Package-lock File Update**: Whenever changes are made to the `package.json` file, it is mandatory to update and commit the `package-lock.json` file. Don't forget to commit the lock file.

## Review Output Format (for LLM)
For each file, return a list of detected issues and suggestions in the following format:

- 🔍 Issue: [short description]
  - 💡 Suggestion: [how to fix it]
  - 📍 Location: [line number or code snippet]

Always use concise bullet points. Prioritize clarity and avoid redundant suggestions.
