import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Default Route redirects directly to our products catalog listing
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  // 2. Lazy Loaded Product Feature Routes
  {
    path: 'products',
    loadComponent: () => 
      import('./features/products/product-list/product-list.component')
        .then(m => m.ProductListComponent),
    title: 'Shop Catalog | AngularStore' // Sets the browser tab title automatically
  },

  // 3. Lazy Loaded Shopping Cart Overview
  {
    path: 'cart',
    loadComponent: () => 
      import('./features/cart/cart-overview/cart-overview.component')
        .then(m => m.CartOverviewComponent),
    title: 'Your Shopping Cart | AngularStore'
  },

  // 4. Lazy Loaded Checkout Process
  {
    path: 'checkout',
    loadComponent: () => 
      import('./features/checkout/checkout-form/checkout-form.component')
        .then(m => m.CheckoutFormComponent),
    title: 'Secure Checkout | AngularStore'
  },

  // 5. Fallback Wildcard Route for handling 404 Page Not Found scenarios
  {
    path: '**',
    redirectTo: 'products'
  }
];