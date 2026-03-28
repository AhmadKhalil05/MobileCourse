# Lecture 07 — Theming, Dark Mode, and UI Utilities
# المحاضرة السابعة — الثيم والوضع الداكن وأدوات UI

---

## Part 1: Concept — Theming in React Native | مفهوم الثيم في React Native

### English Explanation

A **theme** in application development is a centralized system that defines the visual language of an app — its colors, typography, spacing, and other design tokens. Instead of hardcoding values like `color: '#11181C'` in every component, they are defined once in a theme file and referenced everywhere.

Benefits of a centralized theme:
- **Consistency** — All components share the same color palette.
- **Dark mode support** — Define two sets of values (light/dark) and switch between them based on system preference.
- **Maintainability** — Change a color in one place, and it updates everywhere.

---

### الشرح بالعربي

**الثيم (Theme)** هو نظام مركزي يُعرِّف اللغة البصرية للتطبيق — الألوان، الخطوط، المسافات. بدلاً من ترميز القيم يدوياً في كل مكوِّن، تُعرَّف مرة واحدة في ملف ثيم واحد ويُرجَع إليه في كل مكان.

---

## Part 2: `constants/theme.ts` — Colors and Fonts

**Path:** `constants/theme.ts`

### Full Code

```typescript
import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
```

### Analysis

#### `Colors` Object — Light and Dark Design Tokens

The `Colors` object is a **design token** map. It uses two levels:
- The outer level (`light` / `dark`) corresponds to the color scheme.
- The inner level defines semantic color names (not descriptive like `blue`, but semantic like `tint` which means "accent color").

| Token | Light | Dark | Semantic Meaning |
|---|---|---|---|
| `text` | `#11181C` | `#ECEDEE` | Primary text color |
| `background` | `#fff` | `#151718` | Screen/view background |
| `tint` | `#0a7ea4` | `#fff` | Accent/brand color (active tabs, links) |
| `icon` | `#687076` | `#9BA1A6` | Default icon color |
| `tabIconDefault` | `#687076` | `#9BA1A6` | Inactive tab icon color |
| `tabIconSelected` | `#0a7ea4` | `#fff` | Active tab icon color |

**Why semantic names?**
Using `Colors.light.tint` instead of `Colors.lightBlue` is more flexible. If the design changes from blue to green, only the value changes — not all the references.

#### `Fonts` Object — Platform-Specific Typography

```typescript
export const Fonts = Platform.select({
  ios: { ... },
  default: { ... },
  web: { ... },
});
```

**`Platform.select()`** returns the value for the matching platform. On iOS, it returns the `ios` object; on Android, it returns `default`; on web, it returns `web`.

**iOS Fonts:**
```typescript
{
  sans: 'system-ui',      // San Francisco (Apple's system font)
  serif: 'ui-serif',      // New York (Apple's serif)
  rounded: 'ui-rounded',  // SF Pro Rounded
  mono: 'ui-monospace',   // SF Mono
}
```
These are CSS-like system font aliases on iOS. They use Apple's built-in fonts for a native look.

**Web Fonts:**
The web values use complete font stacks with fallbacks — standard practice for web typography to ensure readability across all browsers and operating systems.

---

### الشرح بالعربي

**`Colors`:**
كائن يُعرِّف **رموز التصميم (Design Tokens)** للوضع الفاتح والداكن. بدلاً من استخدام `#0a7ea4` في كل مكان، يُستخدَم `Colors.light.tint` — إذا تغير اللون، تغير مكان واحد فقط.

**أسماء **دلالية** (Semantic Names):**
`tint` لا تعني "أزرق" — تعني "لون التمييز/النبرة". هذا النهج أكثر مرونة من تسمية الألوان بلونها المباشر.

**`Platform.select()`:**
تُعيد القيمة المطابقة للمنصة الحالية. على iOS تُعيد `ios`، على Android تُعيد `default`، على الويب تُعيد `web`. هذا مثال على **الكود الخاص بالمنصة (Platform-Specific Code)**.

---

## Part 3: `hooks/use-color-scheme.ts` and `use-color-scheme.web.ts`

### `hooks/use-color-scheme.ts` (Native)

```typescript
export { useColorScheme } from 'react-native';
```

On native platforms (iOS/Android), `useColorScheme` from React Native reads the device's current system setting (light or dark mode). The hook is simply re-exported — creating a consistent import path `@/hooks/use-color-scheme` regardless of platform.

على المنصات الأصلية، يُعيد هذا الهوك الوضع الحالي للجهاز (فاتح أو داكن) من React Native. يُعاد تصديره لتوحيد مسار الاستيراد.

### `hooks/use-color-scheme.web.ts` (Web)

```typescript
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
```

#### Why a Special Web Version?

When Expo Web uses **static rendering** (generating HTML on the server or at build time), the server does not know the user's color scheme preference. If the component renders `dark` on the server but the user has `light` mode, there will be a **hydration mismatch** — the server HTML differs from what the client renders, causing visual flickering or React errors.

**Solution — Hydration Guard:**
- `hasHydrated` starts as `false`.
- The initial render (which may be server-side) always returns `'light'` as the default.
- After the component mounts on the client (`useEffect` fires), `hasHydrated` becomes `true`.
- On subsequent renders, the actual `colorScheme` from the device is returned.

This ensures the server renders a consistent (light) default, and the client takes over with the actual preference after hydration.

**File extension `.web.ts`** — Expo automatically resolves `use-color-scheme.web.ts` on web and `use-color-scheme.ts` on native platforms. This is **platform-specific file resolution** — a naming convention for conditionally loaded modules.

---

### الشرح بالعربي

**ملف `.web.ts` الخاص بالويب:**
عند استخدام التصيير الثابت (Static Rendering) على الويب، الخادم لا يعرف تفضيل المستخدم (فاتح أم داكن). لو رسم الخادم "داكن" لكن المستخدم يفضل "فاتح"، سيحدث **عدم تطابق هيدرشن (Hydration Mismatch)**.

**الحل:**
- السطر الأول يُعيد `'light'` دائماً (لتطابق الخادم).
- بعد تحميل المكوِّن على العميل (`useEffect`)، يُحدَّث `hasHydrated` إلى `true`.
- من ثَمَّ تُعيد الدالة قيمة نظام المستخدم الفعلي.

**`.web.ts` كامتداد:** Expo يُحلِّل تلقائياً `use-color-scheme.web.ts` على الويب و `use-color-scheme.ts` على الأجهزة. هذا **تحديد الملفات الخاص بالمنصة**.

---

## Part 4: `hooks/use-theme-color.ts` — Color Resolution Hook

**Path:** `hooks/use-theme-color.ts`

### Full Code

```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
```

### Analysis

`useThemeColor` is a utility hook that resolves a color value based on:
1. The current color scheme (light/dark).
2. An optional override color passed via props.
3. A fallback to the centralized `Colors` object.

**Parameters:**
- **`props: { light?: string; dark?: string }`** — Optional color overrides. A component can pass `lightColor="red"` to use red in light mode.
- **`colorName`** — A key that must exist in both `Colors.light` AND `Colors.dark` (enforced by the TypeScript intersection type `keyof typeof Colors.light & keyof typeof Colors.dark`).

**Resolution Logic:**
```typescript
const theme = useColorScheme() ?? 'light';   // 'light' or 'dark'
const colorFromProps = props[theme];          // props.light or props.dark

if (colorFromProps) {
    return colorFromProps;    // Use component-specific override
} else {
    return Colors[theme][colorName];  // Fall back to global theme
}
```

**Usage Example** (from `ThemedText`):
```typescript
const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
```
If the component provides `lightColor`, it uses that in light mode. Otherwise it falls back to `Colors.light.text` (`#11181C`).

---

### الشرح بالعربي

**`useThemeColor`:**
هوك مساعد يحل لون بناءً على:
1. الوضع الحالي (فاتح/داكن).
2. لون خاص مُمرَّر عبر props (اختياري).
3. لون افتراضي من كائن `Colors` المركزي.

**منطق القرار:**
- إذا مرَّر المكوِّن `lightColor` أو `darkColor`، استخدمه.
- وإلا انتقل للقيمة الافتراضية في `Colors`.

هذا يمنح **مرونة**: معظم المكوِّنات تستخدم الثيم الافتراضي، لكن يمكن تجاوزه عند الحاجة.

---

## Part 5: `components/themed-text.tsx` — Themed Text Component

**Path:** `components/themed-text.tsx`

### Full Code

```typescript
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 32 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  link: { lineHeight: 30, fontSize: 16, color: '#0a7ea4' },
});
```

#### Analysis

**`ThemedTextProps`:**
```typescript
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};
```
Extends the native `TextProps` type with three additional optional props:
- `lightColor` / `darkColor` — Color overrides for each mode.
- `type` — A variant selector that applies a pre-defined style (similar to a design system's text variants).

**Type Variants:**
| Variant | fontSize | fontWeight | lineHeight |
|---|---|---|---|
| `default` | 16 | normal | 24 |
| `defaultSemiBold` | 16 | 600 | 24 |
| `title` | 32 | bold | 32 |
| `subtitle` | 20 | bold | - |
| `link` | 16 | normal | 30, color: #0a7ea4 |

**Style Array Pattern:**
```typescript
style={[
    { color },
    type === 'default' ? styles.default : undefined,
    ...
    style,  // Component-specific override (last, wins on conflict)
]}
```
React Native merges style arrays from left to right; later styles override earlier ones on conflicts. Passing `undefined` in the array is safe — it is ignored. The component's own `style` prop is placed last, ensuring component-level overrides win.

**`...rest` (Rest Props Spread):**
All `TextProps` that aren't explicitly handled (`children`, `numberOfLines`, `testID`, etc.) are collected in `rest` and passed to the underlying `Text` component. This makes `ThemedText` a transparent wrapper.

---

### الشرح بالعربي

**`ThemedText`:** مكوِّن `Text` مُعزَّز يدعم:
1. **الثيم التلقائي:** يقرأ `Colors[theme].text` تلقائياً.
2. **المتغيرات النصية:** `type="title"`, `type="link"`, إلخ — نظام متغيرات مدمج.
3. **التجاوز الاختياري:** `lightColor="red"` يتجاوز الثيم في الوضع الفاتح.

**مصفوفة الأنماط:**
الأنماط الأخيرة في المصفوفة تُطغى على السابقة عند التعارض. وضع `style` (من الـ props) في النهاية يضمن أن التخصيص على مستوى المكوِّن يتغلب دائماً.

---

## Part 6: `components/themed-view.tsx` — Themed View Component

**Path:** `components/themed-view.tsx`

```typescript
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
```

`ThemedView` follows the exact same pattern as `ThemedText` but for container views. It resolves the background color from the theme and applies it. Any component needing an automatically-themed background should use `ThemedView` instead of `View`.

`ThemedView` يتبع نفس النمط في `ThemedText` ولكن للحاويات. يحل لون الخلفية من الثيم تلقائياً.

---

## Summary | خلاصة

The theming system is composed of four tightly coupled layers:

```
constants/theme.ts       → Defines the color & font tokens
hooks/use-color-scheme   → Reads the device's current mode (light/dark)
hooks/use-theme-color    → Resolves a color from tokens + optional override
components/ThemedText    → Uses useThemeColor to apply themed text color
components/ThemedView    → Uses useThemeColor to apply themed background
```

This architecture allows the entire application to respond to system dark/light mode changes automatically, without any conditional logic in individual screens or components.

هذا النظام يُتيح لجميع مكوِّنات التطبيق الاستجابة تلقائياً لتغيير نظام الجهاز بين الوضع الفاتح والداكن، دون أي منطق شرطي في الشاشات الفردية.
