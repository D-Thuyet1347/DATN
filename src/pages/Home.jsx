import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedServices from "../components/FeaturedServices";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BlogViewer from "../components/BlogViewer";
import Products from "./Products";
import { Spin } from "antd";
import { getProducts } from "../APIs/ProductsApi";
import Cart from "./Cart";
import Service from "./Service";

const Home = () => {
  const [isPending, setIsPending] = useState(false);
  const fetchAllProducts = async () => {
    setIsPending(true);
    const res = await getProducts();
    if (res.success) {
      setIsPending(false);
    }
  }
  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
     <>
     <Spin  spinning={isPending} tip="Loading page....." size="large" className="absolute top-10 left-1/2 z-50">
        <Header />
        <Hero />
      <BlogViewer />
      <Service />
      <Products />
    </Spin>
    </>
  );
};

export default Home;
