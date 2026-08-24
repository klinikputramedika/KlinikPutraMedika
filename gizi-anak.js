/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR GIZI ANAK
   gizi-anak.js
   ========================================================= */

console.log("GIZI-ANAK.JS BERHASIL DIMUAT");


/* =========================================================
   HELPER
========================================================= */

function getElement(...ids) {
    for (const id of ids) {
        const el = document.getElementById(id);

        if (el) {
            return el;
        }
    }

    return null;
}


function showError(message) {

    const result = getElement(
        "anakResult",
        "anakNutritionResult",
        "giziAnakResult",
        "childResult",
        "resultAnak"
    );

    if (!result) {
        console.error("AREA HASIL TIDAK DITEMUKAN");
        return;
    }

    result.className = "anak-result anak-result-error";

    result.innerHTML = `
        <div class="anak-result-header">
            <span class="anak-result-icon">⚠️</span>

            <div>
                <strong>Data belum lengkap</strong>
                <small>Periksa kembali data yang dimasukkan.</small>
            </div>
        </div>

        <p class="anak-error-text">
            ${message}
        </p>
    `;

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


/* =========================================================
   HITUNG UMUR
========================================================= */

function calculateChildAge() {

    const birthDateInput = getElement(
        "anakBirthDate"
    );

    const checkDateInput = getElement(
        "anakCheckDate"
    );

    const ageText = getElement(
        "anakAgeText"
    );

    if (!birthDateInput || !checkDateInput) {
        console.error("Input tanggal tidak ditemukan.");
        return null;
    }

    if (!birthDateInput.value || !checkDateInput.value) {

        if (ageText) {
            ageText.textContent = "—";
        }

        return null;
    }

    const birthDate = new Date(
        birthDateInput.value + "T00:00:00"
    );

    const checkDate = new Date(
        checkDateInput.value + "T00:00:00"
    );

    if (
        isNaN(birthDate.getTime()) ||
        isNaN(checkDate.getTime())
    ) {
        return null;
    }

    if (checkDate < birthDate) {

        if (ageText) {
            ageText.textContent = "Tanggal tidak valid";
        }

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


    const totalMonths =
        years * 12 + months;


    const result = {
        years: years,
        months: months,
        days: days,
        totalMonths: totalMonths
    };


    if (ageText) {

        ageText.textContent =
            `${years} tahun ${months} bulan ${days} hari`;
    }


    console.log(
        "USIA:",
        `${years} tahun ${months} bulan ${days} hari`
    );


    return result;
}


/* =========================================================
   UPDATE UMUR OTOMATIS
========================================================= */

function updateChildAge() {
    calculateChildAge();
}


/* =========================================================
   KLASIFIKASI IMT ANAK
=========================================================

   CATATAN:

   Perhitungan z-score WHO membutuhkan tabel WHO
   berdasarkan usia dan jenis kelamin.

   Untuk tahap awal kalkulator:
   - IMT dihitung secara matematis.
   - Status pertumbuhan tidak disamakan dengan BMI dewasa.
   - Untuk penilaian klinis diperlukan kurva WHO/z-score.
========================================================= */


/* =========================================================
   HITUNG IMT
========================================================= */

function calculateBMIChild(weight, heightCm) {

    if (
        !weight ||
        !heightCm ||
        weight <= 0 ||
        heightCm <= 0
    ) {
        return null;
    }

    const heightM = heightCm / 100;

    const bmi =
        weight / (heightM * heightM);

    return bmi;
}


/* =========================================================
   STATUS BERDASARKAN IMT
=========================================================

   INI BUKAN KLASIFIKASI WHO UNTUK ANAK.

   Digunakan hanya sebagai informasi angka IMT.

   Status akhir harus menggunakan IMT/U WHO.
========================================================= */

function getBMIDescription(age, bmi) {

    if (age.totalMonths < 60) {

        return {
            title: "IMT perlu dinilai berdasarkan IMT menurut umur",
            description:
                "Pada anak usia di bawah 5 tahun, IMT tidak dinilai menggunakan batas BMI dewasa. Interpretasi harus menggunakan kurva pertumbuhan WHO berdasarkan umur dan jenis kelamin."
        };
    }


    if (age.years >= 5) {

        return {
            title: "IMT menurut umur",
            description:
                "Untuk anak usia 5–19 tahun, status gizi berdasarkan IMT harus ditentukan menggunakan IMT menurut umur (IMT/U) dan nilai Z-score WHO sesuai jenis kelamin."
        };
    }


    return {
        title: "IMT anak",
        description:
            "Interpretasi IMT anak membutuhkan pembandingan dengan standar pertumbuhan berdasarkan umur dan jenis kelamin."
    };
}


/* =========================================================
   RENDER HASIL
========================================================= */

function renderChildResult(
    age,
    gender,
    weight,
    height,
    bmi
) {

    const result = getElement(
        "anakResult",
        "anakNutritionResult",
        "giziAnakResult",
        "childResult",
        "resultAnak"
    );


    if (!result) {

        console.error(
            "Area hasil tidak ditemukan."
        );

        return;
    }


    const genderText =
        gender === "male"
            ? "Laki-laki"
            : "Perempuan";


    const bmiInfo =
        getBMIDescription(age, bmi);


    let ageGroup = "";


    if (age.totalMonths < 60) {

        ageGroup =
            "0–<5 tahun — WHO Child Growth Standards";

    } else {

        ageGroup =
            "5–19 tahun — WHO Growth Reference 2007";
    }


    result.className =
        "anak-result anak-result-success";


    result.innerHTML = `

        <div class="anak-result-header">

            <span class="anak-result-icon">
                📊
            </span>

            <div>

                <strong>
                    HASIL PENILAIAN ANTROPOMETRI
                </strong>

                <small>
                    Berdasarkan data pemeriksaan
                </small>

            </div>

        </div>


        <div class="anak-result-summary">

            <div class="anak-result-main">

                <span class="anak-result-label">
                    IMT
                </span>

                <strong class="anak-bmi-number">
                    ${bmi.toFixed(1)}
                </strong>

                <small>
                    kg/m²
                </small>

            </div>


            <div class="anak-result-age">

                <span>
                    Usia saat pemeriksaan
                </span>

                <strong>
                    ${age.years} tahun
                    ${age.months} bulan
                    ${age.days} hari
                </strong>

            </div>

        </div>


        <div class="anak-data-grid">

            <div class="anak-data-box">

                <span>
                    Jenis kelamin
                </span>

                <strong>
                    ${genderText}
                </strong>

            </div>


            <div class="anak-data-box">

                <span>
                    Berat badan
                </span>

                <strong>
                    ${weight.toFixed(1)} kg
                </strong>

            </div>


            <div class="anak-data-box">

                <span>
                    Tinggi badan
                </span>

                <strong>
                    ${height.toFixed(1)} cm
                </strong>

            </div>


            <div class="anak-data-box">

                <span>
                    Kelompok usia
                </span>

                <strong>
                    ${ageGroup}
                </strong>

            </div>

        </div>


        <div class="anak-status-box">

            <div class="anak-status-title">
                STATUS IMT
            </div>

            <strong>
                ${bmiInfo.title}
            </strong>

            <p>
                ${bmiInfo.description}
            </p>

        </div>


        <div class="anak-result-note">

            <span>ℹ️</span>

            <p>
                Nilai IMT anak tidak boleh langsung
                dibandingkan dengan batas BMI dewasa.
                Status gizi anak harus ditentukan
                berdasarkan indikator antropometri
                menurut umur dan jenis kelamin.
            </p>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


/* =========================================================
   FUNGSI UTAMA KALKULATOR
========================================================= */

function calculateChildNutrition() {

    console.log(
        "TOMBOL STATUS GIZI DIKLIK"
    );


    /* -----------------------------------------
       UMUR
    ----------------------------------------- */

    const age = calculateChildAge();


    if (!age) {

        showError(
            "Silakan masukkan tanggal lahir dan tanggal pemeriksaan."
        );

        return;
    }


    /* -----------------------------------------
       JENIS KELAMIN
    ----------------------------------------- */

    const genderInput = getElement(
        "anakGender",
        "genderAnak",
        "childGender"
    );


    if (!genderInput) {

        showError(
            "Input jenis kelamin tidak ditemukan."
        );

        return;
    }


    const gender =
        genderInput.value;


    /* -----------------------------------------
       BERAT
    ----------------------------------------- */

    const weightInput = getElement(
        "anakWeight",
        "anakBerat",
        "childWeight",
        "weightAnak"
    );


    /* -----------------------------------------
       TINGGI
    ----------------------------------------- */

    const heightInput = getElement(
        "anakHeight",
        "anakTinggi",
        "childHeight",
        "heightAnak"
    );


    if (!weightInput || !heightInput) {

        showError(
            "Input berat badan atau tinggi badan tidak ditemukan."
        );

        return;
    }


    const weight =
        parseFloat(weightInput.value);


    const height =
        parseFloat(heightInput.value);


    console.log(
        "Berat:",
        weight
    );


    console.log(
        "Tinggi:",
        height
    );


    if (
        isNaN(weight) ||
        weight <= 0
    ) {

        showError(
            "Masukkan berat badan yang valid."
        );

        return;
    }


    if (
        isNaN(height) ||
        height <= 0
    ) {

        showError(
            "Masukkan tinggi badan yang valid."
        );

        return;
    }


    /* -----------------------------------------
       IMT
    ----------------------------------------- */

    const bmi =
        calculateBMIChild(
            weight,
            height
        );


    if (!bmi) {

        showError(
            "IMT tidak dapat dihitung. Periksa kembali berat dan tinggi badan."
        );

        return;
    }


    console.log(
        "IMT:",
        bmi.toFixed(2)
    );


    /* -----------------------------------------
       RENDER
    ----------------------------------------- */

    renderChildResult(
        age,
        gender,
        weight,
        height,
        bmi
    );
}


/* =========================================================
   EVENT LISTENER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "DOM GIZI ANAK SIAP"
        );


        const birthDate =
            getElement("anakBirthDate");


        const checkDate =
            getElement("anakCheckDate");


        const calculateButton =
            getElement(
                "anakCalculateButton",
                "calculateChildButton",
                "btnCalculateChild"
            );


        console.log(
            "Tanggal lahir:",
            birthDate
        );


        console.log(
            "Tanggal pemeriksaan:",
            checkDate
        );


        console.log(
            "Elemen usia:",
            getElement("anakAgeText")
        );


        console.log(
            "Tombol hitung:",
            calculateButton
        );


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


        /*
         * JIKA TOMBOL DITEMUKAN,
         * KITA PASANG EVENT LISTENER.
         */

        if (calculateButton) {

            calculateButton.addEventListener(
                "click",
                calculateChildNutrition
            );
        }


        /*
         * Hitung umur saat halaman dibuka
         */

        calculateChildAge();

    }
);


/* =========================================================
   BUAT FUNGSI TERSEDIA SECARA GLOBAL
=========================================================

   Ini penting karena HTML kita mungkin masih
   memiliki:

   onclick="calculateChildNutrition()"

   sehingga fungsi harus tersedia pada window.
========================================================= */

window.calculateChildNutrition =
    calculateChildNutrition;


window.calculateChildAge =
    calculateChildAge;


window.updateChildAge =
    updateChildAge;


console.log(
    "FUNGSI calculateChildNutrition SIAP"
);
