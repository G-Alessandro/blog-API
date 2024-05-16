import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/home-page/HomePage";
import AuthorDashboard from "./components/author-dashboard/AuthorDashboard";
import SignIn from "./components/sign-in/SignIn";
import PostPage from "./components/post-page/PostPage";
import NewPost from "./components/new-post/NewPost";

const Router = () => {

  const router = createBrowserRouter ([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/author-dashboard",
      element: <AuthorDashboard />,
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/post/:id",
      element: <PostPage />,
    },
    {
      path: "/new-post",
      element: <NewPost />,
    },
  ]);

  return <RouterProvider router={router} />;

};

export default Router;
