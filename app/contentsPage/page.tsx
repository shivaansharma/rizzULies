'use client'
import { motion,AnimatePresence  } from "framer-motion"
import { MorphingText } from "@/app/components/magicui/morphing-text"
import { useState } from "react";
import Sorting from "../components/sorting";
import PlayGround from "../components/flow";
import GraphPlayground from "../components/graph";

export default function Contents() {
  const texts = [
    "Explore",
    "Algorithms",
    "Interactive",
    "Visualizations",
    "Learn",
    "Doing",
    "Action",
    "Visualize",
    "Sorting",
    "Graph",
    "Traversals",
    "Pathfinding",
    "Visualizer",
    "Step-by-Step",
    "Animations",
    "Exploration",
    "Engage",
    "Code"
  ];
  return (
   <>
    <div className="h-screen w-screen flex flex-col items-center pt-16 bg-black text-white">
    <div >
      <motion.div className="relative w-[500px] mb-16"> 
        <motion.div 
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{
             duration: 0.4,
             scale: { type: "spring", visualDuration: 1, bounce: 0.5 },
         }}
          className="absolute bottom-0 left-0 h-[4px] w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full"
        />
        <motion.div className="p-2 text-xl text-center flex items-center justify-center">
          <MorphingText texts={texts} />
        </motion.div>
      </motion.div>
     
    </div>
     <div className="flex justify-center h-m-screen w-screen ">
     <Card content={<Sorting/>} title = "Sorting Algorithms"/>
     <Card content={<PlayGround/>}  title = "Tree PlayGround"/>
     <Card content={<GraphPlayground/>}  title = "Graph PlayGround"/>
   </div>
    </div>
   </>
  );
}

const Card = ({ content, title }: { content: React.ReactNode; title: string }) => {
  const [active, setActive] = useState(false);

  return (
    <>
      <motion.div 
        onClick={() => setActive(true)} 
        className="cursor-pointer p-3"
      >
        <motion.div
          layout
          initial={{ borderRadius: 16 }}
          animate={{ borderRadius: active ? 0 : 16 }}
          transition={{
            duration: 0.5,
            layout: { type: "spring", bounce: 0 },
          }}
          className={`
            shadow-lg flex items-center justify-center text-black font-bold text-lg text-center
            ${active 
              ? "h-screen w-screen fixed top-0 left-0 z-50 p-10 overflow-auto" 
              : "bg-gradient-to-tr from-teal-400 to-yellow-200 h-80 w-60"
            }
          `}
        >
          {active ? content : <div>{title}</div>}
        </motion.div>
      </motion.div>

      {/* Overlay with background blur */}
      <AnimatePresence>
        {active && (
          <>
            {/* Apply background blur only when the card is active */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
              onClick={() => setActive(false)}
            />
            <button
              onClick={() => setActive(false)}
              className="fixed top-5 right-5 z-50 text-white bg-red-500 p-2 rounded-full"
            >
              Close
            </button>
          </>
        )}
      </AnimatePresence>
    </>
  );
};