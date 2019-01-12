import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { jsPlumb } from 'jsplumb';

const endPointOptions = {
  isSource: true,
  isTarget: true,
  maxConnections: -1,
  endpoint: ['Dot', { radius: 5 }],
  style: { fill: 'blue' },
  connector: ['Bezier', { curviness: 150 }],
  dropOptions: {
    drop: (e, ui) => {
      alert('Event: connection dropped!');
    }
  },

};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {



  title = 'jsPlumb';
  jsPlumbInstance;
  boxes = [{ name: 'Box 1' }, { name: 'Box 2' }, { name: 'Box 3' }];

  origin: string = null;
  target: string;

  constructor(el: ElementRef) {


  }

  ngAfterViewInit(): void {

    //Starting positions
    document.getElementById('box0').style.top = '100px'

    document.getElementById('box1').style.top = '100px'
    document.getElementById('box1').style.left = '300px'

    document.getElementById('box2').style.top = '100px'
    document.getElementById('box2').style.left = '600px'

    // jsPlumb initialization
    this.jsPlumbInstance = jsPlumb.getInstance();

    // Making elements draggable in bulk
    const els = document.querySelectorAll('.draggable');
    this.jsPlumbInstance.draggable(els);
    this.jsPlumbInstance.addEndpoint(els, { anchor: 'AutoDefault' }, endPointOptions);

    // Before drop event register
    this.jsPlumbInstance.bind('beforeDrop', (info) => {
      console.log(info);
      let message = '';
      let res = false;

      const denyConnection = (info.sourceId === 'box0' && info.targetId === 'box2')
        || (info.sourceId === 'box2' && info.targetId === 'box0');

      if (denyConnection) {
        message = 'Denied!!';
      } else {

        message = document.getElementById(info.sourceId).innerText
          + ' linked to '
          + document.getElementById(info.targetId).innerText;
        res = true;
      }

      alert(message);
      return false;
    });

    // Before Start Detach event register
    this.jsPlumbInstance.bind('beforeStartDetach', (info) => {
      let res = true;

      if ((info.sourceId === 'box2')) {
        alert('Locked in place!');
        res = false;
      }
      return res;
    });

    // before Drag event register
    this.jsPlumbInstance.bind("beforeDrag", (params) => {
      this.origin = params.sourceId;
      return true;
    });
  }

  add(index: number) {
    const id = 'box' + index.toString();

    this.boxes.push({ name: ('Box ' + (index + 1).toString()) });

    setTimeout(() => {
      this.jsPlumbInstance.draggable(id);
      this.jsPlumbInstance.addEndpoint('box' + index.toString(), { anchor: 'AutoDefault' }, endPointOptions);
    }, 100);
  }

  onMouseUp(event) {
    if (origin !== null) {

      const target = event.srcElement.attributes['id'].value;

      this.jsPlumbInstance.connect({
        source: this.origin,
        target: target,
        anchors: ['AutoDefault', 'AutoDefault'],
        endpoint: ['Dot', { radius: 5 }],
        style: { fill: 'blue' },
        connector: ['Bezier', { curviness: 150 }]
      });

      this.origin = null;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseUp(event) {
    console.log(event);


  }

}
