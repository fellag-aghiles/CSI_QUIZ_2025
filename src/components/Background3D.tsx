
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Trail, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// Animated sphere component with trail effect
function AnimatedSphere({ position, color }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // More complex movement pattern
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.005;
      meshRef.current.position.x += Math.cos(clock.getElapsedTime() * 1.5 + position[1]) * 0.003;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Trail 
      width={0.5} 
      color={new THREE.Color(color)} 
      length={6} 
      decay={1} 
      local={false}
      stride={0}
      interval={1}
    >
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </Trail>
  );
}

// Animated octahedron for central visual element
function AnimatedOctahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      // Pulsating scale effect
      const scale = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <octahedronGeometry args={[3, 0]} />
      <meshBasicMaterial color="#1EAEDB" wireframe={true} transparent opacity={0.15} />
    </mesh>
  );
}

// Floating text in 3D space
function FloatingText() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={textRef} position={[0, 3, 0]}>
      <Text
        color="#ffffff"
        fontSize={0.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CSI Quizz
      </Text>
    </group>
  );
}

// Floating particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 15;
    particlePositions[i + 1] = (Math.random() - 0.5) * 15;
    particlePositions[i + 2] = (Math.random() - 0.5) * 15;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" {...particlesGeometry} />
      <pointsMaterial
        attach="material"
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Main 3D network visualization
function NetworkVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  // Generate positions for the spheres
  const nodeCount = 20; // Increased number of nodes
  const nodePositions = [];
  
  for (let i = 0; i < nodeCount; i++) {
    nodePositions.push([
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 7
    ]);
  }

  return (
    <group ref={groupRef}>
      {/* Create individual spheres with trails */}
      {nodePositions.map((pos, index) => (
        <AnimatedSphere 
          key={`node-${index}`} 
          position={[pos[0], pos[1], pos[2]]} 
          color={index % 4 === 0 ? "#ffffff" : index % 4 === 1 ? "#33C3F0" : index % 4 === 2 ? "#1EAEDB" : "#0FA0CE"} 
        />
      ))}
      
      {/* Add animated center decoration */}
      <AnimatedOctahedron />
      <FloatingText />
      <FloatingParticles />
    </group>
  );
}

// Main background component
export default function Background3D() {
  return (
    <div className="fixed inset-0 bg-blue-900 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Add stars for extra background effect */}
        <Stars radius={100} depth={50} count={1500} factor={4} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <NetworkVisualization />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

