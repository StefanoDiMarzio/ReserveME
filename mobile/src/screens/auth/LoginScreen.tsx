import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Mail, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/auth/AuthContext';
import { extractErrorMessage } from '@/api/client';
import type { RootStackParamList } from '@/navigation/types';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(extractErrorMessage(e, 'Credenziali non valide. Riprova.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#e8693f', '#c84f3a']}
        className="h-72 items-center justify-end rounded-b-[40px] pb-10"
      >
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
          <Sparkles size={30} color="#fff" />
        </View>
        <Text className="mt-4 text-3xl font-bold text-white">ReserveME</Text>
        <Text className="mt-1 text-white/80">Il centro giusto, sempre vicino a te</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="-mt-8 flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 pt-8 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-3xl bg-card p-6 shadow-sm shadow-black/5">
            <Text variant="h2">Bentornato</Text>
            <Text variant="muted" className="mt-1">
              Accedi per gestire le tue prenotazioni
            </Text>

            <View className="mt-6 gap-3">
              <Input
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color="#8a7c73" />}
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

            <Button className="mt-6" loading={loading} onPress={handleLogin}>
              Accedi
            </Button>

            <View className="mt-5 flex-row justify-center gap-1">
              <Text variant="muted">Non hai un account?</Text>
              <Text
                className="font-semibold text-primary"
                onPress={() => navigation.navigate('Register')}
              >
                Registrati
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
