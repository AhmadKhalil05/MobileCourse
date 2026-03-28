
# MODULE 4 - Styling & Flexbox Deep Dive

**Why Styling & Flexbox Matter in Mobile**
* Mobile layout is different from Web.
* Flexbox is the default layout system in React Native.
* Proper styling ensures responsive UI for all devices.
* Understanding flex deeply reduces layout bugs.

---

# React Native Styling Basics

> import { StyleSheet, View, Text } from 'react-native';
> export default function App() {
>   return (
>     <View style={styles.container}>
>       <Text style={styles.title}>Hello RN</Text>
>       <Text style={styles.subtitle}>Flexbox Deep Dive</Text>
>     </View>
>   );
> }
> 
> const styles = StyleSheet.create({
>   container: { flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
>   title: { fontSize: 28, fontWeight: 'bold' },
>   subtitle: { fontSize: 18, color: 'gray' }
> });

**Instructor Notes:** `flex:1` takes all available screen space, `justifyContent` aligns main axis, `alignItems` aligns cross axis.

---

# Flexbox Properties

| Property | Description |
| :--- | :--- |
| **flexDirection** | row / column / row-reverse / column-reverse |
| **justifyContent** | flex-start / center / flex-end / space-between / space-around / space-evenly |
| **alignItems** | flex-start / center / flex-end / stretch / baseline |
| **flex** | grow / shrink value |
| **alignSelf** | override alignItems for single child |

**Tip:** Mobile defaults to `flexDirection: column`.

---

# Flexbox Examples

**Row Layout Example**
> <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
>   <View style={{width:50, height: 50, backgroundColor: 'red'}} />
>   <View style={{width:50, height:50, backgroundColor: 'blue'}} />
>   <View style={{width:50, height:50, backgroundColor: 'green'}} />
> </View>

**Column Layout Example**
> <View style={{flexDirection: 'column', alignItems: 'center'}}>
>   <View style={{width:100, height:50, backgroundColor: 'red'}} />
>   <View style={{width:100, height:50, backgroundColor: 'blue'}} />
> </View>

---

# Absolute & Relative Positioning

> <View style={{flex:1}}>
>   <View style={{position: 'absolute', top:10, right:10, width: 50, height:50, backgroundColor: 'red'}} />
> </View>

**Instructor Notes:**
* Use absolute only for overlays or floating buttons
* Flexbox handles most layouts
* Avoid mixing relative/absolute unless needed

---

# Responsive Design Tips

* Use Dimensions API to get screen size (not always reliable in RN)
* Use flex and alignItems for dynamic layouts
* Media queries → use `react-native-responsive-screen` or `react-native-size-matters`

> import { Dimensions } from 'react-native';
> const { width, height } = Dimensions.get('window');

---

# Advanced Styling Tricks

* **Shadows:** elevation (Android), shadowColor + shadowOffset + shadowOpacity (iOS)
* **Border radius:** for round buttons/images
* **Text styling:** letterSpacing, lineHeight, textTransform
* **Background gradients:** expo-linear-gradient

---

# Flexbox Pitfalls

* Nesting Views too deep → performance issue
* Using fixed width → breaks responsiveness
* Mixing flexDirection row/column without testing on small screens
* Forgetting `flex: 1` on parent → child may not appear

---

# LAB 4 - Build a Dashboard Layout

**Instructions:**
1. Create a 2-row layout:
   * Top: Stats cards (3 cards horizontally spaced)
   * Bottom: Action buttons (2 buttons centered)
2. Requirements:
   * Use Flexbox
   * Responsive spacing
   * Shadows and rounded corners
   * Titles and subtitle text for each card
3. Bonus: Add colored icons, Use Dimensions API for width calculation