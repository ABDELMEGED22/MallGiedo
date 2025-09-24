import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ProductGrid from "@/components/product-grid";
import CartModal from "@/components/cart-modal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { Filters } from "@/lib/types";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  
  const { getTotalItems } = useCart();
  const { getFavoriteCount } = useFavorites();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        cartItemCount={getTotalItems()}
        favoriteCount={getFavoriteCount()}
        onSearch={(search: string) => setFilters(prev => ({ ...prev, search }))}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <main className="flex-1 p-6">
          <nav className="mb-6" data-testid="breadcrumb">
            <ol className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">الرئيسية</a></li>
              <li><i className="fas fa-chevron-left text-xs"></i></li>
              <li><a href="#" className="hover:text-foreground">الإلكترونيات</a></li>
              <li><i className="fas fa-chevron-left text-xs"></i></li>
              <li className="text-foreground">الهواتف الذكية</li>
            </ol>
          </nav>
          
          <ProductGrid filters={filters} onFiltersChange={setFilters} />
        </main>
      </div>
      
      {/* Floating Action Button for Mobile */}
      <Button
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 md:hidden"
        onClick={() => setIsCartOpen(true)}
        data-testid="button-mobile-cart"
      >
        <i className="fas fa-shopping-cart text-lg"></i>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </Button>
      
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
