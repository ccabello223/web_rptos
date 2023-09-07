import { Component, Input } from '@angular/core';

interface carouselImage{
  imageSrc: string;
  imageAlt: string;
}


@Component({
  selector: 'shared-carousel',
  templateUrl: './watch-carousel-image.component.html',
  styleUrls: ['./watch-carousel-image.component.css']
})
export class WatchCarouselImageComponent {
  @Input() images: carouselImage[] = [];
  @Input() indicators = true;
  @Input() controls = true;

  selectedIndex = 0;

  ngOnInit(): void {
  }

  // cambia de imagen
  selectedImagen(i: number){
    this.selectedIndex = i;
  }

  onPrevClick(): void{
    if(this.selectedIndex === 0){
      this.selectedIndex = this.images.length - 1;
    }else{
      this.selectedIndex--;
    }
  }

  onNextClick(): void{
    if(this.selectedIndex === this.images.length - 1){
      this.selectedIndex = 0;
    }else{
      this.selectedIndex++;
    }
  }
}
