import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollReveal({ children }) {
    const targetRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "center center"]
    });

    // Custom animation paths: asymmetric mask reveal + progressive horizontal slide line
    const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.5, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
    
    // Scale tracking bar width from 0% to 100% based entirely on entry depth
    const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={targetRef} className="w-full relative py-8 overflow-hidden group">
            {/* Immersive tracking border accent right on top of content boundary */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-900">
                <motion.div 
                  style={{ width: lineWidth }}
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent transition-shadow duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
            </div>

            {/* Masked Sliding Wrapper Zone */}
            <motion.div
                style={{
                    opacity,
                    scale,
                    y
                }}
                className="w-full origin-top"
            >
                {children}
            </motion.div>
        </div>
    );
}