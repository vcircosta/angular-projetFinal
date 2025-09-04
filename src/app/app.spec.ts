import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule], // <-- remplace RouterOutlet par RouterTestingModule
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('nav')).toBeTruthy();
    expect(compiled.querySelectorAll('nav a').length).toBe(4);

    const links = Array.from(compiled.querySelectorAll('nav a')).map(a => a.textContent?.trim());
    expect(links).toContain('Login');
    expect(links).toContain('Register');
    expect(links).toContain('Reservations');
    expect(links).toContain('Admin');
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
