import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { List, LocateFixed, MapIcon, Search as SearchIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { NegozioCard } from '@/components/NegozioCard';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/auth/AuthContext';
import { cercaNegozi } from '@/api/negozioApi';
import { DEFAULT_REGION } from '@/constants/config';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLocation } from '@/hooks/useLocation';
import { TIPO_NEGOZIO_INFO, TIPO_NEGOZIO_OPTIONS } from '@/lib/negozioTipo';
import type { RootStackParamList } from '@/navigation/types';
import type { TipoNegozio } from '@/api/types';

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { status: locationStatus, coords, requestPermission } = useLocation();

  const [testo, setTesto] = useState('');
  const [tipo, setTipo] = useState<TipoNegozio | null>(null);
  const [view, setView] = useState<'lista' | 'mappa'>('lista');

  const debouncedTesto = useDebouncedValue(testo, 350);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['negozi', debouncedTesto, tipo, coords?.latitude, coords?.longitude],
    queryFn: () =>
      cercaNegozi({
        testo: debouncedTesto || undefined,
        tipo: tipo ?? undefined,
        lat: coords?.latitude,
        lng: coords?.longitude,
        size: 50,
      }),
  });

  const risultati = data?.content ?? [];

  const initialRegion = useMemo(
    () =>
      coords
        ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.2, longitudeDelta: 0.2 }
        : DEFAULT_REGION,
    [coords]
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="px-5 pb-3 pt-2">
        <Text variant="h2">Ciao{user?.nome ? `, ${user.nome}` : ''} 👋</Text>
        <Text variant="muted" className="mt-0.5">
          Trova il centro perfetto vicino a te
        </Text>

        <Input
          containerClassName="mt-4 rounded-full"
          placeholder="Cerca per nome, città o servizio..."
          value={testo}
          onChangeText={setTesto}
          leftIcon={<SearchIcon size={18} color="#8a7c73" />}
        />

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['TUTTI', ...TIPO_NEGOZIO_OPTIONS]}
          keyExtractor={(item) => item}
          contentContainerClassName="mt-3 gap-2"
          renderItem={({ item }) => {
            if (item === 'TUTTI') {
              return <Chip label="Tutti" selected={tipo === null} onPress={() => setTipo(null)} />;
            }
            const t = item as TipoNegozio;
            const info = TIPO_NEGOZIO_INFO[t];
            const Icon = info.icon;
            return (
              <Chip
                label={info.label}
                selected={tipo === t}
                onPress={() => setTipo(tipo === t ? null : t)}
                icon={<Icon size={14} color={tipo === t ? '#fff' : '#1c1410'} />}
              />
            );
          }}
        />

        <View className="mt-4 flex-row self-start rounded-full bg-secondary p-1">
          <SegmentButton label="Lista" icon={List} active={view === 'lista'} onPress={() => setView('lista')} />
          <SegmentButton label="Mappa" icon={MapIcon} active={view === 'mappa'} onPress={() => setView('mappa')} />
        </View>
      </View>

      {view === 'lista' ? (
        isLoading ? (
          <View className="gap-3 px-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </View>
        ) : risultati.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="Nessun centro trovato"
            description="Prova a modificare la ricerca o il filtro selezionato"
          />
        ) : (
          <FlatList
            data={risultati}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="gap-3 px-5 pb-6"
            refreshing={isFetching}
            onRefresh={refetch}
            renderItem={({ item }) => (
              <NegozioCard
                negozio={item}
                onPress={() => navigation.navigate('NegozioDetail', { negozioId: item.id })}
              />
            )}
          />
        )
      ) : (
        <View className="flex-1">
          <MapView
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            showsUserLocation={locationStatus === 'granted'}
          >
            {risultati
              .filter((n) => n.latitudine != null && n.longitudine != null)
              .map((n) => (
                <Marker
                  key={n.id}
                  coordinate={{ latitude: n.latitudine as number, longitude: n.longitudine as number }}
                  title={n.nome}
                  description={TIPO_NEGOZIO_INFO[n.tipo].label}
                  onCalloutPress={() => navigation.navigate('NegozioDetail', { negozioId: n.id })}
                />
              ))}
          </MapView>

          {locationStatus !== 'granted' && (
            <Pressable
              onPress={requestPermission}
              className="absolute bottom-5 right-5 h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md"
            >
              <LocateFixed size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  icon: Icon,
  active,
  onPress,
}: {
  label: string;
  icon: typeof List;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${active ? 'bg-card shadow-sm shadow-black/10' : ''}`}
    >
      <Icon size={15} color={active ? '#c84f3a' : '#8a7c73'} />
      <Text className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
