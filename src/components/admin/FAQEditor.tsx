import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQEditorProps {
  items: FAQItem[];
  onChange: (items: FAQItem[]) => void;
}

const FAQEditor = ({ items, onChange }: FAQEditorProps) => {
  const addItem = () => {
    onChange([...items, { question: "", answer: "" }]);
  };

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No FAQs added yet. Add your first question below.
        </p>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="border border-border rounded-lg px-4"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                <AccordionTrigger className="flex-1 text-left hover:no-underline py-3">
                  <span className="text-sm font-medium">
                    {item.question || `FAQ ${index + 1}`}
                  </span>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <AccordionContent className="pb-4 space-y-3">
                <div className="space-y-2">
                  <Input
                    value={item.question}
                    onChange={(e) => updateItem(index, "question", e.target.value)}
                    placeholder="Enter the question"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    value={item.answer}
                    onChange={(e) => updateItem(index, "answer", e.target.value)}
                    placeholder="Enter the answer"
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <Button type="button" variant="outline" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add FAQ
      </Button>
    </div>
  );
};

export default FAQEditor;
