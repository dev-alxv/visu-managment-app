import {LoggerService} from "src/app/utils/logger.service";

describe('LoggerService', () => {

  it('should create',  () => {
    const service = new LoggerService()
    expect(service).toBeTruthy()
  });


})
