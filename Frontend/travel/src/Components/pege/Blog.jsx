import React, { useState, useMemo } from "react";
import { blogs as allBlogs } from "../../data/Blog"; // Adjust path as needed
import sectionBanner from "../../assets/section-banner.webp";
import tst1 from "../../assets/tst-1.webp";
import tst2 from "../../assets/tst-2.webp";
import tst3 from "../../assets/tst-3.webp";
import tst4 from "../../assets/tst-4.webp";
import "../../styles/Blog.css";

const authorImages = [tst1, tst2, tst3, tst4];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="blog-page">
      {/* Banner */}
      <section className="blog-banner">
        <img src={sectionBanner} alt="Blog Banner" className="banner-image" />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Blog
          </h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span> <span>Blog</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-container">
        {/* Left Blogs */}
        <div className="blog-left">
          {filteredBlogs.length ? (
            filteredBlogs.map((blog, index) => (
              <div className="blog-card" key={index}>
                <img src={blog.img} alt={blog.title} className="blog-image" />
                <div className="blog-info">
                  <div className="author">
                    <img
                      src={authorImages[index % authorImages.length]}
                      alt="Author"
                      className="author-img"
                    />
                  </div>
                  <h2>{blog.title}</h2>
                  <p>{blog.desc}</p>
                  <a href="#" className="explore-btn">
                    Explore More <span>↗</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found matching your search.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="blog-right">
          {/* Search Box */}
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

          {/* Categories */}
          <div className="categories">
            <h3>Categories</h3>
            <ul>
              <li>
                ✶ Adventure <span>2</span>
              </li>
              <li>
                ✶ City Tours <span>4</span>
              </li>
              <li>
                ✶ Cruises Tour <span>3</span>
              </li>
              <li>
                ✶ Sea Tour <span>2</span>
              </li>
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="recent-posts">
            <h3>Recent Posts</h3>
            <ul>
              {allBlogs.slice(0, 4).map((recent, i) => (
                <li key={i}>
                  <img src={recent.img} alt="Recent Post" />
                  <div>
                    <span>📅 {recent.date}</span>
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
