import { useNavigate } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./SignIn.module.css";

export default function SignIn() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    try {
      const response = await fetch("https://blog-api-the-odin-project.fly.dev/author/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("authenticationToken", token);
        navigate("/");
      } else {
        console.error("Error during authentication:", data.message);
      }
    } catch (error) {
      console.error("Error requesting authentication:", error);
    }
  };

  return (
    <>
      <TopBar />
      <div className={style.signInFormContainer}>
        <form onSubmit={handleSubmit} className={style.signInForm}>
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
    </>
  );
}
