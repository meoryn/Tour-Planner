    # TourPlanner - Intermediate Hand In
[Github Link](https://github.com/meoryn/Tour-Planner)
## Seiten / Routes

### Home
Startseite mit Begrüßungstext

### Tour List (/tourlist)

Zeigt die Touren des eingeloggten Nutzers als Liste an.
Bietet eine Full-Text-Search über den Titel bzw. die Beschreibung der Tour. Jede Tour lässt sich einzeln exportieren, wahlweise lassen sich auch alle Touren mit einem Button exportieren. Per File-Upload können die exportierten JSON-Tour Dateien auch wieder hochgeladen werden. Für jede Tour wird eine Tour-Card Komponente erstellt

### Add Tour (/tour/add)
Formular zum Erstellen einer neuen Tour. Besteht aus einem Platzhalter für die Map und der TourSideBar-Komponente, in der eine neue Tour erstellt werden kann. 

### Edit Tour (/tour/:id/edit)
Gleicher Aufbau wie Add Tour, nur im Modus "Edit". Die ID aus der URL wird genutzt, um die bestehende Tour aus dem TourStateService zu laden und vorzubefüllen. Verwendet ebenfalls die TourSidebar-Komponente.

### Login (/login)
Login-Seite mit Email- und Passwortfeld. Aktuell noch nicht aktiv, da das passende Backend noch nicht vorhanden ist. Beieinhaltet einen Link zur Registrierungsseite.

### Register (/register)
Registrierungsseite. Ebenfalls schon vorhanden, aber noch nicht integriert. Kommuniziert mit dem dazugehörigen UserStateService.

---

## Überblick

Die Anwendung ist ein klassisches Client-Server-System:

Angular SPA (Browser)  ⇄  HTTP/JSON  ⇄  Spring Boot REST-API  ⇄  JPA/Hibernate  ⇄  PostgreSQL
                                              │
                                              └── REST ──► api.openrouteservice.org (Directions & Geocoding)

- Das **Frontend** (`frontend/`) ist eine Angular-21-Single-Page-Application mit Standalone-Komponenten. Es kommuniziert ausschließlich über HTTP mit JSON-Payloads mit dem Backend.

- Das **Backend** (`backend/`) ist eine Spring-Boot-4-Anwendung (Java 25, Maven), die eine REST-API auf Port 8080 bereitstellt. Die Persistenz läuft über Spring Data JPA (Hibernate) in PostgreSQL; Routing- und Geocoding-Anfragen werden an OpenRouteService weitergeleitet.

- Die **Datenbank** läuft in Docker über `backend/compose.yaml` (PostgreSQL, Datenbank `tourplanner`).


## State Management

### TourStateService

Zentraler Service für alle Tour-Daten. Verwaltet:
- Liste aller Touren (als Signal)
- Aktuelle Suchquery (via Computed())
- Ausgewählte Tour
- Tour Logs der ausgewählten Tour
- CRUD-Operationen für Touren und Logs
- Export/Import von Touren als JSON

Die Beispieltouren sind derzeit noch hardcoded.

### UserStateService

Noch nicht vollständig integriert, da die Backend-Anbindung noch fehlt. Verwaltet den aktuell eingeloggten User, und hat Methoden für register, Login und Account Löschen. 


##  Komponenten

### TourCard

Zeigt die Details einer Tour an. Enthält alle Properties der Tour. Durch einen Klick gelangt man zur Edit-Tour Seite.

### TourSidebar
Komponente, in der Touren erstellt und bearbeitet werden. Nimmt "Add" oder "Edit" als Input.Bei Edit wird die aktuelle Tour als Input übergeben.

### TourLogsDialog
Modal, der die Logs der ausgewählten Tour anzeigt. Zeigt Datum, Distanz, Zeit, Rating und Schwierigkeitpro Log. Auf der rechten Seite des Dialogs ist ein Formular zum Hinzufügen/Bearbeiten von Logs.

## Frontend-Architektur (MVVM)

Das Frontend ist nach dem MVVM-Pattern aufgebaut:

- **View**: die Komponenten-Templates (die .html-Dateien). Sie binden nur an Properties und lösen Events aus, z.B. tour-list.html oder tour-sidebar.html.
- **ViewModel**: die Komponentenklassen zusammen mit den State-Services. Die Komponenten stellen Signals und Computed-Werte bereit, an die das Template bindet. Die State-Services (TourStateService, UserStateService, RouteStateService, MapPickService) halten den gemeinsamen Zustand als Signals und geben ihn nach außen read-only weiter.
- **Model**: die TypeScript-Models in models/ (Tour, TourLog, Location, Enums) und die API-Services (TourApiService, AuthApiService), die sie auf das JSON des Backends abbilden.

## Backend

Das Backend folgt einer layered Architecture:


| Schicht | Klassen | Verantwortung |
|---|---|---|
| Presentation | `TourController`, `TourLogController`, `AuthController`, `DirectionHandler`, `GeocodeHandler`, `GlobalExceptionHandler` | REST-Endpunkte, Request-/Response-DTOs, HTTP-Statuscodes, zentrales Exception-Mapping |
| Business-Logik | `TourService`, `TourLogService`, `AuthService`, `UserService`, `JwtService`, `OpenRouteService`, `TourUserDetailsService` | Validierung, Ownership-Prüfungen, Token-Handling, externe API-Aufrufe, Transaktionen |
| Data Access | `TourRepository`, `TourLogRepository`, `UserRepository` | Datenbankzugriff über Spring Data JPA (`JpaRepository`) mit abgeleiteten Queries wie `findAllByUserId` |
| Modell | Entities (`Tour`, `TourLog`, `User`, `Location`), DTOs, OpenRouteService-Response-Records | JPA-Entities und Transferobjekte |
| Security | `SecurityConfig`, `JwtAuthenticationFilter`, `UserPrincipal` | Zustandslose JWT-Authentifizierung, CORS, Endpunkt-Autorisierung |

### REST-Endpoints

| Methode | Endpunkt | Zweck |
|---|---|---|
| POST | `/auth/register` | Neuen Benutzer registrieren, liefert ein JWT |
| POST | `/auth/login` | Login, liefert ein JWT |
| GET / POST | `/tours` | Touren des eingeloggten Benutzers auflisten / erstellen |
| PUT / DELETE | `/tours/{id}` | Tour aktualisieren / löschen (Ownership wird geprüft) |
| GET / POST | `/tour-logs` | Logs einer Tour auflisten / Log erstellen |
| PUT / DELETE | `/tour-logs/{id}` | Tour-Log aktualisieren / löschen |
| POST | `/directions` | Routenberechnung über OpenRouteService |
| GET | `/geocode` | Adresssuche (Autocomplete) über OpenRouteService |

Die Controller sprechen nur DTOs, das Mapping zwischen Entity und DTO übernimmt die Utility-Klasse TourUtils.

### Datenbank
Als Datenbank kommt PostgreSQL (via docker-compose) zum Einsatz. Eine Tour gehört zu einem User und hat mehrere Tour-Logs. Der Start- und Zielort werden als eingebettete Location direkt in der Tour gespeichert.

### Security
Authentifizierung läuft stateless über JWT. Passwörter werden mit BCrypt gehasht. Ein JwtAuthenticationFilter prüft bei jedem geschützten Request das Bearer-Token und setzt den User in den SecurityContext. Nur die /auth-Endpunkte sind offen, alles andere (inkl. /directions) ist geschützt. Im Frontend hängt ein HTTP-Interceptor das Token an die Requests an und leitet bei einem 401 automatisch zum Login um.

### Autorisierung
In der Service-Schicht wird geprüft, ob der eingeloggte User auch der Besitzer der Tour bzw. des Logs ist. Fremde Datensätze können so nicht verändert oder gelöscht werden (Antwort: 403 Forbidden).

### Fehlerbehandlung & Logging
Ein globaler GlobalExceptionHandler mappt die Exceptions auf passende HTTP-Statuscodes (404, 403, 409, 400, 502, 500). Fehler des OpenRouteService werden abgefangen und als 502 zurückgegeben. Geloggt wird durchgehend mit Log4j2 (statt dem Standard-Logback).

### Konfiguration
Es liegen keine Secrets im Code. Der JWT-Secret-Key und der OpenRouteService-API-Key werden über Umgebungsvariablen aus einer .env-Datei geladen, in der application.properties stehen  nur Platzhalter. Die Datenbank läuft lokal über docker-compose.

## Full-Text-Search

Die Suche läuft komplett im Frontend, da die Touren des Nutzers  bereits im TourStateService liegen. Über ein Computed-Signal (filteredTours) wird die Liste bei jeder Änderung der Suchquery neu gefiltert.

Ablauf: Der Nutzer tippt ins Suchfeld → die Tour-List ruft setSearchQuery() auf → das searchQuery-Signal ändert sich → das filteredTours-Computed rechnet neu → die Liste der Tour-Cards wird neu gerendert.

## Entscheidungen

- **Angular Signals** werden durchgehend für das State Management verwendet (bis auf gewisse PrimeNG Components).
- **Leaflet** wird erst nach dem Rendern initialisiert, damit es mit dem Server-Side-Rendering von Angular zusammenspielt. Die gesamte Kartenlogik liegt in einer MapFacade.
- **OpenRouteService**: Die Routen werden über das Backend berechnet, die Directions(Vorschläge, die angezeigt werden, wenn man in ein From/To Feld schreibt) werden allerdings über das Frontend abgefragt.
- **Export/Import**: Beim Import werden die Touren nacheinander ans Backend geschickt, damit die IDs sauber vergeben werden.

## Design Patterns

- **Facade**: MapFacade kapselt die gesamte Leaflet-Logik (Karten-Setup, Tile-Layer, Route zeichnen, Klick-Events), sodass die Komponenten Leaflet nie direkt ansprechen.
- **Repository**: TourRepository, TourLogRepository und UserRepository abstrahieren den Datenbankzugriff über Spring Data JPA.
- **DTO**: eigene Request- und Response-DTOs entkoppeln die REST-Schnittstelle von den JPA-Entities.
- **Mapper**: TourUtils und LocationUtils übernehmen das Mapping zwischen DTOs und Entities.
- **Authentication**: der JwtAuthenticationFilter in der Spring-Security-Filterkette und der HTTP-Interceptor in Angular reichen den Request jeweils weiter, nachdem sie ihren Teil erledigt haben (Token prüfen bzw. anhängen).
- **Observer**: Angular Signals und RxJS-Observables sorgen dafür, dass die Views automatisch auf Zustandsänderungen reagieren.
- **Singleton**: Spring-Beans und Angular-Services mit providedIn: 'root' existieren jeweils nur einmal.

## Unit Tests

**Backend – TourServiceTest** (JUnit + Mockito): testet den TourService. Unter anderem wird Autorisierung getestet: dass ein User fremde Touren nicht bearbeiten oder löschen kann und dass dabei das Repository nicht verändert wird. Zusätzlich werden das Not-Found-Verhalten und das CRUD inklusive Entity↔DTO-Mapping getestet. Repository und UserService werden dabei gemockt.

**Frontend – tour-card.spec.ts**: testet die reinen Funktionen tourPopularity und isTourChildFriendly. Das sind fachliche Regeln, die dem Nutzer angezeigt werden. Getestet werden gezielt die Grenzfälle (keine Logs, ein nicht-einfaches Log, Dauer/Distanz genau an der Grenze).

**Frontend – map-pick-service.spec.ts**: testet das State-Management der Ortsauswahl (toggle aktiviert ein Ziel, erneutes toggle bricht ab, Wechsel zwischen Start/Ziel, reset löscht alles).

## Unique Feature

Für unser unique Feature haben wir einen Location Picker eingebaut, der neben From and To durch einen Button aktiviert werden kann. Dadurch kann mit einem Klick auf die Karte die gewünschte Start, bzw. Endposition ausgewählt werden.

## INFO

Angular Signals werden durchgehend für das State Management verwendet. Da PrimeNG (die verwendete Component-Library) Signals noch nicht vollständig & in allen Komponenten unterstützt, wird in Formularen teilweise noch "ngModel" für das Data binding eingesetzt, anstatt direkt mit Signals zu arbeiten.


### Wireframes
Beim Aufbau der Seiten und Komponenten wurde auf die vorher erstellten Wireframes zurückgegriffen.

#### Login
![Login](images/Login.jpg)

#### Register
![Register](images/Register.jpg)

#### Landing Page
![Landing Page](images/Landing%20Page.jpg)

#### Tour Overview
![Tour Overview](images/Tour%20Overview.jpg)

![Tour Overview 2](images/Tour%20Overview-1.jpg)

#### Create Tour
![Create Tour](images/Create%20Tour.jpg)

#### Edit Tour
![Edit Tour](images/Edit%20Tour.jpg)

#### Mobile
![Mobile](images/Mobile.jpg)
