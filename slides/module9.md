
---

# MODULE 9 - useEffect & AppState API

**Why Lifecycle Management Matters**
Instructor Notes:
React Native components need lifecycle awareness for:
* Fetching data
* Cleaning up resources
* Listening to events

`useEffect` replaces class component lifecycle methods.
`AppState` allows detecting foreground/background app state.

---

# Basic useEffect Example

> import { useEffect, useState } from 'react';
> import { Text } from 'react-native';
> 
> export default function App() {
>   const [count, setCount] = useState(0);
>   
>   useEffect(() => {
>     console.log('Component mounted');
>     return () => console.log('Component unmounted');
>   }, []);
>   
>   return <Text>Count: {count}</Text>;
> }

**Instructor Notes:**
* Empty dependency array `[]` → runs once on mount.
* Cleanup function runs on unmount.
* Equivalent to `componentDidMount` + `componentWillUnmount`.

---

# useEffect with Dependencies & API Calls

> useEffect(() => {
>   console.log('Count changed:', count);
> }, [count]);

* Runs every time count changes. Dependency array controls when effect runs. Avoid omitting dependencies → causes stale closures.

> useEffect(() => {
>   const fetchData = async () => {
>     const res = await fetch('https://jsonplaceholder.typicode.com/posts');
>     const data = await res.json();
>     setPosts(data);
>   };
>   fetchData();
> }, []);

**Instructor Notes:** Wrap async calls inside inner function. Prevent memory leaks by adding cleanup if needed. Best practice: cancel requests if component unmounts.

---

# AppState API

**Why use AppState:**
Detect if app goes foreground/background. Pause/resume tasks accordingly.

> import { useEffect, useState } from 'react';
> import { AppState, Text } from 'react-native';
> 
> export default function App() {
>   const [appState, setAppState] = useState(AppState.currentState);
>   useEffect(() => {
>     const subscription = AppState.addEventListener('change', setAppState);
>     return () => subscription.remove();
>   }, []);
>   return <Text>App State: {appState}</Text>;
> }

Values: "active", "background", "inactive". Important for pausing timers, stopping fetches in background.

---

# Combining useEffect & AppState

**Example: Pause Polling When Backgrounded**

> useEffect(() => {
>   let interval;
>   if (appState === 'active') {
>     interval = setInterval(fetchData, 5000);
>   } else {
>     clearInterval(interval);
>   }
>   return () => clearInterval(interval);
> }, [appState]);

**Instructor Notes:**
* Only fetch data when app is active
* Prevents unnecessary network calls in background
* Important for battery efficiency

---

# Common Pitfalls & LAB 9

**Common Pitfalls:**
* Forgetting cleanup → memory leaks
* Using empty dependencies incorrectly → effect not re-running
* Heavy computations inside effect → lag
* Not unsubscribing listeners → crashes or duplicated events

**LAB 9 - Lifecycle & Background Task**
1. Build a simple timer app: Timer counts seconds on screen, Pauses when app goes to background, Resumes when app is active
2. Bonus: Add a network fetch that only runs while active, Show "Paused in background" message

