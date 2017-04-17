import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
    this.api.getTree()
      .subscribe(res => {
        console.log(res);
        if (res !== undefined) {
          this.nodes = res;
        }
      },
      error => {
        
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

    this.api.sendTree(this.nodes)
      .subscribe(res => {
        console.log(res);
      }, error => {
        console.error(error);
      });

    // clear input object
    this.input.name = '';
    this.input.rangeLo = null;
    this.input.rangeHi = null;
    this.input.amt = null;
  }

  public test() {
    console.log(this.nodes);
  }
}
