import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { extractErrorMessage } from '@/api/client';
import { cambiaPassword } from '@/api/profiloApi';
import type { RootStackParamList } from '@/navigation/types';

export function ChangePasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [vecchiaPassword, setVecchiaPassword] = useState('');
  const [nuovaPassword, setNuovaPassword] = useState('');
  const [confermaPassword, setConfermaPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (nuovaPassword !== confermaPassword) {
      setError('Le password non coincidono');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await cambiaPassword({ vecchiaPassword, nuovaPassword });
      Alert.alert('Fatto', 'Password aggiornata con successo', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(extractErrorMessage(e, 'La vecchia password non è corretta.'));
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
          <Text variant="h3">Cambia password</Text>
        </View>

        <View className="mt-4 gap-3">
          <Input
            placeholder="Password attuale"
            secureTextEntry
            value={vecchiaPassword}
            onChangeText={setVecchiaPassword}
            leftIcon={<Lock size={18} color="#8a7c73" />}
          />
          <Input
            placeholder="Nuova password"
            secureTextEntry
            value={nuovaPassword}
            onChangeText={setNuovaPassword}
            leftIcon={<Lock size={18} color="#8a7c73" />}
          />
          <Input
            placeholder="Conferma nuova password"
            secureTextEntry
            value={confermaPassword}
            onChangeText={setConfermaPassword}
            leftIcon={<Lock size={18} color="#8a7c73" />}
          />
        </View>

        {error && <Text className="mt-3 text-sm text-destructive">{error}</Text>}

        <Button className="mt-6" loading={loading} onPress={handleSave}>
          Aggiorna password
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
