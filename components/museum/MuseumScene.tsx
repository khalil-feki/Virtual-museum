"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  RoundedBox,
  Sparkles,
  Stars,
  Torus,
} from "@react-three/drei";
import * as THREE from "three";

import type { EcoRoom } from "@/data/greenRooms";

type MuseumSceneProps = {
  rooms: EcoRoom[];
  progress: number;
  activeRoomIndex: number;
};

const ROOM_DEPTH = 28;
const ROOM_OBJECT_SCALE = 1.24;

type CalloutProps = {
  title: string;
  detail: string;
  visible: boolean;
  position?: [number, number, number];
};

function Callout({ title, detail, visible, position = [0, 1.3, 0] }: CalloutProps) {
  if (!visible) {
    return null;
  }

  return (
    <Html position={position} transform distanceFactor={10} center>
      <div className="tv-callout-wrap">
        <p className="tv-object-label">{title}</p>
        <p className="tv-object-callout">{detail}</p>
      </div>
    </Html>
  );
}

type ExhibitProps = {
  title: string;
  detail: string;
  roomActive: boolean;
  position: [number, number, number];
  calloutOffset?: [number, number, number];
  children: React.ReactNode;
};

function Exhibit({ title, detail, roomActive, position, calloutOffset, children }: ExhibitProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (roomActive) {
          setHovered(true);
        }
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      <Callout
        title={title}
        detail={detail}
        visible={roomActive && hovered}
        position={calloutOffset}
      />
    </group>
  );
}

function RoomFrame({
  room,
  index,
  isActive,
}: {
  room: EcoRoom;
  index: number;
  isActive: boolean;
}) {
  const z = -index * ROOM_DEPTH;

  return (
    <group position={[0, 1.75, z - 1.15]}>
      <RoundedBox args={[14, 8, 0.35]} radius={0.28} smoothness={5}>
        <meshStandardMaterial
          color="#11304f"
          transparent
          opacity={0.26}
          roughness={0.35}
          metalness={0.18}
          depthWrite={false}
        />
      </RoundedBox>
      {isActive ? (
        <Html position={[-5.55, 3.5, 1.02]} occlude={false}>
          <div
            style={{
              padding: "0.32rem 0.7rem",
              borderRadius: "999px",
              border: "1px solid rgba(180, 230, 255, 0.35)",
              background: "rgba(4, 18, 34, 0.65)",
              color: room.color,
              fontSize: "0.92rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.35)",
              pointerEvents: "none",
            }}
          >
            {room.title}
          </div>
        </Html>
      ) : null}
      <mesh position={[0, -3.4, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.2, 18]} />
        <meshStandardMaterial
          color="#132743"
          roughness={0.72}
          metalness={0.08}
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function IntroRoom({ z, roomActive }: { z: number; roomActive: boolean }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const barsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.18;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.z += delta * 0.33;
      const pulse = 0.35 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
      (atmosphereRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }

    if (barsRef.current) {
      barsRef.current.children.forEach((bar, idx) => {
        const mesh = bar as THREE.Mesh;
        mesh.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.2 + idx) * 0.08;
      });
    }
  });

  return (
    <group position={[0, 2.05, z + 0.2]} scale={[ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE]}>
      <Exhibit
        title="Terre Holographique"
        detail="Des modeles climatiques en temps reel cartographient emissions, zones de rechauffement et demande energetique."
        roomActive={roomActive}
        position={[0, 0, 0.2]}
        calloutOffset={[0, 2.2, 0]}
      >
        <mesh ref={globeRef}>
          <sphereGeometry args={[1.22, 36, 36]} />
          <meshPhysicalMaterial
            color="#3a89c7"
            metalness={0.15}
            roughness={0.18}
            clearcoat={0.65}
            transmission={0.2}
            emissive="#3bd4ff"
            emissiveIntensity={0.32}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.37, 20, 20]} />
          <meshBasicMaterial color="#89ecff" wireframe transparent opacity={0.35} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Anneau de Pression Thermique"
        detail="La bande atmospherique visualise la pression cumulee du rechauffement au fil du temps."
        roomActive={roomActive}
        position={[0, -0.05, 0.2]}
        calloutOffset={[0, -1.35, 0]}
      >
        <mesh ref={atmosphereRef} rotation={[Math.PI / 2, 0.2, 0]}>
          <torusGeometry args={[2.05, 0.11, 18, 80]} />
          <meshStandardMaterial color="#ffc68b" emissive="#ff9d57" emissiveIntensity={0.35} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Skyline des Emissions"
        detail="Les barres sectorielles montrent ou la decarbonation doit accelerer en priorite."
        roomActive={roomActive}
        position={[-3.2, -0.6, 0.1]}
        calloutOffset={[0, 2.3, 0]}
      >
        <group ref={barsRef}>
          {[0.9, 1.3, 1.6, 2.1, 2.5, 1.9].map((h, idx) => (
            <mesh key={`bar-${idx}`} position={[idx * 0.42, h / 2, 0]} scale={[1, 1, 1]}>
              <boxGeometry args={[0.26, h, 0.26]} />
              <meshStandardMaterial color="#63ddff" emissive="#5ce8ff" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      </Exhibit>

      {roomActive ? (
        <>
          <Html position={[-2.4, 2.65, 0.8]} transform distanceFactor={12}>
            <div className="tv-floating-stat">CO2 : 36.8 Gt/an</div>
          </Html>
          <Html position={[2.4, 2.25, 1]} transform distanceFactor={12}>
            <div className="tv-floating-stat">Demande : +3.4%/an</div>
          </Html>
        </>
      ) : null}

      <Sparkles count={70} scale={[6, 3, 5]} color="#7bf8ff" speed={0.35} size={1.5} />
    </group>
  );
}

function WindRotor({ speed }: { speed: number }) {
  const rotorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!rotorRef.current) {
      return;
    }

    const current = rotorRef.current.rotation.z;
    const target = current + speed * delta;
    rotorRef.current.rotation.z = THREE.MathUtils.damp(current, target, 8, delta);
  });

  return (
    <group ref={rotorRef} position={[0, 2.2, 0]}>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <mesh key={`blade-${angle}`} rotation={[0, 0, angle]}>
          <boxGeometry args={[1.05, 0.08, 0.09]} />
          <meshStandardMaterial color="#e4f8ff" metalness={0.45} roughness={0.25} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#dff6ff" emissive="#77d8ff" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function HydroTurbine() {
  const turbineRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.x += delta * 3.1;
    }
  });

  return (
    <mesh ref={turbineRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.42, 20]} />
      <meshStandardMaterial color="#9fdcff" emissive="#54cfff" emissiveIntensity={0.45} />
    </mesh>
  );
}

function RenewableRoom({ z, roomActive }: { z: number; roomActive: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!beamRef.current) {
      return;
    }

    (beamRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.16 + Math.sin(state.clock.elapsedTime * 1.6) * 0.05;
  });

  return (
    <group position={[0, 1.55, z + 0.2]} scale={[ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE]}>
      <Exhibit
        title="Champ Solaire"
        detail="Les panneaux convertissent la lumiere en electricite pour l'habitat, les activites et la mobilite."
        roomActive={roomActive}
        position={[-3.25, 0.25, 0.45]}
        calloutOffset={[0.4, 1.55, 0]}
      >
        {[0, 1, 2].map((idx) => (
          <group key={`panel-${idx}`} position={[idx * 0.95, 0, 0]}>
            <mesh rotation={[-0.32, 0.12, 0]}>
              <boxGeometry args={[0.85, 0.08, 1.1]} />
              <meshStandardMaterial color="#183450" metalness={0.62} roughness={0.3} />
            </mesh>
            {[0, 1, 2, 3].map((line) => (
              <mesh key={`cell-line-${line}`} position={[0, 0.08, -0.39 + line * 0.26]} rotation={[-0.32, 0.12, 0]}>
                <boxGeometry args={[0.8, 0.01, 0.01]} />
                <meshBasicMaterial color="#79dcff" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh ref={beamRef} position={[1, 2.15, -0.75]} rotation={[Math.PI / 2.5, 0.16, 0]}>
          <coneGeometry args={[0.62, 2.2, 28, 1, true]} />
          <meshBasicMaterial color="#ffd686" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Eolienne"
        detail="Des pales aerodynamiques captent l'energie cinetique du vent et l'injectent dans le reseau."
        roomActive={roomActive}
        position={[0.2, -0.1, 0.25]}
        calloutOffset={[0, 3, 0]}
      >
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.08, 0.13, 2.2, 20]} />
          <meshStandardMaterial color="#d8efff" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.18, 0.02]}>
          <boxGeometry args={[0.42, 0.16, 0.2]} />
          <meshStandardMaterial color="#d0ebff" metalness={0.55} roughness={0.35} />
        </mesh>
        <WindRotor speed={2.6} />
      </Exhibit>

      <Exhibit
        title="Barrage Hydroelectrique"
        detail="La prise d'eau entraine une turbine et un debit controle pour produire de l'electricite."
        roomActive={roomActive}
        position={[3.25, -0.18, 0.35]}
        calloutOffset={[0.1, 2.2, 0]}
      >
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[2.15, 1.3, 0.8]} />
          <meshStandardMaterial color="#a2b8c9" metalness={0.25} roughness={0.55} />
        </mesh>
        <mesh position={[-0.75, 0.45, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.45, 20]} />
          <meshStandardMaterial color="#7bc5ff" emissive="#64d9ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.76, 0.15, 0.7]}>
          <boxGeometry args={[0.95, 0.2, 0.5]} />
          <meshStandardMaterial color="#76b9ea" metalness={0.35} roughness={0.35} />
        </mesh>
        <HydroTurbine />
      </Exhibit>
    </group>
  );
}

function PulseLink({
  start,
  end,
  color,
  speed = 0.8,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  speed?: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const direction = useMemo(() => new THREE.Vector3().subVectors(end, start), [end, start]);

  useFrame((state) => {
    if (!pulseRef.current) {
      return;
    }

    const t = (state.clock.elapsedTime * speed) % 1;
    pulseRef.current.position.set(
      start.x + direction.x * t,
      start.y + direction.y * t,
      start.z + direction.z * t
    );
  });

  return (
    <>
      <mesh position={new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)}>
        <cylinderGeometry args={[0.016, 0.016, direction.length(), 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} />
      </mesh>
      <mesh ref={pulseRef} position={start}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
}

function SmartInfrastructureRoom({ z, roomActive }: { z: number; roomActive: boolean }) {
  const nodePoints = useMemo(
    () => [
      new THREE.Vector3(-2.6, 0.95, 0.45),
      new THREE.Vector3(-1.2, 1.35, 0.2),
      new THREE.Vector3(0, 1.65, 0.45),
      new THREE.Vector3(1.45, 1.22, 0.05),
      new THREE.Vector3(2.7, 0.9, 0.4),
    ],
    []
  );

  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current) {
      return;
    }

    const pulse = 0.42 + Math.sin(state.clock.elapsedTime * 3.1) * 0.26;
    const peak = Math.sin(state.clock.elapsedTime * 0.9 + 1.4) > 0.96 ? 0.95 : pulse;
    (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = peak;
  });

  return (
    <group position={[0, 1.35, z + 0.2]} scale={[ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE]}>
      <Exhibit
        title="Noyau Reseau Intelligent"
        detail="Un coeur de controle numerique orchestre offre, demande et stockage en temps reel."
        roomActive={roomActive}
        position={[0, 0.8, 0.25]}
        calloutOffset={[0, 1.6, 0]}
      >
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.44, 0]} />
          <meshStandardMaterial color="#95ecff" emissive="#5ecfff" emissiveIntensity={0.45} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Poste Electrique"
        detail="Le poste ajuste la tension pour acheminer l'electricite en toute securite."
        roomActive={roomActive}
        position={[-3.1, 0.05, 0.2]}
        calloutOffset={[0, 1.4, 0]}
      >
        <mesh>
          <boxGeometry args={[1.6, 0.9, 1]} />
          <meshStandardMaterial color="#87a3b4" metalness={0.32} roughness={0.46} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Pylone de Transport"
        detail="L'infrastructure haute tension transporte l'energie renouvelable entre les territoires."
        roomActive={roomActive}
        position={[3.1, 0.25, 0.15]}
        calloutOffset={[0, 2.1, 0]}
      >
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 2.2, 12]} />
          <meshStandardMaterial color="#9ec2d1" metalness={0.52} roughness={0.34} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <boxGeometry args={[1.25, 0.1, 0.1]} />
          <meshStandardMaterial color="#9ec2d1" metalness={0.52} roughness={0.34} />
        </mesh>
      </Exhibit>

      {roomActive ? (
        <>
          <PulseLink start={nodePoints[0]} end={nodePoints[1]} color="#7ef8ff" />
          <PulseLink start={nodePoints[1]} end={nodePoints[2]} color="#70f0ff" speed={0.95} />
          <PulseLink start={nodePoints[2]} end={nodePoints[3]} color="#8affd4" speed={0.75} />
          <PulseLink start={nodePoints[2]} end={nodePoints[4]} color="#61dbff" speed={1.05} />
        </>
      ) : null}

      {nodePoints.map((point, idx) => (
        <mesh key={`node-${idx}`} position={point}>
          <sphereGeometry args={[0.18, 14, 14]} />
          <meshStandardMaterial color="#86eeff" emissive="#65dfff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function GreenInnovationRoom({ z, roomActive }: { z: number; roomActive: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const chargeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.2;
    }

    if (chargeRef.current) {
      const glow = 0.4 + Math.sin(state.clock.elapsedTime * 2.8) * 0.25;
      (chargeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
    }
  });

  return (
    <group position={[0, 1.35, z + 0.2]} scale={[ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE]}>
      <Exhibit
        title="Vehicule Electrique"
        detail="Un chassis leger combine aerodynamique efficiente et gestion avancee de la batterie."
        roomActive={roomActive}
        position={[-3.2, 0.05, 0.25]}
        calloutOffset={[0, 1.4, 0]}
      >
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[1.95, 0.45, 0.95]} />
          <meshStandardMaterial
            color="#9ee3ff"
            metalness={0.36}
            roughness={0.28}
            emissive="#2e6f90"
            emissiveIntensity={0.18}
          />
        </mesh>
        <mesh position={[0.2, 0.6, 0]}>
          <boxGeometry args={[1.1, 0.35, 0.82]} />
          <meshStandardMaterial color="#d9f4ff" metalness={0.08} roughness={0.16} />
        </mesh>
        {[-0.67, 0.67].map((x) =>
          [-0.42, 0.42].map((zWheel) => (
            <mesh
              key={`wheel-${x}-${zWheel}`}
              position={[x, 0.04, zWheel]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.2, 0.08, 12, 24]} />
              <meshStandardMaterial color="#1a222f" metalness={0.3} roughness={0.72} />
            </mesh>
          ))
        )}
      </Exhibit>

      <Exhibit
        title="Borne de Recharge"
        detail="La recharge intelligente equilibre la charge du reseau et les besoins des vehicules en temps reel."
        roomActive={roomActive}
        position={[-1.1, 0.2, 0.25]}
        calloutOffset={[0, 1.5, 0]}
      >
        <mesh>
          <boxGeometry args={[0.44, 1.35, 0.35]} />
          <meshStandardMaterial
            color="#c8dbe4"
            metalness={0.45}
            roughness={0.4}
            emissive="#2f5466"
            emissiveIntensity={0.12}
          />
        </mesh>
        <mesh ref={chargeRef} position={[0, 0.45, 0.2]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#88ffe2" emissive="#65ffd4" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.18, -0.1, 0.2]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <torusGeometry args={[0.22, 0.03, 8, 40, Math.PI]} />
          <meshStandardMaterial color="#3f5467" metalness={0.35} roughness={0.5} />
        </mesh>
      </Exhibit>

      <Exhibit
        title="Module Batterie"
        detail="Des cellules segmentees illustrent le stockage modulaire et l'equilibrage de charge."
        roomActive={roomActive}
        position={[1.35, 0.15, 0.2]}
        calloutOffset={[0, 1.4, 0]}
      >
        <mesh>
          <boxGeometry args={[1.6, 0.55, 0.9]} />
          <meshStandardMaterial
            color="#95adc0"
            metalness={0.42}
            roughness={0.39}
            emissive="#2c536a"
            emissiveIntensity={0.11}
          />
        </mesh>
        {[-0.52, -0.2, 0.12, 0.44].map((x, idx) => (
          <mesh key={`cell-${idx}`} position={[x, 0.18, 0.31]}>
            <boxGeometry args={[0.2, 0.18, 0.08]} />
            <meshStandardMaterial color="#8cfde9" emissive="#66ffe2" emissiveIntensity={0.42} />
          </mesh>
        ))}
      </Exhibit>

      <Exhibit
        title="Hydrogene + Captage Carbone"
        detail="Piles hydrogene et tours de captage soutiennent la decarbonation industrielle."
        roomActive={roomActive}
        position={[3.5, 0.32, 0.3]}
        calloutOffset={[0, 2.1, 0]}
      >
        <mesh position={[-0.45, 0.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.95, 18]} />
          <meshStandardMaterial color="#cde7f2" metalness={0.35} roughness={0.42} />
        </mesh>
        <mesh position={[0.3, 0.72, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 1.55, 22]} />
          <meshStandardMaterial color="#90adc2" metalness={0.32} roughness={0.45} />
        </mesh>
        <mesh ref={ringRef} position={[0.3, 1.45, 0]}>
          <torusGeometry args={[0.48, 0.08, 12, 44]} />
          <meshStandardMaterial color="#affff1" emissive="#6af8ff" emissiveIntensity={0.7} />
        </mesh>
      </Exhibit>
    </group>
  );
}

function FutureRoom({ z, roomActive }: { z: number; roomActive: boolean }) {
  const transitRef = useRef<THREE.Group>(null);
  const microWindRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (transitRef.current) {
      transitRef.current.children.forEach((pod, idx) => {
        const angle = state.clock.elapsedTime * 0.58 + idx * (Math.PI / 2);
        pod.position.x = Math.cos(angle) * 1.95;
        pod.position.z = Math.sin(angle) * 1.95;
        pod.position.y = 0.08 + Math.sin(angle * 2) * 0.05;
      });
    }

    if (microWindRef.current) {
      microWindRef.current.rotation.y += delta * 2.1;
    }
  });

  return (
    <group position={[0, 1.35, z + 0.75]} scale={[ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE, ROOM_OBJECT_SCALE]}>
      <mesh position={[0, -0.35, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.6, 48]} />
        <meshStandardMaterial color="#173d53" roughness={0.68} metalness={0.18} />
      </mesh>

      <Exhibit
        title="Quartier Net-Zero"
        detail="Des batiments mixtes combinent efficacite, production locale et pilotage de quartier."
        roomActive={roomActive}
        position={[0, 0.08, 0.28]}
        calloutOffset={[0, 2.4, 0]}
      >
        {[
          { x: -1.9, h: 1.8, w: 0.62 },
          { x: -1.15, h: 2.2, w: 0.66 },
          { x: -0.35, h: 2.7, w: 0.72 },
          { x: 0.55, h: 3.05, w: 0.76 },
          { x: 1.45, h: 3.35, w: 0.8 },
        ].map((item, idx) => (
          <group key={`building-${idx}`} position={[item.x, 0, 0]}>
            <mesh position={[0, item.h / 2, 0]}>
              <boxGeometry args={[item.w, item.h, 0.78]} />
              <meshStandardMaterial color="#225573" metalness={0.38} roughness={0.46} />
            </mesh>
            <mesh
              position={[0, item.h + 0.06, 0.08]}
              rotation={[-0.35, 0, 0]}
            >
              <boxGeometry args={[item.w * 0.68, 0.05, 0.3]} />
              <meshStandardMaterial
                color="#1e3a58"
                emissive="#4bcfff"
                emissiveIntensity={0.4}
              />
            </mesh>
            <mesh position={[0, item.h * 0.55, 0.4]}>
              <boxGeometry args={[item.w * 0.62, item.h * 0.35, 0.03]} />
              <meshStandardMaterial color="#87deff" emissive="#66d7ff" emissiveIntensity={0.35} />
            </mesh>
          </group>
        ))}
      </Exhibit>

      <Exhibit
        title="Boucle de Transport Electrique"
        detail="Des capsules autonomes circulent sur un anneau de mobilite a faibles emissions."
        roomActive={roomActive}
        position={[2.35, 0.08, 0.22]}
        calloutOffset={[0, 1.8, 0]}
      >
        <Torus args={[1.95, 0.08, 16, 90]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#c8fffb" emissive="#73f5ff" emissiveIntensity={0.72} />
        </Torus>
        <group ref={transitRef}>
          {[0, 1, 2, 3].map((idx) => (
            <mesh key={`pod-${idx}`} position={[0, 0, 0]}>
              <sphereGeometry args={[0.17, 14, 14]} />
              <meshStandardMaterial color="#f0fffd" emissive="#97ffef" emissiveIntensity={0.85} />
            </mesh>
          ))}
        </group>
      </Exhibit>

      <Exhibit
        title="Corridors Vegetalises"
        detail="Les corridors vegetaux rafraichissent les quartiers et renforcent la resilience climatique."
        roomActive={roomActive}
        position={[-2.45, -0.14, 0.24]}
        calloutOffset={[0, 1.5, 0]}
      >
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.6, 0.18, 1.35]} />
          <meshStandardMaterial color="#2b6e62" roughness={0.72} metalness={0.12} />
        </mesh>
        {[-0.95, -0.35, 0.25, 0.82].map((x, idx) => (
          <group key={`tree-${idx}`} position={[x, 0, idx % 2 === 0 ? 0.2 : -0.2]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.45, 8]} />
              <meshStandardMaterial color="#5a3f2b" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <coneGeometry args={[0.23, 0.4, 8]} />
              <meshStandardMaterial color="#57c28f" emissive="#2c8f66" emissiveIntensity={0.25} />
            </mesh>
          </group>
        ))}
      </Exhibit>

      <group ref={microWindRef} position={[0.05, 2.58, 0.2]}>
        <mesh>
          <boxGeometry args={[0.75, 0.06, 0.08]} />
          <meshStandardMaterial color="#def7ff" emissive="#8be9ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.75, 0.06, 0.08]} />
          <meshStandardMaterial color="#def7ff" emissive="#8be9ff" emissiveIntensity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export default function MuseumScene({ rooms, progress, activeRoomIndex }: MuseumSceneProps) {
  const fog = useMemo(() => new THREE.FogExp2("#071126", 0.022), []);

  useFrame(({ camera }, delta) => {
    const pathLength = ROOM_DEPTH * (rooms.length - 1);
    const targetZ = 10 - progress * pathLength;
    const targetX = Math.sin(progress * Math.PI * 6) * 0.85;
    const targetY = 2.8 + Math.sin(progress * Math.PI * 4.5) * 0.26 + progress * 0.7;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.1, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.5, delta);

    camera.lookAt(targetX * 0.35, 2.05, targetZ - 10);
  });

  return (
    <>
      <color attach="background" args={["#06142a"]} />
      <primitive attach="fog" object={fog} />
      <ambientLight intensity={0.55} color="#a4cdf3" />
      <hemisphereLight args={["#d8fbff", "#0f2137", 0.52]} />
      <directionalLight position={[6, 10, 8]} intensity={1.55} color="#e2fcff" />
      <pointLight position={[-4.5, 3.2, -4]} intensity={1.05} color="#6ffff0" distance={30} />
      <pointLight position={[4.2, 3.1, -32]} intensity={0.92} color="#7ad8ff" distance={30} />
      <pointLight position={[0, 3.4, -58]} intensity={0.88} color="#83f5ff" distance={30} />
      <pointLight position={[0, 3.4, -86]} intensity={0.84} color="#84ffe1" distance={30} />
      <pointLight position={[0, 3.4, -114]} intensity={0.8} color="#8fe8ff" distance={30} />
      <Stars radius={130} depth={60} count={1150} factor={4} saturation={0.18} speed={0.2} />
      <Environment preset="night" />

      {rooms.map((room, index) => (
        <RoomFrame
          key={room.id}
          room={room}
          index={index}
          isActive={activeRoomIndex === index}
        />
      ))}

      <IntroRoom z={0} roomActive={activeRoomIndex === 0} />
      <RenewableRoom z={-ROOM_DEPTH} roomActive={activeRoomIndex === 1} />
      <SmartInfrastructureRoom z={-ROOM_DEPTH * 2} roomActive={activeRoomIndex === 2} />
      <GreenInnovationRoom z={-ROOM_DEPTH * 3} roomActive={activeRoomIndex === 3} />
      <FutureRoom z={-ROOM_DEPTH * 4} roomActive={activeRoomIndex === 4} />

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </>
  );
}
