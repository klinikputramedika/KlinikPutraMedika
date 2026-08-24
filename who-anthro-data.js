/* =========================================================
   WHO ANTHRO DATA
   Klinik Putra Medika

   WHO Child Growth Standards:
   - 0–60 bulan
   - Weight-for-age
   - Length/height-for-age
   - Weight-for-length/height
   - BMI-for-age

   WHO Reference 2007:
   - 5–19 tahun
   ========================================================= */

(function () {

    "use strict";

    console.log("======================================");
    console.log("WHO-ANTHRO-DATA.JS BERHASIL DIMUAT");
    console.log("======================================");


    /*
     * ======================================================
     * VERSI DATABASE
     * ======================================================
     */

    const WHO_ANTHRO_VERSION = "WHO Child Growth Standards 2006";
    const WHO_REFERENCE_VERSION = "WHO Reference 2007";


    /*
     * ======================================================
     * RENTANG USIA
     * ======================================================
     */

    const WHO_LIMITS = {

        under5: {
            minDays: 0,
            maxDays: 1856
        },

        fiveTo19: {
            minMonths: 61,
            maxMonths: 228
        }

    };


    /*
     * ======================================================
     * CUT-OFF STATUS GIZI
     *
     * Digunakan oleh gizi-anak.js
     * ======================================================
     */

    const WHO_CUTOFFS = {

        /*
         * Tinggi/Panjang menurut Umur
         */
        heightForAge: {

            severe: -3,
            moderate: -2

        },


        /*
         * Berat menurut Umur
         */
        weightForAge: {

            severe: -3,
            moderate: -2

        },


        /*
         * BB menurut PB/TB
         */
        weightForHeight: {

            severeLow: -3,
            low: -2,
            high: 2,
            severeHigh: 3

        },


        /*
         * IMT menurut Umur
         */
        bmiForAge: {

            severeThinness: -3,
            thinness: -2,
            overweight: 1,
            obesity: 2

        }

    };


    /*
     * ======================================================
     * LABEL MEDIS
     * ======================================================
     *
     * Jangan menggunakan istilah:
     * "kurang gizi", "cukup", "berlebih"
     * sebagai satu kategori universal.
     *
     * Karena indikator memiliki interpretasi berbeda.
     */

    const WHO_LABELS = {

        heightForAge: {

            belowMinus3:
                "Sangat pendek",

            minus3ToBelowMinus2:
                "Pendek",

            minus2OrHigher:
                "Normal"

        },


        weightForAge: {

            belowMinus3:
                "Berat badan sangat kurang",

            minus3ToBelowMinus2:
                "Berat badan kurang",

            minus2OrHigher:
                "Berat badan normal"

        },


        bmiForAge: {

            belowMinus3:
                "Sangat kurus",

            minus3ToBelowMinus2:
                "Kurus",

            minus2ToPlus1:
                "Normal",

            abovePlus1ToPlus2:
                "Gemuk",

            abovePlus2:
                "Obesitas"

        }

    };


    /*
     * ======================================================
     * STRUKTUR DATA WHO
     * ======================================================
     *
     * Untuk sementara struktur dibuat kosong.
     *
     * Data LMS WHO yang sebenarnya akan ditempatkan
     * di bagian ini, bukan angka buatan.
     */

    const WHO_DATA = {

        /*
         * Anak laki-laki
         */
        male: {

            weightForAge: {},

            heightForAge: {},

            weightForLength: {},

            weightForHeight: {},

            bmiForAge: {}

        },


        /*
         * Anak perempuan
         */
        female: {

            weightForAge: {},

            heightForAge: {},

            weightForLength: {},

            weightForHeight: {},

            bmiForAge: {}

        }

    };


    /*
     * ======================================================
     * UTILITAS
     * ======================================================
     */

    function getSex(sex) {

        if (!sex) {
            return null;
        }

        const value = String(sex).toLowerCase();

        if (
            value === "male" ||
            value === "m" ||
            value === "laki-laki" ||
            value === "laki"
        ) {

            return "male";

        }

        if (
            value === "female" ||
            value === "f" ||
            value === "perempuan"
        ) {

            return "female";

        }

        return null;

    }


    /*
     * ======================================================
     * CEK DATA WHO
     * ======================================================
     */

    function hasWHOData(
        indicator,
        sex
    ) {

        const gender = getSex(sex);

        if (!gender) {
            return false;
        }

        if (!WHO_DATA[gender]) {
            return false;
        }

        if (!WHO_DATA[gender][indicator]) {
            return false;
        }

        return (
            Object.keys(
                WHO_DATA[gender][indicator]
            ).length > 0
        );

    }


    /*
     * ======================================================
     * GET WHO DATA
     * ======================================================
     */

    function getWHOData(
        indicator,
        sex
    ) {

        const gender = getSex(sex);

        if (!gender) {
            return null;
        }

        if (!WHO_DATA[gender]) {
            return null;
        }

        return (
            WHO_DATA[gender][indicator] || null
        );

    }


    /*
     * ======================================================
     * GET CUTOFF
     * ======================================================
     */

    function getWHOCutoffs(
        indicator
    ) {

        return (
            WHO_CUTOFFS[indicator] || null
        );

    }


    /*
     * ======================================================
     * GET LABEL
     * ======================================================
     */

    function getWHOLabels(
        indicator
    ) {

        return (
            WHO_LABELS[indicator] || null
        );

    }


    /*
     * ======================================================
     * PUBLIC API
     * ======================================================
     */

    window.WHO_ANTHRO = {

        version:
            WHO_ANTHRO_VERSION,

        referenceVersion:
            WHO_REFERENCE_VERSION,

        limits:
            WHO_LIMITS,

        cutoffs:
            WHO_CUTOFFS,

        labels:
            WHO_LABELS,

        data:
            WHO_DATA,

        getSex:
            getSex,

        hasData:
            hasWHOData,

        getData:
            getWHOData,

        getCutoffs:
            getWHOCutoffs,

        getLabels:
            getWHOLabels

    };


    /*
     * ======================================================
     * DEBUG
     * ======================================================
     */

    console.log(
        "WHO_ANTHRO tersedia:",
        !!window.WHO_ANTHRO
    );

    console.log(
        "Versi:",
        WHO_ANTHRO_VERSION
    );

})();
