package com.reserveme.service;

import com.reserveme.dto.request.LoginRequest;
import com.reserveme.dto.response.LoginResponse;
import com.reserveme.exception.UnauthorizedException;
import com.reserveme.model.Amministratore;
import com.reserveme.model.Negozio;
import com.reserveme.repository.AmministratoreRepository;
import com.reserveme.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

        @Mock
        private AmministratoreRepository amministratoreRepository;

        @Mock
        private JwtUtil jwtUtil;

        @Mock
        private PasswordEncoder passwordEncoder;

        @Mock
        private GeocodingService geocodingService;

        @InjectMocks
        private AuthService authService;

        private Amministratore admin;

        @BeforeEach
        public void setUp() {
                Negozio negozio = new Negozio();
                negozio.setId(1L);
                negozio.setNome("Test Negozio");

                admin = Amministratore.builder()
                                .id(UUID.randomUUID())
                                .codiceUnivoco("ADMIN123")
                                .password("encoded_password")
                                .nome("Test")
                                .cognome("Admin")
                                .negozio(negozio)
                                .build();
        }

        @Test
        void login_Success() {
                // Arrange
                LoginRequest request = new LoginRequest();
                request.setCodiceUnivoco("ADMIN123");
                request.setPassword("password123");

                when(amministratoreRepository.findByCodiceUnivoco(request.getCodiceUnivoco()))
                                .thenReturn(Optional.of(admin));

                when(passwordEncoder.matches(request.getPassword(), admin.getPassword()))
                                .thenReturn(true);

                when(jwtUtil.generateToken(any(), any())).thenReturn("dummy.jwt.token");

                // Act
                LoginResponse response = authService.login(request);

                // Assert
                assertNotNull(response);
                assertEquals("dummy.jwt.token", response.getToken());
                assertEquals("ADMIN123", response.getCodiceUnivoco());

                verify(passwordEncoder).matches(any(), any());
                verify(jwtUtil).generateToken(any(), any());
        }

        @Test
        void login_InvalidCredentials_ThrowsException() {
                // Arrange
                LoginRequest request = new LoginRequest();
                request.setCodiceUnivoco("ADMIN123");
                request.setPassword("wrong");

                when(amministratoreRepository.findByCodiceUnivoco(request.getCodiceUnivoco()))
                                .thenReturn(Optional.of(admin));

                when(passwordEncoder.matches(request.getPassword(), admin.getPassword()))
                                .thenReturn(false);

                // Act & Assert
                UnauthorizedException exception = assertThrows(UnauthorizedException.class,
                                () -> authService.login(request));
                assertNotNull(exception);

                verify(jwtUtil, never()).generateToken(any(), any());
        }
}
