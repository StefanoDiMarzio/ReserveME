package com.reserveme.config;

import com.reserveme.model.Amministratore;
import com.reserveme.model.Cassa;
import com.reserveme.model.Negozio;
import com.reserveme.model.Servizio;
import com.reserveme.model.enums.TipoNegozio;
import com.reserveme.repository.AmministratoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test") // Non eseguiamo il seeder durante i test
public class DatabaseSeeder implements CommandLineRunner {

    private final AmministratoreRepository amministratoreRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Verifica popolamento dati di test (Seeding)...");

        creaNegozio("ADMIN123", "Mario", "Rossi", "admin@reserveme.it", "3331234567",
                "Barberia Rossi", TipoNegozio.BARBERIA, "Via Roma 1", "Milano", "20100", "021234567",
                "IT12345678901", new BigDecimal("45.4642"), new BigDecimal("9.1900"),
                new Servizio[]{
                        servizio("Taglio Capelli", "20.00", 30, "Taglio classico a forbice o macchinetta"),
                        servizio("Regolazione Barba", "15.00", 20, "Rifinitura e cura della barba"),
                        servizio("Taglio + Barba", "30.00", 45, "Combo taglio capelli e barba"),
                });

        creaNegozio("ADMIN456", "Giulia", "Bianchi", "giulia.bianchi@reserveme.it", "3349876543",
                "Centro Estetico Bellavita", TipoNegozio.CENTRO_ESTETICO, "Corso Buenos Aires 20", "Milano", "20124", "0249876543",
                "IT22345678902", new BigDecimal("45.4719"), new BigDecimal("9.1881"),
                new Servizio[]{
                        servizio("Pulizia Viso", "45.00", 50, "Trattamento purificante viso"),
                        servizio("Manicure", "25.00", 40, "Manicure completa con smalto"),
                        servizio("Pedicure", "30.00", 45, "Pedicure completa con smalto"),
                        servizio("Ceretta Gambe", "35.00", 30, "Depilazione gambe complete"),
                });

        creaNegozio("ADMIN789", "Francesca", "Verdi", "francesca.verdi@reserveme.it", "3351112233",
                "Parrucchiere Stile & Colore", TipoNegozio.PARRUCCHIERE, "Via del Corso 100", "Roma", "00186", "0651112233",
                "IT32345678903", new BigDecimal("41.9028"), new BigDecimal("12.4964"),
                new Servizio[]{
                        servizio("Piega", "25.00", 30, "Piega con phon e spazzola"),
                        servizio("Colore", "60.00", 90, "Colorazione completa"),
                        servizio("Taglio Donna", "35.00", 45, "Taglio e rifinitura"),
                });

        creaNegozio("ADMIN101", "Luca", "Neri", "luca.neri@reserveme.it", "3362223344",
                "Centro Massaggi Zen", TipoNegozio.CENTRO_MASSAGGI, "Via Po 15", "Torino", "10124", "0112223344",
                "IT42345678904", new BigDecimal("45.0703"), new BigDecimal("7.6869"),
                new Servizio[]{
                        servizio("Massaggio Rilassante", "50.00", 60, "Massaggio total body anti-stress"),
                        servizio("Massaggio Sportivo", "55.00", 60, "Massaggio decontratturante"),
                        servizio("Massaggio Thai", "65.00", 75, "Massaggio tradizionale thailandese"),
                });

        creaNegozio("ADMIN202", "Antonio", "Esposito", "antonio.esposito@reserveme.it", "3373334455",
                "Barberia Napoli Vintage", TipoNegozio.BARBERIA, "Via Toledo 50", "Napoli", "80132", "0813334455",
                "IT52345678905", new BigDecimal("40.8518"), new BigDecimal("14.2681"),
                new Servizio[]{
                        servizio("Taglio Uomo", "18.00", 30, "Taglio classico uomo"),
                        servizio("Barba e Baffi", "12.00", 15, "Rifinitura barba e baffi"),
                });

        log.info("Verifica seeding completata. Login admin di esempio: ADMIN123 / password123");
    }

    private Servizio servizio(String nome, String costo, int durataMinuti, String descrizione) {
        return Servizio.builder()
                .nomeTrattamento(nome)
                .costo(new BigDecimal(costo))
                .durataMinuti(durataMinuti)
                .descrizione(descrizione)
                .attivo(true)
                .build();
    }

    private void creaNegozio(String codiceUnivoco, String nomeAdmin, String cognomeAdmin, String emailAdmin,
                              String telefonoAdmin, String nomeNegozio, TipoNegozio tipo, String indirizzo,
                              String citta, String cap, String telefonoNegozio, String partitaIva,
                              BigDecimal latitudine, BigDecimal longitudine, Servizio[] servizi) {

        if (amministratoreRepository.existsByCodiceUnivoco(codiceUnivoco)) {
            log.info("Negozio '{}' già presente, salto la creazione.", nomeNegozio);
            return;
        }

        Amministratore admin = Amministratore.builder()
                .codiceUnivoco(codiceUnivoco)
                .password(passwordEncoder.encode("password123"))
                .nome(nomeAdmin)
                .cognome(cognomeAdmin)
                .email(emailAdmin)
                .telefono(telefonoAdmin)
                .build();

        Negozio negozio = Negozio.builder()
                .amministratore(admin)
                .nome(nomeNegozio)
                .tipo(tipo)
                .indirizzo(indirizzo)
                .citta(citta)
                .cap(cap)
                .telefono(telefonoNegozio)
                .partitaIva(partitaIva)
                .latitudine(latitudine)
                .longitudine(longitudine)
                .build();

        admin.setNegozio(negozio);

        Cassa cassa = Cassa.builder()
                .negozio(negozio)
                .saldoContanti(BigDecimal.ZERO)
                .saldoPos(BigDecimal.ZERO)
                .build();

        negozio.setCassa(cassa);

        for (Servizio s : servizi) {
            s.setNegozio(negozio);
            negozio.getServizi().add(s);
        }

        amministratoreRepository.save(admin);
    }
}
