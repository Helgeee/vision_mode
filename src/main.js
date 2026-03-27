import './css/vision.css';
import './css/vision-mode.css';

import { Vision } from './vision/vision.js';


window.Vision = Vision;

function initVision() {
    if (window.__visionApp) {
        return window.__visionApp;
    }

    window.__visionInitialized = true;
    window.__visionApp = new Vision({ button: '#vision-btn' });

    return window.__visionApp;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVision, { once: true });
} else {
    initVision();
}
