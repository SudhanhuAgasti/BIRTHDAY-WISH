import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';

export default function Memories() {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [touchedCard, setTouchedCard] = useState(null);

  return (
    <section className="relative min-h-screen py-24 px-4 flex flex-col justify-center bg-transparent border-t border-romantic-rose/10 z-10">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-romantic-rose/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-romantic-burgundy/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-wide text-glow"
          >
            Little Moments, Big Memories
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-[1px] bg-romantic-rose mx-auto mt-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-white/75 font-light mt-4 max-w-md mx-auto"
          >
            A beautiful collection of the sweetest moments we've shared together.
          </motion.p>
        </div>

        {/* Polaroids grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-4">
          {birthdayData.memories.map((memory, index) => {
            // Apply slight organic rotation offset to polaroids
            const rotation = index % 2 === 0 ? '1.5deg' : '-1.5deg';
            const hoverRotation = index % 2 === 0 ? '-1deg' : '1deg';
            const isTouched = touchedCard === memory.title;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotate: rotation }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotate: hoverRotation,
                  y: '0px',
                  boxShadow: "0 20px 40px rgba(255, 46, 147, 0.2)",
                  zIndex: 20
                }}
                onClick={() => setSelectedMemory(memory)}
                onTouchStart={() => setTouchedCard(memory.title)}
                onTouchEnd={() => setTouchedCard(null)}
                className="cursor-pointer bg-neutral-950 p-4 rounded-xl border border-white/5 hover:border-romantic-rose/30 transition-all duration-500 group flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg relative bg-neutral-900">
                  {memory.image ? (
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className={`w-full h-full object-cover filter contrast-125 transition-all duration-700 ${isTouched ? 'grayscale-0 contrast-100' : 'grayscale group-hover:grayscale-0 group-hover:contrast-100'
                        }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-romantic-dark/40 flex items-center justify-center">
                      <span className="text-white/30 text-xs">Photo placeholder</span>
                    </div>
                  )}
                  {/* Subtle hover vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Card text content (looks like polaroid script) */}
                <div className="pt-5 pb-2 text-left">
                  <div className="flex items-center gap-1.5 text-romantic-rose text-xs font-semibold uppercase tracking-wider mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{memory.date}</span>
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-white tracking-wide group-hover:text-romantic-lightRose transition-colors duration-300">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-white/50 font-light mt-2 line-clamp-2">
                    {memory.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full screen modal for memory details */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative w-full max-w-4xl glass-premium rounded-3xl overflow-hidden shadow-2xl border border-romantic-rose/30 flex flex-col md:flex-row max-h-[85vh] md:max-h-[75vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-romantic-rose/80 text-white transition-colors duration-300"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Memory Big Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative bg-neutral-900">
                {selectedMemory.image ? (
                  <img
                    src={selectedMemory.image}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-romantic-dark/40 flex items-center justify-center">
                    <span className="text-white/30 text-sm">Memory Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 pointer-events-none"></div>
              </div>

              {/* Memory Details Description */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center overflow-y-auto text-left">
                <div className="flex items-center gap-2 text-romantic-rose text-sm font-semibold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedMemory.date}</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-playfair font-bold text-white mb-4 text-glow">
                  {selectedMemory.title}
                </h3>

                <div className="w-16 h-[2px] bg-romantic-rose mb-6"></div>

                <p className="text-white/80 text-base font-light leading-relaxed mb-6 whitespace-pre-line">
                  {selectedMemory.description}
                </p>

                <p className="text-xs text-romantic-lightRose font-dancing text-lg italic mt-auto">
                  Every moment with you is my favorite memory.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

