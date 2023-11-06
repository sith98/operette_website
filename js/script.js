const concerts = fetch("concerts.json", {
    credentials: "same-origin",
}).then(res => res.json());
const gallery = fetch("gallery.txt", { priority: "low" }).then(res => res.text());
const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const smallConcertsLinkContainer = document.querySelector(".small-concerts-link")
    const smallConcertsLink = smallConcertsLinkContainer.querySelector("a");
    const links = [...document.querySelectorAll("nav .links a"), smallConcertsLink];
    const smallConcertsDiv = document.querySelector(".small-concerts");
    const concertsDiv = document.querySelector(".concerts");

    //
    // Navbar
    //

    const adjustMainPadding = () => {
        const main = document.querySelector("main");
        const navHeight = nav.offsetHeight;
        main.style.paddingTop = `${navHeight}px`;
    }
    adjustMainPadding();
    window.addEventListener("resize", adjustMainPadding);

    const scrollToElement = (element, withMargin = false) => {
        const offset = nav.offsetHeight;
        const targetOffset = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const margin = withMargin ? parseInt(getComputedStyle(element).marginTop) : 0;
        window.scrollTo({
            top: targetOffset - margin,
            behavior: "smooth",
        });
    };

    const getUrlHash = (url) => {
        const hash = new URL(url).hash;
        if (hash === "") {
            return null;
        }
        return hash;
    }

    const hash = getUrlHash(window.location.href);

    document.querySelectorAll("nav a").forEach(a => {
        a.addEventListener("click", evt => {
            a.focus();
            a.blur();
        });
    });

    links.forEach(a => {
        if (getUrlHash(a.href) === hash) {
            // add attribute aria-current="page" to the link
            a.setAttribute("aria-current", "page");
        }
        a.addEventListener("click", evt => {
            if (a.classList.contains("icon")) {
                return;
            }
            evt.preventDefault();
            const href = a.getAttribute("href");
            const target = document.querySelector(href);
            scrollToElement(target);
            history.pushState(null, null, href);

            links.forEach(a => a.removeAttribute("aria-current"));
            a.setAttribute("aria-current", "page");
        });
    });
    document.querySelector("#home").addEventListener("click", () => {
        // scroll to the top
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        history.pushState(null, null, null);
        links.forEach(a => a.removeAttribute("aria-current"));
    });

    //
    // Concerts
    //

    const makeSmallCard = (concert, card, id) => {
        const today = new Date(new Date().toDateString());
        const day = new Date(concert.date.toDateString());
        const timeString = concert.date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        let dateString = concert.date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        let specialDate = false;
        console.log(day, today, day - today)
        if (day - today === 0) {
            dateString = concert.withTime ? `Heute um ${timeString}` : "Heute";
            specialDate = true;
        } else if (day - today === 3600 * 24 * 1000) {
            dateString = concert.withTime ? `Morgen um ${timeString}` : "Morgen";
            specialDate = true;
        } else if (day - today <= 3600 * 24 * 1000 * 6) {
            dateString = "Kommenden " + concert.date.toLocaleDateString("de-DE", { weekday: "long" });
            specialDate = true;
        }
        const smallCard = document.createElement("article");
        smallCard.classList.add("small-concert");
        smallCard.setAttribute("tabindex", "0");
        smallCard.id = id;
        smallCard.innerHTML = `
            <div>${concert.locationShort}</div>
            <div>${concert.title}</div>
            <div ${specialDate ? `class="special-date"` : ""}>${dateString}</div>
        `;
        smallCard.addEventListener("click", () => {
            scrollToElement(card, true);
            links.forEach(a => a.removeAttribute("aria-current"));
            const link = document.querySelector('a[href*="#concerts"]')
            link.setAttribute("aria-current", "page");
            history.pushState(null, null, link.getAttribute("href"));
            // defocus the card
            smallCard.blur();
        });
        return smallCard;
    };

    const makeCard = (concert, id) => {
        const linkHtml = concert.link === undefined && concert.map === undefined ? "" : `
            <div class="right">
                ${concert.link === undefined ? "" : `<a class="primary" role="button" href="${concert.link}" target="_blank">Weitere Infos ${linkIcon}</a>`}
                ${concert.map === undefined ? "" : `<a class="secondary" role="button" href="${concert.map}" target="_blank">Auf Karte anzeigen ${linkIcon}</a>`}
            </div>
        `
        const weekday = concert.date.toLocaleDateString("de-DE", { weekday: "long" });
        const date = concert.date.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" });
        const time = concert.date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

        const timeString = concert.withTime ?
            `<span>Am ${weekday},</span> <span>den ${date}</span> <span>um ${time} Uhr</span>` :
            `<span>Am ${weekday},</span> <span>den ${date}</span>`;

        const card = document.createElement("article");
        card.classList.add("concert");
        card.id = id;

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
                        ${timeString}
                    </div>
                    ${concert.info === undefined ? "" : `<div><em>${concert.info}</em></div>`}
                </div>
                ${linkHtml}
            </div>
        `;
        return card;
    };

    concerts.then(concerts => {
        smallConcertsDiv.innerHTML = "";
        concertsDiv.innerHTML = "";
        const today = new Date(new Date().toDateString());
        const filteredConcerts = concerts
            .map(concert => ({
                ...concert,
                locationShort: concert.locationShort ?? concert.location,
                date: new Date(concert.date),
                withTime: concert.date.includes("T")
            }))
            .filter(concert => concert.date >= today);
        filteredConcerts.sort((a, b) => a.date - b.date);
        filteredConcerts.forEach((concert, i) => {
            const id = `concert-${i}`;
            // console.log("test")
            const card = makeCard(concert, id);
            concertsDiv.appendChild(card);
            // if (i < 3) {
            const smallCard = makeSmallCard(concert, card, id);
            smallConcertsDiv.appendChild(smallCard);
            // }
        });
        if (filteredConcerts.length === 0) {
            smallConcertsDiv.innerHTML = concertsDiv.innerHTML = "<p><em>Aktuell stehen noch keine zukünftigen Konzerttermine fest.</em></p>";
        }
        // if (filteredConcerts.length > 3) {
        //     smallConcertsLinkContainer.classList.remove("hidden");
        //     smallConcertsLink.href = "#concert-3"
        // }
    });

    //
    // Gallery
    //

    const makeGalleryLink = (fileName, title) => {
        const imageName = fileName.split(".").shift();
        const a = document.createElement("a");
        const src = `img/gallery/${fileName}`;
        a.href = src;
        const img = document.createElement("img");
        const thumbnailSrc = `img/gallery_thumbnails/${fileName}`;
        img.src = thumbnailSrc;
        img.alt = imageName;
        img.thumbnailFailed = false;
        if (title !== undefined) {
            img.title = title;
        }
        img.onerror = () => {
            if (img.thumbnailFailed) return;
            img.src = src;
            img.thumbnailFailed = true;
        };
        a.appendChild(img);
        return a;
    }

    gallery.then(text => {
        const gallery = document.querySelector(".gallery");
        const images = text.split("\n").filter(url => url !== "").map(url =>
            url.split(",").map(s => s.trim()).filter(s => s !== "")
        )
        images.forEach(([url, title]) => {
            const a = makeGalleryLink(url, title);
            gallery.appendChild(a);
        });

        new SimpleLightbox(".gallery a", { spinner: true, history: false });
    });


});