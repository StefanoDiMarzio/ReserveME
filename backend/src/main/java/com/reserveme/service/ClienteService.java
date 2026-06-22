package com.reserveme.service;

import com.reserveme.dto.request.ClienteRequest;
import com.reserveme.exception.ResourceNotFoundException;
import com.reserveme.model.Cliente;
import com.reserveme.model.Negozio;
import com.reserveme.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final NegozioService negozioService;

    public Page<Cliente> getClientiPaginati(Pageable pageable) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return clienteRepository.findByNegozioId(negozio.getId(), pageable);
    }

    public List<Cliente> getTuttiClienti() {
        Negozio negozio = negozioService.getNegozioAttuale();
        return clienteRepository.findByNegozioId(negozio.getId());
    }
    
    public List<Cliente> cercaPerCognome(String cognome) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return clienteRepository.findByNegozioIdAndCognomeContainingIgnoreCase(negozio.getId(), cognome);
    }

    public Cliente getCliente(Long id) {
        Negozio negozio = negozioService.getNegozioAttuale();
        return clienteRepository.findById(id)
                .filter(c -> c.getNegozio().getId().equals(negozio.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
    }

    public Cliente creaCliente(ClienteRequest request) {
        Negozio negozio = negozioService.getNegozioAttuale();
        
        Cliente cliente = Cliente.builder()
                .negozio(negozio)
                .nome(request.getNome())
                .cognome(request.getCognome())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .note(request.getNote())
                .build();
                
        return clienteRepository.save(cliente);
    }

    public Cliente aggiornaCliente(Long id, ClienteRequest request) {
        Cliente cliente = getCliente(id);
        
        cliente.setNome(request.getNome());
        cliente.setCognome(request.getCognome());
        cliente.setTelefono(request.getTelefono());
        cliente.setEmail(request.getEmail());
        cliente.setNote(request.getNote());
        
        return clienteRepository.save(cliente);
    }

    public void eliminaCliente(Long id) {
        Cliente cliente = getCliente(id);
        // Da notare: se ha appuntamenti o scontrini associati, potrebbe fallire 
        // a causa dei vincoli di chiave esterna se non gestiti. Nel model abbiamo CascadeType.ALL.
        clienteRepository.delete(cliente);
    }
}
