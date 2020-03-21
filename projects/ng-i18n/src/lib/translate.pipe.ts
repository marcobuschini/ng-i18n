import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core'
import { TranslateService } from './translate.service'
import { Observable } from 'rxjs'
import { AsyncPipe } from '@angular/common'

/**
 * Asynchronous pipe to translate a string with parameters.
 */
@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(
    private service: TranslateService,
    private asyncPipe: AsyncPipe
  ) {}

  /**
   * Actually applies the pipe generating a translated string with parameters.
   *
   * @param value the translation key
   * @param args the translation key parameters map
   */
  transform(value: string, args: Observable<Map<string, string>>): string {
    return this.asyncPipe.transform(this.service.translate(value, args))
  }
}
