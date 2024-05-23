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
    fetch(`https://blog-api-the-odin-project.fly.dev/${post._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error(error));
  }, [newCommentAdded]);

  function renderComments(comments) {

    return comments.formattedComments.map((comment) => (
      <div key={comment._id} className={style.comment}>
        <div>
          <p className={style.authorName}>{comment.username}</p>
          <p>{comment.timestamp}</p>
        </div>
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
        const response = await fetch(`https://blog-api-the-odin-project.fly.dev/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setNewCommentAdded(!newCommentAdded);
        } else {
          console.error("Error adding comment:", data.message);
        }
      } catch (error) {
        console.error("Error requesting:", error);
      }
    };
    return (
      <form onSubmit={handleSubmit} className={style.commentForm}>
        <textarea type="text" id="comment" name="comment"/>
        <button type="submit">Add Comment</button>
      </form>
    );
  };

  return (
    <>
      <TopBar />
      <div className={style.postPageContainer}>
        <div className={style.post}>
          <h2>{post.title}</h2>
          <div>
            <p>By:</p>
            <p className={style.authorName}>{post.username}</p>
            <p>{post.timestamp}</p>
          </div>
          <p>{post.text}</p>
        </div>
        <div className={style.signInAddCommentContainer}>
          {localStorage.getItem("authenticationToken") ? (
            addComment()
          ) : (
            <Link to="/sign-in" className={style.signInComment}>
              Sign-In to write a comment!
            </Link>
          )}
        </div>
        <div className={style.commentsContainer}>
          {comments.formattedComments.length === 0 && <p>Be the first to comment!</p>}
          {!comments && <p>Loading comments...</p>}
          {comments && renderComments(comments)}
        </div>
      </div>
    </>
  );
}
