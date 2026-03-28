# React Native Course — Lecture Explanations Index
# فهرس شروحات المحاضرات — مساق React Native

---

## About This Folder | عن هذا الفولدر

This folder contains detailed bilingual (Arabic/English) academic explanations of every file in this React Native project. Each file corresponds to a lecture topic, organized progressively from foundational configuration to advanced architectural concepts.

يحتوي هذا الفولدر على شروحات أكاديمية مفصَّلة ثنائية اللغة (عربي/إنجليزي) لكل ملف في هذا المشروع. كل ملف يتوافق مع موضوع محاضرة، منظَّماً تدريجياً من الإعداد الأساسي إلى المفاهيم المعمارية المتقدمة.

---

## Lecture Index | فهرس المحاضرات

| # | File | Topics Covered | المواضيع المُغطاة |
|---|---|---|---|
| 01 | [01-Project-Configuration.md](./01-Project-Configuration.md) | package.json, app.json, tsconfig.json | ملفات الإعداد الأساسية |
| 02 | [02-Navigation-and-Routing.md](./02-Navigation-and-Routing.md) | Expo Router, Stack, Tabs, Dynamic Routes, Modal | التنقل والتوجيه |
| 03 | [03-Props-State-Component-Communication.md](./03-Props-State-Component-Communication.md) | Props, useState, Prop Drilling, Lifting State Up, Controlled Inputs | الخصائص والحالة والتواصل |
| 04 | [04-Forms-and-Validation.md](./04-Forms-and-Validation.md) | React Hook Form, useForm, Controller, Validation | النماذج والتحقق |
| 05 | [05-API-Layer-and-Axios.md](./05-API-Layer-and-Axios.md) | Axios Instance, Interceptors, Service Architecture | طبقة API وAxios |
| 06 | [06-Server-State-React-Query.md](./06-Server-State-React-Query.md) | useQuery, useMutation, QueryClient, Cache Invalidation | إدارة حالة الخادم |
| 07 | [07-Theming-and-Dark-Mode.md](./07-Theming-and-Dark-Mode.md) | Colors, Fonts, Platform.select, useColorScheme, ThemedText/View | الثيم والوضع الداكن |
| 08 | [08-Reusable-Components-and-Animations.md](./08-Reusable-Components-and-Animations.md) | ProductCard, Collapsible, Reanimated, Haptics, ExternalLink, IconSymbol | المكوِّنات والرسوم المتحركة |
| 09 | [09-Explore-Screen-and-StyleSheet.md](./09-Explore-Screen-and-StyleSheet.md) | Explore Screen Analysis, StyleSheet Patterns, Flexbox | شاشة Explore وأنماط التنسيق |
| 10 | [10-Course-Summary-Architecture.md](./10-Course-Summary-Architecture.md) | Full Architecture, Data Flow, Design Patterns, Libraries | ملخص المساق والمعمارية |
| 11 | [11-Data-Passing-and-Redux.md](./11-Data-Passing-and-Redux.md) | Parent→Child, Child→Parent, Sibling, Prop Drilling, Redux | تمرير البيانات ومشكلة Prop Drilling وحل Redux |

---

## File-to-Lecture Mapping | ربط الملفات بالمحاضرات

| Project File | Explained In |
|---|---|
| `package.json` | Lecture 01 |
| `app.json` | Lecture 01 |
| `tsconfig.json` | Lecture 01 |
| `app/_layout.tsx` | Lecture 02 |
| `app/(tabs)/_layout.tsx` | Lecture 02 |
| `app/(tabs)/index.tsx` | Lecture 03 |
| `app/(tabs)/explore.tsx` | Lecture 09 |
| `app/(tabs)/login.tsx` | Lecture 04 |
| `app/(tabs)/login2.tsx` | Lecture 03 |
| `app/modal.tsx` | Lecture 02 |
| `app/products.tsx` | Lecture 06 |
| `app/product-list.tsx` | Lecture 06 |
| `app/product-details/[id].tsx` | Lecture 02 |
| `components/A.tsx` | Lecture 03 |
| `components/B.tsx` | Lecture 03 |
| `components/C.tsx` | Lecture 03 |
| `components/D.tsx` | Lecture 03 |
| `components/new-component.tsx` | Lecture 03 |
| `components/product-card.tsx` | Lecture 08 |
| `components/themed-text.tsx` | Lecture 07 |
| `components/themed-view.tsx` | Lecture 07 |
| `components/parallax-scroll-view.tsx` | Lecture 08 |
| `components/hello-wave.tsx` | Lecture 08 |
| `components/haptic-tab.tsx` | Lecture 08 |
| `components/external-link.tsx` | Lecture 08 |
| `components/ui/FormInput.tsx` | Lecture 04 |
| `components/ui/collapsible.tsx` | Lecture 08 |
| `components/ui/icon-symbol.tsx` | Lecture 08 |
| `components/ui/icon-symbol.ios.tsx` | Lecture 08 |
| `api/ApiBase.jsx` | Lecture 05 |
| `api/ProductsService.ts` | Lecture 05 |
| `api/UsersService.ts` | Lecture 05 |
| `constants/theme.ts` | Lecture 07 |
| `hooks/use-color-scheme.ts` | Lecture 07 |
| `hooks/use-color-scheme.web.ts` | Lecture 07 |
| `hooks/use-theme-color.ts` | Lecture 07 |
| `lib/queryClient.ts` | Lecture 06 |

---

## Reading Order Recommendation | توصية ترتيب القراءة

For students new to React Native, it is recommended to read lectures in order (01 → 10). Each lecture builds on concepts introduced in previous ones.

للطلاب الجدد على React Native، يُوصى بقراءة المحاضرات بالترتيب (01 ← 10). كل محاضرة تبني على المفاهيم المُقدَّمة في السابقة.
