export class VisionUI {
    constructor(app) {
        this.app = app;
    }

    create() {
        if (document.querySelector('.access-panel')) return;

        const panel = document.createElement('div');
        panel.className = 'access-panel';

        panel.innerHTML = `
        <div class="panel-content">

            <div class="block">
                <p class="block-title">Размер шрифта</p>
                <div class="block-buttons">
                    <button data-action="font-minus">A−</button>
                    <button data-action="font-plus">A+</button>
                </div>
            </div>

            <div class="block">
                <p class="block-title">Цвета сайта</p>
                <div class="block-buttons">
                    <button data-theme="white">A</button>
                    <button data-theme="black">A</button>
                    <button data-theme="dark-blue">A</button>
                    <button data-theme="brown-beige">A</button>
                    <button data-theme="green-darkbrown">A</button>
                </div>
            </div>

            <div class="block">
                <p class="block-title">Изображения</p>
                <div class="block-buttons">
                    <button data-images="on">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00005 18.0001C3 17.9355 3 17.8689 3 17.8002V6.2002C3 5.08009 3 4.51962 3.21799 4.0918C3.40973 3.71547 3.71547 3.40973 4.0918 3.21799C4.51962 3 5.08009 3 6.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21 4.5192 21 5.07899 21 6.19691V17.8031C21 18.2881 21 18.6679 20.9822 18.9774M3.00005 18.0001C3.00082 18.9884 3.01337 19.5058 3.21799 19.9074C3.40973 20.2837 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H17.8036C18.9215 21 19.4805 21 19.9079 20.7822C20.2842 20.5905 20.5905 20.2837 20.7822 19.9074C20.9055 19.6654 20.959 19.3813 20.9822 18.9774M3.00005 18.0001L7.76798 12.4375L7.76939 12.436C8.19227 11.9426 8.40406 11.6955 8.65527 11.6064C8.87594 11.5282 9.11686 11.53 9.33643 11.6113C9.58664 11.704 9.79506 11.9539 10.2119 12.4541L12.8831 15.6595C13.269 16.1226 13.463 16.3554 13.6986 16.4489C13.9065 16.5313 14.1357 16.5406 14.3501 16.4773C14.5942 16.4053 14.8091 16.1904 15.2388 15.7607L15.7358 15.2637C16.1733 14.8262 16.3921 14.6076 16.6397 14.5361C16.8571 14.4734 17.0896 14.4869 17.2988 14.5732C17.537 14.6716 17.7302 14.9124 18.1167 15.3955L20.9822 18.9774M20.9822 18.9774L21 18.9996M15 9C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button data-images="off">⊝</button>
                    <button data-images="grayscale">◐</button>
                </div>
            </div>

            <div class="block">
                <p class="block-title">Синтез речи</p>
                <div class="block-buttons">
                    <button data-sound="toggle">🔊</button>
                </div>
            </div>

            <div class="block settings">
                <p class="block-title">Настройки</p>
                <div class="block-buttons">
                    <button data-disable="vision" class="wide-btn">Обычная версия сайта</button>
                    <button data-hide="panel">−</button>
                </div>
            </div>

        </div>
        `;

        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(panel, header);
        } else {
            document.body.prepend(panel);
        }

        this.updateActiveButtons();
    }

    togglePanel() {
        const panel = document.querySelector('.access-panel');
        if (!panel) return;

        panel.classList.toggle('active');
        const isOpen = panel.classList.contains('active');

        document.body.classList.toggle('panel-open', isOpen);

        if (isOpen) {
            requestAnimationFrame(() => {
                const height = panel.offsetHeight;

                document.body.style.paddingTop = height + 'px';
                document.documentElement.style.setProperty('--panel-height', height + 'px');
            });
        } else {
            document.body.style.paddingTop = '';
            document.documentElement.style.removeProperty('--panel-height');
        }

        this.updateActiveButtons();
    }

    updateActiveButtons() {
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.app.state.theme);
        });

        document.querySelectorAll('[data-images]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.images === this.app.state.images);
        });

        document.querySelectorAll('[data-sound="toggle"]').forEach(btn => {
            btn.classList.toggle('active', this.app.state.sound === true);
            btn.textContent = this.app.state.sound ? '🔊' : '🔈';
        });
    }

    bind() {
        document.body.addEventListener('click', (e) => {
            const el = e.target.closest('button');
            if (!el) return;

            if (el.dataset.action === 'font-plus') {
                this.app.update('fontSize', this.app.state.fontSize + 2);
            }

            if (el.dataset.action === 'font-minus') {
                this.app.update('fontSize', this.app.state.fontSize - 2);
            }

            if (el.dataset.theme) {
                this.app.update('theme', el.dataset.theme);
            }

            if (el.dataset.images) {
                this.app.update('images', el.dataset.images);
            }

            if (el.dataset.sound === 'toggle') {
                this.app.update('sound', !this.app.state.sound);
            }

            if (el.dataset.hide === 'panel') {
                this.togglePanel();
            }

            if (el.dataset.disable === 'vision') {
                this.app.disable();

                const panel = document.querySelector('.access-panel');
                if (panel) panel.classList.remove('active');

                document.body.classList.remove('panel-open');
                document.body.style.paddingTop = '';
            }

            this.updateActiveButtons();
        });
    }
}