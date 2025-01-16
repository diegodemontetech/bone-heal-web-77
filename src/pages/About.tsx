import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import Timeline from "@/components/Timeline";
import MissionVision from "@/components/MissionVision";
import Team from "@/components/Team";
import Recognition from "@/components/Recognition";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <MissionVision />
        <Timeline />
        <Team />
        <Recognition />
      </main>
      <Footer />
    </div>
  );
};

export default About;