import poPsoData from '../config/po_pso.json';
import { AnnexureAConfig, POItem, PSOItem, BloomsItem } from './types';

/**
 * Statutory Annexure A Loader
 * Strictly loads PO, PSO statements and Bloom's Taxonomy levels from config/po_pso.json
 * Never hardcoded in components.
 */
export const annexureA: AnnexureAConfig = poPsoData as AnnexureAConfig;

export function getPOList(): POItem[] {
  return annexureA.programOutcomes;
}

export function getPSOList(): PSOItem[] {
  return annexureA.programSpecificOutcomes;
}

export function getBloomsLevels(): BloomsItem[] {
  return annexureA.bloomsLevels;
}

export function getPOByCode(code: string): POItem | undefined {
  return annexureA.programOutcomes.find(
    (po) => po.code.toUpperCase() === code.toUpperCase()
  );
}

export function getPSOByCode(code: string): PSOItem | undefined {
  return annexureA.programSpecificOutcomes.find(
    (pso) => pso.code.toUpperCase() === code.toUpperCase()
  );
}

export function getBloomsByCode(code: string): BloomsItem | undefined {
  return annexureA.bloomsLevels.find(
    (b) => b.code.toUpperCase() === code.toUpperCase()
  );
}

export function getBloomsColorClasses(levelCode: string, isCyber: boolean = false): {
  bg: string;
  text: string;
  border: string;
} {
  const code = levelCode.toUpperCase();
  if (isCyber) {
    switch (code) {
      case 'L1':
        return { bg: 'bg-[#1b1b1f]', text: 'text-[#94a3b8]', border: 'border-[#475569]' };
      case 'L2':
        return { bg: 'bg-[#140c24]', text: 'text-[#c084fc]', border: 'border-[#7c3aed]' };
      case 'L3':
        return { bg: 'bg-[#002107]', text: 'text-[#00ff66]', border: 'border-[#22c55e]' };
      case 'L4':
        return { bg: 'bg-[#2a1705]', text: 'text-[#fbbf24]', border: 'border-[#f59e0b]' };
      case 'L5':
        return { bg: 'bg-[#310c0c]', text: 'text-[#fb7185]', border: 'border-[#f43f5e]' };
      case 'L6':
        return { bg: 'bg-[#1f0b35]', text: 'text-[#e879f9]', border: 'border-[#c084fc]' };
      default:
        return { bg: 'bg-[#1f1f23]', text: 'text-[#e5e1e7]', border: 'border-[#4d4354]' };
    }
  }

  // Academic Governance Theme
  switch (code) {
    case 'L1':
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
    case 'L2':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'L3':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'L4':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' };
    case 'L5':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' };
    case 'L6':
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' };
  }
}
