# Changelog

All notable changes to SmartClass24 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] - 2025-02-12

### Added
- **Curriculum Architecture Framework**: Formalized 3-layer architecture (Tenant → Curriculum → Localization)
  - New `CurriculumConfig` TypeScript interface with full type safety
  - `curriculum` field added to `TenantConfig` for explicit curriculum system declaration
  - Support for multiple curriculum systems: West African (BECE/WASSCE/NECO), US Common Core, UK National, IB, Alternative-Holistic
  - `useTenant()` hook now exposes `curriculum` object for component access
  
- **Curriculum Display Features**:
  - Settings page now shows detailed curriculum information (exam systems, grade levels, countries)
  - Beautiful gradient-styled curriculum badge with responsive design
  - Automatic capitalization and formatting of curriculum system names
  
- **Documentation**:
  - Comprehensive `CURRICULUM_ARCHITECTURE.md` (3,600+ lines) explaining strategic positioning
  - Market positioning shift: "African platform" → "Global platform with African traction"
  - Scalability roadmap from V1.5 (explicit config) → V2 (multi-curriculum) → V3 (marketplace)

### Changed
- **Tenant Registry Updates**:
  - SmartClass24 tenant: Added explicit West African curriculum configuration with 5 countries
  - Wisdom Warehouse tenant: Added explicit Alternative-Holistic curriculum configuration
  - Updated `curriculumLabel` from generic "International Curriculum" to specific "West African Curriculum (BECE/WASSCE/NECO)"

- **Global Rebranding**:
  - Root layout SEO: "AI-Powered Learning Platform for Africa & Beyond" → "Global AI-Powered Learning Platform"
  - Meta descriptions emphasize "worldwide" reach and "white-label solutions"
  - Settings page: "Ghana's Premier Learning Platform" → "🌍 Global Learning Platform"
  - About page vision: "Ghana's premier" → "World's leading white-label platform"

- **UI/UX Improvements**:
  - Fixed CountrySelector hover states causing dark overlays (text visibility improved)
  - Changed hover colors: `hover:bg-accent/30` → `hover:bg-primary/5` (light mode) / `hover:bg-primary/10` (dark mode)
  - Header mobile collapsible: Added explicit hover gradients for better visual feedback
  - All text remains fully visible during hover interactions in both light and dark modes

- **Branding System**:
  - TenantLogo component now properly respects tenant-specific logos before showing S24 fallback
  - Default tenant name: 'S24' → 'SmartClass24' for consistency
  - Neo-glamorphic S24 logo with dual shadows, gradient background, and 3D embossed effect

### Fixed
- **React Warnings**:
  - CountrySelector null value warning resolved
  - "tenant is not defined" error in Header.tsx fixed

### Technical Details
- **Architecture Pattern**: Location ≠ Curriculum principle enforced
  - B2C Pattern: Country → Curriculum (West African countries share BECE/WASSCE)
  - B2B Pattern: Tenant → Curriculum (Wisdom Warehouse in UAE teaches alternative curriculum, not UAE national curriculum)
  - Localization Layer: Optional cultural context (currency, city names, greetings) independent of curriculum

- **Type Safety**:
  - Zero TypeScript compilation errors across 694 files
  - All curriculum fields properly typed and validated
  - Backward compatible: `curriculum` field is optional to support legacy configs

- **Multi-Tenancy Validation**:
  - Tested with both SmartClass24 and Wisdom Warehouse tenants
  - Curriculum objects accessible via `useTenant()` hook
  - Tenant-specific logos and curriculum configurations working correctly

### Developer Notes
- **Breaking Changes**: None (fully backward compatible)
- **Migration Required**: No (curriculum field is optional)
- **Testing**: Manual testing completed for both tenants
- **Performance Impact**: Negligible (curriculum config loaded at tenant resolution time)

### Links
- **Strategic Documentation**: See `CURRICULUM_ARCHITECTURE.md` for full architectural rationale
- **Campus Architecture**: See `CAMPUS_ARCHITECTURE.md` for campus-based routing patterns
- **Tenant Registry**: `src/tenancy/registry.ts` for tenant configurations
- **TypeScript Types**: `src/tenancy/types.ts` for CurriculumConfig interface

---

## [1.0.0] - 2026-01-XX

### Initial Release
- **Core Platform Features**:
  - Challenge Arena (competitive learning gamification)
  - Virtual Labs (15+ interactive science experiments)
  - Multi-campus architecture (JHS, SHS, University)
  - Progressive Web App (PWA) with offline support
  - Anonymous-first Firebase authentication with account linking

- **Multi-Tenancy System**:
  - Complete tenant isolation in Firestore
  - White-label branding (logos, colors, domains)
  - Feature flags per tenant
  - Two live tenants: SmartClass24 (Ghana B2C), Wisdom Warehouse (UAE B2B)

- **Content Library**:
  - 9,000+ JHS quiz questions across all subjects
  - 2,500+ SHS questions (12 subjects)
  - Comprehensive past questions bank
  - Carousel lesson system for engaging instruction

- **Localization System**:
  - 5 West African countries supported (Ghana, Nigeria, Sierra Leone, Liberia, Gambia)
  - Template variables: `{{currency}}`, `{{exam:primary}}`, `{{city:capital}}`
  - Context-aware content adaptation

- **Technology Stack**:
  - Next.js 16 (App Router) with React 19
  - TypeScript throughout (full type safety)
  - Firebase (Auth, Firestore, Hosting, Functions)
  - Tailwind CSS with custom animations
  - Turbopack dev server

- **Business Materials**:
  - Sales pitch deck (13 slides + appendix)
  - Competitive analysis matrix
  - ROI calculator for schools
  - Case study templates

### Known Limitations (V1)
- Single curriculum system per platform (West African only)
- No curriculum selector component (rigid assignment)
- Limited to African exam systems (BECE, WASSCE, NECO)
- Country selector assumes uniform curriculum across countries

---

## Future Releases

### [2.0.0] - Planned Q2 2026
- **Multi-Curriculum Support**:
  - US Common Core content library (1,000+ questions)
  - UK National Curriculum support
  - International Baccalaureate (IB)
  - Curriculum selector component for hybrid schools
  
- **Mobile Apps**:
  - React Native iOS app
  - React Native Android app
  - Offline-first sync
  - Push notifications

- **Advanced Analytics**:
  - Teacher dashboard with student progress tracking
  - Parent monitoring portal
  - Predictive analytics for exam performance
  - Custom reporting tools

- **Collaborative Learning**:
  - Study groups (peer matching)
  - Live classes integration
  - Group challenge mode
  - Peer tutoring marketplace

### [3.0.0] - Planned Q4 2026
- **Content Marketplace**:
  - Teacher-created curriculum-tagged content
  - Revenue sharing model (70/30)
  - Quality review process
  - À la carte module licensing

- **AI-Powered Features**:
  - AI curriculum conversion (map equivalent topics)
  - Personalized lesson plan generation
  - AI tutoring chatbot
  - Automated content quality assessment

- **Enterprise Features**:
  - School management system integrations
  - Assessment creation tools
  - Live proctored exams
  - VR/AR science labs

---

## Version History Summary

| Version | Release Date | Key Features | Status |
|---------|--------------|--------------|--------|
| **1.5.0** | 2025-02-12 | Curriculum architecture, global rebranding | ✅ Released |
| **1.0.0** | 2026-01-XX | Multi-tenancy, Challenge Arena, Virtual Labs | ✅ Released |
| **2.0.0** | Q2 2026 | Multi-curriculum, mobile apps, analytics | 🔄 Planned |
| **3.0.0** | Q4 2026 | Marketplace, AI features, enterprise tools | 📋 Roadmap |

---

## Contributing

Changes should be documented in this file under the appropriate version heading using the following categories:

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

---

**Last Updated**: February 12, 2025  
**Current Version**: 1.5.0  
**Next Release**: 2.0.0 (Q2 2026)
