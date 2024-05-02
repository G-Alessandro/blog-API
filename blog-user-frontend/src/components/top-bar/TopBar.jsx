import { Link } from "react-router-dom";
import style from "./TopBar.module.css";

export default function TopBar () {
  return (
    <div className={style.container}>
      <nav className={style.nav}>
        <Link to="/">Home</Link>
        <Link to="/sign-up">Sign-Up</Link>
        <Link to="/sign-in">Sign-In</Link>
      </nav>
    </div>
  )
}
