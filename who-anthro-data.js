/* =========================================================
   WHO ANTHRO DATA ENGINE
   Klinik Putra Medika

   WHO Growth Standard 0-5 tahun
   WHO Growth Reference 5-19 tahun

   Mesin WHO dimuat dari package browser yang memiliki
   LMS WHO embedded.

   Jangan menghapus type="module" pada HTML.
   ========================================================= */

console.log("======================================");
console.log("WHO ANTHRO ENGINE MEMULAI...");
console.log("======================================");

window.WHO_ANTHRO_READY = false;
window.WHO_ANTHRO = null;

import(
    "https://cdn.jsdelivr.net/npm/@who-growth/core@0.4.0/dist/index.js"
)
.then(function (WHO) {

    console.log("WHO GROWTH ENGINE BERHASIL DIMUAT");

    window.WHO_ANTHRO = WHO;

    window.WHO_ANTHRO_READY = true;

    window.dispatchEvent(
        new CustomEvent("whoAnthroReady")
    );

    console.log(
        "WHO_ANTHRO_READY:",
        window.WHO_ANTHRO_READY
    );

})
.catch(function (error) {

    console.error(
        "GAGAL MEMUAT WHO GROWTH ENGINE:",
        error
    );

    window.WHO_ANTHRO_READY = false;

    window.dispatchEvent(
        new CustomEvent("whoAnthroError", {
            detail: error
        })
    );

});
