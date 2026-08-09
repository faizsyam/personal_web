import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VENN } from '../data/content';
import { localize } from '../lib/localize';

type Zone = 'ai' | 'hci' | 'design' | 'ai-hci' | 'ai-design' | 'hci-design' | 'center';

interface VennSkill {
  zone: Zone;
  textEn: string;
  textId: string;
  x: number;
  y: number;
}

interface VennZone {
  id: Zone;
  titleEn: string;
  titleId: string;
}

interface HitRegion {
  zone: Zone;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const SKILLS = VENN.skills as VennSkill[];
const ZONES = VENN.zones as VennZone[];
const HIT_REGIONS = VENN.hitRegions as HitRegion[];

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

  const zone = ZONES.find(z => z.id === 'ai');
  const aiTitle = zone ? localize({ en: zone.titleEn, id: zone.titleId }, lang) : 'AI / ML ENGINEERING';

  const hciZone = ZONES.find(z => z.id === 'hci');
  const hciTitle = hciZone ? localize({ en: hciZone.titleEn, id: hciZone.titleId }, lang) : 'HUMAN-COMPUTER INTERACTION';

  const designZone = ZONES.find(z => z.id === 'design');
  const designTitle = designZone ? localize({ en: designZone.titleEn, id: designZone.titleId }, lang) : 'VISUAL CREATIVE';

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
          >{aiTitle}</text>

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
          >{hciTitle}</text>

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
          >{designTitle}</text>

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
                {localize({ en: s.textEn, id: s.textId }, lang)}
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
