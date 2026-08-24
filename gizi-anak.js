/* =========================================================
   GIZI-ANAK.JS
   KLINIK PUTRA MEDIKA

   Fungsi:
   - Hitung umur kronologis
   - Hitung IMT
   - Status antropometri
   - Z-score engine
   - Klasifikasi berdasarkan Permenkes No. 2 Tahun 2020
   - Perhitungan kebutuhan energi
   - Makronutrien
   - Tidak membutuhkan who-anthro-data.js

   ========================================================= */

"use strict";

console.log("======================================");
console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
console.log("Klinik Putra Medika");
console.log("======================================");


/* =========================================================
   KONFIGURASI
========================================================= */

const GIZI_ANAK_CONFIG = {

    version: "1.0.0",

    reference:
        "Permenkes No. 2 Tahun 2020 / WHO Growth Reference",

    maxAgeYears: 19,

    macroRatio: {
        carbohydrate: 0.50,
        protein: 0.15,
        fat: 0.35
    }

};


/* =========================================================
   UTILITAS
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function numberValue(id) {

    const el = getElement(id);

    if (!el) {
        return null;
    }

    const value = parseFloat(el.value);

    return Number.isFinite(value)
        ? value
        : null;

}


function round(value, digits = 2) {

    if (!Number.isFinite(value)) {
        return null;
    }

    const factor = Math.pow(10, digits);

    return Math.round(value * factor) / factor;

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   TANGGAL
========================================================= */

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
        !year ||
        !month ||
        !day
    ) {
        return null;
    }

    return new Date(
        year,
        month - 1,
        day
    );

}


/* =========================================================
   HITUNG UMUR
========================================================= */

function calculateAge(
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


    const totalDays =
        Math.floor(
            (
                checkDate.getTime()
                -
                birthDate.getTime()
            )
            /
            86400000
        );


    const totalMonths =
        years * 12 + months;


    const totalYears =
        totalDays / 365.2425;


    return {

        years,
        months,
        days,

        totalDays,

        totalMonths,

        totalYears,

        ageText:
            `${years} tahun ` +
            `${months} bulan ` +
            `${days} hari`

    };

}


/* =========================================================
   TAMPILKAN UMUR
========================================================= */

function updateAgeDisplay() {

    const birth =
        parseDate(
            getElement("anakBirthDate")?.value
        );

    const check =
        parseDate(
            getElement("anakCheckDate")?.value
        );


    const ageText =
        getElement("anakAgeText");


    if (
        !birth ||
        !check
    ) {

        if (ageText) {
            ageText.textContent = "—";
        }

        return null;

    }


    const age =
        calculateAge(
            birth,
            check
        );


    if (!age) {

        if (ageText) {
            ageText.textContent =
                "Tanggal tidak valid";
        }

        return null;

    }


    if (ageText) {

        ageText.textContent =
            age.ageText;

    }


    console.log(
        "USIA:",
        age.ageText
    );


    return age;

}


/* =========================================================
   IMT
========================================================= */

function calculateBMI(
    weight,
    height
) {

    if (
        !Number.isFinite(weight) ||
        !Number.isFinite(height) ||
        weight <= 0 ||
        height <= 0
    ) {

        return null;

    }


    const heightMeter =
        height / 100;


    return weight /
        (
            heightMeter *
            heightMeter
        );

}


/* =========================================================
   INTERPRETASI IMT DEWASA
   Tidak digunakan sebagai status utama anak.
   Hanya informasi tambahan.
========================================================= */

function adultBMIInterpretation(bmi) {

    if (!Number.isFinite(bmi)) {
        return "—";
    }

    if (bmi < 18.5) {
        return "Berat badan kurang";
    }

    if (bmi < 25) {
        return "Normal";
    }

    if (bmi < 30) {
        return "Berat badan lebih";
    }

    return "Obesitas";

}


/* =========================================================
   KATEGORI Z-SCORE
========================================================= */

function classifyHeightForAge(z) {

    if (!Number.isFinite(z)) {
        return "Tidak tersedia";
    }

    if (z < -3) {
        return "Sangat pendek";
    }

    if (z < -2) {
        return "Pendek";
    }

    if (z <= 3) {
        return "Normal";
    }

    return "Tinggi";

}


function classifyWeightForAge(z) {

    if (!Number.isFinite(z)) {
        return "Tidak tersedia";
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

    return "Berat badan tinggi";

}


function classifyWeightForHeight(z) {

    if (!Number.isFinite(z)) {
        return "Tidak tersedia";
    }

    if (z < -3) {
        return "Gizi buruk";
    }

    if (z < -2) {
        return "Gizi kurang";
    }

    if (z <= 1) {
        return "Gizi baik";
    }

    if (z <= 2) {
        return "Berisiko gizi lebih";
    }

    if (z <= 3) {
        return "Gizi lebih";
    }

    return "Obesitas";

}


function classifyBMIForAge(
    z,
    ageYears
) {

    if (!Number.isFinite(z)) {
        return "Tidak tersedia";
    }


    /*
     * 0–5 tahun
     *
     * WHO:
     * > +1 SD  : berisiko overweight
     * > +2 SD  : overweight
     * > +3 SD  : obesitas
     */

    if (ageYears < 5) {

        if (z < -3) {
            return "Sangat kurus";
        }

        if (z < -2) {
            return "Kurus";
        }

        if (z <= 1) {
            return "Normal";
        }

        if (z <= 2) {
            return "Berisiko gizi lebih";
        }

        if (z <= 3) {
            return "Gizi lebih";
        }

        return "Obesitas";

    }


    /*
     * 5–19 tahun
     */

    if (z < -3) {
        return "Gizi buruk";
    }

    if (z < -2) {
        return "Gizi kurang";
    }

    if (z < 1) {
        return "Gizi baik";
    }

    if (z <= 2) {
        return "Gizi lebih";
    }

    return "Obesitas";

}


/* =========================================================
   ENGINE LMS
========================================================= */

/*
 * Formula LMS WHO:
 *
 * Jika L != 0:
 *
 * Z =
 * (((X/M)^L) - 1)
 * /
 * (L*S)
 *
 *
 * Jika L = 0:
 *
 * Z =
 * ln(X/M) / S
 *
 *
 * DATA LMS RESMI HARUS DIMASUKKAN
 * KE OBJECT ANTHRO_LMS.
 *
 */


const ANTHRO_LMS = {

    male: {

        weightForAge: {},

        heightForAge: {},

        weightForHeight: {},

        bmiForAge: {}

    },


    female: {

        weightForAge: {},

        heightForAge: {},

        weightForHeight: {},

        bmiForAge: {}

    }

};


/* =========================================================
   LMS CALCULATOR
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

        return null;

    }


    if (L === 0) {

        return Math.log(
            measurement / M
        ) / S;

    }


    return (
        Math.pow(
            measurement / M,
            L
        ) - 1
    )
    /
    (
        L * S
    );

}


/* =========================================================
   CARI DATA LMS
========================================================= */

function getLMS(
    sex,
    indicator,
    key
) {

    const gender =
        sex === "female"
            ? "female"
            : "male";


    const table =
        ANTHRO_LMS[
            gender
        ]?.[
            indicator
        ];


    if (!table) {
        return null;
    }


    return table[key] || null;

}


/* =========================================================
   INTERPOLASI LMS
========================================================= */

function interpolateLMS(
    table,
    age
) {

    if (
        !table ||
        typeof table !== "object"
    ) {

        return null;

    }


    const keys =
        Object.keys(table)
            .map(Number)
            .filter(Number.isFinite)
            .sort(
                (a, b) => a - b
            );


    if (!keys.length) {
        return null;
    }


    if (
        age <= keys[0]
    ) {

        return table[
            keys[0]
        ];

    }


    if (
        age >= keys[keys.length - 1]
    ) {

        return table[
            keys[keys.length - 1]
        ];

    }


    let lower =
        keys[0];

    let upper =
        keys[keys.length - 1];


    for (
        let i = 0;
        i < keys.length - 1;
        i++
    ) {

        if (
            age >= keys[i] &&
            age <= keys[i + 1]
        ) {

            lower = keys[i];
            upper = keys[i + 1];

            break;

        }

    }


    const a =
        table[lower];

    const b =
        table[upper];


    if (
        !a ||
        !b
    ) {

        return null;

    }


    const ratio =
        (
            age - lower
        )
        /
        (
            upper - lower
        );


    return {

        L:
            a.L +
            (
                b.L - a.L
            ) * ratio,

        M:
            a.M +
            (
                b.M - a.M
            ) * ratio,

        S:
            a.S +
            (
                b.S - a.S
            ) * ratio

    };

}


/* =========================================================
   Z-SCORE DARI LMS
========================================================= */

function zScoreFromTable(
    sex,
    indicator,
    age,
    measurement
) {

    const gender =
        sex === "female"
            ? "female"
            : "male";


    const table =
        ANTHRO_LMS[
            gender
        ]?.[
            indicator
        ];


    if (
        !table ||
        Object.keys(table).length === 0
    ) {

        return null;

    }


    const lms =
        interpolateLMS(
            table,
            age
        );


    if (!lms) {
        return null;
    }


    return calculateLMSZScore(
        measurement,
        lms.L,
        lms.M,
        lms.S
    );

}


/* =========================================================
   KEBUTUHAN ENERGI
========================================================= */

/*
 * Ini adalah estimasi edukatif,
 * bukan diagnosis kebutuhan energi klinis.
 *
 * Karena kebutuhan energi anak dipengaruhi:
 * - usia
 * - jenis kelamin
 * - berat badan
 * - tinggi badan
 * - aktivitas
 * - kondisi klinis
 *
 */

function calculateEnergy(
    sex,
    ageYears,
    weight,
    height
) {

    if (
        !Number.isFinite(ageYears) ||
        !Number.isFinite(weight) ||
        !Number.isFinite(height)
    ) {

        return null;

    }


    /*
     * Estimasi BMR Schofield
     */

    let bmr;


    if (ageYears < 3) {

        bmr =
            59.512 *
            weight
            -
            30.4;

    }

    else if (ageYears < 10) {

        bmr =
            22.706 *
            weight
            +
            504.3;

    }

    else {

        if (sex === "female") {

            bmr =
                12.2 *
                weight
                +
                746;

        } else {

            bmr =
                17.5 *
                weight
                +
                651;

        }

    }


    /*
     * Faktor aktivitas ringan.
     *
     * Hanya estimasi.
     */

    let activityFactor =
        1.4;


    if (ageYears >= 10) {

        activityFactor =
            1.5;

    }


    const energy =
        bmr *
        activityFactor;


    return {

        bmr:
            Math.round(bmr),

        estimatedEnergy:
            Math.round(energy)

    };

}


/* =========================================================
   MAKRO
========================================================= */

function calculateMacros(
    calories
) {

    if (
        !Number.isFinite(calories) ||
        calories <= 0
    ) {

        return null;

    }


    const carbCalories =
        calories *
        GIZI_ANAK_CONFIG
            .macroRatio
            .carbohydrate;


    const proteinCalories =
        calories *
        GIZI_ANAK_CONFIG
            .macroRatio
            .protein;


    const fatCalories =
        calories *
        GIZI_ANAK_CONFIG
            .macroRatio
            .fat;


    return {

        calories:
            Math.round(calories),

        carbohydrate:
            round(
                carbCalories / 4,
                1
            ),

        protein:
            round(
                proteinCalories / 4,
                1
            ),

        fat:
            round(
                fatCalories / 9,
                1
            )

    };

}


/* =========================================================
   HTML HASIL
========================================================= */

function resultCard(
    title,
    value,
    status,
    description
) {

    return `

        <div class="anak-result-card">

            <div class="anak-result-card-title">
                ${escapeHTML(title)}
            </div>

            <div class="anak-result-zscore">
                ${escapeHTML(value)}
            </div>

            <div class="anak-result-status">
                ${escapeHTML(status)}
            </div>

            ${
                description
                ?
                `
                <div class="anak-result-description">
                    ${escapeHTML(description)}
                </div>
                `
                :
                ""
            }

        </div>

    `;

}


/* =========================================================
   KARTU MAKRO
========================================================= */

function macroCard(
    macro
) {

    if (!macro) {
        return "";
    }


    return `

        <div class="anak-macro-section">

            <div class="anak-result-heading">

                <span>
                    🍽️
                </span>

                <div>

                    <strong>
                        Estimasi Kebutuhan Energi & Makronutrien
                    </strong>

                    <small>
                        Nilai edukatif, bukan resep diet individual
                    </small>

                </div>

            </div>


            <div class="anak-macro-grid">

                <div class="anak-macro-card">

                    <span>
                        Energi
                    </span>

                    <strong>
                        ${macro.calories}
                    </strong>

                    <small>
                        kkal/hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        Karbohidrat
                    </span>

                    <strong>
                        ${macro.carbohydrate}
                    </strong>

                    <small>
                        gram/hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        Protein
                    </span>

                    <strong>
                        ${macro.protein}
                    </strong>

                    <small>
                        gram/hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        Lemak
                    </span>

                    <strong>
                        ${macro.fat}
                    </strong>

                    <small>
                        gram/hari
                    </small>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   FUNGSI UTAMA
========================================================= */

function calculateChildNutrition() {

    console.log(
        "TOMBOL HITUNG STATUS GIZI DIKLIK"
    );


    const gender =
        getElement("anakGender")?.value
        || "male";


    const birth =
        parseDate(
            getElement("anakBirthDate")?.value
        );


    const check =
        parseDate(
            getElement("anakCheckDate")?.value
        );


    const weight =
        numberValue(
            "anakWeight"
        );


    const height =
        numberValue(
            "anakHeight"
        );


    const result =
        getElement(
            "anakResult"
        );


    if (!result) {

        console.error(
            "anakResult tidak ditemukan"
        );

        return;

    }


    if (
        !birth ||
        !check
    ) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️
                Silakan masukkan tanggal lahir
                dan tanggal pemeriksaan.

            </div>

        `;

        return;

    }


    if (!weight || weight <= 0) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️
                Berat badan belum diisi dengan benar.

            </div>

        `;

        return;

    }


    if (!height || height <= 0) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️
                Tinggi/panjang badan belum diisi
                dengan benar.

            </div>

        `;

        return;

    }


    const age =
        calculateAge(
            birth,
            check
        );


    if (!age) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️
                Tanggal pemeriksaan harus sama
                atau setelah tanggal lahir.

            </div>

        `;

        return;

    }


    const bmi =
        calculateBMI(
            weight,
            height
        );


    const ageYears =
        age.totalYears;


    /*
     * =====================================================
     * Z-SCORE
     * =====================================================
     */

    const zWeightAge =
        zScoreFromTable(
            gender,
            "weightForAge",
            age.totalMonths,
            weight
        );


    const zHeightAge =
        zScoreFromTable(
            gender,
            "heightForAge",
            age.totalMonths,
            height
        );


    const zBMI =
        zScoreFromTable(
            gender,
            "bmiForAge",
            age.totalMonths,
            bmi
        );


    /*
     * BB/TB
     *
     * Untuk mesin final, tabel BB/TB perlu menggunakan
     * panjang/tinggi sesuai umur dan metode pengukuran.
     */

    const zWeightHeight =
        null;


    /*
     * =====================================================
     * STATUS
     * =====================================================
     */

    const statusWeightAge =
        classifyWeightForAge(
            zWeightAge
        );


    const statusHeightAge =
        classifyHeightForAge(
            zHeightAge
        );


    const statusWeightHeight =
        classifyWeightForHeight(
            zWeightHeight
        );


    const statusBMI =
        classifyBMIForAge(
            zBMI,
            ageYears
        );


    /*
     * =====================================================
     * ENERGI + MAKRO
     * =====================================================
     */

    const energy =
        calculateEnergy(
            gender,
            ageYears,
            weight,
            height
        );


    const macros =
        energy
        ?
        calculateMacros(
            energy.estimatedEnergy
        )
        :
        null;


    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    let html = `

        <div class="anak-result-header">

            <div>

                <span class="anak-result-label">
                    HASIL PENILAIAN PERTUMBUHAN
                </span>

                <h3>
                    Hasil Antropometri Anak
                </h3>

                <p>
                    Acuan: Permenkes No. 2 Tahun 2020
                </p>

            </div>

        </div>


        <div class="anak-summary-grid">

            <div>

                <span>
                    Usia
                </span>

                <strong>
                    ${escapeHTML(age.ageText)}
                </strong>

            </div>


            <div>

                <span>
                    Berat badan
                </span>

                <strong>
                    ${round(weight, 1)} kg
                </strong>

            </div>


            <div>

                <span>
                    Tinggi / panjang badan
                </span>

                <strong>
                    ${round(height, 1)} cm
                </strong>

            </div>


            <div>

                <span>
                    IMT
                </span>

                <strong>
                    ${round(bmi, 2)} kg/m²
                </strong>

            </div>

        </div>


        <div class="anak-result-heading">

            <span>
                📊
            </span>

            <div>

                <strong>
                    Indikator Antropometri
                </strong>

                <small>
                    Interpretasi berdasarkan umur dan jenis kelamin
                </small>

            </div>

        </div>


        <div class="anak-result-grid">

    `;


    /*
     * BB/U
     */

    html += resultCard(

        "BB menurut Umur",

        Number.isFinite(zWeightAge)
            ?
            `${round(zWeightAge, 2)} SD`
            :
            "—",

        statusWeightAge,

        ageYears > 10
            ?
            "BB/U tidak digunakan sebagai indikator utama setelah usia 10 tahun."
            :
            ""

    );


    /*
     * TB/U
     */

    html += resultCard(

        "TB/PB menurut Umur",

        Number.isFinite(zHeightAge)
            ?
            `${round(zHeightAge, 2)} SD`
            :
            "—",

        statusHeightAge,

        ""

    );


    /*
     * BB/TB
     */

    html += resultCard(

        "BB menurut TB/PB",

        Number.isFinite(zWeightHeight)
            ?
            `${round(zWeightHeight, 2)} SD`
            :
            "—",

        statusWeightHeight,

        ageYears >= 5
            ?
            "Indikator BB/TB terutama digunakan pada anak usia di bawah 5 tahun."
            :
            ""

    );


    /*
     * IMT/U
     */

    html += resultCard(

        "IMT menurut Umur",

        Number.isFinite(zBMI)
            ?
            `${round(zBMI, 2)} SD`
            :
            "—",

        statusBMI,

        ""

    );


    html += `

        </div>

    `;


    /*
     * =====================================================
     * IMT INFORMASI
     * =====================================================
     */

    html += `

        <div class="anak-bmi-box">

            <div>

                <span>
                    IMT aktual
                </span>

                <strong>
                    ${round(bmi, 2)} kg/m²
                </strong>

            </div>

            <small>
                IMT anak tidak dinilai menggunakan batas IMT
                dewasa. Status utama harus dibandingkan dengan
                umur dan jenis kelamin.
            </small>

        </div>

    `;


    /*
     * =====================================================
     * MAKRO
     * =====================================================
     */

    html += macroCard(
        macros
    );


    /*
     * =====================================================
     * CATATAN
     * =====================================================
     */

    html += `

        <div class="anak-result-note">

            <strong>
                ⚠️ Catatan klinis
            </strong>

            <p>
                Hasil kalkulator merupakan skrining awal.
                Penilaian status gizi anak perlu dilakukan
                dengan pengukuran antropometri yang benar,
                plotting pertumbuhan, anamnesis, pemeriksaan
                klinis, serta mempertimbangkan kondisi anak.
            </p>

            <p>
                Z-score hanya ditampilkan apabila tabel
                referensi antropometri resmi tersedia di
                mesin kalkulator.
            </p>

        </div>

    `;


    result.innerHTML =
        html;


    console.log(
        "PERHITUNGAN SELESAI",
        {
            age,
            weight,
            height,
            bmi,
            zWeightAge,
            zHeightAge,
            zWeightHeight,
            zBMI,
            energy,
            macros
        }
    );


    /*
     * Scroll ke hasil
     */

    setTimeout(() => {

        result.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }, 100);

}


/* =========================================================
   EVENT LISTENER
========================================================= */

function initializeChildNutrition() {

    const birth =
        getElement(
            "anakBirthDate"
        );


    const check =
        getElement(
            "anakCheckDate"
        );


    const button =
        getElement(
            "anakCalculateButton"
        );


    /*
     * Tanggal pemeriksaan default = hari ini
     */

    if (
        check &&
        !check.value
    ) {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            )
            .padStart(2, "0");


        const day =
            String(
                now.getDate()
            )
            .padStart(2, "0");


        check.value =
            `${year}-${month}-${day}`;

    }


    /*
     * Event umur
     */

    if (birth) {

        birth.addEventListener(
            "change",
            updateAgeDisplay
        );

    }


    if (check) {

        check.addEventListener(
            "change",
            updateAgeDisplay
        );

    }


    /*
     * Event tombol
     */

    if (button) {

        button.addEventListener(
            "click",
            calculateChildNutrition
        );

        console.log(
            "Event tombol berhasil dipasang."
        );

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
        getElement("anakResult")
    );


    updateAgeDisplay();

}


/* =========================================================
   PUBLIC API
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;


window.updateAgeDisplay =
    updateAgeDisplay;


window.calculateAge =
    calculateAge;


window.calculateBMI =
    calculateBMI;


window.calculateMacros =
    calculateMacros;


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
