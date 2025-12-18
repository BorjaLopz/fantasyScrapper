docker exec -t fantasy_postgres pg_dump -U fantasy fantasydb > backup.sql

cat backup.sql | docker exec -i fantasy_postgres psql -U fantasy -d fantasydb