
const searchLink = document.querySelector('.search_-link .icon-reg'),
    mainContent = document.querySelector('.main__content'),
    mainClose = document.querySelectorAll('.main__close'),
    mainBlock = document.querySelector('.main__block'),
    mainSolo = document.querySelector('.main__solo'),
    moviesLink = document.querySelectorAll('.movies__link'),
    formMain = document.querySelector('.form__main'),
    headerInput = document.querySelector('.header__input'),
    anime = document.querySelector('.anime'),
    pagination = document.querySelector('.pagination'),
    headerBtn = document.querySelector('.header__btn'),
    headerAbs = document.querySelector('.header__abs'),
    headerItems = document.querySelector('.header__items');



headerBtn.addEventListener('click', function (e) {
    e.preventDefault()
    this.classList.toggle('active')
    headerItems.classList.toggle('active')
    headerAbs.classList.toggle('active')
})

headerAbs.addEventListener('click', function (e) {
    if (e.target == e.currentTarget) {
        this.classList.remove('active')
        headerBtn.classList.remove('active')
        headerItems.classList.remove('active')
    }
})

const host = "https://kinopoiskapiunofficial.tech";
const hostName = 'X-API-KEY';
const hostValue = '1bd352c2-38cc-4a17-8946-8a8d50295606';


class Kino {
    constructor() {
        this.date = new Date().getMonth()
        this.curYear = new Date().getFullYear()
        this.month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
        this.curMonth = this.month[this.date]
    }

    fOpen = async (url) => {
        let response = await fetch(url, {
            headers: {
                [hostName]: hostValue
            }
        })

        if (response.ok) return response.json()
        else throw new Error(`Cannot accsess to ${url}`)


    }

    getTopMovies = (page = 1) => this.fOpen(`${host}/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1${page}`)
    getSoloFilm = (id) => this.fOpen(`${host}/api/v2.1/films/${id}`)
    getMostAwaited = (page = 1, year = this.curYear, month = this.curMonth) => this.fOpen(`${host}/api/v2.1/films/releases?year=${year}&month=${month}&page=${page}`)
    getReviews = (id) => this.fOpen(`${host}/api/v2.2/films/${id}/reviews?page=1&order=DATE_DESC`)
    getFrames = (id) => this.fOpen(`${host}/api/v2.2/films/${id}/images?type=STILL&page=1`)
    getSearch = (page = 1, keyword) => this.fOpen(`${host}/api/v2.1/films/search-by-keyword?keyword=${keyword}&page=${page}`)
    getPrimer = (year = this.curYear, month = this.curMonth) => this.fOpen(`${host}/api/v2.2/films/premieres?year=${year}&month=${month}`)
}

const db = new Kino()


function renderTrendMovies(elem = [], fn = [], films = [], pages = []) {
    anime.classList.add('active')
    elem.forEach((item, i) => {
        let parent = document.querySelector(`${item} .swiper-wrapper`)
        console.log(parent);
        db[fn[i]](pages[i]).then(data => {
            data[films[i]].forEach(el => {
                let slide = document.createElement('div')
                slide.classList.add('swiper-slide')
                slide.innerHTML = `
                        <div class="movie__item">
                            <img src="${el.posterUrlPreview}" alt="" loading="lazy">
                        </div>
                     `
                parent.append(slide)

            })
            anime.classList.remove('active')
        })

            .then(() => {
                new Swiper(`${item}`, {
                    slidesPerView: 1,
                    spaceBetween: 27,
                    // slidesPerGroup: 3,
                    // loop: true,
                    // loopFillGroupWithBlank: true,
                    navigation: {
                        nextEl: `${item} .swiper-button-next`,
                        prevEl: `${item} .swiper-button-prev`,
                    },
                    breakpoints: {
                        1440: {
                            slidesPerView: 6,
                        },
                        1200: {
                            slidesPerView: 5,
                        },
                        960: {
                            slidesPerView: 4,
                        },
                        720: {
                            slidesPerView: 3,
                        },
                        500: {
                            slidesPerView: 2,
                        },
                    }
                });
            })
        db.getTopMovies(1)
    });

}

renderTrendMovies(['.trend__tv-slider', '.popular__actors-slider'], ['getTopMovies', 'getMostAwaited'], ['films', 'releases'], [1, 1])


function randMovies(num) {
    return Math.trunc(Math.random() * num + 1)
}


function renderHeader(page) {
    db.getTopMovies(page).then(data => {

        // console.log(data);
        let max = randMovies(data.films.length)
        //    console.log(max);
        let filmId = data.films[max].filmId
        let filmRating = data.films[max].rating


        db.getSoloFilm(filmId).then(response => {

            let info = response.data

            let headerText = document.querySelector('.header__text')

            let url = info.webUrl.split("kinopoisk").join("kinopoiskk")

            headerText.innerHTML = ` 
        <h1 class="header__title">${info.nameRu || info.nameEn}</h1>
        <div class="header__balls">
            <span class="header__year">${info.year}</span>
            <span class="logo__span header__rating  header__year ">${info.ratingAgeLimits}+</span>
            <div class="header__seasons header__year">${info.seasons.length > 0 ? info.seasons[0] : ""}</div>
            <div class="header__stars header__year"><span class="icon-solid"></span><strong>${filmRating}</strong></div>
        </div>
        <p class="header__descr">
            ${info.description}
        </p>
        <div class="header__buttons">
            <a href="${url} target="_blank" class="header__watch"><span class="icon-solid"></span>watch</a>
            <a href="#" class="header__more header__watch movie__item data-id="${info.filmId}">More information</a>
        ` 
        })

        .then(() => {
            let headerMore = document.querySelector('.header__more')
            headerMore.addEventListener('click', function(e){
               e.preventDefault()
               let attr = this.getAttribute('data-id')
               openSoloFilms(e)
            })
        })
    })
}

let page = 13;

let rand = randMovies(page)
renderHeader(rand)

const popularActorsTitle = document.querySelector('.popular__actors-title strong')
const comingSoonBlock = document.querySelector('.coming__soon-block img')
const year = document.querySelector('.year')

popularActorsTitle.innerHTML = `${db.curMonth} ${db.curYear}`
year.innerHTML = `${db.curYear}`

db.getPrimer().then(res => {
    let rand = randMovies(res.total)
    comingSoonBlock.src = res.items[rand].posterUrlPreview
})

function openSoloFilms(e) {
    e.preventDefault()
    mainContent.classList.add('active')
    body.classList.add('active')
}   
// openSoloFilms()

mainClose.forEach(closes => {
    closes.addEventListener('click',function(e){
         e.preventDefault()
         mainContent.classList.remove('active')
         body.classList.remove('active')
    })
});

async function rederSolo(id){
   mainBlock.innerHTML = ""
   mainSolo.innerHTML = ""

//    anime.classList.add('active') 


    ;(async function() {
        const[reviews, frames, solo] = await Promise.all([
            db.getReviews(id),
            db.getFrames(id),
            db.getSoloFilm(id),
        ])

        return {reviews, frames, solo}
    })()

    .then(res => {
        let solo = res.solo.data;
        let genres = solo.genres.reduce((acc,item) => acc + `${item.genre }`, "  " )
        let countries = solo.countries.reduce((acc,item) => acc + `${item.country }`, "  " )
        let facts = "";
        let frames = "";
        let reviews = "";

        let fact = solo.facts.slice(0,5)

        fact.forEach((item,i)=> {
            fact = fact + `<li class="solo__facts">${i + 1}: ${item}</li>`
        }); 

        let frame = frames.items.slice(0,8)
        frame.forEach(item =>{
            frames += `<img src="${item.previewUrl}" alt="" loading="lazy">`
        });

        let review = res.reviews.items.slice(0,10)

        review.forEach(item =>{
            reviews += `
              <div class="review__item">
                 <span>${item.author}</span>
                 <p class="review__descr">${item.description}</p>
              </div>
            `
        });

        let div = `
        <div class="solo__img">
        <img src="${solo.posterUrlPreview}" alt=""  class="solo__img">
        <a href="${url}" class="solo__link header__watch">Video ko'rmoq</a>
       </div>
       <div class="solo__content">
         <h3 class="solo__title trend__tv-title">${solo.nameRu || solo.nameEn}</h3>
         <ul>
            <li class="solo__countries">Davlat: ${countries}</li>
            <li class="solo__genres">Janrlar: ${genres}</li>
            <li class="solo__year">Yili: ${solo.year}</li>
            <li class="solo__primer">Dunyo: ${solo.premiereWorld}</li>
            <li class="solo__rating">Reyting:</li>
            <li class="solo__slogan">Shiori: ${solo.slogan}</li>
            <li class="solo__length">Shiori: ${solo.filmLength}</li>
            <li class="solo__desc">Izoh: ${solo.description}</li>
         </ul>
       </div>
    
       <div class="solo__facts">
         <h3 class="trend__tv-title">Qiziqarli faktlar</h3>
       </div>
       <div class="solo__facts">
        <h3 class="trend__tv-title"> Qiziqarli kadrlar</h3>
      </div> 
        `
      mainSolo.innerHTML = div;
 
    })

};


rederSolo(435)

