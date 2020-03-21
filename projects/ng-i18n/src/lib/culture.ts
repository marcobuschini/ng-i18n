/**
 * Represent a culture in the package. A culture is defined by a code, and a name.
 */
export class Culture {
  /**
   * The code is an ISO 639-1 language code follower by an underscore (`_`) followed by
   * an ISO 3166-1 alpha-2 code. For example `en_US` or `it_IT`.
   */
  public isoCode: string
  /**
   * The name of the culture in its own culture. For example `English (United States)`
   * or `Italiano (Italia)`.
   */
  public name: string
}
