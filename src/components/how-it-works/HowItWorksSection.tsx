
import React from "react";
import StepCard from "./StepCard";
import { HowItWorksStep, howItWorksSteps } from "@/data/how-it-works-steps";

interface HowItWorksSectionProps {
  title?: string;
  steps?: HowItWorksStep[];
  className?: string;
  id?: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  title = "Como funciona",
  steps = howItWorksSteps,
  className = "",
  id = "how-it-works"
}) => {
  return (
    <section className={`section-padding bg-white ${className}`} id={id}>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-primary">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
