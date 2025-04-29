'use client'
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Contents from "../contentsPage/page"

export default function HomePage() {
    const scrollRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const smoothX = useTransform(x, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-20, 20]);
    const smoothY = useTransform(y, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-20, 20]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleScroll = () => {
            if (scrollRef.current) {
                const currentScrollPos = scrollRef.current.scrollTop;
                setScrollPosition(currentScrollPos);
                setIsScrolledDown(currentScrollPos > window.innerHeight / 2);
            }
        };
        
        const handleMouse = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            x.set(e.clientX);
            y.set(e.clientY);
        }
        
        const div = scrollRef.current;
        if (div) {
            div.addEventListener('scroll', handleScroll);
        }
        
        window.addEventListener('mousemove', handleMouse);
        
        return () => {
            if (div) {
                div.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('mousemove', handleMouse);
        };
    }, [x, y]);

    // Animation variants for circles moving across the screen
    const pinkAnimation = {
        animate: {
            x: ["-25%", "125%", "-25%"],
            y: ["10%", "75%", "10%"],
            transition: {
                x: {
                    repeat: Infinity,
                    duration: 30,
                    ease: "easeInOut"
                },
                y: {
                    repeat: Infinity,
                    duration: 23,
                    ease: "easeInOut"
                }
            }
        }
    };

    const orangeAnimation = {
        animate: {
            x: ["100%", "-20%", "100%"],
            y: ["80%", "20%", "80%"],
            transition: {
                x: {
                    repeat: Infinity,
                    duration: 25,
                    ease: "easeInOut"
                },
                y: {
                    repeat: Infinity,
                    duration: 18,
                    ease: "easeInOut"
                }
            }
        }
    };

    const yellowAnimation = {
        animate: {
            x: ["80%", "20%", "80%"],
            y: ["-10%", "110%", "-10%"],
            transition: {
                x: {
                    repeat: Infinity,
                    duration: 22,
                    ease: "easeInOut"
                },
                y: {
                    repeat: Infinity,
                    duration: 28,
                    ease: "easeInOut"
                }
            }
        }
    };

    const blueAnimation = {
        animate: {
            x: ["10%", "90%", "10%"],
            y: ["90%", "0%", "90%"],
            transition: {
                x: {
                    repeat: Infinity,
                    duration: 26,
                    ease: "easeInOut"
                },
                y: {
                    repeat: Infinity,
                    duration: 20,
                    ease: "easeInOut"
                }
            }
        }
    };

    // Scroll indicator animation
    const scrollIndicatorAnimation = {
        animate: {
            y: [0, 15, 0],
            opacity: [0.9, 0.5, 0.9],
            transition: {
                y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                },
                opacity: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                }
            }
        }
    };

    return (
        <div ref={scrollRef} className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory relative">
            {/* Background blur elements */}
            <motion.div 
                className="fixed inset-0 overflow-hidden pointer-events-none"
                style={{ x: smoothX, y: smoothY }}
            >
                <div className="relative w-full h-full">
                    <motion.div 
                        variants={pinkAnimation}
                        animate="animate"
                        className="absolute h-64 w-64 bg-pink-300 rounded-full blur-xl opacity-60"
                    />
                    <motion.div 
                        variants={orangeAnimation}
                        animate="animate"
                        className="absolute h-80 w-80 bg-orange-300 rounded-full blur-xl opacity-60"
                    />
                    <motion.div 
                        variants={yellowAnimation}
                        animate="animate"
                        className="absolute h-72 w-72 bg-yellow-200 rounded-full blur-xl opacity-60"
                    />
                    <motion.div 
                        variants={blueAnimation}
                        animate="animate"
                        className="absolute h-96 w-96 bg-blue-400 rounded-full blur-xl opacity-60"
                    />
                </div>
            </motion.div>

            {/* Semi-transparent overlay to ensure text readability */}
            <div className="fixed inset-0 bg-white bg-opacity-30 pointer-events-none"></div>

            {/* Content */}
            <div className="h-screen w-full flex items-center justify-center snap-start relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: isScrolledDown ? 0 : 1, 
                        scale: isScrolledDown ? 0.8 : 1 
                    }}
                    transition={{
                        duration: 0.5,
                        scale: { type: "spring", damping: 8 }
                    }}
                    className="font-extrabold text-8xl"
                >
                    Rizz U lies
                </motion.div>

                {/* Scroll indicator - only visible on first screen */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: isScrolledDown ? 0 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-gray-800 text-sm font-medium mb-2">Scroll Down</div>
                    <motion.div
                        variants={scrollIndicatorAnimation}
                        animate="animate"
                        className="w-8 h-12 border-2 border-gray-800 rounded-full flex justify-center relative"
                    >
                        <motion.div 
                            className="w-1.5 h-3 bg-gray-800 rounded-full absolute top-2"
                        />
                    </motion.div>
                </motion.div>
            </div>

            <div className="h-screen w-full flex items-center justify-center snap-start relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: isScrolledDown ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.5
                    }}
                    className="w-full h-full"
                >
                    {isScrolledDown && <Contents />}
                </motion.div>
            </div>
        </div>
    );
}