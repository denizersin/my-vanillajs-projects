class QuestCard {
    constructor(quest) {
        this.quest = quest;
        this.el = undefined;

        this.click = this.click.bind(this);
        this.setEl();
        this.setEvents();
    }
    setEl() {
        this.el = document.createElement('div');
        this.el.innerHTML = `
    <div class="question">${this.quest.quest}</div>
    <div class="answers">
      <div class="ans ans1">${this.quest.answers[0]}</div>
      <div class="ans ans2">${this.quest.answers[1]}</div>
      <div class="ans ans3">${this.quest.answers[2]}</div>
      <div class="ans ans4">${this.quest.answers[3]}</div>
    </div>
    `
        this.el.className = 'c c2 quest-container';
    }
    setEvents() {
        this.el.lastElementChild.childNodes.forEach(element => {
            if (element.nodeType == 1) element.addEventListener('click', this.click)
        });
    }
    async click(e) {
        e.target.style.animation = 'scale .2s cubic-bezier(0.165, 0.84, 0.44, 1)';
        await promise(200);

        if (e.target == this.el.lastElementChild.children[this.quest.correct]) {
            correct++;
        }
        else {
            e.target.classList.add('false');
            incorrect++;
        }
        e.target.classList.add('answered');
        this.el.lastElementChild.children[this.quest.correct].classList.add('true');

        this.el.lastElementChild.childNodes.forEach(element => {
            if (element.nodeType == 1) element.removeEventListener('click', this.click)
        });
        e.target.style.animation = '';
    }
}

questions = questions.map(e => {
    return new QuestCard(e);
})

questions.length = questPrice;

const container = document.querySelector('.frame2>.container');

const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

let currentQuest = 0;
let addEl = document.querySelector('.frame2>.container>.c1');
addEl.after(questions[currentQuest].el);

prevBtn.addEventListener('click', e => {
    if (currentQuest != 0) {
        container.style.animation = 'scale .5s cubic-bezier(0.165, 0.84, 0.44, 1)'
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
        questions[currentQuest].el.remove();
        currentQuest--;
        setTimeout(() => {
            addEl.after(questions[currentQuest].el);
        }, 200);
    }
})

nextBtn.addEventListener('click', async e => {
    if (currentQuest == questions.length - 1) {
        await loadScript('frame3.js');
        goToFrame(frames[1], frames[2], 'left', 'right');
        return;
    }

    if (currentQuest == questions.length - 2) {
        nextBtn.innerHTML = 'sonucu gor';
    }
    questions[currentQuest].el.remove();
    currentQuest++;
    setTimeout(() => {
        addEl.after(questions[currentQuest].el);
    }, 200);

    container.style.animation = 'scale .5s cubic-bezier(0.165, 0.84, 0.44, 1)'
    setTimeout(() => {
        container.style.animation = '';
    }, 500);
})
