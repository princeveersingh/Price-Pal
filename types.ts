export interface ComparisonResult {
  retailer: string;
  price: number;
  deliveryDate: string;
  rating: number;
  url: string;
}

export interface ComparisonData {
  comparisons: ComparisonResult[];
  recommendation: string;
  bestRetailer: string;
}

export interface CartItemData {
  id: string;
  name: string;
  comparisons: ComparisonData | null;
  isLoading: boolean;
  error: string | null;
  priceAlert?: number | null;
}
