export const STATUS_STYLE: Record<string, string> = {
  Active: 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]',
  Completed: 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]',
  Research: 'text-[#9A6200] bg-[#FFF8EB] border border-[#F5DFBF]',
};

export const TOPIC_TAG_STYLE: Record<string, string> = {
  'Education & AI': 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]',
  'Pendidikan & AI': 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]',
  'Design & AI': 'text-[#5A3A6A] bg-[#F7F2F9] border border-[#DFCEE6]',
  'Desain & AI': 'text-[#5A3A6A] bg-[#F7F2F9] border border-[#DFCEE6]',
  'AI Engineering': 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]',
  'Rekayasa AI': 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]',
};

export function getStatusStyle(status: string): string {
  return STATUS_STYLE[status] || STATUS_STYLE.Active;
}

export function getTopicTagStyle(tag: string): string {
  return TOPIC_TAG_STYLE[tag] || 'text-[#B45028] bg-[#FAF3F0] border border-[#F3DEC2]';
}