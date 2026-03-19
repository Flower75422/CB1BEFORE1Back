"use client";

import { useState, useEffect } from "react";
import SuccessScreen from "../SuccessScreen"; 
import CreateGroupTopBar from "./creategrouptopbar/CreateGroupTopBar";
import CreateGroupFilterBar from "./creategroupfilterbar/CreateGroupFilterBar";
import CreateGroupContent from "./creategroupcontent/CreateGroupContent";

export default function CreateGroupController({ onClose }: { onClose: () => void }) {
  const [groups, setGroups] = useState([{
    id: `group_${Date.now()}`,
    title: "",
    description: "",
    category: "Technology",
    isPrivate: true,
    allowInvites: true,
    step: 1, 
    isSuccess: false
  }]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeGroup = groups[activeIndex];

  const updateData = (updates: any) => {
    const newGroups = [...groups];
    newGroups[activeIndex] = { ...newGroups[activeIndex], ...updates };
    setGroups(newGroups);
  };

  const setStep = (newStep: number | ((s: number) => number)) => {
    const currentStep = groups[activeIndex].step;
    const stepVal = typeof newStep === 'function' ? newStep(currentStep) : newStep;
    updateData({ step: stepVal });
  };

  const addNewGroup = () => {
    if (groups.length >= 9) return alert("Maximum 9 drafts allowed.");
    const newGroup = {
      id: `group_${Date.now()}`,
      title: "",
      description: "",
      category: "Technology",
      isPrivate: true,
      allowInvites: true,
      step: 1,
      isSuccess: false
    };
    setGroups([...groups, newGroup]);
    setActiveIndex(groups.length);
  };

  // 🔴 THE FIX: Smart Delete Logic
  const deleteGroupByIndex = (index: number) => {
    if (groups.length === 1) return alert("You must have at least one draft.");
    if (!confirm("Are you sure you want to delete this draft?")) return;
    
    const newGroups = groups.filter((_, idx) => idx !== index);
    setGroups(newGroups);
    
    // Shift to the next group, or previous if we deleted the last one in the list
    if (activeIndex === index) {
      setActiveIndex(index === groups.length - 1 ? index - 1 : index);
    } else if (activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const saveGroupDraft = () => {
    console.log("Draft saved successfully!");
  };

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overscrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full max-w-6xl h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-200">
      
      <CreateGroupTopBar onClose={onClose} />

      <CreateGroupFilterBar 
        groups={groups} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
        onAdd={addNewGroup} 
        onDelete={deleteGroupByIndex}
        onSave={saveGroupDraft}
      />

      {activeGroup.isSuccess ? (
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-stone-200/60 p-12 flex items-center justify-center animate-in zoom-in-95 duration-300 mb-6">
          <SuccessScreen 
            type="group" 
            name={activeGroup.title || "Your New Group"} 
            onFinish={onClose} 
          />
        </div>
      ) : (
        <CreateGroupContent 
          step={activeGroup.step}
          setStep={setStep}
          formData={activeGroup}
          updateData={updateData}
          setIsSuccess={(val: boolean) => updateData({ isSuccess: val })}
          onClose={onClose}
        />
      )}

    </div>
  );
}