import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./PostPage.module.css";

export default function HomePage() {
  const location = useLocation();
  const post = location.state?.post;
  const [comments, setComments] = useState(null);
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
  }, []);
  console.log(comments);
  console.log(typeof comments);

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      return <p>No comments available</p>;
    }

    return comments.formattedComments.map((comment) => (
      <div key={comment._id}>
        <p>{comment.username}</p>
        <p>{comment.timestamp}</p>
        <p>{comment.text}</p>
      </div>
    ));
  }

  return (
    <div className={style.container}>
      <TopBar />
      <div>
        <h2>{post.title}</h2>
        <p>{post.username}</p>
        <p>{post.timestamp}</p>
        <p>{post.text}</p>
      </div>
      <div>{renderComments(comments)}</div>
    </div>
  );
}
