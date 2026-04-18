import React from "react";

import Header from "../../components/Header/Header";
import Features from "../../components/Features/Features";
import Banner from "../../components/Banner/Banner";
import Categories from "../../components/Categories/Categories";
import PromoSection from "../../components/PromoSection/PromoSection";
import Personal from "../../components/Personal/Personal";
import Footer from "../../components/Footer/Footer";
import Slider from "../../components/Slider/Slider";
import Slider2 from "../../components/Slider/Slider2";
import VideoPlayer from "../../components/VideoPlayer";

function Dashboard() {
  return (
    <div className="App">
      <Header />

      <VideoPlayer />
      <Banner />
      <Features />

      <div className="spacer"></div>

      <Slider />
      <Categories />
      <PromoSection />
      <Slider2 />
      <Personal />

      <Footer />
    </div>
  );
}

export default Dashboard;