import { Brush, Flower2, Scissors, Sparkles } from 'lucide-react-native';
import type { TipoNegozio } from '@/api/types';

export const TIPO_NEGOZIO_INFO: Record<TipoNegozio, { label: string; icon: typeof Sparkles }> = {
  CENTRO_ESTETICO: { label: 'Centro estetico', icon: Sparkles },
  BARBERIA: { label: 'Barberia', icon: Scissors },
  PARRUCCHIERE: { label: 'Parrucchiere', icon: Brush },
  CENTRO_MASSAGGI: { label: 'Centro massaggi', icon: Flower2 },
};

export const TIPO_NEGOZIO_OPTIONS: TipoNegozio[] = [
  'CENTRO_ESTETICO',
  'BARBERIA',
  'PARRUCCHIERE',
  'CENTRO_MASSAGGI',
];
