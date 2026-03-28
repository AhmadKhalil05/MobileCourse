# Lecture 10 — Course Summary: Full Architecture Overview
# المحاضرة العاشرة — ملخص المساق: نظرة شاملة على المعمارية الكاملة

---

## Part 1: Course Recap — What Has Been Covered | ما تم تناوله في المساق

This lecture serves as a comprehensive synthesis of all concepts covered throughout the course. It maps every file and concept to its position within the full application architecture.

تُعدِّ هذه المحاضرة تجميعاً شاملاً لجميع المفاهيم التي تناولها المساق. تُعيِّن كل ملف ومفهوم موضعه ضمن المعمارية الكاملة للتطبيق.

---

## Part 2: Full Architecture Map | خريطة المعمارية الكاملة

```
PROJECT ROOT
├── app.json                     → Expo build & platform configuration
├── package.json                 → Dependencies & npm scripts
├── tsconfig.json                → TypeScript compiler + path aliases
│
├── app/                         → ALL NAVIGATION (Expo Router)
│   ├── _layout.tsx              → Root: Stack + QueryClientProvider + ThemeProvider
│   ├── modal.tsx                → /modal route (modal presentation)
│   ├── products.tsx             → /products route (React Query data)
│   ├── product-list.tsx         → /product-list route (manual useState)
│   │
│   ├── (tabs)/                  → Tab group (route group, no URL prefix)
│   │   ├── _layout.tsx          → Tab bar: HapticTab, Icons, Colors
│   │   ├── index.tsx            → / route: A-B-C prop drilling demo
│   │   ├── login.tsx            → /login: React Hook Form demo
│   │   ├── login2.tsx           → /login2: Manual state form + NewComponent
│   │   └── explore.tsx          → /explore: Parallax + Collapsible demo
│   │
│   └── product-details/
│       └── [id].tsx             → /product-details/:id dynamic route
│
├── components/                  → REUSABLE UI COMPONENTS
│   ├── A.tsx                    → Display component (receives email prop)
│   ├── B.tsx                    → Middleman component (prop drilling)
│   ├── C.tsx                    → Controlled input (TextInput + onChange)
│   ├── D.tsx                    → Alternative controlled input
│   ├── new-component.tsx        → Multi-prop display component
│   ├── product-card.tsx         → Card: expo-image + Link navigation
│   ├── themed-text.tsx          → Text with theme + type variants
│   ├── themed-view.tsx          → View with theme background
│   ├── parallax-scroll-view.tsx → Reanimated parallax header
│   ├── hello-wave.tsx           → CSS animation wave emoji
│   ├── haptic-tab.tsx           → Tab button with haptic feedback
│   ├── external-link.tsx        → Link with in-app browser
│   └── ui/
│       ├── FormInput.tsx        → Reusable react-hook-form field
│       ├── collapsible.tsx      → Expand/collapse section
│       ├── icon-symbol.tsx      → Material Icons fallback
│       └── icon-symbol.ios.tsx  → SF Symbols native (iOS)
│
├── api/                         → API LAYER (Network)
│   ├── ApiBase.jsx              → Axios instance + interceptors
│   ├── ProductsService.ts       → Products CRUD functions
│   └── UsersService.ts          → Users/auth functions
│
├── constants/
│   └── theme.ts                 → Colors (light/dark) + Platform Fonts
│
├── hooks/
│   ├── use-color-scheme.ts      → Native: re-export from react-native
│   ├── use-color-scheme.web.ts  → Web: hydration-safe color scheme
│   └── use-theme-color.ts       → Resolve color from theme/props
│
├── lib/
│   └── queryClient.ts           → QueryClient (retry, staleTime)
│
└── scripts/
    └── reset-project.js         → Development utility
```

---

## Part 3: Data Flow Diagrams | مخططات تدفق البيانات

### 3.1 — Login Flow (React Hook Form)

```
User opens /login tab
    → LoginScreen mounts
    → useForm<FormData>({ mode: "all" }) initializes form
    → Controller connects form to TextInput for "email"
    
User types email
    → onChangeText fires → Controller's onChange → stored in RHF internal state
    → mode:"all" → validation runs on every keystroke
    → fieldState.error updates → red border appears/disappears conditionally
    
User taps "Products" button
    → handleSubmit(onSubmit) runs
    → All validation rules checked
    → If valid: onSubmit({ email: "..." }) called
    → router.push('/products') navigates forward
```

### 3.2 — Products Data Flow (React Query)

```
User navigates to /products
    → Products component mounts
    → useQuery({ queryKey: ["products"], queryFn: getProducts }) called
    → Cache check: no cache entry for ["products"]
    → getProducts() called
    → ApiBase.get('/api/v1/products')
    → Request interceptor adds "Authorization: Bearer token" header
    → HTTP GET to mockapi.io/api/v1/products
    → Response interceptor logs response
    → Products array returned
    → Cache stores [products] → staleTime: 60 seconds
    → isLoading = false, data = [...]
    → ProductCard rendered for each product

User taps "Add Product"
    → handleAddProduct() creates product data object
    → mutate(data) called
    → addProduct(data) → ApiBase.post('/api/v1/products', data)
    → Server creates product, responds 201
    → onSuccess fires
    → queryClient.invalidateQueries(["products"])
    → Cache entry marked stale
    → useQuery detects stale → refetches getProducts()
    → Updated list with new product appears
```

### 3.3 — Prop Drilling / State Lifting (HomeScreen)

```
HomeScreen owns: email = ""
    ↓ props.email          ↓ props.onChange
    A                       B
    renders "A {email}"     renders "B"
                            ↓ passes both
                            C
                            renders TextInput
                            value={email} ← from state
                            onChangeText={onChange} ← back to HomeScreen

User types in C's TextInput:
    → onChangeText(text) → props.onChange(text) → HomeScreen.setEmail(text)
    → HomeScreen re-renders
    → email = "new value"
    → Flows to A: "A new value" displayed
    → Flows to B → C: TextInput shows "new value"
```

### 3.4 — Theme Resolution Flow

```
Device system setting: "dark"
    → useColorScheme() returns "dark"
    → useThemeColor({ light: "", dark: "" }, 'text')
    → If props.dark exists: use it
    → Else: Colors['dark']['text'] = '#ECEDEE'
    → ThemedText renders with color '#ECEDEE'
    → ThemedView renders with backgroundColor '#151718'
```

---

## Part 4: Core React Native Concepts Covered | مفاهيم React Native الأساسية المغطاة

| # | Concept | Files Demonstrated |
|---|---|---|
| 1 | `useState` | `HomeScreen`, `login2.tsx`, `collapsible.tsx`, `ProductList` |
| 2 | `useEffect` | `product-details/[id].tsx` |
| 3 | Props (passing down) | `A.tsx`, `B.tsx`, `C.tsx`, `ProductCard` |
| 4 | Prop Drilling | `B.tsx` (middleman) |
| 5 | Lifting State Up | `HomeScreen` → `onChange` → `C` |
| 6 | Controlled Inputs | `C.tsx`, `D.tsx`, `login2.tsx`, `FormInput.tsx` |
| 7 | Conditional Rendering | `Collapsible`, `FormInput`, `products.tsx` error/loading |
| 8 | List Rendering | `products.tsx`, `product-list.tsx` |
| 9 | TypeScript with React | All `.tsx` files |
| 10 | StyleSheet | All component files |
| 11 | Flexbox | All layout components |
| 12 | File-based Routing | `app/` directory structure |
| 13 | Dynamic Routes | `app/product-details/[id].tsx` |
| 14 | Stack Navigation | `app/_layout.tsx` |
| 15 | Tab Navigation | `app/(tabs)/_layout.tsx` |
| 16 | Programmatic Navigation | `router.push`, `router.back`, `router.replace` |
| 17 | Provider Pattern | `QueryClientProvider`, `ThemeProvider` |
| 18 | Custom Hooks | `useThemeColor`, `useColorScheme` |
| 19 | Platform-specific Code | `Platform.select()`, `.ios.tsx` files |
| 20 | React Hook Form | `login.tsx`, `FormInput.tsx` |
| 21 | Axios + Interceptors | `api/ApiBase.jsx` |
| 22 | React Query (useQuery) | `products.tsx` |
| 23 | React Query (useMutation) | `products.tsx` |
| 24 | Cache Invalidation | `queryClient.invalidateQueries` |
| 25 | Animations (Reanimated) | `parallax-scroll-view.tsx`, `hello-wave.tsx` |
| 26 | Haptic Feedback | `haptic-tab.tsx` |
| 27 | Dark Mode / Theming | `theme.ts`, `use-theme-color.ts`, `ThemedText/View` |
| 28 | In-App Browser | `external-link.tsx` |
| 29 | Image Handling | `expo-image`, `require()`, `{uri: url}` |

---

## Part 5: Third-Party Libraries Summary | ملخص المكتبات الخارجية

| Library | Category | Used For |
|---|---|---|
| `expo-router` | Navigation | File-based routing, `Stack`, `Tabs`, `Link`, `router` |
| `@tanstack/react-query` | State Management | Server state: `useQuery`, `useMutation`, `QueryClient` |
| `axios` | HTTP | API requests with interceptors |
| `react-hook-form` | Forms | `useForm`, `Controller`, validation |
| `expo-image` | Media | Optimized image loading with caching |
| `expo-haptics` | Native APIs | Haptic feedback on iOS |
| `expo-symbols` | Icons | SF Symbols on iOS |
| `@expo/vector-icons` | Icons | Material Icons on Android/Web |
| `expo-web-browser` | Browser | In-app browser for external links |
| `react-native-reanimated` | Animations | Parallax, wave animation, worklets |
| `react-native-safe-area-context` | Layout | `SafeAreaView` for notch/home bar |
| `react-native-screens` | Navigation | Native screen containers |
| `react-native-gesture-handler` | Input | Native gesture recognition |
| `@react-navigation/native` | Navigation | Core navigation primitives |
| `@react-navigation/bottom-tabs` | Navigation | Bottom tab bar |
| `@react-navigation/elements` | Navigation | `PlatformPressable` |

---

## Part 6: Key Design Patterns | أنماط التصميم الرئيسية

### Pattern 1: Provider Pattern (Context Distribution)
```
App Root
└── QueryClientProvider (data cache context)
    └── ThemeProvider (theme context)
        └── Navigator
            └── Screens (access both contexts via hooks)
```
Used for distributing global state without prop drilling from the root.

يُوزِّع الحالة العامة دون prop drilling من الجذر.

### Pattern 2: Service Layer Separation
```
UI Component → Service Function → Axios Instance → API
```
UI does not contain HTTP logic. Services do not contain UI logic.

واجهة المستخدم لا تحتوي على منطق HTTP. الخدمات لا تحتوي على منطق UI.

### Pattern 3: Controlled Component Pattern
```
State (useState) → value prop → TextInput (displayed)
TextInput (user types) → onChangeText → setState → rerender
```
The input's displayed value is always determined by React state.

القيمة المعروضة في الـ input تُحدَّد دائماً بواسطة حالة React.

### Pattern 4: Themed Component Pattern
```
useColorScheme → theme ('light'|'dark')
→ useThemeColor → Colors[theme][colorName]
→ ThemedText / ThemedView → automatically colored
```
Components automatically respond to system dark/light mode.

المكوِّنات تستجيب تلقائياً لوضع النظام الفاتح/الداكن.

### Pattern 5: Cache Invalidation After Mutation
```
useMutation → onSuccess → invalidateQueries → useQuery refetches → UI updates
```
After modifying data, trigger a fresh fetch to keep UI synchronized with server.

بعد تعديل البيانات، إطلاق جلب جديد لإبقاء UI متزامنة مع الخادم.

---

## Part 7: Identifying Code for Educational Purposes | الكود التعليمي مقابل كود الإنتاج

Some patterns in this project are deliberately simplified or contain intentional bugs for educational contrast:

| File | Educational Code | Production Note |
|---|---|---|
| `ApiBase.jsx` | `window.location.href = "/login"` (web-only API) | Should use `router.replace('/login')` |
| `ApiBase.jsx` | `const token = "token"` (hardcoded) | Should read from secure storage |
| `ApiBase.jsx` | Uses `.jsx` extension | Should be `.ts` for type safety |
| `ProductsService.ts` | `deleteProduct` uses `post` method | Should use `delete` HTTP method |
| `UsersService.ts` | GET request with `body` | GET requests should not have a body |
| `UsersService.ts` | `logout` uses `GET` | Logout should use `POST` |
| `product-details/[id].tsx` | `useLocalSearchParams` id untyped | Should be validated/typed |
| `login.tsx` | `onSubmit` doesn't actually call `login()` | Should call the API service |
| `new-component.tsx` | "Your email is:" repeated for password | Copy-paste error |

These are not "mistakes" in the educational context — they are **deliberate contrasts** to highlight correct vs. incorrect approaches.

هذه ليست "أخطاء" في السياق التعليمي — بل هي **تناقضات مقصودة** لتسليط الضوء على الأساليب الصحيحة مقابل الخاطئة.

---

## Part 8: Course Learning Path | مسار التعلم في المساق

```
Lecture 01: Configuration
    app.json, package.json, tsconfig.json
    ↓
Lecture 02: Navigation
    Expo Router, Stack, Tabs, Dynamic Routes
    ↓
Lecture 03: React Fundamentals
    Props, State, Controlled Inputs, Prop Drilling
    ↓
Lecture 04: Forms
    react-hook-form, Controller, Validation
    ↓
Lecture 05: API Layer
    Axios, Interceptors, Service Architecture
    ↓
Lecture 06: Server State
    React Query, useQuery, useMutation, Cache Invalidation
    ↓
Lecture 07: Theming
    Colors, Dark Mode, useColorScheme, ThemedText/View
    ↓
Lecture 08: UI Components
    ProductCard, Collapsible, Reanimated, Haptics, ExternalLink, Icons
    ↓
Lecture 09: Layout
    Explore Screen, StyleSheet Deep Dive, Flexbox Patterns
    ↓
Lecture 10: Architecture Review
    Full system synthesis, Dependencies, Patterns
```

---

## Summary | الخلاصة النهائية

This React Native project is a comprehensive teaching application that, in a single codebase, demonstrates:

1. **React fundamentals** — State, Props, Component communication.
2. **Modern navigation** — File-based routing with Expo Router.
3. **Professional form handling** — React Hook Form with validation.
4. **Enterprise API architecture** — Axios with interceptors and service layers.
5. **Efficient server state** — TanStack React Query for caching and synchronization.
6. **System theming** — Automatic dark/light mode support.
7. **Native platform features** — Haptics, SF Symbols, in-app browser.
8. **High-performance animations** — React Native Reanimated with worklets.

هذا المشروع هو تطبيق تعليمي شامل يُظهر في قاعدة كود واحدة:
أساسيات React، التنقل الحديث، معالجة النماذج الاحترافية، معمارية API على مستوى المؤسسات، إدارة حالة الخادم الفعَّالة، الثيم الديناميكي، ميزات المنصة الأصلية، والرسوم المتحركة عالية الأداء.
