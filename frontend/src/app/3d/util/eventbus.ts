import * as EventEmitter from 'eventemitter3';

/**
 * Eventbus system for messaging in 3d environment.
 */
export class EventBus {
    private static _instance: EventEmitter;

    public static get instance(): EventEmitter {
        if (!this._instance) {
            this._instance = new EventEmitter();
        }
        return this._instance;
    }
}
