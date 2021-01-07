// ------- utilities -------

let eventsToAdd = ['keydown', 'mousedown', 'mouseup', 'dblclick', 'blur', 'focus', 'touchstart', 'touchend'];
for (let EVENT of eventsToAdd)
    window.addEventListener(EVENT, e => {
        if (!pause_Button_.paused && drawFN && drawFN[EVENT]) drawFN[EVENT](e);
    });

function disableScroll() {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    function preventDefault(e) { e.preventDefault(); }
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; }
        }));
    } catch (e) { }
    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}