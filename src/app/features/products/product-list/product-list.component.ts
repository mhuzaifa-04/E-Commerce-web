import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Component Signals to manage loading states and data lists reactively
  protected products = signal<Product[]>([]);
  protected isLoading = signal<boolean>(true);
  protected hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed fetching products:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  // Trigger state update inside our global CartService
  protected handleAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}