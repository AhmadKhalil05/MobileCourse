# Lecture 13 — Context API: The Missing Link Between Props and Redux
# المحاضرة الثالثة عشرة — Context API: الحلقة المفقودة بين Props وRedux

---

## Introduction | مقدمة

In Lecture 11, we built a complete picture of how data moves in React Native:

- **Props** → simple, but causes Prop Drilling at scale.
- **Redux** → powerful, but heavy and complex for small-to-medium apps.

We also briefly mentioned **React Context** as a third option. This lecture covers it in depth.

في المحاضرة 11، رسمنا صورة كاملة عن كيفية حركة البيانات في React Native:

- **Props** → بسيطة، لكن تُسبِّب Prop Drilling على نطاق واسع.
- **Redux** → قوية، لكن ثقيلة ومعقدة للتطبيقات الصغيرة والمتوسطة.

وذكرنا **React Context** كخيار ثالث. هذه المحاضرة تشرحه بعمق.

Additionally, this project uses **two Providers** that you already see in the code. Both of them are built on the same Context API principle:

1. `QueryClientProvider` — from `@tanstack/react-query`
2. `ThemeProvider` — from `@react-navigation/native`

بالإضافة إلى ذلك، يستخدم هذا المشروع **مُزوِّدَين (Providers)** يراهما المستخدم في الكود. كلاهما مبني على مبدأ Context API ذاته:

1. `QueryClientProvider` — من `@tanstack/react-query`
2. `ThemeProvider` — من `@react-navigation/native`

---

## Part 1: The Problem Context Solves | المشكلة التي يحلها Context

### Recap: The Prop Drilling Diagram

From Lecture 11, we had this painful situation:

```
┌────────────────────────────────────────────────────┐
│                       App                          │
│   const user = { name: "Ahmad", role: "admin" }    │
│   <Layout user={user} />                           │
└──────────────────────┬─────────────────────────────┘
                       │ user (NOT needed here)
                       ▼
┌──────────────────────────────────────────────────────┐
│                     Layout                           │
│   props.user → just passes it along                  │
│   <Sidebar user={props.user} />                      │
└──────────────────────┬───────────────────────────────┘
                       │ user (NOT needed here)
                       ▼
┌──────────────────────────────────────────────────────┐
│                    Sidebar                           │
│   props.user → just passes it along                  │
│   <NavMenu user={props.user} />                      │
└──────────────────────┬───────────────────────────────┘
                       │ user (NOT needed here)
                       ▼
             ┌─────────────────────┐
             │      NavMenu        │
             │   props.user.name   │  ← FINALLY used here
             └─────────────────────┘

PAIN: Layout and Sidebar know about `user` even though they don't need it.
المعاناة: Layout وSidebar يعرفان عن `user` رغم أنهما لا يحتاجانه.
```

### The Context Solution | حل Context

Context allows you to "teleport" data directly to any component that needs it, skipping all the intermediate components:

يتيح Context "نقل" البيانات مباشرةً لأي مكوِّن يحتاجها، متجاوزاً جميع المكوِّنات الوسيطة:

```
┌────────────────────────────────────────────────────┐
│                       App                          │
│   <UserContext.Provider value={{ name, role }}>    │
│       <Layout />   ← no props!                     │
│   </UserContext.Provider>                           │
└────────────────────────────────────────────────────┘
                ↕  Context "tunnel"
                ↕  نفق Context
         ┌──────────────┐
         │    Layout    │  ← no props, unaware of user
         └──────────────┘
         ┌──────────────┐
         │    Sidebar   │  ← no props, unaware of user
         └──────────────┘
         ┌──────────────┐
         │    NavMenu   │  ← reads directly from context!
         │ useContext() │  ← يقرأ مباشرةً من الـ context
         └──────────────┘

Layout and Sidebar are COMPLETELY CLEAN — they don't know user exists.
Layout وSidebar نظيفتان تماماً — لا تعلمان بوجود user.
```

---

## Part 2: How Context API Works — The 3 Steps | كيف يعمل Context API — 3 خطوات

### The Three Components of Context | المكوِّنات الثلاثة للـ Context

```
┌─────────────────────────────────────────────────────────────┐
│  1. CREATE (الإنشاء)                                        │
│     React.createContext()                                    │
│     → Creates the "tunnel" that data will travel through    │
│     → يُنشئ "النفق" الذي ستسافر البيانات من خلاله          │
├─────────────────────────────────────────────────────────────┤
│  2. PROVIDE (التزويد)                                       │
│     <Context.Provider value={...}>                          │
│     → Wraps components that need access to the data         │
│     → يلف المكوِّنات التي تحتاج الوصول للبيانات            │
├─────────────────────────────────────────────────────────────┤
│  3. CONSUME (الاستهلاك)                                     │
│     useContext(Context)                                      │
│     → Any descendant reads the value directly               │
│     → أي مكوِّن حفيد يقرأ القيمة مباشرةً                  │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow Diagram | رسم تخطيطي خطوة بخطوة

```
STEP 1: Create the Context
الخطوة 1: إنشاء الـ Context

   const UserContext = React.createContext(defaultValue);
                              │
                              │ Creates an object with two parts:
                              │ يُنشئ كائناً بجزأين:
                              │
                    ┌─────────┴─────────┐
                    │                   │
              .Provider           .Consumer (or useContext)
         يُعطي البيانات          يقرأ البيانات


STEP 2: Provide (wrap the tree)
الخطوة 2: التزويد (لف الشجرة)

   <UserContext.Provider value={{ name: "Ahmad", role: "admin" }}>
       <App />
   </UserContext.Provider>
   │
   │  Everything inside <App /> can now access the value.
   │  كل شيء داخل <App /> يمكنه الوصول للقيمة الآن.


STEP 3: Consume anywhere inside the tree
الخطوة 3: الاستهلاك في أي مكان داخل الشجرة

   // In NavMenu.tsx (deep level 4)
   const { name, role } = useContext(UserContext);
   //  ↑ No props chain. Direct access. مباشر. بدون سلسلة props.
```

---

## Part 3: Complete Code Example | مثال كود كامل

### Building a User Context from Scratch | بناء User Context من الصفر

```typescript
// ─────────────────────────────────────────────────
// FILE: context/UserContext.tsx
// ─────────────────────────────────────────────────

import React, { createContext, useContext, useState } from 'react';

// 1. Define the TypeScript type for what the context contains
//    تعريف نوع TypeScript لما يحتويه الـ context
type User = {
    name: string;
    role: string;
    isLoggedIn: boolean;
};

type UserContextType = {
    user: User | null;
    login: (name: string, role: string) => void;
    logout: () => void;
};

// 2. Create the context with a default value
//    إنشاء الـ context بقيمة افتراضية
const UserContext = createContext<UserContextType | null>(null);
//   └── null as default = not yet provided
//       null كافتراضي = لم يُزوَّد بعد

// 3. Create the Provider component
//    إنشاء مكوِّن المُزوِّد
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (name: string, role: string) => {
        setUser({ name, role, isLoggedIn: true });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        // 4. Pass the value — everything inside `children` can read this
        //    تمرير القيمة — كل شيء داخل `children` يستطيع قراءتها
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// 5. Export a custom hook for convenient consumption
//    تصدير hook مخصص لسهولة الاستهلاك
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used inside UserProvider');
        // لا يمكن استخدام useUser خارج UserProvider
    }
    return context;
}
```

```typescript
// ─────────────────────────────────────────────────
// FILE: app/_layout.tsx
// Wrap the entire app with the Provider
// لف التطبيق بالكامل بالـ Provider
// ─────────────────────────────────────────────────

import { UserProvider } from '@/context/UserContext';

export default function RootLayout() {
    return (
        <UserProvider>     {/* ← All screens can now access user state */}
            <Stack>        {/* ← كل الشاشات تستطيع الوصول لحالة المستخدم */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </UserProvider>
    );
}
```

```typescript
// ─────────────────────────────────────────────────
// FILE: app/(tabs)/login.tsx
// Writing to context — no prop callbacks needed
// الكتابة في الـ context — لا حاجة لـ callbacks في props
// ─────────────────────────────────────────────────

import { useUser } from '@/context/UserContext';

function LoginScreen() {
    const { login } = useUser();  // ← Direct access. No props.

    const handleLogin = () => {
        login('Ahmad', 'admin');  // ← Updates context state
    };                            //   يُحدِّث حالة الـ context

    return <Pressable onPress={handleLogin}><Text>Login</Text></Pressable>;
}
```

```typescript
// ─────────────────────────────────────────────────
// FILE: components/UserAvatar.tsx (deep level 5)
// Reading from context — no prop chain needed
// القراءة من الـ context — لا سلسلة props مطلوبة
// ─────────────────────────────────────────────────

import { useUser } from '@/context/UserContext';

function UserAvatar() {
    const { user } = useUser();  // ← Direct access at any depth

    return (
        <View>
            <Text>{user?.name}</Text>
            <Text>{user?.role}</Text>
        </View>
    );
}
```

---

## Part 4: The Project's Real Context Usage | استخدام Context الحقيقي في المشروع

### ThemeProvider — Context in Action | ThemeProvider — الـ Context في العمل

Look at `app/_layout.tsx` — the project already uses **two Providers**:

انظر إلى `app/_layout.tsx` — المشروع يستخدم **مُزوِّدَين** فعلياً:

```typescript
// app/_layout.tsx (actual code from this project)
export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>     {/* Provider 1 */}
            <ThemeProvider                             {/* Provider 2 */}
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
```

**Both `QueryClientProvider` and `ThemeProvider` ARE Context Providers.**

They work using the exact same `React.createContext` + `Provider` + `useContext` mechanism.

**كلا `QueryClientProvider` و`ThemeProvider` هما Context Providers.**

يعملان باستخدام نفس آلية `React.createContext` + `Provider` + `useContext` تماماً.

---

### How ThemeProvider Works Internally | كيف يعمل ThemeProvider داخلياً

```
app/_layout.tsx
    │
    │  <ThemeProvider value={DarkTheme}>
    │      ← Creates a Theme Context with the current theme object
    │      ← يُنشئ Theme Context بكائن الثيم الحالي
    │
    ├─► app/(tabs)/_layout.tsx
    │       │
    │       ├─► components/themed-text.tsx
    │       │       │
    │       │       │  useThemeColor({...}, 'text')
    │       │       │       │
    │       │       │       ├── useColorScheme()   ← reads device color scheme
    │       │       │       │                        يقرأ نظام ألوان الجهاز
    │       │       │       └── Colors[theme]['text']  ← looks up color table
    │       │       │                                     يبحث في جدول الألوان
    │       │       │
    │       ├─► components/themed-view.tsx
    │       │       │
    │       │       │  useThemeColor({...}, 'background')
    │       │       │  ← Same mechanism, different color key
    │       │       │  ← نفس الآلية، مفتاح لون مختلف
```

### Reading the Real Hook | قراءة الـ Hook الحقيقي

```typescript
// hooks/use-theme-color.ts (actual code from this project)
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  // ↑ Reads 'light' or 'dark' from the device OS setting
  //   يقرأ 'light' أو 'dark' من إعدادات نظام التشغيل

  const colorFromProps = props[theme];  
  // ↑ If the caller passed a specific override color, use it
  //   إذا مرَّر المُستدعي لوناً محدداً، استخدمه

  if (colorFromProps) {
    return colorFromProps;              // Override wins
  } else {
    return Colors[theme][colorName];   // Default from theme table
    // يستخدم اللون الافتراضي من جدول الثيم
  }
}
```

```typescript
// constants/theme.ts (actual code from this project)
export const Colors = {
  light: {
    text: '#11181C',         // Dark text on light background
    background: '#fff',
    tint: '#0a7ea4',         // Accent color (links, icons)
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',         // Light text on dark background
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
```

**Usage in a component:**

```typescript
// components/themed-text.tsx (actual code from this project)
export function ThemedText({ style, lightColor, darkColor, type, ...rest }: ThemedTextProps) {

    // Calls useThemeColor → which calls useColorScheme()
    // يستدعي useThemeColor → الذي يستدعي useColorScheme()
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return <Text style={[{ color }, style]} {...rest} />;
    //            ↑ Color is automatically correct for light/dark mode
    //              اللون تلقائياً صحيح لوضعَي الضوء والظلام
}
```

---

## Part 5: QueryClientProvider — The TanStack/React Query Context | QueryClientProvider — سياق TanStack/React Query

### What Is QueryClientProvider? | ما هو QueryClientProvider؟

`QueryClientProvider` is another Context Provider. It puts a `QueryClient` instance into a React Context, making it available to **every `useQuery` and `useMutation` hook** anywhere in the component tree.

`QueryClientProvider` هو مُزوِّد Context آخر. يضع نسخة من `QueryClient` في React Context، مما يجعلها متاحةً لكل **`useQuery` و`useMutation` hook** في أي مكان في شجرة المكوِّنات.

```
// lib/queryClient.ts (actual code from this project)
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,          // Retry failed requests once
            staleTime: 1000 * 60, // Cache is "fresh" for 1 minute
        },                        // الكاش "طازج" لمدة دقيقة واحدة
    },
});
```

### The Full React Query Context Flow | التدفق الكامل لـ React Query Context

```
┌───────────────────────────────────────────────────────────────────┐
│                        app/_layout.tsx                            │
│                                                                   │
│   <QueryClientProvider client={queryClient}>                      │
│       ← Creates a QueryClient Context                             │
│       ← يُنشئ QueryClient Context                                 │
│       ← queryClient holds: cache, requests, config               │
│       ← queryClient يحمل: الكاش، الطلبات، الإعدادات             │
└───────────────────────────────┬───────────────────────────────────┘
                                │  Context "tunnels" down
                                │  الـ Context "يسرب" للأسفل
              ┌─────────────────┼──────────────────┐
              │                 │                  │
              ▼                 ▼                  ▼
   ┌──────────────┐   ┌──────────────────┐  ┌──────────────────────┐
   │  products.tsx│   │  product-list.tsx│  │ product-details/[id] │
   │              │   │                  │  │                      │
   │ useQuery({   │   │  useQuery({      │  │  useMutation({       │
   │   queryKey:  │   │    queryKey:     │  │    mutationFn:       │
   │   queryFn:   │   │    queryFn:      │  │    ...               │
   │ })           │   │  })              │  │  })                  │
   │              │   │                  │  │                      │
   │ ← Reads from │   │ ← Shares cache   │  │ ← Writes to cache   │
   │   the context│   │   with above     │  │   invalidates queries│
   └──────────────┘   └──────────────────┘  └──────────────────────┘

KEY: Both useQuery calls with the SAME queryKey share ONE cache entry.
المهم: كلا useQuery بنفس queryKey يشتركان في إدخال كاش واحد.
```

### Why This Matters — The Cache Sharing | لماذا هذا مهم — مشاركة الكاش

```typescript
// Screen A: products.tsx
const { data } = useQuery({
    queryKey: ['products'],      // ← This is the cache KEY
    queryFn: getProducts,        //   هذا هو مفتاح الكاش
});

// Screen B: product-list.tsx (maybe a different tab)
const { data } = useQuery({
    queryKey: ['products'],      // ← SAME key! Reads from same cache!
    queryFn: getProducts,        //   نفس المفتاح! يقرأ من نفس الكاش!
});

// RESULT: Only ONE HTTP request is made. Both screens share the result.
// النتيجة: طلب HTTP واحد فقط يُرسَل. كلا الشاشتَين تشتركان في النتيجة.
```

This sharing is ONLY possible because `QueryClient` is stored in a Context that both components can access.

هذه المشاركة ممكنة فقط لأن `QueryClient` مخزَّن في Context تستطيع كلا المكوِّنَين الوصول إليه.

---

## Part 6: Local Storage — Where Context Gets Persisted | Local Storage — أين يُحفَظ الـ Context

### The Problem: Context is Not Persistent | المشكلة: الـ Context غير ثابت

```
┌───────────────────────────────────────────────────┐
│           App Running in Memory                   │
│           التطبيق يعمل في الذاكرة                 │
│                                                   │
│   UserContext = { name: "Ahmad", role: "admin" }  │
│                          │                        │
│                    User closes app                │
│                    المستخدم يُغلق التطبيق          │
│                          │                        │
│                          ▼                        │
│              ❌  Context LOST                     │
│              ❌  الـ Context ضاع                   │
│                                                   │
│   UserContext = null   ← Back to default          │
│                           العودة للافتراضي         │
└───────────────────────────────────────────────────┘
```

React Context lives **entirely in memory**. When the app closes, it's gone. To persist data across app sessions, you must save it to **Local Storage**.

React Context يعيش **كلياً في الذاكرة**. عند إغلاق التطبيق، يختفي. لحفظ البيانات عبر جلسات التطبيق، يجب حفظها في **Local Storage**.

### Storage Options in React Native | خيارات التخزين في React Native

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STORAGE OPTIONS COMPARISON                           │
│                    مقارنة خيارات التخزين                                │
├─────────────────┬──────────────┬──────────────────┬─────────────────────┤
│ Solution        │ Persistent?  │ Secure?          │ Use Case            │
│ الحل            │ ثابت؟        │ آمن؟              │ حالة الاستخدام      │
├─────────────────┼──────────────┼──────────────────┼─────────────────────┤
│ React Context   │ ❌ No        │ N/A              │ Sharing state       │
│ React Context   │ ❌ لا        │                  │ مشاركة الحالة       │
├─────────────────┼──────────────┼──────────────────┼─────────────────────┤
│ AsyncStorage    │ ✅ Yes       │ ❌ No            │ User preferences,   │
│ التخزين الغير   │ ✅ نعم       │ ❌ لا             │ cached data         │
│  متزامن         │              │                  │ تفضيلات المستخدم    │
├─────────────────┼──────────────┼──────────────────┼─────────────────────┤
│ SecureStore     │ ✅ Yes       │ ✅ Yes           │ Tokens, passwords   │
│ المخزن الآمن    │ ✅ نعم       │ ✅ نعم            │ التوكنات، كلمات المرور│
├─────────────────┼──────────────┼──────────────────┼─────────────────────┤
│ MMKV            │ ✅ Yes       │ Optional         │ High-performance    │
│ MMKV            │ ✅ نعم       │ اختياري           │ أداء عالٍ            │
└─────────────────┴──────────────┴──────────────────┴─────────────────────┘
```

### The Real Project: SecureStore for Tokens | المشروع الحقيقي: SecureStore للتوكنات

The project already uses `expo-secure-store` in `api/ApiBase.jsx` — though with a bug (hardcoded string `"token"` instead of reading the real stored token):

المشروع يستخدم `expo-secure-store` في `api/ApiBase.jsx` — لكن مع خطأ (نص ثابت `"token"` بدلاً من قراءة التوكن المخزَّن الحقيقي):

```typescript
// api/ApiBase.jsx (actual project code — buggy version)
// نسخة المشروع الحقيقية — بها خطأ

instance.interceptors.request.use(async (config) => {
    const tokenType = "Bearer";
    const token = "token";  // ← BUG: hardcoded! Should be from storage
    //                           خطأ: مشفَّر بصورة ثابتة! يجب أن يكون من التخزين

    config.headers.Authorization = `${tokenType} ${token}`;
    return config;
});
```

**The correct implementation using `SecureStore`:**

```typescript
// api/ApiBase.tsx (CORRECTED version)
// النسخة المُصحَّحة

import * as SecureStore from 'expo-secure-store';

instance.interceptors.request.use(async (config) => {
    const tokenType = "Bearer";

    // Read the token from secure storage
    // قراءة التوكن من التخزين الآمن
    const token = await SecureStore.getItemAsync('auth_token');

    if (token) {
        config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;
});
```

---

### Pattern: Context + SecureStore = Persistent Auth | نمط: Context + SecureStore = مصادقة ثابتة

This is the industry-standard pattern for authentication in React Native:

هذا النمط هو المعيار الصناعي للمصادقة في React Native:

```typescript
// context/AuthContext.tsx — Full production-style implementation
// التنفيذ الكامل بأسلوب الإنتاج

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;           // Loading from storage on startup
    login: (token: string) => Promise<void>;   // يحفظ في SecureStore
    logout: () => Promise<void>;               // يمسح من SecureStore
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ─────────────────────────────────────────────
    // ON APP START: Restore token from secure storage
    // عند بدء التطبيق: استعادة التوكن من التخزين الآمن
    // ─────────────────────────────────────────────
    useEffect(() => {
        const loadToken = async () => {
            const stored = await SecureStore.getItemAsync('auth_token');
            setToken(stored);    // null if not found
            setIsLoading(false); // Done loading
        };
        loadToken();
    }, []); // Runs once on mount — يعمل مرة واحدة عند التحميل

    // ─────────────────────────────────────────────
    // LOGIN: Save to memory + save to secure storage
    // تسجيل الدخول: حفظ في الذاكرة + حفظ في التخزين الآمن
    // ─────────────────────────────────────────────
    const login = async (newToken: string) => {
        setToken(newToken);                               // In-memory (Context)
        await SecureStore.setItemAsync('auth_token', newToken); // Persistent
        // ↑ Context state          ↑ Disk storage
        // حالة Context             تخزين قرص
    };

    // ─────────────────────────────────────────────
    // LOGOUT: Clear from memory + clear from secure storage
    // تسجيل الخروج: مسح من الذاكرة + مسح من التخزين الآمن
    // ─────────────────────────────────────────────
    const logout = async () => {
        setToken(null);                                      // In-memory
        await SecureStore.deleteItemAsync('auth_token');     // Persistent
    };

    return (
        <AuthContext.Provider value={{
            token,
            isLoggedIn: token !== null,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
```

### The Full Lifecycle Flow | دورة الحياة الكاملة

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CONTEXT + STORAGE LIFECYCLE                       │
│                        دورة حياة Context + التخزين                       │
└──────────────────────────────────────────────────────────────────────────┘

  APP OPENS (cold start)
  فتح التطبيق (بداية باردة)
         │
         ▼
  AuthProvider mounts
  AuthProvider يُحمَّل
         │
         ▼
  useEffect runs:
  useEffect يعمل:
  SecureStore.getItemAsync('auth_token')
         │
    ┌────┴────┐
    │         │
  Found     Not Found
  وُجِد      لم يُوجَد
    │         │
    ▼         ▼
  setToken  setToken(null)
  (token)
    │         │
    └────┬────┘
         │
         ▼
  isLoading = false
  App renders correct state
  التطبيق يُصيَّر الحالة الصحيحة
         │
    ┌────┴──────────────────┐
    │                       │
  token exists            no token
  التوكن موجود             لا توكن
    │                       │
    ▼                       ▼
  isLoggedIn=true         isLoggedIn=false
  Show main app           Show login screen
  إظهار التطبيق           إظهار شاشة الدخول


  USER LOGS IN
  المستخدم يسجل الدخول
         │
         ▼
  login('eyJhbGciO...')
         │
    ┌────┴────────────────────┐
    │                         │
  setToken(token)    SecureStore.setItemAsync(...)
  (in memory)        (on disk)
  في الذاكرة         على القرص
    │                         │
    └────────────┬────────────┘
                 │
                 ▼
  Context updates → all consumers re-render
  Context يتحدث → كل المستهلكين يُعاد رسمهم


  APP CLOSES
  التطبيق يُغلَق
         │
         ▼
  ❌ token in context = LOST (memory cleared)
     التوكن في context = ضاع (ذاكرة مُمسَحة)
  ✅ 'auth_token' in SecureStore = KEPT (disk persisted)
     'auth_token' في SecureStore = محفوظ (قرص)


  APP REOPENS
  التطبيق يُعاد فتحه
         │
         ▼
  AuthProvider runs useEffect → reads from SecureStore
  AuthProvider يُشغِّل useEffect → يقرأ من SecureStore
         │
         ▼
  Token restored → user stays logged in ✅
  التوكن مُستعاد → المستخدم يبقى مسجلاً ✅
```

---

## Part 7: Context vs Redux vs Props — The Full Comparison | المقارنة الكاملة

### The Decision Flow Chart | مخطط قرار الاختيار

```
START: I need to share data between components
البداية: أحتاج مشاركة بيانات بين المكوِّنات
    │
    ▼
Is it LOCAL to one component only?
هل هي محلية لمكوِّن واحد فقط؟
    │
    ├── YES → Use useState() inside that component
    │         استخدم useState() داخل المكوِّن
    │
    └── NO ──►  Is the tree shallow (1-2 levels)?
                هل الشجرة ضحلة (1-2 مستويات)؟
                    │
                    ├── YES → Use Props / Lifting State Up
                    │         استخدم Props / رفع الحالة للأعلى
                    │
                    └── NO ──► Does the data change infrequently?
                               هل البيانات تتغير نادراً؟
                               (theme, locale, user session, auth)
                               (الثيم، اللغة، جلسة المستخدم، المصادقة)
                                    │
                                    ├── YES → Use Context API ✅
                                    │         استخدم Context API
                                    │
                                    └── NO ──► Is it complex app-wide state
                                              that changes frequently?
                                              هل هي حالة تطبيق معقدة تتغير كثيراً؟
                                              (shopping cart, notifications, feed)
                                                    │
                                                    ├── YES → Use Redux / Zustand
                                                    │         استخدم Redux / Zustand
                                                    │
                                                    └── Is it SERVER state?
                                                        هل هي حالة خادم؟
                                                        (API data, remote data)
                                                              │
                                                              └── YES → Use React Query ✅
                                                                        استخدم React Query
```

### Side-by-Side Code Comparison | مقارنة الكود جانباً لجانب

```typescript
// ──────────────────────────────────────────────────────
// SCENARIO: Show user's name in 3 different components
// السيناريو: إظهار اسم المستخدم في 3 مكوِّنات مختلفة
// ──────────────────────────────────────────────────────

// ❌ APPROACH 1: Props (causes prop drilling)
// الأسلوب 1: Props (يسبب prop drilling)

function RootLayout() {
    const user = { name: 'Ahmad' };
    return <Layout user={user} />;          // must know about user
}
function Layout({ user }) {
    return <Sidebar user={user} />;         // just passing through
}
function Sidebar({ user }) {
    return <UserBadge user={user} />;       // finally uses it
}
function UserBadge({ user }) {
    return <Text>{user.name}</Text>;        // the actual consumer
}
// Problem: Layout and Sidebar don't need user, but receive it.
// المشكلة: Layout وSidebar لا يحتاجان user لكنهما يستقبلانه.
```

```typescript
// ✅ APPROACH 2: Context API (clean, no drilling)
// الأسلوب 2: Context API (نظيف، بدون حفر)

function RootLayout() {
    const user = { name: 'Ahmad' };
    return (
        <UserContext.Provider value={user}>
            <Layout />    {/* ← NO user prop! */}
        </UserContext.Provider>
    );
}
function Layout() {
    return <Sidebar />;   // ← NO user prop!
}
function Sidebar() {
    return <UserBadge />; // ← NO user prop!
}
function UserBadge() {
    const user = useContext(UserContext); // ← Direct access!
    return <Text>{user.name}</Text>;     //   وصول مباشر!
}
// Layout and Sidebar are completely clean.
// Layout وSidebar نظيفتان تماماً.
```

```typescript
// ✅ APPROACH 3: Redux (for complex, frequently-changing state)
// الأسلوب 3: Redux (للحالة المعقدة المتغيرة كثيراً)

function UserBadge() {
    // Reads from global Redux store
    // يقرأ من مخزن Redux العالمي
    const user = useSelector((state: RootState) => state.user);
    return <Text>{user.name}</Text>;
}
// No Provider needed in this component.
// لا Provider مطلوب في هذا المكوِّن.
// The Provider is at the very root of the app.
// الـ Provider موجود في جذر التطبيق.
```

---

## Part 8: Full Architecture Map — Everything Connected | خريطة المعمارية الكاملة — كل شيء متصل

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         STATE ARCHITECTURE                               │
│                         معمارية الحالة                                   │
│                                                                          │
│   ┌────────────────────────────────────────────────────────┐             │
│   │                    APP ROOT LEVEL                      │             │
│   │                    مستوى جذر التطبيق                   │             │
│   │                                                        │             │
│   │  <QueryClientProvider>     ← Server State Context      │             │
│   │      <ThemeProvider>       ← UI Theme Context          │             │
│   │          <AuthProvider>    ← Auth/User Context         │             │
│   │              <App />                                   │             │
│   │          </AuthProvider>                               │             │
│   │      </ThemeProvider>                                  │             │
│   │  </QueryClientProvider>                                │             │
│   └────────────────────────────────────────────────────────┘             │
│                                │                                         │
│               ┌────────────────┼────────────────┐                        │
│               │                │                │                        │
│               ▼                ▼                ▼                        │
│   ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐             │
│   │  Any Screen     │ │  Any Screen  │ │   Any Component  │             │
│   │  (Deep Level 5) │ │  (Level 2)   │ │   (Level 8)      │             │
│   │                 │ │              │ │                  │             │
│   │ useAuth()       │ │ useQuery()   │ │ useThemeColor()  │             │
│   │ ← reads user    │ │ ← server data│ │ ← theme colors   │             │
│   │   token, isLoggedIn   from cache │ │   light/dark     │             │
│   └─────────────────┘ └──────────────┘ └──────────────────┘             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    PERSISTENCE LAYER                             │    │
│  │                    طبقة الثبات                                   │    │
│  │                                                                  │    │
│  │  SecureStore → auth tokens (encrypted on disk)                  │    │
│  │  SecureStore → توكنات المصادقة (مُشفَّرة على القرص)             │    │
│  │                                                                  │    │
│  │  AsyncStorage → user preferences, cached lists                  │    │
│  │  AsyncStorage → تفضيلات المستخدم، القوائم المؤقتة              │    │
│  │                                                                  │    │
│  │  React Query Cache → server responses (in-memory, TTL-based)   │    │
│  │  كاش React Query → استجابات الخادم (في الذاكرة، بناءً على TTL) │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Part 9: Context Performance — The Re-render Problem | أداء Context — مشكلة إعادة الرسم

### The Critical Gotcha | التحذير الحاسم

```typescript
// ❌ PROBLEMATIC: All consumers re-render when ANY value changes
// إشكالي: كل المستهلكين يُعاد رسمهم عند تغيُّر أي قيمة

const AppContext = createContext(null);

function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    const [cart, setCart] = useState([]);

    return (
        <AppContext.Provider value={{ user, theme, cart, setUser, setTheme, setCart }}>
            {children}
        </AppContext.Provider>
    );
    // PROBLEM: If cart changes, components that only read `theme` ALSO re-render!
    // المشكلة: إذا تغيَّر cart، المكوِّنات التي تقرأ theme فقط تُعاد رسمها أيضاً!
}
```

```typescript
// ✅ CORRECT: Split into separate contexts (like this project does!)
// صحيح: تقسيم إلى context منفصلة (كما يفعل هذا المشروع!)

// ThemeProvider handles ONLY theme state
// ThemeProvider يتعامل مع حالة الثيم فقط
<ThemeProvider value={theme}>

// QueryClientProvider handles ONLY server state  
// QueryClientProvider يتعامل مع حالة الخادم فقط
<QueryClientProvider client={queryClient}>

// AuthProvider handles ONLY auth state
// AuthProvider يتعامل مع حالة المصادقة فقط
<AuthProvider>

// This is the EXACT pattern in app/_layout.tsx!
// هذا هو النمط بالضبط في app/_layout.tsx!
```

---

## Part 10: Nesting Providers — What Happens in the Project | تداخل المُزوِّدين — ما يحدث في المشروع

### The Actual Provider Stack | مكدس المُزوِّدين الفعلي

From `app/_layout.tsx`:

```
<QueryClientProvider client={queryClient}>     ← Layer 1 (outermost)
    <ThemeProvider                             ← Layer 2
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
        <Stack>                                ← Layer 3 (Navigation)
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" />
        </Stack>
    </ThemeProvider>
</QueryClientProvider>
```

### Why QueryClientProvider Is Outermost | لماذا QueryClientProvider هو الأخارجي

```
┌─ QueryClientProvider ─────────────────────────────────┐
│  Provides: queryClient (cache for all API calls)      │
│  يُزوِّد: queryClient (كاش لجميع طلبات API)           │
│                                                       │
│  ┌─ ThemeProvider ─────────────────────────────────┐  │
│  │  Provides: colors based on dark/light mode      │  │
│  │  يُزوِّد: الألوان بناءً على وضع الظلام/الضوء    │  │
│  │                                                 │  │
│  │  ┌─ Stack (Navigation) ───────────────────────┐ │  │
│  │  │  Manages: screen history and routing       │ │  │
│  │  │  يُدير: سجل الشاشات والتوجيه              │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘

Rule: The more "global" (less frequently changing) the concern,
      the more OUTER its Provider should be.

القاعدة: كلما كان الاهتمام "أكثر عالمية" (يتغير نادراً)،
         كلما كان مُزوِّده في طبقة أبعد للخارج.
```

---

## Part 11: Complete Comparison Table | جدول المقارنة الكامل

| Feature / الميزة | Props | Context API | Redux | React Query |
|---|---|---|---|---|
| **Data Type / نوع البيانات** | Any / أي | UI/App state | App state | Server state |
| **Depth / العمق** | Shallow | Any / أي | Any / أي | Any / أي |
| **Boilerplate** | None | Low | High | Medium |
| **Persistence / الثبات** | ❌ No | ❌ No | ❌ No | ⚡ Cache only |
| **Requires Library** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Re-renders** | Predictable | All consumers | Selective | Selective |
| **Best For / الأفضل لـ** | Simple sharing | Theme, User, Auth | Complex state | API data |
| **In this project** | A→B→C chain | ThemeProvider | Not used (shown conceptually in L11) | QueryClientProvider |

---

## Summary | الخلاصة

```
The Four Layers of State in a React Native App
الطبقات الأربع للحالة في تطبيق React Native

┌────────────────────────────────────────────────────────────────┐
│  LAYER 1: Component State                                      │
│  الطبقة 1: حالة المكوِّن                                       │
│  Tool: useState() / useReducer()                               │
│  Use: Local UI state (toggle, input, animation)               │
│  الاستخدام: حالة UI المحلية (تبديل، إدخال، رسوم متحركة)       │
├────────────────────────────────────────────────────────────────┤
│  LAYER 2: Context API                                          │
│  الطبقة 2: Context API                                         │
│  Tool: createContext + Provider + useContext                   │
│  Use: Shared app state (theme, auth, locale)                  │
│  الاستخدام: حالة التطبيق المشتركة (الثيم، المصادقة، اللغة)    │
│  In project: ThemeProvider, QueryClientProvider               │
├────────────────────────────────────────────────────────────────┤
│  LAYER 3: Global State (Redux / Zustand)                      │
│  الطبقة 3: الحالة العالمية                                     │
│  Tool: Redux Toolkit / Zustand                                │
│  Use: Complex, frequently-changing shared state               │
│  الاستخدام: حالة مشتركة معقدة تتغير كثيراً                    │
├────────────────────────────────────────────────────────────────┤
│  LAYER 4: Persistence                                         │
│  الطبقة 4: الثبات                                              │
│  Tool: SecureStore (auth tokens) / AsyncStorage (preferences) │
│  Use: Data that must survive app restarts                     │
│  الاستخدام: البيانات التي يجب أن تنجو من إعادة تشغيل التطبيق  │
└────────────────────────────────────────────────────────────────┘

The project in this course demonstrates:
المشروع في هذا المساق يُوضِّح:

Layer 1 → useState in HomeScreen, login.tsx, product-details
Layer 2 → ThemeProvider + QueryClientProvider in _layout.tsx
Layer 3 → Shown conceptually in Lecture 11 (Redux pattern)
Layer 4 → SecureStore referenced (buggy) in api/ApiBase.jsx

The CORRECT architecture for a production React Native app
combines ALL FOUR layers, each responsible for its own concern.

المعمارية الصحيحة لتطبيق React Native احترافي
تجمع الطبقات الأربع، كل منها مسؤولة عن اهتمامها الخاص.
```
