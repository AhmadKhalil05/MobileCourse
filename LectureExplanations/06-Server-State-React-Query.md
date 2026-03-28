# Lecture 06 — Server State Management with React Query (TanStack Query)
# المحاضرة السادسة — إدارة حالة الخادم باستخدام React Query

---

## Part 1: Concept — Server State vs. Client State | حالة الخادم مقابل حالة العميل

### English Explanation

In modern applications, state can be categorized into two fundamentally different types:

**Client State** — Data that exists only in the browser/app:
- UI state (is a modal open? which tab is active?)
- Form values
- User preferences cached locally

**Server State** — Data that originates on a remote server:
- Product lists fetched from an API
- User profile data
- Order history

Server state has unique challenges that `useState` alone cannot address:
- It is **asynchronous** — must be fetched, which takes time.
- It can be **stale** — other users may modify the data while you're viewing it.
- It may need **caching** — re-fetching on every render is inefficient.
- It may need **invalidation** — after modifying data, the local cache must reflect the change.
- It needs **loading/error states** — the UI must handle pending and failed requests.

**TanStack React Query** (`@tanstack/react-query`) solves all of these problems with `useQuery` (for fetching/reading) and `useMutation` (for creating/updating/deleting).

---

### الشرح بالعربي

في التطبيقات الحديثة، توجد نوعان من الحالة:

**حالة العميل:** بيانات موجودة فقط داخل التطبيق (حالة UI، قيم النماذج).

**حالة الخادم:** بيانات مصدرها خادم بعيد وتُجلب عبر API.

تحديات حالة الخادم التي لا يُعالجها `useState` وحده:
- **لا متزامنة** — تحتاج وقتاً للجلب.
- **قد تصبح قديمة** — قد يُعدِّلها مستخدمون آخرون.
- **تحتاج تخزيناً مؤقتاً** — إعادة الجلب عند كل رسم غير فعَّال.
- **تحتاج إبطالاً** — بعد التعديل، يجب تحديث الـ cache.

**React Query** تحل كل هذا.

---

## Part 2: `lib/queryClient.ts` — Query Client Configuration

**Path:** `lib/queryClient.ts`

### Full Code

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60,
        },
    },
});
```

### Analysis

**`QueryClient`**
The `QueryClient` is the central management object for all React Query operations. It:
- Maintains an in-memory **cache** of all fetched data, keyed by query keys.
- Tracks loading, error, and success states for every query.
- Manages background refetching and cache invalidation.

**`defaultOptions.queries.retry: 1`**
If a query fails (network error, 500 response), React Query will **retry it once** before marking it as an error. Setting this to `1` means: initial attempt + 1 retry = 2 total attempts. Setting to `0` disables retries.

**`staleTime: 1000 * 60`**
`staleTime` (in milliseconds) defines how long cached data is considered fresh. `1000 * 60` = 60,000ms = 1 minute.

- While data is **fresh** (within staleTime), React Query serves it from cache without making a new API call — even if the component remounts.
- Once data becomes **stale** (after staleTime elapses), React Query will re-fetch in the background on the next access, while still serving the old data immediately (the user sees data instantly while fresh data loads).

This is a critical performance and UX optimization.

**Where is `queryClient` used?**
1. In `app/_layout.tsx`: `<QueryClientProvider client={queryClient}>` — makes the client available via Context to all components.
2. In `app/products.tsx`: `queryClient.invalidateQueries(...)` — explicitly invalidates the products cache after adding a new product.

---

### الشرح بالعربي

**`QueryClient`:**
كائن مركزي يُدير:
- **الـ cache المؤقت** لجميع البيانات المجلوبة.
- حالات التحميل والخطأ والنجاح.
- إعادة الجلب في الخلفية.

**`retry: 1`:**
عند فشل الطلب، أعد المحاولة مرة واحدة. إذا فشل مجدداً، يُعلَّم الاستعلام كخطأ.

**`staleTime: 1000 * 60` (دقيقة واحدة):**
المدة التي تعتبر فيها البيانات "طازجة". خلال هذه المدة:
- React Query تخدم البيانات من الـ cache فوراً دون طلب جديد.
- بعد انتهائها، يُعيد الجلب في الخلفية بينما يُعرض المحتوى القديم فوراً.

هذا مُحسِّن مهم للأداء وتجربة المستخدم.

---

## Part 3: `app/products.tsx` — `useQuery` and `useMutation`

**Path:** `app/products.tsx`

### Full Code

```typescript
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { addProduct, getProducts } from "@/api/ProductsService";
import ProductCard from "@/components/product-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const Products = () => {

    const handleAddProduct = async () => {
        const data = {
            name: "Test Product",
            price: 100,
            imageUrl: "https://picsum.photos/200/300",
            description: "This is a test product",
        };
        mutate(data);
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    })

    const { mutate } = useMutation({
        mutationKey: ["addProducts"],
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    })

    if(isLoading) return (
        <View style={{ marginTop: 20}}>
            <Text>Loading...</Text>
        </View>
    )

    if(error) return (
        <View style={{ marginTop: 20}}>
            <Text>Error fetching data</Text>
        </View>
    )

    return (
        <View style={{ marginTop: 20}}>
            <View style={styles.container}>
                <Text style={styles.title}>Product List</Text>
                <Pressable style={styles.button} onPress={handleAddProduct}>
                    Add Product
                </Pressable>
            </View>
            <ScrollView style={{ height: 500 }}>
                {data?.map((product: any) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </ScrollView>
        </View>
    )
}
```

---

### `useQuery` — Data Fetching

```typescript
const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
})
```

**`queryKey: ["products"]`**
The query key is a unique identifier for this query's cache entry. It's an array that can contain any serializable values. React Query uses this key to:
- Store and retrieve data from cache.
- Track which queries to invalidate (`invalidateQueries` matches by key).
- Deduplicate identical requests (two components with the same key share one request).

When the key changes (e.g., `["products", userId]`), React Query treats it as a different query and fetches fresh data.

**`queryFn: getProducts`**
The function that performs the actual data fetching. It must return a promise. React Query calls this function when:
- The component first mounts (if data is not in cache or is stale).
- The data becomes stale and the component is focused.
- The user triggers a refetch.

**Returned Values:**
| Value | Type | Description |
|---|---|---|
| `data` | `T \| undefined` | Fetched data (undefined while loading) |
| `isLoading` | `boolean` | true during the initial fetch |
| `isFetching` | `boolean` | true during any fetch (including background refetches) |
| `error` | `Error \| null` | Error object if the query failed |
| `isSuccess` | `boolean` | true if the last query succeeded |
| `refetch` | `function` | Manually trigger a refetch |

**Loading State Pattern:**
```typescript
if(isLoading) return (<View><Text>Loading...</Text></View>)
if(error) return (<View><Text>Error fetching data</Text></View>)
```
This is the standard early-return pattern for handling async data:
1. Show loading indicator while fetching.
2. Show error message if fetch failed.
3. Render actual data only when available.

Without this pattern, accessing `data.map(...)` while `data` is `undefined` would crash the app.

---

### الشرح بالعربي

**`useQuery`:**
هوك لجلب البيانات وإدارة حالتها.

**`queryKey: ["products"]`:**
مفتاح فريد للـ cache. React Query يستخدمه لـ:
- تخزين البيانات واسترجاعها.
- تحديد ما يجب إبطاله عند `invalidateQueries`.
- توحيد الطلبات المكررة (مكوِّنان بنفس المفتاح يشتركان في طلب واحد).

**نمط العودة المبكرة:**
```typescript
if(isLoading) return (...)
if(error) return (...)
// هنا البيانات متاحة بأمان
```
هذا النمط يمنع الوصول إلى `data` وهي `undefined`، مما يتجنب تعطل التطبيق.

---

### `useMutation` — Data Modification

```typescript
const { mutate } = useMutation({
    mutationKey: ["addProducts"],
    mutationFn: addProduct,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
    }
})
```

**`useMutation`** is used for operations that modify server data: create, update, delete.

**`mutationFn: addProduct`**
The function executed when `mutate(variables)` is called. It receives whatever is passed to `mutate()` as its argument.

**`mutate(data)`**
The function returned by `useMutation` that triggers the mutation. When `handleAddProduct` calls `mutate(data)`, React Query:
1. Calls `addProduct(data)` (the `mutationFn`).
2. Tracks loading state (`isPending`).
3. On success, calls `onSuccess`.
4. On failure, calls `onError`.

**`onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] })`**
This is the critical cache invalidation step. After adding a product:
1. The server's product list has changed.
2. The local cache (with key `["products"]`) is now outdated.
3. `invalidateQueries` marks the cache as stale.
4. React Query immediately re-fetches `getProducts` in the background.
5. The product list automatically updates without manual refresh.

**Why `invalidateQueries` and not just `setQueryData`?**
`invalidateQueries` causes a fresh network request, ensuring the list reflects the authoritative server state. `setQueryData` could be used for **optimistic updates** (updating the local cache immediately before the server confirms), but that's more complex.

---

### الشرح بالعربي

**`useMutation`:** للعمليات التي تُعدِّل بيانات الخادم (إنشاء، تحديث، حذف).

**`mutate(data)`:** تُشغِّل العملية — تستدعي `addProduct(data)` وتتتبع الحالة.

**`onSuccess → invalidateQueries`:**
بعد إضافة منتج ناجح:
1. قائمة المنتجات في الخادم تغيرت.
2. الـ cache المحلي أصبح قديماً.
3. `invalidateQueries` تُعلِّم الـ cache كقديم.
4. React Query تُعيد جلب القائمة تلقائياً.
5. قائمة المنتجات تتحدث دون تدخل يدوي.

هذه هي **قوة React Query** — تزامن تلقائي بين الحالة المحلية والخادم.

---

## Part 4: `app/product-list.tsx` — Manual State (Before React Query)

**Path:** `app/product-list.tsx`

```typescript
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ProductCard from "@/components/product-card";
import { useState } from "react";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    return (
        <View>
            <Text>Product List</Text>
            <ScrollView>
                {products.map((product: any) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </ScrollView>
        </View>
    )
}

export default ProductList;
```

This file shows the **"before" state** — managing server data with only `useState`. Notice what's **missing**:
- No `useEffect` to fetch data on mount.
- No loading state.
- No error handling.
- No cache — data disappears on unmount and must be re-fetched on every mount.

This file exists as a pedagogical comparison to `products.tsx` which uses React Query properly.

هذا الملف يُظهر الحالة **قبل** استخدام React Query — إدارة بيانات الخادم بـ `useState` فقط، بدون جلب، بدون تحميل، بدون معالجة أخطاء. يُوجد للمقارنة التعليمية.

---

## Part 5: React Query Data Flow Diagram | رسم تدفق البيانات

```
Component mounts
    → useQuery checks cache for ["products"]
    → If not in cache or stale: call getProducts()
    → isLoading = true (render loading UI)
    → getProducts() → ApiBase.get('/api/v1/products')
    → Request interceptor adds Authorization header
    → Server responds with product array
    → Response interceptor logs response
    → React Query stores data in cache with key ["products"]
    → isLoading = false, data = [product1, product2, ...]
    → Component re-renders with product cards

User taps "Add Product"
    → handleAddProduct() assembles product data
    → mutate(data)
    → addProduct(data) → ApiBase.post('/api/v1/products', data)
    → Server creates product, responds with success
    → onSuccess fires
    → invalidateQueries(["products"])
    → useQuery detects stale cache
    → Refetches getProducts()
    → Updated list appears automatically
```

---

## Summary | خلاصة

| Concept | API | Role |
|---|---|---|
| Query Client | `QueryClient` + `QueryClientProvider` | Central cache manager |
| Data fetching | `useQuery({ queryKey, queryFn })` | Fetch + cache + loading/error states |
| Data mutation | `useMutation({ mutationFn, onSuccess })` | Modify server data |
| Trigger mutation | `mutate(variables)` | Execute the mutation |
| Cache invalidation | `queryClient.invalidateQueries({ queryKey })` | Mark cache stale → refetch |
| staleTime | `defaultOptions.queries.staleTime` | Cache freshness duration |
