import React from 'react';
import { Share2 } from 'lucide-react';
import { Note } from '../../types';

interface BacklinksGraphProps {
  notes: Note[];
  selectedNoteId: string;
  onSelectNote: (id: string) => void;
}

export const BacklinksGraph: React.FC<BacklinksGraphProps> = ({ notes, selectedNoteId, onSelectNote }) => {
  // Compute positions for SVG nodes in a circle layout
  const radius = 90;
  const centerX = 130;
  const centerY = 130;

  const nodePositions = notes.map((note, idx) => {
    const angle = (idx / notes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { note, x, y };
  });

  return (
    <div className="rounded-2xl p-4 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col items-center justify-center text-center">
      <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 dark:text-white mb-2 self-start">
        <Share2 className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
        <span>Knowledge Graph</span>
      </div>

      <div className="relative w-64 h-64">
        <svg className="w-full h-full">
          {/* Lines connecting nodes */}
          {nodePositions.map((n1, idx1) =>
            nodePositions.map((n2, idx2) => {
              if (idx1 >= idx2) return null;
              return (
                <line
                  key={`${idx1}-${idx2}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[#D85A2A]/30 dark:text-[#E56B3A]/30"
                />
              );
            })
          )}

          {/* Node circles */}
          {nodePositions.map((pos) => {
            const isSelected = pos.note.id === selectedNoteId;
            return (
              <g
                key={pos.note.id}
                onClick={() => onSelectNote(pos.note.id)}
                className="cursor-pointer group"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? '10' : '7'}
                  className={isSelected ? 'fill-[#D85A2A] dark:fill-[#E56B3A] stroke-[#F3EFE6] dark:stroke-[#1C1A18] stroke-2' : 'fill-[#8A9A86] hover:fill-[#D85A2A] dark:hover:fill-[#E56B3A] transition-colors'}
                />
                <text
                  x={pos.x}
                  y={pos.y + 18}
                  textAnchor="middle"
                  className="text-[9px] fill-gray-500 font-mono group-hover:fill-gray-900 dark:group-hover:fill-white transition-colors"
                >
                  {pos.note.title.slice(0, 14)}...
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
