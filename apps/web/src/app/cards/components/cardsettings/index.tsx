"use client";

import { useState, useEffect, useRef } from "react";
import CardSettingsTopBar from "./cardsettingstopbar/CardSettingsTopBar";
import CardSettingsFilterBar from "./cardsettingsfilterbar/CardSettingsFilterBar";
import CardEditor from "./CardEditor";

export default function CardSettings({ initialCards, globalUser, onSave, onBack }: any) {
  const [cards, setCards] = useState(
    initialCards?.length > 0 ? initialCards : [
      {
        id: `card_${Date.now()}`,
        bio: "",
        backMediaUrl: null,
        profilePicUrl: null,
        channel: { name: "", id: "", isPublic: true },
        interests: { primary: "", pool: [] },
        permissions: { allowChat: true, allowFullProfile: true, searchIndexing: true, isNSFW: false },
        team: [{ name: globalUser?.name || "You", handle: globalUser?.handle || "@user", role: "Owner" }],
        postAsChannel: true,
        stats: { views: 0, likes: 0, posts: 0 },
        progress: 1,
        wallPosts: []
      }
    ]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = cards[activeIndex];

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overscrollBehavior = "auto";
    };
  }, []);

  const updateActiveCard = (updates: any) => {
    const newCards = [...cards];
    newCards[activeIndex] = { ...newCards[activeIndex], ...updates };
    setCards(newCards);
  };

  const addNewCard = () => {
    if (cards.length >= 9) return alert("Maximum 9 cards allowed.");
    const newCard = {
      id: `card_${Date.now()}`,
      bio: "",
      backMediaUrl: null,
      channel: { name: "", id: "", isPublic: true },
      interests: { primary: "", pool: [] },
      permissions: { allowChat: true, allowFullProfile: true, searchIndexing: true, isNSFW: false },
      team: [{ name: globalUser?.name || "You", handle: globalUser?.handle || "@user", role: "Owner" }],
      postAsChannel: true,
      stats: { views: 0, likes: 0, posts: 0 },
      progress: 1,
      wallPosts: []
    };
    setCards([...cards, newCard]);
    setActiveIndex(cards.length);
  };

  const deleteCardByIndex = (index: number) => {
    if (cards.length === 1) return alert("You must have at least one card.");
    if (!confirm("Are you sure you want to delete this card?")) return;
    const newCards = cards.filter((_: any, idx: number) => idx !== index);
    setCards(newCards);
    if (activeIndex === index) {
      setActiveIndex(index === cards.length - 1 ? index - 1 : index);
    } else if (activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 left-[256px] flex flex-col items-center bg-[#FDFBF7] overflow-hidden overscroll-none p-6 pt-2 select-none z-10 animate-in fade-in duration-200">
      <CardSettingsTopBar onBack={onBack} />
      <CardSettingsFilterBar 
        cards={cards} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
        onAdd={addNewCard} 
        onDelete={deleteCardByIndex} 
        onSave={() => onSave(cards)} 
      />
      <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden">
        <CardEditor 
          user={globalUser} 
          card={activeCard} 
          updateCard={updateActiveCard} 
          onDelete={() => deleteCardByIndex(activeIndex)} 
        />
      </div>
    </div>
  );
}