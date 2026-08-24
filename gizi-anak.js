/* =========================================================
   GIZI-ANAK.JS
   Klinik Putra Medika

   WHO 0-19 tahun
   Z-score + status gizi + IMT + makronutrien

   Engine:
   @pedi-growth/core
   WHO Anthro 0-5 tahun
   WHO Reference 2007 5-19 tahun
========================================================= */

import {
    calculateZScore
} from "https://cdn.jsdelivr.net/npm/@pedi-growth/core@1.1.0/+esm";


"use strict";


console.log("======================================");
console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
console.log("Klinik Putra Medika");
console.log("WHO Z-SCORE ENGINE");
console.log("======================================");


/* =========================================================
   KONFIGURASI
========================================================= */

const CONFIG = {

    maxAgeDays: 19 * 365.25,

    bmi: {

        /*
         * Ini hanya interpretasi nilai IMT aktual
         * sebagai informasi tambahan.
         *
         * STATUS GIZI TIDAK ditentukan dengan
         * cutoff IMT dewasa.
         */

        low: 14,

        high: 18.5

    }

};


/* =========================================================
   UTILITAS DOM
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   FORMAT ANGKA
========================================================= */

function formatNumber(
    value,
    decimals = 2
) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
    ) {

        return "—";

    }

    return Number(value)
        .toFixed(decimals)
        .replace(".", ",");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   PARSE NUMBER
========================================================= */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return NaN;

    }

    return Number(
        String(value).replace(",", ".")
    );

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

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const date = new Date(
        year,
        month,
        day
    );

    date.setHours(
        0,
        0,
        0,
        0
    );

    return date;

}


/* =========================================================
   HITUNG USIA
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


    const ageInDays =
        Math.floor(
            (
                checkDate -
                birthDate
            ) /
            86400000
        );


    const ageInMonths =
        ageInDays /
        30.4375;


    return {

        years,
        months,
        days,

        ageInDays,

        ageInMonths

    };

}


/* =========================================================
   TAMPILKAN USIA
========================================================= */

function updateAge() {

    const birth =
        parseDate(
            $("anakBirthDate")?.value
        );

    const check =
        parseDate(
            $("anakCheckDate")?.value
        );

    const age =
        calculateAge(
            birth,
            check
        );


    const ageText =
        $("anakAgeText");


    if (!ageText) {
        return;
    }


    if (!age) {

        ageText.textContent =
            "—";

        return;

    }


    ageText.textContent =
        `${age.years} tahun ` +
        `${age.months} bulan ` +
        `${age.days} hari`;


    console.log(
        "USIA:",
        ageText.textContent
    );

}


/* =========================================================
   HITUNG IMT
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

        return NaN;

    }


    const heightMeter =
        height / 100;


    return (
        weight /
        (
            heightMeter *
            heightMeter
        )
    );

}


/* =========================================================
   INTERPRETASI IMT AKTUAL
========================================================= */

function interpretBMI(
    bmi
) {

    if (
        !Number.isFinite(bmi)
    ) {

        return {

            label: "Tidak tersedia",

            className: "neutral",

            note:
                "IMT belum dapat dihitung."

        };

    }


    if (
        bmi < CONFIG.bmi.low
    ) {

        return {

            label: "Rendah",

            className: "low",

            note:
                "Nilai IMT aktual relatif rendah. " +
                "Pada anak, status gizi tetap harus " +
                "ditentukan berdasarkan IMT menurut umur."

        };

    }


    if (
        bmi <= CONFIG.bmi.high
    ) {

        return {

            label: "Normal",

            className: "normal",

            note:
                "Nilai IMT aktual berada dalam " +
                "kisaran umum. Penilaian status gizi " +
                "anak tetap menggunakan IMT menurut umur."

        };

    }


    return {

        label: "Tinggi",

        className: "high",

        note:
            "Nilai IMT aktual relatif tinggi. " +
            "Pada anak, penilaian utama tetap menggunakan " +
            "IMT menurut umur."

    };

}


/* =========================================================
   STATUS Z-SCORE
========================================================= */

function classifyBMIForAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {

            label: "Tidak tersedia",

            className: "neutral"

        };

    }


    if (z < -3) {

        return {

            label: "Sangat kurus",

            className: "very-low"

        };

    }


    if (z < -2) {

        return {

            label: "Kurus",

            className: "low"

        };

    }


    if (z <= 1) {

        return {

            label: "Normal",

            className: "normal"

        };

    }


    if (z <= 2) {

        return {

            label: "Gemuk",

            className: "high"

        };

    }


    return {

        label: "Obesitas",

        className: "very-high"

    };

}


/* =========================================================
   STATUS TB/U
========================================================= */

function classifyHeightForAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {

            label: "Tidak tersedia",

            className: "neutral"

        };

    }


    if (z < -3) {

        return {

            label: "Sangat pendek",

            className: "very-low"

        };

    }


    if (z < -2) {

        return {

            label: "Pendek",

            className: "low"

        };

    }


    return {

        label: "Normal",

        className: "normal"

    };

}


/* =========================================================
   STATUS BB/U
========================================================= */

function classifyWeightForAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {

            label: "Tidak tersedia",

            className: "neutral"

        };

    }


    if (z < -3) {

        return {

            label:
                "Berat badan sangat kurang",

            className:
                "very-low"

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
   STATUS BB/PB ATAU BB/TB
========================================================= */

function classifyWeightForHeight(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {

            label:
                "Tidak tersedia",

            className:
                "neutral"

        };

    }


    if (z < -3) {

        return {

            label:
                "Gizi buruk",

            className:
                "very-low"

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
                "Risiko gizi lebih",

            className:
                "high"

        };

    }


    if (z <= 3) {

        return {

            label:
                "Gizi lebih",

            className:
                "very-high"

        };

    }


    return {

        label:
            "Obesitas",

        className:
            "very-high"

    };

}


/* =========================================================
   KEBUTUHAN ENERGI
========================================================= */

function calculateEnergy(
    age,
    weight,
    height,
    sex
) {

    /*
     * Estimasi edukatif.
     *
     * Bukan pengganti asesmen klinis
     * atau kebutuhan energi individual.
     */


    if (
        !age ||
        !Number.isFinite(weight) ||
        !Number.isFinite(height)
    ) {

        return null;

    }


    let kcal;


    if (
        age.years < 1
    ) {

        kcal =
            weight * 90;

    }

    else if (
        age.years < 3
    ) {

        kcal =
            weight * 80;

    }

    else if (
        age.years < 7
    ) {

        kcal =
            weight * 70;

    }

    else if (
        age.years < 10
    ) {

        kcal =
            weight * 60;

    }

    else {

        kcal =
            weight * (
                sex === "male"
                    ? 45
                    : 40
            );

    }


    return Math.round(kcal);

}


/* =========================================================
   MAKRO
========================================================= */

function calculateMacros(
    calories
) {

    if (
        !Number.isFinite(calories)
    ) {

        return null;

    }


    /*
     * Distribusi edukatif:
     *
     * Protein 15%
     * Lemak   30%
     * Karbo    55%
     */

    const proteinKcal =
        calories * 0.15;


    const fatKcal =
        calories * 0.30;


    const carbKcal =
        calories * 0.55;


    return {

        protein:
            proteinKcal / 4,

        carbohydrate:
            carbKcal / 4,

        fat:
            fatKcal / 9

    };

}


/* =========================================================
   HITUNG Z-SCORE
========================================================= */

async function getZScore(
    indicator,
    sex,
    ageInDays,
    measurement
) {

    try {

        if (
            !Number.isFinite(
                ageInDays
            )
        ) {

            return null;

        }


        if (
            !Number.isFinite(
                measurement
            ) ||
            measurement <= 0
        ) {

            return null;

        }


        const result =
            await calculateZScore({

                indicator,

                sex,

                ageInDays,

                measurement,

                chartSet:
                    "who-standard"

            });


        console.log(
            "Z-SCORE",
            indicator,
            result
        );


        if (!result) {
            return null;
        }


        return {

            zScore:
                Number(
                    result.zScore
                ),

            percentile:
                Number(
                    result.percentile
                )

        };

    }

    catch (error) {

        console.error(
            "Gagal menghitung Z-score:",
            indicator,
            error
        );

        return null;

    }

}


/* =========================================================
   KARTU HASIL Z-SCORE
========================================================= */

function resultCard(
    title,
    subtitle,
    result,
    classification
) {

    const z =
        result?.zScore;


    const percentile =
        result?.percentile;


    return `

        <div class="anak-zscore-card">

            <div class="anak-zscore-header">

                <div>

                    <span class="anak-zscore-subtitle">
                        ${escapeHTML(subtitle)}
                    </span>

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                </div>

            </div>


            <div class="anak-zscore-value">

                <strong>
                    ${
                        Number.isFinite(z)
                            ? `${formatNumber(z, 2)} SD`
                            : "—"
                    }
                </strong>

            </div>


            <div class="anak-zscore-status ${classification.className}">

                ${escapeHTML(
                    classification.label
                )}

            </div>


            ${
                Number.isFinite(percentile)

                    ? `
                        <div class="anak-percentile">
                            Persentil:
                            ${formatNumber(percentile, 1)}
                        </div>
                    `

                    : ""
            }

        </div>

    `;

}


/* =========================================================
   HASIL IMT
========================================================= */

function bmiCard(
    bmi
) {

    const interpretation =
        interpretBMI(
            bmi
        );


    return `

        <div class="anak-bmi-result">

            <div class="anak-bmi-number">

                <span>
                    IMT aktual
                </span>

                <strong>
                    ${
                        Number.isFinite(bmi)
                            ? formatNumber(bmi, 2)
                            : "—"
                    }
                    kg/m²
                </strong>

            </div>


            <div class="anak-bmi-category ${interpretation.className}">

                <span>
                    Interpretasi IMT
                </span>

                <strong>
                    ${escapeHTML(
                        interpretation.label
                    )}
                </strong>

            </div>


            <p class="anak-bmi-note">

                ${escapeHTML(
                    interpretation.note
                )}

            </p>


            <div class="anak-bmi-warning">

                ⚠️
                <strong>Penting:</strong>
                cutoff IMT dewasa tidak digunakan
                untuk menentukan status gizi anak.
                Status gizi utama menggunakan
                <strong>IMT menurut umur (IMT/U)</strong>.

            </div>

        </div>

    `;

}


/* =========================================================
   MAKRO CARD
========================================================= */

function macroCard(
    calories,
    macros
) {

    if (
        !macros
    ) {

        return "";

    }


    return `

        <div class="anak-macro-section">

            <div class="anak-section-label">
                KEBUTUHAN ENERGI & MAKRONUTRIEN
            </div>


            <h3>
                Estimasi kebutuhan harian
            </h3>


            <div class="anak-macro-grid">


                <div class="anak-macro-card">

                    <span>
                        🔥 Energi
                    </span>

                    <strong>
                        ${calories} kcal
                    </strong>

                    <small>
                        /hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        🥩 Protein
                    </span>

                    <strong>
                        ${formatNumber(
                            macros.protein,
                            1
                        )} g
                    </strong>

                    <small>
                        /hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        🍚 Karbohidrat
                    </span>

                    <strong>
                        ${formatNumber(
                            macros.carbohydrate,
                            1
                        )} g
                    </strong>

                    <small>
                        /hari
                    </small>

                </div>


                <div class="anak-macro-card">

                    <span>
                        🥑 Lemak
                    </span>

                    <strong>
                        ${formatNumber(
                            macros.fat,
                            1
                        )} g
                    </strong>

                    <small>
                        /hari
                    </small>

                </div>

            </div>


            <p class="anak-macro-note">

                Estimasi energi dan makronutrien
                merupakan informasi edukatif dan
                bukan pengganti penilaian kebutuhan
                energi individual oleh tenaga kesehatan.

            </p>

        </div>

    `;

}


/* =========================================================
   FUNGSI UTAMA
========================================================= */

async function calculateChildNutrition() {

    console.log(
        "TOMBOL HITUNG STATUS GIZI DIKLIK"
    );


    const gender =
        $("anakGender")?.value;


    const birthDate =
        parseDate(
            $("anakBirthDate")?.value
        );


    const checkDate =
        parseDate(
            $("anakCheckDate")?.value
        );


    const weight =
        numberValue(
            $("anakWeight")?.value
        );


    const height =
        numberValue(
            $("anakHeight")?.value
        );


    const resultArea =
        $("anakResult");


    console.log(
        "DATA:",
        {

            gender,

            birthDate,

            checkDate,

            weight,

            height

        }
    );


    if (!resultArea) {

        console.error(
            "anakResult tidak ditemukan"
        );

        return;

    }


    /* -----------------------------------------------------
       VALIDASI
    ----------------------------------------------------- */

    if (
        !gender ||
        !birthDate ||
        !checkDate ||
        !Number.isFinite(weight) ||
        !Number.isFinite(height)
    ) {

        resultArea.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Data belum lengkap
                </strong>

                <p>
                    Lengkapi jenis kelamin,
                    tanggal lahir,
                    tanggal pemeriksaan,
                    berat badan dan tinggi/panjang badan.
                </p>

            </div>

        `;

        return;

    }


    if (
        checkDate < birthDate
    ) {

        resultArea.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Tanggal tidak valid
                </strong>

                <p>
                    Tanggal pemeriksaan tidak boleh
                    lebih awal daripada tanggal lahir.
                </p>

            </div>

        `;

        return;

    }


    if (
        weight <= 0 ||
        height <= 0
    ) {

        resultArea.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Berat atau tinggi tidak valid
                </strong>

            </div>

        `;

        return;

    }


    /* -----------------------------------------------------
       USIA
    ----------------------------------------------------- */

    const age =
        calculateAge(
            birthDate,
            checkDate
        );


    if (!age) {

        return;

    }


    if (
        age.ageInDays >
        CONFIG.maxAgeDays
    ) {

        resultArea.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Usia di luar rentang WHO
                </strong>

                <p>
                    Kalkulator ini menggunakan
                    referensi pertumbuhan WHO
                    sampai usia 19 tahun.
                </p>

            </div>

        `;

        return;

    }


    /* -----------------------------------------------------
       IMT
    ----------------------------------------------------- */

    const bmi =
        calculateBMI(
            weight,
            height
        );


    /* -----------------------------------------------------
       LOADING
    ----------------------------------------------------- */

    resultArea.innerHTML = `

        <div class="anak-loading">

            <div class="anak-loading-spinner"></div>

            <strong>
                Menghitung Z-score...
            </strong>

            <small>
                Memuat referensi pertumbuhan WHO.
            </small>

        </div>

    `;


    try {

        /* -------------------------------------------------
           Z-SCORE
        ------------------------------------------------- */

        const [

            weightAge,

            heightAge,

            bmiAge,

            weightHeight

        ] = await Promise.all([


            getZScore(
                "weight-for-age",
                gender,
                age.ageInDays,
                weight
            ),


            getZScore(
                "length-height-for-age",
                gender,
                age.ageInDays,
                height
            ),


            getZScore(
                "bmi-for-age",
                gender,
                age.ageInDays,
                bmi
            ),


            getWeightForHeight(
                gender,
                age.ageInDays,
                weight,
                height
            )

        ]);


        console.log(
            "HASIL WHO:",
            {

                weightAge,

                heightAge,

                bmiAge,

                weightHeight

            }
        );


        /* -------------------------------------------------
           CLASSIFICATION
        ------------------------------------------------- */

        const weightClass =
            classifyWeightForAge(
                weightAge?.zScore
            );


        const heightClass =
            classifyHeightForAge(
                heightAge?.zScore
            );


        const bmiClass =
            classifyBMIForAge(
                bmiAge?.zScore
            );


        const weightHeightClass =
            classifyWeightForHeight(
                weightHeight?.zScore
            );


        /* -------------------------------------------------
           ENERGI + MAKRO
        ------------------------------------------------- */

        const calories =
            calculateEnergy(
                age,
                weight,
                height,
                gender
            );


        const macros =
            calculateMacros(
                calories
            );


        /* -------------------------------------------------
           HASIL
        ------------------------------------------------- */

        let html = `

            <div class="anak-result-header">

                <div>

                    <span class="anak-section-label">
                        HASIL PENILAIAN PERTUMBUHAN
                    </span>

                    <h2>
                        WHO Growth Reference
                    </h2>

                </div>

            </div>


            <div class="anak-summary-grid">

                <div>
                    <span>Usia</span>
                    <strong>
                        ${age.years} th
                        ${age.months} bl
                        ${age.days} hr
                    </strong>
                </div>


                <div>
                    <span>Berat badan</span>
                    <strong>
                        ${formatNumber(weight, 1)} kg
                    </strong>
                </div>


                <div>
                    <span>TB/PB</span>
                    <strong>
                        ${formatNumber(height, 1)} cm
                    </strong>
                </div>


                <div>
                    <span>IMT</span>
                    <strong>
                        ${formatNumber(bmi, 2)}
                    </strong>
                </div>

            </div>


            <div class="anak-zscore-grid">

        `;


        /* BB/U */

        if (
            age.ageInDays <=
            (10 * 365.25)
        ) {

            html +=
                resultCard(
                    "BB menurut Umur",
                    "Berat Badan / Umur",
                    weightAge,
                    weightClass
                );

        }


        /* TB/U */

        html +=
            resultCard(
                "TB/PB menurut Umur",
                "Tinggi/Panjang Badan / Umur",
                heightAge,
                heightClass
            );


        /* BB/TB */

        if (
            age.ageInDays <
            (5 * 365.25)
        ) {

            html +=
                resultCard(
                    "BB menurut TB/PB",
                    "Berat Badan / Panjang-Tinggi Badan",
                    weightHeight,
                    weightHeightClass
                );

        }


        /* IMT/U */

        html +=
            resultCard(
                "IMT menurut Umur",
                "Indeks Massa Tubuh / Umur",
                bmiAge,
                bmiClass
            );


        html += `

            </div>

        `;


        /* -------------------------------------------------
           IMT AKTUAL
        ------------------------------------------------- */

        html += `

            <div class="anak-result-block">

                <div class="anak-section-label">
                    IMT AKTUAL
                </div>

                ${bmiCard(bmi)}

            </div>

        `;


        /* -------------------------------------------------
           MAKRO
        ------------------------------------------------- */

        html +=
            macroCard(
                calories,
                macros
            );


        /* -------------------------------------------------
           CATATAN
        ------------------------------------------------- */

        html += `

            <div class="anak-result-note">

                <strong>
                    Catatan interpretasi
                </strong>

                <p>
                    Z-score digunakan untuk menilai
                    pertumbuhan anak berdasarkan umur
                    dan jenis kelamin. Interpretasi
                    klinis harus mempertimbangkan
                    kondisi anak secara keseluruhan,
                    riwayat pertumbuhan dan pemeriksaan
                    klinis.
                </p>

                <p>
                    Untuk usia 5–19 tahun, referensi
                    WHO 2007 digunakan. BB menurut umur
                    hanya tersedia sampai usia 10 tahun.
                </p>

            </div>

        `;


        resultArea.innerHTML =
            html;


        console.log(
            "PERHITUNGAN SELESAI"
        );


    }

    catch (error) {

        console.error(
            "ERROR PERHITUNGAN:",
            error
        );


        resultArea.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Z-score belum dapat dihitung
                </strong>

                <p>
                    Mesin referensi WHO gagal
                    memproses data. Pastikan
                    koneksi internet tersedia
                    kemudian coba kembali.
                </p>

                <small>
                    ${escapeHTML(
                        error?.message ||
                        "Unknown error"
                    )}
                </small>

            </div>

        `;

    }

}


/* =========================================================
   BB/PB ATAU BB/TB
========================================================= */

async function getWeightForHeight(
    sex,
    ageInDays,
    weight,
    height
) {

    /*
     * WHO menggunakan:
     *
     * <24 bulan → weight-for-length
     * >=24 bulan → weight-for-height
     *
     * Kita serahkan ke engine WHO.
     */


    try {

        const indicator =
            ageInDays <
            (24 * 30.4375)

                ? "weight-for-length"

                : "weight-for-height";


        return await getZScore(
            indicator,
            sex,
            ageInDays,
            weight
        );

    }

    catch (error) {

        console.error(
            "WFH/WFL ERROR:",
            error
        );

        return null;

    }

}


/* =========================================================
   EVENT
========================================================= */

function attachEvents() {

    const button =
        $("anakCalculateButton");


    if (!button) {

        console.error(
            "anakCalculateButton tidak ditemukan"
        );

        return;

    }


    button.addEventListener(
        "click",
        calculateChildNutrition
    );


    console.log(
        "Event tombol berhasil dipasang."
    );


    const birth =
        $("anakBirthDate");


    const check =
        $("anakCheckDate");


    if (birth) {

        birth.addEventListener(
            "change",
            updateAge
        );

    }


    if (check) {

        check.addEventListener(
            "change",
            updateAge
        );

    }


    updateAge();

}


/* =========================================================
   INIT
========================================================= */

function init() {

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


    attachEvents();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

}
else {

    init();

}


/* =========================================================
   PUBLIC API
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;
