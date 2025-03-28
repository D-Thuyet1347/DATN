import React from "react";
import Hero from "../components/Hero";
import FeaturedServices from "../components/FeaturedServices";
import Testimonials from "../components/Testimonials";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Header />

      <Hero />
      <FeaturedServices />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
