import { createBrowserRouter } from "react-router";
import adminRouters from "./admin.routes";
import staffRouters from "./staffs.routes";
import Home from "../pages/home";
import Login from "../pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  ...adminRouters,
  ...staffRouters,
]);

export default router;
