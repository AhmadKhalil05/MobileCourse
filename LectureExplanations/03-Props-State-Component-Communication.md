# Lecture 03 — React Fundamentals: Props, State, and Component Communication
# المحاضرة الثالثة — أساسيات React: الخصائص والحالة والتواصل بين المكونات

---

## Part 1: Concept — The Component Model | مفهوم — نموذج المكوِّن

### English Explanation

React Native, like React, is built on the concept of **components** — isolated, reusable units of UI. Each component manages its own data and rendering. The challenge in any React application is: *how do components share data with each other?*

There are two core mechanisms:
1. **Props (Properties)** — Data flows *downward* from parent to child. A parent passes data to a child as attributes. Props are read-only from the child's perspective.
2. **State** — Data that lives *inside* a component and can change over time. When state changes, React re-renders the component automatically.

---

### الشرح بالعربي

React Native مبني على مفهوم **المكوِّنات** — وحدات مستقلة وقابلة لإعادة الاستخدام. التحدي الأساسي هو: كيف تتشارك المكوِّنات البيانات؟

**آليتان أساسيتان:**
1. **Props** — البيانات تتدفق *للأسفل* من الأب إلى الابن. تعتبر للقراءة فقط من ناحية المكوِّن الابن.
2. **State** — بيانات تعيش *داخل* المكوِّن وتتغير بمرور الوقت. عند تغيير الـ state، تُعيد React رسم المكوِّن تلقائياً.

---

## Part 2: The A-B-C Component Chain — Prop Drilling | سلسلة مكوِّنات A-B-C

This is one of the most important concepts demonstrated in the project. The files `A.tsx`, `B.tsx`, `C.tsx`, and the `HomeScreen` form a deliberate example.

هذا وأحد أهم المفاهيم الموضَّحة في المشروع. ملفات `A.tsx` و `B.tsx` و `C.tsx` و `HomeScreen` تُشكِّل مثالاً متعمَّداً.

### `app/(tabs)/index.tsx` — HomeScreen (Parent)

```typescript
import { StyleSheet, View } from "react-native";
import A from "@/components/A";
import B from "@/components/B";
import D from "@/components/D";
import { useState } from "react";

function HomeScreen() {
    const [email, setEmail] = useState<string>("");

    const onChange = (text: string) => {
        setEmail(text)
    }

    return (
        <View style={styles.container}>
            <A email={email}></A>
            <B onChange={onChange} email={email}></B>
        </View>
    )
}
```

#### Analysis

**`useState<string>("")`**
Declares a state variable `email` of type `string` with an initial value of `""` (empty string). The TypeScript generic `<string>` makes this type-safe — only strings can be assigned to `email`. `useState` returns a tuple:
- `email` — The current state value (read-only within the render cycle).
- `setEmail` — A function to update the state. Calling `setEmail("new@email.com")` triggers a re-render.

**The Component Tree**
```
HomeScreen  ← owns the "email" state
├── A (email={email})         ← receives email; displays it
└── B (onChange={onChange}, email={email}) ← receives both
    └── C (onChange={onChange}, email={email}) ← receives both (prop drilling)
```

**`onChange` function as a prop**
Rather than passing `setEmail` directly, a wrapper function `onChange` is created. This is a pattern for **lifting state up**: the child cannot modify state directly, so the parent provides a function that the child calls. When `C` changes the input and calls `onChange("new value")`, it triggers `setEmail("new value")` in `HomeScreen`, which updates the shared state and re-renders both `A` and `B`.

**Data Flow (Unidirectional Data Flow):**
```
User types in C's TextInput
    → C calls props.onChange(text)
    → onChange runs setEmail(text) in HomeScreen
    → HomeScreen re-renders
    → New email value flows down to A (displayed) and B → C (input value synced)
```

---

### الشرح بالعربي

**`useState`:** يُعلن عن متغير حالة يحتفظ المكوِّن بقيمته بين عمليات الإعادة. عند استدعاء `setEmail`، تُعيد React رسم المكوِّن بالقيمة الجديدة.

**تدفق البيانات أحادي الاتجاه:**
البيانات في React تتدفق في اتجاه واحد فقط: من الأعلى للأسفل. المكوِّن الابن لا يمكنه تعديل حالة الأب مباشرةً. بدلاً من ذلك، يُمرِّر الأب **دالة** للابن، والابن يستدعيها عند الحاجة. هذا النمط يُسمى **رفع الحالة للأعلى (Lifting State Up)**.

---

### `components/A.tsx` — Display Component

```typescript
import { Text, View } from "react-native";
import React from "react";
import C from "@/components/C";

const A = ({email}: any) => {
    return (
        <View>
            <Text>A {email}</Text>
        </View>
    )
}
export default A;
```

#### Analysis

**Props Destructuring: `({email}: any)`**
The component receives a props object and immediately destructures it. `email` is extracted from whatever is passed. The `: any` type annotation is used here for simplicity (a production app would use a proper TypeScript interface).

**Role:** Component `A` is a **display component** — it has no state or logic. It simply receives `email` via props and renders it. This demonstrates the principle of **presentational components**: pure functions of their props.

**Import of `C`:** Component `A` imports `C` (it's imported but not used in the render return, which is a leftover from prior exploration).

---

### الشرح بالعربي

المكوِّن `A` هو **مكوِّن عرض** — لا يمتلك حالة خاصة ولا منطقاً معقداً. يستقبل `email` كـ prop ويعرضها فقط. هذا يُجسِّد مبدأ **الفصل بين المخاوف**: مكوِّن واحد يمتلك البيانات (HomeScreen)، ومكوِّنات أخرى تعرضها فقط.

---

### `components/B.tsx` — Intermediate Component (Prop Drilling)

```typescript
import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import C from "@/components/C";

const B = ({onChange, email}: any) => {
    return (
        <View>
            <Text>B</Text>
            <C onChange={onChange} email={email}></C>
        </View>
    )
}
export default B;
```

#### Analysis

**`B` as a Middleman**
Component `B` receives both `onChange` and `email` as props. It renders a label text and passes both props down to `C`. `B` itself does not *use* `onChange` or `email` for anything — it just passes them through. This is the definition of **prop drilling**: a component serving as a conduit for props that it does not consume itself.

**Why This is Important:**
Prop drilling is a real problem in large applications. When data needs to pass through many intermediate components (A → B → C → D → E), each intermediate component must accept and pass the prop even if it doesn't need it. Solutions include React Context, state management libraries (like React Query or Zustand), or component composition.

---

### الشرح بالعربي

**Prop Drilling (حفر البروبس):**
المكوِّن `B` يستقبل `onChange` و `email` ليس لاستخدامهما، بل فقط لتمريرهما إلى `C`. هذا هو ما يُسمى **prop drilling** — مشكلة شائعة في React عندما تحتاج البيانات الانتقال عبر طبقات متعددة من المكوِّنات دون أن تستخدمها الطبقات الوسيطة.

---

### `components/C.tsx` — Input Component

```typescript
import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const C = ({onChange, email}: any) => {
    return (
        <View>
            <Text>C</Text>
            <TextInput
                style={[styles.input]}
                onChangeText={onChange}
                value={email}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>
    )
}
export default C;
```

#### Analysis: Controlled Input Pattern

**`value={email}`**
The `TextInput` is a **controlled component**. Its displayed value is controlled by the React state (`email` from `HomeScreen`), not by internal DOM/native state. The component always renders whatever `email` currently is.

**`onChangeText={onChange}`**
Every time the user types a character, React Native calls `onChangeText` with the full new string value. `onChange` is the function received from `HomeScreen` (via `B`). Calling it updates `HomeScreen`'s state, which flows back through the tree to update `C`'s displayed value.

**This creates a loop:**
```
User types  →  onChangeText fires  →  onChange(text)  →  setEmail(text)
→  HomeScreen re-renders  →  email flows down  →  C's value prop updates  →  display matches state
```

**TextInput Props:**
- `placeholder` — Gray hint text shown when the field is empty.
- `keyboardType="email-address"` — Shows an email-optimized keyboard on mobile (with `@` accessible).
- `autoCapitalize="none"` — Disables automatic capitalization of the first character.

---

### الشرح بالعربي

**المكوِّن المتحكَّم به (Controlled Input):**
حقل الإدخال `TextInput` قيمته مُتحكَّم بها بالكامل من الـ state. الكود يقول: "القيمة المعروضة دائماً هي `email`، وعند كل تغيير اتصل بـ `onChange`". هذا يُنشئ حلقة مغلقة:
1. المستخدم يكتب → تُستدعى `onChangeText`
2. يُستدعى `onChange(text)` → يُستدعى `setEmail(text)` في HomeScreen
3. تُعيد HomeScreen الرسم → تتدفق القيمة الجديدة لـ C → يُعرض ما كتبه المستخدم

---

### `components/D.tsx` — Alternative Input Component

```typescript
import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

const D = ({ onChange, email }: any) => {
    return (
        <View>
            <Text>Ddddd {email}</Text>
            <TextInput
                style={[styles.input]}
                onChangeText={onChange}
                value={email}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>
    )
}
export default D;
```

`D` is essentially identical to `C` in structure but displays `email` in a `<Text>` element above the input. It imports `useState` but does not use it — this is likely leftover exploration code. The pattern demonstrated is the same: controlled input with shared state from the parent.

المكوِّن `D` مطابق تقريباً لـ `C`، الفرق الوحيد هو أنه يعرض `email` في نص فوق حقل الإدخال. يُستورد `useState` لكنه غير مُستخدَم — وهذا من بقايا الاستكشاف.

---

## Part 3: `components/new-component.tsx` — Multiple Props

**Path:** `components/new-component.tsx`

```typescript
import { Text, View } from "react-native";

const NewComponent = ({name, email, password}: any) => {
    return (
        <View>
            <Text>Your name is: {name}</Text>
            <Text>Your email is: {email}</Text>
            <Text>Your email is: {password}</Text>
        </View>
    );
}

export default NewComponent;
```

This component demonstrates receiving **multiple props** simultaneously. It accepts `name`, `email`, and `password` and renders each one. It is used in `login2.tsx` to display the current form values in real time as the user types — a debugging/demonstration technique to visualize state changes immediately.

Note: The text "Your email is:" is repeated for both `email` and `password` — this appears to be a copy-paste error in the original code.

هذا المكوِّن يوضِّح استقبال **عدة Props** دفعة واحدة. يُستخدَم في `login2.tsx` لعرض قيم النموذج في الوقت الحقيقي أثناء الكتابة — تقنية تصحيح أخطاء لتصوير تغيرات الحالة فورياً.

ملاحظة: النص "Your email is:" مكرر للـ email والـ password — يبدو أنه خطأ نسخ-لصق في الكود الأصلي.

---

## Part 4: `app/(tabs)/login2.tsx` — Manual State Management

**Path:** `app/(tabs)/login2.tsx`

```typescript
import React, { useState } from "react";
import { Text, StyleSheet, Alert, Pressable, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import NewComponent from "@/components/new-component";
import { router } from "expo-router";

export default function Login2Screen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (text: any) => {
        setEmail(text);
    }

    const handlePasswordChange = (text: any) => {
        setPassword(text);
    }

    const onSubmit = () => {
        router.back()
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login Page</Text>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.reactLogo} />
            <View style={styles.container}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input]}
                    onChangeText={handleEmailChange}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input]}
                    onChangeText={handlePasswordChange}
                    value={password}
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                />
            </View>
            <NewComponent name={"test"} email={email} password={password} />
            <Pressable
                onPress={onSubmit}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.7 },
                ]}
            >
                <Text style={styles.buttonText}>Back</Text>
            </Pressable>
        </SafeAreaView>
    );
}
```

#### Key Observations

**Two Separate State Variables**
Unlike `HomeScreen` which uses a single `email` state, `Login2Screen` manages `email` and `password` as two separate state variables. Each has its own handler function (`handleEmailChange`, `handlePasswordChange`).

**`SafeAreaView`**
`SafeAreaView` from `react-native-safe-area-context` ensures content is not hidden under the device's status bar, notch, or home indicator. It is the correct way to handle safe areas on modern devices.

**`secureTextEntry={true}`**
Transforms the `TextInput` into a password field — displayed characters are replaced with dots (●●●●●), and the system disables clipboard operations for security.

**`<NewComponent name={"test"} email={email} password={password} />`**
This passes all three values to `NewComponent`. As the user types, `email` and `password` update, triggering re-renders, and `NewComponent` displays the updated values immediately. This is a live demonstration of props reflecting state.

**`Pressable` with `style` function**
```typescript
style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 },
]}
```
The `style` prop of `Pressable` accepts a function that receives an object containing interaction states. When `pressed` is `true` (finger is down), the button opacity is reduced to 0.7, providing visual feedback.

---

### الشرح بالعربي

**`Login2Screen`** هو نموذج تسجيل دخول يستخدم إدارة الحالة اليدوية (بدون مكتبة نماذج).

**`SafeAreaView`:** يضمن أن المحتوى لا يختفي تحت شريط الحالة أو الـ notch. ضروري للجهزة الحديثة.

**`secureTextEntry={true}`:** يحوِّل حقل الإدخال لحقل كلمة مرور — يُخفي الأحرف المكتوبة بنقاط.

**`Pressable` مع دالة style:** خاصية `style` في `Pressable` تقبل دالة تستقبل حالة الضغط. عند الضغط `pressed === true`، تُطبَّق شفافية 0.7 لإعطاء تغذية بصرية للمستخدم.

---

## Summary | خلاصة

| Concept | Demonstrated In | Explanation |
|---|---|---|
| State (`useState`) | `HomeScreen`, `Login2Screen` | Local reactive data inside a component |
| Props (downward flow) | `HomeScreen → A, B → C` | Passing data from parent to child |
| Prop drilling | `B.tsx` | Passing props through intermediary components |
| Lifting state up | `C` calls `onChange` from `HomeScreen` | Child communicates to parent via callback |
| Controlled input | `C.tsx`, `D.tsx`, `login2.tsx` | Input value controlled by state |
| Multiple props | `new-component.tsx` | Receiving many values simultaneously |
| Pressable feedback | `login2.tsx` | Visual state-dependent styling |
