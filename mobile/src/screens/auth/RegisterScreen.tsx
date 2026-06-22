import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/auth/AuthContext';
import { extractErrorMessage } from '@/api/client';
import type { RootStackParamList } from '@/navigation/types';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      await register({
        nome: nome.trim(),
        cognome: cognome.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
        password,
      });
    } catch (e) {
      setError(extractErrorMessage(e, 'Non è stato possibile completare la registrazione.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="px-6 pb-10 pt-16" keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <ArrowLeft size={20} color="#1c1410" />
        </Pressable>

        <Text variant="h1">Crea il tuo account</Text>
        <Text variant="muted" className="mt-1">
          Cerca, prenota e gestisci i tuoi appuntamenti preferiti
        </Text>

        <View className="mt-6 gap-3">
          <View className="flex-row gap-3">
            <Input
              containerClassName="flex-1"
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              leftIcon={<User size={18} color="#8a7c73" />}
            />
            <Input
              containerClassName="flex-1"
              placeholder="Cognome"
              value={cognome}
              onChangeText={setCognome}
            />
          </View>
          <Input
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color="#8a7c73" />}
          />
          <Input
            placeholder="Telefono (opzionale)"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
            leftIcon={<Phone size={18} color="#8a7c73" />}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color="#8a7c73" />}
          />
        </View>

        {error && <Text className="mt-3 text-sm text-destructive">{error}</Text>}

        <Button className="mt-6" loading={loading} onPress={handleRegister}>
          Crea account
        </Button>

        <View className="mt-5 flex-row justify-center gap-1">
          <Text variant="muted">Hai già un account?</Text>
          <Text className="font-semibold text-primary" onPress={() => navigation.navigate('Login')}>
            Accedi
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
