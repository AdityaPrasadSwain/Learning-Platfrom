import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';

const ThreeBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black pointer-events-none transition-colors duration-300">
            <Canvas camera={{ position: [0, 0, 1] }}>
                {isDark ? (
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                ) : (
                    // In light mode, maybe just subtle dark particles or clouds, as stars look weird
                    <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.6} color="#444444" noise={0.2} />
                )}
                <Sparkles
                    count={100}
                    scale={12}
                    size={2}
                    speed={0.4}
                    opacity={0.5}
                    noise={0.2}
                    color={isDark ? "white" : "#6366f1"} // Indigo for light mode
                />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
