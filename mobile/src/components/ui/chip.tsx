import { Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export interface ChipProps extends Omit<PressableProps, 'children'> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ label, selected, icon, className, ...props }: ChipProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border px-4 py-2 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-border bg-card',
        className
      )}
      {...props}
    >
      {icon}
      <Text
        className={cn(
          'text-sm font-medium',
          selected ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
