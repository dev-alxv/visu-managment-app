import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public localStorage: any;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  public set(key: string, value: any): void {
    this.localStorage[key] = JSON.stringify(value);
  }

  public get(key: string): any {
    let returnValue = null;
    try {
      returnValue = JSON.parse(this.localStorage[key]);
    } catch (error) {
      returnValue = this.localStorage[key] || null;
    }
    return returnValue;
  }

  public remove(key: string): void {
    this.localStorage.removeItem(key);
  }

  public setObject(key: string, value: any): void {
    this.set(key, JSON.stringify(value));
  }

  public getObject(key: string): any {
    const value = this.get(key);
    return value && JSON.parse(value);
  }

}
