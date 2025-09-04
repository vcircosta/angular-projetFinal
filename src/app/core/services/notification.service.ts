import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    success(msg: string) { console.log('[SUCCESS]', msg); }
    error(msg: string) { console.error('[ERROR]', msg); }
    info(msg: string) { console.info('[INFO]', msg); }
}
