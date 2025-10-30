import React from 'react';

export const JusticeCoolLogo = ({ className }: { className?: string }) => (
  <svg 
    id="justice-cool-logo" 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    className={className}
    fill="currentColor"
  >
    <circle cx="16" cy="16" r="14" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
    <circle cx="16" cy="10" r="2" fill="white"/>
  </svg>
);
