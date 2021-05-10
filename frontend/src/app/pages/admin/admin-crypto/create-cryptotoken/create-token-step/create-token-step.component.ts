import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-create-token-step',
  templateUrl: './create-token-step.component.html',
  styleUrls: ['./create-token-step.component.scss']
})
export class CreateTokenStepComponent implements OnInit {
  @Input() step_title: string = '';
  @Input() step_section: any;
  @Input() token: any;


  constructor() { }

  ngOnInit(): void {}

}
