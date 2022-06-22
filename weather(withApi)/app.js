

//http://openweathermap.org/img/wn/${weather.icon}@2x.png

class City {
    constructor(city) {
        this.city = city;
        this.todayEl = undefined;
        this.sevenDayEl = undefined;
        this.weather = undefined;
        this.requestWeather();
    }
    async requestWeather(city) {
        let cordinateJson;
        try {
            //coordinate api
            cordinateJson = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${this.city}&format=json&apiKey=5e5b4cf93dd44368a4968dc775e3b46e`);
        }
        catch {
            alert('boyle bir sehir yok');
            return;
        }
        let cordinateJson2 = await cordinateJson.json();
        let cordinates = [cordinateJson2.results[0].lat, cordinateJson2.results[0].lon];
        let tempJson = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${cordinates[0]}&lon=${cordinates[1]}&exclude=minutely&appid=dcbe282eed1e709c5c0ac8a6e5331da7`);
        let tempJson2 = await tempJson.json();
        console.log(tempJson2);
        //this.temp = Math.round(tempJson2.current.temp - 272.15);  //kelvin to C   C=K-272.15;
        this.daily = tempJson2.daily;
        this.setEL();
    }
    setEL() {
        this.todayEl = document.createElement('div');
        this.todayEl.className = 'city day';
        this.todayEl.innerHTML = `
        <div class="c c1"><span>${this.city}</span></div>
          <div class="c c2"><span id="tempval">${Math.round(this.daily[0].temp.day - 272.15)}</span><span class="degree_symbol">&#176;</span><span>C</span></div>
          <div class="c c3">
            <img src="http://openweathermap.org/img/wn/${this.daily[0].weather[0].icon}@2x.png" alt="" id="image">
          </div>
          <div class="c c4">
            <span>${this.daily[0].weather[0].description}</span>
          </div>
          <div class="c c5">
          <span>${new Date().toDateString()}</span>
          </div>
          </div>
        `
        this.sevenDayEl = document.createElement('div');
        this.sevenDayEl.className = 'all-day-container adc hide';
        let str = [];
        for (let i = 0; i < 7; i++) {
            let html = `
            <div class="city day">

            <div class="c c1"><span>${this.city}</span></div>
            <div class="c c2"><span id="tempval">${Math.round(this.daily[i].temp.day - 272.15)}</span><span class="degree_symbol">&#176;</span><span>C</span></div>
            <div class="c c3">
              <img src="http://openweathermap.org/img/wn/${this.daily[i].weather[0].icon}@2x.png" alt="" id="image">
            </div>
            <div class="c c4">
              <span>${this.daily[i].weather[0].description}</span>
            </div>
            <div class="c c5">
            <span>${new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * i).toDateString()}</span>
            </div>
            </div>
            </div>
            `
            str.push(html);
        }
        this.sevenDayEl.innerHTML = str.join('');


        content3.appendChild(this.todayEl);
        content3.appendChild(this.sevenDayEl);

        this.clickEvent = this.clickEvent.bind(this); //dont lose this!

        this.todayEl.addEventListener('click', this.clickEvent);
        this.sevenDayEl.addEventListener('click', this.clickEvent);
    }


    clickEvent(e) {
        if (e) e.stopPropagation();
        if (currentShowing && currentShowing != this) {
            currentShowing.clickEvent(); //hide current
        }
        if (currentShowing) {
            console.log('NULL');
            currentShowing = null;
            this.sevenDayEl.style.transform = "";
            setTimeout(() => {
                this.sevenDayEl.classList.remove('show');
                this.sevenDayEl.classList.add('hide');
            }, 1);

            setTimeout(() => {
                this.todayEl.style.transform = "";
            }, 300);

            return;
        }
        console.log('degil');
        currentShowing = this;
        let cord = getBoundingDiffer(this.todayEl, content3);
        this.todayEl.style.transform = `scale(0.5)`;

        this.sevenDayEl.style.zIndex = 999;
        cord = getBoundingDiffer(this.sevenDayEl, this.todayEl);

        //x degeri content2'e absolute ve left 0 oldugu icin sorun olmuyor.
        this.sevenDayEl.style.transform = `translate3d(${0}px,${cord[1]}px,0px)`;

        setTimeout(() => {
            if (!this.sevenDayEl.style.transform) return; // double click olunca 
            this.sevenDayEl.classList.add('show');
            this.sevenDayEl.classList.remove('hide');
        }, 300);
    }

}

const addedCities = [];
let content3 = document.querySelector('.content3');
let input = document.getElementById('srcinput');
let btn = document.getElementById('srcbutton');
btn.addEventListener('click', () => {

    if (input.value == "") return;
    console.log('sd');
    addedCities.push(new City(input.value));

})


let currentShowing = null;

input.addEventListener('click', e => { input.value = "" })




document.documentElement.addEventListener('click', e => {
    if (currentShowing && currentShowing != this) {
        currentShowing.clickEvent(); //hide current
    }
})






function getBoundingDiffer(el1, el2) {
    //el1'in el2'ye uzakligi?
    let el1Gbc = el1.getBoundingClientRect();
    let el2Gbc = el2.getBoundingClientRect();
    return [el2Gbc.x - el1Gbc.x, el2Gbc.y - el1Gbc.y];
}

