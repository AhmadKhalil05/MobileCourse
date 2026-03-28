# Lecture 02 — Navigation and Routing (Expo Router)
# المحاضرة الثانية — التنقل والتوجيه (Expo Router)

---

## Part 1: Concept — File-Based Routing | مفهوم التوجيه المبني على الملفات

### English Explanation

Expo Router implements **file-based routing**, a paradigm where the file and folder structure inside the `app/` directory directly determines the navigation structure of the application. There is no need to manually declare routes — creating a file automatically creates a route.

**Rule:** Every `.tsx` or `.ts` file inside `app/` becomes a navigable route. Special files control layout behavior.

#### Directory Structure and Resulting Routes

```
app/
├── _layout.tsx              → Root layout (wraps everything)
├── modal.tsx                → Route: /modal
├── products.tsx             → Route: /products
├── product-list.tsx         → Route: /product-list
│
├── (tabs)/                  → Route group (tabs do NOT appear in URL)
│   ├── _layout.tsx          → Layout for the tab group
│   ├── index.tsx            → Route: / (home)
│   ├── login.tsx            → Route: /login
│   └── login2.tsx           → Route: /login2 (not registered in tabs layout)
│
└── product-details/
    └── [id].tsx             → Route: /product-details/:id (dynamic segment)
```

**Key Concepts:**
- **`_layout.tsx`** — A special file that defines the layout wrapper for its directory. All sibling files are rendered inside it.
- **`(tabs)/`** — Parentheses create a **route group**. The folder name does not appear in the URL. Files inside are grouped visually (in the tab bar) but their routes remain flat.
- **`[id].tsx`** — Square brackets create a **dynamic route segment**. The `id` part matches any value and makes it available as a parameter inside the component.

---

### الشرح بالعربي

يُطبِّق Expo Router نظام **التوجيه المبني على الملفات**، حيث هيكل الملفات والمجلدات داخل `app/` يحدد مباشرةً هيكل التنقل في التطبيق. لا حاجة لإعلان المسارات يدوياً — إنشاء ملف يُنشئ مساراً تلقائياً.

**المفاهيم الأساسية:**
- `_layout.tsx` — ملف خاص يُعرِّف غلاف التخطيط لمجلده.
- `(tabs)/` — الأقواس تُنشئ **مجموعة مسارات** لا تظهر في URL.
- `[id].tsx` — الأقواس المربعة تُنشئ **مقطع مسار ديناميكي** يقبل أي قيمة.

---

## Part 2: Root Layout — `app/_layout.tsx` | التخطيط الجذري

**Path:** `app/_layout.tsx`

### English Explanation

```typescript
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
```

#### Line-by-Line Analysis

**Import: `DarkTheme, DefaultTheme, ThemeProvider`**
React Navigation provides two pre-built themes (`DarkTheme` and `DefaultTheme`). `ThemeProvider` is a React Context provider that distributes the selected theme down the entire component tree. All themed components (`ThemedText`, `ThemedView`) read from this context.

**Import: `Stack` from `expo-router`**
`Stack` is a navigator type in Expo Router that stacks screens on top of each other. Navigating forward pushes a new screen onto the stack; going back pops it. This is the most common navigation pattern on mobile.

**Import: `QueryClientProvider` and `queryClient`**
`QueryClientProvider` wraps the entire application and makes the React Query cache (`queryClient`) available to all child components. This is required before any `useQuery` or `useMutation` hook can function.

**`unstable_settings = { anchor: '(tabs)' }`**
This tells Expo Router that when the app starts from a deep link or a specific route, it should consider the `(tabs)` group as the initial anchor. This ensures "back" navigation from a deep link goes to the tabs rather than exiting the app.

**`useColorScheme()`**
A hook that returns `'light'` or `'dark'` based on the system's current color mode setting. Used here to conditionally apply the correct theme.

**`<Stack>` and `<Stack.Screen>`**
The `Stack` component renders a stack navigator. Each `Stack.Screen` registers a route with its options:
- `name="(tabs)"` with `headerShown: false` — hides the navigation header for the tabs group, because tabs have their own visual navigation bar.
- `name="modal"` with `presentation: 'modal'` — renders this screen as a modal overlay (slides up from the bottom on iOS).

#### Component Hierarchy (Provider Pattern)
```
QueryClientProvider        ← provides data fetching context
  └── ThemeProvider        ← provides theme context
        └── Stack          ← navigation stack
              ├── (tabs)   ← tab group (no header)
              └── modal    ← modal screen
```

The provider pattern ensures that child components at any depth can access data (theme, query cache) without prop drilling.

---

### الشرح بالعربي

هذا الملف هو الجذر الكامل للتطبيق — كل شيء يُعرض داخله.

**نمط المزودين (Provider Pattern):**
يُلاحَظ أن المكونات مُتشعِّبة: `QueryClientProvider` يُغلِّف `ThemeProvider` الذي يُغلِّف `Stack`. هذا النمط يُتيح لأي مكون في أي عمق الوصول إلى:
- قاعدة بيانات الـ cache (عبر React Query)
- بيانات الثيم الحالي (فاتح أو داكن)

**`Stack.Screen` بخيار `presentation: 'modal'`:**
يجعل شاشة `modal` تنزلق من الأسفل بدلاً من الدخول من الجانب — هذا سلوك Modal القياسي في iOS.

---

## Part 3: Tabs Layout — `app/(tabs)/_layout.tsx` | تخطيط التبويبات

**Path:** `app/(tabs)/_layout.tsx`

### English Explanation

```typescript
import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
        />
        <Tabs.Screen
            name="login"
            options={{
                title: 'Login',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
        />
        <Tabs.Screen
            name="products"
            options={{
                title: 'Products',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
        />
        <Tabs.Screen
            name="Product-list"
            options={{
                title: 'Product List',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
        />
      </Tabs>
  );
}
```

#### Analysis

**`<Tabs>` Component**
The `Tabs` navigator renders a bottom tab bar. Each tab corresponds to one screen. The active tab is highlighted according to `tabBarActiveTintColor`.

**`screenOptions`**
These options apply globally to all tab screens:
- `tabBarActiveTintColor` — Uses the theme's `tint` color for the active tab icon and label.
- `headerShown: false` — Hides the top navigation header across all tabs.
- `tabBarButton: HapticTab` — Replaces the default tab button component with a custom `HapticTab` that adds haptic feedback when pressed.

**`<Tabs.Screen>` Components**
Each `Tabs.Screen` registers one tab:
- `name` — Must match the filename of the screen (without `.tsx`). For `index.tsx`, the name is `"index"`.
- `title` — The label shown under the tab icon.
- `tabBarIcon` — A render function that receives `{ color }` (active/inactive color managed by React Navigation) and returns an icon component.

**Note on Registered Tabs vs. Actual Routes**
The tabs layout only registers four tabs: `index`, `login`, `products`, and `Product-list`. However, additional files exist in the `(tabs)` folder such as `login2.tsx` and `explore.tsx` — these are accessible routes but are not displayed in the tab bar.

---

### الشرح بالعربي

هذا الملف يُعرِّف شريط التبويبات السفلي في التطبيق.

**`tabBarButton: HapticTab`:**
يستبدل زر التبويب الافتراضي بمكوِّن مُخصَّص يضيف اهتزازاً لطيفاً عند الضغط على الجهاز (iOS فقط). هذا مثال على تخصيص سلوك التنقل.

**دالة `tabBarIcon`:**
تتلقى الدالة `{ color }` الذي يتغير تلقائياً بين لون التبويب النشط وغير النشط. هذا يعني أن الأيقونات تغير لونها تلقائياً دون أي كود إضافي.

---

## Part 4: Dynamic Routing — `app/product-details/[id].tsx` | التوجيه الديناميكي

**Path:** `app/product-details/[id].tsx`

### English Explanation

```typescript
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { getProductById } from "@/api/ProductsService";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

const ProductDetails = () => {
    const [productDetails, setProductDetails] = useState<any>({});
    const { id } = useLocalSearchParams();

    const handleOnPress = () => {
        router.replace('/login2');
    }

    const fetchData = async () => {
        const response = await getProductById(id);
        console.log(response.data);
        setProductDetails(response.data);
    }
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <View>
            <Image style={styles.image} source={{uri: productDetails?.imageUrl}} />
            <Text style={styles.text}>{productDetails?.description}</Text>
            <Pressable onPress={handleOnPress}>Go to login2</Pressable>
        </View>
    )
}
```

#### Dynamic Route Parameter: `useLocalSearchParams()`
When navigating to `/product-details/42`, the value `42` is captured as the `id` parameter. `useLocalSearchParams()` is an Expo Router hook that returns an object containing all URL parameters for the current route. Here, `{ id }` destructuring extracts the specific `id` parameter.

#### `useEffect` for Data Fetching
```typescript
useEffect(() => {
    fetchData()
}, []);
```
`useEffect` with an empty dependency array `[]` runs exactly once after the component mounts. This is the standard pattern for performing a side effect (network request) on initial load. `fetchData` calls the API service with the `id` and stores the result in component state.

#### `router.replace('/login2')`
`router.replace` navigates to a new screen while **replacing** the current entry in the navigation stack. This is different from `router.push` which adds to the stack. After `replace`, pressing back will not return to the product details screen.

#### Optional Chaining: `productDetails?.imageUrl`
The `?.` operator safely accesses a property when the object might be `null` or `undefined`. Since `productDetails` starts as an empty object `{}` and the API is async, the data is not available immediately. Optional chaining prevents crashes during the initial render.

---

### الشرح بالعربي

**التوجيه الديناميكي `[id].tsx`:**
الاسم بين قوسين مربعين يعني أن هذا المقطع يقبل أي قيمة. عند التنقل إلى `/product-details/5`، تُصبح القيمة `5` متاحة كمعامل `id` عبر `useLocalSearchParams()`.

**الفرق بين `router.push` و `router.replace`:**
- `push` — يُضيف الشاشة الجديدة فوق المكدس. الضغط على "رجوع" يعود للشاشة السابقة.
- `replace` — يُستبدل الشاشة الحالية بالجديدة. الضغط على "رجوع" يتخطى الشاشة المستبدَلة.

**`useEffect` مع مصفوفة تبعيات فارغة `[]`:**
يعني "نفِّذ هذا الكود مرة واحدة فقط عند تحميل المكوِّن". هذا النمط القياسي لجلب البيانات عند فتح شاشة.

---

## Part 5: Programmatic Navigation Methods | طرق التنقل البرمجي

In addition to file-based routing, Expo Router provides the `router` object for programmatic navigation within event handlers (button presses, form submissions, etc.).

بالإضافة إلى التوجيه المبني على الملفات، يُوفِّر Expo Router كائن `router` للتنقل البرمجي داخل معالجات الأحداث.

| Method | Behavior | السلوك |
|---|---|---|
| `router.push('/path')` | Navigates forward; adds to history stack | ينتقل للأمام؛ يُضيف للمكدس |
| `router.replace('/path')` | Navigates; replaces current history entry | ينتقل؛ يُستبدل السجل الحالي |
| `router.back()` | Goes to previous screen | يعود للشاشة السابقة |
| `<Link href="/path">` | Declarative navigation component | مكوِّن تنقل تصريحي |

---

## Part 6: Modal Screen — `app/modal.tsx` | شاشة Modal

**Path:** `app/modal.tsx`

### English Explanation

```typescript
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
```

This is a simple modal screen. Its visual behavior (sliding up from the bottom) is already configured in `app/_layout.tsx` via `presentation: 'modal'`. The screen itself only needs to define its UI content.

**`<Link href="/" dismissTo>`**
The `dismissTo` prop on a `Link` component inside a modal tells Expo Router to dismiss the modal and navigate to `/` simultaneously, rather than pushing a new route.

---

### الشرح بالعربي

شاشة Modal بسيطة. سلوكها المرئي (الانزلاق من الأسفل) مُعرَّف مسبقاً في `_layout.tsx` عبر `presentation: 'modal'`. الشاشة نفسها تُعرِّف المحتوى فقط.

**`<Link dismissTo>`:** خاصية خاصة داخل Modal تُغلق النافذة المنبثقة وتعود للمسار المحدد في آنٍ واحد.

---

## Summary | خلاصة

| Concept | File | Key Mechanism |
|---|---|---|
| Root layout + providers | `app/_layout.tsx` | `Stack` + `QueryClientProvider` + `ThemeProvider` |
| Tab navigation | `app/(tabs)/_layout.tsx` | `Tabs` + `Tabs.Screen` |
| Dynamic route | `app/product-details/[id].tsx` | `useLocalSearchParams()` |
| Modal presentation | `app/modal.tsx` | `presentation: 'modal'` in `_layout.tsx` |
| Programmatic navigation | Various screens | `router.push`, `router.replace`, `router.back()` |
