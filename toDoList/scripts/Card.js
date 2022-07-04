export class Card {
    constructor() {
        this.element = undefined;

        this.firstDown = {};
        this.dx = 0;
        this.set();
        this.setEvents();
    }

    set() {
        this.element = document.createElement('div');
        this.element.className = 'card closed';
        this.element.innerHTML = `
        <div class="content hid">
          <textarea name="" id="title" class="default">title</textarea>
          <textarea name="" id="more" class="default">more</textarea>
          <div class="done" id="task-done">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="cancel" id="task-cancel">
            <i class="fa-solid fa-ban"></i>
          </div>
        </div>
        <div class="back">
          <span class="text"></span>
        </div>
        `
        //Childs
        this.doneBtn = this.element.querySelector('#task-done')
        this.cancelBtn = this.element.querySelector('#task-cancel')
        this.content = this.element.querySelector('.content');
        this.backContainer = this.element.querySelector('.back')
    }
    setEvents() {
        //bind
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.done = this.done.bind(this);
        this.cancel = this.cancel.bind(this);



        this.element.addEventListener('mousedown', this.onMouseDown);
        document.body.addEventListener('mouseup', this.onMouseUp)

        this.cancelBtn.addEventListener('click', this.cancel)
        this.doneBtn.addEventListener('click', this.done)
    }
    onMouseDown(e) {
        this.firstDown.clientX = e.clientX;
        this.firstDown.date = new Date();
        this.element.addEventListener('mousemove', this.onMouseMove);
        currSwipping = this;
    }
    async onMouseUp(e) {
        if (currSwipping != this) return;
        this.element.removeEventListener('mousemove', this.onMouseMove);
        let speed = Math.abs(this.firstDown.clientX - e.clientX) / (new Date() - this.firstDown.date);

        if (speed > 0.6) {
            //SWIPE and Destroy
            this.swipe(speed);
            return;
        }
        //duzelt
        this.content.style.transform = '';
        await promiseFor(400)
        this.backContainer.classList.remove('cancel', 'done');
        this.backContainer.innerHTML = '';

    }
    onMouseMove(e) {
        let dx = e.clientX - this.firstDown.clientX;
        dx = dx > this.element.offsetWidth ? this.element.offsetWidth : dx < -this.element.offsetWidth ? -this.element.offsetWidth : dx;
        this.dx = dx;
        this.content.style.transform = `translateX(${dx}px)`
        this.checkBack();
    }
    async swipe(speed) {
        if (this.dx > 0) {
            this.content.style.transform = `
            translateX(${this.element.offsetWidth}px)`
        }
        else {
            this.content.style.transform = `
            translateX(${-this.element.offsetWidth}px)`

        }
        this.checkBack();
        await promiseFor(200);
        this.element.style.transition = `all .2s linear`
        this.element.classList.add('closed');

        await promiseFor(200);
        viewer.element.removeChild(this.element);
    }

    cancel(e) {
        this.dx = -20;
        this.swipe();
    }
    done(e) {
        this.dx = +20;
        this.swipe();
    }
    checkBack() {
        if (this.dx >= 0 && this.backContainer.innerHTML != 'done') {
            this.backContainer.innerHTML = 'done';
            this.backContainer.classList.remove('cancel');
            this.backContainer.classList.add('done');

        }
        else if (this.dx <= -1 && this.backContainer.innerHTML != 'cancel') {
            this.backContainer.innerHTML = 'cancel';
            this.backContainer.classList.remove('done');
            this.backContainer.classList.add('cancel');
        }
    }
}


console.log('asd', currSwipping)