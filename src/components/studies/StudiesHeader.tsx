
import { motion } from "framer-motion";

interface StudiesHeaderProps {
  title: string;
  subtitle: string;
}

const StudiesHeader = ({ title, subtitle }: StudiesHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-4xl font-bold text-primary mb-4">
          <span className="mr-2">Bone Heal</span>
          <sup className="text-sm align-super">®</sup>
        </h2>
      </div>
      <h3 className="text-4xl font-bold text-primary mb-4">
        {title}
      </h3>
      <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default StudiesHeader;
