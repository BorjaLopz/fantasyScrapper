import requests
import unicodedata
from bs4 import BeautifulSoup
from collections import defaultdict
from fastapi import FastAPI

app = FastAPI()

URL_MATCHES_BY_ROUND = "https://fbref.com/es/comps/12/horario/Resultados-y-partidos-en-La-Liga"

# Función para eliminar acentos de una cadena de texto
def remove_accents(input_str: str) -> str:
    nfkd_form = unicodedata.normalize('NFKD', input_str)  # Normalización de la cadena
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])  # Filtrar los caracteres combinados (acentos)

def scrape_matches_by_round():
    response = requests.get(URL_MATCHES_BY_ROUND)

    if response.status_code != 200:
        print(f"Failed to retrieve page. Status code: {response.status_code}")
        return None
    
    # Crear el objeto BeautifulSoup
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Buscar la tabla con la clase 'stats_table'
    table = soup.find("table", class_="stats_table")
    
    if not table:
        print("No se encontró la tabla con class='stats_table'.")
        return None

    # Diccionario para almacenar partidos por jornada
    partidos_por_jornada = defaultdict(list)

    # Iterar sobre las filas de la tabla
    for tr in table.find("tbody").find_all("tr"):
        jornada_th = tr.find("th", {"data-stat": "gameweek"})  # Buscar el th con el número de jornada
        if jornada_th:
            jornada = jornada_th.text.strip()  # Obtener el número de jornada
        else:
            continue  # Saltar filas sin jornada

        # Obtener los datos del partido desde los <td>
        tds = [td.text.strip() for td in tr.find_all("td")]

        if tds:  # Evitar agregar partidos vacíos
            partidos_por_jornada[jornada].append(tds)

    # Imprimir todas las jornadas encontradas
    # if partidos_por_jornada:
    #     print("\nPartidos organizados por jornada:")
    #     for jornada, partidos in partidos_por_jornada.items():
    #         print(f"\nJornada {jornada}:")
    #         for partido in partidos:
    #             print(partido)
    # else:
    #     print("No se encontraron partidos organizados por jornada.")

    return partidos_por_jornada

def get_player_performance_from_row(row, player_name):
    """ Extrae las estadísticas de un jugador de una fila de partido """
    
    # Filtrar si el jugador en esta fila es el que buscamos
    player_cell = row.find("th", {"data-stat": "player"})
    if player_cell:
        player_text = player_cell.text.strip()
        
        if player_name.lower() not in player_text.lower():
            return None  # Si no es el jugador que buscamos, retornamos None
    
    # Extraer las estadísticas relevantes
    stats = {
        "player": player_name,
        "minutes": row.find("td", {"data-stat": "minutes"}).text.strip() if row.find("td", {"data-stat": "minutes"}) else "0",
        "goals": row.find("td", {"data-stat": "goals"}).text.strip() if row.find("td", {"data-stat": "goals"}) else "0",
        "assists": row.find("td", {"data-stat": "assists"}).text.strip() if row.find("td", {"data-stat": "assists"}) else "0",
        "shots": row.find("td", {"data-stat": "shots"}).text.strip() if row.find("td", {"data-stat": "shots"}) else "0",
        "passes_completed": row.find("td", {"data-stat": "passes_completed"}).text.strip() if row.find("td", {"data-stat": "passes_completed"}) else "0",
        "passes": row.find("td", {"data-stat": "passes"}).text.strip() if row.find("td", {"data-stat": "passes"}) else "0",
        "passes_pct": row.find("td", {"data-stat": "passes_pct"}).text.strip() if row.find("td", {"data-stat": "passes_pct"}) else "0%",
        "touches": row.find("td", {"data-stat": "touches"}).text.strip() if row.find("td", {"data-stat": "touches"}) else "0",
        "tackles": row.find("td", {"data-stat": "tackles"}).text.strip() if row.find("td", {"data-stat": "tackles"}) else "0",
        "interceptions": row.find("td", {"data-stat": "interceptions"}).text.strip() if row.find("td", {"data-stat": "interceptions"}) else "0",
        "blocks": row.find("td", {"data-stat": "blocks"}).text.strip() if row.find("td", {"data-stat": "blocks"}) else "0",
        "xg": row.find("td", {"data-stat": "xg"}).text.strip() if row.find("td", {"data-stat": "xg"}) else "0.0",
        "xg_assist": row.find("td", {"data-stat": "xg_assist"}).text.strip() if row.find("td", {"data-stat": "xg_assist"}) else "0.0",
        "gca": row.find("td", {"data-stat": "gca"}).text.strip() if row.find("td", {"data-stat": "gca"}) else "0"
    }
    
    return stats

def get_matches():
    """ Extrae los datos de la web y devuelve un diccionario con partidos organizados por jornada """
    response = requests.get(URL_MATCHES_BY_ROUND)

    if response.status_code != 200:
        print(f"Error al obtener la página: {response.status_code}")
        return {"error": "No se pudo acceder a la web"}

    soup = BeautifulSoup(response.content, "html.parser")
    table = soup.find("table", class_="stats_table")

    if not table:
        print("No se encontró la tabla con class='stats_table'.")
        return {"error": "No se encontró la tabla"}

    partidos_por_jornada = defaultdict(list)

    for tr in table.find("tbody").find_all("tr"):
        jornada_th = tr.find("th", {"data-stat": "gameweek"})
        if jornada_th:
            jornada = jornada_th.text.strip()
        else:
            continue  # Saltar filas sin jornada

        date = tr.find("td", {"data-stat": "date"})
        time = tr.find("td", {"data-stat": "start_time"})
        home_team = tr.find("td", {"data-stat": "home_team"})
        away_team = tr.find("td", {"data-stat": "away_team"})
        score = tr.find("td", {"data-stat": "score"})
        report = tr.find("td", {"data-stat": "match_report"})

        # Obtener el enlace del informe del partido
        report_link = report.find("a")["href"] if report and report.find("a") else ""
        full_report_link = f"https://fbref.com{report_link}" if report_link else ""

        partidos_por_jornada[jornada].append({
            "date": date.text.strip() if date else "",
            "time": time.text.strip() if time else "",
            "home_team": home_team.text.strip() if home_team else "",
            "away_team": away_team.text.strip() if away_team else "",
            "score": score.text.strip() if score else "",
            "report": full_report_link
        })

    return partidos_por_jornada

def get_player_stats(match_url: str, player_name: str): 
    """ Extrae las estadisticas de un jugador por partido """

    response = requests.get(match_url)

    if response.status_code != 200:
        return {"error": f"No se puede acceder a {match_url}"}

    soup = BeautifulSoup(response.content, "html.parser")
    
    # Buscar todas las filas de jugadores
    player_rows = soup.find_all("tr", {"data-row": True})

    for row in player_rows:
        player_stats = get_player_performance_from_row(row, player_name)
        
        if player_stats:
            return player_stats  # Si encontramos el jugador, lo retornamos inmediatamente
    
    return {"error": f"No se encontraron estadísticas para {player_name}"}

# Función para obtener el ID del jugador buscando primero por índice
def get_player_id(player_name: str):
    player_name = remove_accents(player_name)
    # Dividimos el nombre completo en nombre y apellido
    player_name_parts = player_name.split()
    
    # Buscamos las primeras dos letras del nombre y apellido
    search_terms = []
    
    # Si el nombre es compuesto, buscamos por las primeras dos letras de cada parte
    if len(player_name_parts) > 1:
        search_terms.append(player_name_parts[0][:2].lower())  # Primeras 2 letras del nombre
        search_terms.append(player_name_parts[1][:2].lower())  # Primeras 2 letras del apellido
    else:
        search_terms.append(player_name_parts[0][:2].lower())  # Si solo hay un nombre, buscamos por esas dos primeras letras
    
    # URL del índice de jugadores (utilizando las primeras dos letras)
    first_two_letters_name = search_terms[0]
    first_two_letters_surname = search_terms[1] if len(search_terms) > 1 else None
    
    # Definir la URL para la búsqueda en el índice
    index_url_name = f"https://fbref.com/es/jugadores/{first_two_letters_name}/"
    index_url_surname = f"https://fbref.com/es/jugadores/{first_two_letters_surname}/" if first_two_letters_surname else None
    
    # Realizamos la solicitud HTTP para buscar el nombre
    response_name = requests.get(index_url_name)
    
    if response_name.status_code != 200:
        print(f"Error al obtener la página del índice: {response_name.status_code}")
        return {"error": "No se pudo acceder a la página del índice"}

    soup_name = BeautifulSoup(response_name.content, "html.parser")
    
    # Buscamos los enlaces a los jugadores en el div con la clase 'section_content'
    section_content_name = soup_name.find("div", {"class": "section_content"})
    
    if section_content_name:
        player_links_name = section_content_name.find_all("a", {"href": True})
        # Buscamos en los enlaces si alguno contiene el nombre completo o parcial
        for player_link in player_links_name:
            player_text = remove_accents(player_link.text.strip().lower())
            if player_name.lower() in player_text:
                player_url = player_link["href"]
                player_id = player_url.split("/")[3]  # El ID del jugador está en la cuarta posición de la URL
                return player_id

    # Si no se encuentra, buscamos por el apellido
    if index_url_surname:
        response_surname = requests.get(index_url_surname)
        
        if response_surname.status_code != 200:
            print(f"Error al obtener la página del índice por apellido: {response_surname.status_code}")
            return {"error": "No se pudo acceder a la página del índice por apellido"}
        
        soup_surname = BeautifulSoup(response_surname.content, "html.parser")
        
        # Buscamos los enlaces a los jugadores en el div con la clase 'section_content'
        section_content_surname = soup_surname.find("div", {"class": "section_content"})
        
        if section_content_surname:
            player_links_surname = section_content_surname.find_all("a", {"href": True})
            # Buscamos en los enlaces si alguno contiene el nombre completo o parcial
            for player_link in player_links_surname:
                player_text = remove_accents(player_link.text.strip().lower())
                if player_name.lower() in player_text:
                    player_url = player_link["href"]
                    player_id = player_url.split("/")[3]  # El ID del jugador está en la cuarta posición de la URL
                    return player_id
    
    # Si no se encuentra, retornamos un error
    return {"error": "Jugador no encontrado en el índice"}

@app.get("/api/players/{player_name}")
def get_player_information(player_name: str):
    player_id = get_player_id(player_name)

    if isinstance(player_id, dict) and "error" in player_id:
        return player_id  # Devolvemos el error si no se encontró el jugador
    
    # Si se encontró el ID, devuelve el jugador y su ID
    return {"player_name": player_name, "player_id": player_id}
    

@app.get("/api/matches/{round}")
def get_matches_by_round(round: str):
    all_matches = get_matches()

    if isinstance(all_matches, dict) and "error" in all_matches:
        return all_matches
    
    if round in all_matches:
        return {"round": round, "matches": all_matches[round]}
    
    return {"error": f"Couldn't retrieve match information for round {round}"}

