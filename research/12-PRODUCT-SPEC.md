# PROVA - Product Specification

---

## Product Vision

A digital operations platform that gives luxury car storage facility operators a single dashboard for every vehicle in their building, and gives owners a portal to monitor and manage their stored vehicles.

---

## Build Phases

### Phase 1: Operator Dashboard (MVP — 2-4 weeks)
The foundation. This is what facilities use daily.

**Core Features:**
- Vehicle intake forms (make, model, year, VIN, photos, owner info, insurance status)
- Vehicle profile pages with complete history
- Climate sensor integrations (temperature, humidity logging)
- Automated scheduling logic (maintenance reminders, battery tenders, tire rotation)
- Service request management
- Owner contact management
- Digital condition reports with photo documentation
- Basic reporting and facility overview

**Technical Requirements:**
- Web application (responsive)
- Database for vehicle records, climate data, service history
- Climate sensor API integrations (IoT)
- Photo upload and storage
- Notification system (email/SMS)

### Phase 2: Owner Portal (Month 3-6)
The selling point. This is what makes owners choose facilities that use Prova.

**Core Features:**
- Vehicle status dashboard (real-time)
- Climate condition monitoring
- Service history view
- Schedule detailing or maintenance requests
- Book transport
- Photo gallery of vehicle
- Insurance status tracking
- Notification preferences

**Technical Requirements:**
- Owner-facing web/mobile interface
- Authentication and access control
- Real-time data sync with operator dashboard
- Push notifications

### Phase 3: Service Marketplace (Month 6-12)
The revenue multiplier. Requires facility volume first.

**Core Features:**
- Vetted provider directory (detailers, mechanics, transport)
- Service request routing and matching
- Pricing transparency
- Review and rating system
- Payment processing
- Commission tracking (10-20% take rate)

**Technical Requirements:**
- Two-sided marketplace architecture
- Provider onboarding and verification
- Payment gateway integration
- Rating/review system

### Phase 4: Provenance Data Layer (Month 12+)
The long-term moat. Unlocks entirely new revenue.

**Core Features:**
- Comprehensive vehicle history reports
- Climate log certificates
- Service record verification
- Export for auction houses
- Integration with automotive valuation services

---

## Key Technical Integrations

| Integration Type       | Examples                                    |
|-----------------------|---------------------------------------------|
| Climate Sensors       | IoT temperature/humidity sensors            |
| Payment Processing    | Stripe, Square                              |
| Communication         | Twilio (SMS), SendGrid (email)              |
| Insurance             | API integrations with auto insurers         |
| Transport             | Enclosed carrier booking services           |
| Valuation             | Auction house data feeds, KBB, Hagerty      |

---

## User Personas

### Facility Operator (Primary User — Phase 1)
- Manages 20-200 vehicles
- Currently using spreadsheets + phone
- Needs: efficiency, error reduction, professional appearance
- Values: reliability, ease of use, customer satisfaction

### Vehicle Owner (Secondary User — Phase 2)
- High-net-worth individual, owns 3-20+ vehicles
- Stores vehicles across 1-3 facilities
- Needs: peace of mind, real-time visibility, convenience
- Values: luxury experience, transparency, responsiveness

### Service Provider (Tertiary User — Phase 3)
- Detailers, mechanics, enclosed transport operators
- Needs: steady client flow, professional clients, fair pricing
- Values: reliability of payment, quality clients, efficiency
