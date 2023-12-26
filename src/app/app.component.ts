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

    document.querySelector('body')?.addEventListener('touchend', () => {
      this.panzoom.pause();
    });

    elem.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel);
  }

  public getCurrentCoordinates(event: MouseEvent) {
    event.preventDefault();
    console.log(event.offsetX, event.offsetY);
    const left = event.offsetX;
    const top = event.offsetY;
    let elem = this.world.nativeElement;
    try {
      this.world.nativeElement.querySelector('.message').remove();
    } catch (e) {}

    const instance = this.panzoom;
    function createMessageUnder(elem: any, html: any) {
      // create message element

      let message = document.createElement('textarea');
      // better to use a css class for the style here
      message.style.cssText = 'position:absolute; color: black; font-size: 5px';
      message.classList.add('message');

      message.style.left = ((left / 200) | 0) * 200 + 'px';
      message.style.top = ((top / 200) | 0) * 200 + 'px';
      const coords = {
        left: message.style.left,
        top: message.style.top,
      };
      message.style.width = '200px';
      message.style.height = '200px';
      message.style.border = '1px dotted black';
      message.style.padding = '52px';
      message.style.background = 'transparent';

      message.addEventListener('mouseenter', (e) => {
        document.querySelector('textarea')?.focus();
        document.querySelector('textarea')!.value =
          localStorage.getItem(JSON.stringify(coords)) || '';
      });

      message.addEventListener('touchmove', (e) => {
        document.querySelector('textarea')?.focus();
        document.querySelector('textarea')!.value =
          localStorage.getItem(JSON.stringify(coords)) || '';
      });

      message.addEventListener('touchstart', (e) => {
        document.querySelector('textarea')?.focus();
        document.querySelector('textarea')!.value =
          localStorage.getItem(JSON.stringify(coords)) || '';
      });

      message.addEventListener('change', () => {
        localStorage.setItem(
          JSON.stringify(coords),
          document.querySelector('textarea')!.value
        );
      });

      // message.innerHTML = html;

      return message;
    }

    // Usage:
    // add it for 5 seconds in the document
    let message = createMessageUnder(
      elem,
      `${((left / 200) | 0) * 200},${((top / 200) | 0) * 200}`
    );

    this.world.nativeElement.append(message);
  }

  public teleport() {
    this.panzoom.zoom(1);

    this.panzoom.pan(10, 10);
  }
}
