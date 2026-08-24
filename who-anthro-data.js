/* =========================================================
   WHO ANTHRO DATA ENGINE
   Klinik Putra Medika

   WHO CHILD GROWTH STANDARDS
   0–60 bulan

   WHO REFERENCE 2007
   5–19 tahun

   INDIKATOR:
   - Weight-for-age
   - Length/height-for-age
   - Weight-for-length/height
   - BMI-for-age

   CATATAN:
   File ini merupakan ENGINE / DATABASE INTERFACE.

   DATA LMS WHO HARUS BERASAL DARI TABEL WHO RESMI.
   Jangan mengisi angka LMS dengan perkiraan.
========================================================= */

(function () {

    "use strict";

    console.log("======================================");
    console.log("WHO-ANTHRO-DATA.JS BERHASIL DIMUAT");
    console.log("======================================");


    /* =====================================================
       VERSI
    ===================================================== */

    const VERSION = {

        under5:
            "WHO Child Growth Standards 2006",

        fiveTo19:
            "WHO Reference 2007"

    };


    /* =====================================================
       BATAS USIA
    ===================================================== */

    const LIMITS = {

        UNDER_5: {

            minDays: 0,

            maxDays: 1856,

            minMonths: 0,

            maxMonths: 60

        },

        AGE_5_19: {

            minMonths: 61,

            maxMonths: 228

        }

    };


    /* =====================================================
       INDIKATOR
    ===================================================== */

    const INDICATORS = {

        WFA:
            "weightForAge",

        HFA:
            "heightForAge",

        WFHL:
            "weightForLengthHeight",

        BFA:
            "bmiForAge"

    };


    /* =====================================================
       DATABASE LMS

       FORMAT:

       {
           age: {
               L: value,
               M: value,
               S: value
           }
       }

       Untuk indikator berbasis umur:

       age = hari       → WHO 0–60 bulan

       age = bulan      → WHO 5–19 tahun


       Untuk weight-for-length/height:

       age = panjang/tinggi dalam cm
    ===================================================== */

    const DATA = {


        /* =================================================
           LAKI-LAKI
        ================================================= */

        male: {

            weightForAge: {

                under5: {},

                fiveTo19: {}

            },


            heightForAge: {

                under5: {},

                fiveTo19: {}

            },


            weightForLengthHeight: {

                under5: {}

            },


            bmiForAge: {

                under5: {},

                fiveTo19: {}

            }

        },


        /* =================================================
           PEREMPUAN
        ================================================= */

        female: {

            weightForAge: {

                under5: {},

                fiveTo19: {}

            },


            heightForAge: {

                under5: {},

                fiveTo19: {}

            },


            weightForLengthHeight: {

                under5: {}

            },


            bmiForAge: {

                under5: {},

                fiveTo19: {}

            }

        }

    };


    /* =====================================================
       SEX NORMALIZER
    ===================================================== */

    function normalizeSex(sex) {

        if (!sex) {
            return null;
        }

        const value =
            String(sex)
                .trim()
                .toLowerCase();


        if (

            value === "male" ||

            value === "m" ||

            value === "laki" ||

            value === "laki-laki" ||

            value === "boy"

        ) {

            return "male";

        }


        if (

            value === "female" ||

            value === "f" ||

            value === "perempuan" ||

            value === "girl"

        ) {

            return "female";

        }


        return null;

    }


    /* =====================================================
       NUMBER HELPER
    ===================================================== */

    function isNumber(value) {

        return (

            typeof value === "number" &&

            Number.isFinite(value)

        );

    }


    /* =====================================================
       AGE RANGE
    ===================================================== */

    function getAgeGroup(ageDays, ageMonths) {

        if (isNumber(ageDays)) {

            if (
                ageDays >= LIMITS.UNDER_5.minDays &&
                ageDays <= LIMITS.UNDER_5.maxDays
            ) {

                return "under5";

            }

        }


        if (isNumber(ageMonths)) {

            if (
                ageMonths >= LIMITS.AGE_5_19.minMonths &&
                ageMonths <= LIMITS.AGE_5_19.maxMonths
            ) {

                return "fiveTo19";

            }

        }


        return null;

    }


    /* =====================================================
       GET DATABASE
    ===================================================== */

    function getIndicatorDatabase(
        sex,
        indicator,
        ageGroup
    ) {

        const gender =
            normalizeSex(sex);


        if (!gender) {
            return null;
        }


        if (!DATA[gender]) {
            return null;
        }


        if (!DATA[gender][indicator]) {
            return null;
        }


        if (!DATA[gender][indicator][ageGroup]) {
            return null;
        }


        return DATA[gender][indicator][ageGroup];

    }


    /* =====================================================
       SORT NUMERIC KEYS
    ===================================================== */

    function getNumericKeys(database) {

        return Object.keys(database)

            .map(Number)

            .filter(Number.isFinite)

            .sort(function (a, b) {

                return a - b;

            });

    }


    /* =====================================================
       EXACT LMS
    ===================================================== */

    function getExactLMS(
        database,
        x
    ) {

        if (!database) {
            return null;
        }


        const key = String(x);


        if (!database[key]) {
            return null;
        }


        return database[key];

    }


    /* =====================================================
       INTERPOLASI LMS
    ===================================================== */

    function interpolateLMS(
        database,
        x
    ) {

        if (!database) {
            return null;
        }


        const keys =
            getNumericKeys(database);


        if (!keys.length) {
            return null;
        }


        /*
         * Exact match
         */

        const exact =
            getExactLMS(
                database,
                x
            );


        if (exact) {

            return {

                L: Number(exact.L),

                M: Number(exact.M),

                S: Number(exact.S),

                interpolated: false

            };

        }


        /*
         * Di luar range
         */

        if (
            x < keys[0] ||
            x > keys[keys.length - 1]
        ) {

            return null;

        }


        /*
         * Cari dua titik
         */

        let lower = null;

        let upper = null;


        for (
            let i = 0;
            i < keys.length - 1;
            i++
        ) {

            if (
                x > keys[i] &&
                x < keys[i + 1]
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


        const a =
            database[String(lower)];

        const b =
            database[String(upper)];


        const ratio =
            (x - lower) /
            (upper - lower);


        return {

            L:
                Number(a.L) +
                (
                    Number(b.L) -
                    Number(a.L)
                ) *
                ratio,

            M:
                Number(a.M) +
                (
                    Number(b.M) -
                    Number(a.M)
                ) *
                ratio,

            S:
                Number(a.S) +
                (
                    Number(b.S) -
                    Number(a.S)
                ) *
                ratio,

            interpolated: true

        };

    }


    /* =====================================================
       LMS → Z SCORE
    ===================================================== */

    function lmsToZ(
        measurement,
        L,
        M,
        S
    ) {

        if (
            !isNumber(measurement) ||
            !isNumber(L) ||
            !isNumber(M) ||
            !isNumber(S)
        ) {

            return null;

        }


        if (
            M <= 0 ||
            S <= 0
        ) {

            return null;

        }


        /*
         * LMS formula

         * z = ((X/M)^L - 1) / (L*S)

         * Jika L = 0:

         * z = ln(X/M) / S
         */

        let z;


        if (Math.abs(L) < 0.000001) {

            z =
                Math.log(
                    measurement / M
                ) / S;

        }

        else {

            z =
                (
                    Math.pow(
                        measurement / M,
                        L
                    ) - 1
                ) /
                (L * S);

        }


        return z;

    }


    /* =====================================================
       Z SCORE → APPROX PERCENTILE
    ===================================================== */

    function normalCDF(z) {

        if (!isNumber(z)) {
            return null;
        }


        /*
         * Approximation of standard normal CDF
         */

        const sign =
            z < 0 ? -1 : 1;

        const x =
            Math.abs(z) /
            Math.sqrt(2);


        const t =
            1 /
            (
                1 +
                0.3275911 * x
            );


        const a1 = 0.254829592;

        const a2 = -0.284496736;

        const a3 = 1.421413741;

        const a4 = -1.453152027;

        const a5 = 1.061405429;


        const erf =
            1 -
            (
                (
                    (
                        (
                            (
                                a5 * t +
                                a4
                            ) * t +
                            a3
                        ) * t +
                        a2
                    ) * t +
                    a1
                ) *
                t *
                Math.exp(-x * x)
            );


        return (
            0.5 *
            (
                1 +
                sign * erf
            )
        );

    }


    function zToPercentile(z) {

        const p =
            normalCDF(z);


        if (p === null) {
            return null;
        }


        return p * 100;

    }


    /* =====================================================
       ROUND
    ===================================================== */

    function round(
        value,
        decimals
    ) {

        if (!isNumber(value)) {
            return null;
        }


        const factor =
            Math.pow(
                10,
                decimals
            );


        return (
            Math.round(
                value * factor
            ) / factor
        );

    }


    /* =====================================================
       GET Z-SCORE
    ===================================================== */

    function calculateZScore({

        sex,

        indicator,

        ageGroup,

        x,

        measurement

    }) {

        const database =
            getIndicatorDatabase(
                sex,
                indicator,
                ageGroup
            );


        if (!database) {

            return {

                success: false,

                reason:
                    "Database WHO belum tersedia."

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
                    "Tidak ditemukan LMS WHO untuk titik referensi tersebut."

            };

        }


        const z =
            lmsToZ(
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

            zScore: round(z, 2),

            percentile:
                round(
                    zToPercentile(z),
                    1
                ),

            L: lms.L,

            M: lms.M,

            S: lms.S,

            interpolated:
                lms.interpolated

        };

    }


    /* =====================================================
       BMI
    ===================================================== */

    function calculateBMI(
        weight,
        height
    ) {

        if (
            !isNumber(weight) ||
            !isNumber(height) ||
            weight <= 0 ||
            height <= 0
        ) {

            return null;

        }


        const meters =
            height / 100;


        return round(
            weight /
            (
                meters *
                meters
            ),
            2
        );

    }


    /* =====================================================
       STATUS BMI-FOR-AGE
    ===================================================== */

    function classifyBMIForAge(z) {

        if (!isNumber(z)) {
            return null;
        }


        if (z < -3) {

            return {
                code: "BAZ_LT_M3",
                label: "Sangat kurus"
            };

        }


        if (z < -2) {

            return {
                code: "BAZ_M3_TO_LT_M2",
                label: "Kurus"
            };

        }


        if (z <= 1) {

            return {
                code: "BAZ_M2_TO_P1",
                label: "Normal"
            };

        }


        if (z <= 2) {

            return {
                code: "BAZ_GT_P1_TO_P2",
                label: "Gemuk"
            };

        }


        return {

            code: "BAZ_GT_P2",

            label: "Obesitas"

        };

    }


    /* =====================================================
       STATUS TINGGI MENURUT UMUR
    ===================================================== */

    function classifyHeightForAge(z) {

        if (!isNumber(z)) {
            return null;
        }


        if (z < -3) {

            return {

                code: "HAZ_LT_M3",

                label: "Sangat pendek"

            };

        }


        if (z < -2) {

            return {

                code: "HAZ_M3_TO_LT_M2",

                label: "Pendek"

            };

        }


        return {

            code: "HAZ_GE_M2",

            label: "Normal"

        };

    }


    /* =====================================================
       STATUS BERAT MENURUT UMUR
    ===================================================== */

    function classifyWeightForAge(z) {

        if (!isNumber(z)) {
            return null;
        }


        if (z < -3) {

            return {

                code: "WAZ_LT_M3",

                label:
                    "Berat badan sangat kurang"

            };

        }


        if (z < -2) {

            return {

                code:
                    "WAZ_M3_TO_LT_M2",

                label:
                    "Berat badan kurang"

            };

        }


        return {

            code:
                "WAZ_GE_M2",

            label:
                "Berat badan normal"

        };

    }


    /* =====================================================
       STATUS WEIGHT-FOR-HEIGHT
    ===================================================== */

    function classifyWeightForHeight(z) {

        if (!isNumber(z)) {
            return null;
        }


        if (z < -3) {

            return {

                code:
                    "WHZ_LT_M3",

                label:
                    "Sangat kurus"

            };

        }


        if (z < -2) {

            return {

                code:
                    "WHZ_M3_TO_LT_M2",

                label:
                    "Kurus"

            };

        }


        if (z <= 2) {

            return {

                code:
                    "WHZ_GE_M2_TO_LE_P2",

                label:
                    "Normal"

            };

        }


        if (z <= 3) {

            return {

                code:
                    "WHZ_GT_P2_TO_LE_P3",

                label:
                    "Berat badan lebih"

            };

        }


        return {

            code:
                "WHZ_GT_P3",

            label:
                "Obesitas"

        };

    }


    /* =====================================================
       DATABASE STATUS
    ===================================================== */

    function databaseStatus() {

        const result = {


            male: {

                weightForAge:
                    Object.keys(
                        DATA.male.weightForAge.under5
                    ).length,

                heightForAge:
                    Object.keys(
                        DATA.male.heightForAge.under5
                    ).length,

                weightForLengthHeight:
                    Object.keys(
                        DATA.male.weightForLengthHeight.under5
                    ).length,

                bmiForAge:
                    Object.keys(
                        DATA.male.bmiForAge.under5
                    ).length

            },


            female: {

                weightForAge:
                    Object.keys(
                        DATA.female.weightForAge.under5
                    ).length,

                heightForAge:
                    Object.keys(
                        DATA.female.heightForAge.under5
                    ).length,

                weightForLengthHeight:
                    Object.keys(
                        DATA.female.weightForLengthHeight.under5
                    ).length,

                bmiForAge:
                    Object.keys(
                        DATA.female.bmiForAge.under5
                    ).length

            }

        };


        return result;

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.WHO_ANTHRO = {


        version:
            VERSION,


        limits:
            LIMITS,


        indicators:
            INDICATORS,


        data:
            DATA,


        normalizeSex:
            normalizeSex,


        getAgeGroup:
            getAgeGroup,


        getIndicatorDatabase:
            getIndicatorDatabase,


        getLMS:
            interpolateLMS,


        calculateZScore:
            calculateZScore,


        lmsToZ:
            lmsToZ,


        calculateBMI:
            calculateBMI,


        zToPercentile:
            zToPercentile,


        classifyBMIForAge:
            classifyBMIForAge,


        classifyHeightForAge:
            classifyHeightForAge,


        classifyWeightForAge:
            classifyWeightForAge,


        classifyWeightForHeight:
            classifyWeightForHeight,


        databaseStatus:
            databaseStatus

    };


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "WHO_ANTHRO tersedia:",
        !!window.WHO_ANTHRO
    );


    console.log(
        "Versi WHO:",
        VERSION
    );


    console.log(
        "Status database:",
        databaseStatus()
    );


})();
