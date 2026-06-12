import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Zone = 'ai' | 'hci' | 'design' | 'ai-hci' | 'ai-design' | 'hci-design' | 'center';

const SKILLS: { zone: Zone; text: string; x: number; y: number }[] = [
  // AI only — pure engineering, no UX or visual
  { zone: 'ai', text: 'LLM fine-tuning',              x: 155, y: 115 },
  { zone: 'ai', text: 'Agentic AI workflows',         x: 130, y: 140 },
  { zone: 'ai', text: 'Deep learning (CV, RL, NLP)',  x: 110, y: 165 },
  { zone: 'ai', text: 'MLOps & deployment',           x: 110, y: 190 },
  { zone: 'ai', text: 'MCTS & game search',           x: 130, y: 215 },

  // HCI only — human & product focused, no ML or visuals
  { zone: 'hci', text: 'Usability research',    x: 545, y: 115 },
  { zone: 'hci', text: 'Product strategy',      x: 570, y: 140 },
  { zone: 'hci', text: 'Team leadership',       x: 590, y: 165 },
  { zone: 'hci', text: 'User growth strategy',  x: 590, y: 190 },
  { zone: 'hci', text: 'Requirement analysis',  x: 570, y: 215 },
  { zone: 'hci', text: 'Game theory',           x: 545, y: 240 },

  // Design only — pure craft, no AI or interaction logic
  { zone: 'design', text: 'Brand identity',      x: 350, y: 435 },
  { zone: 'design', text: 'Graphic Design',      x: 350, y: 457 },
  { zone: 'design', text: 'Illustration',         x: 350, y: 479 },
  { zone: 'design', text: 'Social media design', x: 350, y: 501 },
  { zone: 'design', text: 'Campaign design',     x: 350, y: 523 },

  // AI × HCI — AI systems that are shaped by user needs
  { zone: 'ai-hci', text: 'Prompt engineering',  x: 350, y: 55 },
  { zone: 'ai-hci', text: 'AI agent evaluation', x: 350, y: 71 },
  { zone: 'ai-hci', text: 'Conversational UX',   x: 350, y: 87 },
  { zone: 'ai-hci', text: 'Human-AI collaboration',    x: 350, y: 103 },
  { zone: 'ai-hci', text: 'Game AI & mechanics', x: 350, y: 119 },

  // AI × Design — where models meet visual output
  { zone: 'ai-design', text: 'Generative imagery',      x: 215, y: 310 },
  { zone: 'ai-design', text: 'Neural interpretability', x: 200, y: 332 },
  { zone: 'ai-design', text: 'AI Video Storytelling',   x: 200, y: 354 },
  { zone: 'ai-design', text: 'Data art & visual ML',    x: 215, y: 376 },

  // HCI × Design — interface craft guided by user understanding
  { zone: 'hci-design', text: 'UI/UX design',       x: 485, y: 310 },
  { zone: 'hci-design', text: 'Wireframing',         x: 500, y: 332 },
  { zone: 'hci-design', text: 'Prototyping',         x: 500, y: 354 },
  { zone: 'hci-design', text: 'Accessibility (a11y)', x: 485, y: 376 },

  // Center — requires all three simultaneously
  { zone: 'center', text: 'AI product development',  x: 350, y: 195 },
  { zone: 'center', text: 'Intelligent interfaces',  x: 350, y: 213 },
  { zone: 'center', text: 'Analytics dashboards',    x: 350, y: 231 },
  { zone: 'center', text: 'Data visualisation',      x: 350, y: 249 },
  { zone: 'center', text: 'AR / VR / interactive media',  x: 350, y: 267 },
  { zone: 'center', text: 'Game design (Unity)',      x: 350, y: 285 },
];

const HIT_REGIONS: { zone: Zone; cx: number; cy: number; rx: number; ry: number }[] = [
  { zone: 'ai',          cx: 132, cy: 165, rx: 50,  ry: 65 },
  { zone: 'hci',         cx: 568, cy: 177, rx: 50,  ry: 75 },
  { zone: 'design',      cx: 350, cy: 480, rx: 110, ry: 70 },
  { zone: 'ai-hci',      cx: 350, cy: 87,  rx: 110, ry: 45 },
  { zone: 'ai-design',   cx: 207, cy: 343, rx: 90,  ry: 45 },
  { zone: 'hci-design',  cx: 493, cy: 343, rx: 90,  ry: 45 },
  { zone: 'center',      cx: 350, cy: 240, rx: 110, ry: 60 },
];

// Idle text colors per zone — matching their circle's color family
const IDLE_COLORS: Record<Zone, string> = {
  ai:           '#153d82',
  hci:          '#0b5638',
  design:       '#8a3100',
  'ai-hci':     '#19355e',
  'ai-design':  '#4a2955',
  'hci-design': '#104639',
  center:       '#111111',
};

// Hovered text colors — same family, darker
const HOVER_COLORS: Record<Zone, string> = {
  ai:           '#081d45',
  hci:          '#043320',
  design:       '#541700',
  'ai-hci':     '#0d1d36',
  'ai-design':  '#2a1033',
  'hci-design': '#05231c',
  center:       '#000000',
};

interface VennDiagramProps {
  lang?: 'en' | 'id';
}

export default function VennDiagram({ lang = 'en' }: VennDiagramProps) {
  const [hovered, setHovered] = useState<Zone | null>(null);

  // Circle fill/stroke helpers
  const cFill = (z: 'ai' | 'hci' | 'design') => {
    const base = { ai: [43,90,160], hci: [22,120,90], design: [180,80,40] }[z];
    const related: Record<string, Zone[]> = {
      ai:     ['ai','ai-hci','ai-design','center'],
      hci:    ['hci','ai-hci','hci-design','center'],
      design: ['design','ai-design','hci-design','center'],
    };
    const active  = hovered && related[z].includes(hovered);
    const dimmed  = hovered && !related[z].includes(hovered);
    const a = dimmed ? 0.05 : active ? 0.22 : 0.13;
    return `rgba(${base[0]},${base[1]},${base[2]},${a})`;
  };
  const cStroke = (z: 'ai' | 'hci' | 'design') => {
    const base = { ai: [43,90,160], hci: [22,120,90], design: [180,80,40] }[z];
    const related: Record<string, Zone[]> = {
      ai:     ['ai','ai-hci','ai-design','center'],
      hci:    ['hci','ai-hci','hci-design','center'],
      design: ['design','ai-design','hci-design','center'],
    };
    const active = hovered && related[z].includes(hovered);
    const dimmed = hovered && !related[z].includes(hovered);
    const a = dimmed ? 0.14 : active ? 0.85 : 0.45;
    return `rgba(${base[0]},${base[1]},${base[2]},${a})`;
  };

  const labelOpacity = (z: 'ai' | 'hci' | 'design') => {
    const related: Record<string, Zone[]> = {
      ai:     ['ai','ai-hci','ai-design','center'],
      hci:    ['hci','ai-hci','hci-design','center'],
      design: ['design','ai-design','hci-design','center'],
    };
    if (!hovered) return 0.75;
    return hovered && related[z].includes(hovered) ? 1 : 0.2;
  };

  const cScale = (z: 'ai' | 'hci' | 'design') => {
    if (!hovered) return 1;
    const related: Record<string, Zone[]> = {
      ai:     ['ai','ai-hci','ai-design','center'],
      hci:    ['hci','ai-hci','hci-design','center'],
      design: ['design','ai-design','hci-design','center'],
    };
    return related[z].includes(hovered) ? 1.018 : 0.982;
  };

  const labelScale = (z: 'ai' | 'hci' | 'design') => {
    if (!hovered) return 1;
    const related: Record<string, Zone[]> = {
      ai:     ['ai','ai-hci','ai-design','center'],
      hci:    ['hci','ai-hci','hci-design','center'],
      design: ['design','ai-design','hci-design','center'],
    };
    return related[z].includes(hovered) ? 1.04 : 0.96;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full border border-[#D5D1C4] rounded-2xl p-4 sm:p-6 bg-white/40 backdrop-blur-sm shadow-[0_1px_3px_rgba(24,24,21,0.02)] flex flex-col items-center">
        <svg
          viewBox="0 0 700 620"
          width="100%"
          style={{ width: '100%', display: 'block', overflow: 'visible' }}
        >
          {/* === Definitions for Filters and Gradients to add deep physical layers/depth === */}
          <defs>
            <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#181815" floodOpacity="0.04" />
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#181815" floodOpacity="0.02" />
            </filter>
          </defs>

          {/* === Circles === */}
          <circle cx="250" cy="225" r="215"
            fill={cFill('ai')} stroke={cStroke('ai')} strokeWidth="1.2"
            filter="url(#subtle-shadow)"
            style={{
              transform: `scale(${cScale('ai')})`,
              transformOrigin: '250px 225px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <circle cx="450" cy="225" r="215"
            fill={cFill('hci')} stroke={cStroke('hci')} strokeWidth="1.2"
            filter="url(#subtle-shadow)"
            style={{
              transform: `scale(${cScale('hci')})`,
              transformOrigin: '450px 225px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <circle cx="350" cy="345" r="215"
            fill={cFill('design')} stroke={cStroke('design')} strokeWidth="1.2"
            filter="url(#subtle-shadow)"
            style={{
              transform: `scale(${cScale('design')})`,
              transformOrigin: '350px 345px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* === Circle title labels === */}
          <text x="180" y="40" textAnchor="middle" fontSize="11"
            fontFamily="var(--font-mono, monospace)" letterSpacing="0.25em" fontWeight="600"
            fill="#153d82"
            style={{
              opacity: labelOpacity('ai'),
              transform: `scale(${labelScale('ai')})`,
              transformOrigin: '180px 40px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >AI / ML ENGINEERING</text>

          <text x="520" y="40" textAnchor="middle" fontSize="11"
            fontFamily="var(--font-mono, monospace)" letterSpacing="0.25em" fontWeight="600"
            fill="#0b5638"
            style={{
              opacity: labelOpacity('hci'),
              transform: `scale(${labelScale('hci')})`,
              transformOrigin: '520px 40px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >HUMAN-COMPUTER INTERACTION</text>

          <text x="350" y="585" textAnchor="middle" fontSize="11"
            fontFamily="var(--font-mono, monospace)" letterSpacing="0.25em" fontWeight="600"
            fill="#8a3100"
            style={{
              opacity: labelOpacity('design'),
              transform: `scale(${labelScale('design')})`,
              transformOrigin: '350px 585px',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >VISUAL CREATIVE</text>

          {/* === Skill labels — CSS transform-origin zoom === */}
          {SKILLS.map((s, i) => {
            const isHov  = hovered === s.zone;
            const isDim  = hovered !== null && !isHov;
            return (
              <text
                key={i}
                x={s.x} y={s.y}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-sans,sans-serif)"
                fontWeight={isHov ? '600' : '400'}
                fill={isHov ? HOVER_COLORS[s.zone] : IDLE_COLORS[s.zone]}
                style={{
                  opacity: isDim ? 0.12 : 1,
                  transformOrigin: `${s.x}px ${s.y}px`,
                  transform: isHov ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease, fill 0.15s ease',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {s.text}
              </text>
            );
          })}

          {/* === Hit regions === */}
          {HIT_REGIONS.map(({ zone, cx, cy, rx, ry }) => (
            <ellipse
              key={zone}
              cx={cx} cy={cy} rx={rx} ry={ry}
              fill="transparent" stroke="none"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(zone)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>

    </div>
  );
}
