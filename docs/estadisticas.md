# 📊 Estadísticas de jugadores (ETL FBref / soccerdata)

Este documento describe todas las estadísticas almacenadas en la tabla `stats`.  
Cada registro representa un jugador en un partido concreto.

---

## Participación

minutes — Minutos jugados en el partido (INT).  
Uso: penalizar suplentes, bonus por jugar 90’, normalizar métricas por 90 minutos.

---

## Rendimiento ofensivo (Performance)

gls — Goles marcados (INT)  
ast — Asistencias (INT)  
pk — Penaltis marcados (INT)  
pkatt — Penaltis intentados (INT)  
sh — Tiros totales (INT)  
sot — Tiros a puerta (INT)

---

## Disciplina

crdy — Tarjetas amarillas (INT)  
crdr — Tarjetas rojas (INT)

---

## Participación general

touches — Toques de balón (INT)

---

## Defensa

tkl — Entradas (INT)  
interceptions — Intercepciones (INT)  
blocks — Bloqueos (INT)

---

## Estadísticas avanzadas (Expected)

xg — Expected Goals (NUMERIC)  
npxg — Non-Penalty xG (NUMERIC)  
xag — Expected Assists (NUMERIC)

---

## Creación de ocasiones (SCA)

sca — Shot-Creating Actions (INT)  
gca — Goal-Creating Actions (INT)

---

## Pase

passes_cmp — Pases completados (INT)  
passes_att — Pases intentados (INT)  
passes_cmp_pct — Porcentaje de acierto (NUMERIC)  
prgp — Pases progresivos (INT)

---

## Conducción

carries — Conducciones (INT)  
prgc — Conducciones progresivas (INT)

---

## Regate (Take-ons)

takeons_att — Regates intentados (INT)  
takeons_succ — Regates completados (INT)

---

## Ejemplo de uso en ETL Python

gls = get_stat(s, "Performance_Gls")  
ast = get_stat(s, "Performance_Ast")  
xg  = get_stat(s, "Expected_xG")  
prg = get_stat(s, "Passes_PrgP")

---

## Resumen por categorías

Ofensiva: gls, ast, sh, sot  
Calidad: xg, npxg, xag  
Creación: sca, gca  
Pase: passes_cmp, passes_att, passes_cmp_pct, prgp  
Regate: takeons_att, takeons_succ  
Defensa: tkl, interceptions, blocks  
Disciplina: crdy, crdr  
Participación: minutes, touches

---

Este modelo permite:
- sistemas de puntuación avanzados  
- valor de mercado dinámico  
- análisis por rol (defensa / medio / delantero)  
- estadísticas por 90 minutos
