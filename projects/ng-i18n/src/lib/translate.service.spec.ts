import { TestBed } from '@angular/core/testing'

import { TranslateService } from './translate.service'
import { of, ReplaySubject } from 'rxjs'
import { Culture } from './culture'
import { Translations } from './translations'

describe('TranslateService', () => {
  let service: TranslateService
  const english = new Map<string, string>()
  english.set(
    'TEST_TRANSLATION_PARAMS',
    'There are two parameters: {KEY_1} and {KEY_2}'
  )
  english.set('TEST_TRANSLATION', 'There are no parameters')

  const americanCulture = {
    isoCode: 'en_US',
    name: 'English (United States)',
  } as Culture
  const translations = {
    culture: americanCulture,
    translations: of(english),
  } as Translations

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TranslateService)
  })

  it('should create an instance', () => {
    expect(service).toBeTruthy()
  })

  it('should add a culture', () => {
    service.addCulture(americanCulture, translations)
    service.setCulture(americanCulture)

    expect(service.getCulture().toPromise()).resolves.toBe(americanCulture)
    expect(service.getAvailableCultures().toPromise()).resolves.toBe([
      americanCulture,
    ])
  })

  it('should translate a string with parameters', done => {
    service.addCulture(americanCulture, translations)
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
          'There are two parameters: {KEY_1} and {KEY_2} [KEY_1: First parameter, KEY_2: Second parameter, ]'
        )
        expect(service.removeCulture(americanCulture)).toEqual(true)
        expect(service.removeCulture(americanCulture)).toEqual(false)
        done()
      })
  })

  it('should translate a string without parameters', done => {
    service.addCulture(americanCulture, translations)
    service.setCulture(americanCulture)

    service.translate('TEST_TRANSLATION').subscribe((value: string) => {
      expect(value).toEqual<string>('There are no parameters')
      expect(service.removeCulture(americanCulture)).toEqual(true)
      expect(service.removeCulture(americanCulture)).toEqual(false)
      done()
    })
  })
})
