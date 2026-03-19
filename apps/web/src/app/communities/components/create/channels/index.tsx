"use client";

import { useState, useEffect } from "react";
import SuccessScreen from "../SuccessScreen"; 
import CreateChannelTopBar from "./createchanneltopbar/CreateChannelTopBar";
import CreateChannelFilterBar from "./createchannelfilterbar/CreateChannelFilterBar";
import CreateChannelContent from "./createchannelcontent/CreateChannelContent";

export default function CreateChannelController({ onClose }: { onClose: () => void }) {
  const [channels, setChannels] = useState([{
    id: `channel_${Date.now()}`,
    title: "",
    description: "",
    channelId: "", 
    category: "Technology",
    isPrivate: true,
    step: 1, 
    isSuccess: false,
    isPublished: false
  }]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeChannel = channels[activeIndex];

  const updateData = (updates: any) => {
    const newChannels = [...channels];
    newChannels[activeIndex] = { ...newChannels[activeIndex], ...updates };
    setChannels(newChannels);
  };

  const setStep = (newStep: number | ((s: number) => number)) => {
    const currentStep = channels[activeIndex].step;
    const stepVal = typeof newStep === 'function' ? newStep(currentStep) : newStep;
    updateData({ step: stepVal });
  };

  const addNewChannel = () => {
    if (channels.length >= 9) return alert("Maximum 9 drafts allowed.");
    const newChannel = {
      id: `channel_${Date.now()}`,
      title: "",
      description: "",
      channelId: "",
      category: "Technology",
      isPrivate: true,
      step: 1,
      isSuccess: false,
      isPublished: false
    };
    setChannels([...channels, newChannel]);
    setActiveIndex(channels.length);
  };

  const deleteChannelByIndex = (index: number) => {
    if (channels.length === 1) return alert("You must have at least one draft.");
    if (!confirm("Are you sure you want to delete this channel draft?")) return;
    
    const newChannels = channels.filter((_, idx) => idx !== index);
    setChannels(newChannels);
    
    if (activeIndex === index) {
      setActiveIndex(index === channels.length - 1 ? index - 1 : index);
    } else if (activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const saveChannelDraft = () => {
    console.log("Channel draft saved successfully!");
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
      
      <CreateChannelTopBar onClose={onClose} />

      <CreateChannelFilterBar 
        channels={channels} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
        onAdd={addNewChannel} 
        onDelete={deleteChannelByIndex}
        onSave={saveChannelDraft}
      />

      {activeChannel.isSuccess ? (
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-stone-200/60 p-12 flex items-center justify-center animate-in zoom-in-95 duration-300 mb-6">
          <SuccessScreen 
            type="channel" 
            name={activeChannel.title || "Your New Channel"} 
            onFinish={onClose} 
          />
        </div>
      ) : (
        <CreateChannelContent 
          step={activeChannel.step}
          setStep={setStep}
          formData={activeChannel}
          updateData={updateData}
          setIsSuccess={(val: boolean) => updateData({ isSuccess: val })}
          onClose={onClose}
        />
      )}

    </div>
  );
}