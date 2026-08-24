/* =========================================================
   WHO-ANTHRO-DATA.JS
   KLINIK PUTRA MEDIKA

   WHO Child Growth Standards 2006
   WHO Reference 2007

   ENGINE DATABASE ANTROPOMETRI ANAK
========================================================= */

(function () {

    "use strict";

    console.log("======================================");
    console.log("WHO ANTHRO DATA ENGINE");
    console.log("Klinik Putra Medika");
    console.log("======================================");


    /* =====================================================
       VERSI
    ===================================================== */

    const VERSION = {
        under5: "WHO Child Growth Standards 2006",
        schoolAge: "WHO Reference 2007"
    };


    /* =====================================================
       BATAS USIA
    ===================================================== */

    const LIMITS = {

        under5: {
            minDays: 0,
            maxDays: 1856,
            maxCompletedMonths: 60
        },

        schoolAge: {
            minCompletedMonths: 61,
            maxCompletedMonths: 228
        },

        weightForAgeSchool: {
            minCompletedMonths: 61,
            maxCompletedMonths: 120
        }

    };


    /* =====================================================
       DATABASE
       
       Struktur ini akan menerima tabel WHO resmi.

       Format:
       
       database[sex][indicator][age] = {
           L: ...,
           M: ...,
           S: ...
       }

       Untuk:
       WFA / HFA / BFA:
           age = bulan/hari sesuai dataset

       Untuk WHZ:
           age = panjang/tinggi badan
    ===================================================== */

    const DATABASE = {

        male: {

            weightForAge: {
                under5: {},
                schoolAge: {}
            },

            heightForAge: {
                under5: {},
                schoolAge: {}
            },

            weightForLengthHeight: {
                under5: {}
            },

            bmiForAge: {
                under5: {},
                schoolAge: {}
            }

        },

        female: {

            weightForAge: {
                under5: {},
                schoolAge: {}
            },

            heightForAge: {
                under5: {},
                schoolAge: {}
            },

            weightForLengthHeight: {
                under5: {}
            },

            bmiForAge: {
                under5: {},
                schoolAge: {}
            }

        }

    };


    /* =====================================================
       SEX
    ===================================================== */

    function normalizeSex(sex) {

        if (sex === undefined || sex === null) {
            return null;
        }

        const s = String(sex)
            .trim()
            .toLowerCase();

        if (
            s === "male" ||
            s === "m" ||
            s === "boy" ||
            s === "laki" ||
            s === "laki-laki"
        ) {
            return "male";
        }

        if (
            s === "female" ||
            s === "f" ||
            s === "girl" ||
            s === "perempuan"
        ) {
            return "female";
        }

        return null;
    }


    /* =====================================================
       ANGKA
    ===================================================== */

    function number(value) {

        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : null;
    }


    /* =====================================================
       PEMBULATAN
    ===================================================== */

    function round(value, digits = 2) {

        if (!Number.isFinite(value)) {
            return null;
        }

        const p = Math.pow(10, digits);

        return Math.round(value * p) / p;
    }


    /* =====================================================
       BMI
    ===================================================== */

    function calculateBMI(weightKg, heightCm) {

        const weight = number(weightKg);
        const height = number(heightCm);

        if (
            weight === null ||
            height === null ||
            weight <= 0 ||
            height <= 0
        ) {
            return null;
        }

        const meter = height / 100;

        return round(
            weight / (meter * meter),
            2
        );
    }


    /* =====================================================
       AGE GROUP
    ===================================================== */

    function getAgeGroup(ageDays, ageMonths) {

        const days = number(ageDays);
        const months = number(ageMonths);

        if (
            days !== null &&
            days >= 0 &&
            days <= 1856
        ) {
            return "under5";
        }

        if (
            months !== null &&
            months >= 61 &&
            months <= 228
        ) {
            return "schoolAge";
        }

        return null;
    }


    /* =====================================================
       DATABASE GETTER
    ===================================================== */

    function getDatabase(
        sex,
        indicator,
        ageGroup
    ) {

        const gender = normalizeSex(sex);

        if (!gender) {
            return null;
        }

        if (!DATABASE[gender]) {
            return null;
        }

        if (!DATABASE[gender][indicator]) {
            return null;
        }

        if (!DATABASE[gender][indicator][ageGroup]) {
            return null;
        }

        return DATABASE[gender][indicator][ageGroup];
    }


    /* =====================================================
       LMS VALIDATOR
    ===================================================== */

    function validLMS(lms) {

        if (!lms) {
            return false;
        }

        const L = number(lms.L);
        const M = number(lms.M);
        const S = number(lms.S);

        return (
            L !== null &&
            M !== null &&
            S !== null &&
            M > 0 &&
            S > 0
        );
    }


    /* =====================================================
       SORT DATABASE
    ===================================================== */

    function sortedKeys(database) {

        return Object.keys(database)
            .map(Number)
            .filter(Number.isFinite)
            .sort((a, b) => a - b);
    }


    /* =====================================================
       INTERPOLASI LMS
    ===================================================== */

    function interpolateLMS(database, x) {

        if (!database) {
            return null;
        }

        const value = number(x);

        if (value === null) {
            return null;
        }

        const keys = sortedKeys(database);

        if (!keys.length) {
            return null;
        }


        /* Exact */

        const exactKey = String(value);

        if (
            database[exactKey] &&
            validLMS(database[exactKey])
        ) {

            return {
                L: number(database[exactKey].L),
                M: number(database[exactKey].M),
                S: number(database[exactKey].S),
                interpolated: false
            };

        }


        /* Range */

        if (
            value < keys[0] ||
            value > keys[keys.length - 1]
        ) {
            return null;
        }


        let lower = null;
        let upper = null;

        for (
            let i = 0;
            i < keys.length - 1;
            i++
        ) {

            if (
                value >= keys[i] &&
                value <= keys[i + 1]
            ) {

                lower = keys[i];
                upper = keys[i + 1];

                break;
            }
        }

        if (
            lower === null ||
            upper === null
        ) {
            return null;
        }


        const a = database[String(lower)];
        const b = database[String(upper)];

        if (
            !validLMS(a) ||
            !validLMS(b)
        ) {
            return null;
        }


        const ratio =
            (value - lower) /
            (upper - lower);


        return {

            L:
                a.L +
                (b.L - a.L) * ratio,

            M:
                a.M +
                (b.M - a.M) * ratio,

            S:
                a.S +
                (b.S - a.S) * ratio,

            interpolated: true

        };

    }


    /* =====================================================
       LMS → Z SCORE
    ===================================================== */

    function calculateZScore(
        measurement,
        L,
        M,
        S
    ) {

        const X = number(measurement);
        const l = number(L);
        const m = number(M);
        const s = number(S);

        if (
            X === null ||
            l === null ||
            m === null ||
            s === null
        ) {
            return null;
        }

        if (
            X <= 0 ||
            M <= 0 ||
            S <= 0
        ) {
            return null;
        }


        let z;


        if (
            Math.abs(l) < 0.000001
        ) {

            z =
                Math.log(X / m) / s;

        } else {

            z =
                (
                    Math.pow(X / m, l) - 1
                ) /
                (l * s);

        }


        if (!Number.isFinite(z)) {
            return null;
        }

        return z;
    }


    /* =====================================================
       Z SCORE
    ===================================================== */

    function getZScore(options) {

        if (!options) {
            return null;
        }

        const {
            sex,
            indicator,
            ageGroup,
            x,
            measurement
        } = options;


        const database =
            getDatabase(
                sex,
                indicator,
                ageGroup
            );

        if (!database) {

            return {
                success: false,
                reason: "Database WHO tidak tersedia."
            };

        }


        const lms =
            interpolateLMS(
                database,
                x
            );

        if (!lms) {

            return {
                success: false,
                reason:
                    "Nilai referensi WHO tidak ditemukan."
            };

        }


        const z =
            calculateZScore(
                measurement,
                lms.L,
                lms.M,
                lms.S
            );


        if (z === null) {

            return {
                success: false,
                reason:
                    "Z-score tidak dapat dihitung."
            };

        }


        return {

            success: true,

            zScore:
                round(z, 2),

            L: lms.L,

            M: lms.M,

            S: lms.S,

            interpolated:
                lms.interpolated

        };

    }


    /* =====================================================
       NORMAL CDF
       
       Untuk estimasi percentile.
    ===================================================== */

    function normalCDF(z) {

        const x = number(z);

        if (x === null) {
            return null;
        }

        const sign =
            x < 0 ? -1 : 1;

        const abs =
            Math.abs(x);

        const t =
            1 /
            (
                1 +
                0.2316419 * abs
            );

        const d =
            0.3989423 *
            Math.exp(
                -abs * abs / 2
            );

        const probability =
            d *
            t *
            (
                0.3193815 +
                t *
                (
                    -0.3565638 +
                    t *
                    (
                        1.781478 +
                        t *
                        (
                            -1.821256 +
                            t *
                            1.330274
                        )
                    )
                )
            );

        const cdf =
            sign === 1
                ? 1 - probability
                : probability;

        return cdf;
    }


    /* =====================================================
       PERCENTILE
    ===================================================== */

    function zToPercentile(z) {

        const p =
            normalCDF(z);

        if (p === null) {
            return null;
        }

        return round(
            p * 100,
            1
        );
    }


    /* =====================================================
       KLASIFIKASI BMI/U
    ===================================================== */

    function classifyBMIForAge(z) {

        if (!Number.isFinite(z)) {
            return null;
        }

        if (z < -3) {

            return {
                category: "severe_thinness",
                label: "Sangat kurus",
                degree: "< -3 SD"
            };

        }

        if (z < -2) {

            return {
                category: "thinness",
                label: "Kurus",
                degree: "≥ -3 SD sampai < -2 SD"
            };

        }

        if (z <= 1) {

            return {
                category: "normal",
                label: "Normal",
                degree: "≥ -2 SD sampai ≤ +1 SD"
            };

        }

        if (z <= 2) {

            return {
                category: "overweight",
                label: "Gemuk",
                degree: "> +1 SD sampai ≤ +2 SD"
            };

        }

        return {

            category: "obesity",

            label: "Obesitas",

            degree: "> +2 SD"

        };
    }


    /* =====================================================
       KLASIFIKASI TB/U
    ===================================================== */

    function classifyHeightForAge(z) {

        if (!Number.isFinite(z)) {
            return null;
        }

        if (z < -3) {

            return {
                category: "severely_stunted",
                label: "Sangat pendek",
                degree: "< -3 SD"
            };

        }

        if (z < -2) {

            return {
                category: "stunted",
                label: "Pendek",
                degree: "≥ -3 SD sampai < -2 SD"
            };

        }

        return {

            category: "normal",

            label: "Normal",

            degree: "≥ -2 SD"

        };
    }


    /* =====================================================
       KLASIFIKASI BB/U
    ===================================================== */

    function classifyWeightForAge(z) {

        if (!Number.isFinite(z)) {
            return null;
        }

        if (z < -3) {

            return {
                category: "severely_underweight",
                label: "Berat badan sangat kurang",
                degree: "< -3 SD"
            };

        }

        if (z < -2) {

            return {
                category: "underweight",
                label: "Berat badan kurang",
                degree: "≥ -3 SD sampai < -2 SD"
            };

        }

        return {

            category: "normal",

            label: "Berat badan normal",

            degree: "≥ -2 SD"

        };
    }


    /* =====================================================
       KLASIFIKASI BB/PB ATAU BB/TB
    ===================================================== */

    function classifyWeightForHeight(z) {

        if (!Number.isFinite(z)) {
            return null;
        }

        if (z < -3) {

            return {
                category: "severely_wasted",
                label: "Sangat kurus",
                degree: "< -3 SD"
            };

        }

        if (z < -2) {

            return {
                category: "wasted",
                label: "Kurus",
                degree: "≥ -3 SD sampai < -2 SD"
            };

        }

        if (z <= 2) {

            return {
                category: "normal",
                label: "Normal",
                degree: "≥ -2 SD sampai ≤ +2 SD"
            };

        }

        if (z <= 3) {

            return {
                category: "overweight",
                label: "Berat badan lebih",
                degree: "> +2 SD sampai ≤ +3 SD"
            };

        }

        return {

            category: "obesity",

            label: "Obesitas",

            degree: "> +3 SD"

        };
    }


    /* =====================================================
       STATUS DATABASE
    ===================================================== */

    function getDatabaseStatus() {

        const result = {};

        for (
            const sex of
            ["male", "female"]
        ) {

            result[sex] = {};

            for (
                const indicator of
                Object.keys(DATABASE[sex])
            ) {

                result[sex][indicator] = {};

                for (
                    const ageGroup of
                    Object.keys(
                        DATABASE[sex][indicator]
                    )
                ) {

                    result[sex][indicator][ageGroup] =
                        Object.keys(
                            DATABASE[sex][indicator][ageGroup]
                        ).length;
                }
            }
        }

        return result;
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.WHO_ANTHRO = {

        version: VERSION,

        limits: LIMITS,

        data: DATABASE,

        normalizeSex,

        getAgeGroup,

        getDatabase,

        getLMS: interpolateLMS,

        calculateBMI,

        calculateZScore,

        getZScore,

        zToPercentile,

        classifyBMIForAge,

        classifyHeightForAge,

        classifyWeightForAge,

        classifyWeightForHeight,

        databaseStatus:
            getDatabaseStatus

    };


    /* =====================================================
       READY FLAG
    ===================================================== */

    window.WHO_ANTHRO_READY = true;


    /* =====================================================
       EVENT
    ===================================================== */

    document.dispatchEvent(
        new CustomEvent(
            "whoAnthroReady"
        )
    );


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "WHO_ANTHRO tersedia:",
        !!window.WHO_ANTHRO
    );

    console.log(
        "WHO_ANTHRO_READY:",
        window.WHO_ANTHRO_READY
    );

    console.log(
        "Database status:",
        getDatabaseStatus()
    );

})();
