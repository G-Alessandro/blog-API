import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import style from "./TopBar.module.css";

export default function TopBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authenticationToken");
    navigate("/");
  };

  return (
    <nav className={style.nav}>
      <Link to="/" className={style.blogName}>
        Blog Author Frontend
      </Link>

      <Link to="/">Home</Link>

      {localStorage.getItem("authenticationToken") && (
        <>
          <Link to="/author-dashboard">Dashboard</Link>
          <Link to="/new-post">+ New Post</Link>
          <button onClick={logout} className={style.logout}>
            Log Out
          </button>
        </>
      )}

      {!localStorage.getItem("authenticationToken") && (
        <>
          <Link to="/sign-in">Sign-In</Link>
        </>
      )}
    </nav>
  );
}
