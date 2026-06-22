import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { getNegozioDettaglio } from '@/api/negozioApi';
import { TIPO_NEGOZIO_INFO } from '@/lib/negozioTipo';
import type { RootStackParamList } from '@/navigation/types';

type Route = { params: RootStackParamList['NegozioDetail'] };

export function NegozioDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute() as Route;
  const { negozioId } = route.params;

  const { data: negozio, isLoading } = useQuery({
    queryKey: ['negozio', negozioId],
    queryFn: () => getNegozioDettaglio(negozioId),
  });

  if (isLoading || !negozio) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#c84f3a" />
      </SafeAreaView>
    );
  }

  const info = TIPO_NEGOZIO_INFO[negozio.tipo];
  const Icon = info.icon;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-10">
        <View className="flex-row items-center justify-between py-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft size={20} color="#1c1410" />
          </Pressable>
        </View>

        <View className="items-center py-4">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-accent">
            <Icon size={36} color="#5b4a8a" />
          </View>
          <Text variant="h1" className="mt-4 text-center">
            {negozio.nome}
          </Text>
          <Badge variant="outline" className="mt-2">
            {info.label}
          </Badge>
        </View>

        <Card className="mt-2 gap-3 p-4">
          {!!(negozio.indirizzo || negozio.citta) && (
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#8a7c73" />
              <Text variant="muted" className="flex-1">
                {[negozio.indirizzo, negozio.citta, negozio.cap].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
          {!!negozio.telefono && (
            <View className="flex-row items-center gap-2">
              <Phone size={16} color="#8a7c73" />
              <Text variant="muted">{negozio.telefono}</Text>
            </View>
          )}
        </Card>

        <Text variant="h3" className="mb-3 mt-6">
          Servizi disponibili
        </Text>

        <View className="gap-3">
          {negozio.servizi.map((servizio) => (
            <Card key={servizio.id} className="p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-semibold">{servizio.nomeTrattamento}</Text>
                  {!!servizio.descrizione && (
                    <Text variant="muted" className="mt-0.5" numberOfLines={2}>
                      {servizio.descrizione}
                    </Text>
                  )}
                  {!!servizio.durataMinuti && (
                    <View className="mt-2 flex-row items-center gap-1">
                      <Clock size={13} color="#8a7c73" />
                      <Text variant="caption">{servizio.durataMinuti} min</Text>
                    </View>
                  )}
                </View>
                <Text className="font-bold text-primary">€{servizio.costo.toFixed(2)}</Text>
              </View>

              <Button
                size="sm"
                variant="secondary"
                className="mt-3 self-start"
                onPress={() =>
                  navigation.navigate('ServiceSlotPicker', {
                    negozioId: negozio.id,
                    nomeNegozio: negozio.nome,
                    servizio,
                  })
                }
              >
                Prenota
              </Button>
            </Card>
          ))}

          {negozio.servizi.length === 0 && (
            <Text variant="muted">Questo centro non ha ancora pubblicato servizi.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
