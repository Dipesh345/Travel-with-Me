import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import sectionBanner from "../../assets/section-banner.webp";
import "../../styles/Blog.css";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/blogs/");
        setBlogs(response.data.results || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories/");
        setCategories(response.data.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBlogs(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    setSelectedCategory(categoryParam ? Number(categoryParam) : null);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (selectedCategory === null) {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    if (params.toString() !== location.search.replace(/^\?/, "")) {
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [selectedCategory, location.pathname, location.search, navigate]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? blog.category?.id === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const categoryCounts = useMemo(() => {
    return Array.isArray(categories)
      ? categories.map((cat) => {
          const count = blogs.filter(
            (blog) => blog.category && blog.category.id === cat.id
          ).length;
          return { ...cat, count };
        })
      : [];
  }, [categories, blogs]);

  return (
    <div className="blog-page">
      <section className="blog-banner">
        <img src={sectionBanner} alt="Blog Banner" className="banner-image" />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Blog
          </h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>➔</span> <span>Blog</span>
          </div>
        </div>
      </section>

      <section className="blog-container">
        <div className="blog-left">
          {loading ? (
            <p>Loading blogs...</p>
          ) : filteredBlogs.length ? (
            filteredBlogs.map((blog) => (
              <div className="blog-card" key={blog.id}>
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="blog-image"
                  />
                ) : (
                  <div className="blog-image-placeholder">No Image</div>
                )}
                <div className="blog-info">
                  <div className="author">
                    {blog.author?.profile_image && (
                      <img
                        src={blog.author.profile_image}
                        alt={blog.author.username}
                        className="author-img"
                        title={blog.author.username}
                      />
                    )}
                  </div>

                  <h2>{blog.title}</h2>
                  <p>{blog.content.substring(0, 150)}...</p>

                  <div className="blog-meta">
                    <span>👁️ {blog.views}</span>
                    <span>❤️ {blog.likes_count}</span>
                    {blog.tags && (
                      <span className="blog-tags">
                        {blog.tags.split(",").map((tag, i) => (
                          <span key={i} className="tag">#{tag.trim()}</span>
                        ))}
                      </span>
                    )}
                  </div>

                  {blog.category && (
                    <div className="blog-category">
                      Category: <strong>{blog.category.name}</strong>
                    </div>
                  )}

                  <Link to={`/blog/${blog.slug}`} className="explore-btn">
                    Explore More <span>↗</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found matching your search.</p>
          )}
        </div>

        <aside className="blog-right">
          <div className="search-box">
            <h3>Search</h3>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search blog titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="categories">
            <h3>Categories</h3>
            <ul>
              <li
                style={{
                  cursor: "pointer",
                  fontWeight: selectedCategory === null ? "bold" : "normal",
                }}
                onClick={() => setSelectedCategory(null)}
              >
                ✶ All <span>{blogs.length}</span>
              </li>
              {categoryCounts.length > 0 ? (
                categoryCounts.map((cat) => (
                  <li
                    key={cat.id}
                    style={{
                      cursor: "pointer",
                      fontWeight: selectedCategory === cat.id ? "bold" : "normal",
                    }}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    ✶ {cat.name} <span>{cat.count}</span>
                  </li>
                ))
              ) : (
                <li>No categories available.</li>
              )}
            </ul>
          </div>

          <div className="recent-posts">
            <h3>Recent Posts</h3>
            <ul>
              {blogs.slice(0, 4).map((recent) => (
                <li key={recent.id}>
                  {recent.thumbnail ? (
                    <img src={recent.thumbnail} alt="Recent Post" />
                  ) : (
                    <div className="recent-post-placeholder">No Image</div>
                  )}
                  <div>
                    <span>
                      📅 {new Date(recent.created_at).toLocaleDateString()}
                    </span>
                    <p>{recent.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
