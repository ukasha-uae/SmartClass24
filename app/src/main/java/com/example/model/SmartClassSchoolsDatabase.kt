package com.example.model

/**
 * Accredited Ghana and West African Schools matching SmartClass24 Web's schools.ts database.
 */
data class GhanaSchool(
    val id: String,
    val name: String,
    val type: String, // "JHS" or "SHS"
    val region: String,
    val town: String,
    val primaryColor: String = "#006400"
)

object SmartClassSchoolsDatabase {
    val SCHOOLS: List<GhanaSchool> = listOf(
        // Greater Accra
        GhanaSchool("achimota-school", "Achimota School", "SHS", "Greater Accra", "Achimota", "#006400"),
        GhanaSchool("presbyterian-boys-sec", "Presbyterian Boys' Secondary School (PRESEC)", "SHS", "Greater Accra", "Legon", "#003366"),
        GhanaSchool("accra-academy", "Accra Academy", "SHS", "Greater Accra", "Bubuashie", "#FFCC00"),
        GhanaSchool("st-thomas-aquinas", "St. Thomas Aquinas Senior High", "SHS", "Greater Accra", "Cantonments", "#800000"),
        GhanaSchool("accra-girls-shs", "Accra Girls' Senior High", "SHS", "Greater Accra", "Accra", "#FF69B4"),
        GhanaSchool("holy-trinity-shs", "Holy Trinity Cathedral Senior High", "SHS", "Greater Accra", "High Street", "#1E3A8A"),
        
        // Ashanti Region
        GhanaSchool("opoku-ware-school", "Opoku Ware School (OWASS)", "SHS", "Ashanti", "Santasi", "#FFD700"),
        GhanaSchool("prempeh-college", "Prempeh College", "SHS", "Ashanti", "Sofoline", "#008000"),
        GhanaSchool("st-louis-shs", "St. Louis Senior High", "SHS", "Ashanti", "Oduom", "#000080"),
        GhanaSchool("kumasi-academy", "Kumasi Academy", "SHS", "Ashanti", "Asokore Mampong", "#800080"),
        GhanaSchool("yag-shs", "Yaa Asantewaa Girls' Senior High", "SHS", "Ashanti", "Tanoso", "#2563EB"),

        // Central Region
        GhanaSchool("mfantsipim-school", "Mfantsipim School", "SHS", "Central", "Cape Coast", "#B91C1C"),
        GhanaSchool("wesley-girls-high", "Wesley Girls' High School", "SHS", "Central", "Cape Coast", "#F59E0B"),
        GhanaSchool("st-augustines-college", "St. Augustine's College", "SHS", "Central", "Cape Coast", "#047857"),
        GhanaSchool("adisadel-college", "Adisadel College (ADISCO)", "SHS", "Central", "Cape Coast", "#1F2937"),
        GhanaSchool("holy-child-school", "Holy Child School", "SHS", "Central", "Cape Coast", "#4F46E5"),

        // Eastern Region
        GhanaSchool("pope-john-shs", "Pope John Senior High and Minor Seminary", "SHS", "Eastern", "Koforidua", "#0F766E"),
        GhanaSchool("koforidua-sec-tech", "Koforidua Senior High Technical School (SECTECH)", "SHS", "Eastern", "Koforidua", "#D97706"),
        GhanaSchool("aburi-girls-shs", "Aburi Girls' Senior High School (ABUGISS)", "SHS", "Eastern", "Aburi", "#BE185D"),

        // Northern Region
        GhanaSchool("tamale-shs", "Tamale Senior High School (TAMASCO)", "SHS", "Northern", "Tamale", "#0369A1"),
        GhanaSchool("ghana-shs-tamale", "Ghana Senior High School (GHANASCO)", "SHS", "Northern", "Tamale", "#15803D"),

        // UAE / International & Innovation Hubs
        GhanaSchool("s24-innovation-academy", "S24 Innovation Academy", "STEM", "Dubai & West Africa", "Innovation Hub", "#6366F1"),
        GhanaSchool("smartclass-intl-dxb", "SmartClass International Academy", "SHS", "Dubai", "Downtown", "#3B82F6"),
        GhanaSchool("dubai-college", "Dubai College", "SHS", "Dubai", "Al Sufouh", "#1E40AF"),
        GhanaSchool("gems-modern-academy", "GEMS Modern Academy", "SHS", "Dubai", "Nad Al Sheba", "#9333EA")
    )
}
