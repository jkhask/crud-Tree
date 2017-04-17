import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { ApiService } from './api.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private socket = io();

  private nodes: any;
  private input = {
    name: '',
    rangeLo: null,
    rangeHi: null,
    amt: null,
  };

  constructor(
    private snackBar: MdSnackBar,
    private api: ApiService) {}

  public ngOnInit() {
    this.nodes = [];
    this.getTree();
    this.socket.on('update', (data) => {
      console.log('doot');
      this.getTree();
    });
  }

  public getTree() {
    this.api.getTree()
      .subscribe(res => {
        if (res !== undefined) {
          this.nodes = res;
        }
      },
      error => {
        console.error('Error requesting for tree');
      });
  }

  public addNode() {
    // invoke service to add to mongodb
    // retrieve new node structure from server
    let newNode = {
      id: UUID.UUID(),
      name: this.input.name,
      rangeLo: this.input.rangeLo,
      rangeHi: this.input.rangeHi,
      numbers: []
    };
    for (let i = 0; i < this.input.amt; i++) {
      newNode.numbers.push(Math.floor(Math.random() * (this.input.rangeHi - this.input.rangeLo + 1) + this.input.rangeLo));
    }

    this.snackBar.open('Node added.', 'OK', {duration: 2500});

    this.nodes.push(newNode);

    this.api.sendNode(newNode)
      .subscribe(res => {
      }, error => {
        console.error(error);
      });

    // clear input object
    this.input.name = '';
    this.input.rangeLo = null;
    this.input.rangeHi = null;
    this.input.amt = null;
  }

  public deleteNode(id) {
    this.api.deleteNode(id)
      .subscribe(res => {
        // noop
      }, error => {
        console.error(error);
      });
  }

  public test() {
    console.log(this.nodes);
  }


  getInfo() {
    let observable = new Observable(observer => {
      this.socket = io('http://localhost:3000');
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }  
}
