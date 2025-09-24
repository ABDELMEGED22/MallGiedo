import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${product.id}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      affiliateUrl: product.affiliateUrl,
    });
    
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.title} إلى السلة`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast({
      title: isFavorite(product.id) ? "تم إزالة المنتج من المفضلة" : "تم إضافة المنتج للمفضلة",
      description: product.title,
    });
  };

  const handleBuyNow = () => {
    window.open(product.affiliateUrl, '_blank');
  };

  const getDiscountPercentage = () => {
    if (!product.originalPrice) return null;
    const original = parseFloat(product.originalPrice);
    const current = parseFloat(product.price);
    return Math.round(((original - current) / original) * 100);
  };

  const renderStars = (rating: string) => {
    const ratingValue = parseFloat(rating);
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <i key={i} className="far fa-star"></i>
        ))}
      </div>
    );
  };

  const discountPercent = getDiscountPercentage();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-product-${product.id}`}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          onClick={handleToggleFavorite}
          data-testid={`button-favorite-${product.id}`}
        >
          <i className={`${isFavorite(product.id) ? 'fas text-red-500' : 'far text-gray-600 hover:text-red-500'} fa-heart`}></i>
        </Button>
        
        {product.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            جديد
          </Badge>
        )}
        
        {discountPercent && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
            خصم كبير
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-title-${product.id}`}>
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          {renderStars(product.rating || '0')}
          <span className="text-sm text-muted-foreground mr-2" data-testid={`text-reviews-${product.id}`}>
            ({product.reviewCount} تقييم)
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${product.id}`}>
              {parseFloat(product.price).toLocaleString()} جنيه
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through block" data-testid={`text-original-price-${product.id}`}>
                {parseFloat(product.originalPrice).toLocaleString()} جنيه
              </span>
            )}
          </div>
          {discountPercent && (
            <Badge variant="secondary">خصم {discountPercent}%</Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            data-testid={`button-add-cart-${product.id}`}
          >
            <i className="fas fa-cart-plus ml-2"></i>
            أضف للسلة
          </Button>
          <Button
            variant="outline"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleBuyNow}
            data-testid={`button-buy-now-${product.id}`}
          >
            <i className="fas fa-external-link-alt ml-2"></i>
            اشتري الآن
          </Button>
        </div>
      </div>
    </div>
  );
}
