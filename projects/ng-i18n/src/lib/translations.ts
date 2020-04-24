import { Observable } from 'rxjs'

/**
 * Represents a set of translation strings for a given culture.
 */
export class Translations {
  /** The translation strings for the culture. */
  public translations: Observable<
    Map<string, (d: Map<string, string>) => string>
  >
}
