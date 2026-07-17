import { Injectable, signal, computed, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 1. Inject the core platform ID token
  private platformId = inject(PLATFORM_ID);
  private storageKey = 'angular_store_cart';

  // 2. State representing items in the cart (initialized empty)
  private cartItemsSignal = signal<CartItem[]>([]);

  // 3. Publicly accessible read-only signals
  public cartItems = this.cartItemsSignal.asReadonly();

  public totalCount = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0);
  });

  public totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  constructor() {
    // 4. LOAD SAFE SYSTEM: Only access localStorage if we are running in the browser
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedCart = localStorage.getItem(this.storageKey);
        if (savedCart) {
          this.cartItemsSignal.set(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Failed to parse cart session from localStorage:', error);
      }
    }

    // 5. SAVE SAFE SYSTEM: Use a declarative Angular Effect
    // Effects track signal execution dependencies and run automatically whenever those signals change.
    effect(() => {
      const currentItems = this.cartItemsSignal();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.storageKey, JSON.stringify(currentItems));
      }
    });
  }

  // Add an item to the cart
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      this.cartItemsSignal.set(
        currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      this.cartItemsSignal.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  // Modify item quantity directly
  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartItemsSignal();
    const targetedItem = currentItems.find(item => item.product.id === productId);

    if (!targetedItem) return;

    const newQuantity = targetedItem.quantity + change;

    if (newQuantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cartItemsSignal.set(
        currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }

  // Remove an item entirely
  removeFromCart(productId: number): void {
    this.cartItemsSignal.set(
      this.cartItemsSignal().filter(item => item.product.id !== productId)
    );
  }

  // Clear the whole cart
  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}