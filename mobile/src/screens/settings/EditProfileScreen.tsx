import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { extractErrorMessage } from '@/api/client';
import { aggiornaProfilo, getProfilo } from '@/api/profiloApi';
import type { RootStackParamList } from '@/navigation/types';

export function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: profilo } = useQuery({ queryKey: ['profilo'], queryFn: getProfilo });

  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profilo) {
      setNome(profilo.nome);
      setCognome(profilo.cognome);
      setTelefono(profilo.telefono ?? '');
    }
  }, [profilo]);

  async function handleSave() {
    setError(null);
    setLoading(true);
    try {
      await aggiornaProfilo({ nome: nome.trim(), cognome: cognome.trim(), telefono: telefono.trim() || undefined });
      navigation.goBack();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-5 pb-10">
        <View className="flex-row items-center gap-3 py-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft size={20} color="#1c1410" />
          </Pressable>
          <Text variant="h3">Modifica profilo</Text>
        </View>

        <View className="mt-4 gap-3">
          <View>
            <Text variant="label" className="mb-1.5">
              Nome
            </Text>
            <Input value={nome} onChangeText={setNome} />
          </View>
          <View>
            <Text variant="label" className="mb-1.5">
              Cognome
            </Text>
            <Input value={cognome} onChangeText={setCognome} />
          </View>
          <View>
            <Text variant="label" className="mb-1.5">
              Telefono
            </Text>
            <Input value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          </View>
        </View>

        {error && <Text className="mt-3 text-sm text-destructive">{error}</Text>}

        <Button className="mt-6" loading={loading} onPress={handleSave}>
          Salva modifiche
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
