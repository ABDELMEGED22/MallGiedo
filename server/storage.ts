import { type Product, type InsertProduct, type Category, type InsertCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(filters?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const electronicsCat: Category = {
      id: "cat-1",
      name: "Electronics",
      nameAr: "الإلكترونيات",
      description: "Electronic devices and accessories",
      productCount: 0,
    };
    
    const fashionCat: Category = {
      id: "cat-2", 
      name: "Fashion",
      nameAr: "الأزياء",
      description: "Clothing and fashion accessories",
      productCount: 0,
    };

    const homeCat: Category = {
      id: "cat-3",
      name: "Home & Garden", 
      nameAr: "المنزل والحديقة",
      description: "Home and garden products",
      productCount: 0,
    };

    const sportsCat: Category = {
      id: "cat-4",
      name: "Sports",
      nameAr: "الرياضة", 
      description: "Sports and fitness equipment",
      productCount: 0,
    };

    const booksCat: Category = {
      id: "cat-5",
      name: "Books",
      nameAr: "الكتب",
      description: "Books and educational materials", 
      productCount: 0,
    };

    this.categories.set(electronicsCat.id, electronicsCat);
    this.categories.set(fashionCat.id, fashionCat);
    this.categories.set(homeCat.id, homeCat);
    this.categories.set(sportsCat.id, sportsCat);
    this.categories.set(booksCat.id, booksCat);

    // Seed products
    const sampleProducts: Product[] = [
      {
        id: "prod-1",
        title: "iPhone 15 Pro Max 256GB",
        description: "أحدث إصدار من آيفون مع كاميرا عالية الدقة وأداء استثنائي",
        price: "45999.00",
        originalPrice: "52999.00",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: "cat-1",
        affiliateUrl: "https://example.com/iphone15pro",
        rating: "4.8",
        reviewCount: 127,
        sku: "IP15PM256",
        isActive: true,
        isFeatured: true,
        tags: ["جديد", "آيفون", "هاتف ذكي"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "prod-2",
        title: "سماعة ألعاب لاسلكية RGB",
        description: "سماعة ألعاب احترافية مع إضاءة RGB وجودة صوت عالية",
        price: "2499.00",
        originalPrice: "3999.00",
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: "cat-1",
        affiliateUrl: "https://example.com/gaming-headset",
        rating: "4.3",
        reviewCount: 89,
        sku: "GH-RGB-001",
        isActive: true,
        isFeatured: false,
        tags: ["ألعاب", "سماعة", "RGB"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "prod-3",
        title: "لوحة مفاتيح ميكانيكية RGB",
        description: "لوحة مفاتيح ميكانيكية للألعاب مع إضاءة RGB قابلة للتخصيص",
        price: "3799.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: "cat-1",
        affiliateUrl: "https://example.com/mechanical-keyboard",
        rating: "4.6",
        reviewCount: 203,
        sku: "MK-RGB-001",
        isActive: true,
        isFeatured: false,
        tags: ["ألعاب", "لوحة مفاتيح", "ميكانيكية"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "prod-4",
        title: "سماعات أذن لاسلكية AirPods Pro",
        description: "سماعات أذن لاسلكية مع إلغاء الضوضاء النشط وجودة صوت فائقة",
        price: "8999.00",
        originalPrice: "9999.00",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: "cat-1",
        affiliateUrl: "https://example.com/airpods-pro",
        rating: "4.9",
        reviewCount: 1456,
        sku: "APP-001",
        isActive: true,
        isFeatured: true,
        tags: ["سماعات", "لاسلكية", "آبل"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Update category product counts
    this.updateCategoryProductCounts();
  }

  private updateCategoryProductCounts() {
    const categoryCounts = new Map<string, number>();
    Array.from(this.products.values()).forEach(product => {
      if (product.categoryId) {
        const current = categoryCounts.get(product.categoryId) || 0;
        categoryCounts.set(product.categoryId, current + 1);
      }
    });

    Array.from(categoryCounts.entries()).forEach(([categoryId, count]) => {
      const category = this.categories.get(categoryId);
      if (category) {
        category.productCount = count;
      }
    });
  }

  async getProducts(filters?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }

    if (filters?.minPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }

    if (filters?.rating !== undefined) {
      products = products.filter(p => p.rating && parseFloat(p.rating) >= filters.rating!);
    }

    // Sort products
    switch (filters?.sortBy) {
      case 'price_asc':
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_desc':
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        products.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
        break;
      case 'popular':
        products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
      default:
        products.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        break;
    }

    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      ...product,
      id,
      originalPrice: product.originalPrice || null,
      images: product.images || [],
      categoryId: product.categoryId || null,
      rating: product.rating || "0",
      reviewCount: product.reviewCount || 0,
      sku: product.sku || null,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      tags: product.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    this.updateCategoryProductCounts();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    this.updateCategoryProductCounts();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = this.products.delete(id);
    if (deleted) {
      this.updateCategoryProductCounts();
    }
    return deleted;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = {
      ...category,
      id,
      description: category.description || null,
      productCount: 0,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = {
      ...existing,
      ...updates,
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }
}

export const storage = new MemStorage();
