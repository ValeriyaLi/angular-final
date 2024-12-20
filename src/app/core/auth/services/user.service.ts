import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { User } from "../user.model";
import { Router } from "@angular/router";
import { JwtService } from "./jwt.service";

@Injectable({ providedIn: "root" })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));



  private mockUser: User = {
    email: "123",
    username: "123",
    token: "mock-token",
    bio: "This is a mock user.",
    image: "",
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) {}

  login(credentials: { email: string; password: string }): Observable<{ user: User }> {
    const user = { ...this.mockUser, email: credentials.email };
    this.setAuth(user);
    return of({ user });
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    const user = {
      ...this.mockUser,
      username: credentials.username,
      email: credentials.email,
    };
    this.setAuth(user);
    return of({ user });
  }

  getCurrentUser(): Observable<{ user: User }> {
    const token = this.jwtService.getToken();
    if (token) {
      return of({ user: this.mockUser });
    } else {
      this.purgeAuth();
      return of({ user: null as any });
    }
  }

  update(user: Partial<User>): Observable<{ user: User }> {
    const updatedUser = { ...this.mockUser, ...user };
    this.currentUserSubject.next(updatedUser);
    return of({ user: updatedUser });
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
