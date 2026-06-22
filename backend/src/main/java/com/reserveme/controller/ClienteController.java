package com.reserveme.controller;

import com.reserveme.dto.request.ClienteRequest;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.model.Cliente;
import com.reserveme.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/clienti")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<GenericResponse<Page<Cliente>>> getClientiPaginati(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Clienti recuperati",
                clienteService.getClientiPaginati(PageRequest.of(page, size)),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/tutti")
    public ResponseEntity<GenericResponse<List<Cliente>>> getTuttiClienti() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Tutti i clienti recuperati",
                clienteService.getTuttiClienti(),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/cerca")
    public ResponseEntity<GenericResponse<List<Cliente>>> cercaClienti(@RequestParam String cognome) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Risultati ricerca clienti",
                clienteService.cercaPerCognome(cognome),
                LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<Cliente>> getCliente(@PathVariable Long id) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Cliente recuperato",
                clienteService.getCliente(id),
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping
    public ResponseEntity<GenericResponse<Cliente>> creaCliente(@Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Cliente creato",
                clienteService.creaCliente(request),
                LocalDateTime.now().toString()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenericResponse<Cliente>> aggiornaCliente(@PathVariable Long id, @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Cliente aggiornato",
                clienteService.aggiornaCliente(id, request),
                LocalDateTime.now().toString()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GenericResponse<String>> eliminaCliente(@PathVariable Long id) {
        clienteService.eliminaCliente(id);
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Cliente eliminato",
                "OK",
                LocalDateTime.now().toString()
        ));
    }
}
