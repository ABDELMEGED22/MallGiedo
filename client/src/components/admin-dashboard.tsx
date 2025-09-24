import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductForm from "./product-form";
import { type Product, type Category } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<{ data: Category[] }>({
    queryKey: ["/api/categories"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف المنتج",
        variant: "destructive",
      });
    },
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !categories?.data) return "غير محدد";
    const category = categories.data.find(c => c.id === categoryId);
    return category?.nameAr || "غير محدد";
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleCloseProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="h-full flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-card border-l border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6" data-testid="text-admin-title">لوحة الإدارة</h2>
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-primary text-primary-foreground">
                <i className="fas fa-box"></i>
                <span>إدارة المنتجات</span>
              </a>
              <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted">
                <i className="fas fa-tags"></i>
                <span>إدارة الفئات</span>
              </a>
              <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted">
                <i className="fas fa-chart-bar"></i>
                <span>التقارير</span>
              </a>
              <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted">
                <i className="fas fa-cog"></i>
                <span>الإعدادات</span>
              </a>
            </nav>
          </div>
        </aside>
        
        {/* Admin Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" data-testid="text-products-title">إدارة المنتجات</h1>
            <div className="space-x-2 space-x-reverse">
              <Button
                onClick={() => setIsProductFormOpen(true)}
                data-testid="button-add-product"
              >
                <i className="fas fa-plus ml-2"></i>
                إضافة منتج جديد
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                data-testid="button-close-admin"
              >
                <i className="fas fa-times ml-2"></i>
                إغلاق
              </Button>
            </div>
          </div>
          
          {/* Products Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>جارٍ تحميل المنتجات...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-right p-4 font-medium">المنتج</th>
                    <th className="text-right p-4 font-medium">الفئة</th>
                    <th className="text-right p-4 font-medium">السعر</th>
                    <th className="text-right p-4 font-medium">الحالة</th>
                    <th className="text-right p-4 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products?.data?.map((product) => (
                    <tr key={product.id} data-testid={`row-product-${product.id}`}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                            data-testid={`img-admin-product-${product.id}`}
                          />
                          <div>
                            <p className="font-medium" data-testid={`text-admin-title-${product.id}`}>
                              {product.title}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-admin-sku-${product.id}`}>
                              SKU: {product.sku || product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground" data-testid={`text-admin-category-${product.id}`}>
                        {getCategoryName(product.categoryId)}
                      </td>
                      <td className="p-4 font-medium" data-testid={`text-admin-price-${product.id}`}>
                        {parseFloat(product.price).toLocaleString()} جنيه
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                          data-testid={`badge-admin-status-${product.id}`}
                        >
                          {product.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <i className="fas fa-edit text-primary"></i>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <i className="fas fa-trash text-destructive"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
      
      {/* Product Form Modal */}
      {isProductFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseProductForm}
        />
      )}
    </div>
  );
}
