import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAllServices } from '../APIs/ServiceAPI';
import { getProducts } from '../APIs/ProductsApi';
import Header from '../components/Header';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Lấy query từ URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [location.search]);

  // Tìm kiếm khi query thay đổi
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setServices([]);
        setProducts([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const serviceResponse = await getAllServices();
        const filteredServices = serviceResponse.data.filter(service =>
          service.name.toLowerCase().includes(query.toLowerCase())
        );
        setServices(filteredServices);

        const productResponse = await getProducts();
        const filteredProducts = productResponse.data.filter(product =>
          product.ProductName.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError('Không thể tải kết quả tìm kiếm.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className=" ">
      <div className=" container mt-[-10px] mx-auto px-4 py-2">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm hoặc dịch vụ..."
              className="flex-1 p-3 border text-black border-black-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-maincolor"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-maincolorhover"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-gray-600">Đang tải...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className='w-full max-w-4xl mx-auto'>
         <div className="max-h-[300px] overflow-y-auto pr-2">
          {services.length > 0 && (
            <div className="mb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dịch vụ</h2>
              <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="grid grid-cols-5 gap-6">
                {services.map((service) => (
                  <Link
                    key={service._id}
                    to={`/service/${service._id}`}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <img
                      src={service.image || 'https://via.placeholder.com/150'}
                      alt={service.name}
                      width={150}
                      height={150}
                      className="w-full h-40 object-cover rounded-lg mb-0"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                    <p className="text-gray-600">{service.price} đ</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                  </Link>
                ))}
              </div>
              </div>
            </div>
          )}
          {products.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-0">Sản phẩm</h2>
              <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="grid grid-cols-5 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <img
                      src={product.ImagePD || 'https://via.placeholder.com/150'}
                      alt={product.ProductName}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{product.ProductName}</h3>
                    <p className="text-gray-600">{product.PricePD} đ</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.DescriptionPD}</p>
                  </Link>
                ))}
              </div>
            </div>
            </div>
              
          )}
          {query && !loading && services.length === 0 && products.length === 0 && (
            <p className="text-center text-gray-600">Không tìm thấy kết quả cho "{query}"</p>
          )}
        </div>
        </div>

      </div>
    </div>
  );
};

export default SearchPage;