# Lecture 11 — Data Passing Patterns and the Problem They Create
# المحاضرة الحادية عشرة — أنماط تمرير البيانات والمشكلة التي تُولِّدها

---

## Introduction | مقدمة

One of the most fundamental challenges in React and React Native is answering a simple question:

**"How does data move between components?"**

There are three relationships to understand:

1. **Parent → Child** — The most natural flow. A parent passes data down as props.
2. **Child → Parent** — Requires a callback function (lifting state up).
3. **Child → Child (Sibling)** — The difficult case. Requires routing data through a shared ancestor.

The deeper the component tree, the harder this becomes. This problem, known as **Prop Drilling**, eventually becomes unmanageable — and that is precisely the problem Redux (and similar tools) was built to solve.

أحد أبرز تحديات React هو كيفية تحريك البيانات بين المكوِّنات. هناك ثلاث علاقات:
1. **الأب ← الابن** — التدفق الطبيعي.
2. **الابن ← الأب** — يتطلب دالة callback.
3. **ابن ← ابن (أشقاء)** — الحالة الصعبة. يتطلب المرور عبر سلف مشترك.

---

## Part 1: Parent → Child | الأب إلى الابن

### Concept

Data flows **downward** via **props**. The parent owns the data (state or a constant) and passes it as an attribute to the child component. The child receives it as read-only.

البيانات تتدفق **للأسفل** عبر **الـ props**. الأب يملك البيانات ويُمرِّرها للابن كخاصية. الابن يستقبلها للقراءة فقط.

---

### Diagram | الرسم التخطيطي

```
┌─────────────────────────────────────┐
│           ParentComponent           │
│                                     │
│   const [username] = "Ahmad"        │
│   const [score]    = 95             │
│                                     │
│   <ChildA username={username} />    │
│   <ChildB score={score} />          │
└───────────┬─────────────┬───────────┘
            │ username    │ score
            │ (prop)      │ (prop)
            ▼             ▼
┌───────────────┐   ┌─────────────────┐
│    ChildA     │   │     ChildB      │
│               │   │                 │
│  props.       │   │  props.score    │
│  username     │   │  = 95           │
│  = "Ahmad"    │   │                 │
└───────────────┘   └─────────────────┘

Direction: ONE WAY  ↓  (Parent knows about children, children do NOT know about parent)
الاتجاه: اتجاه واحد ↓ (الأب يعرف الأبناء، الأبناء لا يعرفون الأب)
```

---

### Code Example | مثال من المشروع

From `app/(tabs)/index.tsx` and `components/A.tsx`:

```typescript
// PARENT: HomeScreen
// يمتلك الحالة ويُقرِّر ما يُرسَل للأبناء

function HomeScreen() {
    const [email, setEmail] = useState<string>("");

    return (
        <View>
            {/* Passes email VALUE down to A */}
            <A email={email} />
        </View>
    );
}
```

```typescript
// CHILD: A.tsx
// يستقبل فقط — لا يعرف من أين جاءت البيانات

const A = ({ email }: any) => {
    return (
        <View>
            <Text>A: {email}</Text>   {/* Just reads — cannot change */}
        </View>
    );
};
```

### Rules | القواعد

- The child **cannot modify** the prop value directly.
- If the child tries to reassign `props.email = "new"`, it has no effect on the parent's state.
- The prop is a **snapshot** of the parent's current state value.

الابن **لا يستطيع تعديل** قيمة الـ prop مباشرةً. إعادة تعيين `props.email = "new"` لا تؤثر على حالة الأب.

---

## Part 2: Child → Parent | الابن إلى الأب

### Concept

React does not support data flowing **upward** natively. The workaround is **Lifting State Up**: the parent defines a function that modifies its own state and passes that function as a prop to the child. The child calls the function — which lives in the parent — effectively sending data up.

لا يدعم React تدفق البيانات **للأعلى** بشكل مباشر. الحل هو **رفع الحالة للأعلى**: الأب يُعرِّف دالة تُعدِّل حالته الخاصة، ويُمرِّرها للابن. الابن يستدعي الدالة — مما يُرسِل البيانات فعلياً للأعلى.

---

### Diagram | الرسم التخطيطي

```
┌───────────────────────────────────────────────┐
│                 ParentComponent               │
│                                               │
│   const [email, setEmail] = useState("")      │
│                                               │
│   const handleChange = (text) => {            │
│       setEmail(text)   ← 3. state updates     │
│   }                                           │
│                                               │
│   <ChildC onChange={handleChange} />          │
│              │                                │
│              │ passes FUNCTION as prop        │
└──────────────┼────────────────────────────────┘
               │ onChange (callback prop)
               ▼
┌──────────────────────────────────────────────┐
│                   ChildC                     │
│                                              │
│   <TextInput                                 │
│     onChangeText={props.onChange}            │
│   />                                         │
│      │                                       │
│      │ 1. User types "a@b.com"               │
│      │ 2. onChangeText fires → props.onChange("a@b.com")
│      └──────────────────────────────────────►│
│                                              │
└──────────────────────────────────────────────┘

DATA TRAVELS UP:
البيانات ترتفع:

  User Input  →  Child calls  →  Parent function runs  →  Parent state updates
  مدخل المستخدم  ←  الابن يستدعي  ←  دالة الأب تعمل  ←  حالة الأب تتحدث
```

---

### Code Example | مثال من المشروع

From `HomeScreen` and `components/C.tsx`:

```typescript
// PARENT: HomeScreen
// الأب يملك الحالة ويُعرِّف دالة التعديل

function HomeScreen() {
    const [email, setEmail] = useState<string>("");

    // Step 1: Parent defines the function
    // الخطوة 1: الأب يُعرِّف الدالة
    const onChange = (text: string) => {
        setEmail(text);  // ← Only the parent can update its own state
    };

    return (
        <View>
            {/* Step 2: Parent passes the function down */}
            {/* الخطوة 2: الأب يُمرِّر الدالة للأسفل */}
            <C onChange={onChange} email={email} />
        </View>
    );
}
```

```typescript
// CHILD: C.tsx
// الابن يستدعي الدالة — البيانات ترتفع للأب

const C = ({ onChange, email }: any) => {
    return (
        <View>
            <TextInput
                value={email}
                // Step 3: Child calls the parent's function
                // الخطوة 3: الابن يستدعي دالة الأب
                onChangeText={onChange}
            />
        </View>
    );
};
```

### Key Insight | الفكرة الرئيسية

> The child does not "send" data to the parent. It **calls a function that belongs to the parent**, and that function updates the parent's state. The child has no knowledge of what `onChange` does internally.

> الابن لا "يُرسِل" بيانات للأب. بل **يستدعي دالة تنتمي للأب**، وتلك الدالة تُعدِّل حالة الأب. الابن لا يعلم ماذا تفعل `onChange` داخلياً.

---

## Part 3: Child → Child (Sibling Communication) | التواصل بين الأشقاء

### Concept — The Hard Case

Two sibling components cannot communicate directly. There is no built-in React mechanism for `SiblingA` to talk to `SiblingB`. The only solution with plain React is to **route the data through their common parent** — the parent acts as a message broker.

مكوِّنان أشقاء لا يستطيعان التواصل مباشرةً. لا توجد آلية مدمجة في React تُتيح ذلك. الحل الوحيد مع React القياسي هو **تمرير البيانات عبر الأب المشترك**.

---

### Diagram | الرسم التخطيطي

```
                ┌─────────────────────────────────┐
                │          ParentComponent        │
                │                                 │
                │  const [email, setEmail] =      │
                │       useState("")              │
                │                                 │
                │  const onChange = (text) =>     │
                │       setEmail(text)            │
                │                                 │
                │  <SiblingA email={email} />     │
                │  <SiblingB onChange={onChange}  │
                │            email={email} />     │
                └──────────────┬──────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │ email (read)   │ onChange (write)+ email (read)
               ▼               ▼
  ┌────────────────┐   ┌──────────────────────────┐
  │   SiblingA     │   │        SiblingB          │
  │                │   │                          │
  │  Displays      │   │  TextInput               │
  │  {email}  ◄────┼───┼──onChangeText={onChange} │
  │                │   │  value={email}           │
  └────────────────┘   └──────────────────────────┘

FLOW:
التدفق:

  1. User types in SiblingB's TextInput
     المستخدم يكتب في حقل SiblingB

  2. SiblingB calls onChange("new text")
     SiblingB تستدعي onChange("new text")

  3. Parent's setEmail("new text") runs → email state updates
     setEmail في الأب يعمل → حالة email تتحدث

  4. Parent re-renders → SiblingA receives new email → displays it
     الأب يُعيد الرسم → SiblingA تستقبل email الجديدة → تعرضها

  SiblingB ──► Parent ──► SiblingA
  (writes up)   (owns)     (reads down)
```

---

### Code Example | مثال من المشروع

This is exactly what `HomeScreen` → `A` and `HomeScreen` → `B` → `C` demonstrates:

```typescript
// PARENT: HomeScreen (the broker / الوسيط)
function HomeScreen() {
    const [email, setEmail] = useState<string>("");
    const onChange = (text: string) => setEmail(text);

    return (
        <View>
            {/* SiblingA: only READS email */}
            {/* الأخ A: يقرأ فقط */}
            <A email={email} />

            {/* SiblingB (→ C inside): READ email + WRITE via onChange */}
            {/* الأخ B (يحتوي C بداخله): يقرأ ويكتب */}
            <B onChange={onChange} email={email} />
        </View>
    );
}
```

```
When user types in C (inside B):
عند كتابة المستخدم في C (داخل B):

  C.onChangeText
      └─► B.props.onChange (B passes it through — prop drilling)
              └─► HomeScreen.onChange
                      └─► setEmail("new value")
                              └─► HomeScreen re-renders
                                      ├─► A receives new email → displays it
                                      └─► B → C receives new email → input synced
```

---

## Part 4: The Prop Drilling Problem | مشكلة Prop Drilling

### What Is Prop Drilling?

Prop drilling occurs when data must be passed through **multiple intermediate components** that do not use the data themselves — they only pass it further down to a deeper descendant that actually needs it.

Prop Drilling يحدث عندما تُمرَّر البيانات عبر **مكوِّنات وسيطة متعددة** لا تستخدم البيانات بنفسها — تُمرِّرها فقط لتصل إلى مكوِّن أعمق يحتاجها فعلاً.

---

### Diagram — Prop Drilling in Action | رسم تخطيطي لـ Prop Drilling

```
┌──────────────────────────────────────────────────────┐
│                        App                           │
│   const [user] = { name: "Ahmad", role: "admin" }   │
│   <Layout user={user} />                             │
└───────────────────────────┬──────────────────────────┘
                            │ user (passed but not used)
                            ▼
┌───────────────────────────────────────────────────────┐
│                       Layout                          │
│   props.user → NOT USED HERE                         │
│   <Sidebar user={props.user} />                      │  ← Just passing through
└───────────────────────────┬───────────────────────────┘    مُمرَّر فقط
                            │ user (passed but not used)
                            ▼
┌───────────────────────────────────────────────────────┐
│                      Sidebar                          │
│   props.user → NOT USED HERE                         │
│   <NavMenu user={props.user} />                      │  ← Just passing through
└───────────────────────────┬───────────────────────────┘    مُمرَّر فقط
                            │ user (passed but not used)
                            ▼
┌───────────────────────────────────────────────────────┐
│                      NavMenu                          │
│   props.user → NOT USED HERE                         │
│   <UserAvatar user={props.user} />                   │  ← Just passing through
└───────────────────────────┬───────────────────────────┘    مُمرَّر فقط
                            │ user (FINALLY USED)
                            ▼
                ┌───────────────────────┐
                │      UserAvatar       │
                │   props.user.name     │  ← This is the ONLY component
                │   props.user.role     │     that actually needs user!
                └───────────────────────┘  هذا المكوِّن الوحيد الذي يحتاج user!

PROBLEM: Layout, Sidebar, NavMenu all receive `user`
         — they don't need it, but MUST accept and pass it.

المشكلة: Layout, Sidebar, NavMenu كلها تستقبل `user`
         لا تحتاجه، لكن يجب أن تقبله وتُمرِّره.
```

### Why Is This a Problem? | لماذا هذه مشكلة؟

1. **High Coupling** — Every intermediate component becomes dependent on a prop it doesn't need. If the `user` object changes shape, every file in the chain needs updating.

2. **Maintenance Nightmare** — Adding a new component anywhere in the chain requires adding the prop to every component between App and the target.

3. **Reduced Reusability** — `Sidebar` and `NavMenu` cannot be reused in other contexts unless `user` is also provided, even when they don't need it.

4. **Cognitive Overhead** — Reading the code, it's unclear which components actually use `user` vs. which ones just pass it through.

---

### الشرح بالعربي

**Prop Drilling = حفر البروبس**

عندما يصل عمق الشجرة إلى 5-10 طبقات (وهو أمر شائع في التطبيقات الحقيقية)، يصبح من الضروري تحديث 8 ملفات مختلفة فقط لإضافة prop جديد. كل مكوِّن وسيط يصبح "خط أنابيب" لبيانات لا يستخدمها.

هذه المشكلة كانت الدافع الرئيسي لاختراع حلول إدارة الحالة العالمية مثل **Redux**.

---

## Part 5: The Redux Solution | حل Redux

### Concept — Global State Store

Redux introduces a **single, centralized store** that lives outside the component tree. Any component, at any depth, can:
- **Read** from the store directly (subscribing).
- **Write** to the store directly (dispatching actions).

No component needs to pass data through its parent or children to access shared state.

يُقدِّم Redux **مخزناً مركزياً واحداً** يعيش خارج شجرة المكوِّنات. أي مكوِّن، على أي عمق، يستطيع:
- **القراءة** من المخزن مباشرةً.
- **الكتابة** إلى المخزن مباشرةً.

لا مكوِّن يحتاج تمرير بيانات عبر أبيه أو أبنائه للوصول للحالة المشتركة.

---

### Diagram — Before Redux (Prop Drilling) | قبل Redux

```
┌─────────────┐
│     App     │  owns user data
│  user={...} │
└──────┬──────┘
       │ props.user
       ▼
┌─────────────┐
│   Layout    │  doesn't need it, passes it
└──────┬──────┘
       │ props.user
       ▼
┌─────────────┐
│   Sidebar   │  doesn't need it, passes it
└──────┬──────┘
       │ props.user
       ▼
┌─────────────┐
│   NavMenu   │  doesn't need it, passes it
└──────┬──────┘
       │ props.user
       ▼
┌─────────────┐
│  UserAvatar │  FINALLY uses it
└─────────────┘

5 files touched for 1 piece of data. ← PROBLEM
5 ملفات تأثرت ببيانات واحدة ← المشكلة
```

---

### Diagram — After Redux (Global Store) | بعد Redux

```
                    ┌─────────────────────────────┐
                    │        Redux Store           │
                    │                             │
                    │   {                         │
                    │     user: {                 │
                    │       name: "Ahmad",        │
                    │       role: "admin"         │
                    │     },                      │
                    │     products: [...],        │
                    │     theme: "dark"           │
                    │   }                         │
                    └──────────────┬──────────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             │ useSelector()       │ useSelector()       │ dispatch()
             │                     │                     │
             ▼                     ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
   │   UserAvatar    │   │   ProductList   │   │   LoginButton   │
   │ (deep level 5) │   │ (deep level 3) │   │ (deep level 6) │
   │                 │   │                 │   │                 │
   │ user = useSele- │   │ products =      │   │ dispatch(       │
   │ ctor(s =>s.user)│   │ useSelector(.)  │   │  logout()       │
   │                 │   │                 │   │ )               │
   └─────────────────┘   └─────────────────┘   └─────────────────┘

NO INTERMEDIATE COMPONENTS ARE TOUCHED.
لا مكوِّنات وسيطة تتأثر.

Layout, Sidebar, NavMenu are completely unaware of `user`.
Layout, Sidebar, NavMenu لا تعلم شيئاً عن `user`.
```

---

### How Redux Works — Core Concepts | كيف يعمل Redux

```
┌─────────────────────────────────────────────────────────┐
│                   THE REDUX CYCLE                       │
│                   دورة Redux                            │
└─────────────────────────────────────────────────────────┘

  Component                Store              Reducer
  المكوِّن                  المخزن             المُخفِّض

     │                       │                   │
     │  1. dispatch(action)  │                   │
     │ ─────────────────────►│                   │
     │                       │  2. Sends to      │
     │                       │     reducer       │
     │                       │──────────────────►│
     │                       │                   │ 3. Pure function
     │                       │                   │    receives old state
     │                       │                   │    + action
     │                       │                   │    returns NEW state
     │                       │◄──────────────────│
     │                       │  4. Store updates │
     │  5. useSelector()     │     with new state│
     │     re-runs           │                   │
     │◄──────────────────────│                   │
     │                       │                   │
     │  6. Component         │                   │
     │     re-renders with   │                   │
     │     new data          │                   │
```

**The Three Pillars of Redux | الأركان الثلاثة لـ Redux:**

```
┌─────────────────────────────────────────────────────────┐
│  1. STORE (المخزن)                                      │
│     Single JavaScript object holding ALL app state.     │
│     كائن JavaScript واحد يحمل كل حالة التطبيق.          │
│                                                         │
│     const store = configureStore({ reducer: rootReducer│
├─────────────────────────────────────────────────────────┤
│  2. ACTION (الإجراء)                                    │
│     A plain object describing WHAT happened.            │
│     كائن بسيط يصف ما حدث.                              │
│                                                         │
│     { type: 'user/login', payload: { name: 'Ahmad' } }  │
├─────────────────────────────────────────────────────────┤
│  3. REDUCER (المُخفِّض)                                  │
│     A pure function: (oldState, action) => newState     │
│     دالة نقية: (الحالة القديمة، الإجراء) => الحالة الجديدة│
│                                                         │
│     function userReducer(state, action) {               │
│       switch(action.type) {                             │
│         case 'user/login':                              │
│           return { ...state, ...action.payload }        │
│         default:                                        │
│           return state                                  │
│       }                                                 │
│     }                                                   │
└─────────────────────────────────────────────────────────┘
```

---

### Code Example — Redux Toolkit (Modern Redux) | مثال كود Redux Toolkit

```typescript
// ─────────────────────────────────────────
// 1. SLICE (الشريحة) — State + Reducers + Actions
// ─────────────────────────────────────────
// store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    role: string;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    name: '',
    role: '',
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ name: string; role: string }>) => {
            state.name = action.payload.name;
            state.role = action.payload.role;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.name = '';
            state.role = '';
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
```

```typescript
// ─────────────────────────────────────────
// 2. STORE CONFIGURATION (إعداد المخزن)
// ─────────────────────────────────────────
// store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,     // All user state lives here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// ─────────────────────────────────────────
// 3. PROVIDER (المُزوِّد) — Wrap your app root
// ─────────────────────────────────────────
// app/_layout.tsx

import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout() {
    return (
        <Provider store={store}>
            {/* All components inside can access the store */}
            {/* كل المكوِّنات بداخله تستطيع الوصول للمخزن */}
            <Stack>...</Stack>
        </Provider>
    );
}
```

```typescript
// ─────────────────────────────────────────
// 4. READING STATE — useSelector (القراءة)
// ─────────────────────────────────────────
// components/UserAvatar.tsx (deep level 5)
// NO PROPS NEEDED — directly reads from store

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const UserAvatar = () => {
    // Directly accesses store — no props, no drilling
    // الوصول المباشر للمخزن — بدون props، بدون حفر
    const user = useSelector((state: RootState) => state.user);

    return (
        <View>
            <Text>{user.name}</Text>
            <Text>{user.role}</Text>
        </View>
    );
};
```

```typescript
// ─────────────────────────────────────────
// 5. WRITING STATE — useDispatch (الكتابة)
// ─────────────────────────────────────────
// components/LoginButton.tsx (deep level 6)
// NO CALLBACKS NEEDED — directly writes to store

import { useDispatch } from 'react-redux';
import { login, logout } from '@/store/userSlice';

const LoginButton = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        // Directly updates the global store
        // تحديث المخزن العالمي مباشرةً
        dispatch(login({ name: 'Ahmad', role: 'admin' }));
    };

    return <Pressable onPress={handleLogin}><Text>Login</Text></Pressable>;
};
```

---

## Part 6: Full Comparison — All 4 Patterns | مقارنة شاملة بين الأنماط الأربعة

```
┌──────────────────────────────────────────────────────────────────────────┐
│         PATTERN              │ DIRECTION │ MECHANISM     │ DEPTH LIMIT   │
│────────────────────────────────────────────────────────────────────────  │
│ Parent → Child               │ ↓ Down    │ props         │ Works at any  │
│ الأب → الابن                 │           │               │ depth         │
│──────────────────────────────────────────────────────────────────────────│
│ Child → Parent               │ ↑ Up      │ callback fn   │ Painful at    │
│ الابن → الأب                 │           │ as prop       │ many levels   │
│──────────────────────────────────────────────────────────────────────────│
│ Child → Child (via parent)   │ ↑ then ↓  │ shared state  │ Prop drilling │
│ ابن → أخ (عبر الأب)         │           │ + callback    │ problem       │
│──────────────────────────────────────────────────────────────────────────│
│ Any → Any (Redux)            │ ◉ Direct  │ store +       │ No limit      │
│ أي → أي (Redux)              │           │ dispatch      │ No drilling   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Part 7: When to Use Each | متى تستخدم كلاً منها

```
┌─────────────────────────────────────────────────────────────────┐
│ USE PROPS (Parent → Child)  |  استخدم Props                    │
│                                                                 │
│  ✓ Data belongs to one parent only                             │
│  ✓ Small, focused component                                    │
│  ✓ 1-2 levels of nesting at most                               │
│                                                                 │
│  Example: <Button label="Submit" onPress={handleSubmit} />     │
├─────────────────────────────────────────────────────────────────┤
│ USE LIFTING STATE UP  |  استخدم رفع الحالة للأعلى              │
│                                                                 │
│  ✓ Two siblings need to share state                            │
│  ✓ Component tree is shallow (2-3 levels)                      │
│  ✓ The shared state is simple                                   │
│                                                                 │
│  Example: The A-B-C demo in HomeScreen                         │
├─────────────────────────────────────────────────────────────────┤
│ USE REACT CONTEXT  |  استخدم React Context                     │
│                                                                 │
│  ✓ Medium-sized apps                                           │
│  ✓ Avoiding deep prop drilling                                  │
│  ✓ Infrequently changed data (theme, locale, user)             │
│                                                                 │
│  Example: ThemeProvider in this project                        │
├─────────────────────────────────────────────────────────────────┤
│ USE REDUX (or Zustand)  |  استخدم Redux                        │
│                                                                 │
│  ✓ Large or complex applications                               │
│  ✓ State shared across many unrelated components               │
│  ✓ Frequent and complex state updates                          │
│  ✓ Need for time-travel debugging (Redux DevTools)             │
│  ✓ Data that changes from many places                          │
│                                                                 │
│  Example: Shopping cart, user authentication, notifications    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 8: Evolution Timeline | تسلسل تطور الحلول

```
2013 ──► React introduced
         React يُقدَّم
         Pattern: Props only. Works for small apps.
         النمط: Props فقط. يعمل للتطبيقات الصغيرة.

2014 ──► Prop Drilling becomes painful in large apps
         Prop Drilling يصبح مؤلماً في التطبيقات الكبيرة

2015 ──► Redux introduced (Dan Abramov)
         Redux يُقدَّم — inspired by Elm and Flux
         يُلهَم من Elm وFlux

         Pattern: Global store + Actions + Reducers
         النمط: مخزن عالمي + إجراءات + مُخفِّضات

2018 ──► React Context API (official solution for some cases)
         React Context API (حل رسمي لبعض الحالات)
         Avoids prop drilling for infrequently changing data
         يتجنب Prop Drilling للبيانات التي تتغير نادراً

2019 ──► React Query introduced (server state)
         React Query يُقدَّم (حالة الخادم)
         Separates "server state" from "client state"
         يفصل "حالة الخادم" عن "حالة العميل"

2021 ──► Redux Toolkit (RTK) — modern Redux
         Redux Toolkit — Redux الحديث
         Much less boilerplate, same concepts
         أقل تكراراً، نفس المفاهيم

2022 ──► Zustand, Jotai — lightweight alternatives
         بدائل خفيفة الوزن
         Similar concept to Redux but minimal API
         نفس فكرة Redux لكن API أبسط
```

---

## Summary | الخلاصة

```
THE EVOLUTION OF STATE MANAGEMENT
تطور إدارة الحالة

Step 1: Simple Props
المرحلة 1: Props بسيطة
    Parent → Child. Fine for small apps.
    الأب → الابن. جيد للتطبيقات الصغيرة.

Step 2: Lifting State Up
المرحلة 2: رفع الحالة للأعلى
    Child → Parent via callbacks.
    الابن → الأب عبر الـ callbacks.
    Works for siblings. Gets painful quickly.
    يعمل للأشقاء. يصبح مؤلماً سريعاً.

Step 3: Prop Drilling (the problem)
المرحلة 3: Prop Drilling (المشكلة)
    Data passed through unrelated components.
    البيانات تُمرَّر عبر مكوِّنات لا علاقة لها.
    Tight coupling. Maintenance nightmare.
    اقتران شديد. كابوس صيانة.

Step 4: Redux (the solution)
المرحلة 4: Redux (الحل)
    Global store accessible by ANY component.
    مخزن عالمي يصله أي مكوِّن.
    No drilling. Predictable. Debuggable.
    بدون حفر. يمكن التنبؤ به. قابل للتتبع.

The project in this course demonstrates Steps 1-3 using the
A-B-C component chain, specifically to SHOW the problem that
Redux is designed to solve.

المشروع في هذا المساق يُظهر المراحل 1-3 باستخدام سلسلة
مكوِّنات A-B-C، تحديداً لإظهار المشكلة التي صُمِّم Redux لحلها.
```
