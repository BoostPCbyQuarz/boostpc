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
// Zoom au scroll sur les cartes résultats (mobile) - déclenché quand le bloc est proche du centre de l'écran
document.addEventListener('DOMContentLoaded', function () {

    const resultCards = document.querySelectorAll('.result-card');

    if (resultCards.length > 0) {

        function updateZoomOnScroll() {

            const screenCenter = window.innerHeight / 2;

            resultCards.forEach(function (card) {

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + (rect.height / 2);
                const distanceFromCenter = Math.abs(screenCenter - cardCenter);

             // Le bloc est considéré "au centre" seulement s'il est plus proche que la moitié de sa propre hauteur
                if (distanceFromCenter < rect.height * 0.6) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }   

            });
        }

        window.addEventListener('scroll', updateZoomOnScroll);
        updateZoomOnScroll(); // vérifie une première fois au chargement
    }

});