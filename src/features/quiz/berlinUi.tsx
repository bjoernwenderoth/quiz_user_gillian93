import { ekgPath } from './berlin'

export function EkgDivider({ className = '' }: { className?: string }) {
  return <svg className={`ekg-divider ${className}`} viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
    {/* Presentation attributes keep the line intact in the PNG export, which ignores some SVG CSS. */}
    <path d={ekgPath} pathLength={1} fill="none" stroke="#e3141f" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
  </svg>
}
