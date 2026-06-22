package com.reserveme.exception;

public class SlotNonDisponibileException extends RuntimeException {

    public SlotNonDisponibileException(String message) {
        super(message);
    }

    public SlotNonDisponibileException() {
        super("Lo slot temporale selezionato non è disponibile. Esiste già un appuntamento in questo intervallo.");
    }
}
