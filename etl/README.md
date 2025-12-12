         ┌────────────────────┐
         │    FBref Fetcher   │─┐
         └────────────────────┘ │   PRIORIDAD 1
                                │
         ┌────────────────────┐ │
         │ Futbol-Data Fetcher│─┤  PRIORIDAD 2 (fallback)
         └────────────────────┘ │
                                │
         ┌────────────────────┐ │
         │ StatsBomb Fetcher  │─┘  PRIORIDAD 3 (stats avanzadas)
         └────────────────────┘

                 ▼  Merge & Normalize
         ┌────────────────────────────┐
         │   Data Harmonization Layer │
         └────────────────────────────┘
                 ▼
         ┌────────────────────────────┐
         │     Market Value Engine    │
         └────────────────────────────┘
                 ▼
         ┌────────────────────────────┐
         │   Fantasy Scoring Engine   │
         └────────────────────────────┘
                 ▼
         ┌────────────────────────────┐
         │      PostgreSQL Load       │
         └────────────────────────────┘
