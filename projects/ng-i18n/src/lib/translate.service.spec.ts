import { TestBed } from '@angular/core/testing'

import { TranslateService } from './translate.service'
import { BehaviorSubject, of, ReplaySubject } from 'rxjs'
import { Culture } from './culture'
import { Translations } from './translations'

describe('TranslateService', () => {
  let service: TranslateService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TranslateService)
  })

  it('should create an instance', () => {
    expect(service).toBeTruthy()
  })

  it('should load translations and translate a string', done => {
    const english = new Map<string, string>()
    english.set(
      'TEST_TRANSLATION',
      'There are two parameters: {KEY_1} and {KEY_2}'
    )

    const americanCulture = {
      isoCode: 'en_US',
      name: 'English (United States)',
    } as Culture
    const translations = {
      culture: americanCulture,
      translations: english,
    } as Translations
    service.addCulture(americanCulture, translations)
    service.setCulture(americanCulture)

    const params = new Map<string, string>()
    params.set('KEY_1', 'First parameter')
    params.set('KEY_2', 'Second parameter')
    const paramSubject = new ReplaySubject<Map<string, string>>(1)
    paramSubject.next(params)
    service
      .translate('TEST_TRANSLATION', paramSubject.asObservable())
      .subscribe(value => {
        expect(value).toEqual(
          'There are two parameters: {KEY_1} and {KEY_2} [KEY_1: First parameter, KEY_2: Second parameter, ]'
        )
        done()
      })
  })
})
