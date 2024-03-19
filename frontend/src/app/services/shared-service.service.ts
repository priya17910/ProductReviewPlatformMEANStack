import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  loginEvent: EventEmitter<void> = new EventEmitter<void>();
  registerEvent: EventEmitter<void> = new EventEmitter<void>();
  productIdEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  triggerLoginEvent(): void {
    this.loginEvent.emit();
  }

  triggerRegisterEvent(): void {
    this.registerEvent.emit();
  }

  triggerProductIdEvent(product: any): void {
    this.productIdEvent.emit(product);
  }
}
