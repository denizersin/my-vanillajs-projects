import { Card } from "./Card";


export class CardViewer {
    constructor() {
        this.set();
        this.setEvents();
    }
    set() {
        this.element = document.getElementById('card-viewer');
        this.addBtn = document.getElementById('add');
        this.themeBtn = document.getElementById('theme');
    }
    setEvents() {
        this.addCard = this.addCard.bind(this);
        this.addBtn.addEventListener('click', this.addCard);
    }
    async addCard(e) {
        //removeEvent?
        const card = new Card();
        this.element.prepend(card.element);
        await promiseFor(0);
        card.element.classList.remove('closed');
        card.content.classList.remove('hid');
        //addEvent
    }
}


