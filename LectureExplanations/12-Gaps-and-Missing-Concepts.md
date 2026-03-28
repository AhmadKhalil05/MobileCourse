# Lecture 12 — Supplementary: All Remaining Concepts from the Codebase
# المحاضرة الثانية عشرة — تكميلي: كل المفاهيم المتبقية في الكود

This lecture is a systematic audit of every file in the project. It covers all concepts, patterns, bugs, and details that were not fully addressed in Lectures 01–11.

هذه المحاضرة هي مراجعة منهجية لكل ملف في المشروع. تُغطي كل المفاهيم والأنماط والأخطاء والتفاصيل التي لم تُعالَج كاملاً في المحاضرات 01–11.

---

## Section 1: `app/_layout.tsx` — Hidden Details

### Dead Code / Unused Imports | الكود الميت

```typescript
import ProductDetails from "@/app/product-details/[id]";   // line 10
import {Layout} from "react-native-reanimated";             // line 11
// import { StatusBar } from 'expo-status-bar';             // line 6 — commented out
```

These three lines exist in the file but are **never used**:

- `ProductDetails` — imported but never rendered or referenced anywhere in the layout.
- `Layout` from `react-native-reanimated` — an animation layout component that is imported but not used.
- `StatusBar` from `expo-status-bar` — commented out. This component controls the appearance of the device status bar (time, battery, signals). When active, it would set the bar style automatically.

**Why is this important?**
Unused imports are a common code smell. They increase bundle size slightly and make the code harder to read. ESLint would normally flag these. This is an example of **exploration code** left behind.

**الاستيرادات غير المُستخدَمة (Dead Imports):**
هذه الاستيرادات موجودة في الملف لكن لا تُستخدَم في أي مكان. هي بقايا من مرحلة الاستكشاف والتجريب. ESLint يُحذِّر منها. في الكود الاحترافي تُحذَف.

---

### `export const unstable_settings` — Deep Linking Anchor

```typescript
export const unstable_settings = {
    anchor: '(tabs)',
};
```

This was explained in Lecture 02. To summarize: when the app opens via a deep link directly to `/product-details/5`, Expo Router needs to know what screen to show if the user taps "Back". The `anchor: '(tabs)'` means: if there's no previous history, go back to the `(tabs)` group as the home screen.

The name `unstable_settings` reflects that this API may change in future versions of `expo-router`.

شُرح في المحاضرة 02. الاسم `unstable_settings` يعكس أن هذا الـ API قد يتغير في إصدارات مستقبلية.

---

## Section 2: `app/(tabs)/_layout.tsx` — Architecture Bug

### Screens Outside the (tabs) Folder Referenced as Tabs

```typescript
<Tabs.Screen
    name="products"    // ← references app/products.tsx (NOT in (tabs) folder)
    options={{ title: 'Products', ... }}
/>
<Tabs.Screen
    name="Product-list"   // ← references app/product-list.tsx (NOT in (tabs) folder)
    options={{ title: 'Product List', ... }}
/>
```

This is a **structural bug**. In Expo Router's file-based system:
- Screens inside `app/(tabs)/` become tabs automatically.
- `products.tsx` and `product-list.tsx` are at `app/products.tsx` and `app/product-list.tsx`, **not** inside `app/(tabs)/`.

Registering a `Tabs.Screen` with `name="products"` for a file that doesn't exist inside the `(tabs)` folder means the tab button will either not work or show a 404 error. The correct fix is to either:
1. Move `products.tsx` and `product-list.tsx` into the `(tabs)` folder, OR
2. Remove them from the `Tabs.Screen` declarations and use a Stack screen instead.

This exists as an educational demonstration — students can see what happens when the folder structure doesn't match the navigation configuration.

**خطأ بنيوي في التوجيه:**
ملفا `products.tsx` و`product-list.tsx` موجودان في `app/` وليس في `app/(tabs)/`. تسجيلهما كتبويبات يُسبِّب خطأ. الحل: نقلهما للمجلد الصحيح أو حذفهما من `Tabs.Screen`.

---

## Section 3: `app/(tabs)/index.tsx` — Unused Import

```typescript
import D from "@/components/D";  // ← imported but NEVER used in the JSX
```

`D` is imported but the rendered JSX only uses `<A>` and `<B>`. This is another unused import — `D` was likely experimented with and then removed from the render tree without removing the import.

`D` مستوردة لكن لا تُستخدَم في الـ JSX. من بقايا التجريب.

---

## Section 4: JavaScript Language Features Used in the Code

These are fundamental JavaScript/TypeScript features used throughout the project that require explicit explanation.

### 4.1 — Arrow Functions vs Regular Functions

The codebase uses two function styles:

```typescript
// Arrow function (most common in the project)
const handleAddProduct = async () => {
    ...
}

// Regular function declaration
function HomeScreen() {
    ...
}

// Arrow function as component
const ProductCard = ({id, name}: any) => {
    return (...)
}
```

**Differences:**
| Aspect | Arrow Function | Regular Function |
|---|---|---|
| `this` binding | No own `this` (inherits from outer scope) | Has its own `this` |
| Hoisting | Not hoisted | Hoisted (can be called before definition) |
| Usage in React | Preferred for components and handlers | Used for named exports |

In React Native, arrow functions are preferred for component definitions and event handlers because they don't create their own `this` context.

**الفرق بين دالة السهم والدالة العادية:**
دالة السهم `() => {}` لا تمتلك `this` الخاص بها. الدالة العادية `function(){}` تمتلكه. في React، دوال السهم مُفضَّلة للمكوِّنات والمعالجات.

---

### 4.2 — `async` / `await` — Asynchronous Programming

Used in: `fetchData`, `handleAddProduct`, `getCurrentUser`, `getProducts`, all service files.

```typescript
// Without async/await (callback style — old way)
getProducts().then(data => {
    setProducts(data);
}).catch(error => {
    console.log(error);
});

// With async/await (modern, cleaner)
const fetchData = async () => {
    const response = await getProductById(id);
    setProductDetails(response.data);
}
```

**Rules:**
- `async` before a function declaration makes it return a **Promise** automatically.
- `await` pauses execution of the `async` function **only** (not the entire app) until the Promise resolves.
- `await` can only be used inside `async` functions.
- If the awaited Promise rejects, it throws an error — use `try/catch` to handle it.

```typescript
// The correct pattern with error handling
const fetchData = async () => {
    try {
        const response = await getProductById(id);
        setProductDetails(response.data);
    } catch (error) {
        console.log("Failed to fetch:", error);
    }
}
```

**Note:** In `product-details/[id].tsx`, `fetchData` does NOT use try/catch — if the API call fails, the error is unhandled and the screen will show empty data without any error message to the user.

**`async/await`:**
- `async` يجعل الدالة تُعيد Promise تلقائياً.
- `await` يوقف تنفيذ الدالة حتى اكتمال الـ Promise.
- يجب استخدام `try/catch` للتعامل مع الأخطاء.

---

### 4.3 — Destructuring Assignment | تجزئة التعيين

Used everywhere in the project for props and hook returns.

```typescript
// Array destructuring — from useState
const [email, setEmail] = useState("");
const [isOpen, setIsOpen] = useState(false);
// useState returns [value, setter] and we name them anything we want

// Object destructuring — from props
const C = ({ onChange, email }: any) => { ... }
// Equivalent to:
const C = (props: any) => {
    const onChange = props.onChange;
    const email = props.email;
    ...
}

// Object destructuring — from hooks
const { data, isLoading, error } = useQuery({ ... });
const { mutate } = useMutation({ ... });
const { control, handleSubmit } = useForm<FormData>({ mode: "all" });
const { id } = useLocalSearchParams();

// Nested destructuring — from Controller render prop
render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
    ...
)}
// field and fieldState are objects inside the render prop argument
// we destructure both simultaneously
```

**الـ Destructuring:**
بدلاً من الوصول لكل خاصية بشكل منفصل `props.onChange`، يمكن استخراجها مباشرةً `{ onChange }`. يُقلِّل التكرار ويُحسِّن القراءة.

---

### 4.4 — Optional Chaining `?.` | التسلسل الاختياري

Used in: `err?.response?.status`, `props.onPressIn?.(ev)`, `data?.map(...)`, `productDetails?.imageUrl`

```typescript
// Without optional chaining — crashes if err is null
err.response.status   // TypeError if err is null or err.response is undefined

// With optional chaining — returns undefined instead of crashing
err?.response?.status

// Used in product-details/[id].tsx
productDetails?.imageUrl   // Returns undefined if productDetails is null/undefined
productDetails?.description

// Used in haptic-tab.tsx
props.onPressIn?.(ev)   // Calls onPressIn only if it exists (not undefined)

// Used in products.tsx
data?.map((product) => ...)  // Calls map only if data is not undefined
```

The `?.` operator short-circuits: if the left side is `null` or `undefined`, the entire expression evaluates to `undefined` without throwing an error.

**`?.` التسلسل الاختياري:**
يتحقق من وجود القيمة قبل الوصول إليها. إذا كانت `null` أو `undefined`، تُعيد `undefined` بدلاً من رمي خطأ.

---

### 4.5 — Short-Circuit Evaluation `&&` and `||`

```typescript
// && (AND) — used for conditional rendering
{error && <Text>Error fetching data</Text>}
// If error is truthy → renders the Text
// If error is null/undefined/false → renders nothing

// Used in FormInput.tsx
{label && <Text style={styles.label}>{label}</Text>}
// Only renders the label Text if label prop is provided

// Used in haptic-tab.tsx
pressed && { opacity: 0.7 }
// If pressed is true → returns { opacity: 0.7 }
// If pressed is false → returns false (React ignores false in style arrays)

// || (OR) — used for default values
const theme = useColorScheme() ?? 'light';
// ?? (nullish coalescing) — use 'light' only if useColorScheme() returns null or undefined
// Different from || which also triggers on 0 and ""
```

**التقييم القصير:**
- `&&`: إذا كان الجانب الأيسر صحيحاً → يُعيد الجانب الأيمن. يُستخدَم للرسم الشرطي.
- `||`: إذا كان الجانب الأيسر خاطئاً → يُعيد الجانب الأيمن. يُستخدَم للقيم الافتراضية.
- `??`: مثل `||` لكن يُشغَّل فقط عند `null` أو `undefined` (ليس عند `0` أو `""`).

---

### 4.6 — Spread Operator `...` | عملية النشر

```typescript
// 1. Spreading props onto a component
<PlatformPressable {...props} onPressIn={...} />
// Equivalent to manually writing every prop

// 2. Spreading a product object as props
<ProductCard key={product.id} {...product} />
// product = { id: 1, name: "Shoes", price: 100, imageUrl: "..." }
// Becomes: <ProductCard id={1} name="Shoes" price={100} imageUrl="..." />

// 3. Rest props — collecting remaining props
export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }) {
    // rest contains everything NOT explicitly named (children, numberOfLines, etc.)
    return <Text {...rest} style={...} />;
}

// 4. Object spread for state updates (Redux pattern)
return { ...state, ...action.payload }
// Creates new object: copies all old state properties, then overwrites with payload
```

**عملية النشر `...`:**
- على المكوِّنات: تنشر جميع خصائص كائن كـ props منفصلة.
- على الكائنات: تنسخ جميع خصائص كائن في كائن جديد.
- كـ "Rest": تجمع الخصائص المتبقية في متغير واحد.

---

### 4.7 — Template Literals | العبارات النصية المقولبة

```typescript
// Basic usage
config.headers.Authorization = `${tokenType} ${token}`;
// Result: "Bearer token"

// URL building
return await ApiBase.get(`/api/v1/products/${id}`);
// If id = 5, result: "/api/v1/products/5"

// In Link component
href={"/product-details/" + id}  // string concatenation (older style)
href={`/product-details/${id}`}  // template literal (preferred)
```

Template literals use backticks `` ` `` instead of quotes and allow embedding expressions with `${}`.

**العبارات المقولبة:**
تستخدم backticks بدلاً من الاقتباسات وتسمح بتضمين تعابير JavaScript مباشرةً في النص.

---

### 4.8 — `export default` vs Named Exports

```typescript
// Named export — must import with exact name
export const getProducts = async () => { ... }
export const API_URL = "...";
// Import: import { getProducts, API_URL } from "@/api/ProductsService"

// Default export — import with any name
export default ProductCard;
export default function RootLayout() { ... }
// Import: import ProductCard from "@/components/product-card"
// Import: import MyCard from "@/components/product-card"  // any name works

// A file can have ONE default export but MANY named exports
// ملف واحد يمكن أن يكون له تصدير افتراضي واحد وعدة تصديرات مسماة
```

**قاعدة عملية:**
- **Default export**: للمكوِّن الرئيسي في الملف.
- **Named exports**: للدوال المساعدة والثوابت والأنواع التي يحتاجها ملف آخر.

---

## Section 5: `app/product-details/[id].tsx` — Detailed Audit

### `useEffect` Hook — The Complete Pattern

```typescript
const fetchData = async () => {
    const response = await getProductById(id);
    console.log(response.data);
    setProductDetails(response.data);
}

useEffect(() => {
    fetchData()
}, []);
```

**`useEffect(callback, dependencies)`:**
- Runs **after** the component renders (not during).
- The `[]` (empty array) as the second argument means: run **once** — only after the first render (equivalent to `componentDidMount` in class components).
- If you put `[id]` instead: runs after every render **where `id` changed**.
- If you omit the array entirely: runs after **every** render.

**Why an inner function?**
`useEffect` cannot accept an `async` function directly because it would return a Promise, which `useEffect` doesn't expect. The solution is to define an async function inside and call it immediately:
```typescript
useEffect(() => {
    // Cannot do: useEffect(async () => { ... }, [])
    const fetchData = async () => { ... }
    fetchData();  // call it
}, []);
```

**`useEffect` hook:**
يعمل بعد الرسم الأول. الـ dependency array `[]` الفارغ يعني: نفِّذ مرة واحدة فقط بعد التحميل. لا يقبل `async` مباشرةً — الحل تعريف دالة async بداخله وستدعاؤها.

---

### `router.replace` vs `router.push` vs `router.back`

```typescript
// In product-details/[id].tsx
const handleOnPress = () => {
    router.replace('/login2');
}
```

| Method | Behavior | Use Case |
|---|---|---|
| `router.push('/path')` | Adds to navigation stack | Normal navigation — user can go back |
| `router.replace('/path')` | Replaces current screen in stack | Prevents going back (login → home after auth) |
| `router.back()` | Goes to previous screen | Back button behavior |
| `Link href="/" dismissTo` | Dismisses modal and goes to route | Specific to modals |

In `product-details`, `router.replace('/login2')` replaces the current product details screen. This means pressing Back from `login2` would NOT return to product details. This may be intentional for demo purposes.

---

## Section 6: `app/modal.tsx` — `dismissTo` Explained

```typescript
<Link href="/" dismissTo style={styles.link}>
    <ThemedText type="link">Go to home screen</ThemedText>
</Link>
```

**`dismissTo`** is a special prop available on `Link` when used inside a modal screen. When tapped, it:
1. Dismisses the modal (closes it with the modal dismiss animation).
2. Navigates to the specified `href` (`/` = the home tab).

Without `dismissTo`, a `Link href="/"` inside a modal would push a new screen onto the stack instead of dismissing the modal.

**`dismissTo`:** خاص بشاشات الـ Modal. يُغلق الـ modal ثم يتنقل للمسار المحدد. بدونه، سيُضيف شاشة جديدة في المكدس بدلاً من إغلاق الـ modal.

---

## Section 7: `app/(tabs)/login.tsx` — Additional Details

### Unused Imports in login.tsx

```typescript
import { Alert } from "react-native";       // imported, never used
import { FormInput } from "@/components/ui/FormInput";  // imported, never used in JSX
```

`Alert` is a React Native component for showing native alert dialogs. It's imported but the login form never calls `Alert.alert(...)`.

`FormInput` is the reusable form input component (explained in Lecture 04). It is imported but the login screen uses raw `Controller` + `TextInput` directly instead. Both approaches are valid — having both in the codebase demonstrates the comparison.

---

### `Pressable` with Callback Style

```typescript
<Pressable
    onPress={handleSubmit(onSubmit)}
    style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.7 },
    ]}
>
```

The `style` prop of `Pressable` accepts either:
1. A style object: `style={styles.button}`
2. A **function** that receives interaction state: `style={({ pressed }) => [...]}`

When a function is used, React Native passes `{ pressed: boolean, hovered: boolean, focused: boolean }`. This allows **conditional styling based on user interaction state** without needing separate state management.

**Pressable style كدالة:**
بدلاً من style ثابت، تقبل `Pressable` دالة تستقبل حالة التفاعل. `pressed` = `true` عند الضغط. يسمح بتغيير المظهر حسب التفاعل دون `useState`.

---

## Section 8: `eslint.config.js` — Code Quality Tool

**Path:** `eslint.config.js` (not previously explained)

```javascript
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
```

**ESLint** is a **static code analysis** tool — it analyzes code without running it to find potential errors, enforce coding standards, and detect common mistakes.

**`eslint-config-expo`** is Expo's pre-built set of rules that includes:
- React and React Native specific rules.
- TypeScript rules.
- Import ordering rules.
- Warnings for unused variables and imports.

Running `npm run lint` (defined in `package.json`) executes ESLint on all project files.

**`ignores: ['dist/*']`** — ESLint skips the `dist/` folder (production build output), since those files are generated and not manually written.

**ESLint:**
أداة تحليل كود ثابت تفحص الكود دون تشغيله. تكتشف: المتغيرات غير المُستخدَمة، الاستيرادات الزائدة، الأنماط الخطيرة، مخالفات قواعد الكود.

---

## Section 9: `ScrollView` — Fixed Height Issue

```typescript
// In products.tsx
<ScrollView style={{ height: 500 }}>
    {data?.map((product: any) => (
        <ProductCard key={product.id} {...product} />
    ))}
</ScrollView>
```

**The fixed `height: 500` issue:**
`ScrollView` renders all its children in memory at once, regardless of whether they're visible. Setting `height: 500` clips the scrollable area to 500px, but all product cards are still rendered.

**Problem:** If there are 100 products, all 100 `ProductCard` components are rendered simultaneously, consuming memory and affecting performance.

**Better alternative: `FlatList`**
```typescript
import { FlatList } from 'react-native';

<FlatList
    data={data}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <ProductCard {...item} />}
/>
```

`FlatList` only renders items currently visible on screen (virtualization). Items outside the viewport are unmounted, saving memory. This is the recommended approach for long lists.

**`ScrollView` vs `FlatList`:**
- `ScrollView`: يرسم كل العناصر دفعة واحدة في الذاكرة. للقوائم القصيرة فقط.
- `FlatList`: يرسم فقط العناصر المرئية على الشاشة (Virtualization). للقوائم الطويلة.

---

## Section 10: `marginEnd` — RTL-Aware Spacing

```typescript
// In products.tsx styles
button: {
    marginEnd: 24,   // ← not marginRight
}
```

`marginEnd` is a **logical property** that is RTL-aware:
- In LTR (Left-to-Right) layouts (English): `marginEnd` = `marginRight`.
- In RTL (Right-to-Left) layouts (Arabic, Hebrew): `marginEnd` = `marginLeft`.

Using `marginEnd` instead of `marginRight` ensures the layout automatically adapts for Arabic/Hebrew users without additional code. This is a best practice for internationalized apps.

**`marginEnd` مقابل `marginRight`:**
`marginEnd` يأخذ إتجاه الكتابة بعين الاعتبار. للعربية (RTL): `marginEnd` يُصبح `marginLeft`. استخدم دائماً `marginStart/End` بدلاً من `marginLeft/Right` للتطبيقات ثنائية الاتجاه.

---

## Section 11: `package.json` — Unexplained Dependencies

### Libraries Listed but Not Fully Explained

| Package | What It Does |
|---|---|
| `expo-constants` | Provides app constants like `Expo.manifest`, `appOwnership`, device info at runtime |
| `expo-linking` | Deep linking utilities: parse incoming URLs, create links to the app |
| `expo-status-bar` | Controls the device status bar color and style (commented out in `_layout.tsx`) |
| `expo-system-ui` | Controls system-level UI like the navigation bar background color on Android |
| `expo-splash-screen` | Controls how long the splash screen is shown before the app is ready |
| `expo-font` | Loads custom fonts at app startup |
| `react-native-worklets` | The worklet runtime for Reanimated — executes animation code on the UI thread |
| `react-dom` + `react-native-web` | Enable running the React Native app in a web browser |

**`react-native-worklets`:**
This package provides the JavaScript runtime that allows animation code to run on the UI thread instead of the JS thread. It is a core dependency of `react-native-reanimated` and is why Reanimated animations are jank-free.

**`expo-font`:**
In a real app, you would use this to load custom fonts:
```typescript
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
    'CustomFont': require('./assets/fonts/CustomFont.ttf'),
});
```

---

## Section 12: TypeScript Concepts Used in the Code

### `type` Keyword — Type Aliases

```typescript
// In login.tsx
type FormData = {
    email: string;
    password: string;
};

// In FormInput.tsx
type FormInputProps<T extends FieldValues> = {
    name: string;
    control: Control<T>;
    rules?: any;
    label?: string;
} & TextInputProps;
```

**`type`** creates a named type alias. Instead of writing the same type structure repeatedly, define it once with a name and reference it.

**`&` (Intersection type):** Combines two types into one. `FormInputProps<T>` has all properties of the literal object type AND all properties of `TextInputProps`.

**`?` (Optional property):** `rules?` means the `rules` prop is optional — callers don't have to provide it.

---

### Generics `<T>` — Type Parameters

```typescript
// useForm with generic
const { control, handleSubmit } = useForm<FormData>({ mode: "all" });
// T = FormData — the form knows exactly what fields to expect

// useState with generic
const [email, setEmail] = useState<string>("");
// The state is typed as string — setEmail("123") is fine, setEmail(123) is a TypeScript error

// FormInput with generic
export function FormInput<T extends FieldValues>({ ... }: FormInputProps<T>) { ... }
// T can be any type that extends FieldValues
// This makes FormInput work with any form shape
```

**Generics:** Allow writing reusable code that works with any type while still being type-safe. The `<T>` is a placeholder for a concrete type that the caller provides.

**الـ Generics:**
تسمح بكتابة كود قابل لإعادة الاستخدام مع أي نوع مع الحفاظ على أمان الأنواع. `<T>` هو حامل مكان لنوع محدد يُحدِّده المُستدعي.

---

### `keyof typeof`

```typescript
// In use-theme-color.ts
colorName: keyof typeof Colors.light & keyof typeof Colors.dark
```

- `typeof Colors.light` → the TypeScript type `{ text: string; background: string; tint: string; icon: string; tabIconDefault: string; tabIconSelected: string }`
- `keyof typeof Colors.light` → the union of all property names: `'text' | 'background' | 'tint' | 'icon' | 'tabIconDefault' | 'tabIconSelected'`
- `& keyof typeof Colors.dark` → must also be a key of the dark object (same keys, so the intersection is the same set)

This enforces at compile time that `colorName` must be a valid key of both `Colors.light` AND `Colors.dark`. If you pass an invalid key like `'accent'`, TypeScript will show an error.

---

## Section 13: `C.tsx` and `D.tsx` — Unused StyleSheet Entries

```typescript
// In C.tsx — StyleSheet.create has 8 style definitions
// Only ONE is used: styles.input
// The rest (container, title, button, buttonText, reactLogo, label, errorInput, errorText)
// are defined but never referenced in the JSX

const styles = StyleSheet.create({
    container: { ... },    // UNUSED
    title: { ... },        // UNUSED
    button: { ... },       // UNUSED
    buttonText: { ... },   // UNUSED
    reactLogo: { ... },    // UNUSED
    label: { ... },        // UNUSED
    input: { ... },        // ← ONLY THIS IS USED
    errorInput: { ... },   // UNUSED
    errorText: { ... },    // UNUSED
});
```

This stylesheet is a copy-paste from `login2.tsx` or `login.tsx` that was not cleaned up. `C.tsx` only needs the `input` style. This is a common mistake when creating new components by copying an existing one — always remove unused styles.

**أنماط غير مُستخدَمة:**
`C.tsx` و`D.tsx` تحتويان على StyleSheet مُنسوخة كاملة من `login.tsx` لكن أكثرها غير مُستخدَم. عند نسخ مكوِّن، يجب حذف الأنماط غير الضرورية لتجنب الارتباك.

---

## Section 14: `D.tsx` — Unused `useState` Import

```typescript
import React, { useState } from "react";
// useState is imported but NEVER called inside D
```

`useState` is imported in `D.tsx` but never used. This suggests `D` was intended to have internal state at some point but the idea was abandoned, leaving the unused import behind.

**`useState` مستورد لكن غير مُستخدَم:**
يُشير إلى أن المكوِّن كان مُخططاً ليمتلك حالة داخلية، لكن الفكرة تُركت دون حذف الاستيراد.

---

## Section 15: Component Naming Conventions

| Pattern | Example | Meaning |
|---|---|---|
| PascalCase function | `function HomeScreen()` | React component (required by React) |
| camelCase function | `const handleAddProduct` | Non-component function |
| PascalCase type | `type FormData` | TypeScript type |
| UPPER_SNAKE_CASE | `const HEADER_HEIGHT = 250` | Constant value that never changes |
| camelCase variable | `const queryClient` | Regular variable |

React requires components to start with an uppercase letter. If `homeScreen` (lowercase) is used as a JSX tag `<homeScreen />`, React treats it as a built-in HTML element (which doesn't exist in React Native) and won't call the function.

**تسمية المكوِّنات:**
يجب أن تبدأ أسماء المكوِّنات بحرف كبير (PascalCase). `<homeScreen/>` بحرف صغير تُعامَل كـ HTML element، وليس مكوِّن React.

---

## Section 16: Complete Bug Registry — Educational Notes

| File | Line | Bug | Correct Code |
|---|---|---|---|
| `api/ApiBase.jsx` | 7 | `window.location.href = "/login"` (web-only) | `router.replace('/login')` |
| `api/ApiBase.jsx` | 26 | `const token = "token"` (hardcoded) | Read from `SecureStore` |
| `api/ProductsService.ts` | 17 | `deleteProduct` uses `post` | `ApiBase.delete(...)` |
| `api/UsersService.ts` | 7 | GET request with `body` | Use query params instead |
| `api/UsersService.ts` | 26 | `logout` uses `GET` | Should be `POST` |
| `app/_layout.tsx` | 10-11 | Two unused imports | Remove them |
| `app/(tabs)/_layout.tsx` | 34-46 | Tabs reference screens outside (tabs) folder | Move files or use Stack |
| `app/(tabs)/index.tsx` | 4 | `D` imported but not used | Remove import |
| `app/(tabs)/login.tsx` | 5,6 | `Alert` and `FormInput` imported, not used | Remove imports |
| `components/C.tsx` | 24-72 | 8 unused style definitions | Remove unused styles |
| `components/D.tsx` | 2 | `useState` imported, not used | Remove import |
| `app/product-details/[id].tsx` | 15-22 | No try/catch on API call | Add error handling |
| `components/new-component.tsx` | 8 | "Your email is:" shown for password | Change to "Your password is:" |

These bugs are **intentional teaching tools**. They exist to:
1. Show real-world code that isn't perfect.
2. Give students something to identify, discuss, and fix.
3. Demonstrate the difference between working code and production-grade code.

---

## Summary | الخلاصة النهائية

بعد مراجعة كل ملفات المشروع سطراً بسطر، إليك الجدول الكامل لكل ما غطَّيناه في هذه المحاضرة:

| Concept | Covered In |
|---|---|
| Dead/unused imports | Section 1, 3, 7 |
| Navigation bug (tabs referencing wrong folder) | Section 2 |
| Arrow functions vs regular functions | Section 4.1 |
| async/await pattern | Section 4.2 |
| Destructuring (array, object, nested) | Section 4.3 |
| Optional chaining `?.` | Section 4.4 |
| Short-circuit `&&`, `\|\|`, `??` | Section 4.5 |
| Spread operator `...` | Section 4.6 |
| Template literals | Section 4.7 |
| export default vs named exports | Section 4.8 |
| useEffect full pattern + why not async | Section 5 |
| router.replace vs push vs back | Section 5 |
| Link `dismissTo` in modals | Section 6 |
| Pressable style as function | Section 7 |
| ESLint configuration | Section 8 |
| ScrollView vs FlatList | Section 9 |
| marginEnd RTL-aware spacing | Section 10 |
| Unexplained package.json dependencies | Section 11 |
| TypeScript `type`, `&`, `?` | Section 12 |
| Generics `<T>` | Section 12 |
| `keyof typeof` | Section 12 |
| Unused StyleSheet entries | Section 13 |
| Component naming conventions | Section 15 |
| Complete bug registry | Section 16 |
