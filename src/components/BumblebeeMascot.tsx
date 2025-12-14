import { motion } from "framer-motion";
import bumblebeeMascot from "@/assets/bumblebee-mascot.png";

const BumblebeeMascot = () => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 pointer-events-none select-none"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <motion.div
        className="relative w-20 h-24 md:w-24 md:h-28"
        animate={{
          y: [0, -5, 0, -3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Bumblebee Image */}
        <motion.img
          src={bumblebeeMascot}
          alt="Bumblebee Mascot"
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
          }}
          animate={{
            rotateZ: [-2, 2, -2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Glowing effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave gesture animation - simulated hand */}
        <motion.div
          className="absolute -top-2 -right-2 text-lg"
          animate={{
            rotate: [0, 20, 0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        >
          👋
        </motion.div>

        {/* Speech bubble with chemistry symbols */}
        <motion.div
          className="absolute -top-8 -left-4 bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg px-2 py-1 text-xs font-medium text-primary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 5,
            times: [0, 0.1, 0.9, 1],
          }}
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            H₂O ⚗️
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BumblebeeMascot;
