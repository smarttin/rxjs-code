import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum RxjsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let rxjsLoggingLevel = RxjsLoggingLevel.INFO;

export function setRxjsLoggingLevel(level: RxjsLoggingLevel) {
  rxjsLoggingLevel = level;
}

export const debug = (level: number, message: string) => (source: Observable<any>) => source.pipe(
  tap(val => {
    if (level >= rxjsLoggingLevel) {
      console.log(message + ': ', val);
    }
  })
);

