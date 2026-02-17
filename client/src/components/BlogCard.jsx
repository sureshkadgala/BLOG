import React from "react";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  if (!blog) return null;

  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-red-500/25 duration-300 cursor-pointer"
    >
      <img src={image} alt="" className="aspect-video" />

      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-red-500/20 rounded-full text-red-500 text-xs">
        {category}
      </span>

      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p
          className="mb-3 text-xs text-gray-600"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  );
}

export default BlogCard;
