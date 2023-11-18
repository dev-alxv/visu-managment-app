import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import {LoggerService} from "src/app/utils/logger.service";

export class Store<T> {

  // Nobody outside the Store should have access to the BehaviorSubject because it has the write rights
  private readonly state$: BehaviorSubject<T>;
  // Expose the observable$ part of the streams subject (read only stream)
  public readonly stateStream$: Observable<T>;
  // Keep the initial state
  public readonly initialState: T;


  protected constructor(
    initialState: T
  ) {
    this.initialState = initialState;
    // Setting the initial state in BehaviorSubject's constructor
    this.state$ = new BehaviorSubject(initialState);
    // Setting the read only stream
    this.stateStream$ = this.state$.asObservable();
  }

  // The getter will return the last value emitted in state$ subject
  public get state(): T {
    return this.state$.getValue();
  }

  // assigning a value to this.setState will push it onto the observable and down to all of its subscribers stream
  protected setState(nextState: Partial<T>): void {
    this.state$.next({
      ...this.state,
      ...nextState
    });

    if (environment.forTestPurpose) {
      console.log(`${this.constructor.name}: >> `, nextState);
    }
  }
}
