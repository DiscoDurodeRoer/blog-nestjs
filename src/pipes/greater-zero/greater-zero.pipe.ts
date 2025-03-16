import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class GreaterZeroPipe implements PipeTransform {
  transform(value: any) {

    if(isNaN(+value) || +value <= 0){
      return 1;
    }

    return value;
  }
}
