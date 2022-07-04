let currSwipping; //documen.onmouseup icinde this==currSwipping olmali!
function promiseFor(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}
console.log('global')

let viewer;