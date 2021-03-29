import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { Location } from "@angular/common";

@Injectable()
export class ExtrasService {

  constructor(
    private toastrService: NbToastrService,
    private location: Location,
  ) { }

  public showToast(message: string, title: string, status: string) {
    this.toastrService.show(message, title, { status: status, limit: 5, position: NbGlobalPhysicalPosition.TOP_RIGHT });
  }

  public goBack() { this.location.back(); }

}
