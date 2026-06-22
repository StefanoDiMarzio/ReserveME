import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ServizioPubblico } from '@/api/types';

export type AppTabParamList = {
  Cerca: undefined;
  Prenotazioni: undefined;
  Impostazioni: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: NavigatorScreenParams<AppTabParamList> | undefined;
  NegozioDetail: { negozioId: number };
  ServiceSlotPicker: { negozioId: number; nomeNegozio: string; servizio: ServizioPubblico };
  ConfirmBooking: {
    negozioId: number;
    nomeNegozio: string;
    servizio: ServizioPubblico;
    inizio: string;
    fine: string;
  };
  EditProfile: undefined;
  ChangePassword: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
