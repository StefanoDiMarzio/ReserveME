import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, KeyRound, LogOut, Moon, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Alert, Pressable, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/auth/AuthContext';
import type { RootStackParamList } from '@/navigation/types';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const fullName = user ? `${user.nome} ${user.cognome}`.trim() : '';

  function handleLogout() {
    Alert.alert('Esci', 'Vuoi disconnetterti dal tuo account?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="px-5 pt-2">
        <Text variant="h2">Impostazioni</Text>

        <Card className="mt-5 flex-row items-center gap-3 p-4">
          <Avatar name={fullName || 'U'} size={52} />
          <View className="flex-1">
            <Text className="font-semibold">{fullName || 'Il tuo account'}</Text>
            <Text variant="muted" numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </Card>

        <Text variant="label" className="mb-2 mt-6">
          Account
        </Text>
        <Card>
          <MenuRow
            icon={User}
            label="Modifica profilo"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <View className="h-px bg-border" />
          <MenuRow
            icon={KeyRound}
            label="Cambia password"
            onPress={() => navigation.navigate('ChangePassword')}
            last
          />
        </Card>

        <Text variant="label" className="mb-2 mt-6">
          Aspetto
        </Text>
        <Card className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <Moon size={18} color="#8a7c73" />
            <Text>Tema scuro</Text>
          </View>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={toggleColorScheme}
            trackColor={{ true: '#c84f3a', false: '#e4d9d0' }}
          />
        </Card>

        <Pressable
          onPress={handleLogout}
          className="mt-8 flex-row items-center justify-center gap-2 rounded-xl bg-secondary py-4 active:opacity-80"
        >
          <LogOut size={18} color="#b3392c" />
          <Text className="font-semibold text-destructive">Esci dall'account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onPress,
  last,
}: {
  icon: typeof User;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 active:bg-secondary ${last ? 'rounded-b-2xl' : 'rounded-t-2xl'}`}
    >
      <View className="flex-row items-center gap-3">
        <Icon size={18} color="#8a7c73" />
        <Text>{label}</Text>
      </View>
      <ChevronRight size={18} color="#8a7c73" />
    </Pressable>
  );
}
