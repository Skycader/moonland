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

  public mi: any;
  public mouseMove(event: any) {
    clearTimeout(this.mi);
    this.mi = setTimeout(() => {
      this.getCurrentCoordinates(event);
    }, 500);
  }
  public getCurrentCoordinates(event: any) {
    event.preventDefault();
    const left = event.offsetX;
    const top = event.offsetY;
    let elem = this.world.nativeElement;
    try {
      this.world.nativeElement
        .querySelectorAll('.message')
        .forEach((item: any) => item.remove());
    } catch (e) {}

    const instance = this.panzoom;
    function createMessageUnder(elem: any, x: number = 0, y: number = 0) {
      // create message element

      let message = document.createElement('textarea');
      // better to use a css class for the style here
      message.style.cssText = 'position:absolute; color: black; font-size: 5px';
      message.classList.add('message');

      let l = left + 200 * x;
      let t = top + 200 * y;

      if (l < 0) return;
      if (t < 0) return;
      message.style.left = ((l / 200) | 0) * 200 + 'px';
      message.style.top = ((t / 200) | 0) * 200 + 'px';
      const coords = {
        left: message.style.left,
        top: message.style.top,
      };
      message.style.width = '200px';
      message.style.height = '200px';
      message.style.border = 'none';
      message.style.outline = '0x solid red';
      message.style.padding = '52px';
      message.style.background = 'transparent';
      message.value = localStorage.getItem(JSON.stringify(coords)) || '';

      // message.innerHTML = html;

      return message;
    }

    // Usage:
    // add it for 5 seconds in the document

    for (let i = -50; i < 51; i++) {
      for (let j = -50; j < 51; j++) {
        let message = createMessageUnder(elem, i, j);
        if (message) this.world.nativeElement.append(message);
      }
    }
  }

  public teleport() {
    this.panzoom.zoom(1);

    this.panzoom.pan(10, 10);
  }
}
