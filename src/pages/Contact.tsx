
import React from "react";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contato | BoneHeal</title>
        <meta name="description" content="Entre em contato com a BoneHeal" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-heading font-bold mb-8 text-center">Entre em Contato</h1>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
