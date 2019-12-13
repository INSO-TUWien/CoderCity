import {EventEmitter} from 'eventemitter3';

/**
 * Eventbus system for messaging in 3d environment.
 */
export class EventBus {
    private static instance: EventBus;

    eventbus = new EventEmitter();

    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }

        return EventBus.instance;
    }

    private constructor() {
    }

    get() {
        return this.eventbus;
    }

 
}