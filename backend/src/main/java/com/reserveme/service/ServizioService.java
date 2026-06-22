package com.reserveme.service;

import com.reserveme.dto.request.ServizioRequest;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Negozio;
import com.reserveme.model.Servizio;
import com.reserveme.repository.ServizioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServizioService {

    private final ServizioRepository servizioRepository;
    private final NegozioService negozioService;

    public List<Servizio> getServiziAttivi() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return servizioRepository.findByNegozioIdAndAttivoTrue(negozio.getId());
    }

    public List<Servizio> getTuttiServizi() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return servizioRepository.findByNegozioId(negozio.getId());
    }

    public Servizio getServizio(Long id) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return servizioRepository.findById(id)
                .filter(s -> s.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Servizio", "id", id));
    }

    public Servizio creaServizio(ServizioRequest request) {
        Negozio negozio = negozioService.getNegozioAttuale();
        
        Servizio servizio = Servizio.builder()
                .negozio(negozio)
                .nomeTrattamento(request.getNomeTrattamento())
                .costo(request.getCosto())
                .durataMinuti(request.getDurataMinuti())
                .descrizione(request.getDescrizione())
                .infoAggiuntive(request.getInfoAggiuntive())
                .attivo(request.getAttivo() != null ? request.getAttivo() : true)
                .build();
                
        return servizioRepository.save(servizio);
    }

    public Servizio aggiornaServizio(Long id, ServizioRequest request) {
        Servizio servizio = getServizio(id);
        
        servizio.setNomeTrattamento(request.getNomeTrattamento());
        servizio.setCosto(request.getCosto());
        servizio.setDurataMinuti(request.getDurataMinuti());
        servizio.setDescrizione(request.getDescrizione());
        servizio.setInfoAggiuntive(request.getInfoAggiuntive());
        if (request.getAttivo() != null) {
            servizio.setAttivo(request.getAttivo());
        }
        
        return servizioRepository.save(servizio);
    }

    public void disattivaServizio(Long id) {
        Servizio servizio = getServizio(id);
        servizio.setAttivo(false);
        servizioRepository.save(servizio);
    }
}
