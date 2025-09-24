import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Open all affiliate links
    cartItems.forEach(item => {
      window.open(item.affiliateUrl, '_blank');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" data-testid="cart-modal-overlay">
      <div className="fixed inset-y-0 left-0 w-full max-w-md bg-card shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold" data-testid="text-cart-title">سلة التسوق</h2>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-cart">
            <i className="fas fa-times text-xl"></i>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold mb-2">السلة فارغة</h3>
              <p className="text-muted-foreground">لم تقم بإضافة أي منتجات بعد</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 space-x-reverse mb-4 pb-4 border-b border-border"
                data-testid={`cart-item-${item.productId}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                  data-testid={`img-cart-item-${item.productId}`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm" data-testid={`text-cart-item-title-${item.productId}`}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.productId}`}>
                    {parseFloat(item.price).toLocaleString()} جنيه
                  </p>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      data-testid={`button-decrease-${item.productId}`}
                    >
                      -
                    </Button>
                    <span className="text-sm" data-testid={`text-quantity-${item.productId}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      data-testid={`button-increase-${item.productId}`}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.productId)}
                  data-testid={`button-remove-${item.productId}`}
                >
                  <i className="fas fa-trash text-sm"></i>
                </Button>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">المجموع:</span>
              <span className="font-bold text-lg" data-testid="text-cart-total">
                {getTotalPrice().toLocaleString()} جنيه
              </span>
            </div>
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleCheckout}
              data-testid="button-checkout"
            >
              متابعة الشراء
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
