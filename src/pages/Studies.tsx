
import React from "react";
import Navbar from "@/components/Navbar";
import StudiesPreview from "@/components/StudiesPreview";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Studies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Artigos Científicos | BoneHeal</title>
        <meta name="description" content="Artigos e estudos científicos sobre produtos BoneHeal" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <h1 className="text-3xl font-heading font-bold mb-8 text-center">Artigos Científicos</h1>
          <StudiesPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Studies;
