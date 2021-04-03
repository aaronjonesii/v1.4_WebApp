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

  public showError(error: any, errorFrom: string) {
    if (error.status === 0) {
      // TODO: Navigate to error page
      this.showToast('Sorry we are having trouble connecting to the server, try again later...', 'Unable to connect to the server', 'danger', 7000)
    } else {
      this.showToast(`${JSON.stringify(error)}`, `Error From ${errorFrom}`, 'danger', 0)
    }
  }

}
