import {LocalStorageService} from "src/app/utils/local-storage.service";

describe('LocalStorageService', () => {

  let service: LocalStorageService

  beforeEach(() => {
    service = new LocalStorageService()
  })

  it('should create', () => {
    expect(service).toBeTruthy()
  });

  it('methods set and get should be work', () => {
    service.set('Capital', 'London')
    const result1 = service.get('Capital')
    expect(result1).toBe('London')

    const result2 = service.get('123')
    expect(result2).toBe(null)
  });

  it('method remove should be work', () => {
    service.set('Name', 'Jack')
    let name = service.get('Name')
    expect(name).toBe('Jack')

    service.remove('Name')
    name = service.get('Name')
    expect(name).toBe(null)
  });

  it('method setObject should be work', () => {
    service.setObject('address', {city: 'Barcelona', street: 57})
    const result = service.get('address')
    expect(result).toBeTruthy()
  });

  it('method getObject should be work',  () => {
    service.setObject('FC', {name: 'Arsenal', city: 'London'})
    const result = service.getObject('FC')
    expect(result).toEqual({name: 'Arsenal', city: 'London'})
  });


})
