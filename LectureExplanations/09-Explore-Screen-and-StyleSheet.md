# Lecture 09 — The Explore Screen and Stylesheets in Depth
# المحاضرة التاسعة — شاشة الاستكشاف والأنماط بعمق

---

## Part 1: `app/(tabs)/explore.tsx` — Full Screen Analysis

**Path:** `app/(tabs)/explore.tsx`

### Full Code

```typescript
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { router } from "expo-router";

export default function TabTwoScreen() {

    const handleOnPress = () => {
        router.back();
    }

    return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}>
          Explore
        </ThemedText>
      </ThemedView>
        <Pressable onPress={handleOnPress}>back</Pressable>
        <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
```

---

### Detailed Analysis

#### `ParallaxScrollView` as Layout Wrapper

The explore screen uses `ParallaxScrollView` as the root layout. This means:
- The entire screen is a scrollable container.
- The header area (250px tall) contains the icon and has a parallax effect.
- All content below the header is wrapped in a `ThemedView`.

**Passing `headerImage` as a Prop:**
```typescript
headerImage={
    <IconSymbol
        size={310}
        color="#808080"
        name="chevron.left.forwardslash.chevron.right"
        style={styles.headerImage}
    />
}
```
This is **JSX as a prop value** — a React pattern where a component receives another component (a `ReactElement`) as a prop. `ParallaxScrollView` renders whatever is in `headerImage` inside the animated header container.

The `IconSymbol` renders the `</>` code icon at 310px size, spanning the header background.

**`headerImage` StyleSheet:**
```javascript
headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
}
```
`position: 'absolute'` removes the element from the normal document flow and positions it relative to its nearest positioned ancestor. `bottom: -90` shifts the icon 90px below the header's bottom edge (partially cropped). `left: -35` shifts it left, creating a large decorative element that bleeds off the header edges.

---

#### Inline Styling alongside StyleSheet

```typescript
<ThemedText
    type="title"
    style={{ fontFamily: Fonts.rounded }}>
    Explore
</ThemedText>
```

This demonstrates **combining StyleSheet styles with inline styles**. The `type="title"` applies a pre-defined style (32px bold) from `ThemedText`'s `StyleSheet.create`. The `style={{ fontFamily: Fonts.rounded }}` adds a platform-specific rounded font on top. Both are merged via the style array inside `ThemedText`.

**`Fonts.rounded`** on iOS resolves to `'ui-rounded'` (SF Pro Rounded), giving the title a softer appearance.

---

#### `{' '}` — Explicit Space in JSX

```typescript
<ThemedText>
  This app has two screens:{' '}
  <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>
```

In JSX, whitespace between elements on separate lines is not preserved. `{' '}` is a JSX expression rendering a single space character `' '`, explicitly adding a space between the text content and the inline bold component. Without it, the text would be `"screens:app/(tabs)/index.tsx"` with no space.

---

#### `Platform.select()` for Conditional UI

```typescript
{Platform.select({
  ios: (
    <ThemedText>
      The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
      component provides a parallax effect for the header image.
    </ThemedText>
  ),
})}
```

`Platform.select()` returns the value matching the current platform. On iOS, it returns the `ThemedText` component. On Android and web, `Platform.select()` returns `undefined`, which React renders as nothing.

This is used here because the parallax effect only works on iOS (React Native Reanimated's `useScrollOffset` has limited support on web). By only showing the explanation on iOS, the documentation is accurate to the platform.

---

#### Import Styles — Absolute vs. Relative

```typescript
import { IconSymbol } from '../../components/ui/icon-symbol';  // relative path
import { ExternalLink } from '@/components/external-link';     // alias path
```

The same component in the same file uses both styles. The relative import (`../../components/ui/icon-symbol`) reaches the same file as `@/components/ui/icon-symbol`. They are functionally identical. The alias `@/` is preferred for consistency and portability.

---

### الشرح بالعربي

**شاشة `explore.tsx` هي صفحة توثيق تفاعلية** — تُقدِّم ميزات الإطار للطلاب بأسلوب تعليمي.

**JSX كقيمة للـ prop:**
```typescript
headerImage={<IconSymbol .../>}
```
يُمرِّر مكوِّن كاملاً كـ prop لمكوِّن آخر. `ParallaxScrollView` يُعرِّض ما يتسلمه في `headerImage` داخل منطقة الهيدر المتحرك.

**`position: 'absolute'`:**
يُخرج العنصر من تدفق التخطيط الطبيعي ويُموضعه نسبةً لأقرب عنصر أب مُموضَع. `bottom: -90` يُحرِّكه 90px للأسفل من حافة الهيدر.

**`{' '}` في JSX:**
JSX لا يحفظ المسافات البيضاء بين الأسطر. `{' '}` يُضيف مسافة واحدة صريحة بين النصوص والمكوِّنات المضمَّنة.

**`Platform.select()`:**
يُعيد قيمة مختلفة لكل منصة. القيمة `undefined` في React لا تُرسَم — مما يُخفي العنصر فعلياً على المنصات غير المدعومة.

---

## Part 2: StyleSheet.create() — Best Practices | أفضل ممارسات StyleSheet

### Why `StyleSheet.create()` Instead of Inline Objects?

In all project files, styles are defined using `StyleSheet.create()`. This is the recommended approach for multiple reasons:

**1. Performance**
`StyleSheet.create()` validates and processes styles once at module load time, not on every render. Inline style objects `style={{ color: 'red' }}` create a new object on every render, adding unnecessary garbage collection pressure.

**2. Validation**
In development mode, `StyleSheet.create()` validates style property names and values, catching typos and invalid styles early.

**3. ID-Based Reference**
After `StyleSheet.create()`, each style entry becomes a numeric ID (not the full object). When passed to components, React Native transfers only the ID across the bridge (for old architecture) or processes it efficiently on the native side. This reduces serialization overhead.

**4. Code Organization**
Placing styles at the bottom of a file (as done throughout this project) keeps the JSX clean and readable.

---

### الشرح بالعربي

**`StyleSheet.create()` vs. كائنات inline:**

1. **الأداء:** `StyleSheet.create()` يُعالج الأنماط مرة واحدة عند تحميل الوحدة. الكائنات inline تُنشأ من جديد في كل عملية رسم.

2. **التحقق:** في وضع التطوير، يتحقق من أسماء خصائص CSS الخاطئة.

3. **التنظيم:** وضع الأنماط في أسفل الملف يجعل JSX نظيفاً وقابلاً للقراءة.

---

## Part 3: Flexbox Layout Patterns in the Project | أنماط تخطيط Flexbox

React Native implements a subset of CSS Flexbox for layout. Here are the patterns used throughout this project:

### Pattern 1: Centered Full Screen
```javascript
// Used in: HomeScreen, ModalScreen
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
```
`flex: 1` makes the container fill its parent. `alignItems: 'center'` centers children horizontally (along the cross axis). `justifyContent: 'center'` centers children vertically (along the main axis, which is column/vertical by default).

**`flex: 1` أساسي جداً:** يجعل العنصر يملأ المساحة المتاحة من والده. العناصر بدونه تأخذ حجم محتواها فقط.

### Pattern 2: Horizontal Row with Space Between
```javascript
// Used in: products.tsx header, ProductCard title
container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}
```
`flexDirection: 'row'` changes the main axis to horizontal. `justifyContent: 'space-between'` pushes children to the opposite ends (left and right edges). Used to place a title on the left and a button on the right.

### Pattern 3: Row with Gap
```javascript
// Used in: explore.tsx titleContainer
titleContainer: {
    flexDirection: 'row',
    gap: 8,
}
```
`gap` (supported in React Native 0.71+) adds spacing between flex children without adding margins to individual items. More maintainable than `marginRight` on each child.

### Pattern 4: Absolute Positioning for Overlay
```javascript
// Used in: explore.tsx headerImage
headerImage: {
    position: 'absolute',
    bottom: -90,
    left: -35,
}
```
Removes the element from normal flow. All other siblings ignore this element's space. Used for decorative elements that overlap content.

---

## Summary | خلاصة

**Explore Screen Concepts:**
- `ParallaxScrollView` as the root layout — wraps all content in an animated scrollable container.
- JSX as prop values — passing components to other components.
- `position: 'absolute'` — decorative overlapping elements.
- `{' '}` — explicit spacing in JSX.
- `Platform.select()` — conditional platform-specific UI.

**StyleSheet Concepts:**
- `StyleSheet.create()` — performance, validation, organization.
- Flexbox patterns: centering, row with space-between, gap, absolute positioning.
- Inline style merging with StyleSheet styles via arrays.

**StyleSheet مفاهيم:**
- `StyleSheet.create()` — أداء، تحقق، تنظيم.
- أنماط Flexbox الشائعة في React Native.
- دمج الأنماط المضمَّنة مع StyleSheet عبر المصفوفات.
