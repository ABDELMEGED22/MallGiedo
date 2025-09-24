export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  affiliateUrl: string;
}

export interface Filters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
}
