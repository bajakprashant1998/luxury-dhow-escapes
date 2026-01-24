import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordsInput = ({ keywords, onChange }: KeywordsInputProps) => {
  const [input, setInput] = useState("");

  const addKeyword = () => {
    if (!input.trim()) return;
    
    // Support comma-separated input
    const newKeywords = input
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k && !keywords.includes(k));
    
    if (newKeywords.length > 0) {
      onChange([...keywords, ...newKeywords]);
    }
    setInput("");
  };

  const removeKeyword = (index: number) => {
    onChange(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add keywords (comma-separated)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addKeyword();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addKeyword}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="hover:text-destructive ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordsInput;
