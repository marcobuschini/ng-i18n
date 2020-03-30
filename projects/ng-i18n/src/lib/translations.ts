import { Culture } from './culture'
import { Observable } from 'rxjs'

/**
 * Represents a set of translation strings for a given culture.
 */
export class Translations {
  /** The culture these translation strings refer to. */
  public culture: Culture
  /** The translation strings for the culture. */
  public translations: Observable<
    Map<string, (d: Map<string, string>) => string>
  >
}
