//frame1=>frame2=>frame3->frame1

//GLOBAL

const frames = Array.from(document.querySelectorAll('.frame')).filter(e => e.nodeType == 1);
let questions, questPrice = 0;
let correct = 0, incorrect = 0;


(async function () {
    //loading animate
    //simulate loading
    let loadingEl = document.querySelector('.loading-frame');
    loadingEl.classList.toggle('anim-on');
    await promise(2000);
    loadingEl.classList.toggle('anim-on');


    questions = await fetch('questions.json')
    questions = await questions.json();

    const startQuiz = document.getElementById('start');
    const inputVal = document.getElementById('quantity');

    startQuiz.addEventListener('click', async (e) => {
        questPrice = inputVal.value
        await loadScript('frame2.js');
        goToFrame(frames[0], frames[1], 'left', 'right');
    })



}())





//GLOBAL
function goToFrame(client, frame2, direction1, direction2) {
    client.style.animation = `client-to-${direction1} .5s cubic-bezier(0.165, 0.84, 0.44, 1)`
    setTimeout(() => {
        client.classList.add('hide');
        client.classList.remove('show');
    }, 500);
    frame2.classList.add('show');
    frame2.classList.remove('hide');
    frame2.style.animation = `${direction2}-to-client .5s cubic-bezier(0.165, 0.84, 0.44, 1)`
}


function promise(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}


function loadScript(src, callback) {
    return new Promise((resolve, reject) => {

        let script = document.createElement('script');
        script.src = src;

        script.onload = resolve;
        script.onerror = reject;

        document.head.append(script);

    })
}