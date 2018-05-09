import {FormControl, FormGroup, Validators} from '@angular/forms';

export namespace Pagination {
  export interface Search {
    text: string;
  }
  export interface PerPageOption {
    value: number;
  }
  export const PerPageOptions = <PerPageOption[]> [
    {value: 5},
    {value: 10},
    {value: 25},
    {value: 50},
    {value: 100},
  ];
  export function newSearchForm(data?: Search): FormGroup {
    const form = new FormGroup({
      text: new FormControl('', [Validators.required])
    });
    if (data) {
      form.patchValue(data);
    }
    return form;
  }


}
