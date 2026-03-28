# Lecture 01 — Project Configuration and Setup
# المحاضرة الأولى — إعداد وتهيئة المشروع

---

## Part 1: Overview | نظرة عامة

This lecture covers the foundational configuration files of the React Native (Expo) project. These files do not contain application logic but define the project identity, dependencies, build settings, and TypeScript compilation rules. Understanding them is essential before reading any application code.

تتناول هذه المحاضرة ملفات الإعداد الأساسية لمشروع React Native (Expo). لا تحتوي هذه الملفات على منطق تطبيقي، بل تُعرِّف هوية المشروع، والمكتبات المستخدمة، وإعدادات البناء، وقواعد تحويل TypeScript. فهمها ضروري قبل قراءة أي كود تطبيقي.

---

## Part 2: `package.json` — Project Manifest | بيان المشروع

**Path:** `package.json`

### English Explanation

`package.json` is the central manifest of any Node.js/JavaScript project. It serves two primary roles: describing the project metadata and listing all software dependencies.

#### Project Identity Fields
- `"name": "firstmobileapp2"` — The internal npm package name (lowercase, no spaces). This is used when publishing or referencing the package.
- `"main": "expo-router/entry"` — This is a critical Expo Router directive. Instead of pointing to a custom `index.js`, the entry point is delegated entirely to `expo-router`, which then reads the `app/` directory to construct navigation automatically (file-based routing).
- `"version": "1.0.0"` — Semantic version following the pattern `MAJOR.MINOR.PATCH`.
- `"private": true` — Prevents accidental publishing of this package to the public npm registry.

#### Scripts Section
```json
"scripts": {
  "start": "expo start",
  "reset-project": "node ./scripts/reset-project.js",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```
These are npm scripts executed via `npm run <script-name>`:
- `start` — Launches the Expo development server.
- `android` / `ios` / `web` — Launches the server targeting a specific platform.
- `reset-project` — Runs a custom JavaScript script to reset the project to a clean state.
- `lint` — Runs Expo's ESLint configuration to check code quality.

#### Dependencies (Production Libraries)

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~54.0.33 | Core Expo SDK — the framework itself |
| `expo-router` | ~6.0.23 | File-based navigation system |
| `react` | 19.1.0 | Core React library |
| `react-native` | 0.81.5 | React Native framework |
| `@tanstack/react-query` | ^5.90.21 | Server state management, data fetching/caching |
| `axios` | ^1.13.5 | HTTP client for API requests |
| `react-hook-form` | ^7.71.1 | Form state management and validation |
| `react-native-reanimated` | ~4.1.1 | High-performance animations |
| `expo-haptics` | ~15.0.8 | Haptic feedback on supported devices |
| `expo-image` | ~3.0.11 | Optimized image component |
| `expo-font` | ~14.0.11 | Custom font loading |
| `expo-splash-screen` | ~31.0.13 | Splash screen control |
| `expo-symbols` | ~1.0.8 | SF Symbols support (iOS) |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets (notch, home bar) |
| `react-native-screens` | ~4.16.0 | Native navigation screen containers |
| `react-native-gesture-handler` | ~2.28.0 | Native gesture recognizers |
| `@react-navigation/native` | ^7.1.8 | Core React Navigation |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Bottom tab bar navigation |

#### DevDependencies (Development Only)

| Package | Purpose |
|---|---|
| `typescript` | ~5.9.2 | TypeScript compiler |
| `@types/react` | ~19.1.0 | TypeScript type definitions for React |
| `eslint` | ^9.25.0 | Static code analysis |
| `eslint-config-expo` | ~10.0.0 | Expo-specific ESLint rules |

---

### الشرح بالعربي

ملف `package.json` هو البيان المركزي لأي مشروع Node.js. يؤدي دورين أساسيين: وصف البيانات التعريفية للمشروع، وسرد جميع التبعيات البرمجية.

**الحقل `"main": "expo-router/entry"`** هو الأهم هنا — فبدلاً من استخدام ملف دخول مخصص، يُفوَّض النظام بالكامل إلى مكتبة `expo-router` التي تقرأ مجلد `app/` وتبني التنقل تلقائياً (نظام التوجيه المبني على الملفات).

**الفرق بين `dependencies` و `devDependencies`:**
- `dependencies` — مكتبات تُضمَّن في التطبيق النهائي وتُشحن مع المستخدم.
- `devDependencies` — أدوات تُستخدم فقط أثناء التطوير (TypeScript, ESLint) ولا تُضمَّن في البناء النهائي.

---

## Part 3: `app.json` — Expo Application Configuration | إعداد تطبيق Expo

**Path:** `app.json`

### English Explanation

`app.json` is the Expo-specific configuration file. It controls how the app is built, displayed, and behaves on each platform.

```json
{
  "expo": {
    "name": "firstMobileApp2",
    "slug": "firstMobileApp2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "firstmobileapp2",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    ...
  }
}
```

#### Key Fields Explained

- **`name`** — The visible name of the app as shown on the device home screen.
- **`slug`** — A URL-safe identifier used on Expo's servers. Must be lowercase, no spaces.
- **`scheme`** — The custom deep link URL scheme. Allows other apps to open this app via `firstmobileapp2://`.
- **`userInterfaceStyle: "automatic"`** — The app automatically adapts to the device's light or dark mode setting.
- **`newArchEnabled: true`** — Enables React Native's New Architecture (Fabric renderer + TurboModules), which provides better performance and JSI-based native module communication.
- **`orientation: "portrait"`** — The app is locked to portrait orientation and will not rotate.

#### iOS Configuration
```json
"ios": {
  "supportsTablet": true
}
```
Enables the app to run on iPad in addition to iPhone, adjusting layout for larger screens.

#### Android Configuration
```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE",
    "foregroundImage": "./assets/images/android-icon-foreground.png",
    "backgroundImage": "./assets/images/android-icon-background.png",
    "monochromeImage": "./assets/images/android-icon-monochrome.png"
  },
  "edgeToEdgeEnabled": true,
  "predictiveBackGestureEnabled": false
}
```
- **Adaptive Icon** — Android 8+ supports adaptive icons that consist of a foreground layer over a background layer. The system can display them with various shapes (circle, square, rounded square) depending on the device manufacturer.
- **`edgeToEdgeEnabled: true`** — The app content extends to the full screen edges including under the status bar and navigation bar.
- **`predictiveBackGestureEnabled: false`** — Disables Android 13+ predictive back gesture (the swipe-back preview animation) to avoid navigation conflicts.

#### Plugins Section
```json
"plugins": [
  "expo-router",
  ["expo-splash-screen", {
    "image": "./assets/images/splash-icon.png",
    "imageWidth": 200,
    "resizeMode": "contain",
    "backgroundColor": "#ffffff",
    "dark": { "backgroundColor": "#000000" }
  }]
]
```
Expo plugins are config modifications applied at build time. The `expo-router` plugin sets up the file-based routing system. The `expo-splash-screen` plugin configures the initial loading screen shown while the app initializes.

#### Experiments
```json
"experiments": {
  "typedRoutes": true,
  "reactCompiler": true
}
```
- **`typedRoutes`** — Enables TypeScript type safety for navigation routes, so the TypeScript compiler catches invalid route paths at compile time.
- **`reactCompiler`** — Enables the experimental React Compiler which automatically memoizes components to optimize re-renders.

---

### الشرح بالعربي

ملف `app.json` هو ملف الإعداد الخاص بـ Expo. يتحكم في كيفية بناء التطبيق وعرضه وسلوكه على كل منصة.

**النقاط الرئيسية:**
- `scheme` — يُعرِّف رابط التعمق للتطبيق، مما يسمح لتطبيقات أخرى بفتح هذا التطبيق.
- `newArchEnabled: true` — يُفعِّل البنية الجديدة لـ React Native التي توفر أداءً أفضل.
- **الأيقونة التكيفية لـ Android** — تتكون من طبقتين (الأمامية والخلفية) بحيث يمكن للنظام عرضها بأشكال مختلفة.
- **`typedRoutes`** — يُوفِّر أمانًا من نوع TypeScript لمسارات التنقل، حيث يكتشف المترجم المسارات الخاطئة وقت الترجمة.

---

## Part 4: `tsconfig.json` — TypeScript Configuration | إعداد TypeScript

**Path:** `tsconfig.json`

### English Explanation

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

#### Fields Explained

- **`extends: "expo/tsconfig.base"`** — Inherits Expo's default TypeScript configuration rather than starting from scratch. This includes appropriate settings for React Native, JSX, and the target JavaScript version.
- **`strict: true`** — Enables strict mode, which activates several safety checks:
  - `strictNullChecks` — Variables cannot be `null` or `undefined` unless explicitly typed as such.
  - `noImplicitAny` — All variables must have explicit types; TypeScript will not silently infer `any`.
  - `strictFunctionTypes` — Stricter checking of function parameter types.
- **`paths: { "@/*": ["./*"] }`** — Defines a path alias. Any import starting with `@/` is resolved from the project root. For example, `import A from "@/components/A"` resolves to `./components/A`. This avoids long relative import paths like `../../components/A`.
- **`include`** — Specifies which files TypeScript should compile. The `**/*.ts` and `**/*.tsx` patterns match all TypeScript files recursively.

---

### الشرح بالعربي

ملف `tsconfig.json` يُعرِّف كيفية عمل مُترجم TypeScript على هذا المشروع.

**أهم نقطة: مسار الاختصار `@/`**

بدلاً من كتابة:
```typescript
import A from "../../components/A"
```
يمكن كتابة:
```typescript
import A from "@/components/A"
```

هذا يجعل الكود أنظف وأسهل في القراءة، وعند نقل الملفات لا تحتاج لتحديث مسارات الاستيراد النسبية.

**الوضع الصارم `strict: true`:** يُجبر المطور على كتابة كود أكثر أماناً — لا يمكن ترك متغير بدون نوع محدد، ولا يمكن الوصول إلى قيمة قد تكون `null` دون فحصها أولاً.

---

## Summary | خلاصة

| File | Role |
|---|---|
| `package.json` | Project identity + all library dependencies |
| `app.json` | Expo build configuration for each platform |
| `tsconfig.json` | TypeScript compiler rules and path aliases |

These three files together form the complete configuration layer of the project. No application code runs without them being correctly set up.

هذه الملفات الثلاثة معاً تُشكِّل طبقة الإعداد الكاملة للمشروع. لا يعمل أي كود تطبيقي دون إعدادها بشكل صحيح.
