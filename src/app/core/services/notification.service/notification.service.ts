import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    success(msg: string) { console.warn('[SUCCESS]', msg); }
    error(msg: string) { console.error('[ERROR]', msg); }
    info(msg: string) { console.warn('[INFO]', msg); }
}
