import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float n = noise(p + time * 0.1);
    
    // Create soft, ethereal clouds
    float clouds = sin(p.x * 2.0 + time * 0.2) * cos(p.y * 2.0 - time * 0.15);
    clouds += sin(p.y * 4.0 + time * 0.3) * 0.5;
    
    vec3 color = mix(color1, color2, clouds * 0.5 + 0.5);
    float alpha = smoothstep(0.2, 0.8, clouds * 0.5 + 0.5) * 0.15;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Nebula() {
    const meshRef = useRef<THREE.Mesh>(null);
    const uniforms = useRef({
        time: { value: 0 },
        color1: { value: new THREE.Color('#001133') },
        color2: { value: new THREE.Color('#110033') }
    });

    useFrame((state) => {
        if (meshRef.current) {
            uniforms.current.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} scale={[500, 500, 500]}>
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                vertexShader={nebulaVertexShader}
                fragmentShader={nebulaFragmentShader}
                uniforms={uniforms.current}
                side={THREE.BackSide}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}
