import { Injectable } from '@angular/core'
import { ReplaySubject, Observable, of, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { Culture } from './culture'
import { Translations } from './translations'

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private cultureSubject = new ReplaySubject<Culture>(1)
  private translationsSubject = new ReplaySubject<Translations>(1)
  private availableTranslations = new Map<Culture, Translations>()
  private availableTranslationsSubject = new ReplaySubject<
    Map<Culture, Translations>
  >(1)

  constructor() {}

  public addCulture(culture: Culture, translations: Translations) {
    this.availableTranslations.set(culture, translations)
    this.availableTranslationsSubject.next(this.availableTranslations)
  }

  public removeCulture(culture: Culture): boolean {
    if (this.availableTranslations.delete(culture)) {
      this.availableTranslationsSubject.next(this.availableTranslations)
      return true
    } else {
      return false
    }
  }

  public getAvailableCultures(): Observable<Map<Culture, Translations>> {
    return this.availableTranslationsSubject.asObservable()
  }

  public getCulture(): Observable<Culture> {
    return this.cultureSubject.asObservable()
  }

  public setCulture(culture: Culture) {
    this.cultureSubject.next(culture)
    this.translationsSubject.next(this.availableTranslations.get(culture))
  }

  public translate(
    key: string,
    parameters: Observable<Map<string, string>> = of(null)
  ): Observable<string> {
    return combineLatest([parameters, this.translationsSubject]).pipe(
      map(([params, translations]) => {
        let format = ''
        params.forEach((value, name) => {
          format = format + name + ': ' + value + ', '
        })
        return translations.translations.get(key) + ' [' + format + ']'
      })
    )
  }
}
