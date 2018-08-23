// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

// Model
import { Hero } from './hero';

// Service
import { MessageService } from './message.service';

// Const
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

// Injectableの引数にprovidedInメタデータが書けないのでapp.module.tsのprovidersに書くしか無いみたい
@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';

  /**
   * HeroService's constructor.
   * @param {HttpClient} http
   * @param {MessageService} messageService
   */
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // Logging

  /**
   * HeroServiceのメッセージをMessageServiceを使って記録する．
   * @param {string} message
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // Error handling

  /**
   * 失敗したHTTP操作を処理します．
   * アプリを持続させます．
   *
   * @param {string} operation
   * @param {T} result
   * @returns {(error: any) => Observable<T>}
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する．
      console.error(error);

      // TODO: ユーザへのカイジのためにエラーの変換処理を改善する．
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して，アプリを持続可能にする．
      return of(result as T);
    };
  }

  // CRUD

  /** IDによりヒーローを取得する。idが見つからない場合は`undefined`を返す。（チュートリアル内では未実装） */
  /**
   * GET: サーバーからヒーローを取得する．
   * @param {number} id
   * @returns {Observable<Hero>}
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // {0|1} 要素の配列を返す
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * GET: サーバーからヒーローを取得する．
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(henoes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /**
   * GET: Idによりサーバーからヒーローを取得する．
   * @param {number} id
   * @returns {Observable<Hero>}
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * GET: 検索語を含むヒーローを取得する．
   * @param {string} term
   * @returns {Observable<Hero[]>}
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('serachHeroes', []))
      );
  }

  /**
   * PUT: サーバーのヒーローを更新する．
   * @param {Hero} hero
   * @returns {Observable<any>}
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /**
   * POST: サーバーに新しいヒーローを登録する．
   * @param {Hero} hero
   * @returns {Observable<Hero>}
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * DELETE: サーバーからヒーローを削除する．
   * @param {Hero | number} hero
   * @returns {Observable<Hero>}
   */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof  hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }
}
