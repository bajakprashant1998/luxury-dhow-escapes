import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => {
  return (
    <a
      href="https://wa.me/971585725692?text=Hi%21%20I%27m%20interested%20in%20your%20yacht%20and%20dhow%20cruise%20experiences.%20Can%20you%20help%20me%20with%20booking%3F"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group lg:bottom-8 lg:right-8"
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-border">
        Chat with us!
      </div>
      
      {/* Button */}
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25" />
        
        {/* Main button */}
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-7 h-7 text-white" fill="white" />
        </div>
      </div>
    </a>
  );
};

export default WhatsAppWidget;
