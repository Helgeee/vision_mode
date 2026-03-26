import './css/vision.css';
import './css/vision-mode.css';

import { Vision } from './vision/vision.js';


window.Vision = Vision;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.__visionInitialized) {
        window.__visionInitialized = true;
        new Vision({ button: '#vision-btn' });
    }
});
