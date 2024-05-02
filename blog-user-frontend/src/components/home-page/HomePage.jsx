import TopBar from "../top-bar/TopBar";
import style from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={style.container}>
      <TopBar />
    </div>
  );
}
