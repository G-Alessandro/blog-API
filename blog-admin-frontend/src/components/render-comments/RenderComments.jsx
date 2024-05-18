export default function RenderComments({comments, setComments, newCommentAdded, setNewCommentAdded, visibleStates, setVisibleStates }) {
  
  const handleEdit = async (event, commentId) => {
    event.preventDefault();
    const formData = {
      comment: event.target.comment.value,
    };
    const token = localStorage.getItem("authenticationToken");
    try {
      const response = await fetch(
        `http://localhost:3000/author/post/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
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
        `http://localhost:3000/author/post/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  if (!comments || comments.length === 0) {
    return <p>Be the first to comment!!</p>;
  }

  return comments.map((comment, index) => (
    <div key={comment._id}>
      {visibleStates[index] ? (
        <div>
          <p>{comment.username}</p>
          <p>{comment.timestamp}</p>
          <p>{comment.text}</p>
          <div>
            <button onClick={() => handleToggle(index)}>Edit</button>
            <button onClick={(e) => handleDelete(e, comment._id)}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => handleEdit(e, comment._id)}>
          <p>{comment.username}</p>
          <p>{comment.timestamp}</p>
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
          <button type="submit" onClick={() => handleToggle(index)}>
            Edit Done
          </button>
          <button onClick={() => handleToggle(index)}>Cancel</button>
        </form>
      )}
    </div>
  ));
}
