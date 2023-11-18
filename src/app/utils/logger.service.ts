import { Injectable } from '@angular/core'

export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() {}

  logLevel = LogLevel.Info

  info(message: string,  param: any, file: string = ''): void {
    this.logWith(LogLevel.Info, message, param, file)
  }

  warn(message: string,  param: any, file: string = ''): void {
    this.logWith(LogLevel.Warn, message, param, file)
  }

  error(message: string,  param: any, file: string = ''): void {
    this.logWith(LogLevel.Error, message, param, file)
  }

  private logWith(level: LogLevel, message: string, param: any, file: string): void {
    if (level <= this.logLevel) {
      switch (level) {
        case LogLevel.Error:
          return console.error('%c ' + file + '--' + message, `color: red`, param)
        case LogLevel.Warn:
          return console.warn('%c ' + file + '--' + message, `color: orange`, param)
        case LogLevel.Info:
          return console.info('%c ' + file + '--' + message, `color: green`, param)
      }
    }
  }



}

