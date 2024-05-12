import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./PostPage.module.css";

export default function PostPage() {
  const location = useLocation();
  const post = location.state?.post;
  const [comments, setComments] = useState(null);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:3000/post/${post._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error(error));
  }, [newCommentAdded]);

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      return <p>Be the first to comment!!</p>;
    }

    return comments.formattedComments.map((comment) => (
      <div key={comment._id}>
        <p>{comment.username}</p>
        <p>{comment.timestamp}</p>
        <p>{comment.text}</p>
      </div>
    ));
  }

  const addComment = () => {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = {
        comment: event.target.comment.value,
      };

      try {
        const token = localStorage.getItem("authenticationToken");

        const response = await fetch(`http://localhost:3000/post/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Comment send");
          setNewCommentAdded(!newCommentAdded);
        } else {
          console.error("Error adding comment:", data.message);
        }
      } catch (error) {
        console.error("Error requesting:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <textarea type="text" id="comment" name="comment" rows={20} />
        <button type="submit">Add Comment</button>
      </form>
    );
  };

  return (
    <div className={style.container}>
      <TopBar />
      <div>
        <h2>{post.title}</h2>
        <p>{post.username}</p>
        <p>{post.timestamp}</p>
        <p>{post.text}</p>
      </div>
      <div>
        {localStorage.getItem("authenticationToken") ? (
          addComment()
        ) : (
          <Link to="/sign-in">Sign-In to write a comment!</Link>
        )}
      </div>
      <div>{renderComments(comments)}</div>
    </div>
  );
}
