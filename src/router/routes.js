import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../Login";
import Home from "../Home";
 
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "*", element: <Home /> },
    ],
  },
]);