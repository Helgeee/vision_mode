import { VisionUI } from './vision-ui.js';  
import { VisionStorage } from './vision-storage.js';
import { VisionSpeech } from './vision-speech.js';



export class Vision {
    constructor(options = {}) {
        this.button = document.querySelector(options.button);
        this.storage = new VisionStorage();
        this.speech = new VisionSpeech();
        this.ui = new VisionUI(this);

        if (!this.button) {
            this.button = document.createElement('button');
            this.button.id = 'vision-btn';
            this.button.innerText = 'Версия для слабовидящих';
            document.body.prepend(this.button);
        }

        this.state = {
            enabled: false,
            fontSize: 18,
            theme: 'white',
            fontFamily: 'sans',
            images: 'on',
            letterSpacing: 'normal',
            lineHeight: 'normal',
            built: 'true',
            sound: true,
            panelOpen: false
        };

        this.init();
    }

    init() {
        const saved = this.storage.load();
        if (saved) {
            this.state = { ...this.state, ...saved };
        }

        this.ui.create();
        this.ui.bind();

        if (this.state.enabled) {
            this.enable({ announce: false, persist: false });
        } else {
            this.resetDomState();
        }

        this.ui.syncPanelState(Boolean(this.state.enabled && this.state.panelOpen), false);
        this.ui.updateActiveButtons();

        if (this.button) {
            this.button.addEventListener('click', () => {
                if (!this.state.enabled) {
                    this.enable();
                    this.ui.syncPanelState(true);
                    return;
                }

                this.ui.togglePanel();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.ui.syncPanelState(false);
            }
        });

        this.applyAlt();
        this.enableTextToSpeech();
    }

    toggle() {
        this.state.enabled ? this.disable() : this.enable();
    }

    enable(options = {}) {
        const { announce = true, persist = true } = options;

        this.state.enabled = true;
        document.body.classList.add('vision-mode');
        this.applyAll();
        this.ui.updatePanelOffset();

        if (persist) {
            this.storage.save(this.state);
        }

        if (announce && 'speechSynthesis' in window && this.state.sound) {
            this.speech.speak('Режим для слабовидящих включен');
        }
    }

    disable() {
        this.state.enabled = false;
        this.state.panelOpen = false;

        this.resetDomState();
        this.ui.syncPanelState(false, false);

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }

        this.storage.save(this.state);
    }

    update(key, value) {
        this.state[key] = value;

        if (key === 'sound') {
            this.storage.save(this.state);
            this.ui.updateActiveButtons();

            if ('speechSynthesis' in window && this.state.sound) {
                this.speech.speak(this.getSpeechText(key, value));
            }

            return;
        }

        if (this.state.enabled) {
            this.apply(key, value);
            this.ui.updatePanelOffset();
        }

        this.storage.save(this.state);
        this.ui.updateActiveButtons();

        if ('speechSynthesis' in window && this.state.sound) {
            this.speech.speak(this.getSpeechText(key, value));
        }
    }

    applyAll() {
        ['fontSize', 'theme', 'fontFamily', 'images', 'letterSpacing', 'lineHeight', 'built'].forEach(key => {
            this.apply(key, this.state[key]);
        });
    }

    apply(key, value) {
        const body = document.body;

        switch (key) {
            case 'fontSize': body.style.fontSize = value + 'px'; break;
            case 'theme': body.dataset.theme = value; break;
            case 'fontFamily': body.dataset.fontfamily = value; break;
            case 'images': body.dataset.images = value; break;
            case 'letterSpacing': body.dataset.letterspacing = value; break;
            case 'lineHeight': body.dataset.lineheight = value; break;
            case 'built': body.dataset.built = value; break;
        }
    }

    resetDomState() {
        const body = document.body;

        body.classList.remove('vision-mode');
        body.classList.remove('bvi-active');
        body.classList.remove('panel-open');

        body.removeAttribute('data-theme');
        body.removeAttribute('data-images');
        body.removeAttribute('data-fontfamily');
        body.removeAttribute('data-letterspacing');
        body.removeAttribute('data-lineheight');
        body.removeAttribute('data-built');

        body.style.fontSize = '';
        body.style.paddingTop = '';
        document.documentElement.style.removeProperty('--panel-height');
    }

    applyAlt() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt || img.alt.trim() === '') {
                img.alt = 'Изображение';
            }
        });
    }

    enableTextToSpeech() {
        document.body.addEventListener('dblclick', e => {
            const text = e.target.innerText;
            if (text && text.length > 2 && 'speechSynthesis' in window && this.state.sound) {
                this.speech.speak(text);
            }
        });
    }

    getSpeechText(key, value) {
        const map = {
            fontSize: 'Размер шрифта изменён',

            theme: {
                white: 'Чёрный по белому',
                black: 'Белый по чёрному',
                'dark-blue': 'Синий по голубому',
                'brown-beige': 'Коричневый по бежевому',
                'green-darkbrown': 'Зелёный по тёмно-коричневому'
            },

            images: {
                on: 'Изображения включены',
                off: 'Изображения отключены',
                grayscale: 'Изображения чёрно белые'
            },

            sound: value ? 'Озвучивание сайта включено' : 'Озвучивание сайта выключено'
        };

        if (key === 'theme') return map.theme[value];
        if (key === 'images') return map.images[value];

        return map[key] || 'Настройки изменены';
    }
}

