import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateDirective } from './translate.directive'
import { TranslatePipe } from './translate.pipe'

@NgModule({
  declarations: [TranslateDirective, TranslatePipe],
  exports: [TranslateDirective, TranslatePipe],
  imports: [CommonModule],
})
export class NgI18nModule {}
