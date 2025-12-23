# Fräulein Franken – Geschenke für dich

Moderne Web-App für Warenbestandserfassung und Rechnungsverwaltung für Kleingewerbe.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Datenbank**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Auth**: JWT mit bcrypt
- **Deployment**: Vercel

## Funktionen

- ✅ Benutzer-Authentifizierung (Login/Logout)
- ✅ Dashboard mit Übersicht und Statistiken
- ✅ Produktverwaltung (CRUD) mit Lagerverwaltung
- ✅ Kundenverwaltung (CRUD)
- ✅ Rechnungserstellung mit PDF-Export
- ✅ Einstellungen für Firmendaten
- ✅ Niedrige Bestände Warnungen
- ✅ Mobile-first Design

## Quick Start

### 1. Projekt klonen und Dependencies installieren

```bash
git clone <repository-url>
cd fraulein-franken
npm install
```

### 2. Datenbank einrichten (Neon)

1. Konto bei [Neon](https://neon.tech) erstellen
2. Neue PostgreSQL-Datenbank erstellen
3. Connection String kopieren

### 3. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

`.env` Datei bearbeiten:

```env
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"
NEXTAUTH_SECRET="dein-geheimer-schlüssel-hier"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Datenbank initialisieren

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

App öffnen unter [http://localhost:3000](http://localhost:3000)

## Demo-Zugang

- **E-Mail**: admin@fraulein-franken.de
- **Passwort**: admin123

## Projektstruktur

```
fraulein-franken/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Dashboard Seite
│   │   ├── produkte/       # Produktverwaltung
│   │   ├── kunden/         # Kundenverwaltung
│   │   ├── rechnungen/     # Rechnungsverwaltung
│   │   ├── einstellungen/  # Einstellungen
│   │   └── login/          # Login Seite
│   ├── components/         # React Komponenten
│   │   └── ui/            # UI Komponenten
│   ├── contexts/          # React Contexts
│   ├── lib/               # Hilfsfunktionen
│   └── types/             # TypeScript Typen
├── prisma/
│   ├── schema.prisma      # Datenbank Schema
│   └── seed.ts           # Seed Daten
└── public/               # Statische Dateien
```

## Datenbank Schema

### Haupttabellen

- **Users**: Benutzer und Rollen
- **Products**: Produkte mit Lagerbestand
- **Customers**: Kundendaten
- **Invoices**: Rechnungen
- **InvoiceItems**: Rechnungspositionen
- **StockMovements**: Bestandsbewegungen
- **Settings**: Firmeneinstellungen

## Wichtige Features

### Rechnungen
- Fortlaufende Rechnungsnummern (konfigurierbar)
- Editierbare Daten (Rechnungsdatum, Leistungsdatum, Fälligkeit)
- Automatische MwSt.-Berechnung (optional)
- PDF-Export mit Firmendaten
- Lagerbuchung bei Finalisierung

### Lagerverwaltung
- Automatische Warnung bei niedrigen Beständen
- Bestandsbuchung bei Rechnungserstellung
- Historie der Bestandsbewegungen
- CSV Import/Export (geplant)

### Authentifizierung
- JWT Token mit httpOnly Cookies
- Passwort-Hashing mit bcrypt
- Geschützte Routes via Middleware

## Deployment auf Vercel

### 1. Vorbereitung

```bash
npm run build
```

### 2. Umgebungsvariablen in Vercel

In Vercel Dashboard unter Settings → Environment Variables:

```
DATABASE_URL=neon-connection-string
NEXTAUTH_SECRET=zufälliger-secret
NEXTAUTH_URL=https://deine-domain.vercel.app
```

### 3. Deploy

```bash
vercel --prod
```

oder über GitHub Integration.

## Entwicklung

### Nützliche Commands

```bash
# Entwicklung
npm run dev

# Build
npm run build

# Linting
npm run lint

# Datenbank
npm run db:studio          # Prisma Studio
npm run db:migrate         # Migrationen
npm run db:generate        # Client generieren
npm run db:push           # Schema pushen
npm run db:seed           # Seed Daten
```

### Code Style

- TypeScript mit strikten Typen
- TailwindCSS für Styling
- Zod für Validierung
- React Hook Form für Formulare
- Lucide React für Icons

## Fehlerbehandlung

- API Routes mit try/catch
- Validierung mit Zod Schemas
- Fehler-Toasts in der UI
- Logging für Debugging

## Sicherheit

- Passwort-Hashing mit bcrypt
- JWT Token mit httpOnly Cookies
- Geschützte API Routes
- Input Validierung
- SQL Injection Prevention via Prisma

## Support

Bei Fragen oder Problemen:

1. Logs in der Konsole prüfen
2. Prisma Studio für Datenbank-Inspektion
3. Network Tab im Browser für API Calls
4. Environment Variables überprüfen

## Lizenz

MIT License
