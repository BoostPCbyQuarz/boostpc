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