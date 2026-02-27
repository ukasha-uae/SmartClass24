'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

type MathTextProps = {
  latex: string;
  block?: boolean;
  className?: string;
};

export default function MathText({ latex, block = false, className = '' }: MathTextProps) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: block,
  });

  const Tag = block ? 'div' : 'span';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
