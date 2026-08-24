/* =========================================================
   WHO ANTHRO ENGINE
   Klinik Putra Medika

   WHO Child Growth Standards 2006
   WHO Growth Reference 2007

   File ini menjadi ENGINE referensi untuk:
   - BB/U
   - PB/TB/U
   - BB/PB
   - BB/TB
   - IMT/U
   - Z-score LMS
   ========================================================= */

"use strict";

(function () {

    console.log("======================================");
    console.log("WHO ANTHRO ENGINE DIMUAT");
    console.log("======================================");


    /* =====================================================
       VERSI
    ===================================================== */

    const VERSION = {
        under5: "WHO Child Growth Standards 2006",
        five19: "WHO Growth Reference 2007"
    };


    /* =====================================================
       BATAS USIA
    ===================================================== */

    const LIMITS = {
        under5MaxMonths: 60,
        referenceMinMonths: 61,
        referenceMaxMonths: 228
    };


    /* =====================================================
       KONVERSI USIA
    ===================================================== */

    function daysToMonths(days) {
        return days / 30.4375;
    }


    function monthsToDays(months) {
        return months * 30.4375;
    }


    /* =====================================================
       LMS Z-SCORE
    ===================================================== */

    function lmsZScore(value, L, M, S) {

        value = Number(value);
        L = Number(L);
        M = Number(M);
        S = Number(S);

        if (
            !Number.isFinite(value) ||
            !Number.isFinite(L) ||
            !Number.isFinite(M) ||
            !Number.isFinite(S) ||
            M <= 0 ||
            S <= 0
        ) {
            return null;
        }


        if (L === 0) {

            return Math.log(value / M) / S;

        }


        return (
            Math.pow(value / M, L) - 1
        ) / (L * S);

    }


    /* =====================================================
       LMS → NILAI PADA Z
    ===================================================== */

    function lmsValueAtZ(z, L, M, S) {

        z = Number(z);
        L = Number(L);
        M = Number(M);
        S = Number(S);

        if (
            !Number.isFinite(z) ||
            !Number.isFinite(L) ||
            !Number.isFinite(M) ||
            !Number.isFinite(S)
        ) {
            return null;
        }


        if (L === 0) {

            return M * Math.exp(z * S);

        }


        const base =
            1 + (L * S * z);


        if (base <= 0) {
            return null;
        }


        return (
            M *
            Math.pow(base, 1 / L)
        );

    }


    /* =====================================================
       INTERPOLASI LMS
    ===================================================== */

    function interpolateLMS(a, b, ratio) {

        if (!a || !b) {
            return null;
        }

        return {

            L:
                a.L +
                (b.L - a.L) * ratio,

            M:
                a.M +
                (b.M - a.M) * ratio,

            S:
                a.S +
                (b.S - a.S) * ratio

        };

    }


    /* =====================================================
       MENCARI LMS TERDEKAT
    ===================================================== */

    function findLMS(table, age) {

        if (!Array.isArray(table) || !table.length) {
            return null;
        }


        const numericAge = Number(age);


        if (!Number.isFinite(numericAge)) {
            return null;
        }


        for (let i = 0; i < table.length; i++) {

            if (
                Number(table[i].age) ===
                numericAge
            ) {

                return table[i];

            }

        }


        let lower = null;
        let upper = null;


        for (let i = 0; i < table.length; i++) {

            const item = table[i];


            if (Number(item.age) < numericAge) {

                lower = item;

            }


            if (
                Number(item.age) >
                numericAge
            ) {

                upper = item;
                break;

            }

        }


        if (!lower) {
            return table[0];
        }


        if (!upper) {
            return table[table.length - 1];
        }


        const ratio =
            (
                numericAge -
                Number(lower.age)
            ) /
            (
                Number(upper.age) -
                Number(lower.age)
            );


        return interpolateLMS(
            lower,
            upper,
            ratio
        );

    }


    /* =====================================================
       Z-SCORE DENGAN DATA LMS
    ===================================================== */

    function calculateZ(
        value,
        table,
        age
    ) {

        const lms =
            findLMS(table, age);


        if (!lms) {
            return null;
        }


        const z =
            lmsZScore(
                value,
                lms.L,
                lms.M,
                lms.S
            );


        if (z === null) {
            return null;
        }


        return {

            z: z,

            L: lms.L,

            M: lms.M,

            S: lms.S

        };

    }


    /* =====================================================
       PEMBATASAN Z-SCORE
    ===================================================== */

    function clampZ(z) {

        if (!Number.isFinite(z)) {
            return null;
        }

        /*
         * Jangan memotong nilai internal.
         * Pembatasan hanya untuk tampilan.
         */

        return Math.max(
            -5,
            Math.min(5, z)
        );

    }


    /* =====================================================
       STATUS TB/PB MENURUT UMUR
    ===================================================== */

    function classifyHeightForAge(z) {

        if (z === null) {
            return {
                category: "Tidak dapat dinilai",
                code: "NA"
            };
        }


        if (z < -3) {

            return {
                category: "Sangat pendek",
                code: "SEVERE_STUNTING"
            };

        }


        if (z < -2) {

            return {
                category: "Pendek",
                code: "STUNTING"
            };

        }


        return {
            category: "Normal",
            code: "NORMAL"
        };

    }


    /* =====================================================
       STATUS BB MENURUT UMUR
    ===================================================== */

    function classifyWeightForAge(z) {

        if (z === null) {

            return {
                category: "Tidak dapat dinilai",
                code: "NA"
            };

        }


        if (z < -3) {

            return {
                category:
                    "Berat badan sangat kurang",
                code:
                    "SEVERE_UNDERWEIGHT"
            };

        }


        if (z < -2) {

            return {
                category:
                    "Berat badan kurang",
                code:
                    "UNDERWEIGHT"
            };

        }


        return {

            category:
                "Berat badan normal",

            code:
                "NORMAL"

        };

    }


    /* =====================================================
       STATUS BB/PB ATAU BB/TB 0–5 TAHUN
    ===================================================== */

    function classifyWeightForHeight(z) {

        if (z === null) {

            return {
                category:
                    "Tidak dapat dinilai",

                code:
                    "NA"
            };

        }


        if (z < -3) {

            return {
                category:
                    "Sangat kurus",

                code:
                    "SEVERE_WASTING"
            };

        }


        if (z < -2) {

            return {
                category:
                    "Kurus",

                code:
                    "WASTING"
            };

        }


        if (z > 3) {

            return {
                category:
                    "Obesitas",

                code:
                    "OBESITY"
            };

        }


        if (z > 2) {

            return {
                category:
                    "Gemuk",

                code:
                    "OVERWEIGHT"
            };

        }


        return {

            category:
                "Normal",

            code:
                "NORMAL"

        };

    }


    /* =====================================================
       STATUS IMT/U 0–5 TAHUN
    ===================================================== */

    function classifyBMIUnder5(z) {

        if (z === null) {

            return {
                category:
                    "Tidak dapat dinilai",

                code:
                    "NA"
            };

        }


        if (z < -3) {

            return {
                category:
                    "Sangat kurus",

                code:
                    "SEVERE_THINNESS"
            };

        }


        if (z < -2) {

            return {
                category:
                    "Kurus",

                code:
                    "THINNESS"
            };

        }


        if (z > 3) {

            return {
                category:
                    "Obesitas",

                code:
                    "OBESITY"
            };

        }


        if (z > 2) {

            return {
                category:
                    "Gemuk",

                code:
                    "OVERWEIGHT"
            };

        }


        if (z > 1) {

            return {
                category:
                    "Berisiko gemuk",

                code:
                    "RISK_OF_OVERWEIGHT"
            };

        }


        return {

            category:
                "Normal",

            code:
                "NORMAL"

        };

    }


    /* =====================================================
       STATUS IMT/U 5–19 TAHUN
    ===================================================== */

    function classifyBMI5to19(z) {

        if (z === null) {

            return {
                category:
                    "Tidak dapat dinilai",

                code:
                    "NA"
            };

        }


        if (z < -3) {

            return {

                category:
                    "Sangat kurus",

                code:
                    "SEVERE_THINNESS"

            };

        }


        if (z < -2) {

            return {

                category:
                    "Kurus",

                code:
                    "THINNESS"

            };

        }


        if (z > 2) {

            return {

                category:
                    "Obesitas",

                code:
                    "OBESITY"

            };

        }


        if (z > 1) {

            return {

                category:
                    "Gemuk",

                code:
                    "OVERWEIGHT"

            };

        }


        return {

            category:
                "Normal",

            code:
                "NORMAL"

        };

    }


    /* =====================================================
       DATABASE LMS
       
       CATATAN:
       Array berikut adalah tempat data WHO LMS dimasukkan.
       Mesin sudah siap membaca data dalam format:

       {
           age: bulan,
           L: ...,
           M: ...,
           S: ...
       }

       Contoh struktur:
    ===================================================== */

    const DATA = {

        male: {

            weightForAge: [],

            heightForAge: [],

            weightForLength: [],

            weightForHeight: [],

            bmiForAge: []

        },


        female: {

            weightForAge: [],

            heightForAge: [],

            weightForLength: [],

            weightForHeight: [],

            bmiForAge: []

        }

    };


    /* =====================================================
       API
    ===================================================== */

    window.WHO_ANTHRO = {

        version: VERSION,

        limits: LIMITS,

        data: DATA,

        lmsZScore: lmsZScore,

        lmsValueAtZ: lmsValueAtZ,

        calculateZ: calculateZ,

        findLMS: findLMS,

        clampZ: clampZ,

        classifyHeightForAge:
            classifyHeightForAge,

        classifyWeightForAge:
            classifyWeightForAge,

        classifyWeightForHeight:
            classifyWeightForHeight,

        classifyBMIUnder5:
            classifyBMIUnder5,

        classifyBMI5to19:
            classifyBMI5to19

    };


    console.log(
        "WHO_ANTHRO tersedia:",
        !!window.WHO_ANTHRO
    );

})();
