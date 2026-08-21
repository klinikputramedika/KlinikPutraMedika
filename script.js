function calculateBMI() {

    const weight =
        Number(
            document.getElementById("weight").value
        );

    const height =
        Number(
            document.getElementById("height").value
        );

    const result =
        document.getElementById("bmiResult");


    // =========================
    // VALIDASI
    // =========================

    if (
        !weight ||
        !height ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className =
            "result result-error";

        result.innerHTML = `
            <strong>Data belum lengkap</strong>

            <p>
                Silakan masukkan berat dan tinggi
                badan yang valid.
            </p>
        `;

        return;
    }


    // =========================
    // HITUNG BMI
    // =========================

    const heightMeter =
        height / 100;

    const bmi =
        weight /
        (heightMeter * heightMeter);


    // =========================
    // KATEGORI BMI
    // =========================

    let category;
    let description;
    let resultClass;


    if (bmi < 18.5) {

        category = "Underweight";

        description =
            "BMI berada di bawah rentang berat badan sehat.";

        resultClass =
            "result-underweight";


    } else if (bmi < 25) {

        category = "Normal";

        description =
            "BMI berada dalam rentang berat badan sehat.";

        resultClass =
            "result-normal";


    } else if (bmi < 30) {

        category = "Overweight";

        description =
            "BMI berada pada kategori overweight.";

        resultClass =
            "result-overweight";


    } else if (bmi < 35) {

        category = "Obesity Class I";

        description =
            "BMI berada pada kategori obesitas kelas I.";

        resultClass =
            "result-obesity";


    } else if (bmi < 40) {

        category = "Obesity Class II";

        description =
            "BMI berada pada kategori obesitas kelas II.";

        resultClass =
            "result-obesity";


    } else {

        category = "Obesity Class III";

        description =
            "BMI berada pada kategori obesitas kelas III.";

        resultClass =
            "result-obesity";

    }


    // =========================
    // POSISI INDIKATOR
    // =========================

    let indicatorPosition;


    if (bmi < 18.5) {

        indicatorPosition = 10;

    } else if (bmi < 25) {

        indicatorPosition = 30;

    } else if (bmi < 30) {

        indicatorPosition = 50;

    } else if (bmi < 35) {

        indicatorPosition = 65;

    } else if (bmi < 40) {

        indicatorPosition = 80;

    } else {

        indicatorPosition = 95;

    }


    // =========================
    // TAMPILKAN HASIL
    // =========================

    result.className =
        `result ${resultClass}`;


    result.innerHTML = `

        <div class="result-title">
            HASIL BMI
        </div>


        <div class="bmi-number">
            ${bmi.toFixed(1)}
        </div>


        <div class="bmi-category">
            ${category}
        </div>


        <div class="result-details">

            <p>
                <strong>Berat badan:</strong>
                ${weight} kg
            </p>

            <p>
                <strong>Tinggi badan:</strong>
                ${height} cm
            </p>

        </div>


        <p class="result-description">
            ${description}
        </p>


        <div class="bmi-scale">

            <div class="scale-bar">

                <div
                    class="scale-indicator"
                    style="left: ${indicatorPosition}%"
                ></div>

            </div>


            <div class="scale-labels">

                <span>
                    < 18.5
                </span>

                <span>
                    18.5–24.9
                </span>

                <span>
                    25–29.9
                </span>

                <span>
                    30–34.9
                </span>

                <span>
                    35–39.9
                </span>

                <span>
                    ≥40
                </span>

            </div>

        </div>


        <div class="bmi-note">

            BMI merupakan alat skrining dan
            bukan diagnosis medis.

        </div>

    `;
}





function calculateTDEE() {

    const gender =
        document.getElementById("gender").value;

    const age =
        Number(
            document.getElementById("age").value
        );

    const weight =
        Number(
            document.getElementById("weightBMR").value
        );

    const height =
        Number(
            document.getElementById("heightBMR").value
        );

    const activity =
        Number(
            document.getElementById("activity").value
        );

    const result =
        document.getElementById("tdeeResult");


    // =========================
    // VALIDASI
    // =========================

    if (
        !age ||
        !weight ||
        !height ||
        age < 20 ||
        age > 120 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className =
            "result result-error";

        result.innerHTML = `

            <strong>Data belum lengkap</strong>

            <p>
                Masukkan umur 20 tahun atau lebih,
                berat badan, dan tinggi badan yang valid.
            </p>

        `;

        return;
    }


    // =========================
    // BMR
    // Mifflin-St Jeor
    // =========================

    let bmr;


    if (gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    } else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }


    // =========================
    // TDEE
    // =========================

    const tdee =
        bmr * activity;


    // =========================
    // HASIL
    // =========================

    result.className =
        "result result-normal";


    result.innerHTML = `

        <div class="result-title">
            HASIL KEBUTUHAN ENERGI
        </div>


        <div class="energy-result">

            <div class="energy-box">

                <span>
                    BMR
                </span>

                <strong>
                    ${Math.round(bmr)}
                </strong>

                <small>
                    kcal/hari
                </small>

            </div>


            <div class="energy-box featured">

                <span>
                    TDEE
                </span>

                <strong>
                    ${Math.round(tdee)}
                </strong>

                <small>
                    kcal/hari
                </small>

            </div>

        </div>


        <div class="result-details">

            <p>
                <strong>Umur:</strong>
                ${age} tahun
            </p>

            <p>
                <strong>Berat badan:</strong>
                ${weight} kg
            </p>

            <p>
                <strong>Tinggi badan:</strong>
                ${height} cm
            </p>

        </div>


        <div class="energy-explanation">

            <p>
                <strong>BMR</strong> adalah estimasi energi
                yang dibutuhkan tubuh saat istirahat.
            </p>

            <p>
                <strong>TDEE</strong> adalah estimasi kebutuhan
                energi harian setelah memperhitungkan
                tingkat aktivitas.
            </p>

        </div>


        <div class="bmi-note">

            Angka ini merupakan estimasi dan kebutuhan
            energi sebenarnya dapat berbeda pada setiap
            individu.

        </div>

    `;
}




function calculateProtein() {

    const weight =
        Number(
            document.getElementById(
                "proteinWeight"
            ).value
        );


    const goal =
        document.getElementById("goal").value;


    if (
        !weight ||
        weight <= 0
    ) {

        document.getElementById(
            "proteinResult"
        ).innerHTML =
            "Masukkan berat badan yang valid.";

        return;
    }


    let minProtein;

    let maxProtein;


    if (goal === "maintenance") {

        minProtein =
            weight * 1.2;

        maxProtein =
            weight * 1.6;

    } else {

        minProtein =
            weight * 1.6;

        maxProtein =
            weight * 2.2;

    }


    document.getElementById(
        "proteinResult"
    ).innerHTML =

        `Estimasi protein:
        ${Math.round(minProtein)}
        -
        ${Math.round(maxProtein)}
        gram/hari`;
}
