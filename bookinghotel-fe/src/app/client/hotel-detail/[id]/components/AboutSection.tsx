// components/cards/AboutCard.tsx

interface AboutCardProps {
  description: string;
}

export default function AboutCard({ description }: AboutCardProps) {
  return (
    // Thêm padding, border, và h-full để 3 card cao bằng nhau
    <div className="p-4 border rounded-lg h-full">
      <h3 className="text-xl font-bold mb-3">About This Property</h3>
      <p className="text-gray-700 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}