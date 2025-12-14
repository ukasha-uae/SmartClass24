import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import VennDiagram from './VennDiagram';
import GeometryDiagram from './GeometryDiagram';
import EnhancedAnimationPlayer from './EnhancedAnimationPlayer';
import { 
  MeanCalculatorAnimation,
  MedianFinderAnimation,
  ModeCounterAnimation,
  RangeVisualizerAnimation,
  ComparisonChartAnimation,
  GroupedDataMedianAnimation,
  MeasureDecisionTree,
  MeasuresComparisonTable,
  QuickReferenceTable
} from './StatisticsAnimations';
import {
  TwoCoinTossAnimation,
  TreeDiagramAnimation,
  ProbabilityLawsTable,
  MutuallyExclusiveVennDiagram
} from './ProbabilityAnimations';
import {
  FactorizationSolverAnimation,
  CompletingTheSquareAnimation,
  QuadraticFormulaAnimation,
  DiscriminantExplorerAnimation,
  WordProblemSolverAnimation,
  SumProductRootsAnimation
} from './QuadraticAnimations';
import {
  ParticleArrangementAnimation
} from './MatterAnimations';
import { 
  translationSteps, 
  translationFrames, 
  reflectionSteps, 
  reflectionFrames,
  rotationSteps,
  rotationFrames 
} from '@/lib/transformationAnimations';

interface MarkdownRendererProps {
  content: string;
  id?: string;
  className?: string;
}

export default function MarkdownRenderer({ content, id, className }: MarkdownRendererProps) {
  if (!content) return null;

  // Ensure code blocks are separated by double newlines so they are treated as paragraphs
  const normalizedContent = content
    .replace(/([^\n])\n```/g, '$1\n\n```') // Add newline before code block if missing
    .replace(/```\n([^\n])/g, '```\n\n$1'); // Add newline after code block if missing

  // Split by double newlines to handle paragraphs, but be careful not to split inside code blocks
  // This is a simple implementation; for robust markdown, use a library like react-markdown
  const paragraphs = normalizedContent.split(/\n\n+/);

  return (
    <div id={id} className={`space-y-4 text-base leading-relaxed ${className || ''}`}>
      {paragraphs.map((paragraph, pIndex) => {
        // Check for HTML table blocks
        if (paragraph.trim().startsWith('<table') || paragraph.trim().startsWith('<div') || paragraph.trim().startsWith('<h4')) {
          return (
            <div 
              key={pIndex} 
              className="my-4"
              dangerouslySetInnerHTML={{ __html: paragraph }} 
            />
          );
        }

        // Check for Venn Diagram code block
        if (paragraph.trim().startsWith('```venn')) {
          try {
            // Extract JSON content using regex to handle potential trailing text
            const vennRegex = /```venn\s*([\s\S]*?)\s*```([\s\S]*)/;
            const match = paragraph.match(vennRegex);
            
            let jsonContent;
            let remainingText = '';

            if (match) {
              jsonContent = match[1];
              remainingText = match[2];
            } else {
              // Fallback for simple cases
              jsonContent = paragraph.replace(/```venn\s*/, '').replace(/```\s*$/, '');
            }

            const props = JSON.parse(jsonContent);
            
            return (
              <React.Fragment key={pIndex}>
                <div className="my-6 flex justify-center">
                  <VennDiagram {...props} />
                </div>
                {remainingText && remainingText.trim().length > 0 && (
                  <div className="mb-2">
                    {remainingText.trim().split(/\n\n+/).map((subPara, spIndex) => (
                      <p key={spIndex} className="mb-2">
                        {subPara.split(/\n/).map((line, lIndex, arr) => (
                          <React.Fragment key={lIndex}>
                            {parseInline(line)}
                            {lIndex < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          } catch (e) {
            console.error("Error parsing Venn diagram JSON:", e);
            return <pre key={pIndex} className="text-red-500">Error rendering diagram</pre>;
          }
        }

        // Check for Animation block
        if (paragraph.trim().startsWith('```animation:')) {
          try {
            const animationType = paragraph.match(/```animation:(\w+)/)?.[1];
            
            let steps, frames;
            switch (animationType) {
              case 'translation':
                steps = translationSteps;
                frames = translationFrames;
                break;
              case 'reflection':
                steps = reflectionSteps;
                frames = reflectionFrames;
                break;
              case 'rotation':
                steps = rotationSteps;
                frames = rotationFrames;
                break;
              default:
                return <pre key={pIndex} className="text-red-500">Unknown animation type: {animationType}</pre>;
            }
            
            return (
              <div key={pIndex} className="my-8">
                <EnhancedAnimationPlayer steps={steps} frames={frames} autoPlay={false} />
              </div>
            );
          } catch (e) {
            console.error("Error rendering animation:", e);
            return <pre key={pIndex} className="text-red-500">Error rendering animation</pre>;
          }
        }

        // Check for Geometry Diagram code block
        if (paragraph.trim().startsWith('```geometry')) {
          try {
            // Extract JSON content using regex to handle potential trailing text
            const geoRegex = /```geometry\s*([\s\S]*?)\s*```([\s\S]*)/;
            const match = paragraph.match(geoRegex);
            
            let jsonContent;
            let remainingText = '';

            if (match) {
              jsonContent = match[1];
              remainingText = match[2];
            } else {
              // Fallback for simple cases
              jsonContent = paragraph.replace(/```geometry\s*/, '').replace(/```\s*$/, '');
            }

            const props = JSON.parse(jsonContent);
            
            return (
              <React.Fragment key={pIndex}>
                <div className="my-6 flex justify-center">
                  <GeometryDiagram {...props} />
                </div>
                {remainingText && remainingText.trim().length > 0 && (
                  <div className="mb-2">
                    {remainingText.trim().split(/\n\n+/).map((subPara, spIndex) => (
                      <p key={spIndex} className="mb-2">
                        {subPara.split(/\n/).map((line, lIndex, arr) => (
                          <React.Fragment key={lIndex}>
                            {parseInline(line)}
                            {lIndex < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          } catch (e) {
            console.error("Error parsing Geometry diagram JSON:", e);
            return <pre key={pIndex} className="text-red-500">Error rendering geometry diagram</pre>;
          }
        }

        // Check for Statistics Animation code blocks (without colon)
        if (paragraph.trim().startsWith('```animation') && !paragraph.trim().startsWith('```animation:')) {
          try {
            // More robust regex to extract JSON content between backticks
            const jsonContent = paragraph
              .replace(/^```animation\s*\n?/, '') // Remove opening backticks
              .replace(/\n?```\s*$/, '')          // Remove closing backticks
              .trim();
            
            const props = JSON.parse(jsonContent);
              
              // Determine which animation type to render
              switch (props.type) {
                case 'number-line-mean':
                case 'mean-calculator':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <MeanCalculatorAnimation data={props.data} showCalculation={props.showCalculation} />
                    </div>
                  );
                
                case 'missing-value':
                  // For missing value, we'll calculate it first
                  const totalSum = props.mean * props.totalCount;
                  const knownSum = props.data.reduce((a: number, b: number) => a + b, 0);
                  const missingValue = totalSum - knownSum;
                  return (
                    <div key={pIndex} className="my-6">
                      <MeanCalculatorAnimation data={[...props.data, missingValue]} showCalculation={true} />
                    </div>
                  );
                
                case 'median-finder':
                  return (
                    <div key={pIndex} className="my-6">
                      <MedianFinderAnimation data={props.data} />
                    </div>
                  );
                
                case 'mode-counter':
                  return (
                    <div key={pIndex} className="my-6">
                      <ModeCounterAnimation data={props.data} />
                    </div>
                  );
                
                case 'range-visualizer':
                  return (
                    <div key={pIndex} className="my-6">
                      <RangeVisualizerAnimation data={props.data} unit={props.unit || ''} />
                    </div>
                  );
                
                case 'comparison-chart':
                  return (
                    <div key={pIndex} className="my-6">
                      <ComparisonChartAnimation 
                        measures={props.measures} 
                        data={props.data}
                        outlier={props.outlier}
                      />
                    </div>
                  );
                
                case 'grouped-median':
                  return (
                    <div key={pIndex} className="my-6">
                      <GroupedDataMedianAnimation 
                        classIntervals={props.classIntervals}
                        frequencies={props.frequencies}
                      />
                    </div>
                  );
                
                case 'decision-tree':
                  return (
                    <div key={pIndex} className="my-6">
                      <MeasureDecisionTree />
                    </div>
                  );
                
                case 'comparison-table':
                  return (
                    <div key={pIndex} className="my-6">
                      <MeasuresComparisonTable />
                    </div>
                  );
                
                case 'quick-reference':
                  return (
                    <div key={pIndex} className="my-6">
                      <QuickReferenceTable />
                    </div>
                  );
                
                case 'two-coins':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <TwoCoinTossAnimation />
                    </div>
                  );
                
                case 'tree-diagram':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <TreeDiagramAnimation scenario={props.scenario || 'without-replacement'} />
                    </div>
                  );
                
                case 'probability-laws':
                  return (
                    <div key={pIndex} className="my-6">
                      <ProbabilityLawsTable />
                    </div>
                  );
                
                case 'venn-mutually-exclusive':
                  return (
                    <div key={pIndex} className="my-6">
                      <MutuallyExclusiveVennDiagram />
                    </div>
                  );
                
                case 'factorization-solver':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <FactorizationSolverAnimation 
                        a={props.a || 1}
                        b={props.b || 7}
                        c={props.c || 12}
                      />
                    </div>
                  );
                
                case 'particlearrangementanimation':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <ParticleArrangementAnimation />
                    </div>
                  );
                
                case 'completing-the-square':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <CompletingTheSquareAnimation 
                        a={props.a || 1}
                        b={props.b || 6}
                        c={props.c || 5}
                      />
                    </div>
                  );
                
                case 'quadratic-formula':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <QuadraticFormulaAnimation 
                        a={props.a || 1}
                        b={props.b || 6}
                        c={props.c || 5}
                      />
                    </div>
                  );
                
                case 'discriminant-explorer':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <DiscriminantExplorerAnimation 
                        a={props.a || 2}
                        b={props.b || 5}
                        c={props.c || 2}
                      />
                    </div>
                  );
                
                case 'word-problem-solver':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <WordProblemSolverAnimation 
                        perimeter={props.perimeter || 28}
                        area={props.area || 45}
                      />
                    </div>
                  );
                
                case 'sum-product-roots':
                  return (
                    <div key={pIndex} className="my-6" data-skip-tts="true">
                      <SumProductRootsAnimation 
                        a={props.a || 1}
                        b={props.b || -5}
                        c={props.c || 6}
                      />
                    </div>
                  );
                
                case 'bar-chart':
                case 'line-graph':
                case 'progress-tracker':
                  // These can be rendered using geometry diagram for now
                  return (
                    <div key={pIndex} className="my-6 flex justify-center">
                      <GeometryDiagram {...props} />
                    </div>
                  );
                
                default:
                  console.warn('Unknown animation type:', props.type);
                  return <pre key={pIndex} className="text-yellow-500">Unknown animation type: {props.type}</pre>;
              }
          } catch (e) {
            console.error("Error parsing animation JSON:", e, paragraph);
            return <pre key={pIndex} className="text-red-500">Error rendering animation: {String(e)}</pre>;
          }
        }

        // Check if paragraph is a list
        if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
          const listItems = paragraph.split(/\n/).filter(line => line.trim().length > 0);
          return (
            <ul key={pIndex} className="list-disc pl-5 space-y-1">
              {listItems.map((item, iIndex) => {
                const cleanItem = item.replace(/^[-•]\s+/, '');
                return <li key={iIndex}>{parseInline(cleanItem)}</li>;
              })}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={pIndex} className="mb-2">
            {paragraph.split(/\n/).map((line, lIndex, arr) => (
              <React.Fragment key={lIndex}>
                {parseInline(line)}
                {lIndex < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseInline(text: string): React.ReactNode[] {
  // Regex to match display math ($$text$$), inline math ($text$), bold (**text**), italic (*text*), and code (`text`)
  // We use a capturing group to split the string including the delimiters
  // Note: Check for $$ first so it doesn't get matched as two $
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$|\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const latex = part.slice(2, -2);
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-4 text-center block" />;
      } catch (e) {
        console.error("KaTeX error:", e);
        return <span key={index} className="text-red-500 block">{part}</span>;
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-sm font-bold">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: false
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        console.error("KaTeX error:", e);
        return <span key={index} className="text-red-500">{part}</span>;
      }
    }
    return part;
  });
}
