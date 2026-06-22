import { View } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  name,
  size = 44,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <View
      className={cn('items-center justify-center rounded-full bg-accent', className)}
      style={{ width: size, height: size }}
    >
      <Text className="font-bold text-accent-foreground" style={{ fontSize: size * 0.38 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
