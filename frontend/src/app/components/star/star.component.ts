import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css'
})
export class StarComponent implements OnInit {
  @Input() rating: number = 0;
  @Output() ratingChanged: EventEmitter<number> = new EventEmitter<number>();
  @Input() isDisabled: boolean = false;

  filledStars: number = 0;
  stars: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.stars = [0, 1, 2, 3, 4];
    this.filledStars = Math.floor(this.rating);
  }

  rateStar(index: number): void {
    if (!this.isDisabled) {
      this.filledStars = index + 1;
      this.ratingChanged.emit(this.filledStars);
    }
  }
}
