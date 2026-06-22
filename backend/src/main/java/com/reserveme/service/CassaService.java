package com.reserveme.service;

import com.reserveme.dto.request.ChiusuraCassaRequest;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Cassa;
import com.reserveme.model.ChiusuraCassa;
import com.reserveme.model.MovimentoCassa;
import com.reserveme.model.Negozio;
import com.reserveme.model.Scontrino;
import com.reserveme.model.enums.MetodoPagamento;
import com.reserveme.model.enums.TipoDocumento;
import com.reserveme.model.enums.TipoMovimento;
import com.reserveme.repository.CassaRepository;
import com.reserveme.repository.ChiusuraCassaRepository;
import com.reserveme.repository.MovimentoCassaRepository;
import com.reserveme.repository.ScontrinoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CassaService {

    private final CassaRepository cassaRepository;
    private final MovimentoCassaRepository movimentoCassaRepository;
    private final ChiusuraCassaRepository chiusuraCassaRepository;
    private final ScontrinoRepository scontrinoRepository;
    private final NegozioService negozioService;

    public Cassa getCassaAttuale() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return cassaRepository.findByNegozioId(negozio.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cassa non trovata per il negozio"));
    }

    @Transactional
    public MovimentoCassa registraMovimento(Cassa cassa, TipoMovimento tipo, MetodoPagamento metodo, BigDecimal importo, String descrizione, Scontrino scontrino) {
        MovimentoCassa movimento = MovimentoCassa.builder()
                .cassa(cassa)
                .tipo(tipo)
                .metodo(metodo)
                .importo(importo)
                .descrizione(descrizione)
                .scontrino(scontrino)
                .data(LocalDateTime.now())
                .build();

        // Aggiorna saldo
        if (tipo == TipoMovimento.ENTRATA) {
            if (metodo == MetodoPagamento.CONTANTI) {
                cassa.setSaldoContanti(cassa.getSaldoContanti().add(importo));
            } else if (metodo == MetodoPagamento.POS) {
                cassa.setSaldoPos(cassa.getSaldoPos().add(importo));
            }
        } else { // USCITA
            if (metodo == MetodoPagamento.CONTANTI) {
                cassa.setSaldoContanti(cassa.getSaldoContanti().subtract(importo));
            } else if (metodo == MetodoPagamento.POS) {
                cassa.setSaldoPos(cassa.getSaldoPos().subtract(importo));
            }
        }
        
        cassa.setUltimoAggiornamento(LocalDateTime.now());
        cassaRepository.save(cassa);

        log.info("Registrato movimento in cassa {}: {} di {} {}", cassa.getId(), tipo, importo, metodo);

        return movimentoCassaRepository.save(movimento);
    }

    public List<MovimentoCassa> getStoricoMovimenti() {
        Cassa cassa = getCassaAttuale();
        return movimentoCassaRepository.findByCassaIdOrderByDataDesc(cassa.getId());
    }

    @Transactional
    public ChiusuraCassa effettuaChiusura(ChiusuraCassaRequest request) {
        Cassa cassa = getCassaAttuale();
        Negozio negozio = cassa.getNegozio();

        // Trova l'ultima chiusura per definire il periodo
        LocalDateTime ultimaChiusura = chiusuraCassaRepository.findUltimaChiusura(cassa.getId())
                .orElse(negozio.getCreatedAt()); // Se non c'è chiusura precedente, usa data creazione negozio

        LocalDateTime now = LocalDateTime.now();

        // Calcolo totali scontrini in quel periodo
        long countScontrini = scontrinoRepository.countByTipoAndPeriodo(negozio.getId(), TipoDocumento.SCONTRINO, ultimaChiusura, now);
        long countFatture = scontrinoRepository.countByTipoAndPeriodo(negozio.getId(), TipoDocumento.FATTURA, ultimaChiusura, now);

        BigDecimal totaleGenerale = cassa.getSaldoContanti().add(cassa.getSaldoPos());

        ChiusuraCassa chiusura = ChiusuraCassa.builder()
                .cassa(cassa)
                .dataChiusura(now)
                .totaleContanti(cassa.getSaldoContanti())
                .totalePos(cassa.getSaldoPos())
                .totaleGenerale(totaleGenerale)
                .numScontrini((int) countScontrini)
                .numFatture((int) countFatture)
                .note(request.getNote())
                .build();

        chiusuraCassaRepository.save(chiusura);

        // Azzera i saldi della cassa dopo la chiusura
        cassa.setSaldoContanti(BigDecimal.ZERO);
        cassa.setSaldoPos(BigDecimal.ZERO);
        cassa.setUltimoAggiornamento(now);
        cassaRepository.save(cassa);

        return chiusura;
    }

    public List<ChiusuraCassa> getStoricoChiusure() {
        Cassa cassa = getCassaAttuale();
        return chiusuraCassaRepository.findByCassaIdOrderByDataChiusuraDesc(cassa.getId());
    }
}
