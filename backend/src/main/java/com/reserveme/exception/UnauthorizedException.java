package com.reserveme.exception;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Accesso non autorizzato. Credenziali non valide.");
    }
}
