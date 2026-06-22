// In sviluppo, "localhost" non funziona su device/emulatore fisico: usa l'IP LAN del PC
// che esegue il backend (es. http://192.168.1.50:8080) oppure 10.0.2.2 per l'emulatore Android.
// Configurabile via variabile d'ambiente EXPO_PUBLIC_API_URL senza modificare il codice.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const DEFAULT_REGION = {
  latitude: 41.9028,
  longitude: 12.4964,
  latitudeDelta: 4,
  longitudeDelta: 4,
};
