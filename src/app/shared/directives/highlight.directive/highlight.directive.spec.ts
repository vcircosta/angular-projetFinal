import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'app-test-host',
    standalone: true,
    template: '<p [appHighlight]="color">Text</p>',
    imports: [HighlightDirective] // on importe la directive ici
})
class TestHostComponent {
    color = 'yellow';
}

describe('HighlightDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent] // composant standalone -> import, pas declarations
        });

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait appliquer la couleur de fond par défaut', () => {
        const pEl = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        expect(pEl.style.backgroundColor).toBe('yellow');
    });

    it('devrait appliquer la couleur de fond passée en input', () => {
        component.color = 'lightblue';
        fixture.detectChanges();
        const pEl = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
        expect(pEl.style.backgroundColor).toBe('lightblue');
    });
});
