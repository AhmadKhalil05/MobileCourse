# MODULE 11 - Handling Touches & Gestures (Advanced)

**Why Advanced Gesture Handling Matters**
Modern mobile apps rely on complex gestures: Swipe cards, Drag & drop, Pinch/zoom, Swipe-to-delete.
Proper gesture handling ensures smooth UX and performance.
React Native's built-in touchables are limited for complex gestures → use `react-native-gesture-handler` + `react-native-reanimated`.

**Gesture Handler Library Overview**
Installation: `npm install react-native-gesture-handler react-native-reanimated`
* `react-native-gesture-handler` → native gestures
* `react-native-reanimated` → high-performance animations

---

# PanGestureHandler Example

> import { PanGestureHandler } from 'react-native-gesture-handler';
> import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
> import { View } from 'react-native';
> 
> export default function DraggableBox() {
>   const translateX = useSharedValue(0);
>   const translateY = useSharedValue(0);
>   
>   const panStyle = useAnimatedStyle(() => ({
>     transform: [{ translateX: translateX.value }, { translateY: translateY.value }]
>   }));
>   
>   return (
>     <PanGestureHandler onGestureEvent={event => {
>       translateX.value = event.translationX;
>       translateY.value = event.translationY;
>     }}>
>       <Animated.View style={[{ width:100, height:100, backgroundColor: 'red' }, panStyle]} />
>     </PanGestureHandler>
>   );
> }

---

# Tap & Double Tap Gestures

> import { TapGestureHandler } from 'react-native-gesture-handler';
> import { Text, View } from 'react-native';
> 
> <TapGestureHandler
>   numberOfTaps={2}
>   onActivated={() => console.log('Double Tap!')}
> >
>   <View style={{ width:100, height:100, backgroundColor: 'blue' }}>
>     <Text>Double Tap Me</Text>
>   </View>
> </TapGestureHandler>

* `numberOfTaps` → single/double tap detection
* Useful for image zoom or like/favorite gestures

---

# Swipe-to-Delete Example

**Code Concept:**
* Use PanGestureHandler detect horizontal swipe
* Animate card using Reanimated
* Remove card on threshold swipe

> // Pseudocode
> onGestureEvent={event => {
>   translateX.value = event.translationX;
>   if (translateX.value < -100) removeCard(itemId);
> }}

* Smooth physics-based animation is important for user satisfaction.

---

# Pinch & Zoom Example

> import { PinchGestureHandler } from 'react-native-gesture-handler';
> 
> <PinchGestureHandler onGestureEvent={handlePinch}>
>   <Animated.View style={{ width:200, height:200, backgroundColor: 'green' }} />
> </PinchGestureHandler>

* Multi-touch gestures for images, maps, or interactive components
* Combine with `useAnimatedStyle` for scale/rotation

---

# Gesture + AppState Integration

Detect app background/foreground. Pause gestures or animations in background. Use AppState API to improve performance.

> useEffect(() => {
>   const subscription = AppState.addEventListener('change', handleAppStateChange);
>   return () => subscription.remove();
> }, []);

**Instructor Notes:** Always clean up listeners. Prevent memory leaks in gesture-heavy apps.

**Common Pitfalls in Gestures**
* Wrapping multiple handlers → gesture conflicts
* Forgetting GestureHandlerRootView → gestures don't work on Android
* Heavy computation inside gesture events → laggy animation
* Not testing on real devices → simulator may differ

---

# LAB 11 - Interactive Card Deck

**Instructions:**
1. Build a swipeable card deck (like Tinder): Horizontal swipe to delete/like, Smooth spring animation, Cards stack dynamically
2. Add gestures: Tap → flip card for details, Long press → show options menu
3. Bonus: Add pinch-to-zoom on card images, Track swipe direction for analytics

