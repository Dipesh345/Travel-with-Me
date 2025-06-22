import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem("access_token");

  // Fetch current logged-in user's ID from /auth/profile/
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUserId(res.data.id))
        .catch(() => setCurrentUserId(null));
    }
  }, [token]);

  // Fetch blog by slug
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/blogs/${slug}/`);
        setBlog(response.data);
        setLikesCount(response.data.likes_count);
        setLiked(response.data.is_liked);
      } catch (err) {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Fetch comments for the blog
  useEffect(() => {
    if (blog) {
      axios
        .get(`http://localhost:8000/api/blogs/${blog.id}/comments/`)
        .then((res) => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [blog]);

  const handleLike = async () => {
    if (!token) return toast.warning("Login to like this blog.");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/blogs/${blog.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(response.data.liked);
      setLikesCount(response.data.likes_count);
    } catch {
      toast.error("Failed to toggle like.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.warning("Login to comment.");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/blogs/${blog.id}/comments/`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to submit comment");
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/blogs/comments/${commentId}/`,
        { text: editedCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? response.data : comment))
      );
      setEditingCommentId(null);
      toast.success("Comment updated.");
    } catch {
      toast.error("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/blogs/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  if (loading)
    return <div className="text-center py-5 display-6 text-secondary">Loading blog...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!blog) return <div className="alert alert-warning text-center">Blog not found.</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      <div className="container py-5">
        <div className="card shadow-lg border-0 p-4 mb-5">
          <h1 className="display-4 fw-bold">{blog.title}</h1>

          <div className="d-flex align-items-center mb-4 gap-3">
            {blog.author?.profile_image && (
              <img
                src={blog.author.profile_image}
                alt={blog.author.username}
                className="rounded-circle border"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
            )}
            <div>
              <h5 className="mb-0 text-primary">{blog.author?.username}</h5>
              {blog.category && (
                <Link
                  to={`/blog?category=${blog.category.id}`}
                  className="badge bg-secondary text-decoration-none"
                >
                  {blog.category.name}
                </Link>
              )}
            </div>
          </div>

          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="img-fluid rounded shadow-sm mb-4"
            />
          )}

          <div
            className="mb-4 fs-5 lh-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && (
            <div className="mb-3">
              <strong>Tags: </strong>
              {blog.tags.split(",").map((tag, index) => (
                <span key={index} className="badge bg-light text-dark me-2">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="d-flex gap-4 fs-5 mt-4 align-items-center">
            <button
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={handleLike}
            >
              {liked ? "💖 Liked" : "🤍 Like"}{" "}
              <span className={`transition-opacity ${liked ? "text-danger" : ""}`}>
                ({likesCount})
              </span>
            </button>
            <span className="text-muted">👁️ {blog.views} views</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body">
            <h4 className="card-title mb-4">💬 Comments ({comments.length})</h4>

            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button className="btn btn-primary">Post Comment</button>
            </form>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-3 border rounded">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      {comment.author?.profile_image && (
                        <img
                          src={comment.author.profile_image}
                          alt={comment.author.username}
                          className="rounded-circle me-3"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                      )}
                      <strong>{comment.author?.username}</strong>
                    </div>

                    {currentUserId === comment.author?.id && (
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedCommentText(comment.text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                      />
                      <div>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{comment.text}</p>
                      <small className="text-muted">
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
