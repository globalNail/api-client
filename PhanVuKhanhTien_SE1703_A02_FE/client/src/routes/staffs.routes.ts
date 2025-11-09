import routePath from "../constants/route.constants";
import Dashboard from "../pages/dashboard";
import CategoryManagement from "../pages/category-management";
import NewsArticleManagement from "../pages/news-article-management";
import NewsHistory from "../pages/news-history";
import Profile from "../pages/profile";

const staffRouters = [
  {
    path: routePath.STAFF,
    children: [
      {
        index: true,
        path: routePath.STAFF_DASHBOARD,
        Component: Dashboard,
      },
      {
        path: routePath.STAFF_CATEGORIES,
        Component: CategoryManagement,
      },
      {
        path: routePath.STAFF_NEWS,
        Component: NewsArticleManagement,
      },
      {
        path: routePath.STAFF_NEWS_HISTORY,
        Component: NewsHistory,
      },
      {
        path: routePath.STAFF_PROFILE,
        Component: Profile,
      },
    ],
  },
];

export default staffRouters;
