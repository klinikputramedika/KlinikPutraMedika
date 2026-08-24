/* =========================================================
   KLINIK PUTRA MEDIKA
   GIZI ANAK
   =========================================================
   
   FUNGSI:
   - Perhitungan umur
   - IMT
   - WHO Z-Score
   - BB/U
   - PB/U / TB/U
   - BB/PB / BB/TB
   - IMT/U
   - Status gizi
   - Kebutuhan energi
   - Makronutrien
   - Progress bar

   CATATAN:
   Data Z-score WHO dibaca dari WHO_GROWTH_DATA.
   ========================================================= */


"use strict";


/* =========================================================
   GLOBAL
========================================================= */

let childAgeDays = null;
let childAgeMonths = null;
let childAgeText = "";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
    console.log("=================================");


    const birthDate =
        document.getElementById("anakBirthDate");

    const checkDate =
        document.getElementById("anakCheckDate");

    const calculateButton =
        document.getElementById("anakCalculateButton");


    console.log(
        "Tanggal lahir:",
        birthDate
    );

    console.log(
        "Tanggal pemeriksaan:",
        checkDate
    );

    console.log(
        "Tombol hitung:",
        calculateButton
    );


    /* -----------------------------------------------------
       TANGGAL PEMERIKSAAN DEFAULT = HARI INI
    ----------------------------------------------------- */

    if (checkDate && !checkDate.value) {

        const today =
            new Date();

        checkDate.value =
            formatDateInput(today);

    }


    /* -----------------------------------------------------
       UPDATE UMUR KETIKA TANGGAL BERUBAH
    ----------------------------------------------------- */

    if (birthDate) {

        birthDate.addEventListener(
            "change",
            updateChildAge
        );

    }


    if (checkDate) {

        checkDate.addEventListener(
            "change",
            updateChildAge
        );

    }


    /* -----------------------------------------------------
       BUTTON
    ----------------------------------------------------- */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateChildNutrition
        );

    }


    /* -----------------------------------------------------
       INPUT ENTER
    ----------------------------------------------------- */

    const inputs =
        document.querySelectorAll(
            "#anakName, #anakGender, #anakBirthDate, #anakCheckDate, #anakWeight, #anakHeight"
        );


    inputs.forEach(function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateChildNutrition();

                }

            }
        );

    }

});


/* =========================================================
   FORMAT DATE INPUT
========================================================= */

function formatDateInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================================
   PARSE DATE
========================================================= */

function parseLocalDate(value) {

    if (!value) {
        return null;
    }


    const parts =
        value.split("-");


    if (parts.length !== 3) {
        return null;
    }


    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


/* =========================================================
   HITUNG UMUR
========================================================= */

function calculateAge(
    birthDate,
    checkDate
) {

    let years =
        checkDate.getFullYear()
        -
        birthDate.getFullYear();


    let months =
        checkDate.getMonth()
        -
        birthDate.getMonth();


    let days =
        checkDate.getDate()
        -
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


    const differenceMs =
        checkDate.getTime()
        -
        birthDate.getTime();


    const ageDays =
        Math.floor(
            differenceMs /
            (1000 * 60 * 60 * 24)
        );


    const ageMonths =
        ageDays / 30.4375;


    return {
        years,
        months,
        days,
        ageDays,
        ageMonths
    };

}


/* =========================================================
   UPDATE AGE
========================================================= */

function updateChildAge() {

    const birthInput =
        document.getElementById(
            "anakBirthDate"
        );

    const checkInput =
        document.getElementById(
            "anakCheckDate"
        );

    const ageText =
        document.getElementById(
            "anakAgeText"
        );


    if (
        !birthInput ||
        !checkInput ||
        !ageText
    ) {

        return;

    }


    if (
        !birthInput.value ||
        !checkInput.value
    ) {

        ageText.textContent =
            "Belum dihitung";

        return;

    }


    const birthDate =
        parseLocalDate(
            birthInput.value
        );

    const checkDate =
        parseLocalDate(
            checkInput.value
        );


    if (
        !birthDate ||
        !checkDate ||
        checkDate < birthDate
    ) {

        ageText.textContent =
            "Tanggal tidak valid";

        return;

    }


    const age =
        calculateAge(
            birthDate,
            checkDate
        );


    childAgeDays =
        age.ageDays;

    childAgeMonths =
        age.ageMonths;


    childAgeText =
        `${age.years} tahun ${age.months} bulan ${age.days} hari`;


    ageText.textContent =
        childAgeText;


    console.log(
        "USIA:",
        childAgeText
    );

}


/* =========================================================
   VALIDASI DATA
========================================================= */

function getChildData() {

    const name =
        document.getElementById(
            "anakName"
        )?.value.trim();


    const gender =
        document.getElementById(
            "anakGender"
        )?.value;


    const birth =
        document.getElementById(
            "anakBirthDate"
        )?.value;


    const check =
        document.getElementById(
            "anakCheckDate"
        )?.value;


    const weight =
        parseFloat(
            document.getElementById(
                "anakWeight"
            )?.value
        );


    const height =
        parseFloat(
            document.getElementById(
                "anakHeight"
            )?.value
        );


    if (!gender) {

        showError(
            "Silakan pilih jenis kelamin anak."
        );

        return null;

    }


    if (!birth || !check) {

        showError(
            "Silakan masukkan tanggal lahir dan tanggal pemeriksaan."
        );

        return null;

    }


    const birthDate =
        parseLocalDate(birth);

    const checkDate =
        parseLocalDate(check);


    if (
        !birthDate ||
        !checkDate
    ) {

        showError(
            "Tanggal yang dimasukkan tidak valid."
        );

        return null;

    }


    if (checkDate < birthDate) {

        showError(
            "Tanggal pemeriksaan tidak boleh lebih awal daripada tanggal lahir."
        );

        return null;

    }


    if (
        isNaN(weight) ||
        weight <= 0
    ) {

        showError(
            "Masukkan berat badan yang valid."
        );

        return null;

    }


    if (
        isNaN(height) ||
        height <= 0
    ) {

        showError(
            "Masukkan panjang/tinggi badan yang valid."
        );

        return null;

    }


    const age =
        calculateAge(
            birthDate,
            checkDate
        );


    if (age.ageDays < 0) {

        showError(
            "Usia anak tidak valid."
        );

        return null;

    }


    if (age.ageDays > 19 * 365.25) {

        showError(
            "Kalkulator ini dirancang untuk anak dan remaja sampai usia 19 tahun."
        );

        return null;

    }


    childAgeDays =
        age.ageDays;

    childAgeMonths =
        age.ageMonths;


    childAgeText =
        `${age.years} tahun ${age.months} bulan ${age.days} hari`;


    const ageElement =
        document.getElementById(
            "anakAgeText"
        );


    if (ageElement) {

        ageElement.textContent =
            childAgeText;

    }


    return {

        name:
            name || "Anak",

        gender,

        birthDate,

        checkDate,

        ageDays:
            age.ageDays,

        ageMonths:
            age.ageMonths,

        ageYears:
            age.years,

        weight,

        height

    };

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    const result =
        document.getElementById(
            "anakResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div class="anak-error">

            <div class="anak-error-icon">
                ⚠️
            </div>

            <div>

                <strong>
                    Data belum lengkap
                </strong>

                <p>
                    ${message}
                </p>

            </div>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   IMT
========================================================= */

function calculateBMI(
    weight,
    height
) {

    const heightM =
        height / 100;


    if (
        heightM <= 0
    ) {

        return null;

    }


    return (
        weight /
        (heightM * heightM)
    );

}


/* =========================================================
   CARI DATA WHO
========================================================= */

/*
   Struktur yang diharapkan:

   WHO_GROWTH_DATA = {

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

   }

   Setiap row:

   {
       age: 0,
       L: ...,
       M: ...,
       S: ...
   }

*/


function findNearestWHOData(
    dataset,
    value
) {

    if (
        !dataset ||
        !dataset.length
    ) {

        return null;

    }


    let nearest =
        dataset[0];

    let smallestDifference =
        Math.abs(
            Number(nearest.age) -
            value
        );


    for (
        let i = 1;
        i < dataset.length;
        i++
    ) {

        const difference =
            Math.abs(
                Number(dataset[i].age) -
                value
            );


        if (
            difference <
            smallestDifference
        ) {

            smallestDifference =
                difference;

            nearest =
                dataset[i];

        }

    }


    return nearest;

}


/* =========================================================
   LMS → Z-SCORE
========================================================= */

function calculateLMSZScore(
    measurement,
    L,
    M,
    S
) {

    if (
        !isFinite(measurement) ||
        !isFinite(L) ||
        !isFinite(M) ||
        !isFinite(S) ||
        M <= 0 ||
        S <= 0
    ) {

        return null;

    }


    let z;


    if (
        Math.abs(L) < 0.000001
    ) {

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


/* =========================================================
   GET WHO Z-SCORE
========================================================= */

function getWHOZScore(
    indicator,
    gender,
    ageDays,
    measurement
) {

    if (
        typeof WHO_GROWTH_DATA ===
        "undefined"
    ) {

        console.warn(
            "WHO_GROWTH_DATA belum tersedia."
        );

        return null;

    }


    const indicatorData =
        WHO_GROWTH_DATA[indicator];


    if (!indicatorData) {

        return null;

    }


    const sexData =
        indicatorData[gender];


    if (
        !sexData ||
        !sexData.length
    ) {

        return null;

    }


    const row =
        findNearestWHOData(
            sexData,
            ageDays
        );


    if (!row) {

        return null;

    }


    return calculateLMSZScore(
        measurement,
        Number(row.L),
        Number(row.M),
        Number(row.S)
    );

}


/* =========================================================
   GET WHO Z-SCORE WEIGHT-FOR-HEIGHT
========================================================= */

function getWHOWeightHeightZScore(
    gender,
    height,
    weight,
    ageDays
) {

    if (
        typeof WHO_GROWTH_DATA ===
        "undefined"
    ) {

        return null;

    }


    const indicator =
        WHO_GROWTH_DATA.weightForHeight;


    if (!indicator) {

        return null;

    }


    const sexData =
        indicator[gender];


    if (
        !sexData ||
        !sexData.length
    ) {

        return null;

    }


    /*
       Untuk BB/TB, tabel menggunakan
       panjang/tinggi sebagai variabel
       referensi, bukan umur.
    */

    let nearest =
        sexData[0];


    let smallest =
        Math.abs(
            Number(nearest.height) -
            height
        );


    for (
        let i = 1;
        i < sexData.length;
        i++
    ) {

        const difference =
            Math.abs(
                Number(sexData[i].height) -
                height
            );


        if (
            difference < smallest
        ) {

            smallest =
                difference;

            nearest =
                sexData[i];

        }

    }


    return calculateLMSZScore(
        weight,
        Number(nearest.L),
        Number(nearest.M),
        Number(nearest.S)
    );

}


/* =========================================================
   STATUS Z-SCORE
========================================================= */

function interpretLowZScore(
    z
) {

    if (z === null) {

        return {
            category:
                "Data tidak tersedia",
            severity:
                "",
            className:
                "neutral"
        };

    }


    if (z < -3) {

        return {
            category:
                "Sangat rendah",
            severity:
                "Severe",
            className:
                "severe"
        };

    }


    if (z < -2) {

        return {
            category:
                "Rendah",
            severity:
                "Moderate",
            className:
                "moderate"
        };

    }


    return {
        category:
            "Normal",
        severity:
            "",
        className:
            "normal"
    };

}


/* =========================================================
   STATUS TINGGI BADAN
========================================================= */

function interpretHeightZScore(
    z
) {

    if (z === null) {

        return {
            category:
                "Data tidak tersedia",
            severity:
                "",
            className:
                "neutral"
        };

    }


    if (z < -3) {

        return {
            category:
                "Sangat pendek",
            severity:
                "Severe stunting",
            className:
                "severe"
        };

    }


    if (z < -2) {

        return {
            category:
                "Pendek",
            severity:
                "Stunting",
            className:
                "moderate"
        };

    }


    if (z > 3) {

        return {
            category:
                "Sangat tinggi",
            severity:
                "",
            className:
                "high"
        };

    }


    return {
        category:
            "Normal",
        severity:
            "",
        className:
            "normal"
    };

}


/* =========================================================
   STATUS BB/TB
========================================================= */

function interpretWeightHeightZScore(
    z
) {

    if (z === null) {

        return {
            category:
                "Data tidak tersedia",
            severity:
                "",
            className:
                "neutral"
        };

    }


    if (z < -3) {

        return {
            category:
                "Gizi buruk",
            severity:
                "Severe wasting",
            className:
                "severe"
        };

    }


    if (z < -2) {

        return {
            category:
                "Gizi kurang",
            severity:
                "Wasting",
            className:
                "moderate"
        };

    }


    if (z <= 1) {

        return {
            category:
                "Gizi baik",
            severity:
                "",
            className:
                "normal"
        };

    }


    if (z <= 2) {

        return {
            category:
                "Risiko gizi lebih",
            severity:
                "",
            className:
                "warning"
        };

    }


    if (z <= 3) {

        return {
            category:
                "Gizi lebih",
            severity:
                "Overweight",
            className:
                "high"
        };

    }


    return {
        category:
            "Obesitas",
        severity:
            "Obesity",
        className:
            "severe"
    };

}


/* =========================================================
   STATUS IMT/U
========================================================= */

function interpretBMIForAge(
    z,
    ageYears
) {

    if (z === null) {

        return {
            category:
                "Data tidak tersedia",
            severity:
                "",
            className:
                "neutral"
        };

    }


    if (ageYears < 5) {

        if (z < -3) {

            return {
                category:
                    "Sangat kurus",
                severity:
                    "Severely wasted",
                className:
                    "severe"
            };

        }


        if (z < -2) {

            return {
                category:
                    "Kurus",
                severity:
                    "Wasted",
                className:
                    "moderate"
            };

        }


        if (z <= 1) {

            return {
                category:
                    "Normal",
                severity:
                    "",
                className:
                    "normal"
            };

        }


        if (z <= 2) {

            return {
                category:
                    "Berisiko gizi lebih",
                severity:
                    "",
                className:
                    "warning"
            };

        }


        if (z <= 3) {

            return {
                category:
                    "Gizi lebih",
                severity:
                    "Overweight",
                className:
                    "high"
            };

        }


        return {
            category:
                "Obesitas",
            severity:
                "Obesity",
            className:
                "severe"
        };

    }


    /*
       WHO 5–19 tahun:
       <-3 SD  severe thinness
       <-2 SD  thinness
       >+1 SD  overweight
       >+2 SD  obesity
    */

    if (z < -3) {

        return {
            category:
                "Sangat kurus",
            severity:
                "Severe thinness",
            className:
                "severe"
        };

    }


    if (z < -2) {

        return {
            category:
                "Kurus",
            severity:
                "Thinness",
            className:
                "moderate"
        };

    }


    if (z <= 1) {

        return {
            category:
                "Normal",
            severity:
                "",
            className:
                "normal"
        };

    }


    if (z <= 2) {

        return {
            category:
                "Gemuk",
            severity:
                "Overweight",
            className:
                "high"
        };

    }


    return {
        category:
            "Obesitas",
        severity:
            "Obesity",
        className:
            "severe"
    };

}


/* =========================================================
   FORMAT Z-SCORE
========================================================= */

function formatZScore(
    z
) {

    if (
        z === null ||
        !isFinite(z)
    ) {

        return "—";

    }


    return z.toFixed(2);

}


/* =========================================================
   KEBUTUHAN ENERGI ANAK
========================================================= */

function calculateChildEnergy(
    child
) {

    /*
       Estimasi edukasi.
       Bukan pengganti kebutuhan energi
       individual berdasarkan kondisi klinis.
    */

    const age =
        child.ageYears;


    let kcalPerKg;


    if (age < 1) {

        kcalPerKg = 90;

    }

    else if (age < 3) {

        kcalPerKg = 80;

    }

    else if (age < 5) {

        kcalPerKg = 75;

    }

    else if (age < 8) {

        kcalPerKg = 65;

    }

    else if (age < 12) {

        kcalPerKg = 55;

    }

    else {

        kcalPerKg = 45;

    }


    return Math.round(
        child.weight *
        kcalPerKg
    );

}


/* =========================================================
   MAKRO ANAK
========================================================= */

function calculateChildMacros(
    calories,
    weight
) {

    /*
       Protein dibuat sebagai
       estimasi edukasi sederhana.

       Untuk website klinik, target individual
       sebaiknya dikonfirmasi tenaga kesehatan.
    */

    let proteinPerKg;


    if (weight < 10) {

        proteinPerKg = 1.5;

    }

    else if (weight < 20) {

        proteinPerKg = 1.4;

    }

    else {

        proteinPerKg = 1.2;

    }


    const protein =
        weight *
        proteinPerKg;


    const proteinCalories =
        protein * 4;


    const fatCalories =
        calories * 0.30;


    const fat =
        fatCalories / 9;


    const carbCalories =
        Math.max(
            0,
            calories -
            proteinCalories -
            fatCalories
        );


    const carbs =
        carbCalories / 4;


    return {

        calories:
            Math.round(calories),

        protein:
            Math.round(protein),

        proteinCalories:
            Math.round(proteinCalories),

        carbs:
            Math.round(carbs),

        carbCalories:
            Math.round(carbCalories),

        fat:
            Math.round(fat),

        fatCalories:
            Math.round(fatCalories)

    };

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function macroProgress(
    name,
    grams,
    calories,
    className
) {

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (calories / 4)
            )
        );


    return `

        <div class="anak-macro-row">

            <div class="anak-macro-top">

                <strong>
                    ${name}
                </strong>

                <span>
                    ${grams} g
                </span>

            </div>

            <div class="anak-progress">

                <div
                    class="anak-progress-bar ${className}"
                    style="width:${Math.min(100, percentage)}%"
                ></div>

            </div>

            <small>
                ${calories} kkal
            </small>

        </div>

    `;

}


/* =========================================================
   RENDER RESULT
========================================================= */

function renderChildResult(
    child,
    results
) {

    const result =
        document.getElementById(
            "anakResult"
        );


    if (!result) {

        console.error(
            "Elemen #anakResult tidak ditemukan."
        );

        return;

    }


    const bmi =
        results.bmi;


    const energy =
        results.energy;


    const macros =
        results.macros;


    result.innerHTML = `

        <!-- IDENTITAS -->

        <div class="anak-result-head">

            <div>

                <span class="anak-label">
                    HASIL UNTUK
                </span>

                <h3>
                    ${escapeHTML(child.name)}
                </h3>

            </div>

            <div class="anak-result-age">
                ${childAgeText}
            </div>

        </div>



        <!-- IMT -->

        <div class="anak-bmi-main">

            <span>
                IMT
            </span>

            <strong>
                ${bmi.toFixed(1)}
            </strong>

            <small>
                kg/m²
            </small>

        </div>



        <!-- STATUS -->

        <div class="anak-status-grid">


            ${statusCard(
                "BB/U",
                "Berat Badan menurut Umur",
                results.waz,
                results.wazStatus
            )}


            ${statusCard(
                child.ageYears < 2
                    ? "PB/U"
                    : "TB/U",
                child.ageYears < 2
                    ? "Panjang Badan menurut Umur"
                    : "Tinggi Badan menurut Umur",
                results.haz,
                results.hazStatus
            )}


            ${statusCard(
                child.ageYears < 2
                    ? "BB/PB"
                    : "BB/TB",
                child.ageYears < 2
                    ? "Berat Badan menurut Panjang Badan"
                    : "Berat Badan menurut Tinggi Badan",
                results.whz,
                results.whzStatus
            )}


            ${statusCard(
                "IMT/U",
                "Indeks Massa Tubuh menurut Umur",
                results.bmiz,
                results.bmizStatus
            )}

        </div>



        <!-- MAKRO -->

        <div class="anak-macro-section">

            <div class="anak-macro-header">

                <div>

                    <span class="anak-label">
                        ESTIMASI KEBUTUHAN HARIAN
                    </span>

                    <h3>
                        Energi & Makronutrien
                    </h3>

                </div>

                <div class="anak-calorie-target">

                    <strong>
                        ${energy}
                    </strong>

                    <span>
                        kkal/hari
                    </span>

                </div>

            </div>


            <div class="anak-macro-list">

                ${macroProgress(
                    "Protein",
                    macros.protein,
                    macros.proteinCalories,
                    "protein"
                )}

                ${macroProgress(
                    "Karbohidrat",
                    macros.carbs,
                    macros.carbCalories,
                    "carbs"
                )}

                ${macroProgress(
                    "Lemak",
                    macros.fat,
                    macros.fatCalories,
                    "fat"
                )}

            </div>


            <div class="anak-macro-note">

                💡
                Angka makronutrien merupakan estimasi
                edukasi dan bukan resep diet individual.

            </div>

        </div>



        <!-- CATATAN STATUS -->

        <div class="anak-clinical-note">

            <strong>
                Interpretasi
            </strong>

            <p>
                Status gizi sebaiknya tidak ditentukan dari
                satu indikator saja. Perhatikan pola pertumbuhan,
                riwayat penyakit, asupan makanan dan pemeriksaan
                klinis anak.
            </p>

        </div>

    `;


    const resultSection =
        document.getElementById(
            "anakResultSection"
        );


    if (resultSection) {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   STATUS CARD
========================================================= */

function statusCard(
    indicator,
    description,
    z,
    status
) {

    const statusClass =
        status?.className ||
        "neutral";


    return `

        <div class="anak-status-card ${statusClass}">

            <div class="anak-status-top">

                <strong>
                    ${indicator}
                </strong>

                <span>
                    Z-score
                </span>

            </div>

            <div class="anak-zscore">
                ${formatZScore(z)}
            </div>

            <div class="anak-status-name">
                ${status?.category || "—"}
            </div>

            ${
                status?.severity
                    ?
                    `<small>${status.severity}</small>`
                    :
                    ""
            }

            <p>
                ${description}
            </p>

        </div>

    `;

}


/* =========================================================
   MAIN CALCULATOR
========================================================= */

function calculateChildNutrition() {

    console.log(
        "TOMBOL STATUS GIZI DIKLIK"
    );


    const child =
        getChildData();


    if (!child) {

        return;

    }


    console.log(
        "Berat:",
        child.weight
    );


    console.log(
        "Tinggi:",
        child.height
    );


    const bmi =
        calculateBMI(
            child.weight,
            child.height
        );


    console.log(
        "IMT:",
        bmi
    );


    /*
       ----------------------------------------------
       Z-SCORE WHO
       ----------------------------------------------
    */


    const waz =
        getWHOZScore(
            "weightForAge",
            child.gender,
            child.ageDays,
            child.weight
        );


    const haz =
        getWHOZScore(
            "heightForAge",
            child.gender,
            child.ageDays,
            child.height
        );


    const whz =
        getWHOWeightHeightZScore(
            child.gender,
            child.height,
            child.weight,
            child.ageDays
        );


    const bmiz =
        getWHOZScore(
            "bmiForAge",
            child.gender,
            child.ageDays,
            bmi
        );


    console.log(
        "BB/U Z:",
        waz
    );


    console.log(
        "TB/U Z:",
        haz
    );


    console.log(
        "BB/TB Z:",
        whz
    );


    console.log(
        "IMT/U Z:",
        bmiz
    );


    /*
       ----------------------------------------------
       STATUS
       ----------------------------------------------
    */


    const wazStatus =
        interpretLowZScore(
            waz
        );


    const hazStatus =
        interpretHeightZScore(
            haz
        );


    const whzStatus =
        interpretWeightHeightZScore(
            whz
        );


    const bmizStatus =
        interpretBMIForAge(
            bmiz,
            child.ageYears
        );


    /*
       ----------------------------------------------
       ENERGI
       ----------------------------------------------
    */


    const energy =
        calculateChildEnergy(
            child
        );


    /*
       ----------------------------------------------
       MAKRO
       ----------------------------------------------
    */


    const macros =
        calculateChildMacros(
            energy,
            child.weight
        );


    /*
       ----------------------------------------------
       RENDER
       ----------------------------------------------
    */


    renderChildResult(
        child,
        {

            bmi,

            waz,
            haz,
            whz,
            bmiz,

            wazStatus,
            hazStatus,
            whzStatus,
            bmizStatus,

            energy,
            macros

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   DEBUG
========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "GIZI-ANAK ERROR:",
            event.message,
            event.filename,
            event.lineno
        );

    }
);
