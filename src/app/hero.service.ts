import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

// Injectableの引数にprovidedInメタデータが書けないのでapp.module.tsのprovidersに書くしか無いみたい
@Injectable()
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes.
    this.messageService.add('HeroService: fetched heroes');
    // 非同期処理
    return of(HEROES);
  }
}
