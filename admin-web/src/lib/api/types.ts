export interface GenericResponse<T> {
  status: number
  message: string
  data: T
  timestamp: string
}

export interface PageResponse<T> {
  content: T[]
  number: number
  size: number
  totalElements: number
  totalPages: number
}

export type TipoNegozio = "CENTRO_ESTETICO" | "BARBERIA" | "PARRUCCHIERE" | "CENTRO_MASSAGGI"
export type StatoAppuntamento = "IN_ATTESA" | "CONFERMATO" | "COMPLETATO" | "ANNULLATO"
export type MetodoPagamento = "CONTANTI" | "POS" | "MISTO"
export type TipoDocumento = "SCONTRINO" | "FATTURA"
export type StatoDocumento = "EMESSO" | "ANNULLATO"
export type TipoMovimento = "ENTRATA" | "USCITA"

export interface LoginResponse {
  token: string
  codiceUnivoco: string
  nome: string
  cognome: string
  email: string
  negozioId: number
  nomeNegozio: string
}

export interface Negozio {
  id: number
  nome: string
  tipo: TipoNegozio
  indirizzo: string | null
  citta: string | null
  cap: string | null
  telefono: string | null
  partitaIva: string | null
  latitudine: number | null
  longitudine: number | null
  createdAt: string
  updatedAt: string
}

export interface Servizio {
  id: number
  negozio?: Negozio
  nomeTrattamento: string
  costo: number
  durataMinuti: number | null
  descrizione: string | null
  infoAggiuntive: string | null
  attivo: boolean
  createdAt: string
  updatedAt: string
}

export interface UtenteApp {
  id: string
  email: string
  nome: string
  cognome: string
  telefono: string | null
}

export interface Cliente {
  id: number
  negozio?: Negozio
  nome: string
  cognome: string
  telefono: string
  email: string | null
  note: string | null
  utente: UtenteApp | null
  createdAt: string
  updatedAt: string
}

export interface Appuntamento {
  id: number
  negozio: Negozio
  cliente: Cliente
  servizio: Servizio
  dataOraInizio: string
  dataOraFine: string
  stato: StatoAppuntamento
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface Prodotto {
  id: number
  nome: string
  descrizione: string | null
  quantita: number
  prezzoAcquisto: number
  prezzoVendita: number
  ricaricoPercentuale: number | null
  sogliaMinima: number
  createdAt: string
  updatedAt: string
}

export interface VoceScontrino {
  id: number
  servizio: Servizio | null
  prodotto: Prodotto | null
  descrizione: string
  quantita: number
  prezzoUnitario: number
  subtotale: number
}

export interface Scontrino {
  id: number
  negozio: Negozio
  cliente: Cliente | null
  appuntamento: Appuntamento | null
  numeroDocumento: string
  dataEmissione: string
  totale: number
  metodoPagamento: MetodoPagamento
  tipoDocumento: TipoDocumento
  stato: StatoDocumento
  importoContanti: number
  importoPos: number
  voci: VoceScontrino[]
  createdAt: string
}

export interface Cassa {
  id: number
  negozio: Negozio
  saldoContanti: number
  saldoPos: number
  ultimoAggiornamento: string
}

export interface MovimentoCassa {
  id: number
  tipo: TipoMovimento
  metodo: MetodoPagamento
  importo: number
  descrizione: string | null
  scontrino: Scontrino | null
  data: string
}

export interface ChiusuraCassa {
  id: number
  dataChiusura: string
  totaleContanti: number
  totalePos: number
  totaleGenerale: number
  numScontrini: number
  numFatture: number
  note: string | null
  createdAt: string
}

export interface DashboardResponse {
  totaleClienti: number
  clientiUltimoMese: number
  clientiUltimaSettimana: number
  clientiUltimoAnno: number
  totaleScontrini: number
  totaleFatture: number
  incassiTotali: number
  incassiUltimoMese: number
  incassiUltimaSettimana: number
}
