document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("vision-mode") === "on") {
        document.body.classList.add("vision-mode");
    }

    document.querySelectorAll("img").forEach(img => {
        if (img.classList.contains("logo-img")) return;

        if (!img.parentElement.classList.contains("img-box")) {
            const wrapper = document.createElement("div");
            wrapper.className = "img-box";

            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }

        img.parentElement.setAttribute(
            "data-alt",
            img.alt || "Изображение"
        );
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        if (window.location.href.indexOf(link.getAttribute("href")) > 0) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
});