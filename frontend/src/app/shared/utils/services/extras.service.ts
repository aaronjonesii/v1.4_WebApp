import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { Location } from "@angular/common";

@Injectable()
export class ExtrasService {

  constructor(
    private toastrService: NbToastrService,
    private location: Location,
  ) { }

  public showToast(message:string, title:string, status:string='danger', duration:number=3000) {
    this.toastrService.show(
      message,
      title,
      {
        status: status,
        limit: 3,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: duration,
      }
    );
  }

  // TODO: change to router.navigatebyURL instead so toastr's can be seen
  public goBack() { this.location.back(); }

}
