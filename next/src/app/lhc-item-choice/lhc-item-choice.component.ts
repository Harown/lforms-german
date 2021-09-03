import { Component, Input, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lhc-item-choice',
  templateUrl: './lhc-item-choice.component.html',
  styleUrls: ['./lhc-item-choice.component.css'],
  encapsulation: ViewEncapsulation.Emulated //None/ShadowDom/Emulated
})
export class LhcItemChoiceComponent implements OnInit, OnChanges {

  @Input() item;

  constructor() {
  }


  ngOnInit(): void {
    // console.log("in lhc-item-choice")
    // console.log(this.item);
  }

  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

  }

}
