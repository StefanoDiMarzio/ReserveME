import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied';

export function useLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestPermission = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== 'granted') {
        setStatus('denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setStatus('granted');
    } catch {
      setStatus('denied');
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { status, coords, requestPermission };
}
