# Lecture 08 — Reusable UI Components and Animations
# المحاضرة الثامنة — مكوِّنات UI القابلة لإعادة الاستخدام والرسوم المتحركة

---

## Part 1: `components/product-card.tsx` — Navigable Product Card

**Path:** `components/product-card.tsx`

### Full Code

```typescript
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

const ProductCard = ({id, name, price, imageUrl}: any) => {
    return (
        <View style={styles.productCard} key={id}>
            <Link href={"/product-details/" + id}>
                <Image style={styles.image} source={{uri: imageUrl}} />
                <View style={styles.title}>
                    <Text>{name}</Text>
                    <Text>${price}</Text>
                </View>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    productCard: {
        flex: 1,
        padding: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        margin: 20,
        textAlign: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 32,
        textAlign: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        width: '100%',
    },
    image: {
        height: 178,
        width: 290,
    },
});

export default ProductCard;
```

### Analysis

**Props Received:**
| Prop | Type | Role |
|---|---|---|
| `id` | any | Unique identifier; used in `Link href` |
| `name` | any | Product name displayed |
| `price` | any | Product price displayed with `$` prefix |
| `imageUrl` | any | URL for the product image |

**`<Link href={"/product-details/" + id}>`**
This wraps the entire card content in a navigable link. When the user taps anywhere on the card, they navigate to `/product-details/{id}`. The `Link` component from Expo Router is the declarative navigation approach (as opposed to `router.push` in an `onPress`).

String concatenation `/product-details/` + `id` builds the dynamic URL. For `id = 5`, the result is `/product-details/5`, which matches the dynamic route `[id].tsx`.

**`<Image source={{uri: imageUrl}}>`**
Uses `expo-image` (not React Native's built-in `Image`). `expo-image` provides:
- Better performance through native image caching.
- Support for more image formats (AVIF, WebP, etc.).
- Built-in placeholder and transition support.
- `uri` is used for remote (network) images, whereas `require()` is used for local assets.

**`{...product}` Spread in `products.tsx`**
In `products.tsx`, cards are rendered as:
```typescript
<ProductCard key={product.id} {...product} />
```
The spread operator `{...product}` is equivalent to explicitly writing each property:
```typescript
<ProductCard id={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />
```
This is a convenient shorthand when the object's properties match the component's prop names exactly.

**`key={product.id}`**
When rendering lists in React, each item must have a unique `key` prop. React uses keys to efficiently reconcile the virtual DOM — identifying which items were added, removed, or reordered without re-rendering the entire list. Note: `key` is placed on the `map` return element, not inside `ProductCard`.

**StyleSheet Analysis:**
```javascript
title: {
    flexDirection: "row",       // Places name and price side by side
    justifyContent: "space-between",  // Name on left, price on right
    alignItems: "center",
    flex: 1,
    width: '100%',
}
```
The `title` style uses flexbox row layout to place the product name and price on the same line with space between them.

---

### الشرح بالعربي

**`ProductCard`** هو مكوِّن قابل لإعادة الاستخدام يعرض معلومات منتج واحد ويمكن النقر عليه للانتقال لصفحة التفاصيل.

**`<Link href={"/product-details/" + id}>`:**
يُغلِّف المحتوى بأكمله في رابط قابل للضغط. النقر في أي مكان على البطاقة ينقل المستخدم لصفحة التفاصيل.

**`key={product.id}` في القوائم:**
خاصية `key` إلزامية عند رسم قوائم. React تستخدمها لتحديد أي عناصر تغيرت عند تحديث القائمة، مما يمنع إعادة رسم العناصر غير المتغيرة.

**`{...product}` (نشر الخصائص):**
اختصار لتمرير جميع خصائص الكائن كـ props فردية. مفيد عندما تتطابق أسماء خصائص الكائن مع أسماء الـ props في المكوِّن.

---

## Part 2: `components/ui/collapsible.tsx` — Collapsible Section Component

**Path:** `components/ui/collapsible.tsx`

### Full Code

```typescript
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}
```

### Analysis

**`PropsWithChildren & { title: string }`**
`PropsWithChildren` is a React utility type that adds `children?: React.ReactNode` to the props type. The `&` intersection adds the required `title` string. This means `Collapsible` accepts:
- `children` — Any React components specified between `<Collapsible>` opening and closing tags.
- `title` — The text displayed on the collapsible header.

**State: `isOpen`**
```typescript
const [isOpen, setIsOpen] = useState(false);
```
A boolean state controlling whether the content is visible. Starts collapsed (`false`).

**Toggle Pattern:**
```typescript
onPress={() => setIsOpen((value) => !value)}
```
The functional form of `setState` `((prev) => newValue)` is used instead of `setIsOpen(!isOpen)`. This is important: using the functional form ensures the update is based on the **latest** state value, not a potentially stale closure value. This is the React-recommended pattern for toggles.

**Animated Chevron with CSS-like Transform:**
```typescript
style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
```
The chevron `>` icon rotates 90 degrees clockwise when expanded (becoming `v`). This is not an animated transition — it's an instant state change. For a smooth rotation animation, `react-native-reanimated` would be needed.

**Conditional Children Render:**
```typescript
{isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
```
When `isOpen` is `false`, `children` is not rendered at all (not just hidden). This means closed sections have zero render cost.

**`TouchableOpacity` vs `Pressable`:**
`TouchableOpacity` is an older, still-common interactive component that reduces opacity when pressed. `activeOpacity={0.8}` sets the pressed opacity to 80%. `Pressable` is the newer, more powerful alternative (seen in other components).

---

### الشرح بالعربي

**`Collapsible`:** مكوِّن قسم قابل للتوسيع والطي. يُعرض المحتوى فقط عند الضغط.

**`PropsWithChildren`:**
نوع TypeScript مدمج يُضيف `children` إلى الـ props. يُتيح للمكوِّن احتواء مكوِّنات فرعية أي عناصر بين الوسمَين الافتتاحي والختامي.

**نمط التبديل الوظيفي:**
```typescript
setIsOpen((value) => !value)
// أفضل من:
setIsOpen(!isOpen)
```
الشكل الوظيفي يضمن عمله على أحدث قيمة للحالة، ليس على قيمة قد تكون قديمة في الـ closure.

**الرسم الشرطي `&&`:**
عند `isOpen === false`، المحتوى لا يُرسَم نهائياً (لا يوجد في شجرة DOM). هذا يُقلِّل تكلفة الرسم.

---

## Part 3: `components/parallax-scroll-view.tsx` — Parallax Animation

**Path:** `components/parallax-scroll-view.tsx`

### Full Code

```typescript
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[styles.header, { backgroundColor: headerBackgroundColor[colorScheme] }, headerAnimatedStyle]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}
```

### Analysis — React Native Reanimated

This component implements a **parallax scroll effect** — as the user scrolls up, the header image translates and scales at a different rate than the content, creating a depth illusion.

**`useAnimatedRef<Animated.ScrollView>()`**
Creates a ref that can be attached to animated components and accessed in worklets (Reanimated's thread-safe functions). Standard React refs (`useRef`) cannot be used with Reanimated's tracking hooks.

**`useScrollOffset(scrollRef)`**
Returns a `SharedValue` representing the current scroll position. `SharedValue` is a Reanimated concept — a value that lives on the **UI thread** (not the JavaScript thread) and can be read without causing JavaScript thread blocking or crossing the bridge.

**`useAnimatedStyle(() => { ... })`**
Defines an animated style computed from SharedValues. The callback runs on the UI thread every frame when scroll position changes. This is the key to smooth 60fps (or 120fps) animations — no JavaScript execution is involved during the animation.

**`interpolate` Function:**
```typescript
translateY: interpolate(
  scrollOffset.value,
  [-HEADER_HEIGHT, 0, HEADER_HEIGHT],   // Input range
  [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]  // Output range
)
```
`interpolate` maps a value from one range to another using linear interpolation:
- Input `0` (no scroll) → Output `0` (header at natural position).
- Input `HEADER_HEIGHT` (scrolled down by 250px) → Output `187.5` (header moves down by 75% of scroll distance).
- Input `-HEADER_HEIGHT` (overscroll up) → Output `-125` (header moves up by 50%).

This creates the parallax: the header moves slower than the scroll, creating depth.

**Scale Interpolation:**
```typescript
scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1])
```
When overscrolling upward (`scrollOffset.value < 0`), the header scales up to 2x. This creates the "rubber band" zoom effect when pulling down at the top of the scroll.

**`scrollEventThrottle={16}`**
On Android, scroll events are batched. `scrollEventThrottle={16}` ensures scroll events fire at most every 16ms (60fps). Without this, animations would feel laggy.

**`Animated.ScrollView` and `Animated.View`**
The `Animated.` prefix versions of ScrollView and View are Reanimated's enhanced versions that support animated styles. Standard `ScrollView` and `View` cannot accept styles from `useAnimatedStyle`.

---

### الشرح بالعربي

**تأثير البارالاكس (Parallax):**
عند التمرير، الهيدر يتحرك بمعدل مختلف عن المحتوى — مما يُنشئ وهم العمق.

**`SharedValue` و `useAnimatedStyle`:**
هذه هي قلب مكتبة Reanimated. الرسوم المتحركة تعمل على **خيط UI مباشرةً** بدون المرور بخيط JavaScript. هذا يضمن رسوماً متحركة سلسة 60fps حتى عند انشغال JavaScript.

**`interpolate`:**
تُحوِّل قيمة من نطاق إلى آخر. مثال:
- عند التمرير 250px للأسفل → الهيدر ينزل 187.5px فقط (أبطأ من التمرير).
- هذا التفاوت هو الذي يُنشئ وهم العمق.

---

## Part 4: `components/hello-wave.tsx` — CSS-Like Animation

**Path:** `components/hello-wave.tsx`

### Full Code

```typescript
import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
```

### Analysis

This component uses Reanimated's **CSS animation API** — a newer feature that mirrors web CSS animations using the `animationName` prop with keyframe definitions.

**`animationName: { '50%': { transform: [{ rotate: '25deg' }] } }`**
Defines a keyframe animation:
- `0%` (start) — no transform (default).
- `50%` — rotated 25 degrees.
- `100%` (end) — back to no transform (default).

This creates a wave motion: the hand emoji rocks back and forth.

**`animationIterationCount: 4`** — The animation repeats 4 times.
**`animationDuration: '300ms'`** — Each full cycle takes 300 milliseconds.

This is a simpler API than `useAnimatedStyle` + `withTiming/withRepeat` but more declarative and familiar to web developers.

---

### الشرح بالعربي

**`HelloWave`** يُظهر الرسوم المتحركة باستخدام **API يشبه CSS** من Reanimated — أسهل من `useAnimatedStyle` وأكثر إلفة لمطوري الويب.

**`animationName` مع الـ keyframes:**
تُعرِّف الحركة عند نقاط زمنية محددة:
- 0%: بدون تحويل.
- 50%: دوران 25 درجة.
- 100%: عودة للوضع الأصلي.

---

## Part 5: `components/haptic-tab.tsx` — Haptic Feedback

**Path:** `components/haptic-tab.tsx`

### Full Code

```typescript
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
```

### Analysis

**`BottomTabBarButtonProps`**
The type for the bottom tab bar button. Expo Router uses this component for every tab button — effectively replacing the default tab button behavior.

**`PlatformPressable`**
A pressable component from `@react-navigation/elements` that handles platform-specific press behavior (ripple on Android, opacity on iOS by default).

**`Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`**
Triggers a light haptic impact feedback on iOS. Haptic feedback provides **physical sensation** when interacting with UI elements, improving the tactile feel of the app.

`ImpactFeedbackStyle` options:
- `Light` — Subtle vibration for minor interactions.
- `Medium` — Moderate vibration for standard interactions.
- `Heavy` — Strong vibration for significant interactions.

**`if (process.env.EXPO_OS === 'ios')`**
Haptics is only triggered on iOS. Android and web don't support `expo-haptics` in this form (Android uses `expo-haptics` differently).

**`props.onPressIn?.(ev)`**
After executing the haptic feedback, the original `onPressIn` from React Navigation is called (if it exists). The `?.` optional chaining ensures no crash if `onPressIn` is undefined.

---

### الشرح بالعربي

**`HapticTab`:**
يُستبدل زر تبويب افتراضي بزر يُطلق اهتزازاً لطيفاً على iOS عند الضغط.

**`Haptics.impactAsync(Light)`:**
يُطغى حاسة اللمس بإعادة ارتداد خفيفة — يُشعر المستخدم بالضغط جسدياً، مما يُحسِّن التجربة.

**`props.onPressIn?.(ev)`:**
بعد تنفيذ الاهتزاز، يُنادى الـ handler الأصلي لضمان عمل التنقل بشكل طبيعي.

---

## Part 6: `components/external-link.tsx` — In-App Browser

**Path:** `components/external-link.tsx`

```typescript
import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
```

### Analysis

**`Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string }`**
Complex TypeScript utility types:
- `ComponentProps<typeof Link>` — Gets all props accepted by the `Link` component.
- `Omit<..., 'href'>` — Removes the `href` prop from those types.
- `& { href: Href & string }` — Adds back `href` with a more specific type (must be both a valid Expo Router `Href` AND a `string`).

The reason for this complexity: `openBrowserAsync` requires a plain string URL — so this enforces that the `href` value is a string (not an object route descriptor).

**`event.preventDefault()`**
On native platforms (not web), prevents the default `Link` behavior (navigating within the app). Instead, opens an in-app browser.

**`openBrowserAsync(href, { presentationStyle: AUTOMATIC })`**
Opens the URL in an **in-app browser** — a browser overlay within the app. The user doesn't leave the app. `WebBrowserPresentationStyle.AUTOMATIC` lets the system decide the presentation (full screen or sheet).

Benefits of in-app browser over external browser:
- The user stays within the app context.
- No app-switch required.
- Can be dismissed easily to return to the app.

---

### الشرح بالعربي

**`ExternalLink`:**
يفتح الروابط الخارجية في **متصفح داخل التطبيق** (وليس في متصفح النظام الخارجي).

**`event.preventDefault()`:**
يمنع السلوك الافتراضي للرابط (التنقل داخل التطبيق) ليُستبدل بفتح المتصفح الداخلي.

**`openBrowserAsync`:**
يُظهر نافذة متصفح فوق التطبيق — المستخدم يبقى داخل التطبيق ويمكنه الإغلاق بسهولة.

---

## Part 7: `components/ui/icon-symbol.tsx` — Cross-Platform Icons

### `icon-symbol.tsx` (Android / Web — Fallback)

```typescript
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

export function IconSymbol({ name, size = 24, color, style }: ...) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
```

### `icon-symbol.ios.tsx` (iOS — Native)

```typescript
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';

export function IconSymbol({ name, size = 24, color, style, weight = 'regular' }: ...) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[{ width: size, height: size }, style]}
    />
  );
}
```

### Analysis — Platform-Specific Implementation

Both files export a function with the **same name and API** (`IconSymbol`), but different implementations.

**On iOS:** Uses `SymbolView` from `expo-symbols`, which renders **SF Symbols** — Apple's native icon system with 6,000+ symbols. SF Symbols automatically adapt to the system font weight, support dynamic color, and are vector-based (sharp at any size).

**On Android/Web:** Uses `MaterialIcons` from `@expo/vector-icons`, which renders Material Design icons. The `MAPPING` object translates SF Symbol names (iOS convention) to Material Icon names:
```
'house.fill'     → 'home'
'paperplane.fill' → 'send'
'chevron.right'  → 'chevron-right'
```

**`icon-symbol.ios.tsx` file naming:**
Expo/Metro bundler resolves the `.ios.tsx` version on iOS and the `.tsx` version on all other platforms. This is platform-specific file resolution — identical API, different implementations.

---

### الشرح بالعربي

**`IconSymbol`:**
مكوِّن أيقونة متعدد المنصات بنفس الـ API. الملفان يُصدِّران دالة بنفس الاسم.

- **iOS** → يستخدم SF Symbols الأصلي (Apple) عبر `SymbolView`.
- **Android/Web** → يستخدم Material Icons عبر `MaterialIcons`.

**كائن `MAPPING`:**
يُترجم أسماء SF Symbols (تسمية iOS) إلى أسماء Material Icons. هذا يُتيح استخدام نفس اسم الأيقونة في الكود بغض النظر عن المنصة.

---

## Summary | خلاصة

| Component | Key Concepts |
|---|---|
| `ProductCard` | Props spreading, `Link` navigation, `expo-image`, list keys |
| `Collapsible` | `useState` toggle, conditional rendering, `PropsWithChildren` |
| `ParallaxScrollView` | `useAnimatedRef`, `useScrollOffset`, `useAnimatedStyle`, `interpolate` |
| `HelloWave` | CSS-like animation API with keyframes |
| `HapticTab` | Haptic feedback, `process.env.EXPO_OS` platform check |
| `ExternalLink` | In-app browser, `event.preventDefault()` |
| `IconSymbol` | Platform-specific file resolution (`.ios.tsx`), SF Symbols vs Material Icons |
