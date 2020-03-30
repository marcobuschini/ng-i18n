import { TestBed } from '@angular/core/testing'

import { TranslateService } from './translate.service'
import { of, BehaviorSubject } from 'rxjs'
import { Culture } from './culture'
import { Translations } from './translations'

describe('TranslateService', () => {
  let service: TranslateService

  const EN_US = require('../test/assets/en_US.js')
  const IT_IT = require('../test/assets/it_IT.js')

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
    translations: of(EN_US),
  } as Translations

  const italianTranslations = {
    culture: italianCulture,
    translations: of(IT_IT),
  } as Translations

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TranslateService)
  })

  it('should translate text with imported functions', () => {
    const params = new Map<string, string>()
    params.set('KEY_1', 'First parameter')
    params.set('KEY_2', 'Second parameter')
    const newParams = []
    params.forEach((value, key) => (newParams[key] = value))
    expect(EN_US.TEST_TRANSLATION_PARAMS(newParams)).toEqual(
      'There are two parameters: First parameter and Second parameter'
    )
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
    const paramSubject = new BehaviorSubject<Map<string, string>>(params)
    service
      .translate('TEST_TRANSLATION_PARAMS', paramSubject)
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
    params.set('KEY_1', 'Primo parametro')
    params.set('KEY_2', 'Secondo parametro')
    const paramSubject = new BehaviorSubject<Map<string, string>>(params)
    service
      .translate('TEST_TRANSLATION_PARAMS', paramSubject.asObservable())
      .subscribe((value: string) => {
        expect(value).toEqual<string>(
          'Ci sono due parametri: Primo parametro e Secondo parametro'
        )
        expect(service.removeCulture(americanCulture)).toEqual(true)
        expect(service.removeCulture(americanCulture)).toEqual(false)
        expect(service.removeCulture(italianCulture)).toEqual(true)
        expect(service.removeCulture(italianCulture)).toEqual(false)
        done()
      })
  })

  it('should translate a string without parameters (en-US)', done => {
    service.addCulture(americanCulture, americanTranslations)
    service.addCulture(italianCulture, italianTranslations)
    service.setCulture(americanCulture)

    service.translate('TEST_TRANSLATION').subscribe((value: string) => {
      expect(value).toEqual<string>('There are no parameters')
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
