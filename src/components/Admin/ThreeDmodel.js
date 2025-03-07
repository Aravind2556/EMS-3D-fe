import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows } from '@react-three/drei';

// Component to load and animate the twin electric motor model
function ThreeDmodel({ isOn, temperature, vibration, scaleFactor, model}) {
  const { scene } = useGLTF(`/models/${model||'scene'}.gltf`);
  const groupRef = useRef();

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  

  // Determine drop shadow color based on temperature:
  // Red when above 60, blue when below 40, gray otherwise.
  const shadowColor = temperature > 60 ? '#F75900' : temperature < 40 ? '#08AFDD' : 'gray'; //props for min and max temperature

  // Calculate vibration magnitude if vibration > 2 (vibration starts when above 2)
  const vibrationMagnitude = vibration > 2 ? (vibration - 2) * 0.01 : 0;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // If the device is on (isOn > 0.05), rotate to indicate it's running
      if (isOn > 0.05) { //props for current min value
        groupRef.current.rotation.y += delta;
      }
      // Apply a shaking effect if vibration is above the threshold
      if (vibrationMagnitude) {
        groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 50) * vibrationMagnitude;
        groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 50) * vibrationMagnitude;
      } else {
        // Reset position if no vibration
        groupRef.current.position.x = 0;
        groupRef.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      {/* Render the loaded 3D model */}
      <primitive object={scene} dispose={null} />
      {/* Render a drop shadow with a color based on temperature */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.9} 
        scale={10} 
        blur={1} 
        color={shadowColor} 
      />
    </group>
  );
}

// Main component that wraps the 3D scene in a Canvas
export default function Test({ isOn, temperature, vibration }) {

    const shadowColor = temperature > 60 ? '#F75900' : temperature < 40 ? '#08AFDD' : 'gray';


  return (
    <div>

        <span className={`d-flex justify-content-center align-items-center px-2 mx-auto my-3 rounded-circle ${isOn>0.04?'bg-text-white':'text-bg-white border border-danger'}`} style={{width: "fit-content"}}>
        <i className={`bi bi-power fs-1 `}></i>
        </span>
            <p className='my-0 text-center'>Device is {isOn>0.04?'ON':'OFF'}</p>

        <Canvas 
            shadows 
            camera={{ position: [0, 0 ,0.4], fov: 60 }}
            style={{width: '100%', height: '300px',  filter: `drop-shadow(0 0 4px ${shadowColor})`, position : "relative" , bottom : "50px"}}
            className='canva-css'
            >
            {/* Basic ambient and directional lighting */}
            <ambientLight intensity={0.9} />
            <directionalLight
                castShadow
                position={[5, 10, 7.5]}
                intensity={1}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />


            {/* Ground plane to receive shadows */}
            <mesh 
                receiveShadow 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, 0, 0]}  // adjust the Y position as needed
            >
                <planeGeometry args={[50, 50]} />
                <shadowMaterial opacity={0.3} />
            </mesh>

            {/* Render the animated motor */}
            <ThreeDmodel 
                isOn={isOn} 
                temperature={temperature} 
                vibration={vibration} 
                scaleFactor={4} 
            />
            
            </Canvas>



    </div>
    
  );
}

// Preload the 3D model for better performance
useGLTF.preload('/models/scene.gltf');