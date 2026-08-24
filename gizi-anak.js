/* =========================================================
   GIZI ANAK
   Klinik Putra Medika
   ========================================================= */

"use strict";

console.log("======================================");
console.log("GIZI-ANAK.JS BERHASIL DIMUAT");
console.log("======================================");


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const birth =
            document.getElementById("anakBirthDate");

        const check =
            document.getElementById("anakCheckDate");

        const gender =
            document.getElementById("anakGender");

        const weight =
            document.getElementById("anakWeight");

        const height =
            document.getElementById("anakHeight");

        const ageText =
            document.getElementById("anakAgeText");

        const button =
            document.getElementById(
                "anakCalculateButton"
            );

        const result =
            document.getElementById("anakResult");


        if (
            !birth ||
            !check ||
            !gender ||
            !weight ||
            !height ||
            !ageText ||
            !button ||
            !result
        ) {

            console.error(
                "Elemen kalkulator tidak lengkap."
            );

            return;

        }


        /* =================================================
           DEFAULT CHECK DATE
           ================================================= */

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


        check.value =
            `${yyyy}-${mm}-${dd}`;


        /* =================================================
           DATE PARSER
           ================================================= */

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


        /* =================================================
           AGE CALCULATOR
           ================================================= */

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


            if (
                years < 0 ||
                (
                    years === 0 &&
                    months === 0 &&
                    days === 0
                )
            ) {

                return null;

            }


            const diffMs =
                checkDate.getTime() -
                birthDate.getTime();

            const ageDays =
                Math.floor(
                    diffMs /
                    86400000
                );


            return {
                years,
                months,
                days,
                ageDays,
                ageMonths:
                    ageDays / 30.4375
            };

        }


        /* =================================================
           DISPLAY AGE
           ================================================= */

        function updateAge() {

            const dob =
                parseDate(
                    birth.value
                );

            const exam =
                parseDate(
                    check.value
                );


            if (!dob || !exam) {

                ageText.textContent =
                    "—";

                return null;

            }


            if (exam < dob) {

                ageText.textContent =
                    "Tanggal tidak valid";

                return null;

            }


            const age =
                calculateAge(
                    dob,
                    exam
                );


            if (!age) {

                ageText.textContent =
                    "Tidak valid";

                return null;

            }


            ageText.textContent =
                `${age.years} tahun ` +
                `${age.months} bulan ` +
                `${age.days} hari`;


            return age;

        }


        birth.addEventListener(
            "change",
            updateAge
        );

        check.addEventListener(
            "change",
            updateAge
        );


        /* =================================================
           BMI
           ================================================= */

        function calculateBMI(
            weightKg,
            heightCm
        ) {

            const heightM =
                heightCm / 100;

            if (
                weightKg <= 0 ||
                heightM <= 0
            ) {
                return null;
            }

            return (
                weightKg /
                (heightM * heightM)
            );

        }


        /* =================================================
           WAIT WHO ENGINE
           ================================================= */

        function waitForWHO(
            timeout = 10000
        ) {

            return new Promise(
                function (resolve, reject) {

                    if (
                        window.WHO_ANTHRO_READY &&
                        window.WHO_ANTHRO
                    ) {

                        resolve(
                            window.WHO_ANTHRO
                        );

                        return;

                    }


                    let finished =
                        false;


                    const timer =
                        setTimeout(
                            function () {

                                if (finished) {
                                    return;
                                }

                                finished = true;

                                reject(
                                    new Error(
                                        "WHO Growth Engine belum berhasil dimuat."
                                    )
                                );

                            },
                            timeout
                        );


                    window.addEventListener(
                        "whoAnthroReady",
                        function () {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            clearTimeout(
                                timer
                            );

                            resolve(
                                window.WHO_ANTHRO
                            );

                        },
                        {
                            once: true
                        }
                    );


                    window.addEventListener(
                        "whoAnthroError",
                        function (event) {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            clearTimeout(
                                timer
                            );

                            reject(
                                event.detail ||
                                new Error(
                                    "WHO engine gagal."
                                )
                            );

                        },
                        {
                            once: true
                        }
                    );

                }
            );

        }


        /* =================================================
           WHO INDICATOR CALCULATOR
           ================================================= */

        async function calculateWHO(
            who,
            sex,
            ageDays,
            weightKg,
            heightCm
        ) {

            const bmi =
                calculateBMI(
                    weightKg,
                    heightCm
                );


            const dateAge =
                ageDays;


            const results = {};


            /*
             * BB/U
             */

            try {

                results.weightForAge =
                    await who.calculateZScore({

                        indicator:
                            "weight-for-age",

                        sex:
                            sex,

                        ageInDays:
                            dateAge,

                        measurement:
                            weightKg

                    });

            }
            catch (error) {

                console.warn(
                    "BB/U gagal:",
                    error
                );

                results.weightForAge =
                    null;

            }


            /*
             * TB/PB/U
             */

            try {

                results.heightForAge =
                    await who.calculateZScore({

                        indicator:
                            "length-height-for-age",

                        sex:
                            sex,

                        ageInDays:
                            dateAge,

                        measurement:
                            heightCm

                    });

            }
            catch (error) {

                try {

                    results.heightForAge =
                        await who.calculateZScore({

                            indicator:
                                "height-for-age",

                            sex:
                                sex,

                            ageInDays:
                                dateAge,

                            measurement:
                                heightCm

                        });

                }
                catch (secondError) {

                    console.warn(
                        "TB/PB/U gagal:",
                        secondError
                    );

                    results.heightForAge =
                        null;

                }

            }


            /*
             * IMT/U
             */

            try {

                results.bmiForAge =
                    await who.calculateZScore({

                        indicator:
                            "bmi-for-age",

                        sex:
                            sex,

                        ageInDays:
                            dateAge,

                        measurement:
                            bmi

                    });

            }
            catch (error) {

                console.warn(
                    "IMT/U gagal:",
                    error
                );

                results.bmiForAge =
                    null;

            }


            /*
             * BB/PB atau BB/TB
             *
             * Package dapat memilih indikator
             * sesuai usia.
             */

            try {

                const indicator =
                    ageDays <= 1856
                        ? "weight-for-height"
                        : null;


                if (indicator) {

                    results.weightForHeight =
                        await who.calculateZScore({

                            indicator:
                                indicator,

                            sex:
                                sex,

                            ageInDays:
                                dateAge,

                            measurement:
                                weightKg,

                            lengthHeight:
                                heightCm

                        });

                }
                else {

                    results.weightForHeight =
                        null;

                }

            }
            catch (error) {

                console.warn(
                    "BB/TB gagal:",
                    error
                );

                results.weightForHeight =
                    null;

            }


            return {
                bmi,
                results
            };

        }


        /* =================================================
           STATUS
           ================================================= */

        function fallbackStatus(
            indicator,
            z
        ) {

            if (
                z === null ||
                !Number.isFinite(z)
            ) {

                return {
                    label:
                        "Tidak dapat dinilai",
                    code:
                        "NA"
                };

            }


            if (
                indicator ===
                "heightForAge"
            ) {

                if (z < -3)
                    return {
                        label:
                            "Sangat pendek",
                        code:
                            "SEVERE_STUNTING"
                    };

                if (z < -2)
                    return {
                        label:
                            "Pendek",
                        code:
                            "STUNTING"
                    };

                return {
                    label:
                        "Normal",
                    code:
                        "NORMAL"
                };

            }


            if (
                indicator ===
                "weightForAge"
            ) {

                if (z < -3)
                    return {
                        label:
                            "Berat badan sangat kurang",
                        code:
                            "SEVERE_UNDERWEIGHT"
                    };

                if (z < -2)
                    return {
                        label:
                            "Berat badan kurang",
                        code:
                            "UNDERWEIGHT"
                    };

                return {
                    label:
                        "Berat badan normal",
                    code:
                        "NORMAL"
                };

            }


            if (
                indicator ===
                "weightForHeight"
            ) {

                if (z < -3)
                    return {
                        label:
                            "Sangat kurus",
                        code:
                            "SEVERE_WASTING"
                    };

                if (z < -2)
                    return {
                        label:
                            "Kurus",
                        code:
                            "WASTING"
                    };

                if (z > 3)
                    return {
                        label:
                            "Obesitas",
                        code:
                            "OBESITY"
                    };

                if (z > 2)
                    return {
                        label:
                            "Gemuk",
                        code:
                            "OVERWEIGHT"
                    };

                return {
                    label:
                        "Normal",
                    code:
                        "NORMAL"
                };

            }


            if (
                indicator ===
                "bmiForAge"
            ) {

                if (z < -3)
                    return {
                        label:
                            "Sangat kurus",
                        code:
                            "SEVERE_THINNESS"
                    };

                if (z < -2)
                    return {
                        label:
                            "Kurus",
                        code:
                            "THINNESS"
                    };

                if (z > 3)
                    return {
                        label:
                            "Obesitas",
                        code:
                            "OBESITY"
                    };

                if (z > 2)
                    return {
                        label:
                            "Gemuk",
                        code:
                            "OVERWEIGHT"
                    };

                if (z > 1)
                    return {
                        label:
                            "Berisiko gemuk",
                        code:
                            "RISK_OF_OVERWEIGHT"
                    };

                return {
                    label:
                        "Normal",
                    code:
                        "NORMAL"
                };

            }


            return {
                label:
                    "Tidak dapat dinilai",
                code:
                    "NA"
            };

        }


        /* =================================================
           RESULT CARD
           ================================================= */

        function makeCard(
            title,
            result,
            fallbackIndicator,
            note
        ) {

            if (!result) {

                return `
                    <div class="result-card">

                        <h4>${title}</h4>

                        <div class="result-z">
                            —
                        </div>

                        <div class="result-status">
                            Tidak tersedia
                        </div>

                        <div class="result-note">
                            ${note || ""}
                        </div>

                    </div>
                `;

            }


            const z =
                Number(
                    result.zScore ??
                    result.z ??
                    NaN
                );


            const status =
                result.classification ||
                result.status ||
                fallbackStatus(
                    fallbackIndicator,
                    z
                );


            const label =
                typeof status === "string"
                    ? status
                    : (
                        status.label ||
                        status.category ||
                        "Tidak dapat dinilai"
                    );


            return `
                <div class="result-card">

                    <h4>${title}</h4>

                    <div class="result-z">
                        ${
                            Number.isFinite(z)
                                ? z.toFixed(2)
                                : "—"
                        }
                    </div>

                    <div class="result-status">
                        ${label}
                    </div>

                    ${
                        note
                            ? `
                                <div class="result-note">
                                    ${note}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;

        }


        /* =================================================
           CALCULATE
           ================================================= */

        async function calculate() {

            const dob =
                parseDate(
                    birth.value
                );

            const exam =
                parseDate(
                    check.value
                );

            const weightKg =
                Number(
                    weight.value
                );

            const heightCm =
                Number(
                    height.value
                );

            const sex =
                gender.value;


            if (!dob || !exam) {

                showError(
                    "Tanggal lahir dan tanggal pemeriksaan harus diisi."
                );

                return;

            }


            if (exam < dob) {

                showError(
                    "Tanggal pemeriksaan tidak boleh lebih awal dari tanggal lahir."
                );

                return;

            }


            if (
                !Number.isFinite(weightKg) ||
                weightKg <= 0
            ) {

                showError(
                    "Masukkan berat badan yang valid."
                );

                return;

            }


            if (
                !Number.isFinite(heightCm) ||
                heightCm <= 0
            ) {

                showError(
                    "Masukkan panjang/tinggi badan yang valid."
                );

                return;

            }


            const age =
                calculateAge(
                    dob,
                    exam
                );


            if (!age) {

                showError(
                    "Usia anak tidak dapat dihitung."
                );

                return;

            }


            ageText.textContent =
                `${age.years} tahun ` +
                `${age.months} bulan ` +
                `${age.days} hari`;


            button.disabled =
                true;

            button.innerHTML =
                "Menghitung...";


            result.innerHTML = `
                <div class="anak-result-placeholder">
                    <span>⏳</span>
                    <div>
                        <strong>
                            Menghitung dengan standar WHO...
                        </strong>
                        <small>
                            Mohon tunggu.
                        </small>
                    </div>
                </div>
            `;


            try {

                const who =
                    await waitForWHO();


                const calculation =
                    await calculateWHO(
                        who,
                        sex,
                        age.ageDays,
                        weightKg,
                        heightCm
                    );


                renderResult(
                    age,
                    weightKg,
                    heightCm,
                    calculation
                );

            }
            catch (error) {

                console.error(
                    "PERHITUNGAN WHO GAGAL:",
                    error
                );


                showError(
                    "Mesin WHO belum dapat dimuat. " +
                    "Pastikan perangkat terhubung ke internet, " +
                    "kemudian refresh halaman."
                );

            }
            finally {

                button.disabled =
                    false;

                button.innerHTML =
                    `Hitung Status Gizi <span>→</span>`;

            }

        }


        /* =================================================
           RENDER RESULT
           ================================================= */

        function renderResult(
            age,
            weightKg,
            heightCm,
            data
        ) {

            const bmi =
                data.bmi;


            const r =
                data.results;


            const ageGroup =
                age.ageDays <= 1856
                    ? "WHO Child Growth Standards 0–5 tahun"
                    : "WHO Growth Reference 2007 5–19 tahun";


            result.innerHTML = `

                <div class="result-header">

                    <h3>
                        Hasil Penilaian Pertumbuhan
                    </h3>

                    <p>
                        ${ageGroup}
                    </p>

                </div>


                <div class="result-grid">

                    ${makeCard(
                        "BB menurut Umur",
                        r.weightForAge,
                        "weightForAge",
                        age.ageMonths > 120
                            ? "BB/U WHO digunakan sampai usia 10 tahun."
                            : ""
                    )}


                    ${makeCard(
                        "TB/PB menurut Umur",
                        r.heightForAge,
                        "heightForAge",
                        ""
                    )}


                    ${makeCard(
                        "BB menurut TB/PB",
                        r.weightForHeight,
                        "weightForHeight",
                        age.ageDays > 1856
                            ? "Indikator ini digunakan terutama pada anak <5 tahun."
                            : ""
                    )}


                    ${makeCard(
                        "IMT menurut Umur",
                        r.bmiForAge,
                        "bmiForAge",
                        ""
                    )}

                </div>


                <div class="result-summary">

                    <strong>
                        Data antropometri
                    </strong>

                    <p>
                        Usia:
                        ${age.years} tahun
                        ${age.months} bulan
                        ${age.days} hari
                        <br>

                        Berat:
                        ${weightKg.toFixed(1)} kg
                        <br>

                        Tinggi/Panjang:
                        ${heightCm.toFixed(1)} cm
                        <br>

                        IMT:
                        ${bmi.toFixed(2)} kg/m²
                    </p>

                </div>


                <div class="result-summary">

                    <strong>
                        Interpretasi
                    </strong>

                    <p>
                        Z-score harus dibaca bersama umur,
                        jenis kelamin dan indikator antropometri.
                        Hasil kalkulator bukan diagnosis medis.
                    </p>

                </div>

            `;

        }


        /* =================================================
           ERROR
           ================================================= */

        function showError(
            message
        ) {

            result.innerHTML = `
                <div class="anak-error">
                    <strong>
                        ⚠️ Data belum dapat dihitung
                    </strong>
                    <br><br>
                    ${message}
                </div>
            `;

        }


        /* =================================================
           BUTTON
           ================================================= */

        button.addEventListener(
            "click",
            calculate
        );


        updateAge();


        console.log(
            "Event kalkulator berhasil dipasang."
        );

    }
);
