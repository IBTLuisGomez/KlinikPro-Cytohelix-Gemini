package com.cytohelix.klinikpro.fhir.common;

import java.util.List;

public record HumanName(String use, String text, String family, List<String> given) {}
