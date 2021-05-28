import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../structure/user';

@Injectable({
  providedIn: 'root'
})
export class AppResources {

  private static appInfo = new BehaviorSubject<{ appWidth: number, appHeight: number, platform: PlatformType }>({ appWidth: null, appHeight: null, platform: null });
  private static userInfo = new BehaviorSubject<User>(null);
  public static readonly maxMobileWidth: number = 880;
  public static popovers: HTMLIonPopoverElement[] = [];
  public static modals: HTMLIonModalElement[] = [];

  /**
   * Puts and pushes new information into appInfo to all listeners.
   * @param object the new information for appInfo.
   */
  public static PushAppInfo(object: { appWidth: number, appHeight: number, platform: PlatformType }) {
    AppResources.appInfo.next(object);
  }

  /**
   * Retrives the appInfo's observable.
   * @returns an observable for the appInfo.
   */
  static GetAppInfo() {
    return AppResources.appInfo.asObservable();
  }

  /**
   * Puts and pushes new information into userInfo to all listeners.
   * @param object the new information for userInfo.
   */
  public static PushUserInfo(object: User) {
    AppResources.userInfo.next(object);
  }

  /**
   * Retrives the userInfo's observable.
   * @returns an observable for the userInfo.
   */
  static GetUserInfo() {
    return AppResources.userInfo.asObservable();
  }

  constructor() { }
}

export enum PlatformType {
  mobile,
  desktop,
  mobileweb,
}