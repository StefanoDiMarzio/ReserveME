import { cva, type VariantProps } from 'class-variance-authority';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

const badgeVariants = cva('flex-row items-center self-start rounded-full px-2.5 py-1', {
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'border border-border bg-transparent',
      success: 'bg-success',
      destructive: 'bg-destructive',
      accent: 'bg-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      success: 'text-success-foreground',
      destructive: 'text-destructive-foreground',
      accent: 'text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {typeof children === 'string' ? (
        <Text className={badgeTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
