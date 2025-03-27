import React from "react";
import { Image } from "@/components/ui/image";

export default function Pitch({
  renderPositions,
  renderFormationSelector,
}: any) {
  return (
    <>
      <div className="flex items-center justify-start mt-2 xl:mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 no-gap">
          <div className="xl:col-span-1 items-center justify-center">
            <label htmlFor="" className="text-lg font-bold">
              Formaciones
            </label>
            {renderFormationSelector()}
          </div>
        </div>
      </div>

      <div className="w-full h-full xl:p-4 p-0">
        <div className="flex gap-0 no-gap items-start justify-center w-full h-full">
          <div className="flex items-center justify-center mt-1 w-full h-full">
            <div className="flex justify-center w-full h-full">
              <div className="flex justify-center relative w-full h-full">
                {/* <Image source={require("@/assets/images/pitch-lines.jpg")} alt="Soccer Pitch" className="block xl:hidden !w-full !h-full" size="lg" />
                <Image
                  source={require("@/assets/images/football_pitch_mobile.svg")}
                  alt="Soccer Pitch"
                  className="block xl:hidden !w-full !h-full"
                  size="lg"
                />
                <Image
                  source={require("@/assets/images/football_pitch_cropped.png")}
                  alt="Soccer Pitch"
                  className="hidden xl:block rounded-md h-screen object-cover p-2"
                /> */}

                <div className="main">
                  <div className="top">
                    <div className="outer-top">
                      <div className="inner-top"></div>
                    </div>
                  </div>

                  <div className="bottom">
                    <div className="outer-bottom">
                      <div className="inner-bottom"></div>
                    </div>
                  </div>

                  <div className="middle">
                    <div className="inner-middle"></div>
                  </div>
                </div>

                {renderPositions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
