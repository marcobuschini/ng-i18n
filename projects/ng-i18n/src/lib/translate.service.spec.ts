import { TestBed } from '@angular/core/testing'

import { TranslateService } from './translate.service'
import { of, ReplaySubject } from 'rxjs'
import { Culture } from './culture'
import { Translations } from './translations'

describe('TranslateService', () => {
  function strMapToObj(strMap): object {
    const obj = Object.create(null)
    for (const [k, v] of strMap) {
      obj[k] = v
    }
    return obj
  }

  function objToStrMap(obj): Map<string, string> {
    const strMap = new Map()
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k])
    }
    return strMap
  }

  function strMapToJson(strMap): string {
    return JSON.stringify(strMapToObj(strMap))
  }

  function jsonToStrMap(jsonStr): Map<string, string> {
    return objToStrMap(JSON.parse(jsonStr))
  }

  let service: TranslateService

  const english = jsonToStrMap(
    '{\
    "TEST_TRANSLATION_PARAMS": "There are two parameters: {KEY_1} and {KEY_2}",\
    "TEST_TRANSLATION": "There are no parameters"\
  }'
  )

  const italian = jsonToStrMap(
    '{\
    "TEST_TRANSLATION_PARAMS": "Ci sono due parametri: {KEY_1} e {KEY_2}",\
    "TEST_TRANSLATION": "Non ci sono parametri"\
  }'
  )

  const americanCulture = {
    isoCode: 'en-US',
    name: 'English (United States)',
  } as Culture

  const italianCulture = {
    isoCode: 'it-IT',
    name: 'Italian (Italy)',
  } as Culture

  const americanTranslations = {
    culture: americanCulture,
    translations: of(english),
  } as Translations

  const italianTranslations = {
    culture: italianCulture,
    translations: of(italian),
  } as Translations

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TranslateService)
  })

  it('should create an instance', () => {
    expect(service).toBeTruthy()
  })

  it('should add a culture', () => {
    service.addCulture(americanCulture, americanTranslations)
    service.setCulture(americanCulture)

    expect(service.getCulture().toPromise()).resolves.toBe(americanCulture)
    expect(service.getAvailableCultures().toPromise()).resolves.toBe([
      americanCulture,
    ])
  })

  it('should translate a string with parameters (en-US)', done => {
    service.addCulture(americanCulture, americanTranslations)
    service.setCulture(americanCulture)

    const params = new Map<string, string>()
    params.set('KEY_1', 'First parameter')
    params.set('KEY_2', 'Second parameter')
    const paramSubject = new ReplaySubject<Map<string, string>>(1)
    paramSubject.next(params)
    service
      .translate('TEST_TRANSLATION_PARAMS', paramSubject.asObservable())
      .subscribe((value: string) => {
        expect(value).toEqual<string>(
          'There are two parameters: First parameter and Second parameter'
        )
        expect(service.removeCulture(americanCulture)).toEqual(true)
        expect(service.removeCulture(americanCulture)).toEqual(false)
        done()
      })
  })

  it('should translate a string with parameters (it-IT)', done => {
    service.addCulture(americanCulture, americanTranslations)
    service.addCulture(italianCulture, italianTranslations)
    service.setCulture(italianCulture)

    const params = new Map<string, string>()
    params.set('KEY_1', 'First parameter')
    params.set('KEY_2', 'Second parameter')
    const paramSubject = new ReplaySubject<Map<string, string>>(1)
    paramSubject.next(params)
    service
      .translate('TEST_TRANSLATION_PARAMS', paramSubject.asObservable())
      .subscribe((value: string) => {
        expect(value).toEqual<string>(
          'Ci sono due parametri: First parameter e Second parameter'
        )
        expect(service.removeCulture(americanCulture)).toEqual(true)
        expect(service.removeCulture(americanCulture)).toEqual(false)
        expect(service.removeCulture(italianCulture)).toEqual(true)
        expect(service.removeCulture(italianCulture)).toEqual(false)
        done()
      })
  })

  it('should translate a string without parameters (it-IT)', done => {
    service.addCulture(americanCulture, americanTranslations)
    service.addCulture(italianCulture, italianTranslations)
    service.setCulture(italianCulture)

    service.translate('TEST_TRANSLATION').subscribe((value: string) => {
      expect(value).toEqual<string>('Non ci sono parametri')
      expect(service.removeCulture(americanCulture)).toEqual(true)
      expect(service.removeCulture(americanCulture)).toEqual(false)
      expect(service.removeCulture(italianCulture)).toEqual(true)
      expect(service.removeCulture(italianCulture)).toEqual(false)
      done()
    })
  })
})
