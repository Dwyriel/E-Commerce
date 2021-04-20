import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../structure/user';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  private static appInfo = new BehaviorSubject<{ appWidth: number, appHeight: number, isDesktop: boolean }>({ appWidth: null, appHeight: null, isDesktop: null });
  private static userInfo = new BehaviorSubject<User>(new User());
  private static isMobile = new BehaviorSubject<boolean>(true);
  /**
   * Puts and pushes new information into appInfo to all listeners.
   * @param object the new information for appInfo.
   */
  public static PushAppInfo(object: { appWidth: number, appHeight: number, isDesktop: boolean }) {
    AppInfoService.appInfo.next(object);
  }

  /**
   * Retrives the appInfo's observable.
   * @returns an observable for the appInfo.
   */
  static GetAppInfo() {
    return AppInfoService.appInfo.asObservable();
  }

  /**
   * Puts and pushes new information into userInfo to all listeners.
   * @param object the new information for userInfo.
   */
  public static PushUserInfo(object: User) {
    AppInfoService.userInfo.next(object);
  }

  /**
   * Retrives the userInfo's observable.
   * @returns an observable for the userInfo.
   */
  static GetUserInfo() {
    return AppInfoService.userInfo.asObservable();
  }

  /**
  *  Puts and pushes new value into isMobile to all listeners.
  * @param value the new value for isMobile.
  */
  static PushIsMobile(value: boolean) {
    AppInfoService.isMobile.next(value);
  }

  /**
  * Retrives the isMobile's observable.
  * @returns an observable for the userInfo.
  */
  static GetIsMobile() {
    return AppInfoService.userInfo.asObservable();
  }

  constructor() { }
}
