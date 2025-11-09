import routePath from "../constants/route.constants";
import Dashboard from "../pages/dashboard";
import AccountManagement from "../pages/account-management";
import ReportsPage from "../pages/reports";

const adminRouters = [
  {
    path: routePath.ADMIN,
    children: [
      {
        index: true,
        path: routePath.ADMIN_DASHBOARD,
        Component: Dashboard,
      },
      {
        path: routePath.ADMIN_ACCOUNTS,
        Component: AccountManagement,
      },
      {
        path: routePath.ADMIN_REPORTS,
        Component: ReportsPage,
      },
    ],
  },
];

export default adminRouters;
