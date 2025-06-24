import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem("access_token");

  // Fetch current user ID
  useEffect(() => {
    if (!token) {
      setCurrentUserId(null);
      return;
    }
    axios
      .get("http://localhost:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUserId(res.data.id))
      .catch(() => setCurrentUserId(null));
  }, [token]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`http://localhost:8000/api/blogs/${slug}/`, { headers });
        setBlog(response.data);
        setLikesCount(response.data.likes_count);
        setLiked(response.data.is_liked);
        setError(null);
      } catch {
        setError("Failed to load blog");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if ((token && currentUserId !== null) || !token) {
      fetchBlog();
    }
  }, [slug, token, currentUserId]);

  // Fetch comments with pagination
  // We'll extract top-level comments only (parent = null)
  const fetchComments = async (page = 1) => {
    if (!blog) return;

    try {
      const res = await axios.get(
        `http://localhost:8000/api/blogs/${blog.id}/comments/?page=${page}`
      );

      // Filter top-level comments (parent === null)
      const topLevelComments = (res.data.results || []).filter(
        (comment) => comment.parent === null || comment.parent === undefined
      );

      setComments(topLevelComments);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setTotalCount(res.data.count);
      setTotalPages(Math.ceil(res.data.count / 5));
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [blog, currentPage]);

  // Blog like toggle
  const handleLike = async () => {
    if (!token) {
      toast.warning("Login to like this blog.");
      return;
    }
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

  // Submit new top-level comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warning("Login to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:8000/api/blogs/${blog.id}/comments/`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setCurrentPage(1);
      await fetchComments(1); // immediately fetch new comments after posting
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to submit comment");
    }
  };

  // Edit comment or reply
  const handleEditComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    if (!token) {
      toast.warning("Login to edit comment.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/blogs/comments/${commentId}/`,
        { text: editedCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update comment or nested reply locally
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) return response.data;
          if (comment.replies && comment.replies.length) {
            return {
              ...comment,
              replies: comment.replies.map((r) => (r.id === commentId ? response.data : r)),
            };
          }
          return comment;
        })
      );
      setEditingCommentId(null);
      toast.success("Comment updated.");
    } catch {
      toast.error("Failed to update comment.");
    }
  };

  // Delete comment or reply
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    if (!token) {
      toast.warning("Login required.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/blogs/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPage(1);
      await fetchComments(1); // refresh comments immediately after delete
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  // Toggle like on comment or reply
  const handleCommentLike = async (commentId) => {
    if (!token) {
      toast.warning("Login to like comments.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/blogs/comments/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, is_liked: res.data.liked, likes_count: res.data.likes_count };
          }
          if (comment.replies && comment.replies.length) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, is_liked: res.data.liked, likes_count: res.data.likes_count }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    } catch {
      toast.error("Failed to like comment.");
    }
  };

  // Submit reply to a comment
  const handleReplySubmit = async (parentId) => {
    const text = replyText[parentId];
    if (!text || !text.trim()) return;
    if (!token) {
      toast.warning("Login to reply.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/blogs/${blog.id}/comments/`,
        { text, parent: parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
      setShowReplyBox((prev) => ({ ...prev, [parentId]: false }));
      setCurrentPage(1);
      await fetchComments(1); // refresh comments after reply
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to post reply.");
    }
  };

  // Recursive render function for comments and nested replies
  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`p-3 border rounded ${isReply ? "ms-5 bg-light" : "mb-4"} comment-card`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center gap-2">
          {comment.author?.profile_image && (
            <img
              src={comment.author.profile_image}
              alt={comment.author.username}
              className="rounded-circle"
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
              disabled={!editedCommentText.trim()}
            >
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => setEditingCommentId(null)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{comment.text}</p>
          <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
          <div className="d-flex gap-3 mt-2">
            <button
              className={`btn btn-sm ${comment.is_liked ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => handleCommentLike(comment.id)}
            >
              ❤️ {comment.likes_count}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() =>
                setShowReplyBox((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))
              }
            >
              Reply
            </button>
          </div>

          {showReplyBox[comment.id] && (
            <div className="mt-2">
              <textarea
                className="form-control mb-2"
                rows="2"
                placeholder="Write a reply..."
                value={replyText[comment.id] || ""}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleReplySubmit(comment.id)}
                disabled={!replyText[comment.id] || !replyText[comment.id].trim()}
              >
                Post Reply
              </button>
            </div>
          )}

          {comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((reply) => renderComment(reply, true))}
        </>
      )}
    </div>
  );

  if (loading) {
    return <div className="text-center py-5 display-6 text-secondary">Loading blog...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!blog) {
    return <div className="alert alert-warning text-center">Blog not found.</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      <div className="container py-5">
        {/* Blog Content */}
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
            <img src={blog.thumbnail} alt={blog.title} className="img-fluid rounded shadow-sm mb-4" />
          )}

          <div className="mb-4 fs-5 lh-lg" dangerouslySetInnerHTML={{ __html: blog.content }} />

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
              {liked ? "Liked" : "Like"}{" "}
              <span className={`transition-opacity ${liked ? "text-danger" : ""}`}>
                ({likesCount})
              </span>
            </button>
            <span className="text-muted">Views: {blog.views}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body">
            <h4 className="card-title mb-4">Comments ({totalCount})</h4>

            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button className="btn btn-primary" disabled={!newComment.trim()}>
                Post Comment
              </button>
            </form>

            {comments.length > 0 ? (
              comments.map((comment) => renderComment(comment))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}

            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  className="btn btn-outline-secondary"
                  disabled={!prevPageUrl}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  disabled={!nextPageUrl}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
