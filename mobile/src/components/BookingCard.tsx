import { Calendar, Clock, MapPin, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Prenotazione } from '@/api/types';

const STATO_INFO: Record<Prenotazione['stato'], { label: string; variant: 'secondary' | 'success' | 'destructive' | 'accent' }> = {
  IN_ATTESA: { label: 'In attesa di conferma', variant: 'secondary' },
  CONFERMATO: { label: 'Confermato', variant: 'success' },
  COMPLETATO: { label: 'Completato', variant: 'accent' },
  ANNULLATO: { label: 'Annullato', variant: 'destructive' },
};

export function BookingCard({
  prenotazione,
  onCancel,
}: {
  prenotazione: Prenotazione;
  onCancel?: () => void;
}) {
  const stato = STATO_INFO[prenotazione.stato];
  const dataInizio = new Date(prenotazione.dataOraInizio);
  const cancellabile = prenotazione.stato === 'IN_ATTESA' || prenotazione.stato === 'CONFERMATO';

  return (
    <Card className="p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="font-semibold">{prenotazione.nomeServizio}</Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={13} color="#8a7c73" />
            <Text variant="muted" numberOfLines={1}>
              {prenotazione.nomeNegozio}
            </Text>
          </View>
        </View>
        <Badge variant={stato.variant}>{stato.label}</Badge>
      </View>

      <View className="mt-3 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Calendar size={13} color="#8a7c73" />
          <Text variant="caption" className="capitalize">
            {dataInizio.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Clock size={13} color="#8a7c73" />
          <Text variant="caption">
            {dataInizio.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between border-t border-border pt-3">
        <Text className="font-bold text-primary">€{prenotazione.prezzo.toFixed(2)}</Text>
        {cancellabile && onCancel && (
          <Pressable
            onPress={onCancel}
            className="flex-row items-center gap-1 rounded-full bg-secondary px-3 py-1.5 active:opacity-80"
          >
            <X size={13} color="#1c1410" />
            <Text className="text-xs font-medium">Annulla</Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}
