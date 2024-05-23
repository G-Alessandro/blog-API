import style from "./RenderComments.module.css";

export default function RenderComments({
  comments,
  setComments,
  newCommentAdded,
  setNewCommentAdded,
  visibleStates,
  setVisibleStates,
}) {
  const handleEdit = async (event, commentId) => {
    event.preventDefault();
    const formData = {
      comment: event.target.comment.value,
    };
    const token = localStorage.getItem("authenticationToken");
    try {
      const response = await fetch(
        `https://blog-api-the-odin-project.fly.dev/author/post/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
          mode: "cors",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNewCommentAdded(!newCommentAdded);
      } else {
        console.log("Error editing comment:", data.message);
      }
    } catch (error) {
      console.error("Error requesting:", error);
    }
  };

  const handleDelete = async (event, commentId) => {
    event.preventDefault();
    const token = localStorage.getItem("authenticationToken");
    try {
      const response = await fetch(
        `https://blog-api-the-odin-project.fly.dev/author/post/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNewCommentAdded(!newCommentAdded);
      } else {
        console.log("Error deleting comment:", data.message);
      }
    } catch (error) {
      console.error("Error requesting:", error);
    }
  };

  const handleToggle = (index) => {
    setVisibleStates((prev) =>
      prev.map((state, i) => (i === index ? state = false : state = true))
    );
  };

  if (!comments || comments.length === 0) {
    return <p>Be the first to comment!!</p>;
  }

  return comments.map((comment, index) => (
    <div key={comment._id} className={style.commentsContainer}>
      {visibleStates[index] ? (
        <div className={style.comment}>
          <div className={style.authorNameTimeContainer}>
            <p className={style.authorName}>{comment.username}</p>
            <p>{comment.timestamp}</p>
          </div>
          <p>{comment.text}</p>
          <div className={style.buttonContainer}>
            <button
              onClick={() => handleToggle(index)}
              className={style.editButton}
            >
              Edit
            </button>
            <button
              onClick={(e) => handleDelete(e, comment._id)}
              className={style.deleteButton}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => handleEdit(e, comment._id)}
          className={style.comment}
        >
          <div className={style.authorNameTimeContainer}>
            <p className={style.authorName}>{comment.username}</p>
            <p>{comment.timestamp}</p>
          </div>
          <textarea
            name="comment"
            id="comment"
            value={comment.text}
            onChange={(e) => {
              const newComments = [...comments];
              newComments[index].text = e.target.value;
              setComments(newComments);
            }}
          />
          {localStorage.getItem("authenticationToken") && <div className={style.buttonContainer}>
            <button type="submit" onClick={() => handleToggle(index)} className={style.editButton}>
              Edit Done
            </button>
            <button onClick={() => handleToggle(index)} className={style.cancelButton}>Cancel</button>
          </div>}
        </form>
      )}
    </div>
  ));
}
