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
];
