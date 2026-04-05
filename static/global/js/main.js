document.addEventListener("DOMContentLoaded", () => {

    /* <img>-Tags */
    document.querySelectorAll("img").forEach(img => {
        if (img.complete) {
            img.classList.add("is-loaded");
        } else {
            img.addEventListener("load", () => {
                img.classList.add("is-loaded");
            });
        }
    });

    /* Background-Images */
    document.querySelectorAll(".bg-image").forEach(el => {
        const bg = getComputedStyle(el).backgroundImage;
        const match = bg.match(/url\(["']?(.*?)["']?\)/);

        if (!match) return;

        const img = new Image();
        img.src = match[1];
        img.onload = () => el.classList.add("is-loaded");
    });

});

document.querySelectorAll("img").forEach(img => {
    img.loading = "lazy";
});