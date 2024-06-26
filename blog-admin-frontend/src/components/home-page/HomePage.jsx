import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./HomePage.module.css";

export default function HomePage() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    fetch("https://blog-api-the-odin-project.fly.dev/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, []);

  function renderPosts(posts) {
    return posts.map((post) => (
      <Link
        to={`/post/${post._id}`}
        key={post._id}
        state={{ post }}
        className={style.post}
      >
        <h2>{post.title}</h2>
        <div>
          <p>By</p>
          <p className={style.author}>{post.username}</p>
          <p>{post.timestamp}</p>
        </div>
      </Link>
    ));
  }

  return (
    <>
      <TopBar />
      <div className={style.postContainerContainer}>
        <div className={style.postsContainer}>{posts && renderPosts(posts)}</div>
      </div>
    </>
  );
}
