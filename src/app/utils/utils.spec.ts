import {
  compareArraysIgnoreOrder,
  deepCopy,
  doAsyncTask,
  isDefined,
  MockDirective,
  parseDate
} from "src/app/utils/utils";
import {Observable} from "rxjs";
import {Component, Directive} from "@angular/core";
import {LoginComponent} from "src/app/presentation/modules/login/login.component";

describe('Utils', () => {
  it('function isDefined should work correctly', () => {
    const firstResult = isDefined(5)
    const secondResult = isDefined(undefined)
    expect(firstResult).toBeTruthy()
    expect(secondResult).toBeFalsy()
  });

  it('function doAsyncTask should work correctly', () => {
    const result: Observable<string> = doAsyncTask(3000)
    expect(result).toBeTruthy()
  });

  it('function parseDate should work correctly', () => {
    const result = parseDate('Mon Nov 21 2022 18:30:55 GMT+0300 (Москва, стандартное время)')
    expect(result).toBe('21.11.2022, 18:30')
  });

  it('function compareArraysIgnoreOrder should work correctly', () => {
    const arr1 = [undefined, 'London', 57]
    const arr2 = [undefined, 57, 'London']

    const result1 = compareArraysIgnoreOrder(arr1, arr2)

    expect(result1).toBeTruthy()

    const arr3 = ['Paris', 123, 'Bobi']
    const arr4 = ['Paris', 456, 'Bobi']

    const result2 = compareArraysIgnoreOrder(arr3, arr4)

    expect(result2).toBeFalsy()

    const arr5 = [1, 'Tokyo', 222]
    const arr6 = [1, 'Tokyo', 222, 'Audi']

    const result3 = compareArraysIgnoreOrder(arr5, arr6)

    expect(result3).toBeFalsy()
  });

  it('function deepCopy should work correctly', () => {
    type ObjType = {
      name: string
      age: number
      address: {
        city: string
        street: string
      }
    }
    const obj: ObjType = {
      name: 'Bobi',
      age: 50,
      address: {
        city: 'London',
        street: 'Madison square'
      }
    }

    const newObj: ObjType = deepCopy(obj)

    expect(obj.address !== newObj.address).toBeTruthy()
    expect(obj).toEqual(newObj)
  });

  it('function MockDirective should work correctly ', () => {
    const result: Directive = MockDirective(LoginComponent as Component)
    expect(result).toBeTruthy()
  });

})
