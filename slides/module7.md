
# MODULE 7 - Fetch API & Axios Integration

**Why Networking Matters**
Instructor Notes:
Most mobile apps need remote data (APIs).
React Native supports Fetch API natively.
Axios is a popular HTTP client with extra features:
* Interceptors
* Automatic JSON parsing
* Timeout handling

Best practice: Create an API service layer.

---

# Using Fetch API

> import { useEffect, useState } from 'react';
> import { View, Text, FlatList } from 'react-native';
> 
> export default function App() {
>   const [data, setData] = useState([]);
>   useEffect(() => {
>     fetch('https://jsonplaceholder.typicode.com/posts')
>       .then(res => res.json())
>       .then(json => setData(json))
>       .catch(err => console.error(err));
>   }, []);
>   return (
>     <FlatList
>       data={data}
>       keyExtractor={item => item.id.toString()}
>       renderItem={({ item }) => <Text>{item.title}</Text>}
>     />
>   );
> }

**Instructor Notes:**
* Always handle errors with `.catch`.
* `useEffect` ensures fetch happens on component mount.
* Use `keyExtractor` in FlatList for proper rendering.

---

# Axios Basics

**Installation:**
> npm install axios

**Code Example:**
> import axios from 'axios';
> 
> axios.get('https://jsonplaceholder.typicode.com/posts')
>   .then(res => console.log(res.data))
>   .catch(err => console.error(err));

**Instructor Notes:**
* Axios simplifies request/response handling.
* Supports POST, PUT, DELETE, etc.
* Automatic JSON parsing.

---

# Async/Await with Axios

> const fetchPosts = async () => {
>   try {
>     const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
>     setData(response.data);
>   } catch (error) {
>     console.error(error);
>   }
> };
> 
> useEffect(() => {
>   fetchPosts();
> }, []);

**Instructor Notes:**
* Cleaner syntax than `.then()`.
* Use `try/catch` to handle network errors.
* Async/Await is modern standard.

---

# Axios Interceptors

> axios.interceptors.request.use(config => {
>   config.headers.Authorization = `Bearer ${token}`;
>   return config;
> });
> 
> axios.interceptors.response.use(
>   response => response,
>   error => {
>     console.log('Request failed:', error);
>     return Promise.reject(error);
>   }
> );

**Instructor Notes:**
* Request interceptors → automatically attach auth tokens.
* Response interceptors → centralized error handling.

---

# Creating an API Service Layer

**Example (api.js)**
> import axios from 'axios';
> 
> const api = axios.create({
>   baseURL: 'https://jsonplaceholder.typicode.com',
>   timeout: 5000,
> });
> 
> export const getPosts = () => api.get('/posts');
> export const getPostById = id => api.get(`/posts/${id}`);
> 
> export default api;

**Instructor Tip:**
* Keep API calls separate from UI logic.
* Makes app easier to maintain and test.

---

# Common Pitfalls

* Forgetting `.catch` → unhandled errors
* Calling API on every render → use `useEffect` with empty deps
* Not canceling previous requests → can cause memory leaks
* Hardcoding URLs → use env variables

---

# LAB 7 - Build Posts Feed

**Lab Instructions:**
1. Create a feed screen:
   * Display posts in FlatList
   * Fetch posts from JSONPlaceholder API
   * Show loading spinner while fetching
   * Show error message if network fails
2. Bonus:
   * Add "Pull to Refresh"
   * Add pagination (`?limit=10&page=1`)