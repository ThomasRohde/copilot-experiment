import React from 'react';
import { Card as CardType, getCardImagePath, getCardBackPath } from '@/game/types';
import { useGameStore, useSettings, useSelectedCardIds } from '@/state/gameStore';
import './Card.css';

interface CardProps {
  card: CardType;
  pileId: string;
  stackOffset?: number;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function Card({
  card,
  pileId,
  stackOffset = 0,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: CardProps) {
  const settings = useSettings();
  const selectedCardIds = useSelectedCardIds();
  const selectCard = useGameStore((state) => state.selectCard);
  const autoMoveToFoundation = useGameStore((state) => state.autoMoveToFoundation);

  const isSelected = selectedCardIds.includes(card.id);
  const imagePath = card.faceUp
    ? getCardImagePath(card)
    : getCardBackPath(settings.cardBack);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.faceUp) {
      selectCard(card.id, pileId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.faceUp) {
      autoMoveToFoundation(card.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!card.faceUp) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id, pileId }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(e);
  };

  return (
    <div
      className={`card ${isSelected ? 'card--selected' : ''} ${isDragging ? 'card--dragging' : ''} ${!card.faceUp ? 'card--face-down' : ''}`}
      style={{ '--stack-offset': stackOffset } as React.CSSProperties}
      draggable={card.faceUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <img
        src={imagePath}
        alt={card.faceUp ? `${card.rank} of ${card.suit}` : 'Card back'}
        draggable={false}
      />
    </div>
  );
}
