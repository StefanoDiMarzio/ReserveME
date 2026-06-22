import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        'rounded-2xl border border-border bg-card shadow-sm shadow-black/5',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('p-4 pb-2', className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
  return (
    <Text variant="h3" className={cn(className)} {...props}>
      {children}
    </Text>
  );
}

export function CardDescription({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
  return (
    <Text variant="muted" className={cn(className)} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('p-4 pt-2', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('flex-row items-center p-4 pt-2', className)} {...props} />;
}
