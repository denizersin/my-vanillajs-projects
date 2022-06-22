let rand = Math.floor((Math.random() * (words.length / 5))) * 5;
let answer = words.substring(rand, rand + 5);
console.log(answer);
let answer2 = answer.split('');
let currRow = 0, currCol = 0;

const wrdMtrx = Array.from(document.querySelectorAll('.container1>.word')).map(e => { if (e.nodeType == 1) return Array.from(e.children) });
//wordMatrix =[[row1.children],[row2.children],...];
const keys = Array.from(document.querySelectorAll('.container2>.kr>.c.letter'));

const enterBtn = document.getElementById('enter')
const deleteBtn = document.getElementById('delete')



let currentWord = [];
//keyClickEvents
keys.forEach(el => {
    el.addEventListener('click', e => {
        if (currCol == 5) return;
        wrdMtrx[currRow][currCol].innerHTML = el.firstElementChild.innerHTML;
        wrdMtrx[currRow][currCol].style.animation = 'scale-anim1 .2s linear';
        let col = currCol;
        setTimeout(() => {
            wrdMtrx[currRow][col].style.animation = ''
        }, 200);
        currentWord.push(el.firstElementChild.innerHTML);
        currCol++;
    })
})

let colorArr;
//ENTERBTN
enterBtn.addEventListener('click', e => {
    if (currCol != 5) return;
    let currTxt = currentWord.join('');
    if (!words.includes(currTxt)) {
        alert('boyle bir kelime yok')
        wrdMtrx[currRow].forEach(e => {
            e.style.animation = 'scale-anim1 .2s linear';
            setTimeout(k => { e.style.animation = ''; }, 200);
            e.innerHTML = ''
        });
        currentWord = []; currCol = 0;
        return;
    }
    colorArr = [0, 0, 0, 0, 0];
    currentWord.forEach((c, i) => {
        if (c == answer2[i]) {
            colorArr[i] = 'green';
            printKey(c, 'green');
            currentWord[i] = '';
            answer2[i] = '';
        }
    })
    currentWord.forEach((c, i) => {
        if (c != '' && answer2.includes(c)) {
            colorArr[i] = 'yellow';
            printKey(c, 'yellow');
            answer2[answer2.indexOf(currentWord[i])] = '';
            currentWord[i] = '';
        }
        else if (c != '') {
            colorArr[i] = 'gray';
            printKey(c, 'gray');
        }

    });

    wrdMtrx[currRow].forEach((e, i) => {
        e.style.animation = `rotate-anim1 .5s linear ${i * 500}ms`;
        setTimeout(() => { e.classList.add(colorArr[i]) }, (i) * 500 + 250);
    });
    if (!(colorArr.includes('gray') || colorArr.includes('yellow'))) {
        setTimeout(() => {
            alert('dogru');
        }, 5 * 500);
        return;
    }
    currRow++;
    currCol = 0;
    currentWord = [];
    answer2 = answer.split('');
});

//delet Btn
deleteBtn.addEventListener('click', e => {
    if (currCol == 0) return;
    currCol--;
    currentWord.pop();
    wrdMtrx[currRow][currCol].innerHTML = '';
    wrdMtrx[currRow][currCol].style.animation = 'scale-anim1 .2s linear';
    let col = currCol;
    setTimeout(() => {
        wrdMtrx[currRow][col].style.animation = '';
    }, 200);
})

//PrintKey with given color if it is possible
function printKey(letter, color) {
    let el = keys.find(e => e.firstElementChild.innerHTML == letter);
    if (el.classList.contains('green')) return;
    if (color == 'green') {
        el.classList.remove('gray');
        el.classList.remove('yellow');
        el.classList.add('green');
        return;
    }
    if (color == 'yellow') { el.classList.add('yellow'); return; }
    el.classList.add('gray');
}