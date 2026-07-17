import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Modern dependency injection using inject() instead of constructor injection
  protected cartService = inject(CartService);

  // We expose the computed signals directly to the template
  protected cartCount = this.cartService.totalCount;
}