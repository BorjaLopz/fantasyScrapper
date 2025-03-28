import { Badge, BadgeText } from "@/components/ui/badge";

type Props = {
  position: string
}

export default function PlayerPositionBadge({ position }: Props) {
  const getBadgeAction = () => {
    switch (position.toUpperCase()) {
      case "PORTERO":
        return "muted";
      case "DEFENSA":
        return "warning";
      case "MEDIOCENTRO":
        return "info";
      default:
        return "success"
    }
  }

  return (
    <Badge size="md" variant="solid" action={getBadgeAction()}>
      <BadgeText className="uppercase font-bold">{position.substring(0, 3)}</BadgeText>
    </Badge>
  )
}