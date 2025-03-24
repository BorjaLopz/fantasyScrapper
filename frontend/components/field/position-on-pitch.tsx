import { CircleX, Plus, Shirt } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"
import React from "react"
import { DISPLAY_NUMBER, DISPLAY_POSITION } from "./utils"
import { Card } from "../ui/card"
import { Heading } from "../ui/heading"
import { Text } from "../ui/text"
import { Image } from "../ui/image"
import { Player } from "@/types/player.type"

type Props = {
  selectedPlayerFromBench: any;
  removePlayerFromPitch: any
  playerOnPosition: Player | undefined
  index: number,
  position: string
}

export default function PositionOnPitch({ selectedPlayerFromBench, removePlayerFromPitch, playerOnPosition, index, position }: Props) {
  if (playerOnPosition === undefined) { // If player hasn't added to the position yet
    return (
      <>
        <Icon size="md" as={Plus} className="text-2xl xl:text-4xl text-white absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-12" />
        {
          selectedPlayerFromBench === null ? // Selected Player is not null when user want to add a player from the bench to the squad
            <>
              {/* <Icon as={Shirt} className="text-6xl xl:text-7xl text-black absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
              <span className="player-name bg-purple-100 text-purple-800 text-xs xl:text-base xl:leading-5 leading-4 font-medium me-2 px-2.5 py-0.5 dark:bg-purple-900 dark:text-purple-300 
                      absolute z-10 top-[52px] xl:top-[62px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                dangerouslySetInnerHTML={{ __html: 'asdfas' }}>
              </span>
            </>
            :
            <Icon as={Shirt} className="text-6xl xl:text-7xl text-blue-600 absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        }
      </>
    )
  }

  // let toDisplayOnShirt: any = null
  // if (shirtDisplayType == DISPLAY_NUMBER) {
  //   toDisplayOnShirt = (<span className="player-number text-2xl xl:text-3xl absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2
  //          -translate-y-1/2" style={{ color: colorSettings["shirtTextColor"] }}>{playerOnPosition["shirtNumber"]}</span>)
  // } else if (shirtDisplayType === DISPLAY_POSITION) {
  //   toDisplayOnShirt = (<span className="player-number text-xl xl:text-2xl absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2
  //          -translate-y-1/2" style={{ color: colorSettings["shirtTextColor"] }}>{position["positionName"]}</span>)
  // }

  return (
    <>
      {/* {
        selectedPlayerFromBench === null ? // Selected Player is not null when user want to add a player from the bench to the squad
          <>
            <Icon as={Shirt} className="player-shirt text-6xl xl:text-7xl absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <div onClick={(e) => (removePlayerFromPitch(e, index))}>
              <Icon as={CircleX} className="remove-btn text-2xl xl:text-2xl text-red-600 absolute z-20
                  top-1/4 pb-16 xl:pb-20 ml-8 xl:ml-10 transform -translate-y-1/2" />
            </div>
          </>
          :
          <Icon as={Shirt} className="text-6xl xl:text-7xl absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
      } */}

      <div>
        <Card className="rounded-lg bg-primary-600 w-[6.25rem]">
          <Image
            source={playerOnPosition.image}
            className="h-[4em] w-full rounded-md aspect-[263/240]"
            alt="image"
          />
          <Text className="text-typography-0 !truncate w-full">
            {playerOnPosition.nickname}
          </Text>
        </Card>
      </div>

      {/* {
        playerOnPosition["name"].length <= 20 ?
          <span className="player-name bg-purple-100 text-purple-800 text-xs xl:text-base xl:leading-5 leading-4 font-medium me-2 px-2.5 py-0.5 dark:bg-purple-900 dark:text-purple-300 
                      absolute z-10 top-[51px] xl:top-[61px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: playerOnPosition["name"] }}>
          </span>
          :
          <span className="player-name bg-purple-100 text-purple-800 text-xs xl:text-base xl:leading-5 leading-4 font-medium me-2 px-2.5 py-0.5 dark:bg-purple-900 dark:text-purple-300 
                      absolute z-10 top-[51px] xl:top-[62px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            dangerouslySetInnerHTML={{ __html: playerOnPosition["name"] }}>
          </span>
      } */}
    </>
  )
}