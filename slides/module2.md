
When you create an Expo project, several files and folders are automatically generated.

**Typical Structure:**
> MyApp/
>  ├── App.js
>  ├── app.json
>  ├── package.json
>  ├── assets/
>  ├── node_modules/
>  └── babel.config.js

**What Each File Does:**
* **App.js** → Main entry point
* **app.json** → Project configuration
* **package.json** → Dependencies & scripts
* **assets/** → Images, fonts, media
* **node_modules/** → Installed packages

**Instructor Note:** Explain that understanding structure prevents confusion later when project grows.

---

# App.js Deep Breakdown

Open App.js:

> import { StatusBar } from 'expo-status-bar';
> import { StyleSheet, Text, View } from 'react-native';
> 
> export default function App() {
>   return (
>     <View style={styles.container}>
>       <Text>Hello World</Text>
>       <StatusBar style="auto" />
>     </View>
>   );
> }

**Breakdown:**
* import imports native components
* Functional component → App ()
* JSX return
* Uses StyleSheet
* Uses Expo's statusBar

---

# StyleSheet Explained

React Native does NOT use CSS files.
Instead, styling is written in JavaScript:

> const styles = StyleSheet.create({
>   container: {
>     flex: 1,
>     backgroundColor: '#fff',
>     alignItems: 'center',
>     justifyContent: 'center',
>   },
> });

**Why StyleSheet?**
* Performance optimized
* Validates style properties
* Encourages reusable styling

---

# app.json Configuration

app.json controls app metadata.

> {
>   "expo": {
>     "name": "MyApp",
>     "slug": "my-app",
>     "orientation": "portrait",
>     "icon": "./assets/icon.png",
>     "splash": {
>       "image": "./assets/splash.png",
>       "resizeMode": "contain"
>     }
>   }
> }

**Controls:** App name, App icon, Splash screen, Orientation, Version

---

# package.json Explained

**Contains:** Dependencies, Dev dependencies, Scripts

**Example:**
> {
>   "scripts": {
>     "start": "expo start",
>     "android": "expo start --android",
>     "ios": "expo start --ios"
>   }
> }

**Important Concept:**
All libraries are installed using:
> npm install package-name

---

# node_modules Folder

**This folder:**
* Contains all installed packages
* Is auto-generated
* Should NOT be manually edited
* Is ignored in Git (via .gitignore)

**Why So Large?**
Because React Native depends on:
* React
* Metro
* Babel
* Many native modules

---

# Metro Bundler (Deep Explanation)

Metro is React Native's JavaScript bundler.

**What Metro Does:**
* Bundles JS files
* Transpiles modern JS
* Watches file changes
* Enables Fast Refresh

**Workflow:**
Code Change → Metro Re-bundles → Device reloads → Updated UI appears

---

# Fast Refresh vs Full Reload

**Fast Refresh:**
* Updates only changed files
* Preserves state (sometimes)

**Full Reload:**
* Restarts entire app
* Clears state

**Instructor Tip:** Explain when full reload is necessary.

---

# Running on Android Emulator

**Steps:**
1. Install Android Studio
2. Create Virtual Device
3. Start emulator
4. Run:

> npx expo start

5. Press "a" to open Android.

---

# Running on iOS Simulator (Mac Only)

**Steps:**
1. Install Xcode
2. Open Simulator
3. Run:

> npx expo start

4. Press "i" to open iOS.

---

# Running on Physical Device

**Install:**
Expo Go (Android / iOS)

**Steps:**
1. Run `npx expo start`
2. Scan QR code
3. App loads instantly

**Important Concept:** Device must be on same Wi-Fi network.

---

# Understanding the Root Component

React Native apps always start from:
> export default function App()

**Why Important?**
* This component renders everything
* Navigation container usually starts here
* Global providers are wrapped here

**Example:**
> <NavigationContainer>
>   <Stack.Navigator>
>   </Stack.Navigator>
> </NavigationContainer>

---

# Environment Variables

Sometimes we need environment configs:

**Example:**
* API base URL
* App mode (dev / production)

**In Expo:**
* Use `.env`
* Or use `app.config.js`

---

# LAB 2 (Hands-On)

**Objective:** Customize and explore project structure.

**Tasks:**
1. Change app name in app.json
2. Replace app icon
3. Modify splash screen
4. Add custom style in styleSheet
5. Add console.log in App.js
6. Observe Fast Refresh behavior
7. Run on emulator and physical device

**Expected Outcome:** Students will:
* Understand project configuration
* Navigate project structure confidently
* Customize basic app settings