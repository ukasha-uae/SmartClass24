import React from 'react';

interface TreeNode {
  label: string;
  probability?: string;
  children?: TreeNode[];
}

interface SetBox {
  name: string;
  color: string;
  stroke: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface Annotation {
  text: string;
  x: number;
  y: number;
  color?: string;
}

interface Shape {
  type: 'polygon' | 'line' | 'circle';
  points?: Array<[number, number]>; // For polygon vertices [(x1,y1), (x2,y2), ...]
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  label?: string;
  dashed?: boolean;
  x1?: number; // For line
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number; // For circle
  cy?: number;
  r?: number;
}

interface GeometryDiagramProps {
  type: 'triangle' | 'quadrilateral' | 'polygon' | 'circle' | 'construction' | 'custom' | 'pie-chart' | 'bar-chart' | 'histogram' | 'stem-and-leaf' | 'table' | 'tree-diagram' | 'nested-sets';
  variant?: string; // e.g., 'equilateral', 'right', 'square'
  labels?: Record<string, string>; // e.g., { "A": "Top", "B": "Left" }
  sideLabels?: Record<string, string>; // e.g., { "AB": "5cm" }
  angleLabels?: Record<string, string>; // e.g., { "B": "90°" }
  points?: string; // For custom polygons "x1,y1 x2,y2 ..."
  width?: number;
  height?: number;
  showDiagonals?: boolean;
  showHeight?: boolean;
  data?: Array<{ label: string; value: number; color?: string; leaves?: number[] }>;
  tableData?: { headers: string[]; rows: string[][] };
  treeData?: TreeNode;
  sets?: SetBox[];
  annotations?: Annotation[];
  shapes?: Shape[]; // For custom transformation diagrams
}

export default function GeometryDiagram(props: GeometryDiagramProps) {
  const width = props.width || 300;
  const height = props.height || 250;
  const padding = 40;

  // Helper to calculate text position with offset
  const getTextPos = (x: number, y: number, position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const offset = 15;
    switch (position) {
      case 'top': return { x, y: y - offset };
      case 'bottom': return { x, y: y + offset + 5 };
      case 'left': return { x: x - offset, y: y + 5 };
      case 'right': return { x: x + offset, y: y + 5 };
      case 'top-left': return { x: x - offset, y: y - offset };
      case 'top-right': return { x: x + offset, y: y - offset };
      case 'bottom-left': return { x: x - offset, y: y + offset };
      case 'bottom-right': return { x: x + offset, y: y + offset };
      default: return { x, y };
    }
  };

  let shapes: React.ReactNode[] = [];
  let textLabels: React.ReactNode[] = [];

  // Coordinate system: 0,0 is top-left.
  // We'll center shapes in the viewbox.

  if (props.type === 'triangle') {
    let p1 = { x: 0, y: 0 }, p2 = { x: 0, y: 0 }, p3 = { x: 0, y: 0 };
    
    if (props.variant === 'equilateral') {
      // Triangle pointing up
      const side = 150;
      const h = side * (Math.sqrt(3) / 2);
      p1 = { x: width / 2, y: (height - h) / 2 }; // Top
      p2 = { x: (width - side) / 2, y: (height + h) / 2 }; // Bottom Left
      p3 = { x: (width + side) / 2, y: (height + h) / 2 }; // Bottom Right
    } else if (props.variant === 'right') {
      // Right angle at bottom-left (B)
      const base = 120;
      const perp = 160;
      p2 = { x: (width - base) / 2, y: (height + perp) / 2 - 20 }; // Bottom Left (90 deg)
      p3 = { x: p2.x + base, y: p2.y }; // Bottom Right
      p1 = { x: p2.x, y: p2.y - perp }; // Top Left
    } else if (props.variant === 'isosceles') {
      // Tall triangle
      const base = 100;
      const h = 160;
      p1 = { x: width / 2, y: (height - h) / 2 };
      p2 = { x: (width - base) / 2, y: (height + h) / 2 };
      p3 = { x: (width + base) / 2, y: (height + h) / 2 };
    } else {
      // Scalene / Generic
      p1 = { x: width / 2 - 20, y: 40 };
      p2 = { x: 60, y: 200 };
      p3 = { x: 240, y: 200 };
    }

    // Draw Triangle
    shapes.push(
      <polygon
        key="poly"
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-800 dark:text-slate-200"
      />
    );

    // Right Angle Marker
    if (props.variant === 'right') {
      const size = 15;
      shapes.push(
        <path
          key="right-angle"
          d={`M ${p2.x + size} ${p2.y} L ${p2.x + size} ${p2.y - size} L ${p2.x} ${p2.y - size}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      );
    }

    // Vertex Labels
    if (props.labels) {
      const l1 = getTextPos(p1.x, p1.y, props.variant === 'right' ? 'top-left' : 'top');
      const l2 = getTextPos(p2.x, p2.y, 'bottom-left');
      const l3 = getTextPos(p3.x, p3.y, 'bottom-right');

      if (props.labels.A) textLabels.push(<text key="tA" x={l1.x} y={l1.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.A}</text>);
      if (props.labels.B) textLabels.push(<text key="tB" x={l2.x} y={l2.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.B}</text>);
      if (props.labels.C) textLabels.push(<text key="tC" x={l3.x} y={l3.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.C}</text>);
    }

    // Side Labels
    if (props.sideLabels) {
      // Midpoints
      const m12 = { x: (p1.x + p2.x) / 2 - 15, y: (p1.y + p2.y) / 2 };
      const m23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 + 15 };
      const m31 = { x: (p3.x + p1.x) / 2 + 15, y: (p3.y + p1.y) / 2 };

      const labelAB = props.sideLabels.c || props.sideLabels.AB;
      const labelBC = props.sideLabels.a || props.sideLabels.BC;
      const labelAC = props.sideLabels.b || props.sideLabels.AC || props.sideLabels.CA;

      if (labelAB) textLabels.push(<text key="sl1" x={m12.x} y={m12.y} textAnchor="middle" className="fill-current text-xs">{labelAB}</text>);
      if (labelBC) textLabels.push(<text key="sl2" x={m23.x} y={m23.y} textAnchor="middle" className="fill-current text-xs">{labelBC}</text>);
      if (labelAC) textLabels.push(<text key="sl3" x={m31.x} y={m31.y} textAnchor="middle" className="fill-current text-xs">{labelAC}</text>);
    }
  }

  if (props.type === 'quadrilateral') {
    let p1 = { x: 0, y: 0 }, p2 = { x: 0, y: 0 }, p3 = { x: 0, y: 0 }, p4 = { x: 0, y: 0 };
    const cx = width / 2;
    const cy = height / 2;

    if (props.variant === 'square') {
      const s = 120;
      p1 = { x: cx - s/2, y: cy - s/2 };
      p2 = { x: cx - s/2, y: cy + s/2 };
      p3 = { x: cx + s/2, y: cy + s/2 };
      p4 = { x: cx + s/2, y: cy - s/2 };
    } else if (props.variant === 'rectangle') {
      const w = 160, h = 100;
      p1 = { x: cx - w/2, y: cy - h/2 };
      p2 = { x: cx - w/2, y: cy + h/2 };
      p3 = { x: cx + w/2, y: cy + h/2 };
      p4 = { x: cx + w/2, y: cy - h/2 };
    } else if (props.variant === 'parallelogram') {
      const w = 160, h = 100, skew = 40;
      p1 = { x: cx - w/2 + skew, y: cy - h/2 };
      p2 = { x: cx - w/2 - skew/2, y: cy + h/2 };
      p3 = { x: cx + w/2 - skew/2, y: cy + h/2 };
      p4 = { x: cx + w/2 + skew, y: cy - h/2 };
    } else if (props.variant === 'trapezium') {
      const topW = 100, botW = 180, h = 100;
      p1 = { x: cx - topW/2, y: cy - h/2 };
      p2 = { x: cx - botW/2, y: cy + h/2 };
      p3 = { x: cx + botW/2, y: cy + h/2 };
      p4 = { x: cx + topW/2, y: cy - h/2 };
    } else if (props.variant === 'rhombus') {
      const w = 140, h = 100;
      p1 = { x: cx, y: cy - h }; // Top
      p2 = { x: cx - w/2, y: cy }; // Left
      p3 = { x: cx, y: cy + h }; // Bottom
      p4 = { x: cx + w/2, y: cy }; // Right
    } else if (props.variant === 'kite') {
      const w = 120, hTop = 60, hBot = 120;
      p1 = { x: cx, y: cy - hTop }; // Top
      p2 = { x: cx - w/2, y: cy + (hBot - hTop)/2 }; // Left
      p3 = { x: cx, y: cy + hBot }; // Bottom
      p4 = { x: cx + w/2, y: cy + (hBot - hTop)/2 }; // Right
    }

    shapes.push(
      <polygon
        key="quad"
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-800 dark:text-slate-200"
      />
    );

    // Labels
    if (props.labels) {
      const l1 = getTextPos(p1.x, p1.y, 'top-left');
      const l2 = getTextPos(p2.x, p2.y, 'bottom-left');
      const l3 = getTextPos(p3.x, p3.y, 'bottom-right');
      const l4 = getTextPos(p4.x, p4.y, 'top-right');

      if (props.labels.A) textLabels.push(<text key="tA" x={l1.x} y={l1.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.A}</text>);
      if (props.labels.B) textLabels.push(<text key="tB" x={l2.x} y={l2.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.B}</text>);
      if (props.labels.C) textLabels.push(<text key="tC" x={l3.x} y={l3.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.C}</text>);
      if (props.labels.D) textLabels.push(<text key="tD" x={l4.x} y={l4.y} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels.D}</text>);
    }

    // Side Labels
    if (props.sideLabels) {
      const m12 = { x: (p1.x + p2.x) / 2 - 15, y: (p1.y + p2.y) / 2 };
      const m23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 + 15 };
      const m34 = { x: (p3.x + p4.x) / 2 + 15, y: (p3.y + p4.y) / 2 };
      const m41 = { x: (p4.x + p1.x) / 2, y: (p4.y + p1.y) / 2 - 15 };

      if (props.sideLabels.AB) textLabels.push(<text key="slAB" x={m12.x} y={m12.y} textAnchor="middle" className="fill-current text-xs">{props.sideLabels.AB}</text>);
      if (props.sideLabels.BC) textLabels.push(<text key="slBC" x={m23.x} y={m23.y} textAnchor="middle" className="fill-current text-xs">{props.sideLabels.BC}</text>);
      if (props.sideLabels.CD) textLabels.push(<text key="slCD" x={m34.x} y={m34.y} textAnchor="middle" className="fill-current text-xs">{props.sideLabels.CD}</text>);
      if (props.sideLabels.DA) textLabels.push(<text key="slDA" x={m41.x} y={m41.y} textAnchor="middle" className="fill-current text-xs">{props.sideLabels.DA}</text>);
    }

    // Diagonals
    if (props.showDiagonals) {
      shapes.push(
        <line key="d1" x1={p1.x} y1={p1.y} x2={p3.x} y2={p3.y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
      );
      shapes.push(
        <line key="d2" x1={p2.x} y1={p2.y} x2={p4.x} y2={p4.y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
      );
      
      // Diagonal Labels (d1, d2)
      if (props.sideLabels && props.sideLabels.d1) {
         textLabels.push(<text key="ld1" x={(p1.x+p3.x)/2} y={(p1.y+p3.y)/2 - 5} className="fill-current text-xs font-bold">{props.sideLabels.d1}</text>);
      }
      if (props.sideLabels && props.sideLabels.d2) {
         textLabels.push(<text key="ld2" x={(p2.x+p4.x)/2 + 5} y={(p2.y+p4.y)/2} className="fill-current text-xs font-bold">{props.sideLabels.d2}</text>);
      }
    }

    // Height (for Parallelogram/Trapezium)
    if (props.showHeight) {
       // Drop perp from p1 to line p2-p3 (or extension)
       // For our simple shapes, base is horizontal.
       // p1 is top-left. p2 is bottom-left.
       // Height line from p1 down to y of p2.
       shapes.push(
         <line key="h-line" x1={p1.x} y1={p1.y} x2={p1.x} y2={p2.y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
       );
       // Right angle marker
       shapes.push(
         <path key="h-angle" d={`M ${p1.x} ${p2.y-10} L ${p1.x+10} ${p2.y-10} L ${p1.x+10} ${p2.y}`} fill="none" stroke="currentColor" strokeWidth="1" />
       );
       // Label
       if (props.sideLabels && props.sideLabels.h) {
          textLabels.push(<text key="lh" x={p1.x - 10} y={(p1.y+p2.y)/2} textAnchor="end" className="fill-current text-xs">{props.sideLabels.h}</text>);
       }
    }
  }

  if (props.type === 'polygon') {
    const cx = width / 2;
    const cy = height / 2;
    const r = 80; // Radius
    let sides = 5;
    
    if (props.variant === 'hexagon') sides = 6;
    if (props.variant === 'octagon') sides = 8;
    if (props.variant === 'pentagon') sides = 5;

    let pointsStr = "";
    const vertices = [];

    // Calculate vertices
    for (let i = 0; i < sides; i++) {
      // Start from top (-90 degrees)
      const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      vertices.push({ x, y });
      pointsStr += `${x},${y} `;
    }

    shapes.push(
      <polygon
        key="poly-n"
        points={pointsStr}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-800 dark:text-slate-200"
      />
    );

    // Labels (optional, just numbering vertices or generic labels)
    if (props.labels) {
      vertices.forEach((v, i) => {
        const labelKey = String.fromCharCode(65 + i); // A, B, C...
        if (props.labels && props.labels[labelKey]) {
           // Push label out a bit
           const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
           const lx = cx + (r + 20) * Math.cos(angle);
           const ly = cy + (r + 20) * Math.sin(angle);
           textLabels.push(<text key={`l${i}`} x={lx} y={ly} textAnchor="middle" className="fill-current text-sm font-bold">{props.labels[labelKey]}</text>);
        }
      });
    }
    
    // Center label for interior angle sum
    if (props.variant) {
       textLabels.push(<text key="center" x={cx} y={cy} textAnchor="middle" className="fill-current text-xs opacity-50 capitalize">{props.variant}</text>);
    }
  }

  if (props.type === 'circle') {
    const cx = width / 2;
    const cy = height / 2;
    const r = 80;
    
    shapes.push(
      <circle
        key="circle"
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-800 dark:text-slate-200"
      />
    );
    
    // Radius line
    shapes.push(
      <line
        key="radius"
        x1={cx}
        y1={cy}
        x2={cx + r}
        y2={cy}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    );

    // Center point
    shapes.push(
      <circle key="center" cx={cx} cy={cy} r={3} fill="currentColor" />
    );

    // Labels
    if (props.labels) {
       // Center label
       if (props.labels.O) {
         textLabels.push(
           <text key="label-O" x={cx - 15} y={cy + 5} className="text-sm fill-current font-medium">{props.labels.O}</text>
         );
       }
    }
    
    if (props.sideLabels) {
        if (props.sideLabels.r) {
             textLabels.push(
               <text key="label-r" x={cx + r/2} y={cy - 5} className="text-xs fill-current">{props.sideLabels.r}</text>
             );
        }
    }
  }

  if (props.type === 'construction') {
    const cx = width / 2;
    const cy = height / 2;

    if (props.variant === 'perpendicular-bisector') {
      // Line AB
      const p1 = { x: cx - 80, y: cy };
      const p2 = { x: cx + 80, y: cy };
      
      shapes.push(<line key="line" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="currentColor" strokeWidth="2" />);
      shapes.push(<circle key="p1" cx={p1.x} cy={p1.y} r={3} fill="currentColor" />);
      shapes.push(<circle key="p2" cx={p2.x} cy={p2.y} r={3} fill="currentColor" />);
      
      // Arcs
      shapes.push(<path key="arc1" d={`M ${cx-10} ${cy-60} Q ${cx} ${cy-70} ${cx+10} ${cy-60}`} fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />);
      shapes.push(<path key="arc2" d={`M ${cx-10} ${cy+60} Q ${cx} ${cy+70} ${cx+10} ${cy+60}`} fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />);
      
      // Bisector Line
      shapes.push(<line key="bisector" x1={cx} y1={cy-80} x2={cx} y2={cy+80} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />);
      
      // Right angle
      shapes.push(<path key="ra" d={`M ${cx} ${cy-10} L ${cx+10} ${cy-10} L ${cx+10} ${cy}`} fill="none" stroke="currentColor" strokeWidth="1" />);

      if (props.labels) {
        if (props.labels.A) textLabels.push(<text key="lA" x={p1.x-10} y={p1.y+5} className="text-sm font-bold fill-current">{props.labels.A}</text>);
        if (props.labels.B) textLabels.push(<text key="lB" x={p2.x+10} y={p2.y+5} className="text-sm font-bold fill-current">{props.labels.B}</text>);
      }
    }

    if (props.variant === 'angle-bisector') {
      // Angle ABC
      const pB = { x: cx - 60, y: cy + 60 }; // Vertex
      const pA = { x: cx - 60, y: cy - 60 }; // Top arm
      const pC = { x: cx + 80, y: cy + 60 }; // Bottom arm

      shapes.push(<line key="arm1" x1={pB.x} y1={pB.y} x2={pA.x} y2={pA.y} stroke="currentColor" strokeWidth="2" />);
      shapes.push(<line key="arm2" x1={pB.x} y1={pB.y} x2={pC.x} y2={pC.y} stroke="currentColor" strokeWidth="2" />);
      
      // Arc at vertex
      shapes.push(<path key="arc-v" d={`M ${pB.x} ${pB.y-30} A 30 30 0 0 1 ${pB.x+30} ${pB.y}`} fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />);
      
      // Bisector
      const pBisect = { x: cx + 60, y: cy - 20 };
      shapes.push(<line key="bisector" x1={pB.x} y1={pB.y} x2={pBisect.x} y2={pBisect.y} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />);

      if (props.labels) {
        if (props.labels.B) textLabels.push(<text key="lB" x={pB.x-15} y={pB.y+5} className="text-sm font-bold fill-current">{props.labels.B}</text>);
      }
    }

    if (props.variant === 'angle-60') {
       const pA = { x: cx - 60, y: cy + 40 };
       const pB = { x: cx + 80, y: cy + 40 };
       const pC = { x: cx + 10, y: cy - 80 }; // Approx 60 deg

       shapes.push(<line key="base" x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="currentColor" strokeWidth="2" />);
       shapes.push(<line key="arm" x1={pA.x} y1={pA.y} x2={pC.x} y2={pC.y} stroke="currentColor" strokeWidth="2" />);
       
       // Arc
       shapes.push(<path key="arc" d={`M ${pA.x+30} ${pA.y} A 30 30 0 0 0 ${pA.x+15} ${pA.y-26}`} fill="none" stroke="currentColor" strokeWidth="1" />);
       
       textLabels.push(<text key="deg" x={pA.x+40} y={pA.y-10} className="text-xs fill-current">60°</text>);
    }

    if (props.variant === 'angle-90') {
       const pA = { x: cx - 60, y: cy + 40 };
       const pB = { x: cx + 80, y: cy + 40 };
       const pC = { x: cx + 10, y: cy + 40 }; // Center point on line
       const pD = { x: cx + 10, y: cy - 60 }; // Top point

       shapes.push(<line key="base" x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="currentColor" strokeWidth="2" />);
       shapes.push(<line key="perp" x1={pC.x} y1={pC.y} x2={pD.x} y2={pD.y} stroke="currentColor" strokeWidth="2" />);
       
       // Arcs on line
       shapes.push(<path key="arc1" d={`M ${pC.x-20} ${pC.y-5} Q ${pC.x-20} ${pC.y+5} ${pC.x-20} ${pC.y+5}`} fill="none" stroke="currentColor" strokeWidth="1" />);
       shapes.push(<path key="arc2" d={`M ${pC.x+20} ${pC.y-5} Q ${pC.x+20} ${pC.y+5} ${pC.x+20} ${pC.y+5}`} fill="none" stroke="currentColor" strokeWidth="1" />);
       
       // Crossing arcs
       shapes.push(<path key="cross1" d={`M ${pD.x-10} ${pD.y+10} Q ${pD.x} ${pD.y} ${pD.x+10} ${pD.y+10}`} fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />);
       
       // Right angle symbol
       shapes.push(<path key="ra" d={`M ${pC.x} ${pC.y-15} L ${pC.x+15} ${pC.y-15} L ${pC.x+15} ${pC.y}`} fill="none" stroke="currentColor" strokeWidth="1" />);
       
       textLabels.push(<text key="deg" x={pC.x+20} y={pC.y-20} className="text-xs fill-current">90°</text>);
    }
    
    if (props.variant === 'locus-parallel') {
       const p1 = { x: cx - 80, y: cy };
       const p2 = { x: cx + 80, y: cy };
       
       // Main line
       shapes.push(<line key="main" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="currentColor" strokeWidth="2" />);
       
       // Parallel lines
       shapes.push(<line key="p1" x1={p1.x} y1={p1.y-40} x2={p2.x} y2={p2.y-40} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />);
       shapes.push(<line key="p2" x1={p1.x} y1={p1.y+40} x2={p2.x} y2={p2.y+40} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />);
       
       // Distance arrows
       shapes.push(<line key="d1" x1={cx} y1={cy} x2={cx} y2={cy-40} stroke="currentColor" strokeWidth="1" markerEnd="url(#arrow)" />);
       textLabels.push(<text key="d-label" x={cx+5} y={cy-20} className="text-xs fill-current">d</text>);
    }
  }

  if (props.type === 'pie-chart' && props.data) {
    const cx = width / 2;
    const cy = height / 2;
    const r = 100;
    const total = props.data.reduce((sum, item) => sum + item.value, 0);
    
    let startAngle = 0;
    
    props.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Calculate coordinates
      // SVG coordinates: 0 is right (3 o'clock), clockwise is positive
      // We want to start from top (12 o'clock) usually, so subtract PI/2
      const x1 = cx + r * Math.cos(startAngle - Math.PI / 2);
      const y1 = cy + r * Math.sin(startAngle - Math.PI / 2);
      const x2 = cx + r * Math.cos(endAngle - Math.PI / 2);
      const y2 = cy + r * Math.sin(endAngle - Math.PI / 2);
      
      // Large arc flag
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
      
      // Path command
      const d = [
        `M ${cx} ${cy}`,
        `L ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      // Colors
      const colors = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
      const color = item.color || colors[index % colors.length];
      
      shapes.push(
        <path
          key={`slice-${index}`}
          d={d}
          fill={color}
          stroke="white"
          strokeWidth="2"
          className="opacity-80 hover:opacity-100 transition-opacity"
        />
      );
      
      // Label position (mid-angle)
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = r * 0.7; // Place inside
      const lx = cx + labelR * Math.cos(midAngle - Math.PI / 2);
      const ly = cy + labelR * Math.sin(midAngle - Math.PI / 2);
      
      // Percentage
      const percent = Math.round((item.value / total) * 100);
      
      textLabels.push(
        <text
          key={`label-${index}`}
          x={lx}
          y={ly}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-xs font-bold pointer-events-none"
        >
          {percent}%
        </text>
      );

      // External Label (Category Name)
      const extLabelR = r + 20;
      const elx = cx + extLabelR * Math.cos(midAngle - Math.PI / 2);
      const ely = cy + extLabelR * Math.sin(midAngle - Math.PI / 2);
      
      textLabels.push(
        <text
          key={`ext-label-${index}`}
          x={elx}
          y={ely}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-xs font-medium"
        >
          {item.label}
        </text>
      );
      
      startAngle = endAngle;
    });
  }

  if ((props.type === 'bar-chart' || props.type === 'histogram') && props.data) {
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const maxValue = Math.max(...props.data.map(d => d.value));
    const yMax = Math.ceil(maxValue * 1.1); // Add some headroom
    
    // Draw Axes
    shapes.push(
      <line
        key="y-axis"
        x1={margin.left} y1={margin.top}
        x2={margin.left} y2={height - margin.bottom}
        stroke="currentColor" strokeWidth="2"
      />
    );
    shapes.push(
      <line
        key="x-axis"
        x1={margin.left} y1={height - margin.bottom}
        x2={width - margin.right} y2={height - margin.bottom}
        stroke="currentColor" strokeWidth="2"
      />
    );

    const barCount = props.data.length;
    const isHistogram = props.type === 'histogram';
    const gap = isHistogram ? 0 : 20;
    // For histogram, we just divide space equally. For bar chart, we account for gaps.
    // Actually, let's simplify:
    // Bar chart: [gap][bar][gap][bar]...
    // Histogram: [bar][bar]...
    
    const totalGapSpace = isHistogram ? 0 : gap * (barCount + 1);
    const availableWidth = chartWidth - totalGapSpace;
    const barWidth = availableWidth / barCount;

    props.data.forEach((item, index) => {
      const barHeight = (item.value / yMax) * chartHeight;
      const x = margin.left + (isHistogram ? 0 : gap) + index * (barWidth + (isHistogram ? 0 : gap));
      const y = height - margin.bottom - barHeight;
      
      shapes.push(
        <rect
          key={`bar-${index}`}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={item.color || '#3b82f6'}
          stroke={isHistogram ? 'white' : 'none'}
          strokeWidth={isHistogram ? 1 : 0}
          className="opacity-90 hover:opacity-100 transition-opacity"
        />
      );
      
      // X-axis Label
      textLabels.push(
        <text
          key={`x-label-${index}`}
          x={x + barWidth / 2}
          y={height - margin.bottom + 20}
          textAnchor="middle"
          className="fill-current text-xs"
        >
          {item.label}
        </text>
      );
      
      // Value Label (on top of bar)
      textLabels.push(
        <text
          key={`val-label-${index}`}
          x={x + barWidth / 2}
          y={y - 5}
          textAnchor="middle"
          className="fill-current text-xs font-bold"
        >
          {item.value}
        </text>
      );
    });
  }

  if (props.type === 'stem-and-leaf' && props.data) {
    const rowHeight = 30;
    const startY = 50;
    const stemX = width / 2 - 20;
    const lineX = width / 2;
    const leafStartX = width / 2 + 20;
    
    // Vertical line
    shapes.push(
      <line
        key="divider"
        x1={lineX} y1={20}
        x2={lineX} y2={startY + props.data.length * rowHeight}
        stroke="currentColor"
        strokeWidth="2"
      />
    );

    // Headers
    textLabels.push(
      <text key="h-stem" x={stemX} y={30} textAnchor="end" className="font-bold fill-current text-sm">Stem</text>,
      <text key="h-leaf" x={leafStartX} y={30} textAnchor="start" className="font-bold fill-current text-sm">Leaf</text>
    );

    props.data.forEach((item, index) => {
      const y = startY + index * rowHeight + 15; // +15 to center text vertically in row
      
      // Stem
      textLabels.push(
        <text
          key={`stem-${index}`}
          x={stemX}
          y={y}
          textAnchor="end"
          dominantBaseline="middle"
          className="font-mono fill-current text-lg"
        >
          {item.label}
        </text>
      );

      // Leaves
      if (item.leaves) {
        // Draw each leaf with spacing
        item.leaves.forEach((leaf, leafIndex) => {
            textLabels.push(
                <text
                  key={`leaf-${index}-${leafIndex}`}
                  x={leafStartX + (leafIndex * 25)}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono fill-current text-lg"
                >
                  {leaf}
                </text>
              );
        });
      }
    });
  }

  if (props.type === 'table' && props.tableData) {
    const { headers, rows } = props.tableData;
    const rowHeight = 40;
    const colCount = headers.length;
    const tableWidth = width - 40; // 20px padding each side
    const startX = 20;
    const startY = 20;
    const colWidth = tableWidth / colCount;

    // Draw Header Row Background
    shapes.push(
      <rect
        key="header-bg"
        x={startX}
        y={startY}
        width={tableWidth}
        height={rowHeight}
        className="fill-gray-100 dark:fill-gray-800"
      />
    );

    // Draw Headers
    headers.forEach((header, i) => {
      textLabels.push(
        <text
          key={`header-${i}`}
          x={startX + i * colWidth + colWidth / 2}
          y={startY + rowHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-bold fill-gray-900 dark:fill-gray-100 text-xs"
          style={{ fontSize: '11px' }}
        >
          {header}
        </text>
      );
    });

    // Draw Rows
    rows.forEach((row, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;
      
      row.forEach((cell, colIndex) => {
        textLabels.push(
          <text
            key={`cell-${rowIndex}-${colIndex}`}
            x={startX + colIndex * colWidth + colWidth / 2}
            y={y + rowHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-sm"
            style={{ fontSize: '12px' }}
          >
            {cell}
          </text>
        );
      });
      
      // Horizontal line after this row
      shapes.push(
        <line
          key={`h-line-${rowIndex}`}
          x1={startX}
          y1={y + rowHeight}
          x2={startX + tableWidth}
          y2={y + rowHeight}
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
      );
    });

    // Draw Grid Lines (Outer Border)
    const totalHeight = (rows.length + 1) * rowHeight;
    shapes.push(
      <rect
        key="border"
        x={startX}
        y={startY}
        width={tableWidth}
        height={totalHeight}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    );

    // Vertical Lines
    for (let i = 1; i < colCount; i++) {
      shapes.push(
        <line
          key={`v-line-${i}`}
          x1={startX + i * colWidth}
          y1={startY}
          x2={startX + i * colWidth}
          y2={startY + totalHeight}
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
      );
    }
    
    // Header separator line
    shapes.push(
      <line
        key="header-sep"
        x1={startX}
        y1={startY + rowHeight}
        x2={startX + tableWidth}
        y2={startY + rowHeight}
        stroke="currentColor"
        strokeWidth="2"
      />
    );
  }

  if (props.type === 'tree-diagram' && props.treeData) {
    const root = props.treeData;
    
    const getDepth = (node: TreeNode): number => {
        if (!node.children || node.children.length === 0) return 1;
        return 1 + Math.max(...node.children.map(getDepth));
    };
    
    const getLeavesCount = (node: TreeNode): number => {
        if (!node.children || node.children.length === 0) return 1;
        return node.children.reduce((acc, child) => acc + getLeavesCount(child), 0);
    };

    const depth = getDepth(root);
    // const leavesCount = getLeavesCount(root); // Not strictly needed if we traverse
    
    const levelWidth = (width - 100) / (Math.max(1, depth - 1));
    
    // Pass 1: Count leaves to determine vertical spacing
    let leafCount = 0;
    const countLeaves = (node: TreeNode) => {
        if (!node.children || node.children.length === 0) {
            leafCount++;
        } else {
            node.children.forEach(countLeaves);
        }
    };
    countLeaves(root);
    
    const actualRowHeight = (height - 40) / Math.max(1, leafCount);
    
    // Pass 2: Build Layout
    let currentLeafIndex = 0;
    const getNextLeafY = () => {
        const y = 20 + currentLeafIndex * actualRowHeight + actualRowHeight / 2;
        currentLeafIndex++;
        return y;
    };
    
    interface LayoutNode {
        x: number;
        y: number;
        children: LayoutNode[];
    }

    const buildLayout = (node: TreeNode, level: number): LayoutNode => {
        const x = 50 + level * levelWidth;
        
        if (!node.children || node.children.length === 0) {
            const y = getNextLeafY();
            return { x, y, children: [] };
        }
        
        const children = node.children.map(child => buildLayout(child, level + 1));
        const firstChildY = children[0].y;
        const lastChildY = children[children.length - 1].y;
        const y = (firstChildY + lastChildY) / 2;
        
        return { x, y, children };
    };
    
    const layoutRoot = buildLayout(root, 0);
    
    // Pass 3: Draw
    const drawTree = (node: LayoutNode, originalNode: TreeNode) => {
        // Draw lines to children
        if (node.children && node.children.length > 0) {
            node.children.forEach((child, index) => {
                // Line
                shapes.push(
                    <line
                        key={`line-${node.x}-${node.y}-${index}`}
                        x1={node.x} y1={node.y}
                        x2={child.x} y2={child.y}
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                );
                
                // Probability Label
                if (originalNode.children && originalNode.children[index].probability) {
                    const midX = (node.x + child.x) / 2;
                    const midY = (node.y + child.y) / 2;
                    // Add a small background rect for readability? Or just text.
                    textLabels.push(
                        <text
                            key={`prob-${midX}-${midY}`}
                            x={midX} y={midY - 8}
                            textAnchor="middle"
                            className="fill-current text-xs font-bold"
                        >
                            {originalNode.children[index].probability}
                        </text>
                    );
                }
                
                drawTree(child, originalNode.children![index]);
            });
        }
        
        // Draw Node Label
        // If it's the root and has no label, skip? No, usually root has label "Start" or similar.
        if (originalNode.label) {
             textLabels.push(
                <text
                    key={`node-${node.x}-${node.y}`}
                    x={node.x + (node.children.length > 0 ? -10 : 10)}
                    y={node.y}
                    textAnchor={node.children.length > 0 ? "end" : "start"}
                    dominantBaseline="middle"
                    className="fill-current text-sm font-medium"
                >
                    {originalNode.label}
                </text>
            );
        }
       
        // Draw Node Point
        shapes.push(
            <circle
                key={`point-${node.x}-${node.y}`}
                cx={node.x} cy={node.y} r={3}
                fill="currentColor"
            />
        );
    };
    
    drawTree(layoutRoot, root);
  }

  if (props.type === 'nested-sets' && props.sets) {
    // Render nested rectangles representing number sets hierarchy
    props.sets.forEach((set, index) => {
      shapes.push(
        <rect
          key={`set-${index}`}
          x={set.x}
          y={set.y}
          width={set.width}
          height={set.height}
          fill={set.color}
          stroke={set.stroke}
          strokeWidth="3"
          rx="10"
          className="opacity-90"
        />
      );

      // Set name at top
      textLabels.push(
        <text
          key={`set-name-${index}`}
          x={set.x + 15}
          y={set.y + 25}
          className="fill-current text-base font-bold"
        >
          {set.name}
        </text>
      );

      // Set description/label
      if (set.label) {
        textLabels.push(
          <text
            key={`set-label-${index}`}
            x={set.x + 15}
            y={set.y + 45}
            className="fill-current text-xs opacity-70"
          >
            {set.label}
          </text>
        );
      }
    });

    // Add annotations (for irrational numbers text, etc.)
    if (props.annotations) {
      props.annotations.forEach((annotation, index) => {
        textLabels.push(
          <text
            key={`annotation-${index}`}
            x={annotation.x}
            y={annotation.y}
            className="fill-current text-sm font-medium"
            style={{ fill: annotation.color || 'currentColor' }}
          >
            {annotation.text}
          </text>
        );
      });
    }
  }

  // Handle custom type diagrams with annotations (for transformation geometry)
  if (props.type === 'custom') {
    // Draw coordinate axes (X and Y axis like graph paper)
    const centerX = width / 2;
    const centerY = height / 2;
    const gridSize = 20; // Grid spacing
    
    // Draw vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      shapes.push(
        <line
          key={`grid-v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-300 dark:text-gray-700"
          opacity="0.3"
        />
      );
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      shapes.push(
        <line
          key={`grid-h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-300 dark:text-gray-700"
          opacity="0.3"
        />
      );
    }
    
    // Draw X-axis (horizontal)
    shapes.push(
      <line
        key="x-axis"
        x1={0}
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-700 dark:text-gray-300"
      />
    );
    
    // Draw Y-axis (vertical)
    shapes.push(
      <line
        key="y-axis"
        x1={centerX}
        y1={0}
        x2={centerX}
        y2={height}
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-700 dark:text-gray-300"
      />
    );
    
    // Add arrow heads for axes
    shapes.push(
      <polygon
        key="x-arrow"
        points={`${width - 5},${centerY - 5} ${width},${centerY} ${width - 5},${centerY + 5}`}
        fill="currentColor"
        className="text-gray-700 dark:text-gray-300"
      />
    );
    shapes.push(
      <polygon
        key="y-arrow"
        points={`${centerX - 5},5 ${centerX},0 ${centerX + 5},5`}
        fill="currentColor"
        className="text-gray-700 dark:text-gray-300"
      />
    );
    
    // Add axis labels
    textLabels.push(
      <text
        key="x-label"
        x={width - 15}
        y={centerY - 10}
        className="fill-current text-sm font-bold"
      >
        x
      </text>
    );
    textLabels.push(
      <text
        key="y-label"
        x={centerX + 10}
        y={15}
        className="fill-current text-sm font-bold"
      >
        y
      </text>
    );
    
    // Add origin label
    textLabels.push(
      <text
        key="origin"
        x={centerX - 15}
        y={centerY + 15}
        className="fill-current text-xs"
      >
        O
      </text>
    );
    
    // Add coordinate numbers on axes
    const numMarks = 5;
    for (let i = -numMarks; i <= numMarks; i++) {
      if (i !== 0) {
        // X-axis marks
        const xPos = centerX + (i * gridSize * 2);
        shapes.push(
          <line
            key={`x-tick-${i}`}
            x1={xPos}
            y1={centerY - 4}
            x2={xPos}
            y2={centerY + 4}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-700 dark:text-gray-300"
          />
        );
        textLabels.push(
          <text
            key={`x-num-${i}`}
            x={xPos}
            y={centerY + 18}
            textAnchor="middle"
            className="fill-current text-xs"
          >
            {i * 2}
          </text>
        );
        
        // Y-axis marks
        const yPos = centerY - (i * gridSize * 2);
        shapes.push(
          <line
            key={`y-tick-${i}`}
            x1={centerX - 4}
            y1={yPos}
            x2={centerX + 4}
            y2={yPos}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-700 dark:text-gray-300"
          />
        );
        textLabels.push(
          <text
            key={`y-num-${i}`}
            x={centerX - 18}
            y={yPos + 4}
            textAnchor="middle"
            className="fill-current text-xs"
          >
            {i * 2}
          </text>
        );
      }
    }
    
    // Draw custom shapes (triangles, lines, etc. for transformations)
    if (props.shapes) {
      props.shapes.forEach((shape, index) => {
        if (shape.type === 'polygon' && shape.points) {
          const pointsStr = shape.points.map(([x, y]) => `${x},${y}`).join(' ');
          shapes.push(
            <polygon
              key={`shape-poly-${index}`}
              points={pointsStr}
              fill={shape.fillColor || 'none'}
              stroke={shape.color || 'currentColor'}
              strokeWidth={shape.strokeWidth || 2}
              strokeDasharray={shape.dashed ? '5,5' : 'none'}
              opacity={shape.fillColor ? 0.3 : 1}
            />
          );
          
          // Draw vertices as dots
          shape.points.forEach((point, pIndex) => {
            shapes.push(
              <circle
                key={`shape-vertex-${index}-${pIndex}`}
                cx={point[0]}
                cy={point[1]}
                r={3}
                fill={shape.color || 'currentColor'}
              />
            );
          });
        } else if (shape.type === 'line' && shape.x1 !== undefined && shape.y1 !== undefined && shape.x2 !== undefined && shape.y2 !== undefined) {
          shapes.push(
            <line
              key={`shape-line-${index}`}
              x1={shape.x1}
              y1={shape.y1}
              x2={shape.x2}
              y2={shape.y2}
              stroke={shape.color || 'currentColor'}
              strokeWidth={shape.strokeWidth || 2}
              strokeDasharray={shape.dashed ? '5,5' : 'none'}
            />
          );
        } else if (shape.type === 'circle' && shape.cx !== undefined && shape.cy !== undefined && shape.r !== undefined) {
          shapes.push(
            <circle
              key={`shape-circle-${index}`}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={shape.fillColor || 'none'}
              stroke={shape.color || 'currentColor'}
              strokeWidth={shape.strokeWidth || 2}
              strokeDasharray={shape.dashed ? '5,5' : 'none'}
            />
          );
        }
      });
    }
    
    // Add custom annotations (points, labels, etc.)
    if (props.annotations) {
      props.annotations.forEach((annotation, index) => {
        textLabels.push(
          <text
            key={`custom-annotation-${index}`}
            x={annotation.x}
            y={annotation.y}
            className="fill-current text-sm font-medium"
            style={{ fill: annotation.color || 'currentColor' }}
          >
            {annotation.text}
          </text>
        );
      });
    }
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {shapes}
      {textLabels}
    </svg>
  );
}
