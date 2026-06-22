import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { getSlotDisponibili } from '@/api/prenotazioneApi';
import { cn } from '@/lib/utils';
import type { RootStackParamList } from '@/navigation/types';

type Route = { params: RootStackParamList['ServiceSlotPicker'] };

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ServiceSlotPickerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute() as Route;
  const { negozioId, nomeNegozio, servizio } = route.params;

  const giorni = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const [giornoSelezionato, setGiornoSelezionato] = useState(giorni[0]);
  const dataKey = toDateKey(giornoSelezionato);

  const { data: slot, isLoading } = useQuery({
    queryKey: ['slot', negozioId, servizio.id, dataKey],
    queryFn: () => getSlotDisponibili(negozioId, servizio.id, dataKey),
  });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft size={20} color="#1c1410" />
        </Pressable>
        <View>
          <Text variant="h3">{servizio.nomeTrattamento}</Text>
          <Text variant="muted">{nomeNegozio}</Text>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={giorni}
        keyExtractor={toDateKey}
        contentContainerClassName="gap-2 px-5 py-2"
        renderItem={({ item }) => {
          const selected = toDateKey(item) === dataKey;
          return (
            <Pressable
              onPress={() => setGiornoSelezionato(item)}
              className={cn(
                'rounded-2xl border px-4 py-3',
                selected ? 'border-primary bg-primary' : 'border-border bg-card'
              )}
            >
              <Text className={cn('text-center text-sm font-medium capitalize', selected ? 'text-primary-foreground' : 'text-foreground')}>
                {formatDateLabel(item)}
              </Text>
            </Pressable>
          );
        }}
      />

      <Text variant="label" className="px-5 pt-3">
        Orari disponibili
      </Text>

      {isLoading ? (
        <View className="flex-row flex-wrap gap-3 px-5 pt-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-24" />
          ))}
        </View>
      ) : !slot || slot.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nessuno slot disponibile"
          description="Prova a scegliere un altro giorno"
        />
      ) : (
        <FlatList
          data={slot}
          keyExtractor={(item) => item.inizio}
          numColumns={3}
          contentContainerClassName="gap-3 px-5 pt-3 pb-6"
          columnWrapperClassName="gap-3"
          renderItem={({ item }) => (
            <Pressable
              className="flex-1 items-center rounded-2xl border border-border bg-card py-3 active:bg-secondary"
              onPress={() =>
                navigation.navigate('ConfirmBooking', {
                  negozioId,
                  nomeNegozio,
                  servizio,
                  inizio: item.inizio,
                  fine: item.fine,
                })
              }
            >
              <Text className="font-semibold">
                {new Date(item.inizio).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
