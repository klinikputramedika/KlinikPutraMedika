/* =========================================================
   GIZI-ANAK.JS
   Klinik Putra Medika

   Engine tampilan dan perhitungan antropometri.
   Tidak menggunakan API / internet / WHO external loader.
========================================================= */

"use strict";


console.log("GIZI-ANAK.JS BERHASIL DIMUAT");


/* =========================================================
   ELEMENT
========================================================= */

const genderEl =
    document.getElementById("anakGender");

const birthEl =
    document.getElementById("anakBirthDate");

const checkEl =
    document.getElementById("anakCheckDate");

const weightEl =
    document.getElementById("anakWeight");

const heightEl =
    document.getElementById("anakHeight");

const measurementEl =
    document.getElementById("anakMeasurement");

const ageTextEl =
    document.getElementById("anakAgeText");

const calculateBtn =
    document.getElementById(
        "anakCalculateButton"
    );

const summaryEl =
    document.getElementById(
        "anakSummary"
    );

const indicatorsEl =
    document.getElementById(
        "anakIndicators"
    );

const bmiEl =
    document.getElementById(
        "anakBMI"
    );

const conclusionEl =
    document.getElementById(
        "anakConclusion"
    );


/* =========================================================
   DATE
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

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


/* =========================================================
   AGE
========================================================= */

function calculateAge(
    birth,
    check
) {

    let years =
        check.getFullYear() -
        birth.getFullYear();

    let months =
        check.getMonth() -
        birth.getMonth();

    let days =
        check.getDate() -
        birth.getDate();


    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                check.getFullYear(),
                check.getMonth(),
                0
            );

        days +=
            previousMonth.getDate();

    }


    if (months < 0) {

        years--;

        months += 12;

    }


    if (years < 0) {
        return null;
    }


    return {

        years,

        months,

        days,

        totalMonths:
            years * 12 +
            months +
            days / 30.4375

    };

}


/* =========================================================
   DISPLAY AGE
========================================================= */

function updateAge() {

    const birth =
        parseDate(
            birthEl.value
        );

    const check =
        parseDate(
            checkEl.value
        );


    if (!birth || !check) {

        ageTextEl.textContent =
            "—";

        return null;

    }


    if (check < birth) {

        ageTextEl.textContent =
            "Tanggal tidak valid";

        return null;

    }


    const age =
        calculateAge(
            birth,
            check
        );


    ageTextEl.textContent =
        `${age.years} tahun ` +
        `${age.months} bulan ` +
        `${age.days} hari`;


    return age;

}


/* =========================================================
   EVENTS AGE
========================================================= */

birthEl.addEventListener(
    "change",
    updateAge
);

checkEl.addEventListener(
    "change",
    updateAge
);


/* =========================================================
   BMI
========================================================= */

function calculateBMI(
    weight,
    height
) {

    const meter =
        height / 100;

    if (
        !weight ||
        !height ||
        meter <= 0
    ) {

        return null;

    }

    return (
        weight /
        (meter * meter)
    );

}


/* =========================================================
   HEIGHT METHOD
========================================================= */

function determineMeasurement(
    age,
    selected
) {

    if (
        selected === "lying"
    ) {

        return "PB";

    }

    if (
        selected === "standing"
    ) {

        return "TB";

    }


    /*
     * Kemenkes:
     * 0–24 bulan -> PB
     * >24 bulan -> TB
     */

    if (
        age.totalMonths <= 24
    ) {

        return "PB";

    }

    return "TB";

}


/* =========================================================
   CORRECTION
========================================================= */

function correctedHeight(
    height,
    age,
    selected
) {

    const method =
        determineMeasurement(
            age,
            selected
        );


    if (
        selected === "auto"
    ) {

        return {

            value: height,

            method

        };

    }


    /*
     * 0–24 bulan seharusnya PB.
     * Jika diukur berdiri:
     * tambahkan 0,7 cm.
     */

    if (
        age.totalMonths <= 24 &&
        selected === "standing"
    ) {

        return {

            value:
                height + 0.7,

            method: "PB"

        };

    }


    /*
     * >24 bulan seharusnya TB.
     * Jika diukur terlentang:
     * kurangi 0,7 cm.
     */

    if (
        age.totalMonths > 24 &&
        selected === "lying"
    ) {

        return {

            value:
                height - 0.7,

            method: "TB"

        };

    }


    return {

        value: height,

        method

    };

}


/* =========================================================
   Z SCORE
========================================================= */

function calculateZ(
    value,
    lms
) {

    if (!lms) {
        return null;
    }

    const L =
        Number(lms.L);

    const M =
        Number(lms.M);

    const S =
        Number(lms.S);


    if (
        !Number.isFinite(L) ||
        !Number.isFinite(M) ||
        !Number.isFinite(S) ||
        M <= 0 ||
        S <= 0 ||
        value <= 0
    ) {

        return null;

    }


    if (
        Math.abs(L) < 0.000001
    ) {

        return (
            Math.log(value / M) /
            S
        );

    }


    return (
        (
            Math.pow(
                value / M,
                L
            ) - 1
        ) /
        (L * S)
    );

}


/* =========================================================
   FIND LMS
========================================================= */

function findLMS(
    sex,
    indicator,
    ageMonths
) {

    if (
        !window.KEMENKES_ANTHRO_DATA
    ) {

        return null;

    }


    const sexData =
        window.KEMENKES_ANTHRO_DATA[
            sex
        ];


    if (!sexData) {
        return null;
    }


    const table =
        sexData[indicator];


    if (
        !Array.isArray(table) ||
        !table.length
    ) {

        return null;

    }


    let nearest =
        table[0];

    let difference =
        Math.abs(
            Number(nearest.age) -
            ageMonths
        );


    for (
        let i = 1;
        i < table.length;
        i++
    ) {

        const current =
            table[i];

        const currentDifference =
            Math.abs(
                Number(current.age) -
                ageMonths
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


    return nearest;

}


/* =========================================================
   CLASSIFICATION
========================================================= */

function classify(
    indicator,
    z
) {

    if (
        z === null ||
        !Number.isFinite(z)
    ) {

        return {

            label:
                "Data referensi belum tersedia",

            type:
                "info"

        };

    }


    /*
     * BB/U
     */

    if (
        indicator ===
        "weightForAge"
    ) {

        if (z < -3) {

            return {
                label:
                    "Berat Badan Sangat Kurang",
                type:
                    "danger"
            };

        }

        if (z < -2) {

            return {
                label:
                    "Berat Badan Kurang",
                type:
                    "warning"
            };

        }

        if (z <= 1) {

            return {
                label:
                    "Berat Badan Normal",
                type:
                    "info"
            };

        }

        return {
            label:
                "Risiko Berat Badan Lebih",
            type:
                "warning"
        };

    }


    /*
     * TB/U
     */

    if (
        indicator ===
        "heightForAge"
    ) {

        if (z < -3) {

            return {
                label:
                    "Sangat Pendek",
                type:
                    "danger"
            };

        }

        if (z < -2) {

            return {
                label:
                    "Pendek",
                type:
                    "warning"
            };

        }

        if (z <= 3) {

            return {
                label:
                    "Normal",
                type:
                    "info"
            };

        }

        return {
            label:
                "Tinggi",
            type:
                "info"
        };

    }


    /*
     * BB/PB atau BB/TB
     */

    if (
        indicator ===
        "weightForHeight"
    ) {

        if (z < -3) {

            return {
                label:
                    "Gizi Buruk",
                type:
                    "danger"
            };

        }

        if (z < -2) {

            return {
                label:
                    "Gizi Kurang",
                type:
                    "warning"
            };

        }

        if (z <= 1) {

            return {
                label:
                    "Gizi Baik",
                type:
                    "info"
            };

        }

        if (z <= 2) {

            return {
                label:
                    "Risiko Gizi Lebih",
                type:
                    "warning"
            };

        }

        if (z <= 3) {

            return {
                label:
                    "Gizi Lebih",
                type:
                    "warning"
            };

        }

        return {
            label:
                "Obesitas",
            type:
                "danger"
        };

    }


    /*
     * IMT/U
     */

    if (
        indicator ===
        "bmiForAge"
    ) {

        if (z < -3) {

            return {
                label:
                    "Gizi Buruk",
                type:
                    "danger"
            };

        }

        if (z < -2) {

            return {
                label:
                    "Gizi Kurang",
                type:
                    "warning"
            };

        }

        if (z <= 1) {

            return {
                label:
                    "Gizi Baik",
                type:
                    "info"
            };

        }

        if (z <= 2) {

            return {
                label:
                    "Risiko Gizi Lebih",
                type:
                    "warning"
            };

        }

        if (z <= 3) {

            return {
                label:
                    "Gizi Lebih",
                type:
                    "warning"
            };

        }

        return {
            label:
                "Obesitas",
            type:
                "danger"
        };

    }


    return {

        label:
            "Tidak tersedia",

        type:
            "info"

    };

}


/* =========================================================
   FORMAT Z
========================================================= */

function formatZ(z) {

    if (
        z === null ||
        !Number.isFinite(z)
    ) {

        return "—";

    }

    return (
        z >= 0
            ? "+" + z.toFixed(2)
            : z.toFixed(2)
    );

}


/* =========================================================
   RESULT CARD
========================================================= */

function createIndicator(
    title,
    subtitle,
    z,
    status
) {

    return `

        <div class="anak-indicator-result">

            <h3>
                ${title}
            </h3>

            <div class="indicator-name">
                ${subtitle}
            </div>

            <div class="zscore">
                ${formatZ(z)}
            </div>

            <span class="status ${status.type}">
                ${status.label}
            </span>

        </div>

    `;

}


/* =========================================================
   CALCULATE
========================================================= */

function calculateChildNutrition() {

    const gender =
        genderEl.value;

    const weight =
        Number(
            weightEl.value
        );

    const height =
        Number(
            heightEl.value
        );


    const age =
        updateAge();


    if (!gender) {

        alert(
            "Silakan pilih jenis kelamin."
        );

        return;

    }


    if (!age) {

        alert(
            "Silakan isi tanggal lahir dan tanggal pemeriksaan."
        );

        return;

    }


    if (
        !weight ||
        weight <= 0
    ) {

        alert(
            "Masukkan berat badan yang valid."
        );

        return;

    }


    if (
        !height ||
        height <= 0
    ) {

        alert(
            "Masukkan panjang/tinggi badan yang valid."
        );

        return;

    }


    const measurement =
        correctedHeight(
            height,
            age,
            measurementEl.value
        );


    const finalHeight =
        measurement.value;


    const bmi =
        calculateBMI(
            weight,
            finalHeight
        );


    const ageMonths =
        age.totalMonths;


    /*
     * =====================================================
     * LMS
     * =====================================================
     */

    const wfaLMS =
        findLMS(
            gender,
            "weightForAge",
            ageMonths
        );


    const hfaLMS =
        findLMS(
            gender,
            "heightForAge",
            ageMonths
        );


    const wfhLMS =
        findLMS(
            gender,
            "weightForHeight",
            finalHeight
        );


    const bmiLMS =
        findLMS(
            gender,
            "bmiForAge",
            ageMonths
        );


    /*
     * Z-SCORE
     */

    const wfaZ =
        calculateZ(
            weight,
            wfaLMS
        );


    const hfaZ =
        calculateZ(
            finalHeight,
            hfaLMS
        );


    const wfhZ =
        calculateZ(
            weight,
            wfhLMS
        );


    const bmiZ =
        calculateZ(
            bmi,
            bmiLMS
        );


    /*
     * STATUS
     */

    const wfaStatus =
        classify(
            "weightForAge",
            wfaZ
        );


    const hfaStatus =
        classify(
            "heightForAge",
            hfaZ
        );


    const wfhStatus =
        classify(
            "weightForHeight",
            wfhZ
        );


    const bmiStatus =
        classify(
            "bmiForAge",
            bmiZ
        );


    /*
     * SUMMARY
     */

    summaryEl.innerHTML = `

        <div class="anak-summary-item">

            <span>
                Usia
            </span>

            <strong>
                ${age.years} tahun
                ${age.months} bulan
                ${age.days} hari
            </strong>

        </div>


        <div class="anak-summary-item">

            <span>
                Berat badan
            </span>

            <strong>
                ${weight.toFixed(1)} kg
            </strong>

        </div>


        <div class="anak-summary-item">

            <span>
                ${measurement.method}
            </span>

            <strong>
                ${finalHeight.toFixed(1)} cm
            </strong>

        </div>

    `;


    /*
     * INDICATORS
     */

    indicatorsEl.innerHTML = `

        ${createIndicator(
            "BB/U",
            "Berat Badan menurut Umur",
            wfaZ,
            wfaStatus
        )}

        ${createIndicator(
            measurement.method === "PB"
                ? "PB/U"
                : "TB/U",
            measurement.method === "PB"
                ? "Panjang Badan menurut Umur"
                : "Tinggi Badan menurut Umur",
            hfaZ,
            hfaStatus
        )}

        ${createIndicator(
            measurement.method === "PB"
                ? "BB/PB"
                : "BB/TB",
            measurement.method === "PB"
                ? "Berat Badan menurut Panjang Badan"
                : "Berat Badan menurut Tinggi Badan",
            wfhZ,
            wfhStatus
        )}

        ${createIndicator(
            "IMT/U",
            "Indeks Massa Tubuh menurut Umur",
            bmiZ,
            bmiStatus
        )}

    `;


    /*
     * BMI
     */

    bmiEl.innerHTML = `

        <div class="bmi-box">

            <strong>
                Indeks Massa Tubuh
            </strong>

            <div class="bmi-value">
                ${bmi.toFixed(2)} kg/m²
            </div>

            <small>
                Status IMT/U:
                ${bmiStatus.label}
            </small>

        </div>

    `;


    /*
     * CONCLUSION
     */

    conclusionEl.innerHTML = `

        <div class="conclusion-box">

            <h3>
                Interpretasi
            </h3>

            <p>
                Hasil harus diinterpretasikan berdasarkan
                umur, jenis kelamin, dan indikator antropometri.
                Jangan menentukan status gizi hanya dari satu
                parameter.
            </p>

        </div>

    `;


    /*
     * SCROLL
     */

    document
        .getElementById(
            "hasil-gizi"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   BUTTON
========================================================= */

calculateBtn.addEventListener(
    "click",
    calculateChildNutrition
);


/* =========================================================
   DEFAULT DATE
========================================================= */

(function () {

    const today =
        new Date();

    const iso =
        today
            .toISOString()
            .split("T")[0];


    checkEl.value =
        iso;

})();


console.log(
    "Event kalkulator gizi anak siap."
);
