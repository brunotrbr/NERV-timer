(function () {
    const BASE_WIDTH = 800;
    const BASE_HEIGHT = 480;

    function resizeInterface() {
        const scale = Math.min(
            window.innerWidth / BASE_WIDTH,
            window.innerHeight / BASE_HEIGHT
        );
        document.documentElement.style.setProperty('--ui-scale', String(scale));
    }

    resizeInterface();
    window.addEventListener('resize', resizeInterface);

    if (typeof Neutralino !== 'undefined' && typeof NL_OS !== 'undefined') {
        Neutralino.init();
        Neutralino.events.on('windowClose', function () {
            Neutralino.app.exit();
        });
    }
})();
