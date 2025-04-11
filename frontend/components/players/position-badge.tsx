
type Props = {
  position: string
}

export default function PlayerPositionBadge({ position }: Props) {
  const getBadgeAction = () => {
    switch (position.toUpperCase()) {
      case "PORTERO":
        return "badge-primary";
      case "DEFENSA":
        return "badge-success";
      case "MEDIOCENTRO":
        return "badge-warning";
      default:
        return "badge-accent"
    }
  }

  return (
    <div className={`badge ${getBadgeAction()} uppercase font-semibold`}>{position.substring(0, 3)}</div>
  )
}