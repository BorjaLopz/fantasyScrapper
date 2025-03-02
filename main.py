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

def get_player_team(player_id: str):
    # Realizamos la solicitud HTTP para buscar el equipo del jugador
    full_url = f"https://fbref.com/es/jugadores/{player_id}/"

    response = requests.get(full_url)

    if response.status_code != 200:
        print(f"Error al obtener la página del jugador: {response.status_code}")
        return {"error": "No se pudo acceder a la página del jugador"}
    
    # Parseamos el contenido con BeautifulSoup
    soup = BeautifulSoup(response.content, "html.parser")

    with open("page_content.html", "w", encoding="utf-8") as file:
        file.write(soup.prettify())

    # Buscamos el div que contiene la tabla de estadísticas del jugador

    stats_div = soup.find("div", id="div_stats_standard_dom_lg")

    if not stats_div:
        print("No se encontró la tabla de estadísticas del jugador.")
        return {"error": "No se pudo encontrar la tabla de estadísticas"}
    
    # Buscamos todas las filas de la tabla (tr)
    rows = stats_div.find_all("tr", {"style": "line-height: 1.3em"})
    
    if not rows:
        print("No se encontraron filas en la tabla de estadísticas.")
        return {"error": "No se encontraron filas en la tabla de estadísticas"}
    
    # Ordenamos las filas por fecha (año) en orden descendente para obtener la más reciente
    rows = sorted(rows, key=lambda row: row.find("th", {"data-stat": "year_id"}).text, reverse=True)
    
    # Obtenemos el equipo de la fila más reciente (la que tiene el año más alto)
    last_row = rows[0]
    team_column = last_row.find("td", {"data-stat": "team"})
    
    if team_column:
        team_name = team_column.text.strip()
        return team_name
    else:
        return {"error": "No se encontró el equipo del jugador"}

def get_player_report(report_url: str, player_id: str):
    print(f"Accediendo a la URL: {report_url}")
    response = requests.get(report_url)

    if response.status_code == 200:
        # Parsear el HTML de la página
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Buscar el <tr> que contiene el atributo 'data-append-csv' con el player_id
        player_row = soup.find('tr', attrs={"data-append-csv": player_id})

        # Depurar si no se encuentra el jugador
        if player_row is None:
            print(f"No se encontró el jugador con el ID: {player_id}")
            return "No se encontró el jugador con el ID proporcionado."

        print("Jugador encontrado, extrayendo estadísticas...")

        # Crear un diccionario para almacenar las características y sus valores
        player_stats = {}

        # Encontrar todas las celdas <td> dentro de la fila del jugador
        td_elements = player_row.find_all('td')

        # Iterar sobre cada <td> para extraer la información
        for td in td_elements:
            stat_name = td.get('data-stat')  # Nombre de la estadística
            stat_value = td.get_text(strip=True)  # Valor de la estadística

            if stat_name:  # Solo agregar si el nombre de la estadística existe
                player_stats[stat_name] = stat_value

        return player_stats  # Devuelve el diccionario con todas las características y valores
    else:
        print(f"Error al acceder a la URL, código de estado: {response.status_code}")
        return f"Error al acceder a la URL: {response.status_code}"

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

@app.get("/api/players/{player_name}/{round}")
def get_player_performance(player_name: str, round: str):
    player_id = get_player_id(player_name)
    if "error" in player_id:
        return player_id
    
    all_matches = get_matches()
    matches_in_round = all_matches.get(round, [])

    team_to_search = get_player_team(player_id)

    # Filtrar los partidos en los que el jugador podría estar involucrado
    relevant_matches = [
        match for match in matches_in_round
        if team_to_search in [match["home_team"], match["away_team"]]
    ]

    # Crear una lista con los reportes correspondientes
    reports = [
        {
            "date": match["date"],
            "time": match["time"],
            "home_team": match["home_team"],
            "away_team": match["away_team"],
            "score": match["score"],
            "report": match["report"]
        }
        for match in relevant_matches
    ]

    player_info = get_player_report(reports[0].get("report"), player_id)
    print(player_info)

    # Retornar los reportes
    if reports:
        return {"matches": reports}
    else:
        return {"message": f"No se encontraron partidos para el equipo {team_to_search} en esta ronda."}