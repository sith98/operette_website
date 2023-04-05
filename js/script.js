

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
        const dateString = concert.date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        const smallCard = document.createElement("article");
        smallCard.classList.add("small-concert");
        smallCard.innerHTML = `
            <h5>${concert.locationShort}</h5>
            <h4>${concert.title}</h4>
            <h6>${dateString}</h6>
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
                ${concert.map === undefined ? "" : `<a class="secondary" role="button" href="${concert.map}" target="_blank">Ort auf Karte anzeigen</a>`}
            </div>
        `
        const weekday = concert.date.toLocaleDateString("de-DE", { weekday: "long" });
        const date = concert.date.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" });
        const time = concert.date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        const card = document.createElement("article");
        card.classList.add("concert");

        const title = concert.subtitle === undefined ? `<h3 class="single">${concert.title}</h3>` : `
            <hgroup>
                <h3>${concert.title}</h3>
                <h4>${concert.subtitle}</h4>
            </hgroup>
        `
        card.innerHTML = `
            ${title}
            <div class="grid">
                <div>
                    <div>
                        <strong>Wo?</strong>
                        ${concert.location}
                    </div>
                    <div>
                        <strong>Wann?</strong>
                        Am ${weekday}, den ${date} um ${time} Uhr
                    </div>
                    ${concert.info === undefined ? "" : `<div><em>${concert.info}</em></div>`}
                </div>
                ${linkHtml}
            </div>
        `;
        return card;
    };

    fetch("concerts.json").then(res => res.json()).then(concerts => {
        smallConcertsDiv.innerHTML = "";
        concertsDiv.innerHTML = "";
        const now = new Date();
        const filteredConcerts = concerts
            .map(concert => ({ ...concert, date: new Date(concert.date) }))
            .filter(concert => concert.date >= now);
        filteredConcerts.sort((a, b) => a.date - b.date);
        filteredConcerts.forEach((concert, i) => {
            const card = makeCard(concert);
            concertsDiv.appendChild(card);
            if (i < 3) {
                const smallCard = makeSmallCard(concert, card);
                smallConcertsDiv.appendChild(smallCard);
            }
        });
        if (filteredConcerts.length === 0) {
            smallConcertsDiv.innerHTML = "<p><em>Keine aktuellen Konzerte geplant.</em></p>";
        }
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