/* =========================
   BMI CALCULATOR
========================= */

function calculateBMI() {

    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const result = document.getElementById("bmiResult");

    if (!weightInput || !heightInput || !result) {
        return;
    }

    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);

    if (
        isNaN(weight) ||
        isNaN(heightCm) ||
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

    let category = "";
    let resultClass = "";
    let description = "";


    if (bmi < 18.5) {

        category = "Berat badan kurang";
        resultClass = "result-underweight";

        description =
            "BMI berada di bawah rentang 18,5. Pertimbangkan pola makan bergizi seimbang dan konsultasikan dengan tenaga kesehatan bila diperlukan.";

    }

    else if (bmi < 25) {

        category = "Berat badan normal";
        resultClass = "result-normal";

        description =
            "BMI berada dalam rentang normal berdasarkan kategori BMI dewasa.";

    }

    else if (bmi < 30) {

        category = "Berat badan berlebih";
        resultClass = "result-overweight";

        description =
            "BMI berada di atas rentang normal. Perhatikan pola makan, aktivitas fisik dan kebiasaan hidup sehat.";

    }

    else {

        category = "Obesitas";
        resultClass = "result-obesity";

        description =
            "BMI berada pada kategori obesitas. Pertimbangkan konsultasi dengan tenaga kesehatan untuk mendapatkan penilaian yang lebih menyeluruh.";

    }


    result.className = `result ${resultClass}`;


    result.innerHTML = `

        <div class="result-title">
            HASIL BMI
        </div>

        <div class="bmi-number">
            ${bmi.toFixed(1)}
        </div>

        <span class="bmi-category">
            ${category}
        </span>

        <div class="result-details">

            <p>
                Berat badan:
                <strong>${weight.toFixed(1)} kg</strong>
            </p>

            <p>
                Tinggi badan:
                <strong>${heightCm.toFixed(0)} cm</strong>
            </p>

        </div>

        <p class="result-description">
            ${description}
        </p>

    `;
}



/* =========================
   BMR & TDEE
========================= */

function calculateTDEE() {

    const gender = document.getElementById("gender");
    const ageInput = document.getElementById("age");
    const weightInput = document.getElementById("weightBMR");
    const heightInput = document.getElementById("heightBMR");
    const activityInput = document.getElementById("activity");
    const result = document.getElementById("tdeeResult");


    if (
        !gender ||
        !ageInput ||
        !weightInput ||
        !heightInput ||
        !activityInput ||
        !result
    ) {
        return;
    }


    const age = parseFloat(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const activity = parseFloat(activityInput.value);


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className = "result result-error";

        result.innerHTML = `
            <div class="result-title">
                PERHATIAN
            </div>

            <p>
                Silakan lengkapi semua data dengan benar.
            </p>
        `;

        return;
    }


    let bmr;


    /*
       Mifflin-St Jeor
    */

    if (gender.value === "male") {

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


    const tdee = bmr * activity;


    result.className = "result energy-result";


    result.innerHTML = `

        <div class="result-title">
            HASIL KEBUTUHAN ENERGI
        </div>

        <div class="energy-box">

            <div>
                <span>
                    BMR
                </span>

                <strong>
                    ${Math.round(bmr)}
                </strong>

                <small>
                    kkal/hari
                </small>
            </div>


            <div>
                <span>
                    TDEE
                </span>

                <strong>
                    ${Math.round(tdee)}
                </strong>

                <small>
                    kkal/hari
                </small>
            </div>

        </div>


        <p class="energy-explanation">

            <strong>BMR</strong> adalah estimasi energi
            yang dibutuhkan tubuh ketika beristirahat.

            <br><br>

            <strong>TDEE</strong> adalah estimasi kebutuhan
            energi harian setelah memperhitungkan aktivitas.

        </p>

    `;
}



/* =========================
   MACRO CALCULATOR
========================= */

function calculateMacros() {

    const gender = document.getElementById("macroGender");
    const ageInput = document.getElementById("macroAge");
    const weightInput = document.getElementById("macroWeight");
    const heightInput = document.getElementById("macroHeight");
    const activityInput = document.getElementById("macroActivity");
    const goalInput = document.getElementById("macroGoal");
    const result = document.getElementById("macroResult");


    if (
        !gender ||
        !ageInput ||
        !weightInput ||
        !heightInput ||
        !activityInput ||
        !goalInput ||
        !result
    ) {
        return;
    }


    const age = parseFloat(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const activity = parseFloat(activityInput.value);


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className = "result result-error";

        result.innerHTML = `
            <div class="result-title">
                PERHATIAN
            </div>

            <p>
                Silakan lengkapi semua data dengan benar.
            </p>
        `;

        return;
    }


    /*
       BMR
    */

    let bmr;


    if (gender.value === "male") {

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

    const tdee = bmr * activity;


    /*
       Penyesuaian kalori berdasarkan tujuan
    */

    let calories;
    let goalText;


    if (goalInput.value === "fatloss") {

        calories = tdee * 0.80;

        goalText = "Fat Loss";

    }

    else if (goalInput.value === "bulking") {

        calories = tdee * 1.10;

        goalText = "Muscle Gain / Bulking";

    }

    else {

        calories = tdee;

        goalText = "Maintenance";

    }


    /*
       Protein
       1.8 g/kg
    */

    const protein = weight * 1.8;


    /*
       Lemak
       25% kalori
    */

    const fatCalories = calories * 0.25;

    const fat = fatCalories / 9;


    /*
       Karbohidrat
       Sisa kalori
    */

    const proteinCalories = protein * 4;

    const carbCalories =
        calories -
        proteinCalories -
        fatCalories;

    const carbs = carbCalories / 4;


    result.className = "result macro-result";


    result.innerHTML = `

        <div class="result-title">
            TARGET MAKROS HARIAN
        </div>


        <div class="macro-calories">

            <span>
                Target Kalori
            </span>

            <strong>
                ${Math.round(calories)}
            </strong>

            <small>
                kkal/hari
            </small>

        </div>


        <div class="macro-grid">


            <div class="macro-box protein">

                <span>
                    Protein
                </span>

                <strong>
                    ${Math.round(protein)} g
                </strong>

                <small>
                    ${Math.round(protein * 4)} kkal
                </small>

            </div>



            <div class="macro-box carbs">

                <span>
                    Karbohidrat
                </span>

                <strong>
                    ${Math.round(carbs)} g
                </strong>

                <small>
                    ${Math.round(carbs * 4)} kkal
                </small>

            </div>



            <div class="macro-box fat">

                <span>
                    Lemak
                </span>

                <strong>
                    ${Math.round(fat)} g
                </strong>

                <small>
                    ${Math.round(fat * 9)} kkal
                </small>

            </div>

        </div>


        <div class="result-details">

            <p>
                Tujuan:
                <strong>${goalText}</strong>
            </p>

            <p>
                Estimasi TDEE:
                <strong>${Math.round(tdee)} kkal</strong>
            </p>

        </div>


        <p class="result-description">

            Pembagian makros ini merupakan estimasi
            sederhana untuk tujuan edukasi. Kebutuhan
            individu dapat berbeda.

        </p>

    `;
}
