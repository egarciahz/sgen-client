/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
export default function loadJS(src: string, args: { integrity: string; crossOrigin: string }) {
    'use strict';
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.integrity = args.integrity || '';
    script.crossOrigin = args.crossOrigin || '';

    ref.parentNode?.insertBefore(script, ref);
    return script;
}
