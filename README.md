# 🧩 Angular State Management Playground

This project explores and compares different **state management approaches** in Angular applications.
It demonstrates how various tools and patterns affect bundle size, boilerplate, learning curve, and scalability.

---

## 🌿 Branches Overview

There are **four main branches** in this repository:

| Branch | Description |
|--------|--------------|
| **`main`** | Implements the solution using **custom services**, traditional **RxJS observables**, and manual subscriptions. |
| **`ngrx-store`** | Uses **NgRx Store** and **NgRx Effects** (`@ngrx/store`, `@ngrx/effects`) to manage application state. |
| **`ngrx-signal-store`** | Uses the new **NgRx Signal Store** (`@ngrx/signals`) for a more reactive and lightweight approach. |
| **`ngrx-signal-store-feature`** | A demo branch that shows a convenient use case combining **NgRx Store** and the new **Signal Store Feature** API. |

Each of the first three branches implements:
- A **list page** (fetch entities via GET, filtering, sorting, deleting entities)
- A **detail page** (editing entity data)

---

## ⚙️ Comparison Summary

| Metric | Custom Services | NgRx Store | NgRx Signal Store |
|--------|----------------|-------------|-------------------|
| **Bundle size** | 755.28 kB raw → 153.48 kB gzipped | 1.09 MB raw → 221.53 kB gzipped | 755.29 kB raw → 153.52 kB gzipped |
| **Boilerplate amount** | ⭐️ | ⭐️⭐️⭐️ | ⭐️⭐️ |
| **Ease of adoption** | ⭐️ | ⭐️⭐️⭐️ | ⭐️⭐️ |
| **Scalability** | ⭐️ | ⭐️⭐️ | ⭐️⭐️⭐️ |

---

## 🚀 Running the Project

### Backend
```bash
cd backend
npm install
npm run watch
```

### Frontend
```bash
cd frontend
npm install
ng serve
# or
npm run dev
```
