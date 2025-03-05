
import React from "react";
import Navbar from "@/components/Navbar";
import NewsHero from "@/components/NewsHero";
import NewsCategories from "@/components/NewsCategories";
import NewsList from "@/components/NewsList";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const News = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Notícias | BoneHeal</title>
        <meta name="description" content="Últimas notícias e atualizações da BoneHeal" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <NewsHero />
        <div className="container mx-auto py-12">
          <NewsCategories />
          <NewsList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
