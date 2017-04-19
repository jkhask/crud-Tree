import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import * as io from 'socket.io-client';

/**
 * Main App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  socket = io();

  nodes = [];
  input = {
    id: null,
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
    this.getTree();
    this.socket.on('update', (data) => {
      this.getTree();
    });
  }

  /**
   * getTree() - Get the whole tree from the server
   */
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

  /**
   * addNode() - Attempts to create new node from user input
   * and send it to the server
   */
  addNode() {
    const newNode = {
      id: UUID.UUID(),
      name: this.input.name,
      rangeLo: this.input.rangeLo,
      rangeHi: this.input.rangeHi,
      amt: this.input.amt,
      numbers: []
    };

    // Validation checks
    if (!this.isValid(newNode)) {
      return;
    }

    for (let i = 0; i < this.input.amt; i++) {
      newNode.numbers.push(Math.floor(Math.random() *
        (this.input.rangeHi - this.input.rangeLo + 1) + this.input.rangeLo));
    }

    this.api.sendNode(newNode)
      .subscribe(res => {
        this.snackBar.open('Node added.', 'OK', {duration: 3000});
      }, error => {
        this.snackBar.open('Failure to add node.', 'OK', {duration: 3000});
      });

    // clear input object
    this.input.name = '';
    this.input.rangeLo = null;
    this.input.rangeHi = null;
    this.input.amt = null;
  }

  /**
   * deleteNode(id) - Asks the server to delete a node
   * @param id - The id of the node to delete
   */
  deleteNode(id) {
    this.api.deleteNode(id)
      .subscribe(res => {
      }, error => {
        console.error(error);
      });
  }

  /**
   * editNode(node) - Edits a node then submits change to server
   * @param node - The node to edit
   */
  editNode(node) {
    // would ideally use another common service to transfer node
    // between components, but just using the api for now
    this.api.changeNode = node;
    const dialogRef = this.dialog.open(EditModalComponent);
    dialogRef.afterClosed().subscribe(editedNode => {
      if (editedNode !== undefined) {
        // Validation checks
        if (!this.isValid(editedNode)) {
          return;
        }
        // check if we need to re-generate children
        if (editedNode.rangeLo !== node.rangeLo ||
        editedNode.rangeHi !== node.rangeHi ||
        editedNode.amt !== node.amt) {
            editedNode.numbers = [];
            for (let i = 0; i < editedNode.amt; i++) {
              editedNode.numbers.push(Math.floor(Math.random() *
                (editedNode.rangeHi - editedNode.rangeLo + 1) + editedNode.rangeLo));
            }
        }
        this.api.editNode(editedNode)
          .subscribe(res => {
            this.snackBar.open('Edited.', 'OK', {duration: 3000});
          }, error => {
            this.snackBar.open('Failure to edit node.', 'OK', {duration: 3000});
          });
      }
    });
  }

  /**
   * isValid(node) - Helper function that determines if node is valid
   * @param node - The node to check
   */
  isValid(node): boolean {
    if (node.name.length === 0) {
      this.snackBar.open('Please give the node a name.', 'OK', {duration: 3000});
      return false;
    }
    if (node.amt > 15) {
      this.snackBar.open('There is a maximum of 15 items per node.', 'OK', {duration: 3000});
      return false;
    }
    if (node.rangeLo > node.rangeHi) {
      this.snackBar.open('High range must be greater than low range.', 'OK', {duration: 3000});
      return false;
    }
    if (!Number.isInteger(node.rangeLo) ||
    !Number.isInteger(node.rangeHi) ||
    !Number.isInteger(node.amt)) {
      this.snackBar.open('Please enter valid numbers.', 'OK', {duration: 3000});
      return false;
    }
    return true;
  }
}

/**
 * Modal Component
 */
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

  constructor(
  public dialogRef: MdDialogRef<EditModalComponent>,
  private api: ApiService) {
      this.node = this.api.changeNode;
      this.editedNode = {
        id: this.node.id,
        name: this.node.name,
        rangeLo: this.node.rangeLo,
        rangeHi: this.node.rangeHi,
        amt: this.node.amt,
        numbers: this.node.numbers
      };
  }

}
