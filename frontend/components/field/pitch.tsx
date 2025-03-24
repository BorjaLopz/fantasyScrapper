import React from 'react';
import { Image } from 'react-native';

export default function Pitch({ renderPositions, renderFormationSelector, availablePlayers, selectedPlayers, selectedPlayerFromBench,
  setSelectedPlayerFromBench, isToastOpen, setIsToastOpen }: any) {

  const addPlayerFromBench = (player: any) => {
    setSelectedPlayerFromBench(player)
    setIsToastOpen(true)
  }

  function showElements(className: any) {
    var elements = document.querySelectorAll(className);
    elements.forEach(function (element) {
      element.classList.remove('hide-on-capture');
    });
  }

  return (
    <>
      <div className="flex items-center justify-center mt-2 xl:mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 no-gap">
          <div className="xl:col-span-1 items-center justify-center">
            <label htmlFor="countries" className="text-lg font-bold">Formaciones</label>
            {renderFormationSelector()}
          </div>
        </div>
      </div >

      <div className="w-full xl:p-4 p-0">
        <div className="flex gap-0 no-gap items-start justify-center w-full">
          <div className="flex items-center justify-center mt-1">
            <div className="flex justify-center w-full">
              <div className="flex justify-center relative w-full">
                <Image source={require("@/assets/images/football_pitch_mobile.svg")} alt="Soccer Pitch" className="block xl:hidden" />
                <Image source={require("@/assets/images/football_pitch_cropped.png")} alt="Soccer Pitch" className="hidden xl:block rounded-md h-screen object-cover p-2" />
                {renderPositions()}
              </div>
            </div>
          </div>
          {/* <div className="player-block xl:col-span-1 space-y-6 border border-white rounded-md shadow mt-6" id="bench-content">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-1 p-1 xl:gap-4 xl:pl-4 xl:pr-4 xl:pt-6">
              {availablePlayers.map((player: any, id: any) => { // Rendering player to the bench that are not in the starting XI
                return (
                  <Fragment key={id}>
                    {isSelected(selectedPlayers, player) === false ? // If we cant find it in the selectedPlayers (starting XI)
                      <PlayerCard player={player} id={id} onClickFunc={() => addPlayerFromBench(player)} showPosition={true} lang={lang} />
                      :
                      <></>
                    }
                  </Fragment>
                )
              })}
            </div>
          </div> */}
        </div>
      </div>
      {/* <AddPlayerToast isOpen={isToastOpen} setIsOpen={setIsToastOpen} player={selectedPlayerFromBench} setSelectedPlayerFromBench={setSelectedPlayerFromBench} lang={lang} /> */}
    </>
  )
}