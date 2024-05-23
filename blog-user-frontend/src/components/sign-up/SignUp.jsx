import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./SignUp.module.css";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    try {
      const response = await fetch("https://blog-api-the-odin-project.fly.dev/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/sign-in");
      } else {
        console.error("Error during registration:", data.message);
      }
    } catch (error) {
      console.error("Error requesting registration:", error);
    }
  };

  return (
    <>
      <TopBar />
      <div className={style.signUpFormContainer}>
        <form onSubmit={handleSubmit} className={style.signUpForm}>
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
    </>
  );
}
