package com.reserveme.service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendConfermaAppuntamento(String to, String clienteNome, String dataOra, String servizio) {
        if (to == null || to.isBlank()) {
            log.warn("Nessuna email fornita per il cliente: {}", clienteNome);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@reserveme.it");
        message.setTo(to);
        message.setSubject("Conferma Appuntamento - ReserveME");
        message.setText("Ciao " + clienteNome + ",\n\n" +
                "Il tuo appuntamento per " + servizio + " è stato confermato.\n" +
                "Data e Ora: " + dataOra + "\n\n" +
                "Ti aspettiamo!\nLo staff.");

        try {
            mailSender.send(message);
            log.info("Email di conferma inviata a {}", to);
        } catch (MailException e) {
            log.error("Errore durante l'invio dell'email a {}: {}", to, e.getMessage());
        }
    }
}
