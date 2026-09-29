import { useEffect } from 'react';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

export function useWatches(obj, names, callback) {
    useEffect(() => {
        if (!obj) {
            return;
        }
        const handles = names.map((name) => reactiveUtils.watch(() => obj[name], callback));
        return function removeHandles() {
            handles.forEach((handle) => {
                handle.remove();
            });
        };
    }, [obj, names, callback]);
}

export function useWatch(obj, name, callback) {
    useWatches(obj, [name], callback);
}

export function useOnEvents(obj, names, callback) {
    useEffect(() => {
        if (!obj || typeof obj.on !== 'function') {
            return;
        }
        const handles = names.map((name) => obj.on(name, callback));
        return function removeHandles() {
            handles.forEach((handle) => {
                handle.remove();
            });
        };
    }, [obj, names, callback]);
}

export function useOnEvent(obj, name, callback) {
    useOnEvents(obj, [name], callback);
}
