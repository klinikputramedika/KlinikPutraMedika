/* =========================================================
   GIZI ANAK - KLINIK PUTRA MEDIKA
   =========================================================

   Fungsi:
   - Menghitung usia otomatis
   - Menghitung IMT
   - Menentukan kelompok usia
   - Menghitung z-score menggunakan data LMS WHO
   - BB/U
   - TB/U
   - BB/TB
   - IMT/U
   - Menampilkan interpretasi status gizi
   - Perkiraan kebutuhan energi
   - Perkiraan makronutrien
   - Tidak menggunakan inline onclick
   ========================================================= */

"use strict";


/* =========================================================
   KONFIGURASI
========================================================= */

const CHILD_MAX_AGE_MONTHS = 228; // 19 tahun


/* =========================================================
   HELPER DOM
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


function showElement(id) {

    const element = $(id);

    if (element) {
        element.style.display = "";
    }
}


function hideElement(id) {

    const element = $(id);

    if (element) {
        element.style.display = "none";
    }
}


/* =========================================================
   FORMAT ANGKA
========================================================= */

function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    return value.toFixed(decimals).replace(".", ",");
}


function formatZScore(value) {

    if (!Number.isFinite(value)) {
        return "—";
    }

    if (Math.abs(value) < 0.005) {
        return "0,00 SD";
    }

    const sign = value > 0 ? "+" : "";

    return sign + value.toFixed(2).replace(".", ",") + " SD";
}


/* =========================================================
   TANGGAL
========================================================= */

function parseDateInput(value) {

    if (!value) {
        return null;
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}


/* =========================================================
   SELISIH USIA
========================================================= */

function calculateAge(birthDate, checkDate) {

    if (!birthDate || !checkDate) {
        return null;
    }

    if (checkDate < birthDate) {
        return null;
    }

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

        days += previousMonth.getDate();
    }


    if (months < 0) {

        years--;
        months += 12;
    }


    const totalDays =
        Math.floor(
            (
                checkDate.getTime() -
                birthDate.getTime()
            ) /
            86400000
        );


    const totalMonths =
        years * 12 + months;


    return {
        years,
        months,
        days,
        totalMonths,
        totalDays
    };
}


/* =========================================================
   TAMPILKAN USIA
========================================================= */

function updateAgeDisplay() {

    const birthInput = $("anakBirthDate");
    const checkInput = $("anakCheckDate");

    if (!birthInput || !checkInput) {
        return null;
    }

    const birthDate =
        parseDateInput(birthInput.value);

    const checkDate =
        parseDateInput(checkInput.value);


    if (!birthDate || !checkDate) {

        setText(
            "anakAgeText",
            "—"
        );

        setText(
            "anakAgeDays",
            "—"
        );

        return null;
    }


    const age =
        calculateAge(
            birthDate,
            checkDate
        );


    if (!age) {

        setText(
            "anakAgeText",
            "Tanggal tidak valid"
        );

        setText(
            "anakAgeDays",
            "Tanggal pemeriksaan harus ≥ tanggal lahir"
        );

        return null;
    }


    setText(
        "anakAgeText",
        `${age.years} tahun ${age.months} bulan ${age.days} hari`
    );


    setText(
        "anakAgeDays",
        `${age.totalDays} hari`
    );


    return age;
}


/* =========================================================
   IMT
========================================================= */

function calculateBMI(weightKg, heightCm) {

    if (
        !Number.isFinite(weightKg) ||
        !Number.isFinite(heightCm) ||
        weightKg <= 0 ||
        heightCm <= 0
    ) {
        return NaN;
    }


    const heightMeter =
        heightCm / 100;


    return (
        weightKg /
        Math.pow(heightMeter, 2)
    );
}


/* =========================================================
   VALIDASI
========================================================= */

function validateInput() {

    const gender =
        $("anakGender")?.value;

    const birthDate =
        parseDateInput(
            $("anakBirthDate")?.value
        );

    const checkDate =
        parseDateInput(
            $("anakCheckDate")?.value
        );

    const weight =
        Number(
            $("anakWeight")?.value
        );

    const height =
        Number(
            $("anakHeight")?.value
        );


    if (!gender) {

        alert(
            "Silakan pilih jenis kelamin anak."
        );

        return null;
    }


    if (!birthDate) {

        alert(
            "Silakan masukkan tanggal lahir."
        );

        return null;
    }


    if (!checkDate) {

        alert(
            "Silakan masukkan tanggal pemeriksaan."
        );

        return null;
    }


    if (checkDate < birthDate) {

        alert(
            "Tanggal pemeriksaan tidak boleh sebelum tanggal lahir."
        );

        return null;
    }


    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {

        alert(
            "Masukkan berat badan yang valid."
        );

        return null;
    }


    if (
        !Number.isFinite(height) ||
        height <= 0
    ) {

        alert(
            "Masukkan tinggi/panjang badan yang valid."
        );

        return null;
    }


    const age =
        calculateAge(
            birthDate,
            checkDate
        );


    if (!age) {
        return null;
    }


    if (age.totalMonths > CHILD_MAX_AGE_MONTHS) {

        alert(
            "Kalkulator ini dirancang untuk anak hingga usia 19 tahun."
        );

        return null;
    }


    return {
        gender,
        birthDate,
        checkDate,
        weight,
        height,
        age
    };
}


/* =========================================================
   KELOMPOK USIA
========================================================= */

function getAgeGroup(age) {

    if (!age) {
        return "unknown";
    }


    if (age.totalMonths < 60) {
        return "0-5";
    }


    if (age.totalMonths < 228) {
        return "5-19";
    }


    return "over-19";
}


/* =========================================================
   DATA WHO
=========================================================

   JS ini menerima beberapa format data.

   Format LMS ideal:

   window.WHO_ANTHRO = {
       weightForAge: {
           male: [...],
           female: [...]
       },

       heightForAge: {
           male: [...],
           female: [...]
       },

       weightForHeight: {
           male: [...],
           female: [...]
       },

       bmiForAge: {
           male: [...],
           female: [...]
       }
   };

   Setiap entry:

   {
       age: 24,
       L: ...,
       M: ...,
       S: ...
   }

   age:
   usia dalam bulan.

========================================================= */

function getWHODataObject() {

    return (
        window.WHO_ANTHRO ||
        window.WHO_ANTHRO_DATA ||
        window.whoAnthroData ||
        window.WHO_DATA ||
        null
    );
}


/* =========================================================
   NORMALISASI KEY
========================================================= */

function normalizeGender(gender) {

    if (
        gender === "male" ||
        gender === "boys" ||
        gender === "boy" ||
        gender === "laki-laki"
    ) {
        return "male";
    }


    return "female";
}


/* =========================================================
   CARI DATA LMS
========================================================= */

function getIndicatorData(indicator, gender) {

    const data =
        getWHODataObject();

    if (!data) {
        return null;
    }


    const g =
        normalizeGender(gender);


    const aliases = {

        weightForAge: [
            "weightForAge",
            "weightAge",
            "wfa",
            "bbU",
            "bb_u"
        ],

        heightForAge: [
            "heightForAge",
            "lengthForAge",
            "heightAge",
            "hfa",
            "tbu",
            "tb_u"
        ],

        weightForHeight: [
            "weightForHeight",
            "weightForLength",
            "weightHeight",
            "wfh",
            "wfl",
            "bbtb",
            "bb_tb"
        ],

        bmiForAge: [
            "bmiForAge",
            "bmiAge",
            "bfa",
            "imtu",
            "imt_u"
        ]
    };


    const keys =
        aliases[indicator] || [];


    for (const key of keys) {

        const indicatorData =
            data[key];

        if (!indicatorData) {
            continue;
        }


        if (Array.isArray(indicatorData)) {
            return indicatorData;
        }


        if (indicatorData[g]) {
            return indicatorData[g];
        }


        if (g === "male" && indicatorData.boys) {
            return indicatorData.boys;
        }


        if (g === "female" && indicatorData.girls) {
            return indicatorData.girls;
        }
    }


    return null;
}


/* =========================================================
   CARI TITIK TERDEKAT
========================================================= */

function findNearestLMS(data, ageValue) {

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {
        return null;
    }


    let nearest = null;
    let difference = Infinity;


    for (const item of data) {

        if (!item) {
            continue;
        }


        const itemAge =
            Number(
                item.age ??
                item.month ??
                item.months ??
                item.ageMonths
            );


        if (!Number.isFinite(itemAge)) {
            continue;
        }


        const currentDifference =
            Math.abs(
                itemAge - ageValue
            );


        if (
            currentDifference <
            difference
        ) {

            difference =
                currentDifference;

            nearest = item;
        }
    }


    return nearest;
}


/* =========================================================
   LMS → Z SCORE
========================================================= */

function calculateLMSZScore(
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


    /*
       WHO LMS transformation:

       Jika L != 0:

       Z =
       (((X/M)^L)-1) / (L*S)

       Jika L = 0:

       Z =
       ln(X/M) / S
    */


    let z;


    if (Math.abs(L) < 1e-12) {

        z =
            Math.log(
                measurement / M
            ) / S;

    } else {

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


/* =========================================================
   Z SCORE DARI DATA WHO
========================================================= */

function calculateWHOZScore(
    indicator,
    gender,
    age,
    measurement
) {

    const data =
        getIndicatorData(
            indicator,
            gender
        );


    if (!data) {

        console.warn(
            `Data WHO tidak ditemukan untuk ${indicator}.`
        );

        return {
            z: NaN,
            source: "missing"
        };
    }


    /*
       WHO data bisa menggunakan umur
       dalam bulan atau hari.

       Untuk kalkulator ini kita cari
       berdasarkan total bulan dengan
       pecahan berdasarkan hari.
    */

    const ageMonths =
        age.totalMonths +
        (
            age.days /
            30.4375
        );


    const point =
        findNearestLMS(
            data,
            ageMonths
        );


    if (!point) {

        return {
            z: NaN,
            source: "no-point"
        };
    }


    const L =
        Number(
            point.L ??
            point.l
        );


    const M =
        Number(
            point.M ??
            point.m
        );


    const S =
        Number(
            point.S ??
            point.s
        );


    const z =
        calculateLMSZScore(
            measurement,
            L,
            M,
            S
        );


    return {
        z,
        source: "WHO",
        point
    };
}


/* =========================================================
   Z SCORE UNTUK BB/TB
=========================================================

   BB/TB berbeda dari indikator menurut umur.

   Dataset ideal menggunakan tinggi/panjang
   sebagai index, bukan umur.

   Fungsi ini mencari titik LMS berdasarkan
   height/length.
========================================================= */

function calculateWeightHeightZScore(
    gender,
    heightCm,
    weightKg
) {

    const data =
        getIndicatorData(
            "weightForHeight",
            gender
        );


    if (!data) {

        return {
            z: NaN,
            source: "missing"
        };
    }


    let nearest = null;
    let difference = Infinity;


    for (const item of data) {

        const itemHeight =
            Number(
                item.height ??
                item.length ??
                item.heightCm ??
                item.lengthCm ??
                item.x
            );


        if (!Number.isFinite(itemHeight)) {
            continue;
        }


        const d =
            Math.abs(
                itemHeight -
                heightCm
            );


        if (d < difference) {

            difference = d;
            nearest = item;
        }
    }


    if (!nearest) {

        return {
            z: NaN,
            source: "no-point"
        };
    }


    const L =
        Number(
            nearest.L ??
            nearest.l
        );


    const M =
        Number(
            nearest.M ??
            nearest.m
        );


    const S =
        Number(
            nearest.S ??
            nearest.s
        );


    const z =
        calculateLMSZScore(
            weightKg,
            L,
            M,
            S
        );


    return {
        z,
        source: "WHO",
        point: nearest
    };
}


/* =========================================================
   KATEGORI Z SCORE
========================================================= */

function classifyWeightForAge(z) {

    if (!Number.isFinite(z)) {
        return "Data WHO belum tersedia";
    }


    if (z < -3) {
        return "Berat badan sangat kurang";
    }


    if (z < -2) {
        return "Berat badan kurang";
    }


    if (z <= 2) {
        return "Berat badan normal";
    }


    return "Berat badan lebih";
}


/* =========================================================
   TINGGI/PANJANG BADAN MENURUT UMUR
========================================================= */

function classifyHeightForAge(z) {

    if (!Number.isFinite(z)) {
        return "Data WHO belum tersedia";
    }


    if (z < -3) {
        return "Sangat pendek";
    }


    if (z < -2) {
        return "Pendek";
    }


    return "Normal";
}


/* =========================================================
   BB/TB
========================================================= */

function classifyWeightForHeight(z) {

    if (!Number.isFinite(z)) {
        return "Data WHO belum tersedia";
    }


    if (z < -3) {
        return "Gizi buruk / sangat kurus";
    }


    if (z < -2) {
        return "Gizi kurang / kurus";
    }


    if (z <= 1) {
        return "Gizi baik / normal";
    }


    if (z <= 2) {
        return "Berisiko gizi lebih";
    }


    if (z <= 3) {
        return "Gizi lebih / overweight";
    }


    return "Obesitas";
}


/* =========================================================
   IMT/U
========================================================= */

function classifyBMIForAge(z, ageMonths) {

    if (!Number.isFinite(z)) {
        return "Data WHO belum tersedia";
    }


    if (ageMonths < 60) {

        if (z < -3) {
            return "Gizi buruk / sangat kurus";
        }

        if (z < -2) {
            return "Gizi kurang / kurus";
        }

        if (z <= 1) {
            return "Gizi baik / normal";
        }

        if (z <= 2) {
            return "Berisiko gizi lebih";
        }

        if (z <= 3) {
            return "Gizi lebih / overweight";
        }

        return "Obesitas";
    }


    /*
       WHO 2007 untuk 5–19 tahun:

       < -3 SD = severe thinness
       < -2 SD = thinness
       <= +1 SD = normal
       > +1 SD = overweight
       > +2 SD = obesity
    */

    if (z < -3) {
        return "Sangat kurus (severe thinness)";
    }


    if (z < -2) {
        return "Kurus (thinness)";
    }


    if (z <= 1) {
        return "Normal";
    }


    if (z <= 2) {
        return "Overweight";
    }


    return "Obesitas";
}


/* =========================================================
   STATUS UTAMA
========================================================= */

function determineOverallStatus(results) {

    const statuses = [];


    if (
        Number.isFinite(
            results.bmiAgeZ
        )
    ) {

        statuses.push(
            classifyBMIForAge(
                results.bmiAgeZ,
                results.age.totalMonths
            )
        );
    }


    if (
        Number.isFinite(
            results.heightAgeZ
        )
    ) {

        statuses.push(
            classifyHeightForAge(
                results.heightAgeZ
            )
        );
    }


    if (
        Number.isFinite(
            results.weightHeightZ
        )
    ) {

        statuses.push(
            classifyWeightForHeight(
                results.weightHeightZ
            )
        );
    }


    /*
       Prioritas klinis sederhana:
       severe wasting / obesity / stunting
       ditampilkan terlebih dahulu.
    */


    if (
        statuses.some(
            s =>
                s.includes("Obesitas")
        )
    ) {
        return "Obesitas";
    }


    if (
        statuses.some(
            s =>
                s.includes("sangat kurus") ||
                s.includes("Sangat kurus")
        )
    ) {
        return "Sangat kurus";
    }


    if (
        statuses.some(
            s =>
                s.includes("Pendek") ||
                s.includes("pendek")
        )
    ) {
        return "Pendek";
    }


    if (
        statuses.some(
            s =>
                s.includes("Gizi lebih") ||
                s.includes("Overweight")
        )
    ) {
        return "Gizi lebih / overweight";
    }


    if (
        statuses.some(
            s =>
                s.includes("Gizi kurang") ||
                s.includes("Kurus") ||
                s.includes("kurus")
        )
    ) {
        return "Gizi kurang / kurus";
    }


    if (
        statuses.some(
            s =>
                s.includes("normal") ||
                s.includes("Normal")
        )
    ) {
        return "Status gizi normal";
    }


    return "Belum dapat ditentukan";
}


/* =========================================================
   KEBUTUHAN ENERGI
=========================================================

   Ini hanya estimasi edukatif.

   Untuk penggunaan klinis, kebutuhan energi
   individual harus mempertimbangkan usia,
   jenis kelamin, aktivitas, kondisi klinis,
   pertumbuhan dan tujuan terapi.
========================================================= */

function estimateEnergy(
    age,
    weight,
    gender
) {

    const years =
        age.totalMonths / 12;


    let kcalPerKg;


    if (years < 1) {

        kcalPerKg = 100;

    } else if (years < 3) {

        kcalPerKg = 90;

    } else if (years < 7) {

        kcalPerKg = 75;

    } else if (years < 10) {

        kcalPerKg = 65;

    } else if (years < 13) {

        kcalPerKg =
            gender === "male"
                ? 55
                : 50;

    } else {

        kcalPerKg =
            gender === "male"
                ? 50
                : 45;
    }


    const calories =
        weight *
        kcalPerKg;


    return Math.round(
        calories / 10
    ) * 10;
}


/* =========================================================
   MAKRO
========================================================= */

function calculateMacros(
    calories,
    weight,
    age
) {

    if (
        !Number.isFinite(calories) ||
        calories <= 0
    ) {

        return {
            protein: NaN,
            carbohydrate: NaN,
            fat: NaN
        };
    }


    /*
       Protein edukatif berbasis berat badan.

       Bukan prescription diet.
    */

    let proteinPerKg;


    if (age.totalMonths < 12) {

        proteinPerKg = 1.5;

    } else if (age.totalMonths < 36) {

        proteinPerKg = 1.2;

    } else if (age.totalMonths < 120) {

        proteinPerKg = 1.0;

    } else {

        proteinPerKg = 0.85;
    }


    let protein =
        weight *
        proteinPerKg;


    /*
       Lemak:
       sekitar 30% energi sebagai estimasi
       sederhana untuk kalkulator edukasi.
    */

    let fat =
        (calories * 0.30) / 9;


    /*
       Karbohidrat:
       sisa energi.
    */

    let carbohydrate =
        (
            calories -
            (protein * 4) -
            (fat * 9)
        ) / 4;


    /*
       Pengaman agar tidak negatif.
    */

    if (carbohydrate < 0) {
        carbohydrate = 0;
    }


    return {
        protein: Math.round(protein),
        carbohydrate: Math.round(carbohydrate),
        fat: Math.round(fat)
    };
}


/* =========================================================
   RENDER Z SCORE
========================================================= */

function renderZScore(
    zId,
    statusId,
    z,
    status
) {

    setText(
        zId,
        formatZScore(z)
    );


    setText(
        statusId,
        status
    );
}


/* =========================================================
   RENDER HASIL
========================================================= */

function renderResults(
    data,
    results
) {

    const {
        age,
        weight,
        height,
        bmi
    } = results;


    /* ===============================
       RINGKASAN
    =============================== */

    setText(
        "resultAge",
        `${age.years} tahun ${age.months} bulan`
    );


    setText(
        "resultWeight",
        `${formatNumber(weight, 1)} kg`
    );


    setText(
        "resultHeight",
        `${formatNumber(height, 1)} cm`
    );


    setText(
        "resultBMI",
        formatNumber(bmi, 2)
    );


    /* ===============================
       Z SCORE
    =============================== */

    const statusWeightAge =
        classifyWeightForAge(
            results.weightAgeZ
        );


    const statusHeightAge =
        classifyHeightForAge(
            results.heightAgeZ
        );


    const statusWeightHeight =
        classifyWeightForHeight(
            results.weightHeightZ
        );


    const statusBMI =
        classifyBMIForAge(
            results.bmiAgeZ,
            age.totalMonths
        );


    renderZScore(
        "zscoreWeightAge",
        "statusWeightAge",
        results.weightAgeZ,
        statusWeightAge
    );


    renderZScore(
        "zscoreHeightAge",
        "statusHeightAge",
        results.heightAgeZ,
        statusHeightAge
    );


    renderZScore(
        "zscoreWeightHeight",
        "statusWeightHeight",
        results.weightHeightZ,
        statusWeightHeight
    );


    renderZScore(
        "zscoreBMI",
        "statusBMI",
        results.bmiAgeZ,
        statusBMI
    );


    /* ===============================
       STATUS UTAMA
    =============================== */

    const overallStatus =
        determineOverallStatus(
            results
        );


    setText(
        "resultStatus",
        overallStatus
    );


    /* ===============================
       INTERPRETASI
    =============================== */

    const interpretation =
        buildInterpretation(
            results,
            {
                statusWeightAge,
                statusHeightAge,
                statusWeightHeight,
                statusBMI,
                overallStatus
            }
        );


    setText(
        "anakInterpretation",
        interpretation
    );


    /* ===============================
       ENERGI
    =============================== */

    const calories =
        estimateEnergy(
            age,
            weight,
            data.gender
        );


    const macros =
        calculateMacros(
            calories,
            weight,
            age
        );


    setText(
        "childCalories",
        Number.isFinite(calories)
            ? calories.toLocaleString("id-ID")
            : "—"
    );


    setText(
        "childProtein",
        Number.isFinite(macros.protein)
            ? macros.protein
            : "—"
    );


    setText(
        "childCarbohydrate",
        Number.isFinite(macros.carbohydrate)
            ? macros.carbohydrate
            : "—"
    );


    setText(
        "childFat",
        Number.isFinite(macros.fat)
            ? macros.fat
            : "—"
    );


    /* ===============================
       METODE
    =============================== */

    let method =
        getAgeGroup(age) === "0-5"
            ? "WHO Child Growth Standards 0–60 bulan"
            : "WHO Growth Reference 2007 untuk usia 5–19 tahun";


    setText(
        "assessmentMethod",
        method
    );


    /* ===============================
       HASIL
    =============================== */

    const resultBox =
        $("anakResult");


    if (resultBox) {

        resultBox.innerHTML = `

            <div class="anak-result-success">

                <div class="anak-result-success-icon">
                    ✓
                </div>

                <div>

                    <strong>
                        Perhitungan selesai
                    </strong>

                    <small>
                        Status: ${overallStatus}
                    </small>

                </div>

            </div>

        `;
    }
}


/* =========================================================
   INTERPRETASI
========================================================= */

function buildInterpretation(
    results,
    statuses
) {

    const lines = [];


    lines.push(
        `Status utama: ${statuses.overallStatus}.`
    );


    if (
        Number.isFinite(
            results.weightAgeZ
        )
    ) {

        lines.push(
            `BB/U: ${statuses.statusWeightAge} (${formatZScore(results.weightAgeZ)}).`
        );
    }


    if (
        Number.isFinite(
            results.heightAgeZ
        )
    ) {

        lines.push(
            `TB/U atau PB/U: ${statuses.statusHeightAge} (${formatZScore(results.heightAgeZ)}).`
        );
    }


    if (
        Number.isFinite(
            results.weightHeightZ
        )
    ) {

        lines.push(
            `BB/TB atau BB/PB: ${statuses.statusWeightHeight} (${formatZScore(results.weightHeightZ)}).`
        );
    }


    if (
        Number.isFinite(
            results.bmiAgeZ
        )
    ) {

        lines.push(
            `IMT/U: ${statuses.statusBMI} (${formatZScore(results.bmiAgeZ)}).`
        );
    }


    lines.push(
        "Interpretasi akhir tetap perlu mempertimbangkan riwayat pertumbuhan, pemeriksaan klinis, asupan, penyakit penyerta dan penilaian tenaga kesehatan."
    );


    return lines.join(" ");
}


/* =========================================================
   PERHITUNGAN UTAMA
========================================================= */

function calculateChildNutrition() {

    console.log(
        "======================================"
    );

    console.log(
        "TOMBOL HITUNG STATUS GIZI DIKLIK"
    );


    const data =
        validateInput();


    if (!data) {
        return;
    }


    const {
        gender,
        weight,
        height,
        age
    } = data;


    const bmi =
        calculateBMI(
            weight,
            height
        );


    console.log(
        "DATA ANAK:",
        data
    );


    console.log(
        "IMT:",
        bmi
    );


    /* =====================================
       WHO Z SCORE
    ===================================== */


    const weightAgeResult =
        calculateWHOZScore(
            "weightForAge",
            gender,
            age,
            weight
        );


    const heightAgeResult =
        calculateWHOZScore(
            "heightForAge",
            gender,
            age,
            height
        );


    const bmiAgeResult =
        calculateWHOZScore(
            "bmiForAge",
            gender,
            age,
            bmi
        );


    const weightHeightResult =
        calculateWeightHeightZScore(
            gender,
            height,
            weight
        );


    const results = {

        age,

        weight,

        height,

        bmi,

        weightAgeZ:
            weightAgeResult.z,

        heightAgeZ:
            heightAgeResult.z,

        weightHeightZ:
            weightHeightResult.z,

        bmiAgeZ:
            bmiAgeResult.z
    };


    console.log(
        "Z-SCORE:",
        results
    );


    renderResults(
        data,
        results
    );


    console.log(
        "PERHITUNGAN SELESAI"
    );


    /*
       Scroll ke hasil.
    */

    setTimeout(
        () => {

            const resultSection =
                $("hasil-gizi");

            if (resultSection) {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        },
        150
    );
}


/* =========================================================
   EVENT LISTENER
========================================================= */

function initializeChildNutrition() {

    console.log(
        "======================================"
    );

    console.log(
        "GIZI-ANAK.JS BERHASIL DIMUAT"
    );

    console.log(
        "======================================"
    );


    const birthInput =
        $("anakBirthDate");


    const checkInput =
        $("anakCheckDate");


    const calculateButton =
        $("anakCalculateButton");


    if (birthInput) {

        birthInput.addEventListener(
            "change",
            updateAgeDisplay
        );

        birthInput.addEventListener(
            "input",
            updateAgeDisplay
        );
    }


    if (checkInput) {

        checkInput.addEventListener(
            "change",
            updateAgeDisplay
        );

        checkInput.addEventListener(
            "input",
            updateAgeDisplay
        );
    }


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
            "Tombol anakCalculateButton tidak ditemukan."
        );
    }


    /*
       Tanggal pemeriksaan default =
       hari ini.
    */

    if (
        checkInput &&
        !checkInput.value
    ) {

        const today =
            new Date();


        const yyyy =
            today.getFullYear();


        const mm =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const dd =
            String(
                today.getDate()
            ).padStart(2, "0");


        checkInput.value =
            `${yyyy}-${mm}-${dd}`;
    }


    console.log(
        "Jumlah input:",
        document.querySelectorAll("input").length
    );


    console.log(
        "Jumlah select:",
        document.querySelectorAll("select").length
    );


    console.log(
        "Jumlah button:",
        document.querySelectorAll("button").length
    );


    console.log(
        "Area hasil:",
        $("anakResult")
    );


    updateAgeDisplay();
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChildNutrition
    );

} else {

    initializeChildNutrition();
}


/* =========================================================
   PUBLIC API
=========================================================

   Tidak wajib digunakan karena tombol sudah
   menggunakan addEventListener.

   Namun kita expose fungsi ini supaya debugging
   dari Console tetap mudah.
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;

window.updateChildAge =
    updateAgeDisplay;

window.calculateChildBMI =
    calculateBMI;
