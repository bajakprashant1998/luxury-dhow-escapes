import { Clock, Users, Globe, Calendar, MapPin } from "lucide-react";

interface QuickInfoCardsProps {
  duration: string;
  capacity?: string;
}

const QuickInfoCards = ({ duration, capacity }: QuickInfoCardsProps) => {
  const infoItems = [
    {
      icon: Clock,
      label: "Duration",
      value: duration,
    },
    {
      icon: Users,
      label: "Group Size",
      value: capacity || "Max 12 guests",
    },
    {
      icon: Globe,
      label: "Language",
      value: "English, Arabic",
    },
    {
      icon: Calendar,
      label: "Availability",
      value: "Daily",
    },
    {
      icon: MapPin,
      label: "Meeting Point",
      value: "Dubai Marina",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 bg-card rounded-xl border border-border/50 shadow-sm text-center hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
            <item.icon className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
          <p className="text-sm font-semibold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickInfoCards;
