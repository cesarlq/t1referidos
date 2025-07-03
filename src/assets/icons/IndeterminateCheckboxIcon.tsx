import React from 'react';

const IndeterminateCheckboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
    <rect width="18" height="18" rx="3" fill="#DB3B2B"/>
    <line x1="5" y1="9" x2="13" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default IndeterminateCheckboxIcon;
