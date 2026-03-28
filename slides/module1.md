This course provides a complete practical foundation in building cross-platform mobile applications using React Native and Expo.

**Students will:**
* Understand mobile architecture
* Build real applications
* Use hooks, navigation, APIs, and storage
* Deploy production-ready apps

---

# Why Cross-Platform Development?

**The Mobile Ecosystem Problem**
Traditionally:
* iOS → Swift/Objective-C
* Android → Kotlin / Java

Two separate codebases:
* Higher cost
* Slower development
* Maintenance complexity

**Cross-Platform Solution**
React Native allows:
* One JavaScript codebase
* Native performance
* Shared logic across platforms

---

# What is React Native?

React Native is a framework developed by Meta that allows developers to build mobile applications using JavaScript and React.

**Key Characteristics**
* Uses real native components
* Not a WebView-based solution
* Written in JavaScript
* Uses React's component model
* Declarative UI

---

# What is React Native? (Example)

> export default function App() {
>   return (
>     <View>
>       <Text>Hello Mobile World</Text>
>     </View>
>   );
> }

**Important:**
Unlike React Web, React Native does NOT use HTML elements.

---

# React Native vs React Web

| Feature | React Web | React Native |
| :--- | :--- | :--- |
| **UI Base** | HTML/CSS | Native UI components |
| **Rendering** | DOM | Native Views |
| **Styling** | CSS | StyleSheet (JS-based) |
| **Platform** | Browser | iOS & Android |

---

# React Native Architecture (Deep Explanation)

React Native consists of 3 major layers:

**1. JavaScript Layer**
* Runs React components
* Business logic
* Hooks
* State management

**2. Bridge**
* Asynchronous communication channel
* Converts JS instructions into native commands
* Serializes messages

**3. Native Layer**
* iOS UIKit
* Android View system
* Native modules

**Data Flow:** JS Thread → Bridge → Native Thread UI Render

---

# Modern Architecture (Fabric & JSI Overview)

React Native is evolving:
* Old Architecture → Bridge-based
* New Architecture → JSI (JavaScript Interface)
* Fabric Renderer
* TurboModules

**Why This Matters?**
* Faster communication
* Synchronous calls
* Improved performance
* Better type safety

---

# What is Expo?

Expo is a framework and platform built on top of React Native.

**Expo Provides:**
* Managed workflow
* Prebuilt native APIs:
  * Camera
  * Sensors
  * Notifications
  * FileSystem
* Simplified build process
* Over-the-air updates

---

# Expo Architecture

**Development Flow:**
Developer → Expo CLI → Metro Bundler → JavaScript Bundle → Device / Emulator

**What is Metro?**
* JavaScript bundler
* Watches file changes
* Supports fast refresh

---

# Managed vs Bare Workflow

| Feature | Managed | Bare |
| :--- | :--- | :--- |
| **Setup Speed** | Fast | Moderate |
| **Native Customization** | Limited | Full |
| **Best For** | Learning & Most Apps | Advanced Apps |

**Managed Workflow**
* No native folders
* Expo controls native configuration
* Faster start

**Bare Workflow**
* Full access to native Android/iOS projects
* More flexibility
* More setup complexity

---

# Development Workflow in Practice

1. Write JS code
2. Metro bundles project
3. App reloads automatically
4. Debug via DevTools

**Fast Refresh**
When you save:
* Only changed modules reload
* State is preserved (sometimes)

---

# Setting Up Environment

**Requirements:**
* Node.js (LTS recommended)
* npm or yarn
* VS Code
* Android Studio (optional but recommended)
* iOS Simulator (Mac only)

**Create Project**
> npx create-expo-app MyApp
> cd MyApp
> npx expo start

---

# Running the Application

**Options:**
* Android Emulator
* iOS Simulator
* Expo Go on physical device
* Web

**QR Code Flow**
Scan QR → App loads bundle from local server

---

# Understanding App Entry Point

Open App.js

> export default function App() {
>   return (
>     <View style={{ flex: 1 }}>
>       <Text>Hello Expo</Text>
>     </View>
>   );
> }

**Key Concepts**
* Functional component
* JSX
* Default export
* Root component

---

# LAB 1 (Hands-On)

**Objective:**
Set up environment and modify UI.

**Tasks:**
1. Install Node.js
2. Create Expo project
3. Run project
4. Change background color
5. Add centered Text
6. Add console.log message
7. Observe Fast Refresh

**Expected Learning Outcome**
Students will:
* Understand project structure
* Successfully run mobile app
* Modify UI
* Experience live reload