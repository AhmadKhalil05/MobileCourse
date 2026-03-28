# Introduction to Core Components

React Native provides built-in components that map directly to native UI elements.

Unlike React Web:
* No `<div>`
* No `<span>`
* No HTML

Instead we use:
`View`, `Text`, `Image`, `ScrollView`, `FlatList`, `TextInput`, `Pressable`, `ActivityIndicator`

**Key Concept:** Every mobile screen is built by combining these building blocks.

---

# The View Component (Foundation of Layout)

`View` is the most fundamental component. Equivalent to `<div>` in web.

**Used for:**
* Layout
* Styling
* Grouping elements

**Example:**
> import { View, Text } from 'react-native';
> <View style={{ padding: 20 }}>
>   <Text>Hello</Text>
> </View>

**Important Properties:** `flex`, `backgroundColor`, `margin`, `padding`, `alignItems`, `justifyContent`

---

# Understanding Layout with View

Views support Flexbox by default.

**Example:**
> <View style={{
>   flexDirection: 'row',
>   justifyContent: 'space-between',
>   padding: 10
> }}>
>   <Text>Left</Text>
>   <Text>Right</Text>
> </View>

**Instructor Note:** Explain that React Native defaults to: `flexDirection: 'column'`

---

# The Text Component (Rules & Behavior)

Text must ALWAYS be wrapped inside `<Text>`.

**This works:**
> <Text>Hello Students</Text>

**This causes error:**
> <View>
>   Hello Students
> </View>

**Why?** Because React Native does not render raw text outside Text component.

---

# Nested Text Components

Text supports nesting:

> <Text>
>   Hello <Text style={{ fontWeight: 'bold' }}>World</Text>
> </Text>

**Use Cases:**
* Mixed styling
* Inline formatting
* Highlighting words

---

# The Image Component

Displays images from: Local assets or Remote URLs

**Local Image**
> <Image
>   source={require('./assets/logo.png')}
>   style={{ width: 100, height: 100 }}
> />

**Remote Image**
> <Image
>   source={{ uri: 'https://picsum.photos/200' }}
>   style={{ width: 200, height: 200 }}
> />

**Important:** Width & height must be defined.

---

# ScrollView (Scrollable Content)

Used when content exceeds screen height.

> <ScrollView>
>   <Text>Item 1</Text>
>   <Text>Item 2</Text>
>   <Text>Item 3</Text>
> </ScrollView>

**Characteristics:**
* Renders ALL children at once
* Not optimized for large lists
* Simple to use

---

# FlatList (Performance Optimized Lists)

FlatList is used for rendering large lists efficiently.

**Example:**
> const users = [
>   { id: '1', name: 'Yanal' },
>   { id: '2', name: 'Sara' }
> ];
> 
> <FlatList
>   data={users}
>   keyExtractor={(item) => item.id}
>   renderItem={({ item }) => (
>     <Text>{item.name}</Text>
>   )}
> />

**Why Better Than ScrollView?** Lazy loads items, Memory efficient, Better performance

---

# TextInput (User Input)

Used for user typing.

**Example:**
> const [name, setName] = useState('');
> <TextInput
>   value={name}
>   onChangeText={setName}
>   placeholder="Enter your name"
>   style={{
>     borderWidth: 1,
>     padding: 10,
>     margin: 10
>   }}
> />

**Controlled Component Concept:** Value comes from state.

---

# Keyboard Handling

**Important properties:**
* keyboardType
* secureTextEntry
* autoCapitalize

**Example:**
> <TextInput
>   keyboardType="email-address"
>   autoCapitalize="none"
> />

---

# Pressable (Modern Touch Handling)

Handles touch interactions.

> <Pressable onPress={() => alert('Pressed!')}>
>   <Text>Click Me</Text>
> </Pressable>

**Why Pressable?**
* Replaces older Touchable components
* Provides better control
* Supports press states

---

# Pressable with Style Feedback

> <Pressable
>   style={({ pressed }) => ({
>     backgroundColor: pressed ? 'gray' : 'blue',
>     padding: 10
>   })}
> >
>   <Text style={{ color: 'white' }}>Press Me</Text>
> </Pressable>

**Concept:** UI changes based on press state.

---

# ActivityIndicator (Loading UI)

Used during:
* API calls
* Async operations
* Waiting states

**Example:**
> <ActivityIndicator size="large" color="blue" />

---

# SafeArea View

Ensures content does not overlap:
* Notch
* Status bar
* System UI

> import { SafeAreaView } from 'react-native-safe-area-context';

---

# Combining Components

**Example: Profile Card**

> <View style={{ padding: 20 }}>
>   <Image source={{ uri: 'https://picsum.photos/100' }}
>          style={{ width: 100, height: 100 }} />
>   <Text>John Doe</Text>
>   <Pressable>
>     <Text>Follow</Text>
>   </Pressable>
> </View>

**Key Learning:** Apps are built by composing small reusable pieces.

---

# Component Reusability

**Create reusable component:**
> function ProfileCard({ name }) {
>   return (
>     <View>
>       <Text>{name}</Text>
>     </View>
>   );
> }

**Use it:**
> <ProfileCard name="Yanal" />

**Why Reusable Components Matter:** Cleaner code, Better organization, Scalability

---

# LAB 3 (Practical Exercise)

**Build a Profile Card Screen**

**Requirements:**
* Display: Profile image, Name, Email, Follow button
* Use: View, Text, Image, Pressable
* Apply styling with Flexbox

**Bonus Challenge:**
* Add loading spinner
* Add ScrollView for multiple cards

**Expected Outcome:**
Students will: Understand core components, Build structured layout, Apply interactive UI, Practice reusability