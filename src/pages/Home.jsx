import React from "react";
import Hero from "../components/Hero";
import FeaturedServices from "../components/FeaturedServices";
import Testimonials from "../components/Testimonials";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
     <>
      <div className="width-full position-relative z-index-1">
        <Header />
        <Hero />
      </div>

      <FeaturedServices />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
