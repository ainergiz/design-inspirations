// Shared designs data for navigation and listing
export interface Design {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export const designs: Design[] = [
  {
    id: "company-card",
    number: "01",
    title: "Company Info Card",
    description: "Expandable card with company metrics and details",
    tags: ["Card", "Dashboard", "Metrics"],
  },
  {
    id: "hotel-card",
    number: "02",
    title: "Hotel Booking Card",
    description: "Hotel card with amenities, pricing, and booking button",
    tags: ["Card", "Booking", "Travel"],
  },
  {
    id: "bills-payments",
    number: "03",
    title: "Bills & Payments",
    description: "Subscription management cards with payment reminders",
    tags: ["Card", "Finance", "Dashboard"],
  },
  {
    id: "mood-slider",
    number: "04",
    title: "Mood Slider",
    description: "Interactive mood selector with morphing blob animation",
    tags: ["Interactive", "Animation", "Gesture"],
  },
  {
    id: "music-player",
    number: "05",
    title: "Vinyl Music Player",
    description: "Music player with album browser and spinning vinyl animation",
    tags: ["Media", "Audio", "Animation"],
  },
  {
    id: "expandable-drawer",
    number: "06",
    title: "Expandable Drawer",
    description: "Floating drawer with drag-to-close gesture and smooth animations",
    tags: ["Interactive", "Gesture", "Drawer"],
  },
];
