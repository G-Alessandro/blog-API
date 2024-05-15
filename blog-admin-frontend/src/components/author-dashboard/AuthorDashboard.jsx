import { useEffect, useState } from "react";
import TopBar from "../top-bar/TopBar";
import { Link } from "react-router-dom";
import style from "./AuthorDashboard.module.css";

export default function AuthorDashboard() {
  const [posts, setPosts] = useState(null);
  const [publicationChanged, setPublicationChanged] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/author/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, [publicationChanged]);

  const handlePublicationChange = async (post) => {
    const token = localStorage.getItem("authenticationToken");
    try {
      const response = await fetch(`http://localhost:3000/author/dashboard/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      const data = await response.json();
      if (response.ok) {
        setPublicationChanged(!publicationChanged);
      } else {
        console.log("Error adding comment:", data.message);
      }
    } catch (error) {
      console.error("Error requesting:", error);
    }
  };

  return (
    <div>
      <TopBar />
      <div>
        {posts &&
          posts.map((post) => (
            <div key={post._id}>
              <Link to={`/post/${post._id}`} state={{ post }}>
                <div>
                  <h2>{post.title}</h2>
                  <p>{post.username}</p>
                  <p>{post.timestamp}</p>
                </div>
              </Link>
              <button onClick={() => handlePublicationChange(post)}>
                {post.isPublished ? "Unpublished" : "Public"}
              </button>
            </div>
          ))}
        {posts && posts.length === 0 && <p>No posts written</p>}
      </div>
    </div>
  );
}
