import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import TruckOwners from "./pages/TruckOwners";
import Drivers from "./pages/Drivers";
import Jobs from "./pages/Jobs";
import Fares from "./pages/Fares";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: Users },
      { path: "truck-owners", Component: TruckOwners },
      { path: "drivers", Component: Drivers },
      { path: "jobs", Component: Jobs },
      { path: "fares", Component: Fares },
      { path: "bookings", Component: Bookings },
      { path: "payments", Component: Payments },
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
