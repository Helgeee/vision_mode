export class VisionSpeech {
    constructor(enabled = true) {
        this.enabled = enabled;
        this.userInteracted = false;

   
        document.addEventListener('click', () => {
            this.userInteracted = true;
        }, { once: true });
    }

    speak(text) {
        if (!this.enabled) return;
        if (!this.userInteracted) return;
        if (!('speechSynthesis' in window)) return;

        const msg = new SpeechSynthesisUtterance(text);

        msg.lang = 'ru-RU';
        msg.rate = 1;
        msg.pitch = 1;

      
        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    }
}