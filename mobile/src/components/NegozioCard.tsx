import { MapPin } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { TIPO_NEGOZIO_INFO } from '@/lib/negozioTipo';
import type { NegozioPubblico } from '@/api/types';

export function NegozioCard({
  negozio,
  onPress,
}: {
  negozio: NegozioPubblico;
  onPress: () => void;
}) {
  const info = TIPO_NEGOZIO_INFO[negozio.tipo];
  const Icon = info.icon;

  return (
    <Pressable onPress={onPress} className="active:opacity-90">
      <Card className="flex-row p-4">
        <View className="mr-3 h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Icon size={26} color="#5b4a8a" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text variant="h3" className="flex-1 pr-2" numberOfLines={1}>
              {negozio.nome}
            </Text>
            {negozio.distanzaKm != null && (
              <Badge variant="secondary">{`${negozio.distanzaKm.toFixed(1)} km`}</Badge>
            )}
          </View>

          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={13} color="#8a7c73" />
            <Text variant="muted" numberOfLines={1} className="flex-1">
              {[negozio.citta, negozio.indirizzo].filter(Boolean).join(' · ') || info.label}
            </Text>
          </View>

          <View className="mt-2 flex-row flex-wrap gap-1.5">
            <Badge variant="outline">{info.label}</Badge>
            {negozio.servizi.slice(0, 2).map((s) => (
              <Badge key={s.id} variant="accent">
                {s.nomeTrattamento}
              </Badge>
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
