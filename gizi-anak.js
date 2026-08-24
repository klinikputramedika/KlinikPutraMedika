/* =========================================================
   GIZI-ANAK.JS
   Klinik Putra Medika

   Fungsi:
   1. Menghitung usia kronologis
   2. Menghitung umur dalam bulan
   3. Menghitung IMT
   4. Menampilkan antropometri
   5. Menghitung / membaca Z-score WHO
   6. Menentukan status gizi
   7. Menampilkan interpretasi medis
   8. Menampilkan kebutuhan energi & makronutrien estimasi
   9. Tidak menggunakan inline onclick
========================================================= */

"use strict";

console.log("======================================");
console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
console.log("======================================");


/* =========================================================
   KONFIGURASI
========================================================= */

const GIZI_ANAK_CONFIG = {

    maxAgeMonths: 228,

    macro: {

        proteinPercent: 15,
        carbohydratePercent: 55,
        fatPercent: 30

    }

};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM GIZI ANAK SIAP");

    initializeChildNutrition();

});


/* =========================================================
   INISIALISASI
========================================================= */

function initializeChildNutrition() {

    const birthDate =
        document.getElementById("anakBirthDate");

    const checkDate =
        document.getElementById("anakCheckDate");

    const calculateButton =
        document.getElementById("anakCalculateButton");

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
        document.getElementById("anakResult")
    );


    /* -----------------------------------------
       TANGGAL PEMERIKSAAN DEFAULT
    ----------------------------------------- */

    if (checkDate && !checkDate.value) {

        checkDate.value =
            getTodayLocalDate();

    }


    /* -----------------------------------------
       EVENT TANGGAL LAHIR
    ----------------------------------------- */

    if (birthDate) {

        birthDate.addEventListener(
            "change",
            updateChildAge
        );

    }


    /* -----------------------------------------
       EVENT TANGGAL PEMERIKSAAN
    ----------------------------------------- */

    if (checkDate) {

        checkDate.addEventListener(
            "change",
            updateChildAge
        );

    }


    /* -----------------------------------------
       EVENT BUTTON
    ----------------------------------------- */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateChildNutrition
        );

        console.log(
            "Event tombol berhasil dipasang."
        );

    }


    /* -----------------------------------------
       INITIAL AGE
    ----------------------------------------- */

    updateChildAge();

}


/* =========================================================
   TANGGAL HARI INI
========================================================= */

function getTodayLocalDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================================
   PARSE DATE
========================================================= */

function parseDate(value) {

    if (!value) {
        return null;
    }

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);

    const date =
        new Date(
            year,
            month - 1,
            day
        );

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
   HITUNG USIA
========================================================= */

function calculateExactAge(
    birthDate,
    checkDate
) {

    if (
        !birthDate ||
        !checkDate
    ) {

        return null;

    }


    if (
        checkDate < birthDate
    ) {

        return null;

    }


    let years =
        checkDate.getFullYear()
        - birthDate.getFullYear();


    let months =
        checkDate.getMonth()
        - birthDate.getMonth();


    let days =
        checkDate.getDate()
        - birthDate.getDate();


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


    const totalDays =
        Math.floor(
            (
                checkDate - birthDate
            ) /
            (1000 * 60 * 60 * 24)
        );


    return {

        years,
        months,
        days,

        totalMonths,

        totalDays

    };

}


/* =========================================================
   UPDATE USIA
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


    const birthDate =
        parseDate(
            birthInput.value
        );


    const checkDate =
        parseDate(
            checkInput.value
        );


    if (!birthDate || !checkDate) {

        ageText.textContent =
            "—";

        return;

    }


    const age =
        calculateExactAge(
            birthDate,
            checkDate
        );


    if (!age) {

        ageText.textContent =
            "Tanggal tidak valid";

        return;

    }


    ageText.textContent =
        formatAge(age);


    console.log(
        "USIA:",
        formatAge(age)
    );

}


/* =========================================================
   FORMAT USIA
========================================================= */

function formatAge(age) {

    let result = "";

    if (age.years > 0) {

        result +=
            `${age.years} tahun `;

    }

    if (
        age.months > 0 ||
        age.years === 0
    ) {

        result +=
            `${age.months} bulan `;

    }

    result +=
        `${age.days} hari`;

    return result.trim();

}


/* =========================================================
   VALIDASI DATA
========================================================= */

function getChildFormData() {

    const genderElement =
        document.getElementById(
            "anakGender"
        );

    const birthElement =
        document.getElementById(
            "anakBirthDate"
        );

    const checkElement =
        document.getElementById(
            "anakCheckDate"
        );

    const weightElement =
        document.getElementById(
            "anakWeight"
        );

    const heightElement =
        document.getElementById(
            "anakHeight"
        );


    if (
        !genderElement ||
        !birthElement ||
        !checkElement ||
        !weightElement ||
        !heightElement
    ) {

        return {
            error:
                "Elemen formulir tidak ditemukan."
        };

    }


    const gender =
        genderElement.value;


    const birthDate =
        parseDate(
            birthElement.value
        );


    const checkDate =
        parseDate(
            checkElement.value
        );


    const weight =
        Number(
            weightElement.value
        );


    const height =
        Number(
            heightElement.value
        );


    if (!birthDate) {

        return {
            error:
                "Silakan masukkan tanggal lahir anak."
        };

    }


    if (!checkDate) {

        return {
            error:
                "Silakan masukkan tanggal pemeriksaan."
        };

    }


    if (checkDate < birthDate) {

        return {
            error:
                "Tanggal pemeriksaan tidak boleh sebelum tanggal lahir."
        };

    }


    if (
        !weight ||
        weight <= 0
    ) {

        return {
            error:
                "Silakan masukkan berat badan yang valid."
        };

    }


    if (
        !height ||
        height <= 0
    ) {

        return {
            error:
                "Silakan masukkan tinggi/panjang badan yang valid."
        };

    }


    const age =
        calculateExactAge(
            birthDate,
            checkDate
        );


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
   HITUNG IMT
========================================================= */

function calculateBMI(
    weight,
    heightCm
) {

    const heightMeter =
        heightCm / 100;


    if (
        heightMeter <= 0
    ) {

        return null;

    }


    return (
        weight /
        (
            heightMeter *
            heightMeter
        )
    );

}


/* =========================================================
   KATEGORI UMUR
========================================================= */

function determineAgeGroup(
    age
) {

    if (!age) {
        return null;
    }


    if (
        age.totalMonths < 60
    ) {

        return "under5";

    }


    if (
        age.totalMonths >= 60 &&
        age.totalMonths <= 228
    ) {

        return "5to19";

    }


    return "over19";

}


/* =========================================================
   CARA UKUR
========================================================= */

function determineMeasurementType(
    age
) {

    if (!age) {
        return null;
    }


    /*
     * < 24 bulan:
     * panjang badan terlentang
     *
     * >= 24 bulan:
     * tinggi badan berdiri
     */

    if (
        age.totalMonths < 24
    ) {

        return "length";

    }


    return "height";

}


/* =========================================================
   CARI DATA WHO
========================================================= */

function getWHOObject() {

    if (
        typeof window.WHO_ANTHRO ===
        "undefined"
    ) {

        console.warn(
            "WHO_ANTHRO tidak ditemukan."
        );

        return null;

    }


    return window.WHO_ANTHRO;

}


/* =========================================================
   NORMALISASI SEX
========================================================= */

function normalizeSex(
    gender
) {

    if (!gender) {
        return null;
    }


    const value =
        String(gender)
            .toLowerCase();


    if (
        value === "male" ||
        value === "m" ||
        value === "laki" ||
        value === "laki-laki"
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


/* =========================================================
   AMBIL DATA Z-SCORE WHO
========================================================= */

function findWHOData(
    indicator,
    gender
) {

    const WHO =
        getWHOObject();


    if (!WHO) {
        return null;
    }


    const sex =
        normalizeSex(gender);


    if (!sex) {
        return null;
    }


    if (
        !WHO.data ||
        !WHO.data[sex]
    ) {

        return null;

    }


    const dataset =
        WHO.data[sex][indicator];


    if (!dataset) {

        return null;

    }


    if (
        Object.keys(dataset).length === 0
    ) {

        return null;

    }


    return dataset;

}


/* =========================================================
   INTERPOLASI DATA LMS
========================================================= */

function findNearestWHORecord(
    dataset,
    ageValue
) {

    if (!dataset) {
        return null;
    }


    const keys =
        Object.keys(dataset);


    if (!keys.length) {
        return null;
    }


    const numericKeys =
        keys
            .map(Number)
            .filter(
                value =>
                    Number.isFinite(value)
            );


    if (!numericKeys.length) {
        return null;
    }


    let nearest =
        numericKeys[0];


    let difference =
        Math.abs(
            ageValue - nearest
        );


    for (
        let i = 1;
        i < numericKeys.length;
        i++
    ) {

        const current =
            numericKeys[i];


        const currentDifference =
            Math.abs(
                ageValue - current
            );


        if (
            currentDifference <
            difference
        ) {

            nearest =
                current;

            difference =
                currentDifference;

        }

    }


    return (
        dataset[nearest] ||
        dataset[String(nearest)] ||
        null
    );

}


/* =========================================================
   HITUNG Z-SCORE LMS
========================================================= */

function calculateLMSZScore(
    measurement,
    record
) {

    if (
        !record ||
        !Number.isFinite(measurement)
    ) {

        return null;

    }


    const L =
        Number(record.L);

    const M =
        Number(record.M);

    const S =
        Number(record.S);


    if (
        !Number.isFinite(L) ||
        !Number.isFinite(M) ||
        !Number.isFinite(S) ||
        M <= 0 ||
        S <= 0
    ) {

        return null;

    }


    let z;


    if (L === 0) {

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
            )
            /
            (L * S);

    }


    if (!Number.isFinite(z)) {

        return null;

    }


    return z;

}


/* =========================================================
   CARI Z-SCORE
========================================================= */

function calculateWHOZScore(
    indicator,
    measurement,
    ageValue,
    gender
) {

    const dataset =
        findWHOData(
            indicator,
            gender
        );


    if (!dataset) {

        return {

            available: false,

            z: null,

            reason:
                "Data WHO belum tersedia."

        };

    }


    const record =
        findNearestWHORecord(
            dataset,
            ageValue
        );


    if (!record) {

        return {

            available: false,

            z: null,

            reason:
                "Referensi WHO tidak ditemukan."

        };

    }


    const z =
        calculateLMSZScore(
            measurement,
            record
        );


    if (z === null) {

        return {

            available: false,

            z: null,

            reason:
                "Parameter LMS tidak valid."

        };

    }


    return {

        available: true,

        z,

        record

    };

}


/* =========================================================
   STATUS BB/U
========================================================= */

function classifyWeightForAge(
    z
) {

    if (z === null) {

        return {
            label: "Data WHO belum tersedia",
            className: "neutral"
        };

    }


    if (z < -3) {

        return {

            label:
                "Berat badan sangat kurang",

            className:
                "severe-low"

        };

    }


    if (z < -2) {

        return {

            label:
                "Berat badan kurang",

            className:
                "low"

        };

    }


    return {

        label:
            "Berat badan normal",

        className:
            "normal"

    };

}


/* =========================================================
   STATUS TB/U
========================================================= */

function classifyHeightForAge(
    z
) {

    if (z === null) {

        return {

            label:
                "Data WHO belum tersedia",

            className:
                "neutral"

        };

    }


    if (z < -3) {

        return {

            label:
                "Sangat pendek",

            className:
                "severe-low"

        };

    }


    if (z < -2) {

        return {

            label:
                "Pendek",

            className:
                "low"

        };

    }


    return {

        label:
            "Normal",

        className:
            "normal"

    };

}


/* =========================================================
   STATUS BB/PB ATAU BB/TB
========================================================= */

function classifyWeightForHeight(
    z
) {

    if (z === null) {

        return {

            label:
                "Data WHO belum tersedia",

            className:
                "neutral"

        };

    }


    if (z < -3) {

        return {

            label:
                "Gizi buruk",

            className:
                "severe-low"

        };

    }


    if (z < -2) {

        return {

            label:
                "Gizi kurang",

            className:
                "low"

        };

    }


    if (z <= 1) {

        return {

            label:
                "Gizi baik",

            className:
                "normal"

        };

    }


    if (z <= 2) {

        return {

            label:
                "Berisiko gizi lebih",

            className:
                "high"

        };

    }


    if (z <= 3) {

        return {

            label:
                "Gizi lebih",

            className:
                "high"

        };

    }


    return {

        label:
            "Obesitas",

        className:
            "severe-high"

    };

}


/* =========================================================
   STATUS IMT/U
========================================================= */

function classifyBMIForAge(
    z
) {

    if (z === null) {

        return {

            label:
                "Data WHO belum tersedia",

            className:
                "neutral"

        };

    }


    if (z < -3) {

        return {

            label:
                "Sangat kurus",

            className:
                "severe-low"

        };

    }


    if (z < -2) {

        return {

            label:
                "Kurus",

            className:
                "low"

        };

    }


    if (z <= 1) {

        return {

            label:
                "Normal",

            className:
                "normal"

        };

    }


    if (z <= 2) {

        return {

            label:
                "Gemuk",

            className:
                "high"

        };

    }


    return {

        label:
            "Obesitas",

        className:
            "severe-high"

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
        !Number.isFinite(z)
    ) {

        return "—";

    }


    return z.toFixed(2);

}


/* =========================================================
   KEBUTUHAN ENERGI ESTIMASI
========================================================= */

function calculateEnergy(
    weight,
    ageYears,
    gender
) {

    /*
     * Ini estimasi edukasi,
     * bukan prescription medis.
     *
     * Formula sederhana menggunakan
     * kebutuhan energi berbasis berat.
     */

    let kcalPerKg;


    if (ageYears < 1) {

        kcalPerKg = 100;

    } else if (ageYears < 3) {

        kcalPerKg = 90;

    } else if (ageYears < 7) {

        kcalPerKg = 75;

    } else if (ageYears < 10) {

        kcalPerKg = 70;

    } else {

        kcalPerKg =
            gender === "male"
                ? 55
                : 50;

    }


    return Math.round(
        weight * kcalPerKg
    );

}


/* =========================================================
   MAKRO
========================================================= */

function calculateMacros(
    calories
) {

    const protein =
        Math.round(
            (
                calories *
                GIZI_ANAK_CONFIG.macro
                    .proteinPercent /
                100
            ) / 4
        );


    const carbohydrate =
        Math.round(
            (
                calories *
                GIZI_ANAK_CONFIG.macro
                    .carbohydratePercent /
                100
            ) / 4
        );


    const fat =
        Math.round(
            (
                calories *
                GIZI_ANAK_CONFIG.macro
                    .fatPercent /
                100
            ) / 9
        );


    return {

        protein,

        carbohydrate,

        fat

    };

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function createProgressBar(
    value,
    max,
    label
) {

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (value / max) * 100
            )
        );


    return `

        <div class="anak-progress-item">

            <div class="anak-progress-header">

                <span>
                    ${label}
                </span>

                <strong>
                    ${value} g
                </strong>

            </div>

            <div class="anak-progress">

                <div
                    class="anak-progress-fill"
                    style="width:${percentage}%"
                ></div>

            </div>

        </div>

    `;

}


/* =========================================================
   HTML HASIL
========================================================= */

function renderResult(
    data,
    results
) {

    const resultElement =
        document.getElementById(
            "anakResult"
        );


    if (!resultElement) {

        console.error(
            "Elemen #anakResult tidak ditemukan."
        );

        return;

    }


    const bmiText =
        results.bmi !== null
            ? results.bmi.toFixed(1)
            : "—";


    const ageGroupText =
        results.ageGroup === "under5"
            ? "0–59 bulan"
            : results.ageGroup === "5to19"
                ? "5–19 tahun"
                : ">19 tahun";


    resultElement.innerHTML = `

        <div class="anak-result-content">

            <div class="anak-result-header">

                <div>

                    <span class="anak-label">
                        HASIL PEMERIKSAAN
                    </span>

                    <h3>
                        Status Gizi Anak
                    </h3>

                </div>

                <div class="anak-result-age">
                    ${formatAge(data.age)}
                </div>

            </div>


            <!-- ==============================
                 ANTROPOMETRI
            =============================== -->

            <div class="anak-result-grid">

                <div class="anak-result-box">

                    <span>
                        Berat Badan
                    </span>

                    <strong>
                        ${data.weight.toFixed(1)}
                        <small>kg</small>
                    </strong>

                </div>


                <div class="anak-result-box">

                    <span>
                        Tinggi / Panjang
                    </span>

                    <strong>
                        ${data.height.toFixed(1)}
                        <small>cm</small>
                    </strong>

                </div>


                <div class="anak-result-box">

                    <span>
                        IMT
                    </span>

                    <strong>
                        ${bmiText}
                        <small>kg/m²</small>
                    </strong>

                </div>


                <div class="anak-result-box">

                    <span>
                        Kelompok Umur
                    </span>

                    <strong>
                        ${ageGroupText}
                    </strong>

                </div>

            </div>


            <!-- ==============================
                 STATUS GIZI
            =============================== -->

            <div class="anak-status-section">

                <div class="anak-label">
                    STATUS ANTROPOMETRI
                </div>


                <div class="anak-status-grid">

                    ${createStatusCard(
                        "BB menurut Umur",
                        formatZScore(
                            results.wfa.z
                        ),
                        results.wfa.status
                    )}


                    ${createStatusCard(
                        "TB/PB menurut Umur",
                        formatZScore(
                            results.hfa.z
                        ),
                        results.hfa.status
                    )}


                    ${createStatusCard(
                        results.measurementType ===
                        "length"
                            ? "BB menurut PB"
                            : "BB menurut TB",
                        formatZScore(
                            results.wfh.z
                        ),
                        results.wfh.status
                    )}


                    ${createStatusCard(
                        "IMT menurut Umur",
                        formatZScore(
                            results.bfa.z
                        ),
                        results.bfa.status
                    )}

                </div>

            </div>


            <!-- ==============================
                 Z-SCORE DETAIL
            =============================== -->

            <div class="anak-zscore-section">

                <div class="anak-label">
                    Z-SCORE
                </div>

                <div class="anak-zscore-table">

                    ${createZScoreRow(
                        "BB/U",
                        results.wfa.z,
                        results.wfa.status.label
                    )}

                    ${createZScoreRow(
                        "TB/U atau PB/U",
                        results.hfa.z,
                        results.hfa.status.label
                    )}

                    ${createZScoreRow(
                        "BB/TB atau BB/PB",
                        results.wfh.z,
                        results.wfh.status.label
                    )}

                    ${createZScoreRow(
                        "IMT/U",
                        results.bfa.z,
                        results.bfa.status.label
                    )}

                </div>

            </div>


            <!-- ==============================
                 ENERGI
            =============================== -->

            <div class="anak-macro-section">

                <div>

                    <div class="anak-label">
                        ESTIMASI KEBUTUHAN
                    </div>

                    <h3>
                        Energi & Makronutrien
                    </h3>

                    <p>
                        Perkiraan kebutuhan energi
                        berdasarkan berat badan dan
                        kelompok usia.
                    </p>

                </div>


                <div class="anak-energy-value">

                    <strong>
                        ${results.energy}
                    </strong>

                    <span>
                        kkal/hari
                    </span>

                </div>

            </div>


            <div class="anak-macro-grid">

                <div class="anak-macro-card">

                    <span>
                        Protein
                    </span>

                    <strong>
                        ${results.macros.protein} g
                    </strong>

                </div>


                <div class="anak-macro-card">

                    <span>
                        Karbohidrat
                    </span>

                    <strong>
                        ${results.macros.carbohydrate} g
                    </strong>

                </div>


                <div class="anak-macro-card">

                    <span>
                        Lemak
                    </span>

                    <strong>
                        ${results.macros.fat} g
                    </strong>

                </div>

            </div>


            <div class="anak-progress-container">

                ${createProgressBar(
                    results.macros.protein,
                    results.macros.protein * 1.25,
                    "Protein"
                )}

                ${createProgressBar(
                    results.macros.carbohydrate,
                    results.macros.carbohydrate * 1.25,
                    "Karbohidrat"
                )}

                ${createProgressBar(
                    results.macros.fat,
                    results.macros.fat * 1.25,
                    "Lemak"
                )}

            </div>


            <!-- ==============================
                 KETERSEDIAAN WHO
            =============================== -->

            ${createWHONotice(results)}

        </div>

    `;


    resultElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   STATUS CARD
========================================================= */

function createStatusCard(
    title,
    z,
    status
) {

    const statusClass =
        status.className ||
        "neutral";


    return `

        <div class="
            anak-status-card
            ${statusClass}
        ">

            <span>
                ${title}
            </span>

            <strong>
                ${status.label}
            </strong>

            <small>
                Z-score: ${z}
            </small>

        </div>

    `;

}


/* =========================================================
   Z-SCORE ROW
========================================================= */

function createZScoreRow(
    indicator,
    z,
    label
) {

    return `

        <div class="anak-zscore-row">

            <strong>
                ${indicator}
            </strong>

            <span>
                ${
                    z === null
                        ? "—"
                        : z.toFixed(2)
                }
            </span>

            <small>
                ${label}
            </small>

        </div>

    `;

}


/* =========================================================
   WHO NOTICE
========================================================= */

function createWHONotice(
    results
) {

    const available =
        results.wfa.available ||
        results.hfa.available ||
        results.wfh.available ||
        results.bfa.available;


    if (available) {

        return `

            <div class="anak-who-success">

                <strong>
                    ✓ Referensi WHO tersedia
                </strong>

                <p>
                    Z-score dihitung menggunakan
                    parameter LMS WHO yang tersedia
                    pada database.
                </p>

            </div>

        `;

    }


    return `

        <div class="anak-who-warning">

            <strong>
                ⚠ Data Z-score WHO belum tersedia
            </strong>

            <p>
                Perhitungan antropometri dasar tetap
                ditampilkan. Untuk menghasilkan Z-score
                WHO, database WHO LMS harus tersedia
                pada file <b>who-anthro-data.js</b>.
            </p>

        </div>

    `;

}


/* =========================================================
   FUNGSI UTAMA
========================================================= */

function calculateChildNutrition() {

    console.log(
        "======================================"
    );

    console.log(
        "TOMBOL HITUNG STATUS GIZI DIKLIK"
    );


    const data =
        getChildFormData();


    if (data.error) {

        showError(
            data.error
        );

        return;

    }


    console.log(
        "DATA:",
        data
    );


    const ageGroup =
        determineAgeGroup(
            data.age
        );


    if (
        ageGroup === "over19"
    ) {

        showError(
            "Kalkulator ini ditujukan untuk anak dan remaja sampai usia 19 tahun."
        );

        return;

    }


    const measurementType =
        determineMeasurementType(
            data.age
        );


    const bmi =
        calculateBMI(
            data.weight,
            data.height
        );


    /*
     * ======================================
     * Z-SCORE
     * ======================================
     *
     * Untuk WHO:
     *
     * WFA -> umur
     * HFA -> umur
     * WFH -> panjang/tinggi
     * BFA -> IMT menurut umur
     */

    const wfaResult =
        calculateWHOZScore(
            "weightForAge",
            data.weight,
            data.age.totalMonths,
            data.gender
        );


    const hfaResult =
        calculateWHOZScore(
            "heightForAge",
            data.height,
            data.age.totalMonths,
            data.gender
        );


    /*
     * BB/TB membutuhkan dataset
     * yang berbeda dari BB/U.
     */

    const wfhIndicator =
        measurementType === "length"
            ? "weightForLength"
            : "weightForHeight";


    /*
     * Jika database WHO menggunakan
     * panjang/tinggi sebagai key,
     * fungsi pencarian perlu menerima
     * tinggi/panjang sebagai nilai.
     */

    const wfhDataset =
        findWHOData(
            wfhIndicator,
            data.gender
        );


    let wfhResult = {

        available: false,

        z: null,

        reason:
            "Data WHO belum tersedia."

    };


    if (wfhDataset) {

        const record =
            findNearestWHORecord(
                wfhDataset,
                data.height
            );


        if (record) {

            const z =
                calculateLMSZScore(
                    data.weight,
                    record
                );


            if (z !== null) {

                wfhResult = {

                    available: true,

                    z,

                    record

                };

            }

        }

    }


    /*
     * IMT/U
     */

    const bfaResult =
        calculateWHOZScore(
            "bmiForAge",
            bmi,
            data.age.totalMonths,
            data.gender
        );


    /*
     * STATUS
     */

    const wfaStatus =
        classifyWeightForAge(
            wfaResult.z
        );


    const hfaStatus =
        classifyHeightForAge(
            hfaResult.z
        );


    const wfhStatus =
        classifyWeightForHeight(
            wfhResult.z
        );


    const bfaStatus =
        classifyBMIForAge(
            bfaResult.z
        );


    wfaResult.status =
        wfaStatus;


    hfaResult.status =
        hfaStatus;


    wfhResult.status =
        wfhStatus;


    bfaResult.status =
        bfaStatus;


    /*
     * ======================================
     * ENERGI
     * ======================================
     */

    const ageYears =
        data.age.totalMonths / 12;


    const energy =
        calculateEnergy(
            data.weight,
            ageYears,
            data.gender
        );


    const macros =
        calculateMacros(
            energy
        );


    /*
     * ======================================
     * HASIL
     * ======================================
     */

    const results = {

        ageGroup,

        measurementType,

        bmi,

        wfa:
            wfaResult,

        hfa:
            hfaResult,

        wfh:
            wfhResult,

        bfa:
            bfaResult,

        energy,

        macros

    };


    console.log(
        "Z-SCORE:",
        results
    );


    renderResult(
        data,
        results
    );


    console.log(
        "PERHITUNGAN SELESAI"
    );

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

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
   PUBLIC FUNCTION
   =========================================================
   
   Tetap expose ke window sebagai pengaman apabila
   HTML lama masih memiliki onclick="calculateChildNutrition()".
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;


window.updateChildAge =
    updateChildAge;


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "calculateChildNutrition tersedia:",
    typeof window.calculateChildNutrition
);

console.log(
    "updateChildAge tersedia:",
    typeof window.updateChildAge
);
