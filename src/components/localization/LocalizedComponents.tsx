'use client';

import { useLocalization } from '@/hooks/useLocalization';

interface LocalizedCurrencyProps {
  amount: number;
  showCode?: boolean;
  className?: string;
}

/**
 * Display currency amount with automatic localization
 * Example: <LocalizedCurrency amount={100} /> → "₵100" (Ghana) or "₦100" (Nigeria)
 */
export function LocalizedCurrency({ 
  amount, 
  showCode = false,
  className = '' 
}: LocalizedCurrencyProps) {
  const { formatCurrency } = useLocalization();
  
  return (
    <span className={className}>
      {formatCurrency(amount, showCode)}
    </span>
  );
}

interface LocalizedExamNameProps {
  level: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

/**
 * Display exam name automatically based on country
 * Example: <LocalizedExamName level="primary" /> → "BECE" (Ghana) or "JSCE" (Nigeria)
 */
export function LocalizedExamName({ 
  level, 
  className = '' 
}: LocalizedExamNameProps) {
  const { getPrimaryExam, getSecondaryExam } = useLocalization();
  
  const examName = level === 'primary' 
    ? getPrimaryExam() 
    : level === 'secondary'
    ? getSecondaryExam()
    : null;
  
  if (!examName) return null;
  
  return <span className={className}>{examName}</span>;
}

interface LocalizedLevelNameProps {
  level: 'jhs' | 'shs';
  year?: number;
  className?: string;
}

/**
 * Display academic level name automatically based on country
 * Example: <LocalizedLevelName level="jhs" year={1} /> → "JHS 1" (Ghana) or "JSS 1" (Nigeria)
 */
export function LocalizedLevelName({ 
  level, 
  year,
  className = '' 
}: LocalizedLevelNameProps) {
  const { localizeContent } = useLocalization();
  
  const template = year 
    ? `{{level:${level}:${year}}}`
    : `{{level:${level}}}`;
  
  return (
    <span className={className}>
      {localizeContent(template)}
    </span>
  );
}

interface LocalizedTextProps {
  children: string;
  className?: string;
}

/**
 * Localize text with template variables
 * Example: <LocalizedText>Price: {{currency}}50</LocalizedText>
 */
export function LocalizedText({ 
  children, 
  className = '' 
}: LocalizedTextProps) {
  const { localizeContent } = useLocalization();
  
  return (
    <span className={className}>
      {localizeContent(children)}
    </span>
  );
}

interface CountryFlagProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Display current country flag
 */
export function CountryFlag({ 
  size = 'md', 
  className = '' 
}: CountryFlagProps) {
  const { country } = useLocalization();
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };
  
  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {country.flag}
    </span>
  );
}

interface CountryNameProps {
  className?: string;
}

/**
 * Display current country name
 */
export function CountryName({ className = '' }: CountryNameProps) {
  const { country } = useLocalization();
  
  return <span className={className}>{country.name}</span>;
}

interface CapitalCityProps {
  className?: string;
}

/**
 * Display current country's capital city
 */
export function CapitalCity({ className = '' }: CapitalCityProps) {
  const { getCapital } = useLocalization();
  
  return <span className={className}>{getCapital()}</span>;
}
