
import React from "react";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/AboutHero";
import Footer from "@/components/Footer";
import MissionValues from "@/components/MissionValues";
import Team from "@/components/Team";
import Timeline from "@/components/Timeline";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Nossa História | BoneHeal</title>
        <meta name="description" content="Conheça a história e missão da BoneHeal" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <MissionValues />
        <Team />
        <Timeline />
      </main>
      <Footer />
    </div>
  );
};

export default About;
