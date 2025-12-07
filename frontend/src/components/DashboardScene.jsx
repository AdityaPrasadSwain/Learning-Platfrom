import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const AnimatedSphere = () => {
    const sphereRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.x = t * 0.2;
            sphereRef.current.rotation.y = t * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.4}>
                <MeshDistortMaterial
                    color="#3B82F6"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

const DashboardScene = () => {
    return (
        <div className="h-[300px] w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl overflow-hidden relative shadow-lg">
            <div className="absolute top-8 left-8 z-10 text-white max-w-md">
                <h2 className="text-3xl font-bold mb-2">Welcome Back, Admin</h2>
                <p className="text-blue-200">Manage your platform efficiently with real-time analytics and insights.</p>
            </div>
            <Canvas className="absolute inset-0">
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="blue" intensity={2} />
                <AnimatedSphere />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default DashboardScene;
