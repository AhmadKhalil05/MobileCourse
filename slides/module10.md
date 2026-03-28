
# MODULE 10 - Flexbox & Responsive Layouts (Advanced)

**Why Advanced Flexbox Matters**
Instructor Notes:
* Mobile screens come in different sizes and resolutions.
* Advanced Flexbox ensures layouts adapt to all devices.
* Helps avoid: Overlapping elements, Broken UI on small screens, Unreadable text or buttons.

**Responsive Design Principles**
* Use flex ratios instead of fixed widths/heights.
* Prefer percentage-based padding/margin.
* Avoid absolute positioning for main layouts.
* Use Dimensions API for screen width/height.
* Test on multiple devices (iOS, Android, tablets).

---

# Dimensions API Example

> import { Dimensions, View } from 'react-native';
> const { width, height } = Dimensions.get('window');
> 
> <View style={{ width: width * 0.9, height: height * 0.3, backgroundColor: 'blue' }} />

**Instructor Notes:**
* `width * 0.9` = 90% of screen width
* Dynamically adjusts for different devices
* Combine with flex for best results

---

# SafeAreaView & Notch Handling

> import { SafeAreaView, Text } from 'react-native';
> 
> <SafeAreaView style={{ flex: 1 }}>
>   <Text>Hello Safe Area</Text>
> </SafeAreaView>

* Handles status bar, notch, home indicator
* Important for modern iOS & Android devices
* Always wrap top-level layout

---

# Nested Flexbox Layouts

**Example: Dashboard Cards**

> <View style={{ flex: 1, padding: 16 }}>
>   <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
>     <View style={{ flex: 1, margin: 4, backgroundColor: 'red', height: 100 }} />
>     <View style={{ flex: 1, margin: 4, backgroundColor: 'blue', height: 100 }} />
>   </View>
>   <View style={{ flex: 1, backgroundColor: 'green', marginTop: 8 }} />
> </View>

**Instructor Notes:** Nested flex layouts allow complex dashboards. Use margin and padding carefully to prevent overlapping. Combine flex + Dimensions for responsive cards.

---

# Aspect Ratios & Scrollable Layouts

Maintaining aspect ratio is critical for images/videos.
> <Image
>   source={{ uri: 'https://picsum.photos/200' }}
>   style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }}
> />

`aspectRatio` ensures square/rectangle shapes regardless of screen width. Works well for gallery grids.

Use ScrollView or FlatList for content exceeding screen height.
> <ScrollView contentContainerStyle={{ padding: 16 }}>
>   {items.map(item => <Text key={item.id}>{item.title}</Text>)}
> </ScrollView>

`contentContainerStyle` = padding/margin for inner content. Supports both vertical & horizontal scrolling.

---

# Advanced Responsive Tips & LAB 10

Use Platform API to handle iOS vs Android differences.
> import { Platform, StyleSheet } from 'react-native';
> const styles = StyleSheet.create({
>   button: {
>     padding: Platform.OS === 'ios' ? 12 : 8,
>     backgroundColor: 'blue',
>   },
> });

**LAB 10 - Responsive Dashboard**
1. Create a 3-column dashboard: Top row: 3 cards equally spaced horizontally, Bottom row: scrollable list of items
2. Requirements: Use Flexbox for layout, Cards adjust to screen width (use % or flex), Images maintain aspect ratio, Safe Area View used for notch devices
3. Bonus: Add horizontal scroll for cards if screen is narrow, Add dynamic height adjustment using Dimensions

---
