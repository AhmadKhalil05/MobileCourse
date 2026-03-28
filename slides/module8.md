
# MODULE 8 - Context API & Global State

**Why Global State Matters**
Instructor Notes:
Some data needs to be shared across multiple screens:
* User authentication
* App theme
* Settings/preferences
* Cart items (e-commerce)

Options for global state:
* React Context API (built-in)
* Redux (for complex apps)
* Zustand / Recoil (modern alternatives)
Context API is suitable for medium-scale apps.

---

# Creating a Context

> import React, { createContext, useState } from 'react';
> 
> export const AuthContext = createContext();
> 
> export const AuthProvider = ({ children }) => {
>   const [user, setUser] = useState(null);
>   const login = (userData) => setUser(userData);
>   const logout = () => setUser(null);
>   
>   return (
>     <AuthContext.Provider value={{ user, login, logout }}>
>       {children}
>     </AuthContext.Provider>
>   );
> };

**Instructor Notes:**
* `AuthContext` = shared data
* `AuthProvider` wraps the entire app
* `value` object = all data/functions available to children

---

# Consuming Context

> import { useContext } from 'react';
> import { AuthContext } from './AuthContext';
> import { Text, Button } from 'react-native';
> 
> export default function Profile() {
>   const { user, logout } = useContext(AuthContext);
>   return (
>     <>
>       <Text>Welcome, {user?.name || 'Guest'}</Text>
>       <Button title="Logout" onPress={logout} />
>     </>
>   );
> }

**Instructor Notes:**
* `useContext` is the hook to consume context.
* Automatically updates UI when context state changes.
* Avoid over-nesting or heavy context objects → performance issues.

---

# Updating Global State

**Example: Login Flow**
> const { login } = useContext(AuthContext);
> 
> const handleLogin = () => {
>   const userData = { id: 1, name: 'Ali' };
>   login(userData);
> };

**Instructor Notes:**
* Updating state in context automatically triggers re-render of all consumers.
* Keep context lightweight, avoid large objects or deeply nested structures.

---

# Context vs Redux

| Feature | Context API | Redux |
| :--- | :--- | :--- |
| **Complexity** | Low | High |
| **Boilerplate** | Minimal | Moderate |
| **Async Support** | useReducer + custom hooks | Built-in middleware |
| **Best For** | Small-Medium apps | Large, complex apps |

**Instructor Tip:**
Use Context + useReducer for medium apps.
Avoid prop drilling for global/shared state.

---

# Example: Theme Context

> export const ThemeContext = createContext();
> 
> export const ThemeProvider = ({ children }) => {
>   const [theme, setTheme] = useState('light');
>   const toggleTheme = () =>
>     setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
>     
>   return (
>     <ThemeContext.Provider value={{ theme, toggleTheme }}>
>       {children}
>     </ThemeContext.Provider>
>   );
> };

**Notes:**
* Allows dynamic theme switching
* Accessible across all screens
* Can combine multiple contexts: Auth + Theme + Settings

---

# Common Pitfalls & LAB 8

**Common Pitfalls:**
* Overusing context → unnecessary re-renders
* Storing large data in context → performance issues
* Forgetting to wrap children with Provider
* Heavy computations inside context value → slow app

**LAB 8 - Authentication Flow with Context**
1. Create `AuthContext`: `user`, `login`, `logout` state/functions, Wrap entire app with `AuthProvider`
2. Screens: Login Screen → save user in context, Home Screen → display user name, Logout Button → clears context
3. Bonus: Persist login token using AsyncStorage, Combine with ThemeContext to toggle light/dark mode

