package com.reserveme.service;

import com.reserveme.dto.response.NegozioPubblicoResponse;
import com.reserveme.dto.response.ServizioPubblicoResponse;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Negozio;
import com.reserveme.model.Servizio;
import com.reserveme.model.enums.TipoNegozio;
import com.reserveme.repository.NegozioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NegozioPubblicoService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    private final NegozioRepository negozioRepository;

    @Transactional(readOnly = true)
    public Page<NegozioPubblicoResponse> cerca(String testo, TipoNegozio tipo, Double lat, Double lng, int page, int size) {
        String testoFiltro = (testo == null || testo.isBlank()) ? "" : testo;

        List<NegozioPubblicoResponse> risultati = negozioRepository.searchPubblico(testoFiltro, tipo).stream()
                .map(n -> mapToDto(n, lat, lng))
                .collect(Collectors.toList());

        if (lat != null && lng != null) {
            risultati.sort(Comparator.comparing(
                    NegozioPubblicoResponse::getDistanzaKm,
                    Comparator.nullsLast(Comparator.naturalOrder())));
        }

        return paginate(risultati, page, size);
    }

    @Transactional(readOnly = true)
    public NegozioPubblicoResponse getDettaglio(Long id) {
        Negozio negozio = negozioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Negozio", "id", id));
        return mapToDto(negozio, null, null);
    }

    private NegozioPubblicoResponse mapToDto(Negozio negozio, Double lat, Double lng) {
        Double distanzaKm = null;
        if (lat != null && lng != null && negozio.getLatitudine() != null && negozio.getLongitudine() != null) {
            distanzaKm = haversineKm(lat, lng, negozio.getLatitudine().doubleValue(), negozio.getLongitudine().doubleValue());
        }

        List<ServizioPubblicoResponse> servizi = negozio.getServizi().stream()
                .filter(Servizio::getAttivo)
                .map(s -> ServizioPubblicoResponse.builder()
                        .id(s.getId())
                        .nomeTrattamento(s.getNomeTrattamento())
                        .costo(s.getCosto())
                        .durataMinuti(s.getDurataMinuti())
                        .descrizione(s.getDescrizione())
                        .build())
                .collect(Collectors.toList());

        return NegozioPubblicoResponse.builder()
                .id(negozio.getId())
                .nome(negozio.getNome())
                .tipo(negozio.getTipo())
                .indirizzo(negozio.getIndirizzo())
                .citta(negozio.getCitta())
                .cap(negozio.getCap())
                .telefono(negozio.getTelefono())
                .latitudine(negozio.getLatitudine())
                .longitudine(negozio.getLongitudine())
                .distanzaKm(distanzaKm)
                .servizi(servizi)
                .build();
    }

    private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private Page<NegozioPubblicoResponse> paginate(List<NegozioPubblicoResponse> risultati, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        int start = Math.min((int) pageRequest.getOffset(), risultati.size());
        int end = Math.min(start + pageRequest.getPageSize(), risultati.size());
        return new PageImpl<>(risultati.subList(start, end), pageRequest, risultati.size());
    }
}
