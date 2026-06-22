package com.reserveme.service;

import com.reserveme.dto.response.DashboardResponse;
import com.reserveme.model.Negozio;
import com.reserveme.model.enums.TipoDocumento;
import com.reserveme.repository.AppuntamentoRepository;
import com.reserveme.repository.ScontrinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppuntamentoRepository appuntamentoRepository;
    private final ScontrinoRepository scontrinoRepository;
    private final NegozioService negozioService;

    public DashboardResponse getDashboardData() {
        Negozio negozio = negozioService.getNegozioAttuale();
        Long negozioId = negozio.getId();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);
        LocalDateTime oneWeekAgo = now.minusWeeks(1);
        LocalDateTime oneYearAgo = now.minusYears(1);
        LocalDateTime startOfTime = LocalDateTime.of(1970, 1, 1, 0, 0);

        // Clienti Ricevuti (basato sugli appuntamenti completati)
        long totaleClienti = appuntamentoRepository.countClientiRicevuti(negozioId, startOfTime, now);
        long clientiUltimoMese = appuntamentoRepository.countClientiRicevuti(negozioId, oneMonthAgo, now);
        long clientiUltimaSettimana = appuntamentoRepository.countClientiRicevuti(negozioId, oneWeekAgo, now);
        long clientiUltimoAnno = appuntamentoRepository.countClientiRicevuti(negozioId, oneYearAgo, now);

        // Incassi (Scontrini/Fatture Emessi)
        BigDecimal incassiTotali = scontrinoRepository.sumIncassi(negozioId, startOfTime, now);
        BigDecimal incassiUltimoMese = scontrinoRepository.sumIncassi(negozioId, oneMonthAgo, now);
        BigDecimal incassiUltimaSettimana = scontrinoRepository.sumIncassi(negozioId, oneWeekAgo, now);

        // Documenti
        long totaleScontrini = scontrinoRepository.countByTipoAndPeriodo(negozioId, TipoDocumento.SCONTRINO, startOfTime, now);
        long totaleFatture = scontrinoRepository.countByTipoAndPeriodo(negozioId, TipoDocumento.FATTURA, startOfTime, now);

        return DashboardResponse.builder()
                .totaleClienti(totaleClienti)
                .clientiUltimoMese(clientiUltimoMese)
                .clientiUltimaSettimana(clientiUltimaSettimana)
                .clientiUltimoAnno(clientiUltimoAnno)
                .totaleScontrini(totaleScontrini)
                .totaleFatture(totaleFatture)
                .incassiTotali(incassiTotali)
                .incassiUltimoMese(incassiUltimoMese)
                .incassiUltimaSettimana(incassiUltimaSettimana)
                .build();
    }
}
