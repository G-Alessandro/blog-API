import TopBar from "../top-bar/TopBar";
import style from "./SignUp.module.css";

export default function SignUp() {
  return (
    <div className={style.container}>
      <TopBar />
      <form action="http://localhost:3000/sign-up" method="post">
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

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          minLength={8}
          maxLength={16}
          required
        />

        <button type="submit">Done</button>

      </form>
    </div>
  );
}
