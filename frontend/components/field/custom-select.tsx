import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../ui/icon";
import { ChevronDown } from "lucide-react-native";

export default function CustomSelect({ formationsData, handleFormationChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectBodyRef = useRef<any>(null); // the ref "pointing" to the select's body, in order to determine if we click inside or outside of it
  const selectButtonRef = useRef<any>(null); // the ref "pointing" to the select's triggering button

  const [selectedFormation, setSelectedFormation] = useState(null);

  const openSelectMenu = () => {
    setIsOpen(!isOpen);
  }

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
      setSelectedFormation(formationsData[0]) // When formationData arrives we set the current formation to that
    }
  }, [formationsData]) // When formationData changes

  return (
    <div className="custom-select-wrapper">
      <div className="custom-select">
        <div ref={selectButtonRef} className="bg-white squad-builder-select-trigger p-2 border border-gray-300 rounded-md shadow-lg flex items-center justify-center" onClick={openSelectMenu}>
          <span className="text-black">{selectedFormation}</span>
          <div className="ml-1">
            <Icon as={ChevronDown} className="text-xl md:text-2xl text-black" />
          </div>
        </div>

        {
          isOpen &&
          <div ref={selectBodyRef} className="squad-builder-custom-select-body bg-black text-white rounded-md absolute z-50">
            <div className="p-2">
              {Object.keys(formationsGrouped).map((key, ind) => (
                <div key={ind}>
                  <h4 className="text-left text-lg mb-1">{key} ABT</h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4 mx-2">
                    {formationsGrouped[key].map((formation: any, index: number) => (
                      <div className="squad-builder-custom-select-item bg-blue-600 rounded-sm px-2 py-1" style={{ backgroundColor: selectedFormation == formation ? "red" : "" }}
                        onClick={handleElementClick} key={index}>{formation}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  )
}