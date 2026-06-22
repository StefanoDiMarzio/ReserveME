package com.reserveme.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenericResponse<T> {
    private int status;
    private String message;
    private T data;
    private String timestamp;
}
