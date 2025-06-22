import {IService} from "./i_service";


export class ServiceLocator {
    private static services = new Map<Function, IService>();

    public static register<T extends IService>(ctor: new (...args: any[]) => T, instance: T): void {
        if (ServiceLocator.services.has(ctor)) {
            console.warn(`${ctor.name} is already registered. Overwriting.`);
        }
        ServiceLocator.services.set(ctor, instance);
    }

    public static get<T extends IService>(ctor: new (...args: any[]) => T): T {
        const service = ServiceLocator.services.get(ctor) as T;
        if (!service) {
            throw new Error(`Service ${ctor.name} not found. Did you register it?`);
        }
        return service;
    }

    public static remove<T extends IService>(ctor: new (...args: any[]) => T): void {
        ServiceLocator.services.delete(ctor);
    }

    public static clear(): void {
        ServiceLocator.services.clear();
    }
}

