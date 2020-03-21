import { Culture } from './culture'
import { Observable } from 'rxjs'

export class Translations {
  public culture: Culture
  public translations: Observable<Map<string, string>>
}
