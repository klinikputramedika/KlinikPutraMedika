/*
=========================================================
GIZI ANAK - KLINIK PUTRA MEDIKA
=========================================================

Fungsi:

1. Menghitung usia secara akurat
2. Menghitung IMT
3. Validasi antropometri
4. Menyiapkan perhitungan Z-score WHO
5. Menampilkan status indikator
6. Menampilkan kebutuhan energi dan makronutrien
7. Tidak menggunakan inline onclick
8. Tidak membuat fungsi global yang bertabrakan
=========================================================
*/

(function () {

    "use strict";


    /*
    =====================================================
    KONSTANTA
    =====================================================
    */

    const MAX_AGE_MONTHS = 228;


    /*
    =====================================================
    ELEMENT
    =====================================================
    */

    let genderInput;
    let birthInput;
    let checkInput;
    let weightInput;
    let heightInput;

    let ageText;
    let resultBox;
    let calculateButton;


    /*
    =====================================================
    INITIALIZATION
    =====================================================
    */

    document.addEventListener("DOMContentLoaded", init);


    function init() {

        console.log("======================================");
        console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
        console.log("======================================");


        genderInput = document.getElementById("anakGender");
        birthInput = document.getElementById("anakBirthDate");
        checkInput = document.getElementById("anakCheckDate");
        weightInput = document.getElementById("anakWeight");
        heightInput = document.getElementById("anakHeight");

        ageText = document.getElementById("anakAgeText");
        resultBox = document.getElementById("anakResult");
        calculateButton = document.getElementById(
            "anakCalculateButton"
        );


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
            resultBox
        );


        if (!calculateButton) {

            console.error(
                "Tombol hitung tidak ditemukan."
            );

            return;
        }


        calculateButton.addEventListener(
            "click",
            calculateNutrition
        );


        /*
        ================================================
        EVENT TANGGAL
        ================================================
        */

        if (birthInput) {

            birthInput.addEventListener(
                "change",
                updateAge
            );

        }


        if (checkInput) {

            checkInput.addEventListener(
                "change",
                updateAge
            );

        }


        /*
        ================================================
        TANGGAL DEFAULT
        ================================================
        */

        setDefaultCheckDate();


        console.log(
            "Event tombol berhasil dipasang."
        );

    }


    /*
    =====================================================
    DEFAULT TANGGAL PEMERIKSAAN
    =====================================================
    */

    function setDefaultCheckDate() {

        if (!checkInput) {
            return;
        }

        if (!checkInput.value) {

            const today = new Date();

            checkInput.value =
                formatDateForInput(today);

        }

    }


    /*
    =====================================================
    FORMAT DATE
    =====================================================
    */

    function formatDateForInput(date) {

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


    /*
    =====================================================
    PARSE DATE
    =====================================================
    */

    function parseInputDate(value) {

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
            Number(parts[1]) - 1;

        const day =
            Number(parts[2]);

        const date =
            new Date(
                year,
                month,
                day
            );

        /*
        Validasi agar tanggal seperti
        2026-02-31 tidak diterima.
        */

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day
        ) {

            return null;

        }

        return date;

    }


    /*
    =====================================================
    UPDATE AGE
    =====================================================
    */

    function updateAge() {

        if (
            !birthInput ||
            !checkInput ||
            !ageText
        ) {
            return;
        }


        const birthDate =
            parseInputDate(
                birthInput.value
            );

        const checkDate =
            parseInputDate(
                checkInput.value
            );


        /*
        Jangan menghitung kalau
        tanggal belum lengkap.
        */

        if (
            !birthDate ||
            !checkDate
        ) {

            ageText.textContent = "—";

            return;

        }


        /*
        Tanggal pemeriksaan tidak boleh
        sebelum tanggal lahir.
        */

        if (checkDate < birthDate) {

            ageText.textContent =
                "Tanggal tidak valid";

            return;

        }


        const age =
            calculateAge(
                birthDate,
                checkDate
            );


        if (!age) {

            ageText.textContent = "—";

            return;

        }


        ageText.textContent =
            `${age.years} tahun ` +
            `${age.months} bulan ` +
            `${age.days} hari`;


        console.log(
            "USIA:",
            `${age.years} tahun ` +
            `${age.months} bulan ` +
            `${age.days} hari`
        );

    }


    /*
    =====================================================
    CALCULATE AGE
    =====================================================
    */

    function calculateAge(
        birthDate,
        checkDate
    ) {

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


        return {
            years,
            months,
            days,
            totalMonths:
                years * 12 + months
        };

    }


    /*
    =====================================================
    GET TOTAL AGE IN MONTHS
    =====================================================
    */

    function getAgeMonths(
        birthDate,
        checkDate
    ) {

        const age =
            calculateAge(
                birthDate,
                checkDate
            );

        if (!age) {
            return null;
        }


        /*
        WHO menggunakan completed months
        untuk banyak perhitungan antropometri.
        */

        return age.totalMonths;

    }


    /*
    =====================================================
    MAIN CALCULATION
    =====================================================
    */

    function calculateNutrition() {

        console.log(
            "TOMBOL HITUNG STATUS GIZI DIKLIK"
        );


        const gender =
            genderInput.value;


        const birthDate =
            parseInputDate(
                birthInput.value
            );


        const checkDate =
            parseInputDate(
                checkInput.value
            );


        const weight =
            Number(
                weightInput.value
            );


        const height =
            Number(
                heightInput.value
            );


        /*
        ================================================
        VALIDATION
        ================================================
        */

        if (!birthDate) {

            showError(
                "Tanggal lahir belum diisi."
            );

            return;

        }


        if (!checkDate) {

            showError(
                "Tanggal pemeriksaan belum diisi."
            );

            return;

        }


        if (checkDate < birthDate) {

            showError(
                "Tanggal pemeriksaan tidak boleh lebih awal daripada tanggal lahir."
            );

            return;

        }


        if (
            !weight ||
            weight <= 0
        ) {

            showError(
                "Masukkan berat badan yang valid."
            );

            return;

        }


        if (
            !height ||
            height <= 0
        ) {

            showError(
                "Masukkan tinggi/panjang badan yang valid."
            );

            return;

        }


        /*
        ================================================
        AGE
        ================================================
        */

        const age =
            calculateAge(
                birthDate,
                checkDate
            );


        const ageMonths =
            getAgeMonths(
                birthDate,
                checkDate
            );


        if (
            ageMonths === null ||
            ageMonths < 0
        ) {

            showError(
                "Usia anak tidak valid."
            );

            return;

        }


        /*
        WHO sampai 19 tahun
        ================================================
        */

        if (
            ageMonths > MAX_AGE_MONTHS
        ) {

            showError(
                "Kalkulator ini menggunakan standar pertumbuhan WHO sampai usia 19 tahun."
            );

            return;

        }


        /*
        ================================================
        BMI
        ================================================
        */

        const heightMeter =
            height / 100;


        const bmi =
            weight /
            (
                heightMeter *
                heightMeter
            );


        /*
        ================================================
        DATA
        ================================================
        */

        const data = {

            gender,

            birthDate,

            checkDate,

            age,

            ageMonths,

            weight,

            height,

            bmi

        };


        console.log(
            "DATA:",
            data
        );


        /*
        ================================================
        WHO ENGINE
        ================================================
        */

        const zScores =
            calculateWHOZScores(
                data
            );


        /*
        ================================================
        MACRO
        ================================================
        */

        const macros =
            calculateMacros(
                data
            );


        /*
        ================================================
        RENDER
        ================================================
        */

        renderResult(
            data,
            zScores,
            macros
        );


        console.log(
            "PERHITUNGAN SELESAI"
        );

    }


    /*
    =====================================================
    WHO Z-SCORE ENGINE
    =====================================================
    */

    function calculateWHOZScores(data) {

        const result = {

            weightForAge: null,

            heightForAge: null,

            bmiForAge: null,

            weightForHeight: null

        };


        /*
        ================================================
        CEK DATA WHO
        ================================================
        */

        if (
            !window.WHO_ANTHRO ||
            !window.WHO_ANTHRO.ready
        ) {

            console.warn(
                "Data WHO belum tersedia."
            );

            return result;

        }


        /*
        ================================================
        0-60 BULAN
        ================================================
        */

        if (
            data.ageMonths <= 60
        ) {

            result.weightForAge =
                lookupWHO(
                    "under5",
                    "weightForAge",
                    data
                );


            result.heightForAge =
                lookupWHO(
                    "under5",
                    "heightForAge",
                    data
                );


            result.bmiForAge =
                lookupWHO(
                    "under5",
                    "bmiForAge",
                    data
                );


            result.weightForHeight =
                lookupWHO(
                    "under5",
                    "weightForLengthHeight",
                    data
                );

        }


        /*
        ================================================
        5-19 TAHUN
        ================================================
        */

        else {

            result.heightForAge =
                lookupWHO(
                    "age5to19",
                    "heightForAge",
                    data
                );


            result.bmiForAge =
                lookupWHO(
                    "age5to19",
                    "bmiForAge",
                    data
                );


            /*
            BB/U WHO 2007 hanya sampai
            usia 10 tahun
            */

            if (
                data.ageMonths <= 120
            ) {

                result.weightForAge =
                    lookupWHO(
                        "age5to19",
                        "weightForAge",
                        data
                    );

            }

        }


        console.log(
            "Z-SCORE",
            result
        );


        return result;

    }


    /*
    =====================================================
    WHO LOOKUP
    =====================================================
    */

    function lookupWHO(
        standard,
        indicator,
        data
    ) {

        const database =
            window.WHO_ANTHRO?.[
                standard
            ]?.[
                indicator
            ];


        if (!database) {
            return null;
        }


        const sex =
            data.gender;


        const sexData =
            database?.[sex];


        if (!sexData) {
            return null;
        }


        /*
        Saat data WHO asli dimasukkan,
        fungsi ini akan mengambil nilai
        sesuai umur/tinggi.
        */

        return null;

    }


    /*
    =====================================================
    MACRONUTRIENT
    =====================================================
    */

    function calculateMacros(data) {

        /*
        Catatan:

        Makronutrien di sini merupakan
        estimasi edukasi, bukan resep diet
        individual.

        Untuk anak, kebutuhan energi dan
        zat gizi harus mempertimbangkan
        umur, jenis kelamin, pertumbuhan,
        aktivitas dan kondisi klinis.
        */


        let energy;


        if (data.ageMonths < 12) {

            energy =
                80 *
                data.weight;

        }

        else if (
            data.ageMonths < 36
        ) {

            energy =
                75 *
                data.weight;

        }

        else if (
            data.ageMonths < 60
        ) {

            energy =
                70 *
                data.weight;

        }

        else if (
            data.ageMonths < 120
        ) {

            energy =
                60 *
                data.weight;

        }

        else {

            energy =
                45 *
                data.weight;

        }


        /*
        Protein minimum estimasi
        */

        let protein;


        if (
            data.ageMonths < 36
        ) {

            protein =
                data.weight * 1.2;

        }

        else if (
            data.ageMonths < 120
        ) {

            protein =
                data.weight * 1.0;

        }

        else {

            protein =
                data.weight * 0.9;

        }


        protein =
            Math.round(
                protein
            );


        /*
        Lemak sekitar 30%
        */

        const fat =
            Math.round(
                (
                    energy *
                    0.30
                ) / 9
            );


        /*
        Karbohidrat sisa energi
        */

        const carbohydrateCalories =
            energy -
            (
                protein * 4
            ) -
            (
                fat * 9
            );


        const carbohydrate =
            Math.max(
                0,
                Math.round(
                    carbohydrateCalories / 4
                )
            );


        return {

            energy:
                Math.round(
                    energy
                ),

            protein,

            carbohydrate,

            fat

        };

    }


    /*
    =====================================================
    STATUS Z-SCORE
    =====================================================
    */

    function interpretZScore(
        z,
        type
    ) {

        if (
            z === null ||
            typeof z !== "number"
        ) {

            return {

                label:
                    "Data WHO belum tersedia",

                className:
                    "neutral"

            };

        }


        /*
        ================================================
        TB/U
        ================================================
        */

        if (
            type === "heightForAge"
        ) {

            if (z < -3) {

                return {
                    label:
                        "Sangat pendek (severely stunted)",
                    className:
                        "danger"
                };

            }

            if (z < -2) {

                return {
                    label:
                        "Pendek (stunted)",
                    className:
                        "warning"
                };

            }

            if (z <= 3) {

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


        /*
        ================================================
        IMT/U
        ================================================
        */

        if (
            type === "bmiForAge"
        ) {

            if (z < -3) {

                return {
                    label:
                        "Gizi buruk / severe wasting",
                    className:
                        "danger"
                };

            }

            if (z < -2) {

                return {
                    label:
                        "Gizi kurang / wasting",
                    className:
                        "warning"
                };

            }

            if (z <= 1) {

                return {
                    label:
                        "Gizi baik / normal",
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
                        "Gizi lebih / overweight",
                    className:
                        "high"
                };

            }

            return {
                label:
                    "Obesitas",
                className:
                    "danger"
            };

        }


        /*
        ================================================
        DEFAULT
        ================================================
        */

        return {

            label:
                "Data tersedia",

            className:
                "normal"

        };

    }


    /*
    =====================================================
    RENDER RESULT
    =====================================================
    */

    function renderResult(
        data,
        zScores,
        macros
    ) {

        if (!resultBox) {
            return;
        }


        const heightStatus =
            interpretZScore(
                zScores.heightForAge,
                "heightForAge"
            );


        const bmiStatus =
            interpretZScore(
                zScores.bmiForAge,
                "bmiForAge"
            );


        resultBox.innerHTML = `

            <div class="anak-result-header">

                <div>

                    <span class="anak-label">
                        HASIL PEMERIKSAAN
                    </span>

                    <h3>
                        Penilaian Pertumbuhan Anak
                    </h3>

                </div>

                <div class="anak-result-age">

                    ${data.age.years}
                    tahun
                    ${data.age.months}
                    bulan

                </div>

            </div>


            <div class="anak-result-grid">


                <div class="anak-result-item">

                    <span>
                        Berat badan
                    </span>

                    <strong>
                        ${formatNumber(data.weight)}
                        kg
                    </strong>

                </div>


                <div class="anak-result-item">

                    <span>
                        Tinggi / panjang badan
                    </span>

                    <strong>
                        ${formatNumber(data.height)}
                        cm
                    </strong>

                </div>


                <div class="anak-result-item">

                    <span>
                        IMT
                    </span>

                    <strong>
                        ${formatNumber(data.bmi)}
                        kg/m²
                    </strong>

                </div>

            </div>


            <div class="anak-zscore-section">

                <div class="anak-zscore-title">

                    <span>
                        📊
                    </span>

                    <h4>
                        Indikator Pertumbuhan
                    </h4>

                </div>


                ${createIndicator(
                    "BB menurut Umur (BB/U)",
                    zScores.weightForAge,
                    null
                )}


                ${createIndicator(
                    "TB/PB menurut Umur (TB/U)",
                    zScores.heightForAge,
                    heightStatus
                )}


                ${createIndicator(
                    "IMT menurut Umur (IMT/U)",
                    zScores.bmiForAge,
                    bmiStatus
                )}


                ${createIndicator(
                    "BB menurut TB/PB",
                    zScores.weightForHeight,
                    null
                )}

            </div>


            <div class="anak-macro-section">

                <div class="anak-zscore-title">

                    <span>
                        🍽️
                    </span>

                    <h4>
                        Estimasi Kebutuhan Makronutrien
                    </h4>

                </div>


                <div class="anak-macro-grid">


                    <div class="anak-macro-card">

                        <span>
                            Energi
                        </span>

                        <strong>
                            ${macros.energy}
                        </strong>

                        <small>
                            kkal/hari
                        </small>

                    </div>


                    <div class="anak-macro-card">

                        <span>
                            Protein
                        </span>

                        <strong>
                            ${macros.protein}
                        </strong>

                        <small>
                            g/hari
                        </small>

                    </div>


                    <div class="anak-macro-card">

                        <span>
                            Karbohidrat
                        </span>

                        <strong>
                            ${macros.carbohydrate}
                        </strong>

                        <small>
                            g/hari
                        </small>

                    </div>


                    <div class="anak-macro-card">

                        <span>
                            Lemak
                        </span>

                        <strong>
                            ${macros.fat}
                        </strong>

                        <small>
                            g/hari
                        </small>

                    </div>

                </div>

            </div>


            <div class="anak-result-note">

                <strong>
                    ⚠️ Catatan
                </strong>

                <p>
                    Z-score akan ditampilkan setelah
                    database WHO resmi tersedia pada
                    halaman ini. Jangan menggunakan
                    hasil perkiraan sebagai diagnosis.
                </p>

            </div>

        `;

    }


    /*
    =====================================================
    CREATE INDICATOR
    =====================================================
    */

    function createIndicator(
        name,
        z,
        status
    ) {

        const zText =
            typeof z === "number"
                ? z.toFixed(2)
                : "—";


        const statusText =
            status
                ? status.label
                : "Data WHO belum tersedia";


        return `

            <div class="anak-indicator-result">

                <div>

                    <strong>
                        ${name}
                    </strong>

                    <span>
                        Z-score:
                        <b>${zText}</b>
                    </span>

                </div>


                <div class="
                    anak-indicator-status
                    ${status?.className || "neutral"}
                ">

                    ${statusText}

                </div>

            </div>

        `;

    }


    /*
    =====================================================
    ERROR
    =====================================================
    */

    function showError(message) {

        if (!resultBox) {
            return;
        }


        resultBox.innerHTML = `

            <div class="anak-result-error">

                <span>
                    ⚠️
                </span>

                <div>

                    <strong>
                        Data belum dapat dihitung
                    </strong>

                    <p>
                        ${message}
                    </p>

                </div>

            </div>

        `;


        resultBox.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }


    /*
    =====================================================
    FORMAT NUMBER
    =====================================================
    */

    function formatNumber(number) {

        if (
            typeof number !== "number" ||
            !Number.isFinite(number)
        ) {

            return "—";

        }


        return number.toLocaleString(
            "id-ID",
            {
                maximumFractionDigits: 2
            }
        );

    }


})();
