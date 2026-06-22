import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarCheck, Search, Settings } from 'lucide-react-native';

import { MyBookingsScreen } from '@/screens/bookings/MyBookingsScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import type { AppTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#c84f3a',
        tabBarInactiveTintColor: '#a89b91',
        tabBarStyle: {
          backgroundColor: '#fffaf6',
          borderTopColor: '#ece1d8',
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Cerca"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Prenotazioni"
        component={MyBookingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <CalendarCheck color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Impostazioni"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
