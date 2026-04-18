# Authentication System Analysis - DentaCare Healthcare App

## Executive Summary
I've identified **5 critical and moderate issues** that could prevent users from logging in or cause authentication failures. The most critical issue is the missing MongoDB environment configuration.

---

## 🔴 CRITICAL ISSUES

### 1. Missing MongoDB Environment Variable
**Severity**: CRITICAL  
**File**: [lib/mongodb.ts](lib/mongodb.ts)  
**Location**: Line 3-5

```typescript
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}
```

**Problem**: 
- No `.env.local` file exists in the project
- Application will crash immediately on startup
- The error will prevent ANY authentication attempts

**Impact**: Login is impossible without this configuration

**Fix Required**:
Create `.env.local` file in project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dentacare?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=development
```

---

### 2. Auth Context Login Not Updating User State
**Severity**: CRITICAL  
**File**: [lib/auth-context.tsx](lib/auth-context.tsx)  
**Location**: Lines 54-56

```typescript
const login = async (email: string, password: string) => {
  const response = await axios.post("/api/auth/login", { email, password });
  setUser(response.data.user);  // ✓ This works, but...
};
```

**Problem**:
- The login function sets user state from API response
- But the response might not include all necessary user data for the app
- No refresh of full user data after login
- Session token is set server-side, but client state might be incomplete

**Better Approach**:
```typescript
const login = async (email: string, password: string) => {
  const response = await axios.post("/api/auth/login", { email, password });
  setUser(response.data.user);
  // Optionally refresh to ensure full data sync
  // await refreshUser();
};
```

---

## 🟠 HIGH PRIORITY ISSUES

### 3. Redundant and Problematic API Call After Login
**Severity**: HIGH  
**File**: [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)  
**Location**: Lines 40-50

```typescript
try {
  await login(formData.email, formData.password);
  toast.success("Đăng nhập thành công!");
  
  // ⚠️ This API call is redundant and can race with state update
  const response = await fetch("/api/auth/me");
  const data = await response.json();
  
  if (data.user) {
    switch (data.user.role) {  // Uses role from API, not from login
      case "admin": router.push("/admin"); break;
      case "doctor": router.push("/doctor"); break;
      default: router.push("/patient");
    }
  }
}
```

**Problems**:
1. The `login()` function already returns user data with role
2. The `useAuth()` context already has `user.role` available
3. Making another API call is wasteful
4. Race condition: What if /api/auth/me fails?
5. Doesn't use the context's user state properly

**Fix**:
```typescript
try {
  const user = await login(formData.email, formData.password);
  // Or better, access from context after login
  const { user } = useAuth(); // Already updated by login()
  
  if (user) {
    const paths = {
      admin: "/admin",
      doctor: "/doctor",
      patient: "/patient"
    };
    router.push(paths[user.role] || "/patient");
  }
}
```

**However, note**: The `login()` function doesn't return the user, so you'd need to either:
- Modify `login()` to return user data, OR
- Use `useAuth()` hook to get updated user state after login

---

### 4. Weak Error Handling in Auth Context
**Severity**: HIGH  
**File**: [lib/auth-context.tsx](lib/auth-context.tsx)  
**Location**: Lines 54-66

```typescript
const login = async (email: string, password: string) => {
  const response = await axios.post("/api/auth/login", { email, password });
  setUser(response.data.user);
};

const register = async (data: RegisterData) => {
  const response = await axios.post("/api/auth/register", data);
  setUser(response.data.user);
};

const logout = async () => {
  await axios.post("/api/auth/logout");
  setUser(null);
};
```

**Problems**:
1. No `try-catch` blocks around axios calls
2. Network errors will be unhandled
3. Axios errors aren't transformed to user-friendly messages
4. If API returns error (401, 400, etc.), exception will crash
5. Example: If login returns 401, axios throws error but it's not caught

**Current Error Handling in Component**:
```typescript
catch (error: unknown) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : "Email hoặc mật khẩu không đúng";
  toast.error(errorMessage);
}
```

This will show generic Axios error strings, not API error messages.

**Fix for Auth Context**:
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    setUser(response.data.user);
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Login failed. Please try again.");
  }
};
```

---

### 5. Missing Axios Credentials Configuration
**Severity**: MEDIUM-HIGH  
**File**: [lib/auth-context.tsx](lib/auth-context.tsx)

**Problem**:
- Axios is called without `withCredentials: true`
- Session cookies might not be sent with requests
- The `auth-token` cookie set server-side might not be included in subsequent requests

**Current Code**:
```typescript
const response = await axios.post("/api/auth/login", { email, password });
// Cookie won't be sent/received without credentials config
```

**Fix**:
```typescript
// Configure axios globally at top of file
import axios from "axios";
axios.defaults.withCredentials = true;

// Or use in specific requests:
const response = await axios.post("/api/auth/login", 
  { email, password },
  { withCredentials: true }
);
```

---

## 🟡 MODERATE ISSUES

### 6. No Protected Route Middleware
**Severity**: MEDIUM  
**File**: No middleware found

**Problem**:
- Users can access `/admin`, `/doctor`, `/patient` pages without authentication
- No route protection at the middleware level
- Only client-side checks via `useAuth()` hook
- Could allow unauthorized access to sensitive pages

**Recommendation**:
Create `middleware.ts` in project root to protect routes before they load.

---

### 7. Session Cookie Security in Development
**Severity**: MEDIUM  
**File**: [lib/auth.ts](lib/auth.ts), Lines 51-59

```typescript
cookieStore.set("auth-token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  // ⚠️ Not secure in dev
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

**Problem**:
- `secure: true` only in production
- In development over HTTP, cookies won't be set properly
- May work on localhost but could fail with domain issues

**Better Approach**:
```typescript
cookieStore.set("auth-token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || 
          process.env.FORCE_SECURE === "true",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

---

## 🟢 Authentication Flow Overview

Here's the expected flow:

```
1. User submits form on /login
   ↓
2. POST /api/auth/login { email, password }
   ├─ Find user in MongoDB
   ├─ Verify password with bcrypt
   ├─ Generate JWT token
   ├─ Set secure http-only cookie
   └─ Return user data
   ↓
3. Auth context updates user state
   ↓
4. Component uses user.role to redirect
   ├─ admin → /admin
   ├─ doctor → /doctor
   └─ patient → /patient
   ↓
5. On subsequent requests, auth token sent in cookie
   ↓
6. /api/auth/me validates token and returns user
```

---

## 🔧 Recommended Fixes (Priority Order)

### Phase 1: CRITICAL (Fix First)
1. ✅ Create `.env.local` with MONGODB_URI
2. ✅ Verify MongoDB connection works
3. ✅ Test basic login flow

### Phase 2: HIGH (Fix Soon)
4. Add `withCredentials: true` to axios
5. Simplify login page to use context's user state for redirect
6. Add try-catch error handling to auth context
7. Extract error message from API response

### Phase 3: MEDIUM (Fix Next)
8. Create middleware.ts for route protection
9. Add proper error handling and user feedback
10. Test complete auth flow end-to-end

### Phase 4: POLISH (Nice to Have)
11. Add loading states for all auth operations
12. Implement remember me / persistent login
13. Add email verification
14. Implement password reset flow

---

## Testing Checklist

- [ ] MongoDB connection successful
- [ ] User can register with valid data
- [ ] User can login with correct credentials
- [ ] Login fails gracefully with wrong password
- [ ] Session persists across page refreshes
- [ ] User redirects to correct dashboard based on role
- [ ] Logout clears session and token
- [ ] Protected routes redirect to login when unauthorized
- [ ] Token expires after 7 days

---

## Files Involved in Authentication

1. **Backend Routes**:
   - [app/api/auth/login/route.ts](app/api/auth/login/route.ts) - Login endpoint
   - [app/api/auth/register/route.ts](app/api/auth/register/route.ts) - Registration endpoint
   - [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts) - Logout endpoint
   - [app/api/auth/me/route.ts](app/api/auth/me/route.ts) - Get current user

2. **Frontend UI**:
   - [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) - Login form
   - [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx) - Registration form

3. **Core Logic**:
   - [lib/auth-context.tsx](lib/auth-context.tsx) - React context for auth state
   - [lib/auth.ts](lib/auth.ts) - Auth utilities (JWT, password hashing)
   - [lib/mongodb.ts](lib/mongodb.ts) - MongoDB connection

---

## Summary

The authentication system has a solid structure but is missing critical configuration and has several implementation issues that could cause login failures. The most important fix is setting up the `.env.local` file with MongoDB credentials. After that, the axios configuration and error handling improvements should be prioritized.
