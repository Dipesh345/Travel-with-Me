// Blog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecommendationCard from '../pege/RecommendationCard';

const Blog = () => {
  const [recommendations, setRecommendations] = useState([]);
  const token = localStorage.getItem('access_token'); // Fix: should be 'access_token'

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/blog_app/recommend/blogs/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecommendations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Recommended Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((blog) => (
          <RecommendationCard
            key={blog.id}
            blogId={blog.id}
            title={blog.title}
            subtitle={blog.content.slice(0, 60) + '...'}
            tags={blog.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
