import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

export default function NewPost() {
  const editorRef = useRef(null);
  const [tinyMceApiKey, setTinyMceApiKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/author/new-post", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setTinyMceApiKey(data.tinyMceApiKey))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const formData = {
        title: event.target.title.value,
        content: content,
      };

      try {
        const token = localStorage.getItem("authenticationToken");
        const response = await fetch("http://localhost:3000/author/new-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          navigate("/author-dashboard");
        } else {
          console.error("Error adding post:", data.message);
        }
      } catch (error) {
        console.error("Error requesting:", error);
      }
    }
  };

  return (
    <>
      {tinyMceApiKey === null && <h1>Loading.....</h1>}
      {tinyMceApiKey && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input type="text" name="title" id="title" required />
          <Editor
            apiKey={tinyMceApiKey}
            onInit={(_evt, editor) => editorRef.current = editor}
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant")
                ),
            }}
            initialValue=""
          />
          <button type="submit">Done</button>
        </form>
      )}
    </>
  );
}
