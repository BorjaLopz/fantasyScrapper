const teamIcons: Record<string, any> = {
  Alaves: require("@/assets/teamIcons/Alaves.png"),
  "Athletic Club": require("@/assets/teamIcons/Athletic Club.png"),
  "Atletico Madrid": require("@/assets/teamIcons/Atletico Madrid.png"),
  Barcelona: require("@/assets/teamIcons/Barcelona.png"),
  Betis: require("@/assets/teamIcons/Betis.png"),
  "Celta Vigo": require("@/assets/teamIcons/Celta Vigo.png"),
  Espanyol: require("@/assets/teamIcons/Espanyol.png"),
  Getafe: require("@/assets/teamIcons/Getafe.png"),
  Girona: require("@/assets/teamIcons/Girona.png"),
  "Las Palmas": require("@/assets/teamIcons/Las Palmas.png"),
  Leganes: require("@/assets/teamIcons/Leganes.png"),
  Mallorca: require("@/assets/teamIcons/Mallorca.png"),
  Osasuna: require("@/assets/teamIcons/Osasuna.png"),
  "Rayo Vallecano": require("@/assets/teamIcons/Rayo Vallecano.png"),
  "Real Madrid": require("@/assets/teamIcons/Real Madrid.png"),
  "Real Sociedad": require("@/assets/teamIcons/Real Sociedad.png"),
  Sevilla: require("@/assets/teamIcons/Sevilla.png"),
  Valencia: require("@/assets/teamIcons/Valencia.png"),
  Valladolid: require("@/assets/teamIcons/Valladolid.png"),
  Villarreal: require("@/assets/teamIcons/Villarreal.png"),
};

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getTeamIcon = (teamName: string) => {
  const teamNameWithoutAccents = removeAccents(teamName);
  return teamIcons[teamNameWithoutAccents];
};

export default getTeamIcon;
