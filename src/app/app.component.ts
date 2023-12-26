import { Component, ElementRef, ViewChild } from '@angular/core';
import Panzoom from '@panzoom/panzoom';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'infinite-wall';

  public panzoom: any;
  @ViewChild('world') world!: ElementRef;

  ngAfterViewInit() {
    const elem: any = this.world.nativeElement;

    this.panzoom = Panzoom(elem, {
      maxScale: 100,
      minScale: 0.02,
    });

    elem.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel);
  }

  public getCurrentCoordinates(event: MouseEvent) {
    console.log(event.offsetX, event.offsetY);
    const left = event.offsetX;
    const top = event.offsetY;
    let elem = this.world.nativeElement;
    try {
      this.world.nativeElement.querySelector('.message').remove();
    } catch (e) {}
    function createMessageUnder(elem: any, html: any) {
      // create message element

      let message = document.createElement('div');
      // better to use a css class for the style here
      message.style.cssText = 'position:absolute; color: red';
      message.classList.add('message');

      // assign coordinates, don't forget "px"!
      let coords = elem.getBoundingClientRect();

      message.style.left = left + 'px';
      message.style.top = top + 'px';

      message.innerHTML = html;

      return message;
    }

    // Usage:
    // add it for 5 seconds in the document
    let message = createMessageUnder(elem, `${left},${top}`);

    this.world.nativeElement.append(message);
  }

  public teleport() {
    this.panzoom.zoom(1);

    this.panzoom.pan(10, 10);
  }
}
