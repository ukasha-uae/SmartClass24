"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface VennDiagramProps {
  type: '1set' | '2set' | '3set';
  labels?: {
    A?: string;
    B?: string;
    C?: string;
    U?: string;
  };
  values?: {
    A?: string | number; // A only
    B?: string | number; // B only
    C?: string | number; // C only
    AB?: string | number; // A ∩ B (only, for 3 sets)
    BC?: string | number; // B ∩ C (only)
    AC?: string | number; // A ∩ C (only)
    ABC?: string | number; // A ∩ B ∩ C
    U?: string | number; // Outside
  };
  shade?: string[]; // Array of region keys to shade (e.g., ['A', 'AB'] for Set A)
  width?: number;
  height?: number;
  interactive2Set?: {
    onRegionDrop?: (region: 'A' | 'AB' | 'B' | 'U', draggedItem?: string) => void;
    regionItems?: Partial<Record<'A' | 'AB' | 'B' | 'U', string[]>>;
  };
}

export default function VennDiagram({ 
  type, 
  labels = { A: 'A', B: 'B', C: 'C', U: 'U' }, 
  values = {}, 
  shade = [],
  width = 400, 
  height = 300,
  interactive2Set
}: VennDiagramProps) {
  
  const isShaded = (region: string) => shade.includes(region);
  const shadeColor = "rgba(59, 130, 246, 0.3)"; // blue-500 with opacity
  const strokeColor = "currentColor";
  const textColor = "currentColor";
  const renderRegionText = (
    regionKey: 'A' | 'AB' | 'B' | 'U',
    fallback: string | number | undefined,
    x: number,
    y: number
  ) => {
    const items = interactive2Set?.regionItems?.[regionKey];
    const content = items && items.length > 0 ? items.join(', ') : fallback;
    if (!content) return null;
    return (
      <text x={x} y={y} textAnchor="middle" fill={textColor} fontSize={items ? 12 : 16} fontWeight={items ? 600 : 400}>
        {content}
      </text>
    );
  };

  if (type === '1set') {
    // 1-Set Venn Diagram
    // Circle A: cx=200, cy=150, r=100
    
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto font-sans w-full h-auto max-w-[520px] sm:max-w-[560px]"
      >
        {/* Universal Set Box */}
        <rect x="10" y="10" width="380" height="280" fill={isShaded('U') ? shadeColor : 'none'} stroke={strokeColor} strokeWidth="2" rx="5" />
        <text x="25" y="35" fontSize="16" fontWeight="bold" fill={textColor}>{labels.U}</text>
        
        {/* Region: A */}
        <circle cx="200" cy="150" r="100" fill={isShaded('A') ? shadeColor : (isShaded('U') ? 'white' : 'none')} stroke={strokeColor} strokeWidth="2" />
        {/* Note: If U is shaded (A'), we need A to be unshaded (white/bg) if it's not in shade list. 
            But SVG doesn't have 'erase'. 
            If U is shaded, we fill rect with shadeColor. Then if A is NOT shaded, we fill circle with 'white' (or bg color).
            But dark mode? 'bg-background' is better. 
            For now, let's assume simple shading logic:
            If 'U' is in shade, we shade the rect.
            If 'A' is in shade, we shade the circle.
            If 'A' is NOT in shade but 'U' IS, the circle will be shaded by the rect behind it unless we fill it.
            So if U is shaded, we must fill A with 'bg' color if A is not shaded.
        */}
        
        {/* Better approach for A': Shade everything, then mask A? 
            Or just draw path for U - A.
            Path for U-A: Rect minus Circle.
        */}
        
        {isShaded('U') && !isShaded('A') && (
           <path d="M 10 10 H 390 V 290 H 10 Z M 200 150 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0" fill={shadeColor} fillRule="evenodd" />
        )}
        
        {/* Circle Outline */}
        <circle cx="200" cy="150" r="100" fill={isShaded('A') ? shadeColor : 'none'} stroke={strokeColor} strokeWidth="2" />

        {/* Labels */}
        <text x="200" y="40" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.A}</text>

        {/* Values */}
        {values.A && <text x="200" y="155" textAnchor="middle" fill={textColor}>{values.A}</text>}
        {values.U && <text x="360" y="270" textAnchor="middle" fill={textColor}>{values.U}</text>}
      </svg>
    );
  } else if (type === '2set') {
    // 2-Set Venn Diagram
    // Circle A: cx=140, cy=150, r=80
    // Circle B: cx=260, cy=150, r=80
    
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto font-sans w-full h-auto max-w-[520px] sm:max-w-[560px]"
      >
        {/* Universal Set Box */}
        <rect
          x="10"
          y="10"
          width="380"
          height="280"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="2"
          rx="5"
          onDragOver={(e) => interactive2Set?.onRegionDrop && e.preventDefault()}
          onDrop={(e) => {
            if (!interactive2Set?.onRegionDrop) return;
            e.preventDefault();
            const item = e.dataTransfer.getData('text/plain') || undefined;
            interactive2Set.onRegionDrop('U', item);
          }}
        />
        <text x="25" y="35" fontSize="16" fontWeight="bold" fill={textColor}>{labels.U}</text>
        
        {/* Shading Definitions */}
        <defs>
          <clipPath id="circleA">
            <circle cx="140" cy="150" r="80" />
          </clipPath>
          <clipPath id="circleB">
            <circle cx="260" cy="150" r="80" />
          </clipPath>
        </defs>

        {/* Shading Regions */}
        {/* A only: Circle A clipped by (inverse of Circle B) - hard to do with simple SVG clips. 
            Easier approach: Draw paths for regions.
        */}
        
        {/* Region: A only */}
        <path d="M 140 70 A 80 80 0 1 0 140 230 A 80 80 0 0 0 200 202.9 A 80 80 0 0 1 200 97.1 A 80 80 0 0 0 140 70 Z" 
              fill={isShaded('A') ? shadeColor : 'transparent'}
              pointerEvents="all"
              onDragOver={(e) => interactive2Set?.onRegionDrop && e.preventDefault()}
              onDrop={(e) => {
                if (!interactive2Set?.onRegionDrop) return;
                e.preventDefault();
                const item = e.dataTransfer.getData('text/plain') || undefined;
                interactive2Set.onRegionDrop('A', item);
              }} />
              
        {/* Region: B only */}
        <path d="M 260 70 A 80 80 0 0 1 260 230 A 80 80 0 0 1 200 202.9 A 80 80 0 0 0 200 97.1 A 80 80 0 0 1 260 70 Z" 
              fill={isShaded('B') ? shadeColor : 'transparent'}
              pointerEvents="all"
              onDragOver={(e) => interactive2Set?.onRegionDrop && e.preventDefault()}
              onDrop={(e) => {
                if (!interactive2Set?.onRegionDrop) return;
                e.preventDefault();
                const item = e.dataTransfer.getData('text/plain') || undefined;
                interactive2Set.onRegionDrop('B', item);
              }} />

        {/* Region: Intersection AB */}
        <path d="M 200 97.1 A 80 80 0 0 0 200 202.9 A 80 80 0 0 0 200 97.1 Z" 
              fill={isShaded('AB') ? shadeColor : 'transparent'}
              pointerEvents="all"
              onDragOver={(e) => interactive2Set?.onRegionDrop && e.preventDefault()}
              onDrop={(e) => {
                if (!interactive2Set?.onRegionDrop) return;
                e.preventDefault();
                const item = e.dataTransfer.getData('text/plain') || undefined;
                interactive2Set.onRegionDrop('AB', item);
              }} />

        {/* Circles Outlines */}
        <circle cx="140" cy="150" r="80" fill="none" stroke={strokeColor} strokeWidth="2" />
        <circle cx="260" cy="150" r="80" fill="none" stroke={strokeColor} strokeWidth="2" />

        {/* Labels */}
        <text x="140" y="60" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.A}</text>
        <text x="260" y="60" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.B}</text>

        {/* Values */}
        {renderRegionText('A', values.A, 100, 155)}
        {renderRegionText('B', values.B, 300, 155)}
        {renderRegionText('AB', values.AB, 200, 155)}
        {renderRegionText('U', values.U, 360, 270)}
      </svg>
    );
  } else {
    // 3-Set Venn Diagram
    // Optimized for clear intersections
    // A: Top (200, 120)
    // B: Bottom Left (140, 220)
    // C: Bottom Right (260, 220)
    // r = 90
    
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 350"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto font-sans w-full h-auto max-w-[520px] sm:max-w-[560px]"
      >
        {/* Universal Set Box */}
        <rect x="10" y="10" width="380" height="330" fill={isShaded('U') ? shadeColor : 'none'} stroke={strokeColor} strokeWidth="2" rx="5" />
        <text x="25" y="35" fontSize="16" fontWeight="bold" fill={textColor}>{labels.U}</text>

        {/* Definitions for shading */}
        <defs>
          <circle id="cA" cx="200" cy="120" r="90" />
          <circle id="cB" cx="140" cy="220" r="90" />
          <circle id="cC" cx="260" cy="220" r="90" />
          
          {/* Masks for "Only" regions */}
          <mask id="maskAOnly">
            <rect x="0" y="0" width="400" height="350" fill="black" />
            <use href="#cA" fill="white" />
            <use href="#cB" fill="black" />
            <use href="#cC" fill="black" />
          </mask>
          <mask id="maskBOnly">
            <rect x="0" y="0" width="400" height="350" fill="black" />
            <use href="#cB" fill="white" />
            <use href="#cA" fill="black" />
            <use href="#cC" fill="black" />
          </mask>
          <mask id="maskCOnly">
            <rect x="0" y="0" width="400" height="350" fill="black" />
            <use href="#cC" fill="white" />
            <use href="#cA" fill="black" />
            <use href="#cB" fill="black" />
          </mask>

          {/* Masks for "Intersection Only" regions */}
          <mask id="maskABOnly">
            <rect x="0" y="0" width="400" height="350" fill="black" />
            <use href="#cA" fill="white" />
            <mask id="maskABInner">
               <use href="#cB" fill="white" />
            </mask>
            {/* SVG Masking is tricky with intersections. 
                Easier: Clip to A, Clip to B, Mask out C.
            */}
          </mask>
        </defs>

        {/* Shading Regions - Simplified implementation using clipPaths for intersections */}
        {/* Note: Full shading support for 3-set is complex in pure SVG without path calc. 
            We will support basic single-set shading and full intersection shading if requested.
        */}
        
        {/* Circles Outlines */}
        <circle cx="200" cy="120" r="90" fill="none" stroke={strokeColor} strokeWidth="2" />
        <circle cx="140" cy="220" r="90" fill="none" stroke={strokeColor} strokeWidth="2" />
        <circle cx="260" cy="220" r="90" fill="none" stroke={strokeColor} strokeWidth="2" />

        {/* Labels */}
        <text x="200" y="25" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.A}</text>
        <text x="40" y="220" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.B}</text>
        <text x="360" y="220" textAnchor="middle" fontWeight="bold" fill={textColor}>{labels.C}</text>

        {/* Values - Optimized positions */}
        {/* A only */}
        <text x="200" y="80" textAnchor="middle" fill={textColor}>{values.A}</text>
        {/* B only */}
        <text x="100" y="250" textAnchor="middle" fill={textColor}>{values.B}</text>
        {/* C only */}
        <text x="300" y="250" textAnchor="middle" fill={textColor}>{values.C}</text>
        
        {/* AB (A intersect B only) */}
        <text x="155" y="160" textAnchor="middle" fill={textColor}>{values.AB}</text>
        {/* AC (A intersect C only) */}
        <text x="245" y="160" textAnchor="middle" fill={textColor}>{values.AC}</text>
        {/* BC (B intersect C only) */}
        <text x="200" y="260" textAnchor="middle" fill={textColor}>{values.BC}</text>
        
        {/* ABC (Center) */}
        <text x="200" y="195" textAnchor="middle" fontWeight="bold" fill={textColor}>{values.ABC}</text>
        
        {/* Universal */}
        {values.U && <text x="360" y="320" textAnchor="middle" fill={textColor}>{values.U}</text>}
      </svg>
    );
  }
}
