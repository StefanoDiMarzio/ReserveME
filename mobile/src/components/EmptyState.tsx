import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Icon size={28} color="#b5694a" />
      </View>
      <Text variant="h3" className="text-center">
        {title}
      </Text>
      {description && (
        <Text variant="muted" className="text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
