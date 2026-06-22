import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { extractErrorMessage } from '@/api/client';
import { creaPrenotazione } from '@/api/prenotazioneApi';
import type { RootStackParamList } from '@/navigation/types';

type Route = { params: RootStackParamList['ConfirmBooking'] };

export function ConfirmBookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute() as Route;
  const queryClient = useQueryClient();
  const { negozioId, nomeNegozio, servizio, inizio, fine } = route.params;

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataInizio = new Date(inizio);
  const dataFine = new Date(fine);

  async function handleConferma() {
    setError(null);
    setLoading(true);
    try {
      await creaPrenotazione({
        negozioId,
        servizioId: servizio.id,
        dataOraInizio: inizio,
        note: note.trim() || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['prenotazioni'] });
      navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Prenotazioni' } }] });
    } catch (e) {
      setError(extractErrorMessage(e, 'Non è stato possibile completare la prenotazione.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft size={20} color="#1c1410" />
        </Pressable>
        <Text variant="h3">Conferma prenotazione</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerClassName="pb-4"
          keyboardShouldPersistTaps="handled"
        >
          <Card className="gap-3 p-5">
            <Text variant="h2">{servizio.nomeTrattamento}</Text>

            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#8a7c73" />
              <Text variant="muted">{nomeNegozio}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#8a7c73" />
              <Text variant="muted" className="capitalize">
                {dataInizio.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#8a7c73" />
              <Text variant="muted">
                {dataInizio.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} –{' '}
                {dataFine.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <View className="mt-1 flex-row items-center justify-between border-t border-border pt-3">
              <Text className="font-semibold">Totale</Text>
              <Text className="text-lg font-bold text-primary">€{servizio.costo.toFixed(2)}</Text>
            </View>
          </Card>

          <Text variant="label" className="mb-2 mt-5">
            Note per il centro (opzionale)
          </Text>
          <Input
            placeholder="Es. preferenze, richieste particolari..."
            value={note}
            onChangeText={setNote}
            multiline
            containerClassName="h-24 items-start py-3"
          />

          {error && <Text className="mt-3 text-sm text-destructive">{error}</Text>}
        </ScrollView>

        <View className="px-5 pb-6 pt-3">
          <Button loading={loading} onPress={handleConferma}>
            Conferma prenotazione
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
