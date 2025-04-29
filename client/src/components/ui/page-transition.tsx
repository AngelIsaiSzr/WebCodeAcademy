import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  id?: string;
}

export function PageTransition({ children, id = "default" }: PageTransitionProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
