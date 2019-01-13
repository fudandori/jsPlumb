import { Component, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';

const sourcePointOptions = {
  isSource: true,
  maxConnections: -1,
  endpoint: ["Dot", { radius: 5 }],
  paintStyle: { fill: '#03396c' },
  connector: ["Bezier", { curviness: 150 }],
  dropOptions: {
    drop: (e, ui) => {
      alert('Event: connection dropped!');
    }
  }
};

const targetPointOptions = {
  isTarget: true,
  maxConnections: -1,
  endpoint: ["Dot", { radius: 5 }],
  paintStyle: { fill: '#03396c' },
  connector: ["Bezier", { curviness: 150 }],
  dropOptions: {
    drop: (e, ui) => {
      alert('Event: connection dropped!');
    }
  }
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
  rhombi = [{ name: 'Rhom 1' }];

  ngAfterViewInit(): void {

    //Starting positions
    document.getElementById('box0').style.top = '100px'
    document.getElementById('rhombus0').style.top = '100px'

    document.getElementById('box1').style.top = '100px'
    document.getElementById('box1').style.left = '300px'

    document.getElementById('box2').style.top = '100px'
    document.getElementById('box2').style.left = '600px'

    // jsPlumb initialization
    this.jsPlumbInstance = jsPlumb.getInstance();

    // Making elements draggable in bulk
    const drags = document.querySelectorAll('.draggable');
    this.jsPlumbInstance.draggable(drags);

    // Endpoints generation
    const boxes = document.getElementsByClassName('box draggable');
    this.jsPlumbInstance.addEndpoint(boxes, { anchor: 'Top' }, targetPointOptions);
    this.jsPlumbInstance.addEndpoint(boxes, { anchor: 'Bottom' }, sourcePointOptions);

    this.jsPlumbInstance.addEndpoint('rhombus0', { anchors: 'Left' }, sourcePointOptions);
    this.jsPlumbInstance.addEndpoint('rhombus0', { anchors: 'Right' }, sourcePointOptions);
    this.jsPlumbInstance.addEndpoint('rhombus0', { anchor: 'Top' }, targetPointOptions);

    // Before drop event register
    this.jsPlumbInstance.bind('beforeDrop', (info) => {
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
      return res;
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
  }

  addBox(index: number) {
    const id = 'box' + index.toString();

    this.boxes.push({ name: ('Box ' + (index + 1).toString()) });

    setTimeout(() => {
      this.jsPlumbInstance.draggable(id);
      this.jsPlumbInstance.addEndpoint(id, { anchor: 'Top' }, targetPointOptions);
      this.jsPlumbInstance.addEndpoint(id, { anchor: 'Bottom' }, sourcePointOptions);
    }, 100);
  }

  addRhombus(index: number) {
    const id = 'rhombus' + index.toString();

    this.rhombi.push({ name: ('Rhom ' + (index + 1).toString()) });

    setTimeout(() => {
      this.jsPlumbInstance.draggable(id);
      this.jsPlumbInstance.addEndpoint(id, { anchor: 'Right' }, sourcePointOptions);
      this.jsPlumbInstance.addEndpoint(id, { anchor: 'Left' }, sourcePointOptions);
      this.jsPlumbInstance.addEndpoint(id, { anchor: 'Top' }, targetPointOptions);
    }, 100);
  }
}
