import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root' // Singleton: Single instance shared across the entire app
})
export class CartService {
  // 1. Reactive state representing items in the cart
  private cartItemsSignal = signal<CartItem[]>([]);

  // 2. Publicly accessible read-only signals
  public cartItems = this.cartItemsSignal.asReadonly();

  // 3. Computed state: automatically updates when cartItemsSignal changes
  public totalCount = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0);
  });

  public totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  // Add an item to the cart
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Update quantity immutably
      this.cartItemsSignal.set(
        currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      // Append new item immutably
      this.cartItemsSignal.set([...currentItems, { product, quantity: 1 }]);
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

  // Modify item quantity directly
  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartItemsSignal();
    const targetedItem = currentItems.find(item => item.product.id === productId);

    if (!targetedItem) return;

    const newQuantity = targetedItem.quantity + change;

    if (newQuantity <= 0) {
      // If quantity drops below 1, remove the item entirely
      this.removeFromCart(productId);
    } else {
      // Otherwise, update the quantity immutably
      this.cartItemsSignal.set(
        currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }
}