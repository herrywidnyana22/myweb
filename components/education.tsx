'use client';
import React from 'react';

type Node = {
  id: string;
  icon: string;
  text: string;
};

const nodes: Node[] = [
  { id: '1', icon: 'SD', text: 'text 1' },
  { id: '2', icon: 'SMP', text: 'text 1' },
  { id: '3', icon: 'SMK', text: 'text 2' },
  { id: '4', icon: 'icon 2', text: 'text 2' },
  { id: '5', icon: 'icon 2', text: 'text 2' },
];

export default function Education() {
  return (
    <div className="relative flex items-start justify-center gap-10">
      {/* SVG untuk garis antar icon */}
      <svg
        className="absolute top-0 left-0 w-full h-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {nodes.map((node, i) => {
          if (i === nodes.length - 1) return null;
          return (
            <line
              key={i}
              x1={`${(i + 0.5) * (100 / nodes.length)}%`}
              y1="30"
              x2={`${(i + 1.5) * (100 / nodes.length)}%`}
              y2="30"
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Node */}
      {nodes.map((node) => (
        <div key={node.id} className="flex flex-col items-center relative z-10">
          <div className="size-12 border-2 border-gray-400 rounded-full flex items-center justify-center bg-white shadow">
            <span className='text-slate-600 font-bold'>{node.icon}</span>
          </div>
          <div className="w-[2px] h-8 bg-black"></div>
          <div className="border-1 border-black px-4 py-2 bg-white shadow rounded-2xl">
            {node.text}
          </div>
        </div>
      ))}
    </div>
  );
}
