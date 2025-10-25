import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default Spinner;