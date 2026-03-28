---

# MODULE 13 - Debugging & APK/IPA Build

**Why Debugging & Builds Matter**
Instructor Notes:
Debugging is essential for finding and fixing errors quickly. Building production APK/IPA ensures real users get stable apps.
Tools include: Expo Go & Expo DevTools, React Native Debugger, Chrome Dev Tools, Xcode & Android Studio

**Debugging in Expo**
1. Start Expo: `npx expo start`
2. Open Dev Tools in browser
3. Enable Remote JS Debugging
4. Use console.log for quick inspection
5. Hot Reload / Fast Refresh updates code instantly

---

# Using React Native Debugger & Chrome DevTools

**React Native Debugger**
Download from https://github.com/jhen0409/react-native-debugger
Integrates: Redux Dev Tools, Network inspector, Breakpoints.
Connect via Remote JS Debugging to inspect state, props, network requests, performance.

**Chrome DevTools**
Press `d` in Expo terminal → "Debug Remote JS". Open Chrome → DevTools (Console/Sources).
Features: Set breakpoints, Inspect variables, Debug async functions. Useful for network requests & errors.

---

# Common Debugging Techniques

* `console.log`, `console.warn`, `console.error`
* Reactotron → inspect app state, logs
* Flipper → mobile debugging platform
* Test on physical devices, not just simulator
* Use error boundaries for UI crashes

---

# Building APK (Android) & IPA (iOS)

**Building APK (Android) - Expo Managed Workflow:**
> eas build -p android --profile production

Output: `.apk` or `.aab` file
Steps: Configure app.json/app.config.js, Set app icon, splash screen, Upload signing key (Expo handles automatically with EAS), Install APK on device to test.

**Building IPA (iOS) - Expo Managed Workflow:**
> eas build -p ios --profile production

Output: `.ipa` file
Requirements: Apple Developer account, Xcode for local build (if using bare workflow). Test on TestFlight before App Store release.

---

# Debugging Build Issues & LAB 13

**Common Issues:**
* Missing permissions (check app.json and Info.plist)
* Expo updates → rebuild if native dependencies changed
* Outdated SDK → upgrade Expo SDK
* Unsigned builds → ensure proper certificates

**Instructor Tip:** Always test in production mode before publishing. Logs in development differ from production.

**Lab 13 - Debug & Build Exercise**
1. Debugging Lab: Introduce a bug in previous Notes App, Use console, React Native Debugger, and Chrome DevTools. Identify and fix the bug.
2. Build Lab: Configure app.json with app name, icon, and splash. Build APK for Android and IPA for iOS using EAS. Install APK on a real device.
3. Bonus: Configure production vs development environment variables. Test offline behavior before final build.