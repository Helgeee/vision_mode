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
            sound: true
        };

        this.init();
    }

    init() {
        requestAnimationFrame(() => {
            this.ui.create();
            this.ui.bind();
        });

        const saved = this.storage.load();
        if (saved) {
            this.state = { ...this.state, ...saved };

            if (this.state.enabled) {
                this.enable();
            }

            this.applyAll();
        }

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.toggle();
                this.ui.togglePanel();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const panel = document.querySelector('.access-panel');
                if (panel) panel.classList.remove('active');
            }
        });

        this.applyAlt();
        this.enableTextToSpeech();
    }

    toggle() {
        this.state.enabled ? this.disable() : this.enable();
    }

    enable() {
        this.state.enabled = true;
        document.body.classList.add('vision-mode');
        this.applyAll();
        this.storage.save(this.state);

        if ('speechSynthesis' in window && this.state.sound) {
            this.speech.speak('Режим для слабовидящих включен');
        }
    }

    disable() {
    this.state.enabled = false;

    const body = document.body;

   
    body.classList.remove('vision-mode');
    body.classList.remove('bvi-active');

 
    body.removeAttribute('data-theme');
    body.removeAttribute('data-images');
    body.removeAttribute('data-fontfamily');
    body.removeAttribute('data-letterspacing');
    body.removeAttribute('data-lineheight');
    body.removeAttribute('data-built');

    // ❗ сброс inline стилей
    body.style.fontSize = '';

    // ❗ останавливаем озвучку (иногда блокирует UX)
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    this.storage.save(this.state);
}

    update(key, value) {
        this.state[key] = value;
        this.apply(key, value);
        this.storage.save(this.state);
        
        this.ui.updateActiveButtons();

        if ('speechSynthesis' in window && this.state.sound) {
            this.speech.speak(this.getSpeechText(key, value));
        }
    }

    applyAll() {
        Object.keys(this.state).forEach(key => {
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

