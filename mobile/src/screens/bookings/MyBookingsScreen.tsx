import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarX2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingCard } from '@/components/BookingCard';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { cancellaPrenotazione, getMiePrenotazioni } from '@/api/prenotazioneApi';
import { cn } from '@/lib/utils';

export function MyBookingsScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'prossime' | 'passate'>('prossime');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['prenotazioni'],
    queryFn: getMiePrenotazioni,
  });

  const prenotazioni = useMemo(() => {
    const now = Date.now();
    const all = data ?? [];
    return tab === 'prossime'
      ? all.filter((p) => new Date(p.dataOraInizio).getTime() >= now && p.stato !== 'ANNULLATO')
      : all.filter((p) => new Date(p.dataOraInizio).getTime() < now || p.stato === 'ANNULLATO');
  }, [data, tab]);

  function handleCancel(id: number) {
    Alert.alert('Annulla prenotazione', 'Sei sicuro di voler annullare questa prenotazione?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sì, annulla',
        style: 'destructive',
        onPress: async () => {
          await cancellaPrenotazione(id);
          queryClient.invalidateQueries({ queryKey: ['prenotazioni'] });
        },
      },
    ]);
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="px-5 pt-2">
        <Text variant="h2">Le mie prenotazioni</Text>

        <View className="mt-4 flex-row self-start rounded-full bg-secondary p-1">
          <TabButton label="Prossime" active={tab === 'prossime'} onPress={() => setTab('prossime')} />
          <TabButton label="Passate" active={tab === 'passate'} onPress={() => setTab('passate')} />
        </View>
      </View>

      {isLoading ? (
        <View className="gap-3 px-5 pt-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </View>
      ) : prenotazioni.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title={tab === 'prossime' ? 'Nessuna prenotazione in arrivo' : 'Nessuna prenotazione passata'}
          description="Cerca un centro e prenota il tuo prossimo trattamento"
        />
      ) : (
        <FlatList
          data={prenotazioni}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="gap-3 px-5 pb-6 pt-4"
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <BookingCard prenotazione={item} onCancel={() => handleCancel(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={cn('rounded-full px-5 py-2', active && 'bg-card shadow-sm shadow-black/10')}>
      <Text className={cn('text-sm font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}
