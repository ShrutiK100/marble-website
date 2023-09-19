document.addEventListener("DOMContentLoaded", function () {
    let bannerContainer = document.getElementById('banner');

    const earth = Globe();
    earth(bannerContainer)
        .width(bannerContainer.offsetWidth)
        .height(bannerContainer.offsetHeight)
        .backgroundColor('#000000')
        .globeImageUrl('images/marble-globe-overlay.png')
    // Auto-rotate
    earth.controls().autoRotate = true;
    earth.controls().autoRotateSpeed = 0.35;

    // Remove zoom on mouse scroll
    earth.controls().enableZoom = false;
});
