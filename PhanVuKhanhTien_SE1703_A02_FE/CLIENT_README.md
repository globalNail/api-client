# News Management System - Frontend

A comprehensive web application for managing news articles, categories, and user accounts with role-based access control.

## Features Implemented

### Admin Role Features
- **Account Management (CRUD)**
  - Create, Read, Update, Delete user accounts
  - Search accounts by name or email
  - Conditional delete: Accounts that have created news articles cannot be deleted
  - Role assignment (Admin/Staff)
  - Form-based operations with popup dialogs
  - Delete confirmation dialogs

- **Reports & Statistics**
  - Generate reports by date range (StartDate to EndDate)
  - View statistics based on news article creation dates
  - Data sorted in descending order by date
  - Breakdown by category and author
  - Visual tables for easy data analysis

### Staff Role Features
- **Category Management (CRUD)**
  - Create, Read, Update, Delete categories
  - Search categories
  - Conditional delete: Categories used by news articles cannot be deleted
  - Active/Inactive status management
  - Form-based operations with popup dialogs
  - Delete confirmation dialogs

- **News Article Management (CRUD)**
  - Create, Read, Update, Delete news articles
  - Search articles
  - Tag management (select multiple tags per article)
  - Category assignment
  - Rich content input (title, headline, content, source)
  - Status management (Active/Inactive)
  - Form-based operations with popup dialogs
  - Delete confirmation dialogs

- **Profile Management**
  - View personal profile information
  - Edit name, email, and password
  - Self-service profile updates

- **News History**
  - View all news articles created by the logged-in staff member
  - Display creation and modification dates
  - Filter to show only own articles

### Common Features
- **Authentication**
  - Secure login system
  - JWT token-based authentication
  - Role-based access control
  - Automatic token refresh
  - Logout functionality

- **User Experience**
  - Responsive design
  - Popup dialogs for Create/Update operations
  - Confirmation dialogs for Delete operations
  - Search functionality across all management pages
  - Loading states and error handling
  - Clean, modern UI using HeroUI components

## Project Structure

```
client/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── confirm-dialog.tsx
│   │   ├── protected-route.tsx
│   │   └── ...
│   ├── config/              # Configuration files
│   │   ├── axios.ts         # Axios instance with interceptors
│   │   └── site.ts
│   ├── constants/           # Application constants
│   │   ├── role.constants.ts
│   │   └── route.constants.ts
│   ├── pages/               # Page components
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   ├── account-management.tsx    # Admin only
│   │   ├── reports.tsx               # Admin only
│   │   ├── category-management.tsx   # Staff only
│   │   ├── news-article-management.tsx  # Staff only
│   │   ├── news-history.tsx          # Staff only
│   │   └── profile.tsx               # Staff only
│   ├── routes/              # Route configurations
│   │   ├── admin.routes.ts
│   │   ├── staffs.routes.ts
│   │   └── index.ts
│   ├── services/            # API service layer
│   │   ├── auth.service.ts
│   │   ├── account.service.ts
│   │   ├── category.service.ts
│   │   ├── news-article.service.ts
│   │   └── tag.service.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
├── .env                     # Environment variables
└── package.json
```

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router 7** - Routing
- **Axios** - HTTP client
- **HeroUI** - UI component library
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login

### Accounts (Admin only)
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `GET /api/accounts/search?q=` - Search accounts
- `GET /api/accounts/:id/can-delete` - Check if account can be deleted

### Categories (Staff only)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `GET /api/categories/search?q=` - Search categories
- `GET /api/categories/:id/can-delete` - Check if category can be deleted

### News Articles (Staff only)
- `GET /api/news-articles` - Get all news articles
- `GET /api/news-articles/:id` - Get article by ID
- `GET /api/news-articles/creator/:id` - Get articles by creator
- `POST /api/news-articles` - Create article
- `PUT /api/news-articles/:id` - Update article
- `DELETE /api/news-articles/:id` - Delete article
- `GET /api/news-articles/search?q=` - Search articles
- `GET /api/news-articles/report?startDate=&endDate=` - Get report data

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## User Roles

### Admin (Role ID: 1)
- Full access to account management
- Access to reports and statistics
- Cannot manage categories or news articles directly

### Staff (Role ID: 2)
- Manage categories
- Manage news articles with tags
- View own news history
- Manage own profile
- Cannot manage user accounts

## Key Implementation Details

### Conditional Delete Logic

**Accounts**: 
- Backend checks if account has created any news articles
- If yes, deletion is blocked with error message
- Frontend displays appropriate error to user

**Categories**:
- Backend checks if category is used by any news articles
- If yes, deletion is blocked with error message
- Frontend displays appropriate error to user

### Form Dialogs
- All Create/Update operations use modal dialogs
- Forms include validation
- Loading states during submission
- Error handling with user feedback

### Delete Confirmations
- All delete operations require confirmation
- Shows item details in confirmation dialog
- Displays warnings about conditional delete rules
- Handles errors gracefully

### Search Functionality
- Real-time search across all management pages
- Search by relevant fields (name, email, title, etc.)
- Clear button to reset search

### Reports
- Date range selection with date pickers
- Automatic data sorting (descending by date)
- Multiple report views (by category, by author, detailed list)
- Empty state handling

## Security

- JWT token stored in localStorage
- Automatic token inclusion in API requests via interceptors
- Auto-redirect to login on 401 responses
- Role-based route protection
- Logout clears all stored credentials

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Define types in `src/types/index.ts`
2. Create service in `src/services/`
3. Create page component in `src/pages/`
4. Add route in appropriate routes file
5. Update navigation/dashboard as needed

## Notes

- All dates are formatted using browser locale
- Tables support empty states and loading indicators
- Error messages are user-friendly
- UI is responsive and works on mobile devices
- Forms validate required fields
- Password fields are optional on update (keeps existing if empty)

## Future Enhancements

- Advanced filtering and sorting
- Bulk operations
- Export reports to PDF/Excel
- Image upload for news articles
- Rich text editor for content
- Email notifications
- Activity logging
- Advanced search with multiple criteria
- Pagination for large datasets
