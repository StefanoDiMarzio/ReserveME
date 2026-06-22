export interface GenericResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type TipoNegozio = 'CENTRO_ESTETICO' | 'BARBERIA' | 'PARRUCCHIERE' | 'CENTRO_MASSAGGI';

export type StatoAppuntamento = 'IN_ATTESA' | 'CONFERMATO' | 'COMPLETATO' | 'ANNULLATO';

export interface ServizioPubblico {
  id: number;
  nomeTrattamento: string;
  costo: number;
  durataMinuti: number | null;
  descrizione: string | null;
}

export interface NegozioPubblico {
  id: number;
  nome: string;
  tipo: TipoNegozio;
  indirizzo: string | null;
  citta: string | null;
  cap: string | null;
  telefono: string | null;
  latitudine: number | null;
  longitudine: number | null;
  distanzaKm: number | null;
  servizi: ServizioPubblico[];
}

export interface SlotDisponibile {
  inizio: string;
  fine: string;
}

export interface Prenotazione {
  id: number;
  negozioId: number;
  nomeNegozio: string;
  nomeServizio: string;
  prezzo: number;
  dataOraInizio: string;
  dataOraFine: string;
  stato: StatoAppuntamento;
  note: string | null;
}

export interface Profilo {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  telefono: string | null;
}

export interface UtenteLoginResponse {
  token: string;
  utenteId: string;
  email: string;
  nome: string;
  cognome: string;
}
