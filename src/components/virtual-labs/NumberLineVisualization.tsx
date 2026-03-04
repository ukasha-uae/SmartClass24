'use client';

import { type InequalityOperator } from '@/lib/math-lab/equation-engine';

interface NumberLineVisualizationProps {
  value: number;
  operator: InequalityOperator;
  min?: number;
  max?: number;
}

export function NumberLineVisualization({ 
  value, 
  operator, 
  min = value - 10, 
  max = value + 10 
}: NumberLineVisualizationProps) {
  // Calculate position as percentage
  const range = max - min;
  const position = ((value - min) / range) * 100;
  
  // Determine if circle should be filled (≤, ≥) or hollow (<, >)
  const isFilled = operator === '≤' || operator === '≥';
  
  // Determine shading direction
  const shadeLeft = operator === '<' || operator === '≤';
  const shadeRight = operator === '>' || operator === '≥';
  
  // Generate tick marks
  const ticks = [];
  const tickCount = 11;
  for (let i = 0; i < tickCount; i++) {
    const tickValue = min + (range * i / (tickCount - 1));
    const tickPos = (i / (tickCount - 1)) * 100;
    ticks.push({
      value: Math.round(tickValue * 10) / 10,
      position: tickPos,
      isMainValue: Math.abs(tickValue - value) < 0.1,
    });
  }
  
  return (
    <div className="w-full py-6">
      <div className="relative h-16">
        {/* Number line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-400 dark:bg-gray-600" />
        
        {/* Shading */}
        {shadeLeft && (
          <div 
            className="absolute top-8 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
            style={{ width: `${position}%` }}
          />
        )}
        {shadeRight && (
          <div 
            className="absolute top-8 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
            style={{ width: `${100 - position}%` }}
          />
        )}
        
        {/* Tick marks and labels */}
        {ticks.map((tick, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: `${tick.position}%`, transform: 'translateX(-50%)' }}
          >
            <div 
              className={`w-0.5 ${tick.isMainValue ? 'h-4 bg-blue-600 dark:bg-blue-400' : 'h-2 bg-gray-400 dark:bg-gray-600'}`}
              style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)' }}
            />
            {(tick.isMainValue || index === 0 || index === tickCount - 1) && (
              <div 
                className={`text-xs ${tick.isMainValue ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                style={{ position: 'absolute', top: '42px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
              >
                {tick.value}
              </div>
            )}
          </div>
        ))}
        
        {/* Main point */}
        <div
          className="absolute top-8 z-10"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div 
            className={`w-4 h-4 rounded-full border-2 border-blue-600 dark:border-blue-400 ${
              isFilled ? 'bg-blue-600 dark:bg-blue-400' : 'bg-white dark:bg-gray-900'
            }`}
          />
        </div>
      </div>
      
      {/* Solution text */}
      <div className="mt-8 text-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Solution: <span className="text-blue-600 dark:text-blue-400 font-bold">x {operator} {value}</span>
        </span>
      </div>
    </div>
  );
}
