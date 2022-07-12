


let left = document.querySelector('.left');
let right = document.querySelector('.right');

let sentencesArr = `We organise what we write into sentences and paragraphs. A paragraph begins on a new line within the text and there is often a blank line between paragraphs. A paragraph usually contains more than one sentence and it is usually about one topic.The first sentence in a paragraph is sometimes called the key or topic sentence because it gives us the key to what the paragraph will be about. The other sentences usually relate to the key sentence. There is usually a conclusion in the final sentence of a paragraph and sometimes there is a link to the next paragraph.`.split(' ');
let html = '';
for (let i = 0; i < sentencesArr.length; i++) {
    html += `<span>${sentencesArr[Math.floor(Math.random() * sentencesArr.length)]}</span><span>&nbsp</span>`;
}
right.innerHTML = html;


let currLeft = document.createElement('span');
left.appendChild(currLeft);
let currRight = right.firstElementChild;


//currLeft.innerHtml=='' then we are in first word
let hasfalse = false;
let actualRight = currRight.innerHTML;
let dogru = 0, yanlis = 0;

function next(code) {
    if (code == ' ' && currLeft.innerHTML == '') return;
    if (code == 'Backspace' && currLeft.innerHTML == '') { hasfalse = false; return; };
    if (code == ' ') {
        if (currRight.innerHTML != '') {
            //incorrect
            yanlis++;
            updateClass(currLeft, true);
            //currLeft.innerHTML += currRight.innerHTML;
            currLeft.innerHTML = actualRight;
        }
        else dogru++;
        //correct
        right.firstElementChild.remove();
        left.prepend(right.firstElementChild);
        currRight = right.firstElementChild;
        currLeft = document.createElement('span');
        left.prepend(currLeft);
        hasfalse = false;
        updateClass(currLeft, hasfalse);
        actualRight = currRight.innerHTML;
        return;
    }

    if (code == 'Backspace' && currLeft.innerHTML != '') {
        if (!hasfalse) {
            currRight.innerHTML = currLeft.innerHTML[currLeft.innerHTML.length - 1] + currRight.innerHTML;
        }
        currLeft.innerHTML = currLeft.innerHTML.split('').filter((e, index) => { if (index != currLeft.innerHTML.length - 1) return e }).join('');

        if (currLeft.innerHTML + currRight.innerHTML == actualRight) {
            hasfalse = false;
            updateClass(currLeft, hasfalse);
        }
        return;
    }

    if (hasfalse) {
        currLeft.innerHTML += code;
        speed -= .5;
        if (speed < 0) { speed = 0; }
        return;
    }

    if (!hasfalse && code == currRight.innerHTML[0]) {
        currLeft.innerHTML += currRight.innerHTML[0];
        currRight.innerHTML = currRight.innerHTML.split('').filter((e, index) => { if (index != 0) return e }).join('')
        speed += .5;
        updateClass(currLeft, hasfalse);
        return;
    }
    if (code != currRight.innerHTML[0]) {
        hasfalse = true;
        updateClass(currLeft, hasfalse);
        currLeft.innerHTML += code;
        return;
    }
}


document.documentElement.addEventListener('keydown', e => {
    if (e.keyCode == 32 || e.keyCode == 8 || e.keyCode >= 65 && e.keyCode <= 90)
        next(e.key);
})

function updateClass(el, hasfalse) {
    if (!hasfalse) { el.classList.remove('false'); el.classList.add('true'); return; }
    el.classList.add('false'); el.classList.remove('true'); return;
}


let lines = Array.from(document.querySelectorAll('.line')).map(e => { if (e.nodeType == 1) return e; });



let speed = 0;

let W = window.innerWidth;
lines.forEach((el, index) => {
    el.left = index * W / 4;
    el.style.left = `${el.left}px`
})

setInterval(() => {
    lines.forEach((el, index) => {
        el.left -= speed;
        el.style.left = `${el.left}px`;
        if (-el.left >= W / 4) {
            el.left = W;
        }
    })
}, 33);

let car = document.querySelector('.car');
car.left = W / 2 - W / 5;
car.style.left = `${car.left}px`
setInterval(() => {
    car.left += speed;
    car.style.left = `${car.left}px`
    if (car.left >= W) {
        car.left = -W / 10;
    }
}, 300);