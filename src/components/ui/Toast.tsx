"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/lib/toast";

export function Toast() {
  const { message, visible } = useToast();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 70, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 70, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="font-mono fixed bottom-6 left-1/2 z-[120] rounded-full border border-teal bg-ink px-6 py-3 text-[0.72rem] font-bold tracking-wide text-cream shadow-[0_8px_32px_rgba(0,0,0,.4)]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
