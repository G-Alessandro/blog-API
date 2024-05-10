import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import style from "./TopBar.module.css";

export default function TopBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authenticationToken");
    navigate("/");
  };

  const authenticated = () => {
    return (
      <>
        <Link to="/">Home</Link>
        <button onClick={logout}>Log Out</button>
      </>
    );
  };

  const notAuthenticated = () => {
    return (
      <>
        <Link to="/">Home</Link>
        <Link to="/sign-up">Sign-Up</Link>
        <Link to="/sign-in">Sign-In</Link>
      </>
    );
  };

  return (
    <div className={style.container}>
      <nav className={style.nav}>
        {localStorage.getItem("authenticationToken")
          ? authenticated()
          : notAuthenticated()}
      </nav>
    </div>
  );
}
