interface CharacterCounterProps {
  current: number;
  min?: number;
  max: number;
  showOptimal?: boolean;
}

const CharacterCounter = ({ current, min = 0, max, showOptimal = true }: CharacterCounterProps) => {
  const getColor = () => {
    if (current > max) return "text-destructive";
    if (min > 0 && current < min) return "text-amber-500";
    if (current >= min && current <= max) return "text-emerald-500";
    return "text-muted-foreground";
  };

  const getStatus = () => {
    if (current > max) return "Too long";
    if (min > 0 && current < min) return "Too short";
    if (current >= min && current <= max) return "Optimal";
    return "";
  };

  return (
    <div className={`text-xs flex items-center gap-2 ${getColor()}`}>
      <span>{current}/{max}</span>
      {showOptimal && getStatus() && (
        <span className="text-xs">({getStatus()})</span>
      )}
    </div>
  );
};

export default CharacterCounter;
