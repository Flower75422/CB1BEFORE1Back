export const calculateAutoProgress = (card: any) => {
  let level = 1;

  // Level 2: channel name is filled
  if (card.channel?.name && card.channel.name.trim().length > 0) {
    level = 2;
  }

  // Level 3: interest pool has at least 3 items
  if (level >= 2 && card.interests?.pool?.length >= 3) {
    level = 3;
  }

  // Level 4: at least one link added
  if (level >= 3 && Array.isArray(card.links) && card.links.length > 0) {
    level = 4;
  }

  // Level 5: back media uploaded
  if (level >= 4 && card.backMediaUrl) {
    level = 5;
  }

  return level;
};

export const getUpdatedCards = (cards: any[], activeIndex: number, updates: any) => {
  const newCards = [...cards];
  const currentCard = { ...newCards[activeIndex], ...updates };

  const newProgress = calculateAutoProgress(currentCard);

  newCards[activeIndex] = {
    ...currentCard,
    progress: newProgress,
  };

  return newCards;
};
