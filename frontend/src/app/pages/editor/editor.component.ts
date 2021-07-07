import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as CKEDITOR from "../../shared/utils/Editors/CustomEditorSuperBuild/ckeditor";
import * as CKEditorInspector from "../../shared/utils/Editors/CKEditor5Inspector/inspector";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";

@Component({
  selector: 'anon-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild("custom_editor") custom_editor: any;
  @ViewChild("read_only_custom_editor") read_only_custom_editor: any;
  @Input() disable_editing = true;
  @Input() story: any;
  @Input() config: any;
  @Input() ready: any;
  @Output() readyChange = new EventEmitter<any>();
  @Output() editorChange = new EventEmitter<ChangeEvent>();
  CustomEditor = CKEDITOR.CustomBalloonEditor;
  ReadOnlyCustomEditor = CKEDITOR.ReadOnlyCustomBalloonEditor;

  constructor() { }

  ngOnInit(): void {
    // setTimeout(() => console.log(CKEditorInspector), 4000)
  }

  onReady(ready_event: any) {this.readyChange.emit(ready_event)}
  onChange(change_event: ChangeEvent) {this.editorChange.emit(change_event)}

  inspectEditor(editor_name: string, editor: any) {
    CKEditorInspector.attachToAll({});
  }

}
