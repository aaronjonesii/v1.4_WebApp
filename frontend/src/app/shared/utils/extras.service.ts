import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";

@Injectable()
export class ExtrasService {

  constructor(
    private toastrService: NbToastrService,
  ) { }

  showToast(message: string, title: string, status: string) {
    this.toastrService.show(message, title, { status: status, limit: 5, position: NbGlobalPhysicalPosition.TOP_RIGHT });
  }

}
