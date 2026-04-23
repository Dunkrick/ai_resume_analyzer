import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Semantic Coloring based on score
  let strokeColor = "#10B981"; // Emerald green for high scores
  if (score < 60) {
      strokeColor = "#EF4444"; // Red for low scores
  } else if (score < 80) {
      strokeColor = "#F59E0B"; // Amber for medium scores
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc with rounded ends */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-2xl font-bold pt-4 text-slate-800" style={{ color: strokeColor }}>{score}<span className="text-sm text-slate-400 font-medium">/100</span></div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;