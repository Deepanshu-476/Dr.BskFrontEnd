import React from "react";
// Import NEW premium components
import Header from "../../components/Header/Header";
import HeroSection2 from "../../components/HeroSection/HeroSection2";
import TrustBadges from "../../components/TrustBadges/TrustBadges";
import CategorySection from "../../components/CategorySection/CategorySection";
import BestSellerProducts from "../../components/BestSellerProducts/BestSellerProducts";
import OfferBanners from "../../components/OfferBanners/OfferBanners";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Certificates from "../../components/Certificates/Certificates";
import CombinedSection from "../../components/CombinedSection/CombinedSection.js";
import AppDownload from "../../components/AppDownload/AppDownload";
import FloatingButtons from "../../components/FloatingButtons/FloatingButtons";
import Footer from "../../components/Footer/Footer";

// Import existing components you want to keep/adapt
// (Optional: Keep if they match the design, otherwise replace)
// import Header from "../../components/Header/Header";
// import Features from "../../components/Features/Features";
// import Banner from "../../components/Banner/Banner";
// import Categories from "../../components/Categories/Categories";
// import PromoSection from "../../components/PromoSection/PromoSection";
// import Personal from "../../components/Personal/Personal";
// import Slider from "../../components/Slider/Slider";
// import Slider2 from "../../components/Slider/Slider2";
// import VideoPlayer from "../../components/VideoPlayer";

function Dashboard() {
  return (
    <div className="App">
      <Header />

      {/* Premium Components */}
      <HeroSection2 />
      <TrustBadges />
      <CategorySection />
      <BestSellerProducts />
      <OfferBanners />
      <WhyChooseUs />
      <Certificates />
      <CombinedSection />
      <AppDownload />
      <FloatingButtons />
      <Footer />
      
      {/* 
        Remove or replace these old components:
        <VideoPlayer />
        <Banner />
        <Features />
        <Slider />
        <Categories />
        <PromoSection />
        <Slider2 />
        <Personal />
      */}
    </div>
  );
}

export default Dashboard;