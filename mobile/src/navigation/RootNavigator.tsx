import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AppTabs } from '@/navigation/AppTabs';
import type { RootStackParamList } from '@/navigation/types';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ConfirmBookingScreen } from '@/screens/negozio/ConfirmBookingScreen';
import { NegozioDetailScreen } from '@/screens/negozio/NegozioDetailScreen';
import { ServiceSlotPickerScreen } from '@/screens/negozio/ServiceSlotPickerScreen';
import { ChangePasswordScreen } from '@/screens/settings/ChangePasswordScreen';
import { EditProfileScreen } from '@/screens/settings/EditProfileScreen';
import { useAuth } from '@/auth/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#c84f3a" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={AppTabs} />
            <Stack.Screen
              name="NegozioDetail"
              component={NegozioDetailScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen name="ServiceSlotPicker" component={ServiceSlotPickerScreen} />
            <Stack.Screen
              name="ConfirmBooking"
              component={ConfirmBookingScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
