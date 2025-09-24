import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import { type Product } from "@shared/schema";
import { Filters } from "@/lib/types";

interface ProductGridProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function ProductGrid({ filters, onFiltersChange }: ProductGridProps) {
  const { data: products, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products", filters],
  });

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as Filters['sortBy'],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  const productCount = products?.data?.length || 0;

  return (
    <>
      {/* Product Filters */}
      <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-muted-foreground" data-testid="text-product-count">
            عرض 1-{productCount} من {productCount} منتج
          </span>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={filters.sortBy || "newest"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SelectValue placeholder="ترتيب حسب: الأحدث" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">ترتيب حسب: الأحدث</SelectItem>
              <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="popular">الأكثر مبيعاً</SelectItem>
              <SelectItem value="rating">الأعلى تقييماً</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant="default"
              size="sm"
              className="px-3 py-2"
              data-testid="button-grid-view"
            >
              <i className="fas fa-th"></i>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2"
              data-testid="button-list-view"
            >
              <i className="fas fa-list"></i>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Grid */}
      {productCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
          <p className="text-muted-foreground">لم يتم العثور على منتجات تطابق معايير البحث الخاصة بك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products?.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {productCount > 0 && (
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <Button variant="ghost" size="sm" disabled data-testid="button-prev-page">
            <i className="fas fa-chevron-right"></i>
          </Button>
          <Button variant="default" size="sm" data-testid="button-page-1">1</Button>
          <Button variant="ghost" size="sm" data-testid="button-page-2">2</Button>
          <Button variant="ghost" size="sm" data-testid="button-page-3">3</Button>
          <span className="px-3 py-2 text-muted-foreground">...</span>
          <Button variant="ghost" size="sm" data-testid="button-page-19">19</Button>
          <Button variant="ghost" size="sm" data-testid="button-next-page">
            <i className="fas fa-chevron-left"></i>
          </Button>
        </div>
      )}
    </>
  );
}
