import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from './translate.service'
import { Observable, of } from 'rxjs'

/**
 * Asynchronous pipe to translate a string with parameters.
 */
@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private service: TranslateService) {}

  /**
   * Actually applies the pipe generating a translated string with parameters.
   *
   * @param value the translation key
   * @param args the translation key parameters map
   */
  transform(
    value: string,
    args: Observable<Map<string, string>> = of(new Map<string, string>())
  ): Observable<string> {
    return this.service.translate(value, args)
  }
}
