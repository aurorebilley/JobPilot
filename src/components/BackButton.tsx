import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Determine the parent route based on current path
    const path = location.pathname;
    if (path.includes('/candidatures/')) {
      navigate('/candidatures');
    } else if (path.includes('/entretiens/')) {
      navigate('/entretiens');
    } else if (path.includes('/procedures/')) {
      navigate('/procedures');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      aria-label="Retour"
    >
      <svg className="w-10 h-10" viewBox="0 0 463.14 407.21">
        <defs>
          <style>
            {`.cls-1 { fill: #4e8d60; }
            .cls-2 { fill: #f2bd64; }`}
          </style>
        </defs>
        <path className="cls-1" d="M197.72.41c40.32-5.16,60.76,39.31,33.76,69.76-24.05,27.13-56.37,52.89-81.6,79.4-40.4,18.78-82.93,33-124.26,49.74-4.03,4.42-1.72,6.75,2.66,9.01,35.7,18.41,101.38,31.52,129.69,56.31,7.05,6.17,13.59,14,20.46,20.54,17.42,16.59,40.99,36.77,56.04,54.96,32.28,39.02-18.7,88.61-57.04,57.04L10.45,231.17c-13.88-17.97-14.16-37.96.49-55.53L173.95,12.64c7.02-5.97,14.32-11.02,23.77-12.23Z"/>
        <path className="cls-2" d="M452.38,175.75c24.58,28.1,4,67.74-30.92,71.4l-264.93-.05-113.56-41.95c-.34-1.69.45-2.03,1.64-2.85,3.04-2.1,12.92-5.19,17.11-6.89,31.22-12.65,63.09-23.75,94.74-35.26l267,.02c11.91,1.97,21.09,6.63,28.92,15.58Z"/>
      </svg>
    </button>
  );
}