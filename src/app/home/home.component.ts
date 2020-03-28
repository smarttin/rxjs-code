import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, Observable, of, timer, noop, throwError } from 'rxjs';
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  finalize
} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: "home",
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const https$: Observable<Course[]> = createHttpObservable('/api/courses');

    const course$ = https$.pipe(
      tap(() => console.log('one http request executed..')),
      map(res => Object.values(res['payload'])),
      shareReplay(),
      retryWhen(errors => errors.pipe(
        delayWhen(() => timer(2000))
      ))
    );

    this.beginnerCourses$ = course$.pipe(
      map((courses: Course[]) =>
        courses.filter(course => course.category === 'BEGINNER')
      )
    );

    this.advancedCourses$ = course$.pipe(
      map((courses: Course[]) =>
        courses.filter(course => course.category === 'ADVANCED')
      )
    );

    // course$.subscribe(
    //   courses => {},
    //   noop,
    //   () => console.log('completed...')
    // );
  }
}
