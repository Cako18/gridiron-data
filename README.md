# Gridiron Modell – Daten-Pipeline

Berechnet nächtlich NFL-Vorhersagedaten (Elo, EPA, Injuries) aus nflverse-Daten.
Ergebnis: `data/app_data.json` – wird von der Gridiron-App per Raw-URL geladen.

- `update_data.py` – Rechenwerk (läuft auch lokal: `pip install pandas && python update_data.py`)
- `.github/workflows/update.yml` – täglicher Lauf um 09:00 UTC + manueller Start
