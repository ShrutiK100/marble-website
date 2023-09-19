document.addEventListener("DOMContentLoaded", function () {
    new Swiper('#marbleCarousel', {
        // Optional parameters
        loop: true,
        slidesPerView: 1,
        breakpoints: {
            786: {
                slidesPerView: 3,
                centeredSlides: true
            }
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});