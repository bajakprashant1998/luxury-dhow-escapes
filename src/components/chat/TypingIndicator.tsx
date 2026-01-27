import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-secondary font-bold">LD</span>
      </div>
      <div className="bg-primary/90 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-secondary/60 rounded-full"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
