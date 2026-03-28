
# MODULE 5 - Handling Touches & Gestures

**Why Touch Handling Matters**
Mobile apps rely heavily on touch interactions.
React Native provides built-in components for handling touches: Button, Pressable, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback

Proper gestures improve UX and performance.

---

# Pressable Component (Recommended)

> import { Pressable, Text, Alert } from 'react-native';
> export default function App() {
>   return (
>     <Pressable
>       onPress={() => Alert.alert('Pressed!')}
>       style={({ pressed }) => [
>         { backgroundColor: pressed ? 'lightblue' : 'blue', padding: 12, borderRadius: 8 }
>       ]}
>     >
>       <Text style={{ color: 'white', fontWeight: 'bold' }}>Press Me</Text>
>     </Pressable>
>   );
> }

**Notes:** Pressable is modern, replaces older Touchable components. `style` can be a function to handle pressed state. Works with onPress, onLongPress, onPressIn, onPressOut.

---

# TouchableOpacity

> import { TouchableOpacity, Text, Alert } from 'react-native';
> <TouchableOpacity
>   style={{ backgroundColor: 'green', padding: 12, borderRadius: 8 }}
>   onPress={() => Alert.alert('Tapped!')}
> >
>   <Text style={{ color: 'white' }}>Tap Me</Text>
> </TouchableOpacity>

**Notes:** Automatically reduces opacity on press. Easier for quick buttons. Less flexible than Pressable.

---

# Gesture Handler Library (Advanced)

**Why use it?**
Provides native-driven gestures. Better performance for complex gestures. Supports swipes, drags, pinch, pan, rotation.

**Installation:**
> npm install react-native-gesture-handler

**Basic Example:**
> import { PanGestureHandler } from 'react-native-gesture-handler';
> <PanGestureHandler onGestureEvent={onPan}>
>   <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
> </PanGestureHandler>

**Notes:** Always wrap your App with GestureHandlerRootView. Native-driven → smoother animations on mobile.

---

# Handling Long Presses & Double Tap

> <Pressable
>   onPress={() => console.log('Single Tap')}
>   onLongPress={() => console.log('Long Press')}
>   delayLongPress={500}
> >
>   <Text>Interact Here</Text>
> </Pressable>

* `delayLongPress` controls how long to hold.
* Can chain gestures with Gesture Handler for advanced UX.

---

# Combining Gestures with Animations

* Combine Pressable/Gesture Handler with `react-native-reanimated`.
* Example: Card swipe animation, draggable component.
* Benefits: Smooth performance, native driver animations.

**Instructor Tip:** Always test gestures on physical device, not just simulator. Animations and gestures are device-performance sensitive.

---

# Common Pitfalls

* Wrapping multiple Pressable or Touchable inside each other → conflicts.
* Not using GestureHandlerRootView → gestures fail on Android.
* Heavy computation on `onPress` → laggy interaction.
* Forgetting padding → touch area too small (use 44x44 minimum).

---

# LAB 5 - Build Interactive Card

**Lab Instructions:**
1. Create a card component: Pressable card, Shows alert on press, Changes color on press, Logs long press event
2. Add gesture: Swipe left to delete
3. Bonus: Swipe right to archive, Add subtle animation when pressed, Use react-native-reanimated for smooth swipe