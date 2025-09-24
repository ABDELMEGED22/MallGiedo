import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onCartToggle: () => void;
  onMobileMenuToggle: () => void;
  cartItemCount: number;
  favoriteCount: number;
  onSearch: (search: string) => void;
}

export default function Header({
  onCartToggle,
  onMobileMenuToggle,
  cartItemCount,
  favoriteCount,
  onSearch,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-2xl font-bold text-primary" data-testid="text-logo">
              🛍️ Giedo Mall
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-4 py-2 pr-12 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                data-testid="input-search"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                data-testid="button-search"
              >
                <i className="fas fa-search"></i>
              </Button>
            </form>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-muted-foreground hover:text-foreground"
              data-testid="button-favorites"
            >
              <i className="fas fa-heart text-lg"></i>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-muted-foreground hover:text-foreground"
              onClick={onCartToggle}
              data-testid="button-cart"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-muted-foreground hover:text-foreground md:hidden"
              onClick={onMobileMenuToggle}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-lg"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
