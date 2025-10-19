import React, { useState, useEffect, useRef } from "react";
interface SuperclusterAnimationProps {
  onMouseMove?: (pos: { x: number; y: number }) => void;
}

export default function SuperclusterAnimation({
  onMouseMove,
}: SuperclusterAnimationProps) {
  const [mousePos, setMousePos] = useState({ x: 300, y: 300 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [activeRing, setActiveRing] = useState<number | null>(null);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 600;
        const y = ((e.clientY - rect.top) / rect.height) * 600;
        setMousePos({ x, y });
      }

      // Pass mouse position to parent
      if (onMouseMove) {
        onMouseMove({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [onMouseMove]);

  // Generate node data
  const nodes = Array.from({ length: 30 }).map((_, i) => {
    const angle = (i * 360) / 30;
    const radius = 100 + Math.random() * 150;
    const x = 300 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 300 + radius * Math.sin((angle * Math.PI) / 180);
    const size = 3 + Math.random() * 6;

    return { angle, radius, x, y, size, id: i };
  });

  const getDistanceToMouse = (x: number, y: number) => {
    return Math.sqrt(Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2));
  };

  return (
    <div className="relative h-[600px] hidden lg:block group">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        viewBox="0 0 600 600"
      >
        <defs>
          <radialGradient id="centralGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor="#3b82f6"
              stopOpacity={pulseIntensity}
            />
            <stop
              offset="100%"
              stopColor="#06b6d4"
              stopOpacity={pulseIntensity * 0.8}
            />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="mouseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Mouse proximity glow */}
        <circle
          cx={mousePos.x}
          cy={mousePos.y}
          r="80"
          fill="url(#mouseGlow)"
          className="transition-all duration-300"
          style={{
            opacity: pulseIntensity * 0.6,
          }}
        />

        {/* Orbital Rings with interaction */}
        {[1, 2, 3].map((ring) => {
          const ringRadius = 80 * ring;
          const distanceToRing = Math.abs(
            Math.sqrt(
              Math.pow(mousePos.x - 300, 2) + Math.pow(mousePos.y - 300, 2)
            ) - ringRadius
          );
          const isNear = distanceToRing < 50;

          return (
            <circle
              key={ring}
              cx="300"
              cy="300"
              r={ringRadius}
              fill="none"
              stroke={
                activeRing === ring
                  ? "rgba(59, 130, 246, 0.6)"
                  : isNear
                  ? "rgba(59, 130, 246, 0.4)"
                  : "rgba(59, 130, 246, 0.2)"
              }
              strokeWidth={isNear ? "2" : "1"}
              strokeDasharray="5,5"
              className="transition-all duration-300"
              style={{
                animation: `spin ${20 + ring * 10}s linear infinite`,
                transformOrigin: "center",
                filter: isNear ? "url(#glow)" : "none",
              }}
              onMouseEnter={() => setActiveRing(ring)}
              onMouseLeave={() => setActiveRing(null)}
            />
          );
        })}

        {/* Cluster Nodes with interaction */}
        {nodes.map((node) => {
          const distance = getDistanceToMouse(node.x, node.y);
          const isClose = distance < 80;
          const isHovered = hoveredNode === node.id;
          const scale = isHovered ? 2 : isClose ? 1.5 : 1;
          const opacity = isHovered ? 1 : isClose ? 0.9 : 0.7;

          // Calculate attraction to mouse
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const attraction = isClose ? Math.min(distance / 80, 1) : 0;
          const offsetX = (dx / distance) * (1 - attraction) * 20;
          const offsetY = (dy / distance) * (1 - attraction) * 20;

          return (
            <g
              key={node.id}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Connection line */}
              <line
                x1="300"
                y1="300"
                x2={node.x + (isClose ? offsetX : 0)}
                y2={node.y + (isClose ? offsetY : 0)}
                stroke={
                  isHovered
                    ? "rgba(59, 130, 246, 0.6)"
                    : isClose
                    ? "rgba(59, 130, 246, 0.3)"
                    : "rgba(59, 130, 246, 0.1)"
                }
                strokeWidth={isHovered ? "2" : "1"}
                className="transition-all duration-300"
              />

              {/* Node circle */}
              <circle
                cx={node.x + (isClose ? offsetX : 0)}
                cy={node.y + (isClose ? offsetY : 0)}
                r={node.size * scale}
                fill={
                  node.id % 3 === 0
                    ? "#3b82f6"
                    : node.id % 3 === 1
                    ? "#06b6d4"
                    : "#60a5fa"
                }
                opacity={opacity}
                filter={isHovered || isClose ? "url(#glow)" : "none"}
                className="transition-all duration-300"
              />

              {/* Outer ring on hover */}
              {(isHovered || isClose) && (
                <circle
                  cx={node.x + (isClose ? offsetX : 0)}
                  cy={node.y + (isClose ? offsetY : 0)}
                  r={node.size * scale + 4}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  opacity={isHovered ? 0.8 : 0.4}
                  className="animate-ping"
                  style={{
                    animationDuration: "2s",
                  }}
                />
              )}

              {/* Connection to nearby nodes */}
              {isHovered &&
                nodes
                  .filter((n) => n.id !== node.id)
                  .filter((n) => {
                    const dist = Math.sqrt(
                      Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2)
                    );
                    return dist < 120;
                  })
                  .map((nearNode) => (
                    <line
                      key={`connection-${node.id}-${nearNode.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={nearNode.x}
                      y2={nearNode.y}
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                  ))}
            </g>
          );
        })}
      </svg>

      {/* Dynamic Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div
          className="text-sm text-blue-300 font-semibold tracking-wider transition-all duration-300"
          style={{
            opacity: pulseIntensity,
            transform: `scale(${0.8 + pulseIntensity * 0.2})`,
            textShadow: `0 0 ${20 * pulseIntensity}px rgba(59, 130, 246, 0.8)`,
          }}
        >
          SUPERCLUSTER
        </div>
      </div>

      {/* Particle effects on edges */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50"
            style={{
              animation: `float-${i % 3} ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float-0 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -50px) scale(1.5);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, 60px) scale(1.2);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 30px) scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
