const menuBtn = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".close");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    overlay.classList.add("show");

    document.body.classList.add("no-scroll");
});
close.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
});

let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 70) {
        // Swiped Left
        sidebar.classList.add("hidden");
        overlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }
    if (startX < 30 && endX - startX > 50) {
      sidebar.classList.remove("hidden");
        overlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }
});
