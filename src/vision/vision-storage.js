

export class VisionStorage {
    constructor(key = 'vision-settings') {
        this.key = key;
    }

    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (e) {
            console.warn('Ошибка сохранения настроек', e);
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Ошибка загрузки настроек', e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}