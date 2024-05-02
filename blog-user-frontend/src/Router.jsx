import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/home-page/HomePage";
// import SignUp from "./components/sign-up/SignUp";
// import SignIn from "./components/sign-in/SignIn";
// import PostPage from "./components/post-page/PostPage";


const Router = () => {
  
  const router = createBrowserRouter ( [
    {
      path: "/",
      element: < HomePage/>,
    },
    // {
    //   path: "/sign-up",
    //   element: < SignUp/>,
    // },
    // {
    //   path: "/sign-in",
    //   element: < SignIn/>,
    // },
    // {
    //   path: "/post/:id",
    //   element: < PostPage/>,
    // },
  ]);

  return <RouterProvider router={router} />

};

export default Router;