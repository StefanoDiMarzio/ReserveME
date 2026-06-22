package com.reserveme.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.reserveme.dto.request.AppuntamentoRequest;
import com.reserveme.exception.SlotNonDisponibileException;
import com.reserveme.model.Amministratore;
import com.reserveme.model.Appuntamento;
import com.reserveme.model.Cliente;
import com.reserveme.model.Negozio;
import com.reserveme.model.Servizio;
import com.reserveme.repository.AppuntamentoRepository;

@ExtendWith(MockitoExtension.class)
class AppuntamentoServiceTest {

    @Mock
    private AppuntamentoRepository appuntamentoRepository;

    @Mock
    private NegozioService negozioService;

    @Mock
    private ClienteService clienteService;

    @Mock
    private ServizioService servizioService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AppuntamentoService appuntamentoService;

    private Negozio negozio;
    private Cliente cliente;
    private Servizio servizio;

    @BeforeEach
    public void setUp() {
        Amministratore admin = new Amministratore();
        admin.setId(UUID.randomUUID());

        negozio = new Negozio();
        negozio.setId(1L);
        negozio.setAmministratore(admin);

        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("Mario");
        cliente.setCognome("Rossi");
        cliente.setEmail("mario@example.com");

        servizio = new Servizio();
        servizio.setId(1L);
        servizio.setNomeTrattamento("Taglio");
        servizio.setCosto(new BigDecimal("20"));
        servizio.setDurataMinuti(30);
    }

    @Test
    void creaAppuntamento_SlotOccupato_ThrowsException() {
        // Arrange
        AppuntamentoRequest request = new AppuntamentoRequest();
        request.setClienteId(1L);
        request.setServizioId(1L);
        request.setDataOraInizio(LocalDateTime.of(2026, 6, 20, 10, 0));

        when(negozioService.getNegozioAttuale()).thenReturn(negozio);
        when(clienteService.getCliente(1L)).thenReturn(cliente);
        when(servizioService.getServizio(1L)).thenReturn(servizio);

        // Simuliamo che ci sia già un appuntamento in quello slot
        when(appuntamentoRepository.existsOverlapping(eq(negozio.getId()), any(LocalDateTime.class),
                any(LocalDateTime.class)))
                .thenReturn(true);

        // Act & Assert
        SlotNonDisponibileException exception = assertThrows(SlotNonDisponibileException.class,
                () -> appuntamentoService.creaAppuntamento(request));
        assertNotNull(exception);

        verify(appuntamentoRepository, never()).save(any());
        verify(emailService, never()).sendConfermaAppuntamento(any(), any(), any(), any());
    }

    @Test
    void creaAppuntamento_Success() {
        // Arrange
        AppuntamentoRequest request = new AppuntamentoRequest();
        request.setClienteId(1L);
        request.setServizioId(1L);
        request.setDataOraInizio(LocalDateTime.of(2026, 6, 20, 10, 0));

        when(negozioService.getNegozioAttuale()).thenReturn(negozio);
        when(clienteService.getCliente(1L)).thenReturn(cliente);
        when(servizioService.getServizio(1L)).thenReturn(servizio);

        // Slot libero
        when(appuntamentoRepository.existsOverlapping(eq(negozio.getId()), any(LocalDateTime.class),
                any(LocalDateTime.class)))
                .thenReturn(false);

        Appuntamento savedAppuntamento = new Appuntamento();
        savedAppuntamento.setId(100L);
        savedAppuntamento.setDataOraInizio(request.getDataOraInizio());

        when(appuntamentoRepository.save(any(Appuntamento.class))).thenReturn(savedAppuntamento);

        // Act
        Appuntamento result = appuntamentoService.creaAppuntamento(request);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getId());

        // Verifica invio email
        verify(emailService).sendConfermaAppuntamento(
                eq("mario@example.com"),
                eq("Mario Rossi"),
                anyString(),
                eq("Taglio"));
    }
}
