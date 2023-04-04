const concerts = [
    {
        title: "Onkel und Tante, ja das sind Verwandte",
        subtitle: "Die Highlights der Operette",
        date: "3. Juni 2023",
        time: "19:30",
        town: "Kallmünz",
        location: "Pfarrsaal",
        link: "https://veranstaltungen.idowa.de/neutraubling/junges-podium-highlights-der-operette-e11f4abf23090ecc400f26de5f33f08dd.html",
        map: "https://www.google.com/maps/place/Pfarramt/@49.1622703,11.9515139,17z/data=!3m1!4b1!4m6!3m5!1s0x479f914f17ed0809:0x9471e3fa9794b251!8m2!3d49.1622668!4d11.9537026!16s%2Fg%2F1tf56wkw"
    },
    {
        title: "Neues Operettenprogramm 2023",
        subtitle: "Die Highlights der Operette",
        date: "7. Januar 2024",
        time: "17:00",
        town: "Frontenhausen",
        location: "Postsaal",
        map: "https://www.google.com/maps/place/Kom(m)Postler+Frontenhausen/@48.5442863,12.5348744,17z/data=!3m1!4b1!4m6!3m5!1s0x47759a5b69217057:0xc524b8f953e72277!8m2!3d48.5442828!4d12.5370631!16s%2Fg%2F11g6b2f2m9",
    },
];


window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const links = document.querySelectorAll("nav .links a");
    const smallConcertsDiv = document.querySelector(".small-concerts");
    const concertsDiv = document.querySelector(".concerts");

    const scrollToElement = (element, withMargin = false) => {
        const offset = nav.offsetHeight;
        const targetOffset = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const margin = withMargin ? parseInt(getComputedStyle(element).marginTop) : 0;
        window.scrollTo({
            top: targetOffset - margin,
            behavior: "smooth",
        });
    };

    const makeSmallCard = (concert, card) => {
        const smallCard = document.createElement("article");
        smallCard.classList.add("small-concert");
        smallCard.innerHTML = `
            <h5>${concert.town}</h5>
            <h4>${concert.title}</h4>
            <h6>${concert.date}</h6>
        `;
        smallCard.addEventListener("click", () => {
            scrollToElement(card, true);
        });
        return smallCard;
    };

    const makeCard = (concert) => {
        const linkHtml = concert.link === undefined && concert.map === undefined ? "" : `
            <div class="right">
                ${concert.link === undefined ? "" : `<a class="primary" role="button" href="${concert.link}" target="_blank">Weitere Infos</a>`}
                ${concert.map === undefined ? "" : `<a class="secondary" role="button" href="${concert.map}" target="_blank">Karte</a>`}
            </div>
        `
        const card = document.createElement("article");
        card.classList.add("concert");
        card.innerHTML = `
            <hgroup>
                <h3>${concert.title}</h5>
                <h4>${concert.subtitle}</h4>
            </hgroup>
            <div class="grid">
                <div>
                    <strong>Wo?</strong>
                    ${concert.location}, ${concert.town}
                </div>
                <div>
                    <strong>Wann?</strong>
                    Am ${concert.date} um ${concert.time}
                </div>
            </div>
            ${linkHtml}
        `;
        return card;
    };

    concerts.forEach(concert => {
        const card = makeCard(concert);
        const smallCard = makeSmallCard(concert, card);
        smallConcertsDiv.appendChild(smallCard);
        concertsDiv.appendChild(card);
    });

    links.forEach(a => {
        a.addEventListener("click", evt => {
            evt.preventDefault();
            const href = a.getAttribute("href");
            const target = document.querySelector(href);
            scrollToElement(target);
            history.pushState(null, null, href);
        });
    });
    document.querySelector("#home").addEventListener("click", () => {
        // scroll to the top
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    })
    // window.addEventListener("scroll", evt => {
    //     const scrollY = window.scrollY;
    //     const navHeight = nav.offsetHeight;
    //     if (scrollY > navHeight) {
    //         nav.classList.add("fixed");
    //     } else {
    //         nav.classList.remove("fixed");
    //     }
    //     // update active link
    //     links.forEach(a => {
    //         const href = a.getAttribute("href");
    //         const target = document.querySelector(href);
    //         const offset = nav.offsetHeight;
    //         const targetOffset = target.offsetTop - offset;
    //         if (scrollY >= targetOffset) {
    //             links.forEach(a => a.classList.remove("focus"));
    //             a.classList.add("focus");
    //             return;
    //         }
    //     });
    // })
});