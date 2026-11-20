import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  filled = false,
  style,
}) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${filled ? 'fill-current' : ''} ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
        ...style,
      }}
    >
      {name}
    </span>
  );
};

