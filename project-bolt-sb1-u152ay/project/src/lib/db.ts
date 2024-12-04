import { openDB, DBSchema } from 'idb';

interface StoreDB extends DBSchema {
  users: {
    key: number;
    value: {
      id: number;
      email: string;
      password: string;
      name: string;
      created_at: string;
    };
    indexes: {
      'by-email': string;
    };
  };
  cart: {
    key: number;
    value: {
      id: number;
      userId: number;
      productId: number;
      quantity: number;
    };
    indexes: {
      'by-user': number;
    };
  };
  orders: {
    key: number;
    value: {
      id: number;
      userId: number;
      items: Array<{
        productId: number;
        quantity: number;
        price: number;
      }>;
      total: number;
      shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      paymentMethod: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
      };
      status: 'pending' | 'completed';
      createdAt: string;
    };
    indexes: {
      'by-user': number;
    };
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

const dbPromise = openDB<StoreDB>('store-db', 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const userStore = db.createObjectStore('users', {
        keyPath: 'id',
        autoIncrement: true,
      });
      userStore.createIndex('by-email', 'email', { unique: true });

      const cartStore = db.createObjectStore('cart', {
        keyPath: 'id',
        autoIncrement: true,
      });
      cartStore.createIndex('by-user', 'userId');
    }
    
    if (oldVersion < 2) {
      const orderStore = db.createObjectStore('orders', {
        keyPath: 'id',
        autoIncrement: true,
      });
      orderStore.createIndex('by-user', 'userId');
    }
  },
});

export const createUser = async (userData: { email: string; password: string; name: string }): Promise<User | null> => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    
    const existingUser = await store.index('by-email').get(userData.email);
    if (existingUser) {
      return null;
    }

    const id = await store.add({
      ...userData,
      created_at: new Date().toISOString(),
    });

    await tx.done;

    const user = await store.get(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<{ id: number; email: string; password: string; name: string; created_at: string; } | null> => {
  try {
    const db = await dbPromise;
    const user = await db.getFromIndex('users', 'by-email', email);
    return user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const addToCart = async (userId: number, productId: number, quantity: number): Promise<boolean> => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    const index = store.index('by-user');
    
    const existingItems = await index.getAll(userId);
    const existingItem = existingItems.find(item => item.productId === productId);
    
    if (existingItem) {
      await store.put({
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      });
    } else {
      await store.add({ userId, productId, quantity });
    }
    
    await tx.done;
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

export const getCartItems = async (userId: number) => {
  try {
    const db = await dbPromise;
    const items = await db.getAllFromIndex('cart', 'by-user', userId);
    return items;
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<boolean> => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    
    const item = await store.get(itemId);
    if (!item) return false;
    
    await store.put({ ...item, quantity });
    await tx.done;
    return true;
  } catch (error) {
    console.error('Error updating cart item:', error);
    return false;
  }
};

export const removeFromCart = async (itemId: number): Promise<boolean> => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('cart', 'readwrite');
    await tx.objectStore('cart').delete(itemId);
    await tx.done;
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<number | null> => {
  try {
    const db = await dbPromise;
    const tx = db.transaction(['orders', 'cart'], 'readwrite');
    
    // Create the order
    const orderId = await tx.objectStore('orders').add({
      ...order,
      createdAt: new Date().toISOString(),
    });

    // Clear the user's cart
    const cartStore = tx.objectStore('cart');
    const cartIndex = cartStore.index('by-user');
    const cartItems = await cartIndex.getAllKeys(order.userId);
    await Promise.all(cartItems.map(key => cartStore.delete(key)));

    await tx.done;
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};