import { TranslatePipe } from './translate.pipe'
import { TestBed } from '@angular/core/testing'
import { TranslateService } from './translate.service'
import { Culture } from './culture'
import { Translations } from './translations'
import { of, ReplaySubject } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { ChangeDetectorRef } from '@angular/core'

describe('TranslatePipe', () => {
  let pipe: TranslatePipe
  let service: TranslateService
  let async: AsyncPipe

  const EN_US = require('../test/assets/en_US.js')

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsyncPipe, TranslateService, ChangeDetectorRef],
    })
    service = TestBed.inject(TranslateService)
    async = TestBed.inject(AsyncPipe)
    pipe = new TranslatePipe(service, async)
  })

  it('should create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should load translations and translate a string', () => {
    const americanCulture = {
      isoCode: 'en-US',
      name: 'English (United States)',
    } as Culture

    const translations = {
      culture: americanCulture,
      translations: of(EN_US),
    } as Translations
    service.addCulture(americanCulture, translations)
    service.setCulture(americanCulture)

    const params = new Map<string, string>()
    params.set('KEY_1', 'First parameter')
    params.set('KEY_2', 'Second parameter')
    const paramSubject = new ReplaySubject<Map<string, string>>(1)
    paramSubject.next(params)
    expect(
      pipe.transform('TEST_TRANSLATION', paramSubject.asObservable())
    ).toEqual<string>('There are no parameters')
    service.removeCulture(americanCulture)
  })
})
