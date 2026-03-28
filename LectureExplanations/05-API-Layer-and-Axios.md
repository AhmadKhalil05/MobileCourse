# Lecture 05 — API Layer: Axios, Interceptors, and Service Architecture
# المحاضرة الخامسة — طبقة الـ API: Axios والـ Interceptors وبنية الخدمات

---

## Part 1: Concept — Separating API Logic | مفهوم — فصل منطق الـ API

### English Explanation

In professional applications, API calls are never placed directly inside screen components. Instead, they are organized into **service files** — modules that each handle a specific domain (products, users, authentication, etc.). This separation:

- Makes services **reusable** across multiple screens.
- Makes **testing** easier (mock the service, not the component).
- Centralizes **error handling** and request configuration.
- Keeps components **focused on UI**, not network logic.

The project uses a three-layer architecture:
```
Screen Component  →  Service File  →  ApiBase (Axios instance)  →  API Server
```

---

### الشرح بالعربي

في التطبيقات الاحترافية، نداءات الـ API لا تُوضَع مباشرةً داخل مكوِّنات الشاشة. بدلاً من ذلك، تُنظَّم في **ملفات خدمات** — وحدات تتعامل كل منها مع نطاق محدد (المنتجات، المستخدمون، التحقق من الهوية).

البنية الثلاثية الطبقات:
```
مكوِّن الشاشة  →  ملف الخدمة  →  ApiBase (نموذج Axios)  →  خادم الـ API
```

---

## Part 2: `api/ApiBase.jsx` — The Axios Instance Configuration

**Path:** `api/ApiBase.jsx`

### Full Code

```javascript
import axios from 'axios';

export const API_URL = "https://69a3f823611ecf5bfc23e67f.mockapi.io";

const handleErrors = async (err) => {
    if (err?.response?.status === 401) {
      window.location.href = "/login";
    } else if (err?.response?.status === 403) {
        console.log("You don't have permission to access this resource");
    } else if (err?.response?.status === 500) {
        console.log("Check from your server");
    } else {
        console.log(err);
    }
    return Promise.reject(err);
};

const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = "token";
        const tokenType = "Bearer";
        if (token) {
            config.headers.Authorization = `${tokenType} ${token}`;
        }
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
    (response) => {
      console.log(response);
      return response
    },
    handleErrors
);

export default axiosInstance;
```

---

### Line-by-Line Analysis

#### `axios.create()` — Custom Axios Instance

```javascript
const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    timeout: 30000,
});
```

Rather than using the global `axios` object directly, `axios.create()` creates a new **independent instance** with its own configuration.

- **`baseURL`** — All requests made via this instance will have this URL prepended. For example, calling `axiosInstance.get('/api/v1/products')` sends a request to `https://69a3f823611ecf5bfc23e67f.mockapi.io/api/v1/products`. This is the MockAPI service used for the demo backend.
- **`timeout: 30000`** — If the server does not respond within 30 seconds (30,000 milliseconds), the request is automatically cancelled with a timeout error. This prevents the app from hanging indefinitely on slow networks.

**Why a custom instance?** Creating a custom instance allows applying configuration (baseURL, headers, timeouts) once and reusing it everywhere. If the API URL changes, only one line needs updating.

#### Interceptors — Request Middleware

```javascript
axiosInstance.interceptors.request.use(
    (config) => {
        const token = "token";
        const tokenType = "Bearer";
        if (token) {
            config.headers.Authorization = `${tokenType} ${token}`;
        }
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (err) => Promise.reject(err)
);
```

**Interceptors** are middleware functions that run before a request is sent (request interceptor) or after a response is received (response interceptor). They allow centralized processing without modifying every API call.

**Request Interceptor Analysis:**
- `config` — The Axios request configuration object (URL, method, headers, data, etc.).
- `config.headers.Authorization` — Sets the `Authorization` header to `"Bearer token"`. In a real app, `token` would be retrieved from secure storage (not hardcoded). Every request automatically includes this authentication header.
- `config.headers["Content-Type"] = "application/json"` — Tells the server that the request body is JSON-encoded.
- `return config` — The modified config must be returned; otherwise the request is not sent.

**Second argument `(err) => Promise.reject(err)`** — Handles errors that occur during request preparation (network is unavailable, request was cancelled before sending). Propagates the error as a rejected promise.

#### Interceptors — Response Middleware and Error Handling

```javascript
axiosInstance.interceptors.response.use(
    (response) => {
      console.log(response);
      return response
    },
    handleErrors
);
```

**Success handler:** Logs every successful response (for debugging) and returns it unchanged. In production, the `console.log` would be removed.

**`handleErrors` function:**
```javascript
const handleErrors = async (err) => {
    if (err?.response?.status === 401) {
      window.location.href = "/login";
    } else if (err?.response?.status === 403) {
        console.log("You don't have permission to access this resource");
    } else if (err?.response?.status === 500) {
        console.log("Check from your server");
    } else {
        console.log(err);
    }
    return Promise.reject(err);
};
```

This handles HTTP error responses centrally.

| HTTP Status | Meaning | Handling |
|---|---|---|
| 401 Unauthorized | Not authenticated | Redirect to login (note: `window.location.href` is a web API — not correct for React Native) |
| 403 Forbidden | Authenticated but no permission | Log message |
| 500 Internal Server Error | Server-side error | Log message |
| Other errors | Network error, etc. | Log the error |

`return Promise.reject(err)` — After handling, the error is re-thrown as a rejected promise. This ensures that callers (service functions, React Query) can still catch and handle the error if needed.

**Important Note:** `window.location.href = "/login"` is a **web browser API**. This line would not work in React Native (there is no `window.location`). This is a bug in the code — it should use `router.replace('/login')` from Expo Router.

---

### الشرح بالعربي

**`axios.create()`:**
ينشئ نموذجاً مخصصاً من Axios بإعدادات محددة (عنوان الـ API، المهلة الزمنية). هذا يعني إعداد الأمور مرة واحدة وإعادة استخدامها في كل مكان.

**الـ Interceptors:**
وسيط يعمل تلقائياً قبل كل طلب (request interceptor) أو بعد كل رد (response interceptor). يُتيح:
- إضافة رأس `Authorization` لكل طلب تلقائياً دون تكراره يدوياً.
- معالجة أخطاء HTTP (401, 403, 500) في مكان مركزي واحد.

**ملاحظة مهمة:** السطر `window.location.href = "/login"` هو API خاص بالمتصفح ولا يعمل في React Native. هذا خطأ في الكود — الصواب استخدام `router.replace('/login')`.

---

## Part 3: `api/ProductsService.ts` — Products Service

**Path:** `api/ProductsService.ts`

### Full Code

```typescript
import ApiBase from "@/api/ApiBase";

export const getProducts = async () => {
    const response = await ApiBase.get('/api/v1/products');
    return response.data;
}

export const getProductById = async (id: any) => {
    return await ApiBase.get(`/api/v1/products/${id}`);
}

export const addProduct = async (payload: any) => {
    return await ApiBase.post(`/api/v1/products`, payload);
}

export const deleteProduct = async (id: string) => {
    return await ApiBase.post(`/api/v1/products/${id}`);
}
```

### Analysis

**`getProducts`**
```typescript
export const getProducts = async () => {
    const response = await ApiBase.get('/api/v1/products');
    return response.data;
}
```
- Uses `ApiBase.get()` (GET request) to fetch all products.
- `await` pauses execution until the promise resolves.
- Returns `response.data` — Axios wraps the response body in a `data` property. This function returns the raw data array, not the full Axios response object. This is why `useQuery` receives the data directly in `products.tsx`.

**`getProductById`**
```typescript
export const getProductById = async (id: any) => {
    return await ApiBase.get(`/api/v1/products/${id}`);
}
```
- Uses a template literal to inject the `id` into the URL path.
- Returns the full Axios response object (not just `.data`). This inconsistency with `getProducts` means callers of `getProductById` must access `.data` themselves — as seen in `ProductDetails`: `response.data`.

**`addProduct`**
```typescript
export const addProduct = async (payload: any) => {
    return await ApiBase.post(`/api/v1/products`, payload);
}
```
- Uses `ApiBase.post()` (POST request) to create a new product.
- `payload` is the new product object, passed as the request body. Axios automatically JSON-serializes it.

**`deleteProduct`**
```typescript
export const deleteProduct = async (id: string) => {
    return await ApiBase.post(`/api/v1/products/${id}`);
}
```
- Bug: Uses `post` instead of `delete`. The correct HTTP method for deletion is `ApiBase.delete('/api/v1/products/${id}')`.

---

### الشرح بالعربي

**ملف `ProductsService.ts`** يُنظِّم جميع عمليات الـ API المتعلقة بالمنتجات في مكان واحد.

**الفرق بين الدوال:**
- `getProducts` تُعيد `response.data` فقط (البيانات الخام).
- `getProductById` تُعيد الاستجابة الكاملة — يجب على المُستدعي الوصول إلى `.data` يدوياً.
- هذا **تناقض** في الكود — في تطبيق احترافي يجب توحيد السلوك.

**خطأ في `deleteProduct`:** تستخدم `post` بدلاً من `delete` — الطريقة الصحيحة هي `ApiBase.delete()`.

---

## Part 4: `api/UsersService.ts` — Users Service

**Path:** `api/UsersService.ts`

### Full Code

```typescript
import ApiBase from "@/api/ApiBase";

export const getCurrentUser = async (filters: any): Promise<Response> => {
    const token = "token";
    const response = await fetch("/api/v1/users", {
        method: "GET",
        body: filters,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return response;
}

export const getCurrentUser2 = async (filters: any) => {
    return await ApiBase.post('/api/v1/users', filters);
}

export const login = async (payload: any) => {
    return await ApiBase.post('/api/v1/login', payload);
}

export const logout = async () => {
    return await ApiBase.get('/api/v1/logout');
}
```

### Analysis

**`getCurrentUser` — Native Fetch API**
```typescript
const response = await fetch("/api/v1/users", {
    method: "GET",
    body: filters,
    headers: { ... }
});
```
This function uses the **native `fetch` API** (built into JavaScript) instead of the custom `ApiBase` (Axios). This demonstrates the contrast between two approaches:
- **`fetch`** — Native, no extra configuration inheritance, requires manual header management per call.
- **`ApiBase` (Axios)** — Custom instance with all interceptors, automatic JSON serialization, timeout, and baseURL applied.

**Bug:** A GET request should never have a `body`. The HTTP specification does not allow bodies in GET requests (they are ignored or rejected by servers). `filters` should be converted to URL query parameters instead.

**`getCurrentUser2` — Axios Version**
```typescript
export const getCurrentUser2 = async (filters: any) => {
    return await ApiBase.post('/api/v1/users', filters);
}
```
This is the Axios equivalent. By using `ApiBase`, the Authorization header is automatically included via the request interceptor — no manual header management needed.

**`login`**
```typescript
export const login = async (payload: any) => {
    return await ApiBase.post('/api/v1/login', payload);
}
```
Standard login endpoint POST request. `payload` typically contains `{ email, password }`. This function is imported in `login.tsx` but not currently called (the `onSubmit` just navigates directly).

**`logout`**
```typescript
export const logout = async () => {
    return await ApiBase.get('/api/v1/logout');
}
```
Calls the logout endpoint. Note: logout is conventionally a POST request (to prevent CSRF attacks and because it has a side effect — invalidating the session). Using GET for logout is not recommended in production.

---

### الشرح بالعربي

**`getCurrentUser` vs `getCurrentUser2`:**
تُقارِن هذا الملف بين طريقتين لإجراء طلبات HTTP:
1. `fetch` الأصلي — يستلزم إدارة الرأس يدوياً في كل طلب.
2. `ApiBase` (Axios) — يرث الإعدادات من النموذج المخصص تلقائياً.

**الأخطاء الموجودة للتعلم منها:**
- `getCurrentUser`: إرسال `body` مع طلب GET — خطأ في بروتوكول HTTP.
- `logout`: استخدام GET بدلاً من POST لعملية لها تأثيرات جانبية.

هذه الأخطاء مُتعمَّدة ظاهراً لتوضيح الفرق بين الطريقتين وتعليم الطلاب ما يجب تجنبه.

---

## Part 5: HTTP Methods Reference | مرجع طرق HTTP

| Method | Usage | Example |
|---|---|---|
| GET | Retrieve data (no body) | `getProducts()`, `getProductById(id)` |
| POST | Create new resource | `addProduct(payload)`, `login(payload)` |
| PUT | Replace entire resource | Update all product fields |
| PATCH | Update partial resource | Update only product price |
| DELETE | Remove resource | Should be used in `deleteProduct` |

---

## Summary | خلاصة

The API layer follows a clear separation of concerns:

1. **`ApiBase.jsx`** — One central Axios instance with `baseURL`, `timeout`, request interceptor (auth token, content type), and response interceptor (error handling).
2. **`ProductsService.ts`** — CRUD operations for products, using `ApiBase`.
3. **`UsersService.ts`** — User authentication operations, demonstrating both `fetch` and Axios approaches.

طبقة الـ API تُطبِّق فصلاً واضحاً للمخاوف:
- `ApiBase.jsx` — إعداد مركزي واحد مع interceptors.
- ملفات الخدمات — عمليات محددة لكل نطاق.
- مكوِّنات الشاشة — تستخدم الخدمات فقط دون القلق بشأن تفاصيل الـ HTTP.
