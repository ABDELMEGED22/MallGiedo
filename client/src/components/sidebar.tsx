import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Category } from "@shared/schema";
import { Filters } from "@/lib/types";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function Sidebar({ isOpen, onClose, filters, onFiltersChange }: SidebarProps) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");

  const { data: categories } = useQuery<{ data: Category[] }>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceFilter = () => {
    onFiltersChange({
      ...filters,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleRatingFilter = (rating: number, checked: boolean) => {
    if (checked) {
      onFiltersChange({ ...filters, rating });
    } else {
      onFiltersChange({ ...filters, rating: undefined });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          data-testid="mobile-sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0 fixed md:static inset-y-0 right-0 z-50 md:z-auto
          w-64 bg-card border-l border-border min-h-screen transition-transform duration-300
        `}
        data-testid="sidebar"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h3 className="font-semibold text-lg">الفئات والمرشحات</h3>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-sidebar">
              <i className="fas fa-times"></i>
            </Button>
          </div>
          
          <h3 className="font-semibold text-lg mb-4 hidden md:block">الفئات</h3>
          
          {/* Categories */}
          <div className="space-y-2 mb-6">
            {categories?.data?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center justify-between p-3 rounded-lg w-full text-right transition-colors
                  ${filters.categoryId === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                  }
                `}
                data-testid={`button-category-${category.id}`}
              >
                <span>{category.nameAr}</span>
                <span className="text-sm text-muted-foreground">{category.productCount}</span>
              </button>
            ))}
          </div>
          
          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">نطاق السعر</h4>
            <div className="space-y-3">
              <div className="flex space-x-2 space-x-reverse">
                <Input
                  type="number"
                  placeholder="من"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="flex-1"
                  data-testid="input-min-price"
                />
                <Input
                  type="number"
                  placeholder="إلى"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="flex-1"
                  data-testid="input-max-price"
                />
              </div>
              <Button
                onClick={handlePriceFilter}
                className="w-full"
                size="sm"
                data-testid="button-apply-price-filter"
              >
                تطبيق
              </Button>
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">التقييم</h4>
            <div className="space-y-2">
              {[4.5, 4.0, 3.0].map((rating) => (
                <div key={rating} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={(checked) => handleRatingFilter(rating, checked as boolean)}
                    data-testid={`checkbox-rating-${rating}`}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                    {rating === 4.5 && "⭐⭐⭐⭐⭐ (4.5+)"}
                    {rating === 4.0 && "⭐⭐⭐⭐ (4.0+)"}
                    {rating === 3.0 && "⭐⭐⭐ (3.0+)"}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
