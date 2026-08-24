/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR GIZI ANAK
   =========================================================

   INDIKATOR:
   - BB/U  : Berat Badan menurut Umur
   - TB/U  : Tinggi/Panjang Badan menurut Umur
   - IMT/U  : Indeks Massa Tubuh menurut Umur

   RENTANG:
   - 0–60 bulan  : WHO Child Growth Standards 2006
   - 61–228 bulan: WHO Growth Reference 2007

   CATATAN:
   Hasil di bawah merupakan alat edukasi dan skrining,
   bukan diagnosis medis.
   ========================================================= */


/* =========================================================
   HELPER
========================================================= */

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) {
        return null;
    }

    const value = parseFloat(element.value);

    return Number.isFinite(value) ? value : null;
}


/* =========================================================
   FORMAT ANGKA
========================================================= */

function formatNumber(value, decimal = 1) {

    if (!Number.isFinite(value)) {
        return "-";
    }

    return value.toFixed(decimal);
}


/* =========================================================
   HITUNG IMT
========================================================= */

function calculateChildBMI(weight, height) {

    if (
        !Number.isFinite(weight) ||
        !Number.isFinite(height) ||
        height <= 0
    ) {
        return null;
    }

    const heightMeter = height / 100;

    return weight / (heightMeter * heightMeter);
}


/* =========================================================
   KLASIFIKASI SEDERHANA
   ---------------------------------------------------------
   Fungsi ini digunakan sebagai fallback apabila data LMS
   WHO belum tersedia untuk usia tertentu.

   JANGAN gunakan batas BMI dewasa pada anak.
========================================================= */

function fallbackBMIClassification(ageMonths, bmi) {

    if (!Number.isFinite(bmi)) {

        return {
            title: "Tidak dapat dinilai",
            className: "status-warning",
            description:
                "Nilai IMT tidak dapat dihitung dari data yang diberikan."
        };

    }


    /*
       Untuk anak dan remaja, interpretasi sebenarnya harus
       menggunakan IMT menurut umur (IMT/U), jenis kelamin,
       dan z-score WHO.

       Karena itu fallback hanya memberi peringatan bahwa
       hasil harus dikonfirmasi menggunakan kurva pertumbuhan.
    */

    return {

        title: "Perlu interpretasi IMT/U",

        className: "status-info",

        description:
            "IMT anak harus dinilai menurut umur dan jenis kelamin menggunakan kurva pertumbuhan WHO. Nilai IMT saja tidak cukup untuk menentukan status gizi."
    };
}


/* =========================================================
   KLASIFIKASI TINGGI BADAN
========================================================= */

function fallbackHeightClassification(ageMonths, height) {

    if (!Number.isFinite(height)) {

        return {

            title: "Tidak dapat dinilai",

            className: "status-warning",

            description:
                "Tinggi atau panjang badan belum dapat dinilai."
        };

    }


    return {

        title: "Perlu interpretasi TB/U",

        className: "status-info",

        description:
            "Tinggi/panjang badan harus dibandingkan dengan umur dan jenis kelamin menggunakan standar TB/U WHO untuk menentukan apakah terdapat gangguan pertumbuhan linear."
    };
}


/* =========================================================
   KLASIFIKASI BERAT BADAN
========================================================= */

function fallbackWeightClassification(ageMonths, weight) {

    if (!Number.isFinite(weight)) {

        return {

            title: "Tidak dapat dinilai",

            className: "status-warning",

            description:
                "Berat badan belum dapat dinilai."
        };

    }


    return {

        title: "Perlu interpretasi BB/U",

        className: "status-info",

        description:
            "Berat badan harus dibandingkan dengan umur dan jenis kelamin menggunakan standar BB/U WHO."
    };
}


/* =========================================================
   STATUS UMUR
========================================================= */

function getAgeCategory(ageMonths) {

    if (ageMonths < 0) {

        return "Umur tidak valid";

    }

    if (ageMonths <= 60) {

        return "Anak usia 0–5 tahun";

    }

    if (ageMonths <= 228) {

        return "Anak dan remaja usia 5–19 tahun";

    }

    return "Di luar rentang kalkulator anak";

}


/* =========================================================
   VALIDASI DATA
========================================================= */

function validateChildData() {

    const genderElement =
        document.getElementById("childGender");

    const ageElement =
        document.getElementById("childAge");

    const ageUnitElement =
        document.getElementById("childAgeUnit");

    const weightElement =
        document.getElementById("childWeight");

    const heightElement =
        document.getElementById("childHeight");

    const result =
        document.getElementById("childNutritionResult");


    if (
        !genderElement ||
        !ageElement ||
        !ageUnitElement ||
        !weightElement ||
        !heightElement ||
        !result
    ) {

        console.error(
            "Elemen kalkulator gizi anak tidak ditemukan."
        );

        return null;
    }


    const age =
        parseFloat(ageElement.value);

    const weight =
        parseFloat(weightElement.value);

    const height =
        parseFloat(heightElement.value);


    if (
        !Number.isFinite(age) ||
        !Number.isFinite(weight) ||
        !Number.isFinite(height) ||
        age < 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        showChildError(
            "Silakan masukkan umur, berat badan dan tinggi/panjang badan dengan benar."
        );

        return null;
    }


    let ageMonths;


    if (ageUnitElement.value === "years") {

        ageMonths = age * 12;

    }

    else {

        ageMonths = age;

    }


    if (ageMonths > 228) {

        showChildError(
            "Kalkulator ini digunakan untuk anak dan remaja sampai usia 19 tahun."
        );

        return null;
    }


    if (height > 250) {

        showChildError(
            "Tinggi/panjang badan tampaknya tidak valid."
        );

        return null;
    }


    if (weight > 250) {

        showChildError(
            "Berat badan tampaknya tidak valid."
        );

        return null;
    }


    return {

        gender:
            genderElement.value,

        age:
            age,

        ageMonths:
            ageMonths,

        weight:
            weight,

        height:
            height,

        result:
            result

    };

}


/* =========================================================
   ERROR
========================================================= */

function showChildError(message) {

    const result =
        document.getElementById("childNutritionResult");

    if (!result) {
        return;
    }


    result.className =
        "kal-result child-result result-error";


    result.innerHTML = `

        <div class="result-title">
            PERHATIAN
        </div>

        <p>
            ${message}
        </p>

    `;


    result.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


/* =========================================================
   NAMA JENIS KELAMIN
========================================================= */

function getGenderText(gender) {

    if (gender === "male") {

        return "Laki-laki";

    }

    return "Perempuan";

}


/* =========================================================
   INDIKATOR YANG DIGUNAKAN
========================================================= */

function getIndicators(ageMonths) {

    if (ageMonths <= 60) {

        return {

            weightAge: true,

            heightAge: true,

            bmiAge: true,

            weightHeight: true

        };

    }


    if (ageMonths <= 120) {

        return {

            weightAge: true,

            heightAge: true,

            bmiAge: true,

            weightHeight: false

        };

    }


    return {

        weightAge: false,

        heightAge: true,

        bmiAge: true,

        weightHeight: false

    };

}


/* =========================================================
   LABEL INDIKATOR
========================================================= */

function getIndicatorLabel(indicator) {

    const labels = {

        "BB/U":
            "Berat Badan menurut Umur",

        "TB/U":
            "Tinggi Badan menurut Umur",

        "PB/U":
            "Panjang Badan menurut Umur",

        "IMT/U":
            "Indeks Massa Tubuh menurut Umur",

        "BB/TB":
            "Berat Badan menurut Tinggi Badan",

        "BB/PB":
            "Berat Badan menurut Panjang Badan"

    };


    return labels[indicator] || indicator;

}


/* =========================================================
   STATUS GIZI
========================================================= */

function getStatusExplanation(status) {

    const explanations = {

        "normal":
            "Pertumbuhan berada dalam rentang yang sesuai berdasarkan indikator yang dinilai.",

        "kurang":
            "Hasil menunjukkan kemungkinan masalah pertumbuhan atau status gizi kurang dan perlu dinilai lebih lanjut.",

        "sangat kurang":
            "Hasil menunjukkan kemungkinan masalah gizi yang berat. Diperlukan penilaian tenaga kesehatan.",

        "pendek":
            "Tinggi atau panjang badan menurut umur berada di bawah rentang yang diharapkan dan dapat menunjukkan gangguan pertumbuhan linear.",

        "sangat pendek":
            "Tinggi atau panjang badan menurut umur berada jauh di bawah rentang yang diharapkan dan memerlukan evaluasi lebih lanjut.",

        "berat badan berlebih":
            "Berat badan relatif tinggi dibandingkan umur. Penilaian sebaiknya dilengkapi dengan indikator IMT/U atau BB/TB.",

        "gemuk":
            "IMT menurut umur berada di atas rentang yang diharapkan.",

        "obesitas":
            "IMT menurut umur berada jauh di atas rentang yang diharapkan.",

        "kurus":
            "IMT menurut umur atau BB/TB menunjukkan kemungkinan masalah kekurusan.",

        "sangat kurus":
            "IMT menurut umur atau BB/TB menunjukkan kemungkinan kekurusan berat.",

        "perlu interpretasi":
            "Hasil membutuhkan interpretasi menggunakan tabel atau kurva pertumbuhan WHO berdasarkan umur dan jenis kelamin."

    };


    return explanations[status] ||
        explanations["perlu interpretasi"];

}


/* =========================================================
   KARTU HASIL
========================================================= */

function createIndicatorCard(
    indicator,
    value,
    status,
    className
) {

    return `

        <div class="child-indicator-card">

            <div class="child-indicator-header">

                <span class="child-indicator-code">
                    ${indicator}
                </span>

                <span class="child-indicator-status ${className}">
                    ${status}
                </span>

            </div>

            <strong>
                ${getIndicatorLabel(indicator)}
            </strong>

            <div class="child-indicator-value">
                ${value}
            </div>

            <p>
                ${getStatusExplanation(status)}
            </p>

        </div>

    `;

}


/* =========================================================
   HASIL UTAMA
========================================================= */

function calculateChildNutrition() {

    const data =
        validateChildData();


    if (!data) {
        return;
    }


    const {

        gender,
        age,
        ageMonths,
        weight,
        height,
        result

    } = data;


    const bmi =
        calculateChildBMI(
            weight,
            height
        );


    const ageCategory =
        getAgeCategory(ageMonths);


    const indicators =
        getIndicators(ageMonths);


    const weightStatus =
        fallbackWeightClassification(
            ageMonths,
            weight
        );


    const heightStatus =
        fallbackHeightClassification(
            ageMonths,
            height
        );


    const bmiStatus =
        fallbackBMIClassification(
            ageMonths,
            bmi
        );


    let html = `

        <div class="child-result-header">

            <div>

                <span class="result-title">
                    HASIL PENILAIAN GIZI ANAK
                </span>

                <h3>
                    ${getGenderText(gender)}
                </h3>

                <p>
                    ${formatAge(ageMonths)}
                    ·
                    ${ageCategory}
                </p>

            </div>

        </div>


        <div class="child-summary-grid">

            <div>

                <span>
                    Berat badan
                </span>

                <strong>
                    ${formatNumber(weight)} kg
                </strong>

            </div>


            <div>

                <span>
                    Tinggi/panjang
                </span>

                <strong>
                    ${formatNumber(height)} cm
                </strong>

            </div>


            <div>

                <span>
                    IMT
                </span>

                <strong>
                    ${formatNumber(bmi)}
                </strong>

            </div>

        </div>


        <div class="child-indicators">

    `;


    /*
       BB/U
    */

    if (indicators.weightAge) {

        html += createIndicatorCard(

            "BB/U",

            `${formatNumber(weight)} kg`,

            weightStatus.title,

            weightStatus.className

        );

    }


    /*
       TB/U atau PB/U
    */

    const heightIndicator =
        ageMonths < 24
            ? "PB/U"
            : "TB/U";


    html += createIndicatorCard(

        heightIndicator,

        `${formatNumber(height)} cm`,

        heightStatus.title,

        heightStatus.className

    );


    /*
       IMT/U
    */

    html += createIndicatorCard(

        "IMT/U",

        `${formatNumber(bmi)} kg/m²`,

        bmiStatus.title,

        bmiStatus.className

    );


    html += `

        </div>


        <div class="child-main-note">

            <span aria-hidden="true">
                💡
            </span>

            <div>

                <strong>
                    Interpretasi klinis
                </strong>

                <p>
                    Status gizi anak tidak ditentukan hanya dari
                    berat badan atau IMT absolut. Penilaian harus
                    mempertimbangkan umur, jenis kelamin dan
                    indikator antropometri menggunakan standar
                    pertumbuhan yang sesuai.
                </p>

            </div>

        </div>


        <div class="child-warning">

            <span aria-hidden="true">
                ⚠️
            </span>

            <div>

                <strong>
                    Penting
                </strong>

                <p>
                    Hasil kalkulator merupakan skrining awal
                    dan bukan diagnosis. Bila terdapat gangguan
                    pertumbuhan, berat badan sangat kurang,
                    pendek, kurus, overweight atau obesitas,
                    lakukan penilaian lebih lanjut oleh tenaga
                    kesehatan.
                </p>

            </div>

        </div>

    `;


    result.className =
        "kal-result child-result result-success";


    result.innerHTML =
        html;


    result.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


/* =========================================================
   FORMAT UMUR
========================================================= */

function formatAge(ageMonths) {

    const months =
        Math.round(ageMonths);


    if (months < 12) {

        return `${months} bulan`;

    }


    const years =
        Math.floor(months / 12);


    const remainingMonths =
        months % 12;


    if (remainingMonths === 0) {

        return `${years} tahun`;

    }


    return `${years} tahun ${remainingMonths} bulan`;

}


/* =========================================================
   UPDATE LABEL UMUR
========================================================= */

function updateChildAgeLabel() {

    const unit =
        document.getElementById("childAgeUnit");

    const ageInput =
        document.getElementById("childAge");

    const ageHint =
        document.getElementById("childAgeHint");


    if (!unit) {
        return;
    }


    if (unit.value === "months") {

        if (ageInput) {

            ageInput.placeholder =
                "Contoh: 36";

            ageInput.max = "228";

        }


        if (ageHint) {

            ageHint.textContent =
                "Masukkan umur dalam bulan.";

        }

    }

    else {

        if (ageInput) {

            ageInput.placeholder =
                "Contoh: 5";

            ageInput.max = "19";

        }


        if (ageHint) {

            ageHint.textContent =
                "Masukkan umur dalam tahun.";

        }

    }

}


/* =========================================================
   UPDATE LABEL TINGGI
========================================================= */

function updateHeightLabel() {

    const unit =
        document.getElementById("childAgeUnit");

    const heightLabel =
        document.getElementById("childHeightLabel");

    const heightHint =
        document.getElementById("childHeightHint");


    if (!unit) {
        return;
    }


    const age =
        getNumber("childAge");


    let ageMonths;


    if (age === null) {

        ageMonths = 0;

    }

    else if (unit.value === "years") {

        ageMonths = age * 12;

    }

    else {

        ageMonths = age;

    }


    if (heightLabel) {

        if (ageMonths < 24) {

            heightLabel.textContent =
                "Panjang badan";

        }

        else {

            heightLabel.textContent =
                "Tinggi badan";

        }

    }


    if (heightHint) {

        if (ageMonths < 24) {

            heightHint.textContent =
                "Untuk anak <24 bulan, gunakan panjang badan telentang bila tersedia.";

        }

        else {

            heightHint.textContent =
                "Untuk anak ≥24 bulan, gunakan tinggi badan berdiri.";

        }

    }

}


/* =========================================================
   AUTO UPDATE
========================================================= */

function initializeChildNutritionCalculator() {

    const ageUnit =
        document.getElementById("childAgeUnit");

    const ageInput =
        document.getElementById("childAge");

    if (ageUnit) {

        ageUnit.addEventListener(
            "change",
            function () {

                updateChildAgeLabel();

                updateHeightLabel();

            }
        );

    }


    if (ageInput) {

        ageInput.addEventListener(
            "input",
            function () {

                updateHeightLabel();

            }
        );

    }


    updateChildAgeLabel();

    updateHeightLabel();

}


/* =========================================================
   ENTER KEY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeChildNutritionCalculator();


        const inputs =
            document.querySelectorAll(
                "#gizi-anak input"
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

        });

    }
);
