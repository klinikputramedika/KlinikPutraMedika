/* =========================================================
   GIZI ANAK - KLINIK PUTRA MEDIKA
   Versi lengkap
   ========================================================= */

(function () {

    "use strict";

    console.log("======================================");
    console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
    console.log("======================================");


    /* =====================================================
       HELPER
    ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function setText(id, value) {

        const element = $(id);

        if (element) {
            element.textContent = value;
        }

    }


    function show(element) {

        if (element) {
            element.hidden = false;
        }

    }


    function hide(element) {

        if (element) {
            element.hidden = true;
        }

    }


    function number(value) {

        const result = parseFloat(value);

        return Number.isFinite(result)
            ? result
            : NaN;

    }


    function round(value, decimals = 1) {

        if (!Number.isFinite(value)) {
            return NaN;
        }

        const multiplier = Math.pow(10, decimals);

        return Math.round(value * multiplier) / multiplier;

    }


    /* =====================================================
       ELEMEN
    ===================================================== */

    const genderInput = $("anakGender");
    const birthInput = $("anakBirthDate");
    const checkInput = $("anakCheckDate");

    const weightInput = $("anakWeight");
    const heightInput = $("anakHeight");

    const calculateButton = $("anakCalculateButton");

    const errorBox = $("anakError");



    /* =====================================================
       TANGGAL PEMERIKSAAN DEFAULT
    ===================================================== */

    function setDefaultCheckDate() {

        if (!checkInput) {
            return;
        }

        if (!checkInput.value) {

            const today = new Date();

            const year = today.getFullYear();

            const month = String(
                today.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                today.getDate()
            ).padStart(2, "0");

            checkInput.value =
                `${year}-${month}-${day}`;

        }

    }


    setDefaultCheckDate();



    /* =====================================================
       PARSE DATE TANPA MASALAH TIMEZONE
    ===================================================== */

    function parseDate(value) {

        if (!value) {
            return null;
        }

        const parts = value.split("-");

        if (parts.length !== 3) {
            return null;
        }

        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day
        );

    }



    /* =====================================================
       HITUNG USIA KRONOLOGIS
    ===================================================== */

    function calculateAge(birthDate, checkDate) {

        let years =
            checkDate.getFullYear() -
            birthDate.getFullYear();

        let months =
            checkDate.getMonth() -
            birthDate.getMonth();

        let days =
            checkDate.getDate() -
            birthDate.getDate();


        if (days < 0) {

            months--;

            const previousMonth =
                new Date(
                    checkDate.getFullYear(),
                    checkDate.getMonth(),
                    0
                );

            days +=
                previousMonth.getDate();

        }


        if (months < 0) {

            years--;

            months += 12;

        }


        const totalMonths =
            years * 12 + months;


        return {
            years: years,
            months: months,
            days: days,
            totalMonths: totalMonths
        };

    }



    /* =====================================================
       FORMAT USIA
    ===================================================== */

    function formatAge(age) {

        if (!age) {
            return "—";
        }

        return (
            `${age.years} tahun ` +
            `${age.months} bulan ` +
            `${age.days} hari`
        );

    }



    /* =====================================================
       UPDATE USIA DI UI
    ===================================================== */

    function updateAgeDisplay() {

        const birthDate =
            parseDate(
                birthInput?.value
            );

        const checkDate =
            parseDate(
                checkInput?.value
            );


        if (!birthDate || !checkDate) {

            setText(
                "anakAgeText",
                "—"
            );

            setText(
                "anakAgeMonths",
                "—"
            );

            setText(
                "anakAgeGroup",
                "—"
            );

            return null;

        }


        if (checkDate < birthDate) {

            setText(
                "anakAgeText",
                "Tanggal tidak valid"
            );

            setText(
                "anakAgeMonths",
                "—"
            );

            setText(
                "anakAgeGroup",
                "—"
            );

            return null;

        }


        const age =
            calculateAge(
                birthDate,
                checkDate
            );


        setText(
            "anakAgeText",
            formatAge(age)
        );


        setText(
            "anakAgeMonths",
            `${age.totalMonths} bulan`
        );


        let ageGroup = "";


        if (age.totalMonths < 60) {

            ageGroup =
                "WHO Child Growth Standards 0–5 tahun";

        } else if (age.totalMonths < 228) {

            ageGroup =
                "WHO Growth Reference 5–19 tahun";

        } else {

            ageGroup =
                "Di luar rentang kalkulator";

        }


        setText(
            "anakAgeGroup",
            ageGroup
        );


        console.log(
            "USIA:",
            formatAge(age)
        );


        return age;

    }



    /* =====================================================
       EVENT USIA
    ===================================================== */

    if (birthInput) {

        birthInput.addEventListener(
            "change",
            updateAgeDisplay
        );

    }


    if (checkInput) {

        checkInput.addEventListener(
            "change",
            updateAgeDisplay
        );

    }



    /* =====================================================
       VALIDASI
    ===================================================== */

    function showError(message) {

        if (!errorBox) {
            alert(message);
            return;
        }

        errorBox.textContent = message;

        show(errorBox);

        errorBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    function clearError() {

        if (errorBox) {

            errorBox.textContent = "";

            hide(errorBox);

        }

    }



    /* =====================================================
       HITUNG IMT
    ===================================================== */

    function calculateBMI(weight, heightCm) {

        const heightMeter =
            heightCm / 100;

        if (
            !Number.isFinite(weight) ||
            !Number.isFinite(heightMeter) ||
            heightMeter <= 0
        ) {
            return NaN;
        }

        return (
            weight /
            Math.pow(heightMeter, 2)
        );

    }



    /* =====================================================
       UPDATE IMT
    ===================================================== */

    function updateBMI(
        weight,
        height
    ) {

        const bmi =
            calculateBMI(
                weight,
                height
            );


        if (!Number.isFinite(bmi)) {

            setText(
                "anakBMIValue",
                "—"
            );

            return NaN;

        }


        setText(
            "anakBMIValue",
            bmi.toFixed(1)
        );


        setText(
            "resultWeight",
            `${round(weight, 1)} kg`
        );


        setText(
            "resultHeight",
            `${round(height, 1)} cm`
        );


        return bmi;

    }



    /* =====================================================
       CARI DATA WHO
       
       Fungsi ini fleksibel karena struktur
       who-anthro-data.js yang Anda miliki dapat berbeda.
    ===================================================== */

    function findWHOData() {

        const candidates = [

            window.WHO_ANTHRO_DATA,

            window.WHOAnthroData,

            window.whoAnthroData,

            window.WHO_DATA,

            window.WHOData,

            window.ANTHRO_DATA,

            window.anthroData

        ];


        for (
            const candidate of candidates
        ) {

            if (candidate) {

                console.log(
                    "Data WHO ditemukan:",
                    candidate
                );

                return candidate;

            }

        }


        console.warn(
            "Data WHO belum ditemukan di window."
        );


        return null;

    }



    /* =====================================================
       Z-SCORE ENGINE
       
       Mendukung beberapa bentuk data:
       
       1. LMS:
          {L, M, S}

       2. Median + SD:
          {median, sd}

       3. SD-positif/negatif:
          {minus3, minus2, minus1, median,
           plus1, plus2, plus3}
    ===================================================== */

    function zScoreFromLMS(
        measurement,
        L,
        M,
        S
    ) {

        if (
            !Number.isFinite(measurement) ||
            !Number.isFinite(L) ||
            !Number.isFinite(M) ||
            !Number.isFinite(S) ||
            M <= 0 ||
            S <= 0
        ) {

            return NaN;

        }


        if (Math.abs(L) < 0.000001) {

            return Math.log(
                measurement / M
            ) / S;

        }


        return (
            Math.pow(
                measurement / M,
                L
            ) - 1
        ) / (L * S);

    }



    /* =====================================================
       Z-SCORE DARI MEDIAN + SD
    ===================================================== */

    function zScoreFromMedianSD(
        measurement,
        median,
        sd
    ) {

        if (
            !Number.isFinite(measurement) ||
            !Number.isFinite(median) ||
            !Number.isFinite(sd) ||
            sd <= 0
        ) {

            return NaN;

        }


        return (
            measurement - median
        ) / sd;

    }



    /* =====================================================
       Z-SCORE DARI TITIK SD
    ===================================================== */

    function zScoreFromPoints(
        measurement,
        row
    ) {

        if (!row) {
            return NaN;
        }


        const minus3 =
            number(row.minus3 ?? row.m3);

        const minus2 =
            number(row.minus2 ?? row.m2);

        const minus1 =
            number(row.minus1 ?? row.m1);

        const median =
            number(
                row.median ??
                row.zero ??
                row.sd0 ??
                row.m0
            );

        const plus1 =
            number(row.plus1 ?? row.p1);

        const plus2 =
            number(row.plus2 ?? row.p2);

        const plus3 =
            number(row.plus3 ?? row.p3);


        if (
            Number.isFinite(median) &&
            Number.isFinite(plus1) &&
            measurement >= median
        ) {

            if (
                Number.isFinite(plus2) &&
                measurement >= plus2
            ) {

                if (
                    Number.isFinite(plus3) &&
                    measurement >= plus3
                ) {

                    const slope =
                        (plus3 - plus2);

                    if (slope > 0) {

                        return (
                            2 +
                            (
                                measurement -
                                plus2
                            ) / slope
                        );

                    }

                }


                const slope =
                    plus2 - plus1;

                if (
                    Number.isFinite(plus2) &&
                    slope > 0
                ) {

                    return (
                        1 +
                        (
                            measurement -
                            plus1
                        ) / slope
                    );

                }

            }


            const slope =
                plus1 - median;

            if (
                Number.isFinite(plus1) &&
                slope > 0
            ) {

                return (
                    measurement -
                    median
                ) / slope;

            }

        }


        if (
            Number.isFinite(median) &&
            Number.isFinite(minus1) &&
            measurement < median
        ) {

            if (
                Number.isFinite(minus2) &&
                measurement < minus1
            ) {

                if (
                    Number.isFinite(minus3) &&
                    measurement < minus2
                ) {

                    const slope =
                        minus2 - minus3;

                    if (slope > 0) {

                        return (
                            -2 -
                            (
                                minus2 -
                                measurement
                            ) / slope
                        );

                    }

                }


                const slope =
                    minus1 - minus2;

                if (
                    Number.isFinite(minus2) &&
                    slope > 0
                ) {

                    return (
                        -1 -
                        (
                            minus1 -
                            measurement
                        ) / slope
                    );

                }

            }


            const slope =
                median - minus1;

            if (slope > 0) {

                return (
                    (
                        measurement -
                        median
                    ) / slope
                );

            }

        }


        return NaN;

    }



    /* =====================================================
       HITUNG Z-SCORE DARI SATU ROW
    ===================================================== */

    function calculateZFromRow(
        measurement,
        row
    ) {

        if (!row) {
            return NaN;
        }


        const L =
            number(
                row.L ??
                row.l
            );

        const M =
            number(
                row.M ??
                row.m
            );

        const S =
            number(
                row.S ??
                row.s
            );


        if (
            Number.isFinite(L) &&
            Number.isFinite(M) &&
            Number.isFinite(S)
        ) {

            return zScoreFromLMS(
                measurement,
                L,
                M,
                S
            );

        }


        const median =
            number(
                row.median ??
                row.M ??
                row.mean
            );

        const sd =
            number(
                row.sd ??
                row.SD ??
                row.standardDeviation
            );


        if (
            Number.isFinite(median) &&
            Number.isFinite(sd)
        ) {

            return zScoreFromMedianSD(
                measurement,
                median,
                sd
            );

        }


        return zScoreFromPoints(
            measurement,
            row
        );

    }



    /* =====================================================
       MENCARI ROW BERDASARKAN UMUR
    ===================================================== */

    function getAgeKey(
        totalMonths
    ) {

        return totalMonths;

    }



    /* =====================================================
       GENERIC SEARCH DATA WHO
    ===================================================== */

    function searchDataObject(
        data,
        indicator,
        gender,
        ageMonths,
        measurement
    ) {

        if (!data) {
            return NaN;
        }


        const genderKeys =
            gender === "male"
                ? [
                    "male",
                    "boys",
                    "boy",
                    "m"
                ]
                : [
                    "female",
                    "girls",
                    "girl",
                    "f"
                ];


        const indicatorKeys = {

            bfa: [
                "bfa",
                "wfa",
                "weightForAge",
                "weight_for_age",
                "weightAge"
            ],

            hfa: [
                "hfa",
                "lhfa",
                "lengthHeightForAge",
                "heightForAge",
                "lengthForAge",
                "height_age"
            ],

            wfh: [
                "wfh",
                "wfl",
                "weightForHeight",
                "weightForLength",
                "weight_height"
            ],

            bmi: [
                "bmi",
                "bmifa",
                "bmiForAge",
                "bmi_for_age"
            ]

        };


        const indicators =
            indicatorKeys[indicator] || [];


        function tryContainer(
            container
        ) {

            if (!container) {
                return NaN;
            }


            /* ---------------------------------------------
               Jika array
            --------------------------------------------- */

            if (Array.isArray(container)) {

                let best = null;

                let bestDifference =
                    Infinity;


                for (
                    const row of container
                ) {

                    if (
                        !row ||
                        typeof row !== "object"
                    ) {
                        continue;
                    }


                    const rowGender =
                        String(
                            row.gender ??
                            row.sex ??
                            ""
                        ).toLowerCase();


                    if (
                        rowGender &&
                        !genderKeys.includes(rowGender)
                    ) {
                        continue;
                    }


                    const rowAge =
                        number(
                            row.ageMonths ??
                            row.months ??
                            row.month ??
                            row.age
                        );


                    if (
                        Number.isFinite(rowAge)
                    ) {

                        const difference =
                            Math.abs(
                                rowAge -
                                ageMonths
                            );


                        if (
                            difference <
                            bestDifference
                        ) {

                            best =
                                row;

                            bestDifference =
                                difference;

                        }

                    }

                }


                if (best) {

                    return calculateZFromRow(
                        measurement,
                        best
                    );

                }

            }


            /* ---------------------------------------------
               Object berdasarkan gender
            --------------------------------------------- */

            if (
                typeof container === "object"
            ) {

                for (
                    const key of genderKeys
                ) {

                    if (
                        container[key]
                    ) {

                        const result =
                            tryContainer(
                                container[key]
                            );


                        if (
                            Number.isFinite(result)
                        ) {

                            return result;

                        }

                    }

                }


                /* -----------------------------------------
                   Key umur
                ----------------------------------------- */

                const possibleKeys = [

                    String(ageMonths),

                    `${ageMonths}m`,

                    `m${ageMonths}`,

                    `${ageMonths}.0`

                ];


                for (
                    const key of possibleKeys
                ) {

                    if (
                        container[key]
                    ) {

                        const result =
                            calculateZFromRow(
                                measurement,
                                container[key]
                            );


                        if (
                            Number.isFinite(result)
                        ) {

                            return result;

                        }

                    }

                }

            }


            return NaN;

        }



        /* ===============================================
           Cari indikator
        =============================================== */

        for (
            const indicatorKey of indicators
        ) {

            if (
                Object.prototype.hasOwnProperty.call(
                    data,
                    indicatorKey
                )
            ) {

                const result =
                    tryContainer(
                        data[indicatorKey]
                    );


                if (
                    Number.isFinite(result)
                ) {

                    return result;

                }

            }

        }


        /* ===============================================
           Jika struktur langsung gender
        =============================================== */

        for (
            const genderKey of genderKeys
        ) {

            if (
                data[genderKey]
            ) {

                const genderData =
                    data[genderKey];


                for (
                    const indicatorKey of indicators
                ) {

                    if (
                        genderData[indicatorKey]
                    ) {

                        const result =
                            tryContainer(
                                genderData[indicatorKey]
                            );


                        if (
                            Number.isFinite(result)
                        ) {

                            return result;

                        }

                    }

                }

            }

        }


        return NaN;

    }



    /* =====================================================
       HITUNG Z-SCORE
    ===================================================== */

    function calculateZScore(
        indicator,
        gender,
        ageMonths,
        measurement
    ) {

        const data =
            findWHOData();


        if (!data) {

            return NaN;

        }


        return searchDataObject(
            data,
            indicator,
            gender,
            ageMonths,
            measurement
        );

    }



    /* =====================================================
       STATUS Z-SCORE
    ===================================================== */

    function classifyZScore(
        z,
        indicator
    ) {

        if (!Number.isFinite(z)) {

            return {
                status: "Data Z-score belum tersedia",
                degree: "—"
            };

        }


        /* ===============================================
           IMT/U
           
           WHO 5–19:
           < -3 severe thinness
           < -2 thinness
           > +1 overweight
           > +2 obesity
        =============================================== */

        if (
            indicator === "bmi"
        ) {

            if (z < -3) {

                return {
                    status: "Sangat kurus",
                    degree: "Severe thinness"
                };

            }

            if (z < -2) {

                return {
                    status: "Kurus",
                    degree: "Thinness"
                };

            }

            if (z <= 1) {

                return {
                    status: "Normal",
                    degree: "Normal"
                };

            }

            if (z <= 2) {

                return {
                    status: "Gemuk",
                    degree: "Overweight"
                };

            }

            return {
                status: "Obesitas",
                degree: "Obesity"
            };

        }


        /* ===============================================
           TB/PB/U
        =============================================== */

        if (
            indicator === "hfa"
        ) {

            if (z < -3) {

                return {
                    status: "Sangat pendek",
                    degree: "Severely stunted"
                };

            }

            if (z < -2) {

                return {
                    status: "Pendek",
                    degree: "Stunted"
                };

            }

            return {
                status: "Normal",
                degree: "Normal"
            };

        }


        /* ===============================================
           BB/U
        =============================================== */

        if (
            indicator === "bfa"
        ) {

            if (z < -3) {

                return {
                    status: "Berat badan sangat kurang",
                    degree: "Severely underweight"
                };

            }

            if (z < -2) {

                return {
                    status: "Berat badan kurang",
                    degree: "Underweight"
                };

            }

            return {
                status: "Berat badan normal",
                degree: "Normal"
            };

        }


        /* ===============================================
           BB/TB atau BB/PB
        =============================================== */

        if (
            indicator === "wfh"
        ) {

            if (z < -3) {

                return {
                    status: "Gizi buruk",
                    degree: "Severely wasted"
                };

            }

            if (z < -2) {

                return {
                    status: "Gizi kurang",
                    degree: "Wasted"
                };

            }

            if (z <= 1) {

                return {
                    status: "Gizi baik",
                    degree: "Normal"
                };

            }

            if (z <= 2) {

                return {
                    status: "Risiko gizi lebih",
                    degree: "Possible risk of overweight"
                };

            }

            if (z <= 3) {

                return {
                    status: "Gizi lebih",
                    degree: "Overweight"
                };

            }

            return {
                status: "Obesitas",
                degree: "Obesity"
            };

        }


        return {
            status: "Tidak diketahui",
            degree: "—"
        };

    }



    /* =====================================================
       TAMPILKAN Z-SCORE
    ===================================================== */

    function displayZScore(
        valueId,
        statusId,
        z,
        indicator
    ) {

        if (!Number.isFinite(z)) {

            setText(
                valueId,
                "—"
            );

            setText(
                statusId,
                "Data Z-score belum tersedia"
            );

            return;

        }


        const result =
            classifyZScore(
                z,
                indicator
            );


        setText(
            valueId,
            z.toFixed(2) + " SD"
        );


        setText(
            statusId,
            result.status
        );

    }



    /* =====================================================
       MAKROS
       
       Ini adalah estimasi edukasi, bukan kebutuhan
       individual definitif.
    ===================================================== */

    function calculateMacros(
        ageMonths,
        weight,
        gender
    ) {

        const ageYears =
            ageMonths / 12;


        let calories;


        /* -----------------------------------------------
           Estimasi sederhana berbasis berat badan
           untuk kalkulator edukasi.
        ----------------------------------------------- */

        if (ageYears < 1) {

            calories =
                weight * 100;

        } else if (ageYears < 3) {

            calories =
                weight * 95;

        } else if (ageYears < 5) {

            calories =
                weight * 90;

        } else if (ageYears < 10) {

            calories =
                weight * 75;

        } else {

            calories =
                weight * 55;

        }


        /* -----------------------------------------------
           Faktor aktivitas kecil
        ----------------------------------------------- */

        calories *= 1.05;


        /* -----------------------------------------------
           Protein
        ----------------------------------------------- */

        let proteinPerKg;


        if (ageYears < 1) {

            proteinPerKg = 1.5;

        } else if (ageYears < 3) {

            proteinPerKg = 1.2;

        } else if (ageYears < 10) {

            proteinPerKg = 1.0;

        } else {

            proteinPerKg = 0.9;

        }


        const protein =
            weight * proteinPerKg;


        /* -----------------------------------------------
           Lemak sekitar 30% energi
        ----------------------------------------------- */

        const fat =
            (calories * 0.30) / 9;


        /* -----------------------------------------------
           Karbohidrat sekitar 50% energi
        ----------------------------------------------- */

        const carbs =
            (calories * 0.50) / 4;


        return {

            calories:
                Math.round(calories),

            protein:
                round(protein, 1),

            carbs:
                round(carbs, 1),

            fat:
                round(fat, 1)

        };

    }



    /* =====================================================
       TAMPILKAN MAKROS
    ===================================================== */

    function displayMacros(
        macros
    ) {

        if (!macros) {
            return;
        }


        setText(
            "childCalories",
            macros.calories
        );


        setText(
            "childProtein",
            macros.protein
        );


        setText(
            "childCarbs",
            macros.carbs
        );


        setText(
            "childFat",
            macros.fat
        );


        /* -----------------------------------------------
           Progress bar visual
        ----------------------------------------------- */

        const proteinPercent =
            Math.min(
                100,
                (
                    macros.protein /
                    60
                ) * 100
            );


        const carbsPercent =
            Math.min(
                100,
                (
                    macros.carbs /
                    150
                ) * 100
            );


        const fatPercent =
            Math.min(
                100,
                (
                    macros.fat /
                    60
                ) * 100
            );


        const proteinProgress =
            $("proteinProgress");

        const carbsProgress =
            $("carbsProgress");

        const fatProgress =
            $("fatProgress");


        if (proteinProgress) {

            proteinProgress.style.width =
                `${proteinPercent}%`;

        }


        if (carbsProgress) {

            carbsProgress.style.width =
                `${carbsPercent}%`;

        }


        if (fatProgress) {

            fatProgress.style.width =
                `${fatPercent}%`;

        }

    }



    /* =====================================================
       UPDATE STATUS UTAMA
    ===================================================== */

    function updateMainStatus(
        bmiStatus,
        hfaStatus,
        wfhStatus
    ) {

        let status =
            "Belum dihitung";

        let degree =
            "—";

        let description =
            "Hasil interpretasi akan muncul setelah data dihitung.";

        let recommendation =
            "Lakukan pengukuran antropometri dengan benar dan interpretasikan berdasarkan umur serta jenis kelamin.";

        let icon =
            "📊";


        /* -----------------------------------------------
           Prioritas masalah wasting/overweight
        ----------------------------------------------- */

        if (wfhStatus) {

            status =
                wfhStatus.status;

            degree =
                wfhStatus.degree;


            if (
                wfhStatus.degree ===
                "Severely wasted"
            ) {

                icon = "⚠️";

                description =
                    "Hasil menunjukkan kemungkinan gizi buruk berdasarkan indikator BB terhadap panjang/tinggi badan.";

                recommendation =
                    "Perlu evaluasi lebih lanjut oleh tenaga kesehatan.";

            } else if (
                wfhStatus.degree ===
                "Wasted"
            ) {

                icon = "⚠️";

                description =
                    "Hasil menunjukkan kemungkinan gizi kurang berdasarkan indikator BB terhadap panjang/tinggi badan.";

                recommendation =
                    "Perlu pemantauan pertumbuhan dan evaluasi asupan serta kondisi klinis.";

            } else if (
                wfhStatus.degree ===
                "Overweight"
            ) {

                icon = "⚠️";

                description =
                    "Hasil menunjukkan kemungkinan gizi lebih berdasarkan indikator BB terhadap panjang/tinggi badan.";

                recommendation =
                    "Perlu evaluasi pola makan, aktivitas fisik dan pertumbuhan secara berkala.";

            } else if (
                wfhStatus.degree ===
                "Obesity"
            ) {

                icon = "⚠️";

                description =
                    "Hasil menunjukkan kemungkinan obesitas berdasarkan indikator BB terhadap panjang/tinggi badan.";

                recommendation =
                    "Disarankan dilakukan evaluasi pertumbuhan dan pola makan oleh tenaga kesehatan.";

            }

        }


        /* -----------------------------------------------
           Jika IMT/U tersedia, gunakan sebagai indikator
           utama status berat badan
        ----------------------------------------------- */

        if (bmiStatus) {

            status =
                bmiStatus.status;

            degree =
                bmiStatus.degree;


            if (
                bmiStatus.degree ===
                "Severe thinness"
            ) {

                icon = "⚠️";

                description =
                    "IMT menurut umur berada di bawah -3 SD.";

                recommendation =
                    "Perlu evaluasi lebih lanjut oleh tenaga kesehatan.";

            } else if (
                bmiStatus.degree ===
                "Thinness"
            ) {

                icon = "⚠️";

                description =
                    "IMT menurut umur berada di bawah -2 SD.";

                recommendation =
                    "Perlu pemantauan pertumbuhan dan evaluasi asupan.";

            } else if (
                bmiStatus.degree ===
                "Overweight"
            ) {

                icon = "⚠️";

                description =
                    "IMT menurut umur berada di atas +1 SD.";

                recommendation =
                    "Pantau pola makan, aktivitas dan pertumbuhan anak.";

            } else if (
                bmiStatus.degree ===
                "Obesity"
            ) {

                icon = "⚠️";

                description =
                    "IMT menurut umur berada di atas +2 SD.";

                recommendation =
                    "Disarankan evaluasi lebih lanjut oleh tenaga kesehatan.";

            } else {

                icon = "✅";

                description =
                    "IMT menurut umur berada dalam rentang normal.";

                recommendation =
                    "Pertahankan pola makan seimbang dan pemantauan pertumbuhan berkala.";

            }

        }


        /* -----------------------------------------------
           TB/U dapat memberikan informasi tambahan
        ----------------------------------------------- */

        if (
            hfaStatus &&
            (
                hfaStatus.degree ===
                "Stunted" ||
                hfaStatus.degree ===
                "Severely stunted"
            )
        ) {

            description +=
                " Indikator tinggi/panjang badan menurut umur juga menunjukkan gangguan pertumbuhan linear.";


            recommendation +=
                " Pertumbuhan tinggi/panjang badan perlu dipantau secara berkala.";

        }


        setText(
            "nutritionStatus",
            status
        );


        setText(
            "nutritionDegreeText",
            degree
        );


        setText(
            "nutritionStatusDescription",
            description
        );


        setText(
            "recommendationText",
            recommendation
        );


        setText(
            "nutritionStatusIcon",
            icon
        );


        setText(
            "nutritionDegreeBadge",
            degree
        );

    }



    /* =====================================================
       TAMPILKAN HASIL
    ===================================================== */

    function displayResult(
        age,
        weight,
        height,
        bmi
    ) {

        /* -----------------------------------------------
           Data dasar
        ----------------------------------------------- */

        setText(
            "resultWeight",
            `${round(weight, 1)} kg`
        );


        setText(
            "resultHeight",
            `${round(height, 1)} cm`
        );


        setText(
            "resultAge",
            formatAge(age)
        );


        setText(
            "anakBMIValue",
            bmi.toFixed(1)
        );


        /* -----------------------------------------------
           Z-score
        ----------------------------------------------- */

        const gender =
            genderInput.value;


        const ageMonths =
            age.totalMonths;


        const zBFA =
            calculateZScore(
                "bfa",
                gender,
                ageMonths,
                weight
            );


        const zHFA =
            calculateZScore(
                "hfa",
                gender,
                ageMonths,
                height
            );


        const zWFH =
            calculateZScore(
                "wfh",
                gender,
                ageMonths,
                weight
            );


        const zBMI =
            calculateZScore(
                "bmi",
                gender,
                ageMonths,
                bmi
            );


        console.log(
            "Z-SCORE",
            {
                BB_U: zBFA,
                TB_U: zHFA,
                BB_TB: zWFH,
                IMT_U: zBMI
            }
        );


        displayZScore(
            "zscoreBFA",
            "statusBFA",
            zBFA,
            "bfa"
        );


        displayZScore(
            "zscoreHFA",
            "statusHFA",
            zHFA,
            "hfa"
        );


        displayZScore(
            "zscoreWFA",
            "statusWFA",
            zWFH,
            "wfh"
        );


        displayZScore(
            "zscoreBMI",
            "statusBMI",
            zBMI,
            "bmi"
        );


        /* -----------------------------------------------
           Status
        ----------------------------------------------- */

        const bmiStatus =
            Number.isFinite(zBMI)
                ? classifyZScore(
                    zBMI,
                    "bmi"
                )
                : null;


        const hfaStatus =
            Number.isFinite(zHFA)
                ? classifyZScore(
                    zHFA,
                    "hfa"
                )
                : null;


        const wfhStatus =
            Number.isFinite(zWFH)
                ? classifyZScore(
                    zWFH,
                    "wfh"
                )
                : null;


        updateMainStatus(
            bmiStatus,
            hfaStatus,
            wfhStatus
        );


        /* -----------------------------------------------
           Makronutrien
        ----------------------------------------------- */

        const macros =
            calculateMacros(
                ageMonths,
                weight,
                gender
            );


        displayMacros(
            macros
        );


        /* -----------------------------------------------
           Tampilkan hasil
        ----------------------------------------------- */

        const result =
            $("anakResult");


        if (result) {

            result.innerHTML = `

                <div class="anak-result-placeholder">

                    <span
                        class="anak-result-placeholder-icon"
                        aria-hidden="true"
                    >
                        ✅
                    </span>

                    <div>

                        <strong>
                            Perhitungan berhasil
                        </strong>

                        <small>
                            Hasil status gizi dan kebutuhan
                            gizi telah diperbarui.
                        </small>

                    </div>

                </div>

            `;

        }


        const resultSection =
            $("hasil-gizi");


        if (resultSection) {

            setTimeout(() => {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 150);

        }

    }



    /* =====================================================
       FUNGSI UTAMA
    ===================================================== */

    function calculateChildNutrition() {

        console.log(
            "TOMBOL HITUNG STATUS GIZI DIKLIK"
        );


        clearError();


        /* -----------------------------------------------
           Gender
        ----------------------------------------------- */

        const gender =
            genderInput?.value;


        if (
            gender !== "male" &&
            gender !== "female"
        ) {

            showError(
                "Silakan pilih jenis kelamin anak."
            );

            return;

        }


        /* -----------------------------------------------
           Tanggal
        ----------------------------------------------- */

        const birthDate =
            parseDate(
                birthInput?.value
            );


        const checkDate =
            parseDate(
                checkInput?.value
            );


        if (!birthDate) {

            showError(
                "Silakan masukkan tanggal lahir anak."
            );

            return;

        }


        if (!checkDate) {

            showError(
                "Silakan masukkan tanggal pemeriksaan."
            );

            return;

        }


        if (
            checkDate <
            birthDate
        ) {

            showError(
                "Tanggal pemeriksaan tidak boleh lebih awal daripada tanggal lahir."
            );

            return;

        }


        /* -----------------------------------------------
           Usia
        ----------------------------------------------- */

        const age =
            calculateAge(
                birthDate,
                checkDate
            );


        if (
            age.totalMonths < 0
        ) {

            showError(
                "Usia anak tidak valid."
            );

            return;

        }


        /* -----------------------------------------------
           Berat
        ----------------------------------------------- */

        const weight =
            number(
                weightInput?.value
            );


        if (
            !Number.isFinite(weight) ||
            weight <= 0
        ) {

            showError(
                "Masukkan berat badan yang valid."
            );

            return;

        }


        /* -----------------------------------------------
           Tinggi
        ----------------------------------------------- */

        const height =
            number(
                heightInput?.value
            );


        if (
            !Number.isFinite(height) ||
            height <= 0
        ) {

            showError(
                "Masukkan tinggi atau panjang badan yang valid."
            );

            return;

        }


        if (
            height < 30 ||
            height > 220
        ) {

            showError(
                "Periksa kembali tinggi/panjang badan anak."
            );

            return;

        }


        /* -----------------------------------------------
           Batas usia kalkulator
        ----------------------------------------------- */

        if (
            age.totalMonths > 228
        ) {

            showError(
                "Kalkulator ini dirancang untuk anak sampai usia 19 tahun."
            );

            return;

        }


        console.log(
            "DATA:",
            {
                gender,
                age,
                weight,
                height
            }
        );


        /* -----------------------------------------------
           IMT
        ----------------------------------------------- */

        const bmi =
            calculateBMI(
                weight,
                height
            );


        if (
            !Number.isFinite(bmi)
        ) {

            showError(
                "IMT tidak dapat dihitung. Periksa berat dan tinggi badan."
            );

            return;

        }


        /* -----------------------------------------------
           Update UI
        ----------------------------------------------- */

        updateAgeDisplay();


        displayResult(
            age,
            weight,
            height,
            bmi
        );


        console.log(
            "PERHITUNGAN SELESAI"
        );

    }



    /* =====================================================
       PASANG EVENT LISTENER
    ===================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateChildNutrition
        );

        console.log(
            "Event tombol berhasil dipasang."
        );

    } else {

        console.error(
            "Tombol #anakCalculateButton tidak ditemukan."
        );

    }



    /* =====================================================
       EXPORT GLOBAL
       
       Tidak wajib untuk HTML baru, tetapi dibuat sebagai
       fallback jika browser/cache lama masih menggunakan
       onclick.
    ===================================================== */

    window.calculateChildNutrition =
        calculateChildNutrition;



    /* =====================================================
       INIT
    ===================================================== */

    updateAgeDisplay();


    console.log(
        "Jumlah input:",
        document.querySelectorAll(
            "input"
        ).length
    );


    console.log(
        "Jumlah select:",
        document.querySelectorAll(
            "select"
        ).length
    );


    console.log(
        "Jumlah button:",
        document.querySelectorAll(
            "button"
        ).length
    );


    console.log(
        "Area hasil:",
        $("anakResult")
    );


})();
