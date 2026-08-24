/* =========================================================
   GIZI-ANAK.JS
   Klinik Putra Medika

   STABLE VERSION

   Fungsi:
   - Hitung usia
   - Hitung IMT
   - Interpretasi IMT aktual
   - Z-score engine lokal
   - Status BB/U
   - Status TB/PB/U
   - Status IMT/U
   - Status BB/TB atau BB/PB
   - Estimasi energi
   - Makronutrien
========================================================= */

"use strict";


console.log(
    "======================================"
);

console.log(
    "GIZI-ANAK.JS BERHASIL DIMUAT"
);

console.log(
    "Klinik Putra Medika"
);

console.log(
    "STABLE VERSION"
);

console.log(
    "======================================"
);



/* =========================================================
   DOM
========================================================= */

function el(id) {

    return document.getElementById(id);

}



/* =========================================================
   NUMBER
========================================================= */

function num(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return NaN;

    }

    return Number(
        String(value)
            .replace(",", ".")
    );

}



/* =========================================================
   DATE
========================================================= */

function getDate(value) {

    if (!value) {

        return null;

    }

    const p =
        value.split("-");

    if (
        p.length !== 3
    ) {

        return null;

    }

    const d =
        new Date(
            Number(p[0]),
            Number(p[1]) - 1,
            Number(p[2])
        );

    d.setHours(
        0,
        0,
        0,
        0
    );

    return d;

}



/* =========================================================
   AGE
========================================================= */

function calculateAge(
    birth,
    check
) {

    if (
        !birth ||
        !check ||
        check < birth
    ) {

        return null;

    }


    let years =
        check.getFullYear()
        -
        birth.getFullYear();


    let months =
        check.getMonth()
        -
        birth.getMonth();


    let days =
        check.getDate()
        -
        birth.getDate();


    if (
        days < 0
    ) {

        months--;

        const previous =
            new Date(
                check.getFullYear(),
                check.getMonth(),
                0
            );

        days +=
            previous.getDate();

    }


    if (
        months < 0
    ) {

        years--;

        months += 12;

    }


    const ageDays =
        Math.floor(
            (
                check.getTime()
                -
                birth.getTime()
            )
            /
            86400000
        );


    const ageMonths =
        ageDays /
        30.4375;


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

function updateAge() {

    const birth =
        getDate(
            el("anakBirthDate")?.value
        );


    const check =
        getDate(
            el("anakCheckDate")?.value
        );


    const age =
        calculateAge(
            birth,
            check
        );


    const target =
        el("anakAgeText");


    if (!target) {

        return;

    }


    if (!age) {

        target.textContent =
            "—";

        return;

    }


    target.textContent =
        `${age.years} tahun ` +
        `${age.months} bulan ` +
        `${age.days} hari`;

}



/* =========================================================
   BMI
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


    const meter =
        height / 100;


    return (
        weight /
        (
            meter *
            meter
        )
    );

}



/* =========================================================
   BMI AKTUAL
========================================================= */

function interpretBMI(
    bmi
) {

    if (
        !Number.isFinite(bmi)
    ) {

        return {
            label:
                "Tidak tersedia",
            className:
                "neutral"
        };

    }


    /*
     * Hanya indikator deskriptif.
     *
     * BUKAN cutoff status gizi anak.
     */

    if (
        bmi < 14
    ) {

        return {
            label:
                "Rendah",
            className:
                "low"
        };

    }


    if (
        bmi <= 18.5
    ) {

        return {
            label:
                "Normal",
            className:
                "normal"
        };

    }


    return {
        label:
            "Tinggi",
        className:
            "high"
    };

}



/* =========================================================
   Z-SCORE DENGAN INTERPOLASI REFERENSI
========================================================= */

/*
 * Penting:
 *
 * Fungsi ini membutuhkan database LMS.
 *
 * Jika database WHO belum tersedia,
 * kita TIDAK mengarang Z-score.
 *
 * Sebaliknya hasil ditampilkan
 * "Data WHO belum tersedia".
 */


function zScoreFromLMS(
    measurement,
    L,
    M,
    S
) {

    if (
        !Number.isFinite(
            measurement
        )
    ) {

        return null;

    }


    if (
        !Number.isFinite(L) ||
        !Number.isFinite(M) ||
        !Number.isFinite(S)
    ) {

        return null;

    }


    if (
        measurement <= 0 ||
        M <= 0 ||
        S <= 0
    ) {

        return null;

    }


    let z;


    if (
        Math.abs(L) > 0.000001
    ) {

        z =
            (
                Math.pow(
                    measurement / M,
                    L
                )
                -
                1
            )
            /
            (
                L * S
            );

    }

    else {

        z =
            Math.log(
                measurement / M
            )
            /
            S;

    }


    return z;

}



/* =========================================================
   DATABASE PLACEHOLDER
========================================================= */

/*
 * Jangan memasukkan angka palsu.
 *
 * Struktur database:
 *
 * WHO_DB.male.bmiForAge[bulan]
 * WHO_DB.female.bmiForAge[bulan]
 *
 * dst.
 *
 * Saat database resmi dimasukkan,
 * fungsi Z-score akan langsung menggunakannya.
 */

const WHO_DB = {

    male: {

        weightForAge: {},

        heightForAge: {},

        bmiForAge: {},

        weightForHeight: {},

        weightForLength: {}

    },


    female: {

        weightForAge: {},

        heightForAge: {},

        bmiForAge: {},

        weightForHeight: {},

        weightForLength: {}

    }

};



/* =========================================================
   LOOKUP WHO
========================================================= */

function getWHO(
    sex,
    indicator,
    ageMonths
) {

    if (
        !WHO_DB[sex]
    ) {

        return null;

    }


    const table =
        WHO_DB[sex][indicator];


    if (!table) {

        return null;

    }


    /*
     * Gunakan completed month.
     */

    const month =
        Math.floor(
            ageMonths
        );


    return (
        table[month] ||
        null
    );

}



/* =========================================================
   CALCULATE INDICATOR
========================================================= */

function calculateIndicator(
    sex,
    indicator,
    ageMonths,
    measurement
) {

    const row =
        getWHO(
            sex,
            indicator,
            ageMonths
        );


    if (!row) {

        return null;

    }


    const z =
        zScoreFromLMS(
            measurement,
            row.L,
            row.M,
            row.S
        );


    if (
        !Number.isFinite(z)
    ) {

        return null;

    }


    return {

        zScore: z,

        L: row.L,

        M: row.M,

        S: row.S

    };

}



/* =========================================================
   STATUS BB/U
========================================================= */

function classifyWeightAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {
            label:
                "Data WHO belum tersedia",
            className:
                "neutral"
        };

    }


    if (
        z < -3
    ) {

        return {
            label:
                "Berat badan sangat kurang",
            className:
                "very-low"
        };

    }


    if (
        z < -2
    ) {

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

function classifyHeightAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {
            label:
                "Data WHO belum tersedia",
            className:
                "neutral"
        };

    }


    if (
        z < -3
    ) {

        return {
            label:
                "Sangat pendek",
            className:
                "very-low"
        };

    }


    if (
        z < -2
    ) {

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
   STATUS IMT/U
========================================================= */

function classifyBMIForAge(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {
            label:
                "Data WHO belum tersedia",
            className:
                "neutral"
        };

    }


    if (
        z < -3
    ) {

        return {
            label:
                "Sangat kurus",
            className:
                "very-low"
        };

    }


    if (
        z < -2
    ) {

        return {
            label:
                "Kurus",
            className:
                "low"
        };

    }


    if (
        z <= 1
    ) {

        return {
            label:
                "Normal",
            className:
                "normal"
        };

    }


    if (
        z <= 2
    ) {

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
            "very-high"
    };

}



/* =========================================================
   STATUS BB/TB
========================================================= */

function classifyWeightHeight(
    z
) {

    if (
        !Number.isFinite(z)
    ) {

        return {
            label:
                "Data WHO belum tersedia",
            className:
                "neutral"
        };

    }


    if (
        z < -3
    ) {

        return {
            label:
                "Gizi buruk",
            className:
                "very-low"
        };

    }


    if (
        z < -2
    ) {

        return {
            label:
                "Gizi kurang",
            className:
                "low"
        };

    }


    if (
        z <= 1
    ) {

        return {
            label:
                "Gizi baik",
            className:
                "normal"
        };

    }


    if (
        z <= 2
    ) {

        return {
            label:
                "Risiko gizi lebih",
            className:
                "high"
        };

    }


    if (
        z <= 3
    ) {

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
   MAKRO
========================================================= */

function calculateEnergy(
    age,
    weight,
    gender
) {

    if (
        !age ||
        !Number.isFinite(weight)
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
            weight *
            (
                gender === "male"
                    ? 45
                    : 40
            );

    }


    return Math.round(
        kcal
    );

}



function calculateMacros(
    calories
) {

    if (
        !Number.isFinite(
            calories
        )
    ) {

        return null;

    }


    return {

        protein:
            calories * .15 / 4,

        carbohydrate:
            calories * .55 / 4,

        fat:
            calories * .30 / 9

    };

}



/* =========================================================
   FORMAT
========================================================= */

function fmt(
    value,
    digits = 2
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return "—";

    }


    return Number(
        value
    )
    .toFixed(digits)
    .replace(".", ",");

}



/* =========================================================
   HASIL CARD
========================================================= */

function card(
    title,
    subtitle,
    result,
    classification
) {

    const z =
        result?.zScore;


    return `

        <div class="anak-zscore-card">

            <span class="anak-zscore-subtitle">
                ${subtitle}
            </span>

            <h3>
                ${title}
            </h3>

            <div class="anak-zscore-value">

                <strong>
                    ${
                        Number.isFinite(z)
                            ? fmt(z,2) + " SD"
                            : "—"
                    }
                </strong>

            </div>

            <div class="
                anak-zscore-status
                ${classification.className}
            ">

                ${classification.label}

            </div>

        </div>

    `;

}



/* =========================================================
   HITUNG
========================================================= */

function calculateChildNutrition() {

    console.log(
        "TOMBOL HITUNG STATUS GIZI DIKLIK"
    );


    const result =
        el("anakResult");


    if (!result) {

        console.error(
            "anakResult tidak ditemukan"
        );

        return;

    }


    const gender =
        el("anakGender")?.value;


    const birth =
        getDate(
            el("anakBirthDate")?.value
        );


    const check =
        getDate(
            el("anakCheckDate")?.value
        );


    const weight =
        num(
            el("anakWeight")?.value
        );


    const height =
        num(
            el("anakHeight")?.value
        );


    if (
        !gender ||
        !birth ||
        !check ||
        !Number.isFinite(weight) ||
        !Number.isFinite(height)
    ) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Data belum lengkap
                </strong>

                <p>
                    Lengkapi seluruh data anak
                    sebelum menghitung.
                </p>

            </div>

        `;

        return;

    }


    if (
        check < birth
    ) {

        result.innerHTML = `

            <div class="anak-error">

                ⚠️

                <strong>
                    Tanggal pemeriksaan tidak valid
                </strong>

            </div>

        `;

        return;

    }


    const age =
        calculateAge(
            birth,
            check
        );


    const bmi =
        calculateBMI(
            weight,
            height
        );


    updateAge();


    console.log(
        "DATA:",
        {
            gender,
            age,
            weight,
            height,
            bmi
        }
    );


    /*
     * Untuk sementara kita TIDAK
     * mengeluarkan Z-score palsu.
     */

    const weightAge =
        calculateIndicator(
            gender,
            "weightForAge",
            age.ageMonths,
            weight
        );


    const heightAge =
        calculateIndicator(
            gender,
            "heightForAge",
            age.ageMonths,
            height
        );


    const bmiAge =
        calculateIndicator(
            gender,
            "bmiForAge",
            age.ageMonths,
            bmi
        );


    const weightHeight =
        age.years < 5

            ? calculateIndicator(
                gender,
                "weightForHeight",
                age.ageMonths,
                weight
            )

            : null;


    const weightClass =
        classifyWeightAge(
            weightAge?.zScore
        );


    const heightClass =
        classifyHeightAge(
            heightAge?.zScore
        );


    const bmiClass =
        classifyBMIForAge(
            bmiAge?.zScore
        );


    const weightHeightClass =
        classifyWeightHeight(
            weightHeight?.zScore
        );


    const calories =
        calculateEnergy(
            age,
            weight,
            gender
        );


    const macros =
        calculateMacros(
            calories
        );


    let html = `

        <div class="anak-result-header">

            <span class="anak-label">
                HASIL PENILAIAN PERTUMBUHAN
            </span>

            <h2>
                Referensi Pertumbuhan WHO
            </h2>

        </div>


        <div class="anak-summary-grid">

            <div>

                <span>
                    Usia
                </span>

                <strong>
                    ${age.years} th
                    ${age.months} bl
                    ${age.days} hr
                </strong>

            </div>


            <div>

                <span>
                    Berat
                </span>

                <strong>
                    ${fmt(weight,1)} kg
                </strong>

            </div>


            <div>

                <span>
                    TB/PB
                </span>

                <strong>
                    ${fmt(height,1)} cm
                </strong>

            </div>


            <div>

                <span>
                    IMT
                </span>

                <strong>
                    ${fmt(bmi,2)}
                </strong>

            </div>

        </div>


        <div class="anak-zscore-grid">

    `;


    /*
     * BB/U
     */

    if (
        age.years <= 10
    ) {

        html +=
            card(
                "BB menurut Umur",
                "BB/U",
                weightAge,
                weightClass
            );

    }


    /*
     * TB/U
     */

    html +=
        card(
            "TB/PB menurut Umur",
            "TB/PB/U",
            heightAge,
            heightClass
        );


    /*
     * BB/TB
     */

    if (
        age.years < 5
    ) {

        html +=
            card(
                "BB menurut TB/PB",
                "BB/TB atau BB/PB",
                weightHeight,
                weightHeightClass
            );

    }


    /*
     * IMT/U
     */

    html +=
        card(
            "IMT menurut Umur",
            "IMT/U",
            bmiAge,
            bmiClass
        );


    html += `

        </div>

        <div class="anak-result-block">

            <div class="anak-label">
                IMT AKTUAL
            </div>

            <div class="anak-bmi-result">

                <div class="anak-bmi-number">

                    <span>
                        Indeks Massa Tubuh
                    </span>

                    <strong>
                        ${fmt(bmi,2)}
                        kg/m²
                    </strong>

                </div>

                <div class="
                    anak-bmi-category
                    ${
                        interpretBMI(bmi).className
                    }
                ">

                    <span>
                        Indikator IMT aktual
                    </span>

                    <strong>
                        ${
                            interpretBMI(bmi).label
                        }
                    </strong>

                </div>

                <p class="anak-bmi-note">

                    Indikator ini hanya informasi
                    tambahan. Status gizi anak
                    ditentukan menggunakan IMT
                    menurut umur.

                </p>

            </div>

        </div>

    `;


    /*
     * MAKRO
     */

    if (
        macros
    ) {

        html += `

            <div class="anak-macro-section">

                <div class="anak-label">
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
                            ${fmt(
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
                            ${fmt(
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
                            ${fmt(
                                macros.fat,
                                1
                            )} g
                        </strong>

                        <small>
                            /hari
                        </small>

                    </div>

                </div>

            </div>

        `;

    }


    /*
     * CATATAN DATABASE
     */

    if (
        !weightAge ||
        !heightAge ||
        !bmiAge
    ) {

        html += `

            <div class="anak-result-note">

                <strong>
                    Z-score
                </strong>

                <p>
                    Data antropometri berhasil
                    dihitung, tetapi tabel LMS WHO
                    belum dimasukkan ke database lokal.
                    Karena itu sistem sengaja tidak
                    menampilkan angka Z-score yang
                    dibuat-buat.
                </p>

                <p>
                    WHO menyediakan tabel resmi
                    Z-score/LMS untuk setiap indikator
                    dan kelompok umur.
                </p>

            </div>

        `;

    }


    result.innerHTML =
        html;


    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });


    console.log(
        "PERHITUNGAN SELESAI"
    );

}



/* =========================================================
   EVENT
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
        el("anakResult")
    );


    const button =
        el(
            "anakCalculateButton"
        );


    if (
        !button
    ) {

        console.error(
            "TOMBOL TIDAK DITEMUKAN"
        );

        return;

    }


    button.addEventListener(
        "click",
        calculateChildNutrition
    );


    const birth =
        el("anakBirthDate");


    const check =
        el("anakCheckDate");


    if (
        birth
    ) {

        birth.addEventListener(
            "change",
            updateAge
        );

    }


    if (
        check
    ) {

        check.addEventListener(
            "change",
            updateAge
        );

    }


    /*
     * Default tanggal pemeriksaan
     */

    if (
        check &&
        !check.value
    ) {

        const today =
            new Date();


        const y =
            today.getFullYear();


        const m =
            String(
                today.getMonth() + 1
            ).padStart(2,"0");


        const d =
            String(
                today.getDate()
            ).padStart(2,"0");


        check.value =
            `${y}-${m}-${d}`;

    }


    updateAge();


    console.log(
        "Event tombol berhasil dipasang."
    );

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
   PUBLIC
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;
