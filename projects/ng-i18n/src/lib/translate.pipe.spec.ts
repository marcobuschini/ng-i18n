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
    const english = jsonToStrMap(
      '{\
      "TEST_TRANSLATION_PARAMS": "There are two parameters: {KEY_1} and {KEY_2}",\
      "TEST_TRANSLATION": "There are no parameters"\
    }'
    )

    const americanCulture = {
      isoCode: 'en-US',
      name: 'English (United States)',
    } as Culture

    const translations = {
      culture: americanCulture,
      translations: of(english),
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
