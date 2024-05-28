import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongiIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoID`)
    }
    return value;
  }
}
