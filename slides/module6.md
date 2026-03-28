
# MODULE 6 - AsyncStorage & SQLite

**Why Local Storage Matters**
Mobile apps often need to persist data offline.
Two main options:
1. **AsyncStorage** - simple key/value storage (small data, tokens, flags)
2. **SQLite** - relational database (structured data, large lists)
Use persistence to improve UX: login state, preferences, offline caching.

---

# AsyncStorage Basics

**Installation:**
> npm install @react-native-async-storage/async-storage

> import AsyncStorage from '@react-native-async-storage/async-storage';
> // Save token
> await AsyncStorage.setItem('userToken', '12345');
> // Read token
> const token = await AsyncStorage.getItem('userToken');
> // Remove token
> await AsyncStorage.removeItem('userToken');

**Notes:** AsyncStorage is async → always `await`. Ideal for small data only (<6MB). Use `try/catch` for error handling.

---

# AsyncStorage with JSON

**Example: Saving Objects**

> const user = { id: 1, name: 'Ali' };
> await AsyncStorage.setItem('user', JSON.stringify(user));
> const savedUser = JSON.parse(await AsyncStorage.getItem('user'));
> console.log(savedUser.name); // Ali

**Notes:** Always serialize objects to JSON. Parsing must handle null values.

---

# SQLite for Structured Data

**Installation (Expo Managed):** `expo install expo-sqlite`

> import * as SQLite from 'expo-sqlite';
> const db = SQLite.openDatabase('mydb.db');
> 
> // Create table
> db.transaction(tx => {
>   tx.executeSql(
>     'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT);'
>   );
> });

---

# Inserting & Querying Data

> // Insert
> db.transaction(tx => {
>   tx.executeSql('INSERT INTO users (name) VALUES (?)', ['Ali']);
> });
> 
> // Query
> db.transaction(tx => {
>   tx.executeSql('SELECT * FROM users', [], (_, { rows }) => {
>     console.log(rows._array);
>   });
> });

**Notes:** Transactions ensure atomic operations. Use callbacks for query results. AsyncStorage for small key/value, SQLite for lists/tables.

---

# Use Case Example & Pitfalls

* Store user profile → AsyncStorage
* Store offline messages → SQLite
* **Benefits:** Offline support, Quick retrieval, Persistent login.
* **Tip:** Always abstract storage layer in `storage.js` easier to maintain.

**Common Pitfalls:**
* Storing large data in AsyncStorage → slow startup
* Forgetting JSON.stringify stores `[object Object]`
* SQLite queries not wrapped in transaction → partial writes
* Not handling database initialization → crashes on first launch

---

# LAB 6 - Persistent Login & Local Storage

1. Create a login screen: User inputs email & password, Save token in AsyncStorage, Navigate to Home if token exists.
2. Add SQLite: Store a list of notes locally, Display in FlatList, Add "Add Note" feature.
3. Bonus: Preload dummy data on first app launch, Implement offline fetch fallback.