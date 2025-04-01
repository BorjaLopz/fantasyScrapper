import React from "react";

export default function Pitch({
  renderPositions,
  renderFormationSelector,
}: any) {
  return (
    <>
      <div className="flex flex-col justify-start mt-2 xl:mt-8">
        <label className="text-lg font-bold">
          Formaciones
        </label>
        {renderFormationSelector()}
      </div>

      <div className="w-full h-full xl:p-4 p-0">
        <div className="flex gap-0 no-gap items-start justify-center w-full h-full">
          <div className="flex items-center justify-center mt-1 w-full h-full">
            <div className="flex justify-center w-full h-full">
              <div className="flex justify-center relative w-full h-full">
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
