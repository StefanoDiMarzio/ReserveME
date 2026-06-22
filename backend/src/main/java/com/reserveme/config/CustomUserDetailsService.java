package com.reserveme.config;

import com.reserveme.model.Amministratore;
import com.reserveme.repository.AmministratoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AmministratoreRepository amministratoreRepository;

    @Override
    public UserDetails loadUserByUsername(String codiceUnivoco) throws UsernameNotFoundException {
        Amministratore admin = amministratoreRepository.findByCodiceUnivoco(codiceUnivoco)
                .orElseThrow(() -> new UsernameNotFoundException("Amministratore non trovato con codice: " + codiceUnivoco));

        return new User(
                admin.getId().toString(), // Use UUID as username in context
                admin.getPassword(),
                new ArrayList<>() // Authorities (roles) can be added here if needed
        );
    }
}
