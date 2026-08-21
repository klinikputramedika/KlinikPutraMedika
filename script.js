/* =========================
   BMI CALCULATOR
========================= */

function calculateBMI() {

    const weight = parseFloat(
        document.getElementById("weight").value
    );

    const heightCm = parseFloat(
        document.getElementById("height").value
    );

    const result = document.getElementById("bmiResult");


    if (
        !weight ||
        !heightCm ||
        weight <= 0 ||
        heightCm <= 0
    ) {

        result.className = "result result-error";

        result.innerHTML = `
            <div class="result-title">
                PERHATIAN
            </div>

            <p>
                Silakan masukkan berat dan tinggi badan
                yang valid.
            </p>
        `;

        return;
    }


    const heightM = heightCm / 100;

    const bmi = weight / (heightM * heightM);

    const bmiValue = bmi.toFixed(1);


    let category = "";
    let resultClass = "";
    let description = "";
    let scalePosition = 0;


    if (bmi < 18.5) {

        category = "Berat badan kurang";
        resultClass = "result-underweight";

        description =
            "Nilai BMI berada di bawah rentang yang umumnya dianggap normal untuk orang dewasa.";

        scalePosition = 10;

    }

    else if (bmi < 25) {

        category = "Berat badan normal";
        resultClass = "result-normal";

        description =
            "Nilai BMI berada dalam rentang yang umumnya dianggap normal untuk orang dewasa.";

        scalePosition =
            18 + ((bmi - 18.5) / 6.5) * 24;

    }

    else if (bmi < 30) {

        category = "Berat badan berlebih";
        resultClass = "result-overweight";

        description =
            "Nilai BMI berada di atas rentang yang umumnya dianggap normal untuk orang dewasa.";

        scalePosition =
            42 + ((bmi - 25) / 5) * 18;

    }

    else {

        category = "Obesitas";
        resultClass = "result-obesity";

        description =
            "Nilai BMI berada pada kategori obesitas berdasarkan klasifikasi BMI orang dewasa.";

        scalePosition =
            60 + Math.min(((bmi - 30) / 10) * 18, 18);

    }


    result.className = `result ${resultClass}`;


    result.innerHTML = `

        <div class="result-title">
            HASIL BMI
        </div>

        <div class="bmi-number">
            ${bmiValue}
        </div>

        <div class="bmi-category">
            ${category}
        </div>


        <div class="result-details">

            <p>
                Berat badan:
                <strong>${weight.toFixed(1)} kg</strong>
            </p>

            <p>
                Tinggi badan:
                <strong>${heightCm.toFixed(1)} cm</strong>
            </p>

        </div>


        <div class="result-description">
            ${description}
        </div>


        <div class="bmi-scale">

            <div class="scale-bar">

                <div
                    class="scale-indicator"
                    style="left: ${scalePosition}%"
                ></div>

            </div>


            <div class="scale-labels">

                <span>
                    Kurang
                </span>

                <span>
                    Normal
                </span>

                <span>
                    Berlebih
                </span>

                <span>
                    Obesitas
                </span>

            </div>

        </div>


        <div class="bmi-note">
            BMI merupakan alat skrining dan tidak dapat
            menggambarkan kondisi kesehatan seseorang
            secara keseluruhan.
        </div>

    `;
}



/* =========================
   BMR & TDEE
========================= */

function calculateTDEE() {

    const gender =
        document.getElementById("gender").value;

    const age =
        parseFloat(
            document.getElementById("age").value
        );

    const weight =
        parseFloat(
            document.getElementById("weightBMR").value
        );

    const height =
        parseFloat(
            document.getElementById("heightBMR").value
        );

    const activity =
        parseFloat(
            document.getElementById("activity").value
        );

    const result =
        document.getElementById("tdeeResult");


    if (
        !age ||
        !weight ||
        !height ||
        !activity ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className =
            "result result-error";

        result.innerHTML = `

            <div class="result-title">
                PERHATIAN
            </div>

            <p>
                Silakan lengkapi semua data
                dengan nilai yang valid.
            </p>

        `;

        return;
    }


    let bmr;


    /*
       Mifflin-St Jeor
    */

    if (gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }

    else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }


    const tdee =
        bmr * activity;


    const roundedBMR =
        Math.round(bmr);

    const roundedTDEE =
        Math.round(tdee);


    result.className =
        "result";


    result.innerHTML = `

        <div class="result-title">
            HASIL PERHITUNGAN
        </div>


        <div class="energy-result">


            <div class="energy-box">

                <span>
                    BMR
                </span>

                <strong>
                    ${roundedBMR.toLocaleString("id-ID")}
                </strong>

                <small>
                    kcal / hari
                </small>

            </div>


            <div class="energy-box featured">

                <span>
                    TDEE
                </span>

                <strong>
                    ${roundedTDEE.toLocaleString("id-ID")}
                </strong>

                <small>
                    kcal / hari
                </small>

            </div>


        </div>


        <div class="energy-explanation">

            <p>
                <strong>BMR</strong> adalah estimasi
                energi yang dibutuhkan tubuh saat
                beristirahat.
            </p>

            <p>
                <strong>TDEE</strong> adalah estimasi
                kebutuhan energi harian setelah
                memperhitungkan aktivitas.
            </p>

        </div>

    `;
}



/* =========================
   MACRO CALCULATOR
========================= */

function calculateMacros() {

    const gender =
        document.getElementById("macroGender").value;

    const age =
        parseFloat(
            document.getElementById("macroAge").value
        );

    const weight =
        parseFloat(
            document.getElementById("macroWeight").value
        );

    const height =
        parseFloat(
            document.getElementById("macroHeight").value
        );

    const activity =
        parseFloat(
            document.getElementById("macroActivity").value
        );

    const goal =
        document.getElementById("macroGoal").value;

    const result =
        document.getElementById("macroResult");


    /* VALIDASI */

    if (
        !age ||
        !weight ||
        !height ||
        !activity ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className =
            "result result-error";

        result.innerHTML = `

            <div class="result-title">
                PERHATIAN
            </div>

            <p>
                Silakan lengkapi umur, berat badan,
                dan tinggi badan dengan benar.
            </p>

        `;

        return;
    }


    /*
       Mifflin-St Jeor
    */

    let bmr;


    if (gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }

    else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }


    /*
       TDEE
    */

    const tdee =
        bmr * activity;


    /*
       TARGET KALORI

       Maintenance = TDEE

       Fat Loss = -15%

       Muscle Gain = +10%
    */

    let targetCalories;


    if (goal === "fatloss") {

        targetCalories =
            tdee * 0.85;

    }

    else if (goal === "muscle") {

        targetCalories =
            tdee * 1.10;

    }

    else {

        targetCalories =
            tdee;

    }


    /*
       PROTEIN

       Menggunakan kisaran sederhana
       berdasarkan tujuan.
    */

    let proteinPerKg;


    if (goal === "fatloss") {

        proteinPerKg = 1.8;

    }

    else if (goal === "muscle") {

        proteinPerKg = 1.8;

    }

    else {

        proteinPerKg = 1.6;

    }


    const protein =
        weight * proteinPerKg;


    /*
       LEMAK

       Sekitar 25% dari total kalori.
    */

    const fatCalories =
        targetCalories * 0.25;

    const fat =
        fatCalories / 9;


    /*
       KARBOHIDRAT

       Sisa kalori setelah protein
       dan lemak.
    */

    const proteinCalories =
        protein * 4;

    const remainingCalories =
        targetCalories -
        proteinCalories -
        fatCalories;


    const carbs =
        Math.max(
            remainingCalories / 4,
            0
        );


    /*
       PEMBULATAN
    */

    const caloriesRounded =
        Math.round(targetCalories);

    const proteinRounded =
        Math.round(protein);

    const fatRounded =
        Math.round(fat);

    const carbsRounded =
        Math.round(carbs);


    const bmrRounded =
        Math.round(bmr);

    const tdeeRounded =
        Math.round(tdee);


    let goalText;


    if (goal === "fatloss") {

        goalText =
            "Menurunkan berat badan";

    }

    else if (goal === "muscle") {

        goalText =
            "Meningkatkan massa otot";

    }

    else {

        goalText =
            "Menjaga berat badan";

    }


    /*
       TAMPILKAN HASIL
    */

    result.className =
        "result";


    result.innerHTML = `

        <div class="macro-summary">

            <div class="macro-calories-label">
                TARGET KALORI HARIAN
            </div>

            <div class="macro-calories">
                ${caloriesRounded.toLocaleString("id-ID")}
            </div>

            <div class="macro-unit">
                kcal / hari
            </div>

        </div>


        <div class="macro-grid">


            <div class="macro-box">

                <div class="macro-box-icon">
                    💪
                </div>

                <div class="macro-box-title">
                    PROTEIN
                </div>

                <div class="macro-box-value macro-protein">
                    ${proteinRounded}
                </div>

                <div class="macro-box-unit">
                    gram / hari
                </div>

            </div>


            <div class="macro-box">

                <div class="macro-box-icon">
                    🥑
                </div>

                <div class="macro-box-title">
                    LEMAK
                </div>

                <div class="macro-box-value macro-fat">
                    ${fatRounded}
                </div>

                <div class="macro-box-unit">
                    gram / hari
                </div>

            </div>


            <div class="macro-box">

                <div class="macro-box-icon">
                    🍚
                </div>

                <div class="macro-box-title">
                    KARBOHIDRAT
                </div>

                <div class="macro-box-value macro-carbs">
                    ${carbsRounded}
                </div>

                <div class="macro-box-unit">
                    gram / hari
                </div>

            </div>


        </div>


        <div class="macro-explanation">

            <p>
                <strong>Tujuan:</strong>
                ${goalText}
            </p>

            <p>
                <strong>BMR:</strong>
                ${bmrRounded.toLocaleString("id-ID")} kcal/hari
            </p>

            <p>
                <strong>TDEE:</strong>
                ${tdeeRounded.toLocaleString("id-ID")} kcal/hari
            </p>

            <p>
                Protein dihitung berdasarkan berat badan
                dan tujuan, sedangkan lemak ditetapkan
                sekitar 25% dari target energi. Karbohidrat
                merupakan sisa energi setelah protein dan lemak.
            </p>

        </div>


        <div class="bmi-note">

            Hasil ini merupakan estimasi untuk tujuan
            edukasi. Kebutuhan energi dan makronutrien
            dapat berbeda berdasarkan kondisi dan kebutuhan
            masing-masing individu.

        </div>

    `;
}
/* =========================
   MACRO CALCULATOR
========================= */

function calculateMacros() {

    const gender = document.getElementById("macroGender").value;

    const age = parseFloat(
        document.getElementById("macroAge").value
    );

    const weight = parseFloat(
        document.getElementById("macroWeight").value
    );

    const height = parseFloat(
        document.getElementById("macroHeight").value
    );

    const activity = parseFloat(
        document.getElementById("macroActivity").value
    );

    const goal = document.getElementById("macroGoal").value;

    const result = document.getElementById("macroResult");


    /* VALIDASI */

    if (
        !age ||
        !weight ||
        !height ||
        !activity
    ) {

        result.innerHTML = `
            <div class="result-error">
                <strong>Data belum lengkap</strong>
                <p>
                    Silakan isi umur, berat badan,
                    tinggi badan dan aktivitas.
                </p>
            </div>
        `;

        return;
    }


    /* BMR MIFflin-St Jeor */

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


    /* TDEE */

    let tdee = bmr * activity;


    /* PENYESUAIAN TUJUAN */

    let calorieTarget;


    if (goal === "fatloss") {

        calorieTarget = tdee * 0.85;

    } else if (goal === "bulking") {

        calorieTarget = tdee * 1.10;

    } else {

        calorieTarget = tdee;

    }


    calorieTarget = Math.round(calorieTarget);


    /* PROTEIN */

    let proteinPerKg;


    if (goal === "fatloss") {

        proteinPerKg = 2.0;

    } else if (goal === "bulking") {

        proteinPerKg = 1.8;

    } else {

        proteinPerKg = 1.6;

    }


    const protein =
        Math.round(weight * proteinPerKg);


    /* LEMAK */

    const fat =
        Math.round(weight * 0.8);


    /* KALORI DARI PROTEIN */

    const proteinCalories =
        protein * 4;


    /* KALORI DARI LEMAK */

    const fatCalories =
        fat * 9;


    /* SISA KALORI UNTUK KARBOHIDRAT */

    const remainingCalories =
        calorieTarget -
        proteinCalories -
        fatCalories;


    const carbs =
        Math.max(
            0,
            Math.round(remainingCalories / 4)
        );


    /* HASIL */

    result.innerHTML = `

        <div class="macro-total">

            <span>
                TARGET KALORI HARIAN
            </span>

            <strong>
                ${calorieTarget.toLocaleString("id-ID")} kcal
            </strong>

        </div>


        <div class="macro-result-grid">

            <div class="macro-box">

                <span>
                    PROTEIN
                </span>

                <strong>
                    ${protein} g
                </strong>

            </div>


            <div class="macro-box">

                <span>
                    KARBOHIDRAT
                </span>

                <strong>
                    ${carbs} g
                </strong>

            </div>


            <div class="macro-box">

                <span>
                    LEMAK
                </span>

                <strong>
                    ${fat} g
                </strong>

            </div>


            <div class="macro-box">

                <span>
                    BMR
                </span>

                <strong>
                    ${Math.round(bmr)} kcal
                </strong>

            </div>

        </div>


        <p class="macro-explanation">

            Estimasi ini menggunakan BMR dan TDEE sebagai
            dasar perhitungan. Target kalori disesuaikan
            berdasarkan tujuan ${goal === "fatloss"
                ? "fat loss"
                : goal === "bulking"
                ? "muscle gain"
                : "maintenance"}.

        </p>

    `;

}

