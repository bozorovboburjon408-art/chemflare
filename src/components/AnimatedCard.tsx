import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  className = "",
  hover = true
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={hover ? { 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
    >
      <Card className={`overflow-hidden backdrop-blur-sm border-border/50 ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
