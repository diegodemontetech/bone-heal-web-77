import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import Timeline from "@/components/Timeline";
import MissionValues from "@/components/MissionValues";
import Team from "@/components/Team";
import Infrastructure from "@/components/Infrastructure";
import Commitment from "@/components/Commitment";
import Recognition from "@/components/Recognition";
import CallToAction from "@/components/CallToAction";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <Timeline />
        <MissionValues />
        <Team />
        <Infrastructure />
        <Commitment />
        <Recognition />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default About;