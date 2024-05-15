import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../top-bar/TopBar";
import style from "./HomePage.module.css";

export default function HomePage() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, []);

  function renderPosts(posts) {
    return posts.map((post) => (
      <Link to={`/post/${post._id}`} key={post._id} state={{ post }}>
        <div>
          <h2>{post.title}</h2>
          <p>{post.username}</p>
          <p>{post.timestamp}</p>
        </div>
      </Link>
    ));
  }

  return (
    <div className={style.container}>
      <TopBar />
      <div>{posts && renderPosts(posts)}</div>
    </div>
  );
}
