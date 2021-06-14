import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as BalloonEditor from "../../shared/utils/CustomBalloonEditor/ckeditor";

@Component({
  selector: 'anon-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild("ckeditor") ckeditor: any;
  @Input() story: any;
  @Input() disable_editing = true;
  public Editor = BalloonEditor;

  constructor() { }

  ngOnInit(): void {}

  onReady( editor: any ) {
    // console.log(editor);
  }

}
