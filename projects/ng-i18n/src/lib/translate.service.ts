import { Injectable } from '@angular/core'
import { ReplaySubject, Observable, of, combineLatest } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'
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

  public getAvailableCultures(): Observable<IterableIterator<Culture>> {
    return this.availableTranslationsSubject.pipe(
      map(translation => translation.keys())
    )
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
    return combineLatest([
      parameters,
      this.translationsSubject.pipe(flatMap(t => t.translations)),
    ]).pipe(
      map(([params, translations]): string => {
        let format = ''
        params.forEach((value, name) => {
          format = format + name + ': ' + value + ', '
        })
        return translations.get(key) + ' [' + format + ']'
      })
    )
  }
}
