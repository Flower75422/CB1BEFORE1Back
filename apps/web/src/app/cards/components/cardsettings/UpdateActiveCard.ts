export const calculateAutoProgress = (card: any) => {
  let level = 1;
  
  // Level 2: If channel name is filled
  if (card.channel?.name && card.channel.name.trim().length > 0) {
    level = 2;
  }
  
  // Level 3: If pool has at least 3 interests
  if (level === 2 && card.interests?.pool?.length >= 3) {
    level = 3;
  }
  
  return level;
};

export const getUpdatedCards = (cards: any[], activeIndex: number, updates: any) => {
  const newCards = [...cards];
  const currentCard = { ...newCards[activeIndex], ...updates };
  
  // Auto-calculate the progress based on new updates
  const newProgress = calculateAutoProgress(currentCard);
  
  newCards[activeIndex] = { 
    ...currentCard, 
    progress: newProgress 
  };
  
  return newCards;
};