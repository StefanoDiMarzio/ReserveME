import { cva, type VariantProps } from 'class-variance-authority';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

const buttonVariants = cva(
  'flex-row items-center justify-center gap-2 rounded-xl active:opacity-80',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'border border-border bg-transparent',
        ghost: 'bg-transparent',
        destructive: 'bg-destructive',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-9 px-4',
        lg: 'h-14 px-6',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      ghost: 'text-foreground',
      destructive: 'text-destructive-foreground',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends Omit<PressableProps, 'children'>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size }), (disabled || loading) && 'opacity-50', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#1c1410' : '#fff'} />
      ) : typeof children === 'string' ? (
        <Text className={cn(buttonTextVariants({ variant, size }))}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
