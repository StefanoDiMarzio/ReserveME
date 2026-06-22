package com.reserveme.service;

import com.reserveme.dto.request.ProdottoRequest;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Negozio;
import com.reserveme.model.Prodotto;
import com.reserveme.repository.ProdottoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdottoService {

    private final ProdottoRepository prodottoRepository;
    private final NegozioService negozioService;

    public Page<Prodotto> getInventario(Pageable pageable) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return prodottoRepository.findByNegozioId(negozio.getId(), pageable);
    }

    public List<Prodotto> getProdottiSottoSoglia() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return prodottoRepository.findSottoSoglia(negozio.getId());
    }

    public Prodotto getProdotto(Long id) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return prodottoRepository.findById(id)
                .filter(p -> p.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto", "id", id));
    }

    public Prodotto creaProdotto(ProdottoRequest request) {
        Negozio negozio = negozioService.getNegozioAttuale();
        
        Prodotto prodotto = Prodotto.builder()
                .negozio(negozio)
                .nome(request.getNome())
                .descrizione(request.getDescrizione())
                .quantita(request.getQuantita())
                .prezzoAcquisto(request.getPrezzoAcquisto())
                .prezzoVendita(request.getPrezzoVendita())
                .sogliaMinima(request.getSogliaMinima() != null ? request.getSogliaMinima() : 0)
                .build();
                
        // Il calcolo del ricarico è gestito da @PrePersist/@PreUpdate nell'entità Prodotto
        return prodottoRepository.save(prodotto);
    }

    public Prodotto aggiornaProdotto(Long id, ProdottoRequest request) {
        Prodotto prodotto = getProdotto(id);
        
        prodotto.setNome(request.getNome());
        prodotto.setDescrizione(request.getDescrizione());
        prodotto.setQuantita(request.getQuantita());
        prodotto.setPrezzoAcquisto(request.getPrezzoAcquisto());
        prodotto.setPrezzoVendita(request.getPrezzoVendita());
        if (request.getSogliaMinima() != null) {
            prodotto.setSogliaMinima(request.getSogliaMinima());
        }
        
        return prodottoRepository.save(prodotto);
    }

    public Prodotto aggiungiCarico(Long id, int quantitaDaAggiungere) {
        if (quantitaDaAggiungere <= 0) {
            throw new IllegalArgumentException("La quantità da aggiungere deve essere maggiore di zero");
        }
        Prodotto prodotto = getProdotto(id);
        prodotto.setQuantita(prodotto.getQuantita() + quantitaDaAggiungere);
        return prodottoRepository.save(prodotto);
    }

    public void eliminaProdotto(Long id) {
        Prodotto prodotto = getProdotto(id);
        prodottoRepository.delete(prodotto);
    }
}
