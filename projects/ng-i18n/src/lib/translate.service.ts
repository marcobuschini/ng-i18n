import { Injectable } from '@angular/core'
import { ReplaySubject, Observable, of, combineLatest } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'
import { Culture } from './culture'
import { Translations } from './translations'

/**
 * This service is at the core of the package. It programmatically performs all operations
 * related to translations: adding and removing of cultures, defines current culture,
 * translate strings.
 *
 * This is used by all other components of this package.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  /** The subject that holds the selected culture. */
  private cultureSubject = new ReplaySubject<Culture>(1)
  /** The subject that holds the translations for the selected language. */
  private translationsSubject = new ReplaySubject<Translations>(1)
  /** The current list of available translations. */
  private availableTranslations = new Map<Culture, Translations>()
  /** The subject that holds the list of available translations. */
  private availableTranslationsSubject = new ReplaySubject<
    Map<Culture, Translations>
  >(1)

  /**
   * Adds a new culture to the list of available translations. At present the tranlsations
   * are loaded at initialization time. This is temporary as in the future translations
   * are required to be loaded from an HTTP or FS souce.
   *
   * @param culture the culture to add
   * @param translations the culture's translations
   */
  public addCulture(culture: Culture, translations: Translations) {
    this.availableTranslations.set(culture, translations)
    this.availableTranslationsSubject.next(this.availableTranslations)
  }

  /**
   * Removes a given culture from the list of available cultures.
   *
   * @param culture the culture to remove
   *
   * @returns `true` if the culture has been removed, `false` if the culture was not present
   */
  public removeCulture(culture: Culture): boolean {
    if (this.availableTranslations.delete(culture)) {
      this.availableTranslationsSubject.next(this.availableTranslations)
      return true
    } else {
      return false
    }
  }

  /**
   * Gets an Observable with the list of all available cultures.
   */
  public getAvailableCultures(): Observable<IterableIterator<Culture>> {
    return this.availableTranslationsSubject.pipe(
      map(translation => translation.keys())
    )
  }

  /**
   * Gets an Observable with the currently selected culture.
   */
  public getCulture(): Observable<Culture> {
    return this.cultureSubject.asObservable()
  }

  /**
   * Sets the current culture.
   *
   * @param culture the new culture
   */
  public setCulture(culture: Culture) {
    this.cultureSubject.next(culture)
    this.translationsSubject.next(this.availableTranslations.get(culture))
  }

  /**
   * Creates a translated string observable. It will change its value when
   * either the selected language, or the parameters, change.
   *
   * @param key the key to translate
   * @param parameters the parameters to use in translating the string
   */
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
        params?.forEach((value, name) => {
          format = format + name + ': ' + value + ', '
        })
        return translations.get(key) + (params ? ' [' + format + ']' : '')
      })
    )
  }
}
