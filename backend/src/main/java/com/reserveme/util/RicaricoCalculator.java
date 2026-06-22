package com.reserveme.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class RicaricoCalculator {

    private RicaricoCalculator() {
        // Utility class - no instantiation
    }

    /**
     * Calcola la percentuale di ricarico.
     * Formula: ((prezzoVendita - prezzoAcquisto) / prezzoAcquisto) * 100
     */
    public static BigDecimal calcolaRicarico(BigDecimal prezzoAcquisto, BigDecimal prezzoVendita) {
        if (prezzoAcquisto == null || prezzoVendita == null || prezzoAcquisto.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return prezzoVendita.subtract(prezzoAcquisto)
                .divide(prezzoAcquisto, 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Calcola il prezzo di vendita dato un prezzo di acquisto e una percentuale di ricarico.
     */
    public static BigDecimal calcolaPrezzoVendita(BigDecimal prezzoAcquisto, BigDecimal ricaricoPercentuale) {
        if (prezzoAcquisto == null || ricaricoPercentuale == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal moltiplicatore = BigDecimal.ONE.add(
                ricaricoPercentuale.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
        );
        return prezzoAcquisto.multiply(moltiplicatore).setScale(2, RoundingMode.HALF_UP);
    }
}
