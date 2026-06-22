import { cva, type VariantProps } from 'class-variance-authority';
import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/lib/utils';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      default: 'text-base',
      h1: 'text-3xl font-bold tracking-tight',
      h2: 'text-2xl font-bold tracking-tight',
      h3: 'text-xl font-semibold',
      large: 'text-lg font-medium',
      muted: 'text-sm text-muted-foreground',
      small: 'text-sm',
      label: 'text-sm font-medium',
      caption: 'text-xs text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AppTextProps extends TextProps, VariantProps<typeof textVariants> {
  className?: string;
}

export function Text({ className, variant, ...props }: AppTextProps) {
  return <RNText className={cn(textVariants({ variant }), className)} {...props} />;
}
