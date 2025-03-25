
import React from "react";
import { HowItWorksStep } from "@/data/how-it-works-steps";

interface StepCardProps {
  step: HowItWorksStep;
  className?: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, className = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden">
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
      <p className="text-neutral-600">{step.description}</p>
    </div>
  );
};

export default StepCard;
