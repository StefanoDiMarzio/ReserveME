package com.reserveme.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer hibernate6ModuleCustomizer() {
        Hibernate6Module module = new Hibernate6Module();
        // Le relazioni lazy non ancora inizializzate vengono caricate invece di essere
        // serializzate come null: sicuro perché i riferimenti circolari tra le entità
        // sono già stati interrotti con @JsonIgnore sui model.
        module.enable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);
        return builder -> builder.modulesToInstall(module);
    }
}
