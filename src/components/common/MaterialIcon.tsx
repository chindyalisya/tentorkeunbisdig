import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  filled = false,
}) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${filled ? 'fill-current' : ''} ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
      }}
    >
      {name}
    </span>
  );
};
