import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecommendationCard from '../pege/RecommendationCard';
import { useParams } from 'react-router-dom';

export default function DestinationDetail() {
  const { id: destinationId } = useParams();

  const [relatedDestinations, setRelatedDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/blog_app/recommend/destination/${destinationId}/`)
      .then((res) => {
        setRelatedDestinations(res.data.related_destinations || []);
        setHotels(res.data.hotels || []);
        setBlogs(res.data.blogs || []);
      })
      .catch((err) => {
        console.error('Failed to fetch recommendations:', err);
      });
  }, [destinationId]);

  return (
    <div className="relative px-6 py-12 md:px-12 lg:px-20 bg-[#EFF8FF] rounded-2xl shadow-lg starry-bg overflow-hidden">
      {/* Overall heading */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl font-extrabold text-[#E00C5B]">Recommended for You</h2>
        <p className="text-[#527282] mt-2 text-lg font-medium">
          Based on your interests and this destination
        </p>
      </div>

      {/* Related Destinations */}
      <h3 className="text-3xl font-semibold text-[#E00C5B] mt-12 mb-6 relative z-10">Related Destinations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
        {relatedDestinations.length > 0 ? (
          relatedDestinations.map((dest) => (
            <RecommendationCard
              key={dest.id}
              destinationId={dest.id}
              title={dest.name}
              subtitle={dest.location}
              tags={dest.tags}
              className="rounded-3xl shadow-xl"
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full relative z-10">No related destinations found.</p>
        )}
      </div>

      {/* Nearby Hotels */}
      <h3 className="text-3xl font-semibold text-[#0F9F16] mt-16 mb-6 relative z-10">Nearby Hotels</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <RecommendationCard
              key={hotel.id}
              hotelId={hotel.id}
              title={hotel.name}
              subtitle={hotel.location}
              tags={hotel.tags}
              className="rounded-3xl shadow-xl"
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full relative z-10">No nearby hotels found.</p>
        )}
      </div>

      {/* Blogs Related to this Place */}
      <h3 className="text-3xl font-semibold text-[#E00C5B] mt-16 mb-6 relative z-10">Blogs Related to This Place</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <RecommendationCard
              key={blog.id}
              blogId={blog.id}
              title={blog.title}
              subtitle={blog.content?.slice(0, 60) + '...'}
              tags={blog.tags}
              className="rounded-3xl shadow-xl"
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full relative z-10">No blogs found for this destination.</p>
        )}
      </div>
    </div>
  );
}
