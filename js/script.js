// Lightbox pour les images d'avis Discord
document.addEventListener('DOMContentLoaded', function () {

    const sideImages = document.querySelectorAll('.testimonials-side-images img');

    if (sideImages.length > 0) {

        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';

        const overlayImg = document.createElement('img');
        overlay.appendChild(overlayImg);

        document.body.appendChild(overlay);

        sideImages.forEach(function (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function () {
                overlayImg.src = img.src;
                overlay.classList.add('active');
            });
        });

        overlay.addEventListener('click', function () {
            overlay.classList.remove('active');
        });
    }

});

// Zoom au scroll sur les cartes résultats (mobile)
document.addEventListener('DOMContentLoaded', function () {

    const resultCards = document.querySelectorAll('.result-card');

    if (resultCards.length > 0) {

        function updateZoomOnScroll() {

            const screenCenter = window.innerHeight / 2;

            resultCards.forEach(function (card) {

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + (rect.height / 2);
                const distanceFromCenter = Math.abs(screenCenter - cardCenter);

                if (distanceFromCenter < rect.height * 0.6) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }

            });
        }

        window.addEventListener('scroll', updateZoomOnScroll);
        updateZoomOnScroll();
    }

});

// Vérification du statut Twitch via API officielle
const TWITCH_CLIENT_ID = "ijkbip2a9i70iu22tjl0hoi04u50y9";
const TWITCH_TOKEN = "1q9bq1f4401hwmgj25bwqyh7rk5nyx";

async function checkTwitchStatus(channel, voyantEl, statutEl, carteEl) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
                "Client-ID": TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${TWITCH_TOKEN}`
            }
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            voyantEl.className = "voyant voyant-online";
            statutEl.textContent = "EN DIRECT";
            statutEl.className = "statut statut-live";
            carteEl.classList.add("carte-live");
            carteEl.classList.remove("carte-offline"); 
        } else {
            voyantEl.className = "voyant voyant-offline";
            statutEl.textContent = "En ligne : Non";
            statutEl.className = "statut";
            carteEl.classList.remove("carte-live");
            carteEl.classList.add("carte-offline");
        }

        // Trier les cartes : live en premier
        trierCartes();

    } catch (error) {
        console.log("Erreur Twitch :", error);
    }
}

function trierCartes() {
    const container = document.querySelector(".partners-container-twitch");
    if (!container) return;

    const cartes = Array.from(container.querySelectorAll(".carte-twitch"));

    // Séparer live et offline
    const cartesLive = cartes.filter(c => c.classList.contains("carte-live"));
    const cartesOffline = cartes.filter(c => !c.classList.contains("carte-live"));

    // Remettre dans le bon ordre : live d'abord puis offline
    [...cartesLive, ...cartesOffline].forEach(carte => container.appendChild(carte));
}

document.addEventListener('DOMContentLoaded', function () {

    const cartes = document.querySelectorAll(".carte-twitch");

    if (cartes.length > 0) {

        const voyant1 = cartes[0].querySelector(".voyant");
        const statut1 = cartes[0].querySelector(".statut");

        const voyant2 = cartes[1] ? cartes[1].querySelector(".voyant") : null;
        const statut2 = cartes[1] ? cartes[1].querySelector(".statut") : null;

        const voyant3 = cartes[2] ? cartes[2].querySelector(".voyant") : null;
        const statut3 = cartes[2] ? cartes[2].querySelector(".statut") : null;

        checkTwitchStatus("sylvain2500", voyant1, statut1, cartes[0]);
        if (voyant2 && statut2) checkTwitchStatus("voldarks81540", voyant2, statut2, cartes[1]);
        if (voyant3 && statut3) checkTwitchStatus("miss_dixon", voyant3, statut3, cartes[2]);

        setInterval(() => {
            const cartesActuelles = document.querySelectorAll(".carte-twitch");
            cartesActuelles.forEach(carte => {
                const nom = carte.querySelector("h3").textContent.toLowerCase().replace(" ", "");
                const voyant = carte.querySelector(".voyant");
                const statut = carte.querySelector(".statut");

                if (nom.includes("sylvain")) checkTwitchStatus("sylvain2500", voyant, statut, carte);
                if (nom.includes("voldark")) checkTwitchStatus("voldarks81540", voyant, statut, carte);
                if (nom.includes("miss_dixon") || nom.includes("dixon")) checkTwitchStatus("miss_dixon", voyant, statut, carte);
            });
        }, 30000);
    }

});