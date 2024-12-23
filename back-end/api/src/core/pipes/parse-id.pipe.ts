import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  constructor(private readonly i18n: I18nCustomService) {}

  transform(value: string, metadata: ArgumentMetadata): number {
    const id = parseInt(value);
    
    if (isNaN(id)) {
      throw new BaseException(
        Errors.BAD_REQUEST(
          this.i18n.t('common-message.validation.invalid_id')
        )
      );
    }
    
    return id;
  }
}