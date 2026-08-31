/* =========================================================
   KLINIK PUTRA MEDIKA
   RESPONSIVE NAVBAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const navToggle = document.getElementById("navToggle");
    const siteNav = document.getElementById("siteNav");

    if (!navToggle || !siteNav) {
        return;
    }

    function openMenu() {
        siteNav.classList.add("is-open");
        navToggle.classList.add("is-open");

        navToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        navToggle.setAttribute(
            "aria-label",
            "Tutup menu"
        );

        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");

        navToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        navToggle.setAttribute(
            "aria-label",
            "Buka menu"
        );

        document.body.classList.remove("menu-open");
    }

    function toggleMenu() {

        const isOpen =
            siteNav.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    }

    navToggle.addEventListener(
        "click",
        toggleMenu
    );

    /* Tutup menu setelah memilih halaman */

    siteNav
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                closeMenu
            );

        });

    /* Tutup ketika klik di luar navbar */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !siteNav.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                closeMenu();
            }

        }
    );

    /* Tutup dengan tombol Escape */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );

    /* Jika layar kembali desktop,
       pastikan menu mobile ditutup */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 800) {
                closeMenu();
            }

        }
    );

    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    siteNav
        .querySelectorAll("a")
        .forEach(function (link) {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const linkPage =
                href
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();

            link.classList.remove("active");

            if (
                (currentPage === "" &&
                    linkPage === "index.html") ||

                linkPage === currentPage
            ) {
                link.classList.add("active");
            }

        });

});
