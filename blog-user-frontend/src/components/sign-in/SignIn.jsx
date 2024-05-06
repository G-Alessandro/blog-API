import TopBar from "../top-bar/TopBar";
import style from "./SignIn.module.css";

export default function SignIn () {
  return (
    <div className={style.container}>
      <TopBar />
      <form action="http://localhost:3000/sign-in" method="post">
        
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          minLength={1}
          maxLength={30}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={8}
          maxLength={16}
          required
        />

        <button type="submit">Done</button>

      </form>
    </div>
  );

}