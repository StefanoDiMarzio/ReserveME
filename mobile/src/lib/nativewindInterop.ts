import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';

// I componenti core di React Native (View, Text, Pressable, ecc.) supportano "className"
// automaticamente grazie al runtime JSX di NativeWind. I componenti di librerie terze
// (come LinearGradient) vanno registrati esplicitamente per poter usare className.
cssInterop(LinearGradient, {
  className: 'style',
});
