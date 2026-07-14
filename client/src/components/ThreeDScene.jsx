import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDScene() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Geometry - floating glass prisms
        const group = new THREE.Group();
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x818cf8, // primary color
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 1.5,
            transparent: true,
            opacity: 0.7,
            reflectivity: 0.5
        });

        const meshes = [];
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.BoxGeometry(1.5, 3.5, 0.4);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (i - 1) * 2.2;
            mesh.rotation.y = Math.PI / 4;
            mesh.rotation.x = Math.PI / 6;
            group.add(mesh);
            meshes.push(mesh);
        }
        scene.add(group);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x818cf8, 3, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const blueLight = new THREE.PointLight(0x4f46e5, 3, 100);
        blueLight.position.set(-5, -5, 3);
        scene.add(blueLight);

        camera.position.z = 7;

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            
            group.rotation.y += 0.004;
            group.rotation.x += 0.002;
            
            // Floating motion
            group.position.y = Math.sin(Date.now() * 0.001) * 0.15;
            
            // Individual subtle rotation for meshes
            meshes.forEach((mesh, index) => {
                mesh.rotation.z = Math.sin(Date.now() * 0.0005 + index) * 0.05;
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[400px] md:min-h-[500px]" />
    );
}
