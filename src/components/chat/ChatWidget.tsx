import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            <ChatWindow onMinimize={handleMinimize} onClose={handleClose} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating Button with enhanced styling */}
      <motion.button
        onClick={isOpen && isMinimized ? handleOpen : isOpen ? handleClose : handleOpen}
        className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/90 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3), 0 0 20px -5px hsl(var(--primary) / 0.3)'
        }}
      >
        {/* Glow ring animation when closed */}
        {!isOpen && (
          <>
            <motion.div
              className="absolute inset-0 bg-primary rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-secondary/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen && !isMinimized ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-secondary" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-secondary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized indicator */}
        {isMinimized && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center"
          >
            <span className="text-[10px] text-primary font-bold">1</span>
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-border hidden sm:block"
        >
          Need help? Chat with us!
        </motion.div>
      )}
    </div>
  );
};

export default ChatWidget;
