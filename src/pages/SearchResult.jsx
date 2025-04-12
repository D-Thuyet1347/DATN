import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../APIs/ProductsApi";
import { getAllServices } from "../APIs/ServiceAPI";
import { getAllBlogs } from "../APIs/blogApi";

const SearchResultPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const type = params.get("type") || "product";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let data = [];
        if (type === "product") {
          const products = await getProducts();
          data = products.filter(p =>
            p.productName?.toLowerCase().includes(query.toLowerCase())
          );
        } else if (type === "service") {
          const services = await getAllServices();
          data = services.filter(s =>
            s.name?.toLowerCase().includes(query.toLowerCase())
          );
        } else if (type === "blog") {
          const blogs = await getAllBlogs();
          data = blogs.filter(b =>
            b.title?.toLowerCase().includes(query.toLowerCase())
          );
        }
        setResults(data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
      setLoading(false);
    };

    if (query) fetchResults();
  }, [query, type]);

  return (
    <div>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      {loading && <div>Đang tải...</div>}
      <ul>
        {results.length > 0 ? (
          results.map((item, idx) => (
            <li key={idx}>
              {type === "product" && item.productName}
              {type === "service" && item.name}
              {type === "blog" && item.title}
            </li>
          ))
        ) : (
          <div>Không có kết quả tìm kiếm phù hợp.</div>
        )}
      </ul>
    </div>
  );
};

export default SearchResultPage;
