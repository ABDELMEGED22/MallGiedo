import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type Product, type Category, insertProductSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const productFormSchema = insertProductSchema.extend({
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const { data: categories } = useQuery<{ data: Category[] }>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || "0",
      originalPrice: product?.originalPrice || undefined,
      image: product?.image || "",
      categoryId: product?.categoryId || undefined,
      affiliateUrl: product?.affiliateUrl || "",
      rating: product?.rating || "0",
      reviewCount: product?.reviewCount || 0,
      sku: product?.sku || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      tags: product?.tags?.join(", ") || "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { tags, ...productData } = data;
      const payload = {
        ...productData,
        tags: tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        images: [data.image],
      };
      
      if (isEditing) {
        return await apiRequest("PUT", `/api/products/${product.id}`, payload);
      } else {
        return await apiRequest("POST", "/api/products", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: isEditing ? "تم تحديث المنتج" : "تم إضافة المنتج",
        description: isEditing ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: isEditing ? "فشل في تحديث المنتج" : "فشل في إضافة المنتج",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold" data-testid="text-product-form-title">
            {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-product-form">
            <i className="fas fa-times text-xl"></i>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان المنتج</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان المنتج" {...field} data-testid="input-product-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف المنتج</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل وصف المنتج" {...field} data-testid="textarea-product-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر (جنيه)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-product-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر الأصلي (جنيه)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ''} data-testid="input-product-original-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-product-image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliateUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الأفلييت</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/affiliate-link" {...field} data-testid="input-product-affiliate" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التقييم (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="5" {...field} value={field.value || '0'} data-testid="input-product-rating" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد التقييمات</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        value={field.value || 0}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-product-review-count" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="PROD-001" {...field} value={field.value || ''} data-testid="input-product-sku" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الكلمات المفتاحية (مفصولة بفواصل)</FormLabel>
                  <FormControl>
                    <Input placeholder="إلكترونيات, هاتف, ذكي" {...field} data-testid="input-product-tags" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-x-reverse">
                    <FormControl>
                      <Switch 
                        checked={field.value || false} 
                        onCheckedChange={field.onChange}
                        data-testid="switch-product-active"
                      />
                    </FormControl>
                    <Label htmlFor="isActive">منتج نشط</Label>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-x-reverse">
                    <FormControl>
                      <Switch 
                        checked={field.value || false} 
                        onCheckedChange={field.onChange}
                        data-testid="switch-product-featured"
                      />
                    </FormControl>
                    <Label htmlFor="isFeatured">منتج مميز</Label>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
              <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-product">
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending}
                data-testid="button-save-product"
              >
                {createProductMutation.isPending ? "جارٍ الحفظ..." : (isEditing ? "تحديث" : "إضافة")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
