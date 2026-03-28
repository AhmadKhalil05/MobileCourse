---

# MODULE 12 - AsyncStorage, SQLite & Persistent Data (Advanced)

**Why Advanced Persistent Storage Matters**
Instructor Notes:
Mobile apps often require offline-first capabilities. Complex apps may need:
* Multiple tables (SQLite)
* Relationships between entities
* Sync with remote API when online

AsyncStorage alone is insufficient for structured/large datasets.

---

# Multi-table SQLite Setup

**Example: Users + Notes tables**

> import * as SQLite from 'expo-sqlite';
> const db = SQLite.openDatabase('app.db');
> 
> db.transaction(tx => {
>   tx.executeSql(
>     `CREATE TABLE IF NOT EXISTS users (
>       id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT
>     )`
>   );
>   tx.executeSql(
>     `CREATE TABLE IF NOT EXISTS notes (
>       id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, content TEXT,
>       FOREIGN KEY (userId) REFERENCES users (id)
>     )`
>   );
> });

**Instructor Notes:** `FOREIGN KEY` ensures relational integrity. Always check `IF NOT EXISTS` to avoid errors on app restart.

---

# Insert & Query with Relations

> // Insert User
> db.transaction(tx => {
>   tx.executeSql('INSERT INTO users (name,email) VALUES (?,?)', ['Ali','ali@example.com']);
> });
> 
> // Insert Note for User
> db.transaction(tx => {
>   tx.executeSql('INSERT INTO notes (userId, content) VALUES (?,?)', [1, 'My first note']);
> });
> 
> // Query Notes for a User
> db.transaction(tx => {
>   tx.executeSql('SELECT * FROM notes WHERE userId=?', [1], (_, { rows }) => {
>     console.log(rows._array);
>   });
> });

* **Key:** Always wrap inserts/queries in transactions. Enables atomic operations and prevents partial writes.

---

# AsyncStorage + SQLite Hybrid & Offline-first Pattern

Store small flags/tokens in AsyncStorage. Store structured data/lists in SQLite.
> import AsyncStorage from '@react-native-async-storage/async-storage';
> await AsyncStorage.setItem('isLoggedIn', 'true'); // simple flag

Ensures fast access for auth + persistent storage for data.

**Strategy: Offline-first Pattern**
1. Store all user input in SQLite locally
2. Display data immediately in app
3. When online: Sync changes with server API, Update SQLite with confirmed server IDs
4. Benefits: Smooth UX, Handles network outages gracefully

---

# Example: Notes App Offline Sync

> // Step 1: Save locally
> await db.transaction(tx => tx.executeSql(
>   'INSERT INTO notes (userId, content) VALUES (?,?)', [1, 'Offline Note']
> ));
> 
> // Step 2: Sync with server when online
> if (isOnline) {
>   const pendingNotes = await db.transaction(tx =>
>     tx.executeSql('SELECT * FROM notes WHERE synced != 1')
>   );
>   await axios.post('/syncNotes', pendingNotes);
> }

Use a `synced` flag to mark records. Ensures no duplicate uploads.

---

# Best Practices, Pitfalls & LAB 12

**Best Practices:**
Always handle errors in transactions. Avoid heavy queries on main thread → can lag UI. Use indexes for large tables to improve performance. Abstract database logic in `services/db.js`. Combine with Context API to manage state globally.

**Common Pitfalls:** Forgetting to initialize tables, Blocking UI with synchronous operations, Overusing AsyncStorage for large datasets, Not handling offline/online status.

**LAB 12 - Offline Notes App**
1. Create a Notes App: User can add, edit, delete notes. Notes stored in SQLite locally. Show list in FlatList. Use AsyncStorage to store login state.
2. Add offline-first sync: Add a "Sync" button. On click → push unsynced notes to API. Update local SQLite synced status.
3. Bonus: Implement pull-to-refresh for notes. Show offline indicator when app is not connected.

