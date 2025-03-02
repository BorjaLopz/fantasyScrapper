# import requests
# from bs4 import BeautifulSoup
# import pandas as pd

# def scrape_matches_by_round(url):
#   response = requests.get(url)

#   if response.status_code != 200:
#     print(f"Failed to retrieve page. Status code: {response.status_code}")
#     return None
  
#   soup = BeautifulSoup(response.content, "html.parser")
#   print(soup.prettify())

#   table = soup.find("table", {"id": "match_results"})
#   print(table)

#   if not table: 
#     print("No matches found.")
#     return None

#   # Extraer encabezados de la tabla
#   headers = [th.text.strip() for th in table.find_all("th") if th.text.strip()]
  
#   # Asegurarse de que sea una tabla válida
#   if "Fecha" not in headers or "Equipo local" not in headers:
#       print("La estructura de la tabla no es la esperada.")
#       return None
  
#   # Extraer filas de datos
#   rows = []
#   for tr in table.find_all("tr")[1:]:  # Saltar la primera fila (encabezados)
#       cells = tr.find_all(["td", "th"])
#       row_data = [cell.text.strip() for cell in cells]
      
#       # Extraer enlace al detalle del partido
#       detail_link = cells[6].find("a")  # Columna del resultado (contiene el enlace)
#       match_url = detail_link["href"] if detail_link else None
      
#       # Agregar enlace al detalle del partido
#       row_data.append(f"https://fbref.com{match_url}" if match_url else "")
      
#       if row_data and row_data[0] != "":  # Ignorar filas vacías
#           rows.append(row_data)
  
#   # Crear DataFrame para organizar los datos
#   headers.append("URL Detalle")  # Agregar columna para el enlace al detalle
#   df = pd.DataFrame(rows, columns=headers)
#   return df

# # Ejemplo de uso
# url = "https://fbref.com/es/comps/12/horario/Resultados-y-partidos-en-La-Liga"
# matches_df = scrape_matches_by_round(url)

import requests
from bs4 import BeautifulSoup

def scrape_matches_by_round(url):
  response = requests.get(url)

  if response.status_code != 200:
    print(f"Failed to retrieve page. Status code: {response.status_code}")
    return None
  
  # Crear el objeto BeautifulSoup
  soup = BeautifulSoup(response.content, "html.parser")
  
  # Imprimir el contenido de soup para inspección
  with open('soup_output.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())  # Guarda la salida de soup en un archivo HTML
  print("El contenido de soup ha sido guardado en 'soup_output.html'.")
  
  return soup

# Ejemplo de uso
url = "https://fbref.com/es/comps/12/horario/Resultados-y-partidos-en-La-Liga"
soup = scrape_matches_by_round(url)
