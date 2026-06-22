package com.reserveme.service;

import com.reserveme.dto.request.PrenotazioneRequest;
import com.reserveme.dto.response.PrenotazioneResponse;
import com.reserveme.dto.response.SlotDisponibileResponse;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.exception.SlotNonDisponibileException;
import com.reserveme.model.Appuntamento;
import com.reserveme.model.Cliente;
import com.reserveme.model.Negozio;
import com.reserveme.model.Servizio;
import com.reserveme.model.Utente;
import com.reserveme.model.enums.StatoAppuntamento;
import com.reserveme.repository.AppuntamentoRepository;
import com.reserveme.repository.ClienteRepository;
import com.reserveme.repository.NegozioRepository;
import com.reserveme.repository.ServizioRepository;
import com.reserveme.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrenotazioneService {

    private final AppuntamentoRepository appuntamentoRepository;
    private final ClienteRepository clienteRepository;
    private final NegozioRepository negozioRepository;
    private final ServizioRepository servizioRepository;
    private final UtenteRepository utenteRepository;
    private final UtenteContextService utenteContextService;
    private final EmailService emailService;

    @Value("${app.orari.apertura-default}")
    private String aperturaDefault;

    @Value("${app.orari.chiusura-default}")
    private String chiusuraDefault;

    @Transactional(readOnly = true)
    public List<SlotDisponibileResponse> getSlotDisponibili(Long negozioId, Long servizioId, LocalDate data) {
        Negozio negozio = negozioRepository.findById(negozioId)
                .orElseThrow(() -> new ResourceNotFoundException("Negozio", "id", negozioId));
        Servizio servizio = servizioRepository.findById(servizioId)
                .filter(s -> s.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Servizio", "id", servizioId));

        int durataMinuti = servizio.getDurataMinuti() != null ? servizio.getDurataMinuti() : 30;
        LocalDateTime apertura = data.atTime(LocalTime.parse(aperturaDefault));
        LocalDateTime chiusura = data.atTime(LocalTime.parse(chiusuraDefault));

        List<Appuntamento> occupati = appuntamentoRepository
                .findByNegozioIdAndDataOraInizioBetween(negozio.getId(), data.atStartOfDay(), data.atTime(LocalTime.MAX))
                .stream()
                .filter(a -> a.getStato() != StatoAppuntamento.ANNULLATO)
                .collect(Collectors.toList());

        List<SlotDisponibileResponse> slot = new ArrayList<>();
        LocalDateTime inizio = apertura;
        while (!inizio.plusMinutes(durataMinuti).isAfter(chiusura)) {
            LocalDateTime fine = inizio.plusMinutes(durataMinuti);
            final LocalDateTime slotInizio = inizio;
            boolean occupato = occupati.stream().anyMatch(a ->
                    slotInizio.isBefore(a.getDataOraFine()) && fine.isAfter(a.getDataOraInizio()));
            if (!occupato) {
                slot.add(SlotDisponibileResponse.builder().inizio(slotInizio).fine(fine).build());
            }
            inizio = fine;
        }
        return slot;
    }

    @Transactional
    public PrenotazioneResponse creaPrenotazione(PrenotazioneRequest request) {
        UUID utenteId = utenteContextService.getUtenteIdFromContext();
        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));
        Negozio negozio = negozioRepository.findById(request.getNegozioId())
                .orElseThrow(() -> new ResourceNotFoundException("Negozio", "id", request.getNegozioId()));
        Servizio servizio = servizioRepository.findById(request.getServizioId())
                .filter(s -> s.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Servizio", "id", request.getServizioId()));

        Cliente cliente = clienteRepository.findByNegozioIdAndUtenteId(negozio.getId(), utenteId)
                .orElseGet(() -> creaClienteDaUtente(negozio, utente));

        LocalDateTime dataOraFine = request.getDataOraInizio().plusMinutes(
                servizio.getDurataMinuti() != null ? servizio.getDurataMinuti() : 30);

        if (appuntamentoRepository.existsOverlapping(negozio.getId(), request.getDataOraInizio(), dataOraFine)) {
            throw new SlotNonDisponibileException();
        }

        Appuntamento appuntamento = Appuntamento.builder()
                .negozio(negozio)
                .cliente(cliente)
                .servizio(servizio)
                .dataOraInizio(request.getDataOraInizio())
                .dataOraFine(dataOraFine)
                .stato(StatoAppuntamento.IN_ATTESA)
                .note(request.getNote())
                .build();

        Appuntamento saved = appuntamentoRepository.save(appuntamento);

        emailService.sendConfermaAppuntamento(
                utente.getEmail(),
                utente.getNome() + " " + utente.getCognome(),
                saved.getDataOraInizio().toString(),
                servizio.getNomeTrattamento()
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PrenotazioneResponse> getMiePrenotazioni() {
        UUID utenteId = utenteContextService.getUtenteIdFromContext();
        return appuntamentoRepository.findByClienteUtenteIdOrderByDataOraInizioDesc(utenteId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancellaPrenotazione(Long appuntamentoId) {
        UUID utenteId = utenteContextService.getUtenteIdFromContext();
        Appuntamento appuntamento = appuntamentoRepository.findById(appuntamentoId)
                .filter(a -> a.getCliente().getUtente() != null
                        && a.getCliente().getUtente().getId().equals(utenteId))
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", "id", appuntamentoId));
        appuntamento.setStato(StatoAppuntamento.ANNULLATO);
        appuntamentoRepository.save(appuntamento);
    }

    private Cliente creaClienteDaUtente(Negozio negozio, Utente utente) {
        Cliente nuovo = Cliente.builder()
                .negozio(negozio)
                .utente(utente)
                .nome(utente.getNome())
                .cognome(utente.getCognome())
                .telefono(utente.getTelefono() != null ? utente.getTelefono() : "")
                .email(utente.getEmail())
                .build();
        return clienteRepository.save(nuovo);
    }

    private PrenotazioneResponse mapToResponse(Appuntamento appuntamento) {
        return PrenotazioneResponse.builder()
                .id(appuntamento.getId())
                .negozioId(appuntamento.getNegozio().getId())
                .nomeNegozio(appuntamento.getNegozio().getNome())
                .nomeServizio(appuntamento.getServizio().getNomeTrattamento())
                .prezzo(appuntamento.getServizio().getCosto())
                .dataOraInizio(appuntamento.getDataOraInizio())
                .dataOraFine(appuntamento.getDataOraFine())
                .stato(appuntamento.getStato())
                .note(appuntamento.getNote())
                .build();
    }
}
