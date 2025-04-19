# KetchUp - Hospitality Management Web App

![KetchUp Logo](https://via.placeholder.com/150x150.png?text=KetchUp)

KetchUp ist eine All-in-One-Webanwendung für kleine bis mittelgroße Gastronomiebetriebe, die Mitarbeiterverwaltung, Schichtplanung, Inventarmanagement und weitere Funktionen in einer intuitiven Oberfläche vereint.

## 🌟 Features

### Mitarbeiterverwaltung
- Mitarbeiterprofile mit Kontaktdaten und Positionen
- Avatar-Generierung für Mitarbeiter
- Übersichtliche Listendarstellung aller Mitarbeiter
- Einfaches Hinzufügen, Bearbeiten und Löschen von Mitarbeitern

### Schichtplanung
- macOS-ähnlicher Kalender mit Drag-and-Drop-Funktionalität
- Wöchentliche und monatliche Ansichten
- Kontextmenü für schnelle Aktionen
- Mitarbeiterzuweisung zu Schichten
- Konfliktprüfung bei Schichtplanung

### Inventarmanagement
- Kategorisierte Inventarliste (Getränke, Lebensmittel, Verbrauchsmaterial)
- Bestandsverfolgung mit visuellen Indikatoren für niedrige Bestände
- Einfache Ein- und Ausgangsbuchungen
- Wertberechnung des Gesamtinventars
- Nachbestellungsbenachrichtigungen

### Dashboard
- Echtzeit-Übersicht über aktuelle Schichten und anwesende Mitarbeiter
- Inventarstatus und Warnungen bei niedrigen Beständen
- Tagesumsätze und Verkaufsstatistiken
- Anpassbare Widgets für wichtige Kennzahlen

## 🛠️ Technologie-Stack

### Frontend
- **Next.js 14**: React-Framework mit App Router
- **Tailwind CSS**: Utility-First CSS-Framework
- **shadcn/ui**: Wiederverwendbare UI-Komponenten
- **Lucide Icons**: Moderne Icon-Bibliothek

### Backend
- **tRPC**: Typsichere API-Integration
- **Supabase**: Datenbank und Authentifizierung
- **PostgreSQL**: Relationale Datenbank

### Authentifizierung
- **Clerk**: Benutzerauthentifizierung und -verwaltung

### Deployment
- **Vercel**: Hosting und Deployment
- **GitHub Actions**: CI/CD-Pipeline

## 📋 Entwicklungsfortschritt

### Abgeschlossene Funktionen

#### Mitarbeiterverwaltung
- ✅ Mitarbeiterliste mit Suchfunktion
- ✅ Formular zum Hinzufügen/Bearbeiten von Mitarbeitern
- ✅ Avatar-Generierung
- ✅ API-Integration mit Supabase

#### Schichtplanung
- ✅ Kalenderansicht mit Drag-and-Drop
- ✅ Schichtformular mit Mitarbeiterauswahl
- ✅ Kontextmenü für Schichtaktionen
- ✅ API-Integration für Schichtverwaltung

#### Dashboard
- ✅ Übersicht über aktive Schichten
- ✅ Anzeige anwesender Mitarbeiter
- ✅ Inventarstatus-Widget
- ✅ Tagesumsatz-Widget

#### Inventarmanagement
- ✅ Grundlegende Inventarliste
- ✅ Formular zum Hinzufügen/Bearbeiten von Artikeln
- ✅ Transaktionsformular für Ein-/Ausgänge
- ✅ Bestandsberechnungen und Warnungen
- ✅ Kategorisierung von Inventarartikeln (in Entwicklung)

### In Entwicklung

#### Inventarmanagement
- 🔄 Erweiterte Kategorisierung mit Icons
- 🔄 Grafische Darstellung von Bestandsverläufen
- 🔄 Verbesserte Benutzeroberfläche mit Kachelansicht

#### Berichtswesen
- 🔄 Wöchentliche und monatliche Berichte
- 🔄 Export von Berichten als PDF/CSV

### Geplante Funktionen

#### Trinkgeldverwaltung
- 📝 Erfassung und Verteilung von Trinkgeldern
- 📝 Berechnungsmodelle für gerechte Verteilung

#### Zeiterfassung
- 📝 Stempeluhr-Funktion für Mitarbeiter
- 📝 Automatische Arbeitszeitberechnung

#### Lohnabrechnung
- 📝 Grundlegende Lohnberechnungen
- 📝 Export für Buchhaltungssysteme

## 🚀 Installation und Einrichtung

### Voraussetzungen
- Node.js 18.0 oder höher
- npm oder yarn
- PostgreSQL-Datenbank (oder Supabase-Konto)

### Installation

1. Repository klonen
```bash
git clone https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App.git
cd ketchup
```

2. Abhängigkeiten installieren
```bash
npm install
# oder
yarn install
```

3. Umgebungsvariablen einrichten
Kopieren Sie die `.env.example`-Datei zu `.env.local` und füllen Sie die erforderlichen Werte aus:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

4. Entwicklungsserver starten
```bash
npm run dev
# oder
yarn dev
```

5. Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser

## 📊 Datenbankschema

Das Projekt verwendet folgende Haupttabellen:

- **employees**: Mitarbeiterdaten
- **shifts**: Schichtinformationen
- **inventory_items**: Inventarartikel
- **inventory_transactions**: Ein- und Ausgänge von Inventarartikeln
- **sales**: Verkaufsdaten

Die vollständigen SQL-Migrations-Skripte finden Sie im Ordner `supabase/migrations/`.

## 🤝 Mitwirken

Beiträge sind willkommen! Wenn Sie an diesem Projekt mitwirken möchten:

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some amazing feature'`)
4. Pushen Sie den Branch (`git push origin feature/amazing-feature`)
5. Öffnen Sie einen Pull Request

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE)-Datei für Details.

## 📬 Kontakt

Niklas Geispitzheim - niklas.geispitzheim3@gmail.com

Projekt-Link: [https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App](https://github.com/Uruskus/KetchUp-Hospitality-Management-Web-App)
