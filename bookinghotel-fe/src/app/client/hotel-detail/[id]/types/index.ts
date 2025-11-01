export interface PropertyDetail {
  id: number;
  name: string;
  description: string;
  address: string;
  avgPrice: number;
  phone:string
  city: {
    id:number
    title:string
  }
  summaryReview: {
    avgRating: number
    reviewCount:number
  }
}

export interface Room {
  id: number;
  name: string;
  image: string;
  size: number;
  beds: string;
  capacity: number;
  price: number;
  amenities: string[];
}

// Giả sử trong file: ../types.ts

export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number; // Điểm 0-10
  date: string;     // Dạng ISO string (e.g., "2025-10-20T10:00:00.000Z")
  comment: string;
  helpful: number;
  source?: string; // Nguồn review, ví dụ 'Staycation'
  sourceIcon?: React.ReactNode; // Icon cho nguồn
}

export interface ReviewCategoryScore {
  category: string;
  score: number; // Điểm 0-10
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingText: string;
  categoryScores: ReviewCategoryScore[];
}
