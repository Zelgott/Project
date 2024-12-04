export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 299.99,
    description: "Advanced smartwatch with health monitoring features",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 49.99,
    description: "Water-resistant backpack with laptop compartment",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    category: "Accessories"
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 29.99,
    description: "Ergonomic wireless mouse with long battery life",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 5,
    name: "4K Gaming Monitor",
    price: 499.99,
    description: "27-inch 4K monitor with 144Hz refresh rate",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "RGB mechanical keyboard with Cherry MX switches",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 7,
    name: "Laptop Stand",
    price: 39.99,
    description: "Adjustable aluminum laptop stand for better ergonomics",
    image: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=500&q=80",
    category: "Accessories"
  },
  {
    id: 8,
    name: "Wireless Charger",
    price: 24.99,
    description: "Fast wireless charging pad for smartphones",
    image: "https://images.unsplash.com/photo-1622957040873-8ea24e293885?w=500&q=80",
    category: "Electronics"
  },
  {
    id: 9,
    name: "USB-C Hub",
    price: 59.99,
    description: "7-in-1 USB-C hub with HDMI and card readers",
    image: "https://images.unsplash.com/photo-1656618020911-1c7a937175fd?w=500&q=80",
    category: "Accessories"
  },
  {
    id: 10,
    name: "Noise-Canceling Earbuds",
    price: 149.99,
    description: "True wireless earbuds with active noise cancellation",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    category: "Electronics"
  }
];