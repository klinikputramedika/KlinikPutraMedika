/* =========================================================
   WHO ANTHRO ENGINE
   Klinik Putra Medika

   WHO Child Growth Standards 2006
   WHO Growth Reference 2007

   ---------------------------------------------------------
   INDICATORS

   0–60 bulan:
   - weightForAge
   - heightForAge
   - weightForLength
   - weightForHeight
   - bmiForAge

   61–228 bulan:
   - heightForAge
   - weightForAge (sampai 120 bulan)
   - bmiForAge

   ---------------------------------------------------------
   CATATAN

   File ini bertindak sebagai engine/database interface.
   Data referensi disimpan dalam struktur LMS.

   Format LMS:

   {
       age: bulan,
       L: ...,
       M: ...,
       S: ...
   }

   Z-score dihitung dengan metode LMS WHO:

       Z = ((X/M)^L - 1) / (L*S)

   jika L != 0

       Z = ln(X/M) / S

   jika L = 0
   ========================================================= */

(function () {

    "use strict";

    console.log("======================================");
    console.log("WHO ANTHRO ENGINE");
    console.log("Klinik Putra Medika");
    console.log("======================================");


    /* =====================================================
       VERSION
    ===================================================== */

    const VERSION = {

        under5: "WHO Child Growth Standards 2006",

        schoolAge:
            "WHO Growth Reference 2007"

    };


    /* =====================================================
       AGE LIMIT
    ===================================================== */

    const LIMITS = {

        UNDER_5_MAX_MONTH: 60,

        SCHOOL_MIN_MONTH: 61,

        SCHOOL_MAX_MONTH: 228,

        WEIGHT_FOR_AGE_MAX_MONTH: 120

    };


    /* =====================================================
       INDICATOR MAP
    ===================================================== */

    const INDICATORS = {

        WFA:
            "weightForAge",

        HFA:
            "heightForAge",

        WFHL:
            "weightForLength",

        WFH:
            "weightForHeight",

        BFA:
            "bmiForAge"

    };


    /* =====================================================
       INTERNAL DATABASE
       -----------------------------------------------------
       Database akan diisi dari window.WHO_LMS_DATA apabila
       file data terpisah tersedia.

       Dengan cara ini gizi-anak.js tidak perlu mengetahui
       bagaimana database disimpan.
       ===================================================== */

    const DATABASE = {

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
       IMPORT DATABASE
       ===================================================== */

    function importDatabase(data) {

        if (!data || typeof data !== "object") {

            console.warn(
                "WHO: database tidak ditemukan."
            );

            return false;

        }


        ["male", "female"].forEach(function (sex) {

            if (!data[sex]) return;


            Object.keys(
                DATABASE[sex]
            ).forEach(function (indicator) {

                if (
                    Array.isArray(
                        data[sex][indicator]
                    )
                ) {

                    DATABASE[sex][indicator] =
                        data[sex][indicator];

                }

            });

        });


        console.log(
            "WHO database berhasil dimuat."
        );

        return true;

    }


    /* =====================================================
       NORMALIZE SEX
       ===================================================== */

    function normalizeSex(sex) {

        if (!sex) return null;


        const value =
            String(sex)
                .toLowerCase()
                .trim();


        if (
            value === "male" ||
            value === "m" ||
            value === "laki" ||
            value === "laki-laki" ||
            value === "laki laki"
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


    /* =====================================================
       NORMALIZE INDICATOR
       ===================================================== */

    function normalizeIndicator(indicator) {

        if (!indicator) return null;


        const value =
            String(indicator)
                .toLowerCase()
                .trim();


        const map = {

            "wfa":
                "weightForAge",

            "weight-for-age":
                "weightForAge",

            "weightforage":
                "weightForAge",


            "hfa":
                "heightForAge",

            "height-for-age":
                "heightForAge",

            "heightforage":
                "heightForAge",

            "length-for-age":
                "heightForAge",


            "wfh":
                "weightForHeight",

            "weight-for-height":
                "weightForHeight",

            "weightforheight":
                "weightForHeight",


            "wfl":
                "weightForLength",

            "weight-for-length":
                "weightForLength",

            "weightforlength":
                "weightForLength",


            "bfa":
                "bmiForAge",

            "bmi-for-age":
                "bmiForAge",

            "bmiforage":
                "bmiForAge"

        };


        return map[value] || null;

    }


    /* =====================================================
       GET DATABASE
       ===================================================== */

    function getDatabase(
        sex,
        indicator
    ) {

        const gender =
            normalizeSex(sex);

        const index =
            normalizeIndicator(indicator);


        if (!gender || !index) {

            return null;

        }


        return DATABASE[gender][index] || null;

    }


    /* =====================================================
       HAS DATA
       ===================================================== */

    function hasData(
        sex,
        indicator
    ) {

        const data =
            getDatabase(
                sex,
                indicator
            );


        return (
            Array.isArray(data) &&
            data.length > 0
        );

    }


    /* =====================================================
       FIND LMS BY AGE
       ===================================================== */

    function findLMS(
        sex,
        indicator,
        ageMonths
    ) {

        const data =
            getDatabase(
                sex,
                indicator
            );


        if (
            !Array.isArray(data) ||
            !data.length
        ) {

            return null;

        }


        const age =
            Number(ageMonths);


        if (!Number.isFinite(age)) {

            return null;

        }


        /*
         * Exact age
         */

        const exact =
            data.find(function (row) {

                return (
                    Number(row.age) === age
                );

            });


        if (exact) {

            return exact;

        }


        /*
         * Interpolation
         */

        let lower = null;
        let upper = null;


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            const current =
                Number(data[i].age);


            if (current < age) {

                lower = data[i];

            }


            if (
                current > age
            ) {

                upper = data[i];

                break;

            }

        }


        if (!lower) {

            return data[0];

        }


        if (!upper) {

            return data[data.length - 1];

        }


        const ratio =
            (
                age -
                Number(lower.age)
            ) /
            (
                Number(upper.age) -
                Number(lower.age)
            );


        return {

            age: age,

            L:
                Number(lower.L) +
                (
                    Number(upper.L) -
                    Number(lower.L)
                ) * ratio,

            M:
                Number(lower.M) +
                (
                    Number(upper.M) -
                    Number(lower.M)
                ) * ratio,

            S:
                Number(lower.S) +
                (
                    Number(upper.S) -
                    Number(lower.S)
                ) * ratio

        };

    }


    /* =====================================================
       CALCULATE Z SCORE
       ===================================================== */

    function calculateZScore(
        value,
        L,
        M,
        S
    ) {

        value = Number(value);
        L = Number(L);
        M = Number(M);
        S = Number(S);


        if (
            !Number.isFinite(value) ||
            !Number.isFinite(L) ||
            !Number.isFinite(M) ||
            !Number.isFinite(S) ||
            value <= 0 ||
            M <= 0 ||
            S <= 0
        ) {

            return null;

        }


        let z;


        if (
            Math.abs(L) <
            0.0000001
        ) {

            z =
                Math.log(
                    value / M
                ) / S;

        } else {

            z =
                (
                    Math.pow(
                        value / M,
                        L
                    ) -
                    1
                ) /
                (L * S);

        }


        return z;

    }


    /* =====================================================
       CALCULATE INDICATOR
       ===================================================== */

    function calculate(
        sex,
        indicator,
        ageMonths,
        value
    ) {

        const lms =
            findLMS(
                sex,
                indicator,
                ageMonths
            );


        if (!lms) {

            return {

                available: false,

                zScore: null,

                lms: null

            };

        }


        const zScore =
            calculateZScore(
                value,
                lms.L,
                lms.M,
                lms.S
            );


        return {

            available: true,

            zScore: zScore,

            lms: lms,

            value: Number(value),

            ageMonths:
                Number(ageMonths),

            sex:
                normalizeSex(sex),

            indicator:
                normalizeIndicator(
                    indicator
                )

        };

    }


    /* =====================================================
       STATUS Z SCORE
       ===================================================== */

    function classify(
        indicator,
        z
    ) {

        if (
            z === null ||
            !Number.isFinite(z)
        ) {

            return {

                code:
                    "unavailable",

                label:
                    "Tidak tersedia"

            };

        }


        switch (
            normalizeIndicator(
                indicator
            )
        ) {


            /* =============================================
               HEIGHT FOR AGE
               ============================================= */

            case "heightForAge":

                if (z < -3) {

                    return {

                        code:
                            "severely_stunted",

                        label:
                            "Sangat pendek"

                    };

                }


                if (z < -2) {

                    return {

                        code:
                            "stunted",

                        label:
                            "Pendek"

                    };

                }


                return {

                    code:
                        "normal",

                    label:
                        "Normal"

                };


            /* =============================================
               WEIGHT FOR AGE
               ============================================= */

            case "weightForAge":

                if (z < -3) {

                    return {

                        code:
                            "severely_underweight",

                        label:
                            "Berat badan sangat kurang"

                    };

                }


                if (z < -2) {

                    return {

                        code:
                            "underweight",

                        label:
                            "Berat badan kurang"

                    };

                }


                return {

                    code:
                        "normal",

                    label:
                        "Berat badan normal"

                };


            /* =============================================
               BMI FOR AGE
               ============================================= */

            case "bmiForAge":

                if (z < -3) {

                    return {

                        code:
                            "severely_thin",

                        label:
                            "Sangat kurus"

                    };

                }


                if (z < -2) {

                    return {

                        code:
                            "thin",

                        label:
                            "Kurus"

                    };

                }


                if (z <= 1) {

                    return {

                        code:
                            "normal",

                        label:
                            "Normal"

                    };

                }


                if (z <= 2) {

                    return {

                        code:
                            "overweight",

                        label:
                            "Gemuk"

                    };

                }


                return {

                    code:
                        "obesity",

                    label:
                        "Obesitas"

                };


            /* =============================================
               WEIGHT FOR HEIGHT / LENGTH
               ============================================= */

            case "weightForHeight":

            case "weightForLength":

                if (z < -3) {

                    return {

                        code:
                            "severely_wasted",

                        label:
                            "Sangat kurus"

                    };

                }


                if (z < -2) {

                    return {

                        code:
                            "wasted",

                        label:
                            "Kurus"

                    };

                }


                if (z <= 2) {

                    return {

                        code:
                            "normal",

                        label:
                            "Normal"

                    };

                }


                if (z <= 3) {

                    return {

                        code:
                            "overweight",

                        label:
                            "Gemuk"

                    };

                }


                return {

                    code:
                        "obesity",

                    label:
                        "Obesitas"

                };

        }


        return {

            code:
                "unknown",

            label:
                "Tidak tersedia"

        };

    }


    /* =====================================================
       COMPLETE CALCULATION
       ===================================================== */

    function assess(
        sex,
        ageMonths,
        measurements
    ) {

        const result = {};


        if (
            measurements.weight !==
            undefined
        ) {

            result.weightForAge =
                calculate(
                    sex,
                    "weightForAge",
                    ageMonths,
                    measurements.weight
                );

        }


        if (
            measurements.height !==
            undefined
        ) {

            result.heightForAge =
                calculate(
                    sex,
                    "heightForAge",
                    ageMonths,
                    measurements.height
                );

        }


        if (
            measurements.bmi !==
            undefined
        ) {

            result.bmiForAge =
                calculate(
                    sex,
                    "bmiForAge",
                    ageMonths,
                    measurements.bmi
                );

        }


        return result;

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.WHO_ANTHRO = {

        version: VERSION,

        limits: LIMITS,

        indicators: INDICATORS,

        database: DATABASE,

        importDatabase:

            importDatabase,

        normalizeSex:

            normalizeSex,

        normalizeIndicator:

            normalizeIndicator,

        getData:

            getDatabase,

        hasData:

            hasData,

        findLMS:

            findLMS,

        calculateZScore:

            calculateZScore,

        calculate:

            calculate,

        classify:

            classify,

        assess:

            assess

    };


    /* =====================================================
       AUTO IMPORT
       ===================================================== */

    if (
        window.WHO_LMS_DATA
    ) {

        importDatabase(
            window.WHO_LMS_DATA
        );

    }


    console.log(
        "WHO_ANTHRO tersedia:",
        !!window.WHO_ANTHRO
    );

})();
