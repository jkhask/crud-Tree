import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  socket = io();
  nodes: any;
  input = {
    name: '',
    rangeLo: null,
    rangeHi: null,
    amt: null,
  };

  constructor(
    private snackBar: MdSnackBar,
    private dialog: MdDialog,
    private api: ApiService) {}

  ngOnInit() {
    this.nodes = [];
    this.getTree();
    this.socket.on('update', (data) => {
      this.getTree();
    });
  }

  getTree() {
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

  addNode() {
    let newNode = {
      id: UUID.UUID(),
      name: this.input.name,
      rangeLo: this.input.rangeLo,
      rangeHi: this.input.rangeHi,
      amt: this.input.amt,
      numbers: []
    };
    for (let i = 0; i < this.input.amt; i++) {
      newNode.numbers.push(Math.floor(Math.random() *
        (this.input.rangeHi - this.input.rangeLo + 1) + this.input.rangeLo));
    }

    this.api.sendNode(newNode)
      .subscribe(res => {
        this.snackBar.open('Node added.', 'OK', {duration: 2500});
      }, error => {
        this.snackBar.open('Failure to add node.', 'OK', {duration: 2500});
      });

    // clear input object
    this.input.name = '';
    this.input.rangeLo = null;
    this.input.rangeHi = null;
    this.input.amt = null;
  }

  deleteNode(id) {
    this.api.deleteNode(id)
      .subscribe(res => {
        // noop
      }, error => {
        console.error(error);
      });
  }

  editNode(node) {
    const dialogRef = this.dialog.open(EditModalComponent);
    dialogRef.componentInstance.node = node;
    dialogRef.afterClosed().subscribe(editedNode => {
      if (editedNode !== undefined) {
        // check if we need to re-generate children
        if (editedNode.rangeLo !== node.rangeLo
          || editedNode.rangeHi !== node.rangeHi
          || editedNode.amt !== node.amt) {
            editedNode.numbers = [];
            for (let i = 0; i < editedNode.amt; i++) {
              editedNode.numbers.push(Math.floor(Math.random() *
                (editedNode.rangeHi - editedNode.rangeLo + 1) + editedNode.rangeLo));
            }
        }
        this.api.editNode(editedNode)
          .subscribe(res => {
            console.log(res);
            this.snackBar.open('Edited.', 'OK', {duration: 2500});
          }, error => {
            this.snackBar.open('Failure to edit node.', 'OK', {duration: 2500});
          });
      }
    });
  }

  test() {
    console.log(this.nodes);
  }

}

@Component({
  selector: 'edit-modal',
  template: `
    <h1 md-dialog-title>Edit {{node.name}}</h1>
    <div md-dialog-content>
      <md-input-container>
        <input mdInput placeholder="Name" [(ngModel)]="editedNode.name">
      </md-input-container>
      <md-input-container>
        <input mdInput type="number" placeholder="Low Range" [(ngModel)]="editedNode.rangeLo">
      </md-input-container>
      <md-input-container>
        <input mdInput type="number" placeholder="High Range" [(ngModel)]="editedNode.rangeHi">
      </md-input-container>
      <md-input-container>
        <input mdInput type="number" placeholder="Amount of Items to Create" [(ngModel)]="editedNode.amt">
      </md-input-container>
    </div>
    <div md-dialog-actions>
      <button md-button (click)="dialogRef.close(editedNode)">EDIT</button>
    </div>
  `,
})
export class EditModalComponent {
  node: any;
  editedNode: any;

  constructor(public dialogRef: MdDialogRef<EditModalComponent>) {
    this.editedNode = {
      id: this.node.id,
      name: this.node.name,
      rangeLo: this.node.rangeLo,
      rangeHi: this.node.rangeHi,
      amt: this.node.amt,
      numbers: []
    };
  }

}
