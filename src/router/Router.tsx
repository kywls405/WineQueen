import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Splash from "../pages/Splash";

const router = createBrowserRouter([
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/",
    element: <Splash />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
