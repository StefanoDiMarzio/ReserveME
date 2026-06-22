package com.reserveme.service;

import com.reserveme.dto.request.ScontrinoRequest;
import com.reserveme.dto.request.VoceScontrinoRequest;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.*;
import com.reserveme.model.enums.MetodoPagamento;
import com.reserveme.model.enums.StatoAppuntamento;
import com.reserveme.model.enums.StatoDocumento;
import com.reserveme.model.enums.TipoMovimento;
import com.reserveme.repository.ScontrinoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class ScontrinoService {

    private final ScontrinoRepository scontrinoRepository;
    private final NegozioService negozioService;
    private final ClienteService clienteService;
    private final AppuntamentoService appuntamentoService;
    private final ServizioService servizioService;
    private final ProdottoService prodottoService;
    private final CassaService cassaService;

    public Page<Scontrino> getScontrini(Pageable pageable) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return scontrinoRepository.findByNegozioId(negozio.getId(), pageable);
    }

    public Scontrino getScontrino(Long id) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return scontrinoRepository.findById(id)
                .filter(s -> s.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Scontrino", "id", id));
    }

    @Transactional
    public Scontrino emettiScontrino(ScontrinoRequest request) {
        Negozio negozio = negozioService.getNegozioAttuale();
        Cliente cliente = request.getClienteId() != null ? clienteService.getCliente(request.getClienteId()) : null;
        Appuntamento appuntamento = request.getAppuntamentoId() != null ? appuntamentoService.getAppuntamento(request.getAppuntamentoId()) : null;

        // Calcolo totale scontrino
        BigDecimal totale = BigDecimal.ZERO;

        int numeroDoc = scontrinoRepository.findMaxNumeroDocumento(negozio.getId()) + 1;
        
        Scontrino scontrino = Scontrino.builder()
                .negozio(negozio)
                .cliente(cliente)
                .appuntamento(appuntamento)
                .numeroDocumento(String.valueOf(numeroDoc))
                .dataEmissione(LocalDateTime.now())
                .metodoPagamento(request.getMetodoPagamento())
                .tipoDocumento(request.getTipoDocumento())
                .stato(StatoDocumento.EMESSO)
                .build();

        // Aggiunta voci
        for (VoceScontrinoRequest voceReq : request.getVoci()) {
            Servizio servizio = voceReq.getServizioId() != null ? servizioService.getServizio(voceReq.getServizioId()) : null;
            Prodotto prodotto = voceReq.getProdottoId() != null ? prodottoService.getProdotto(voceReq.getProdottoId()) : null;
            
            if (servizio == null && prodotto == null) {
                throw new IllegalArgumentException("La voce deve essere associata a un servizio o a un prodotto");
            }

            BigDecimal prezzoUnitario = voceReq.getPrezzoUnitario();
            if (prezzoUnitario == null) {
                prezzoUnitario = servizio != null ? servizio.getCosto() : prodotto.getPrezzoVendita();
            }

            BigDecimal subtotale = prezzoUnitario.multiply(BigDecimal.valueOf(voceReq.getQuantita()));
            totale = totale.add(subtotale);

            VoceScontrino voce = VoceScontrino.builder()
                    .scontrino(scontrino)
                    .servizio(servizio)
                    .prodotto(prodotto)
                    .descrizione(voceReq.getDescrizione() != null ? voceReq.getDescrizione() : (servizio != null ? servizio.getNomeTrattamento() : prodotto.getNome()))
                    .quantita(voceReq.getQuantita())
                    .prezzoUnitario(prezzoUnitario)
                    .subtotale(subtotale)
                    .build();

            scontrino.getVoci().add(voce);

            // Se è un prodotto, scala la quantità in inventario
            if (prodotto != null) {
                int nuovaQuantita = prodotto.getQuantita() - voceReq.getQuantita();
                if (nuovaQuantita < 0) {
                    throw new IllegalArgumentException("Quantità insufficiente in magazzino per il prodotto: " + prodotto.getNome());
                }
                prodotto.setQuantita(nuovaQuantita);
                // JPA will automatically save this because it's managed if we inject it or we explicitly save it (already managed by ProdottoService)
            }
        }

        scontrino.setTotale(totale);

        // Gestione ripartizione pagamento
        if (request.getMetodoPagamento() == MetodoPagamento.CONTANTI) {
            scontrino.setImportoContanti(totale);
        } else if (request.getMetodoPagamento() == MetodoPagamento.POS) {
            scontrino.setImportoPos(totale);
        } else if (request.getMetodoPagamento() == MetodoPagamento.MISTO) {
            if (request.getImportoContanti() == null || request.getImportoPos() == null) {
                throw new IllegalArgumentException("Per pagamento MISTO specificare importoContanti e importoPos");
            }
            if (request.getImportoContanti().add(request.getImportoPos()).compareTo(totale) != 0) {
                throw new IllegalArgumentException("La somma di contanti e POS non corrisponde al totale");
            }
            scontrino.setImportoContanti(request.getImportoContanti());
            scontrino.setImportoPos(request.getImportoPos());
        }

        Scontrino savedScontrino = scontrinoRepository.save(scontrino);

        // Registrazione in cassa
        Cassa cassa = cassaService.getCassaAttuale();
        if (scontrino.getImportoContanti().compareTo(BigDecimal.ZERO) > 0) {
            cassaService.registraMovimento(cassa, TipoMovimento.ENTRATA, MetodoPagamento.CONTANTI, scontrino.getImportoContanti(), "Emissione " + scontrino.getTipoDocumento() + " n." + scontrino.getNumeroDocumento(), savedScontrino);
        }
        if (scontrino.getImportoPos().compareTo(BigDecimal.ZERO) > 0) {
            cassaService.registraMovimento(cassa, TipoMovimento.ENTRATA, MetodoPagamento.POS, scontrino.getImportoPos(), "Emissione " + scontrino.getTipoDocumento() + " n." + scontrino.getNumeroDocumento(), savedScontrino);
        }

        log.info("Emesso nuovo documento n.{} per totale {} EUR", savedScontrino.getNumeroDocumento(), totale);

        // Se c'è un appuntamento, mettilo a COMPLETATO
        if (appuntamento != null && appuntamento.getStato() != StatoAppuntamento.COMPLETATO) {
            appuntamento.setStato(StatoAppuntamento.COMPLETATO);
            // JPA saves automatically on flush
        }

        return savedScontrino;
    }

    @Transactional
    public Scontrino annullaScontrino(Long id) {
        Scontrino scontrino = getScontrino(id);
        
        if (scontrino.getStato() == StatoDocumento.ANNULLATO) {
            throw new IllegalArgumentException("Il documento è già annullato");
        }

        scontrino.setStato(StatoDocumento.ANNULLATO);
        scontrinoRepository.save(scontrino);

        // Genera movimenti di storno in cassa
        Cassa cassa = cassaService.getCassaAttuale();
        if (scontrino.getImportoContanti().compareTo(BigDecimal.ZERO) > 0) {
            cassaService.registraMovimento(cassa, TipoMovimento.USCITA, MetodoPagamento.CONTANTI, scontrino.getImportoContanti(), "Storno " + scontrino.getTipoDocumento() + " n." + scontrino.getNumeroDocumento(), scontrino);
        }
        if (scontrino.getImportoPos().compareTo(BigDecimal.ZERO) > 0) {
            cassaService.registraMovimento(cassa, TipoMovimento.USCITA, MetodoPagamento.POS, scontrino.getImportoPos(), "Storno " + scontrino.getTipoDocumento() + " n." + scontrino.getNumeroDocumento(), scontrino);
        }

        // Ripristino magazzino
        for (VoceScontrino voce : scontrino.getVoci()) {
            if (voce.getProdotto() != null) {
                Prodotto prodotto = voce.getProdotto();
                prodotto.setQuantita(prodotto.getQuantita() + voce.getQuantita());
            }
        }

        return scontrino;
    }
}
