import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import RenderComments from "../render-comments/RenderComments";
import style from "./PostPage.module.css";

export default function PostPage() {
  const location = useLocation();
  const post = location.state?.post;
  const [comments, setComments] = useState(null);
  const [visibleStates, setVisibleStates] = useState([]);
  const [newCommentAdded, setNewCommentAdded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/post/${post._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setComments(data.formattedComments);
        setVisibleStates(Array(data.formattedComments.length).fill(true));
      })
      .catch((error) => console.error(error));
  }, [newCommentAdded]);

  const newComment = () => {
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
          mode: "cors",
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
        <textarea type="text" id="comment" name="comment" rows={20} />
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
          {localStorage.getItem("authenticationToken") && newComment()}
          {!localStorage.getItem("authenticationToken") && (
            <Link to="/sign-in" className={style.signInComment}>
              Sign-In to write a comment!
            </Link>
          )}
        </div>

        {!comments && <p>Loading Comments...</p>}

        {comments && (
          <RenderComments
            comments={comments}
            setComments={setComments}
            newCommentAdded={newCommentAdded}
            setNewCommentAdded={setNewCommentAdded}
            visibleStates={visibleStates}
            setVisibleStates={setVisibleStates}
          />
        )}
      </div>
    </>
  );
}
