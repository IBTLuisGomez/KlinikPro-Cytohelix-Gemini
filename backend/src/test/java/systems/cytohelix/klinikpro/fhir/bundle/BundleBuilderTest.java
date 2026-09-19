package systems.cytohelix.klinikpro.fhir.bundle;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BundleBuilderTest {

    private final BundleBuilder bundleBuilder = new BundleBuilder();

    private record Fake(String id) {
    }

    @Test
    void searchsetArmaBundleConFullUrlPorRecurso() {
        List<Fake> resources = List.of(new Fake("aaa"), new Fake("bbb"));

        FhirBundle bundle = bundleBuilder.searchset(resources, "Patient", Fake::id);

        assertEquals("Bundle", bundle.resourceType());
        assertEquals("searchset", bundle.type());
        assertEquals(2, bundle.total());
        assertEquals("Patient/aaa", bundle.entry().get(0).fullUrl());
        assertEquals("Patient/bbb", bundle.entry().get(1).fullUrl());
    }

    @Test
    void searchsetVacioProduceBundleConTotalCero() {
        FhirBundle bundle = bundleBuilder.searchset(List.of(), "Patient", Fake::id);

        assertEquals(0, bundle.total());
        assertEquals(0, bundle.entry().size());
    }

    @Test
    void collectionArmaBundleConLasEntriesDadas() {
        List<BundleEntry> entries = List.of(
                new BundleEntry("Patient/aaa", new Fake("aaa")),
                new BundleEntry("Appointment/ccc", new Fake("ccc"))
        );

        FhirBundle bundle = bundleBuilder.collection(entries);

        assertEquals("collection", bundle.type());
        assertEquals(2, bundle.total());
        assertEquals(entries, bundle.entry());
    }
}
