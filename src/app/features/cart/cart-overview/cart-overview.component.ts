import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-overview',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-overview.component.html',
  styleUrls: ['./cart-overview.component.scss']
})
export class CartOverviewComponent {
  protected cartService = inject(CartService);

  // Exposing the signals directly to our HTML template
  protected items = this.cartService.cartItems;
  protected totalPrice = this.cartService.totalPrice;
  protected totalCount = this.cartService.totalCount;

  protected handleQuantityChange(productId: number, change: number): void {
    this.cartService.updateQuantity(productId, change);
  }

  protected handleRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}