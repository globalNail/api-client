# Quick Start Guide - News Management System

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd client
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the `client` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Run the Application
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📋 What's Been Implemented

### ✅ Admin Features (Role ID: 1)
- **Account Management** - Full CRUD with conditional delete
- **Reports** - Statistics by date range, sorted descending

### ✅ Staff Features (Role ID: 2)  
- **Category Management** - Full CRUD with conditional delete
- **News Article Management** - Full CRUD with tags
- **Profile Management** - Edit personal info
- **News History** - View own articles

### ✅ All Management Pages Include:
- ✓ Create operations via popup dialog
- ✓ Update operations via popup dialog  
- ✓ Delete with confirmation dialog
- ✓ Search functionality
- ✓ Responsive tables
- ✓ Loading states
- ✓ Error handling

---

## 🔑 Test Users (Configure in Backend)

**Admin Account**:
- Email: `admin@example.com`
- Password: `Admin123!`
- Role: 1 (Admin)

**Staff Account**:
- Email: `staff@example.com`
- Password: `Staff123!`
- Role: 2 (Staff)

---

## 📁 Key Files Created

### Pages
- `src/pages/login.tsx` - Authentication
- `src/pages/dashboard.tsx` - Role-based dashboard
- `src/pages/account-management.tsx` - Admin: Accounts
- `src/pages/reports.tsx` - Admin: Statistics
- `src/pages/category-management.tsx` - Staff: Categories
- `src/pages/news-article-management.tsx` - Staff: Articles
- `src/pages/news-history.tsx` - Staff: History
- `src/pages/profile.tsx` - Staff: Profile

### Services (API Integration)
- `src/services/auth.service.ts`
- `src/services/account.service.ts`
- `src/services/category.service.ts`
- `src/services/news-article.service.ts`
- `src/services/tag.service.ts`

### Configuration
- `src/config/axios.ts` - HTTP client
- `src/constants/role.constants.ts` - Role definitions
- `src/constants/route.constants.ts` - Route paths

### Routes
- `src/routes/admin.routes.ts` - Admin routes
- `src/routes/staffs.routes.ts` - Staff routes
- `src/routes/index.ts` - Main router

---

## 🎯 Required Backend API Endpoints

Your .NET backend needs to implement these endpoints:

### Authentication
```
POST /api/auth/login
Body: { email, password }
Response: { token, accountId, accountname, accountEmail, accountRole }
```

### Accounts (Admin)
```
GET    /api/accounts
GET    /api/accounts/:id
POST   /api/accounts
PUT    /api/accounts/:id
DELETE /api/accounts/:id
GET    /api/accounts/search?q=
GET    /api/accounts/:id/can-delete  // Returns boolean
```

### Categories (Staff)
```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
GET    /api/categories/search?q=
GET    /api/categories/:id/can-delete  // Returns boolean
```

### News Articles (Staff)
```
GET    /api/news-articles
GET    /api/news-articles/:id
GET    /api/news-articles/creator/:id
POST   /api/news-articles
PUT    /api/news-articles/:id
DELETE /api/news-articles/:id
GET    /api/news-articles/search?q=
GET    /api/news-articles/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### Tags
```
GET    /api/tags
POST   /api/tags
PUT    /api/tags/:id
DELETE /api/tags/:id
```

---

## 🔒 Conditional Delete Logic

### Accounts
- **Rule**: Cannot delete if account has created any news articles
- **Backend**: Check `NewsArticles.Count > 0` for the account
- **Response**: Return 400 with error message if validation fails

### Categories
- **Rule**: Cannot delete if category is used by any news articles
- **Backend**: Check if any `NewsArticle.CategoryId` references this category
- **Response**: Return 400 with error message if validation fails

---

## 🛠️ Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Lint
npm run lint
```

---

## 📦 Dependencies Installed

Core:
- `react` & `react-dom` (v19)
- `react-router` (v7)
- `typescript` (v5.9)

UI:
- `@heroui/*` packages (button, input, modal, table, etc.)
- `tailwindcss` (v4)

Utils:
- `axios` - HTTP client
- `zustand` - State management (available)
- `react-hook-form` - Form handling (available)
- `zod` - Validation (available)

---

## ✨ Features Highlights

### 1. Popup Dialogs ✅
All Create/Update operations use modal dialogs as required.

### 2. Delete Confirmations ✅
All delete operations require confirmation with clear warnings.

### 3. Conditional Delete ✅
- Accounts: Blocked if they created articles
- Categories: Blocked if used by articles
- Clear error messages shown to users

### 4. Search ✅
Available on all management pages with instant feedback.

### 5. Role-Based Access ✅
- Admin sees: Accounts, Reports
- Staff sees: Categories, News, History, Profile
- Automatic redirection based on role

### 6. Reports ✅
- Date range filter
- Sorted in descending order by created date
- Multiple views (total, by category, by staff)

---

## 🎨 UI/UX Features

- Clean, modern design
- Responsive layout (mobile-friendly)
- Loading indicators
- Error messages
- Empty states
- Color-coded cards
- Hover effects
- Smooth transitions

---

## 📝 Next Steps

1. **Backend Implementation**:
   - Implement all required API endpoints
   - Add JWT authentication
   - Implement conditional delete logic
   - Add CORS configuration

2. **Testing**:
   - Create test users (Admin & Staff)
   - Test all CRUD operations
   - Test conditional delete
   - Test reports generation

3. **Deployment**:
   - Build: `npm run build`
   - Deploy `dist` folder
   - Configure API URL for production

---

## 🆘 Troubleshooting

**Port Already in Use**:
```bash
# Change port in vite.config.ts or kill process on 5173
```

**API Connection Error**:
```bash
# Check .env file has correct VITE_API_BASE_URL
# Ensure backend is running
# Check CORS settings in backend
```

**TypeScript Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- Full details: `CLIENT_README.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`
- This file: Quick reference

---

**Status**: ✅ Frontend Complete & Ready for Backend Integration!

**Last Updated**: November 9, 2025
