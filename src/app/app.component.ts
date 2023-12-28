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

    elem.addEventListener('mousemove', (event: any) => {
      this.mouseMove(event);
    });
    this.world.nativeElement.addEventListener('touchmove', (event: any) =>
      this.mouseMove(event)
    );
    this.panzoom = Panzoom(elem, {
      maxScale: 100,
      minScale: 0.02,
    });

    document.querySelector('body')?.addEventListener('touchend', () => {
      this.panzoom.pause();
    });

    elem.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel);
  }

  public isFocused: boolean = false;
  public mi: any;
  public mouseMove(event: any) {
    clearTimeout(this.mi);

    const func = (item: any) => {
      item.remove();
    };
    this.mi = setTimeout(() => {
      try {
        if (this.isFocused) return;
        this.world.nativeElement.querySelectorAll('.message').forEach(func);
      } catch (e) {}

      if (!this.isFocused) this.getCurrentCoordinates(event);
    }, 300);
  }

  public left = 0;

  public getCurrentCoordinates(event: any) {
    event.preventDefault();
    const left = event.offsetX;
    this.left = left;
    const top = event.offsetY;
    let elem = this.world.nativeElement;

    const instance = this.panzoom;
    let isFocused = this.isFocused;
    function createMessageUnder(elem: any, x: number = 0, y: number = 0) {
      // create message element
      if (isFocused) return;
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

      message.addEventListener('click', () => {
        message.focus();
        isFocused = true;
      });

      message.addEventListener('mouseleave', () => {
        isFocused = false;
      });

      message.addEventListener('change', () => {
        localStorage.setItem(JSON.stringify(coords), message.value);
      });
      // message.innerHTML = html;

      return message;
    }

    // Usage:
    // add it for 5 seconds in the document

    const chunk = 10;
    const gotNotes = [];
    for (let i = -chunk / 2; i < chunk / 2; i++) {
      for (let j = -chunk / 2; j < chunk / 2; j++) {
        let message = createMessageUnder(elem, i, j);
        gotNotes.push(message);
      }
    }

    for (let note of gotNotes) {
      if (note) this.world.nativeElement.append(note);
    }
  }

  public teleport() {
    this.panzoom.zoom(1);

    this.panzoom.pan(10, 10);
  }
}
