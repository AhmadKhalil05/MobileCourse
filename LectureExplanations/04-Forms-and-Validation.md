# Lecture 04 — Forms and Validation with React Hook Form
# المحاضرة الرابعة — النماذج والتحقق باستخدام React Hook Form

---

## Part 1: Concept — Why Use a Form Library? | لماذا نستخدم مكتبة للنماذج؟

### English Explanation

Managing forms manually in React involves:
- A separate `useState` for every field.
- A separate handler function for every field.
- Manual validation logic (checking email format, minimum password length, etc.).
- Manual error state management.
- Manual tracking of whether the form has been submitted.

For a form with 5 fields, this results in 5 state variables, 5 handlers, and complex validation logic scattered throughout the component.

**React Hook Form** (`react-hook-form`) solves all of this. It:
- Manages all field values internally.
- Provides declarative validation rules per field.
- Automatically tracks error messages.
- Tracks form submission state.
- Minimizes unnecessary re-renders (it uses uncontrolled inputs internally by default).

---

### الشرح بالعربي

إدارة النماذج يدوياً في React تعني:
- `useState` منفصل لكل حقل.
- دالة معالج منفصلة لكل حقل.
- منطق تحقق يدوي معقد.
- إدارة يدوية لحالات الأخطاء.

**React Hook Form** تحل كل هذا. تُدير قيم الحقول داخلياً، وتوفر قواعد تحقق تصريحية، وتتتبع رسائل الخطأ تلقائياً.

---

## Part 2: `app/(tabs)/login.tsx` — Form with React Hook Form

**Path:** `app/(tabs)/login.tsx`

### Full Code

```typescript
import React from "react";
import {
    Text,
    StyleSheet,
    Alert,
    Pressable,
    View,
    TextInput,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "@/components/ui/FormInput";
import { router } from "expo-router";
import { Image } from "expo-image";
import { login } from "@/api/UsersService"

type FormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const { control, handleSubmit } = useForm<FormData>({ mode: "all" });

    const onSubmit = async (data: FormData) => {
        router.push('/products')
    };
    const handleOnPress = () => {
        router.back();
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login Page</Text>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.reactLogo} />
            <Controller
                control={control}
                name={"email"}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, error && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                )}
            ></Controller>
            <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.7 },
                ]}
            >
                <Text style={styles.buttonText}>Products</Text>
            </Pressable>
            <Pressable onPress={handleOnPress}>back</Pressable>
        </SafeAreaView>
    );
}
```

---

### Line-by-Line Analysis

#### TypeScript Form Data Type
```typescript
type FormData = {
    email: string;
    password: string;
};
```
Defines the shape of the form data as a TypeScript type. This is passed as a generic to `useForm<FormData>`, making the library type-safe: field names are validated at compile time and `onSubmit` receives a properly typed object.

#### `useForm` Hook
```typescript
const { control, handleSubmit } = useForm<FormData>({ mode: "all" });
```
`useForm` is the primary hook of React Hook Form. It initializes the form and returns utility functions and objects.

**Destructured values:**
- **`control`** — An object that connects React Hook Form's internal state to individual form fields. It must be passed to every `Controller` component.
- **`handleSubmit`** — A higher-order function. When called as `handleSubmit(onSubmit)`, it returns an event handler that:
  1. Prevents default form submission behavior.
  2. Runs all validation rules.
  3. If validation passes, calls `onSubmit(data)` with the typed form data.
  4. If validation fails, populates fieldState.error objects without calling `onSubmit`.

**`mode: "all"`** — Controls when validation runs:
- `"all"` — Validates on every change (keystroke) AND on blur (losing focus). This provides the most responsive error feedback.
- `"onSubmit"` (default) — Only validates when the user submits the form.
- `"onChange"` — Only on each keystroke.
- `"onBlur"` — Only when leaving a field.

#### `onSubmit` Function
```typescript
const onSubmit = async (data: FormData) => {
    router.push('/products')
};
```
This function is called by React Hook Form only when all validations pass. `data` is the fully typed form data (`{ email: string, password: string }`). In this implementation, the function navigates to the products screen (the actual `login()` API call is imported but not used — it demonstrates the intended pattern).

#### `Controller` Component
```typescript
<Controller
    control={control}
    name={"email"}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, error && styles.errorInput]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>
    )}
></Controller>
```

`Controller` is the bridge between React Hook Form and any controlled input component (like `TextInput`).

**Props:**
- **`control`** — The control object from `useForm`.
- **`name="email"`** — The field name. Matches the TypeScript type's `email` property.
- **`render`** — A render prop function. React Hook Form calls this function with two objects:
  - **`field`** — Contains the field's current state:
    - `onChange` — Call this when the input value changes (passed to `onChangeText`).
    - `onBlur` — Call this when the input loses focus (triggers blur validation, passed to `onBlur`).
    - `value` — The current value managed by React Hook Form (passed to `value` prop).
  - **`fieldState`** — Contains validation state:
    - `error` — An error object `{ message: string }` if the field has a validation error, or `undefined` if valid.

**Conditional Styling:**
```typescript
style={[styles.input, error && styles.errorInput]}
```
An array of styles is merged in React Native (the last style wins for conflicts). When `error` is truthy, `styles.errorInput` (red border) is added to the array. The `&&` short-circuit pattern means `errorInput` is only included when `error` is defined.

#### `handleSubmit(onSubmit)` — The Submit Pattern
```typescript
<Pressable onPress={handleSubmit(onSubmit)}>
```
`handleSubmit` wraps `onSubmit`. When the Pressable is tapped:
1. React Hook Form runs all registered validations.
2. If valid → `onSubmit(data)` executes.
3. If invalid → errors populate `fieldState.error` for each failing field, triggering re-render to show error styles.

---

### الشرح بالعربي

**`useForm`:** يُهيِّء النموذج ويُعيد أدوات للتحكم فيه.
- `control` — كائن يربط مكتبة React Hook Form بحقول الإدخال.
- `handleSubmit` — دالة تُغلِّف `onSubmit`؛ تُشغِّل التحقق أولاً، وإن نجح تستدعي `onSubmit`.

**`mode: "all"`:** التحقق يعمل في كل ضغطة مفتاح وعند مغادرة الحقل — أكثر استجابةً للمستخدم.

**`Controller`:** جسر بين React Hook Form وأي مكوِّن إدخال. الدالة `render` تستقبل:
- `field` — يحتوي `onChange`, `onBlur`, `value` لتوصيلها بحقل الإدخال.
- `fieldState` — يحتوي `error` لعرض حالة الخطأ.

**التنسيق الشرطي:**
```javascript
style={[styles.input, error && styles.errorInput]}
```
عند وجود خطأ، يُضاف `styles.errorInput` (حد أحمر) إلى مصفوفة الأنماط تلقائياً.

---

## Part 3: `components/ui/FormInput.tsx` — Reusable Form Field Component | مكوِّن حقل النموذج القابل لإعادة الاستخدام

**Path:** `components/ui/FormInput.tsx`

### Full Code

```typescript
import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { Controller, Control, FieldValues, RegisterOptions } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    name: string;
    control: Control<T>;
    rules?: any;
    label?: string;
} & TextInputProps;

export function FormInput<T extends FieldValues>({
     name,
     control,
     rules,
     label,
     ...inputProps
 }: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name as any}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}

                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        {...inputProps}
                    />

                    {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
}
```

#### Analysis: Generic Reusable Form Component

This component is an **abstraction** of the inline `Controller` pattern used in `login.tsx`. Instead of writing a `Controller` block for every field, `FormInput` encapsulates the entire pattern into a reusable component.

**Generic TypeScript: `<T extends FieldValues>`**
The component uses a TypeScript generic `T` constrained to `FieldValues` (the base type for React Hook Form data). This ensures that `Control<T>` is properly typed — the parent's `control` object type is preserved and type safety is maintained across the boundary.

**`FormInputProps<T>` Type Definition**
```typescript
type FormInputProps<T extends FieldValues> = {
    name: string;
    control: Control<T>;
    rules?: any;
    label?: string;
} & TextInputProps;
```
The type combines custom props with `TextInputProps` (all props accepted by React Native's `TextInput`). The `&` intersection means `FormInput` accepts ALL TextInput props in addition to its own custom ones. The `...inputProps` spread passes them directly to `TextInput`.

**`rules` prop**
The `rules` object is passed directly to the `Controller` component and defines field validation rules:
```typescript
// Example usage:
<FormInput
  name="email"
  control={control}
  rules={{
    required: "Email is required",
    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
  }}
  label="Email"
/>
```

**Error Message Display**
```typescript
{error && (
    <Text style={styles.errorText}>{error.message}</Text>
)}
```
Unlike the inline `Controller` in `login.tsx`, `FormInput` also renders the error message text below the input. This is conditional rendering — `error.message` only renders when `error` exists.

**Conditional Label Rendering**
```typescript
{label && <Text style={styles.label}>{label}</Text>}
```
If `label` is provided, it renders above the input. If not, nothing is shown. The `&&` operator performs conditional rendering.

---

### الشرح بالعربي

`FormInput` هو تجريد (abstraction) لنمط `Controller` المتكرر. بدلاً من كتابة كتلة `Controller` لكل حقل في كل نموذج، يُغلِّف هذا المكوِّن النمط بالكامل في مكوِّن واحد قابل لإعادة الاستخدام.

**TypeScript Generic `<T extends FieldValues>`:**
يضمن أن نوع `control` المُمرَّر متوافق مع نوع النموذج الفعلي. هذا يحافظ على الأمان النوعي عبر حدود المكوِّنات.

**`& TextInputProps` (التقاطع):**
يجمع خصائص مخصصة مع كل خصائص `TextInput` القياسية. هذا يعني أنك تستطيع تمرير `placeholder`, `keyboardType`, `secureTextEntry` مباشرةً لـ `FormInput` وسيُمرِّرها إلى `TextInput` الداخلي.

---

## Part 4: Comparison — Manual vs. React Hook Form | مقارنة بين الطريقتين

### Manual State Management (`login2.tsx`) vs. React Hook Form (`login.tsx`)

| Aspect | Manual (login2.tsx) | React Hook Form (login.tsx) |
|---|---|---|
| State management | `useState` per field | Managed internally by `useForm` |
| Handler functions | One per field | `onChangeText={onChange}` via Controller |
| Validation | Must write manually | Declarative `rules` object |
| Error messages | Must manage separately | `fieldState.error.message` auto available |
| Submit handling | Manual function | `handleSubmit(onSubmit)` |
| Re-renders | Re-renders on every keystroke | Minimal re-renders (uncontrolled internally) |
| Code volume | More boilerplate | Less boilerplate |

---

### الشرح بالعربي | Comparison Table in Arabic

| الجانب | يدوي (login2.tsx) | React Hook Form (login.tsx) |
|---|---|---|
| إدارة الحالة | `useState` لكل حقل | تُدار داخلياً بـ `useForm` |
| دوال المعالجة | واحدة لكل حقل | `onChange` عبر Controller |
| التحقق | يُكتب يدوياً | كائن `rules` تصريحي |
| رسائل الخطأ | تُدار يدوياً | `fieldState.error.message` تلقائياً |
| إرسال النموذج | دالة يدوية | `handleSubmit(onSubmit)` |
| إعادة الرسم | عند كل ضغطة | رسم محدود وفعَّال |

---

## Summary | خلاصة

React Hook Form provides a declarative, performant approach to form management in React Native. The key concepts demonstrated are:

1. **`useForm`** — Initializes the form and returns control utilities.
2. **`Controller`** — Bridges the library with any input component.
3. **`handleSubmit`** — Validates before calling the submit handler.
4. **`fieldState.error`** — Automatically populated on validation failure.
5. **`FormInput`** — A reusable abstraction that encapsulates the full pattern.
6. **`mode: "all"`** — Controls validation timing.

React Hook Form توفر نهجاً تصريحياً وفعَّالاً لإدارة النماذج في React Native. الزر `handleSubmit` هو القلب — يُشغِّل التحقق ويستدعي `onSubmit` فقط عند النجاح.
