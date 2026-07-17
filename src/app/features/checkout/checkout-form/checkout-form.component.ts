import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent {
  private fb = inject(FormBuilder);
  protected cartService = inject(CartService);
  private router = inject(Router);

  // Tracks if the final order is being processed
  protected isSubmitting = signal<boolean>(false);

  // Strongly typed validation group setup
  protected checkoutForm: FormGroup = this.fb.group({
    customerInfo: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] // Strict 10-digit number validation
    }),
    shippingAddress: this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]]
    })
  });

  // Helper getters to simplify template error validation rendering
  get infoGroup() { return this.checkoutForm.get('customerInfo') as FormGroup; }
  get addressGroup() { return this.checkoutForm.get('shippingAddress') as FormGroup; }

  protected onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched(); // Force all errors to show if they click submit early
      return;
    }

    this.isSubmitting.set(true);

    // Mock an API backend call processing the transaction details
    setTimeout(() => {
      console.log('Order finalized successfully:', this.checkoutForm.value);
      this.cartService.clearCart(); // Wipe the state clear on successful checkout
      this.isSubmitting.set(false);
      
      alert('Order Placed Successfully! Thank you for shopping.');
      this.router.navigate(['/products']);
    }, 2000);
  }
}