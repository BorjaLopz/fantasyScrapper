import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonText } from "../ui/button";
import { Menu, MenuItem } from "../ui/menu";

export default function CustomSelect({ currentFormation, formationsData, handleFormationChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectBodyRef = useRef<any>(null); // the ref "pointing" to the select's body, in order to determine if we click inside or outside of it
  const selectButtonRef = useRef<any>(null); // the ref "pointing" to the select's triggering button
  const [selectedFormation, setSelectedFormation] = useState(null);

  const handleClickOutside = (e: any) => { // Closing the select's body if we click outside
    if (selectBodyRef.current && !selectBodyRef.current?.contains(e.target) && !selectButtonRef.current.contains(e.target)) {
      // Checking if the ref "pointing" to the select's body exists and we clicked outside of it
      // If we clicked the selectButton then we shouldn't setIsOpen(false) beacuse it's onclick will open it (thats why the last condition needed)
      setIsOpen(false); // close the select's body
    }
  }

  const handleElementClick = (e: any) => {
    const newFormation = e.target.textContent;
    handleFormationChange(newFormation);
    setSelectedFormation(newFormation);
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) { // If isOpen is true we need to "attach" the eventListener to clicking, beacuse we need to close the select's body if user clicks outside
      document.addEventListener("mousedown", handleClickOutside)
    } else { // If isOpen is false we need to remove the eventListener because that means the slect's body is already closed
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [isOpen]) // isOpen state change will trigger it

  // Group formation by the number of the defenders: {"3" : ["3-5-2", "3-4-1", ...], "4": ["4-3-3", "4-4-2", ...]}
  let formationsGrouped: any = {}
  formationsData.map((formation: any) => {
    if (formation[0] in formationsGrouped) {
      formationsGrouped[formation[0]].push(formation)
    } else {
      formationsGrouped[formation[0]] = [formation]
    }
  })

  useEffect(() => {
    if (null == selectedFormation) {
      setSelectedFormation(currentFormation) // When formationData arrives we set the current formation to that
    }
  }, [formationsData]) // When formationData changes

  return (
    <Menu
      placement="bottom"
      offset={5}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps}>
            <ButtonText>{selectedFormation}</ButtonText>
          </Button>
        )
      }}
    >
      {currentFormation}
      {Object.keys(formationsGrouped).map((key, index) => (
        <MenuItem key={index}>
          <div>
            <h4 className="text-left text-lg mb-1">{key} ABT</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2 mx-2">
              {formationsGrouped[key].map((formation: any, index: number) => (
                <div onClick={handleElementClick} key={index} className="flex w-full">
                  <span className={`${selectedFormation == formation ? 'bg-primary-500 text-typography-0' : 'bg-primary-100'} rounded-sm px-2 py-1 w-full`}>{formation}</span>
                </div>
              ))}
            </div>
          </div>
        </MenuItem>
      ))}
    </Menu>
  )
}