package com.cytohelix.klinikpro.fhir.common;

import java.time.OffsetDateTime;
import java.util.List;

public record Meta(String versionId, OffsetDateTime lastUpdated, List<String> profile) {}
