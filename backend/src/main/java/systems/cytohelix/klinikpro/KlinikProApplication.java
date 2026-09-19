package systems.cytohelix.klinikpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * KlinikPro — SaaS multi-tenant de gestion para clinicas medicas y de fisioterapia.
 * Primer desarrollo formal de Cytohelix Systems.
 *
 * Autor: Luis Fernando Mendoza Gomez
 */
@SpringBootApplication
public class KlinikProApplication {

    public static void main(String[] args) {
        SpringApplication.run(KlinikProApplication.class, args);
    }
}
