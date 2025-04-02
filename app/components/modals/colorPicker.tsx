'use client';

import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const colors = [
  "#FF6633", "#FFB399", "#FF33FF", "#FFFF99",
  "#00B3E6", "#E6B333", "#3366E6", "#999966",
  "#99FF99", "#B34D4D"
];

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <div
          key={color}
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
            selectedColor === color ? 'border-black' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
}
