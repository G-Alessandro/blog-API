import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      title: event.target.title.value,
      content: event.target.content.value,
    };

    try {
      const token = localStorage.getItem("authenticationToken");
      const response = await fetch(
        `http://localhost:3000/author/new-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate("/author-dashboard");
      } else {
        console.error("Error adding comment:", data.message);
      }
    } catch (error) {
      console.error("Error requesting:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" name="title" id="title" />
      <label htmlFor="content"></label>
      <textarea name="content" id="content"></textarea>
      <button type="submit">Done</button>
    </form>
  );
}
