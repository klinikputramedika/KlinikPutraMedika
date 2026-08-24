/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR KESEHATAN
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   HELPER
   ========================================================= */

function showError(result, message) {

    result.className = "kal-result result-error";

    result.innerHTML = `
        <div class="kal-error-box">
            <div class="kal-error-icon">⚠️</div>

            <div>
                <strong>Data belum lengkap</strong>

                <p>
                    ${message}
                </p>
            </div>
        </div>
    `;
}


/* =========================================================
   BMI CALCULATOR
   ========================================================= */

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

        showError(
            result,
            "Silakan masukkan berat dan tinggi badan yang valid."
        );

        return;
    }


    const heightM = heightCm / 100;

    const bmi = weight / (heightM * heightM);


    let category = "";
    let description = "";


    if (bmi < 18.5) {

        category = "Berat badan kurang";

        description =
            "BMI berada di bawah rentang 18,5. Pertimbangkan pola makan bergizi seimbang dan konsultasikan dengan tenaga kesehatan bila diperlukan.";

    }

    else if (bmi < 25) {

        category = "Berat badan normal";

        description =
            "BMI berada dalam rentang normal berdasarkan kategori BMI dewasa.";

    }

    else if (bmi < 30) {

        category = "Berat badan berlebih";

        description =
            "BMI berada di atas rentang normal. Perhatikan pola makan, aktivitas fisik dan kebiasaan hidup sehat.";

    }

    else {

        category = "Obesitas";

        description =
            "BMI berada pada kategori obesitas. Pertimbangkan konsultasi dengan tenaga kesehatan untuk mendapatkan penilaian yang lebih menyeluruh.";
    }


    result.className = "kal-result bmi-result";


    result.innerHTML = `

        <div class="result-title">
            HASIL BMI
        </div>

        <div class="bmi-main">

            <div class="bmi-number">
                ${bmi.toFixed(1)}
            </div>

            <div class="bmi-category">
                ${category}
            </div>

        </div>

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


/* =========================================================
   BMR & TDEE
   ========================================================= */

function calculateTDEE() {

    const gender =
        document.getElementById("gender");

    const ageInput =
        document.getElementById("age");

    const weightInput =
        document.getElementById("weightBMR");

    const heightInput =
        document.getElementById("heightBMR");

    const activityInput =
        document.getElementById("activity");

    const result =
        document.getElementById("tdeeResult");


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


    const age =
        parseFloat(ageInput.value);

    const weight =
        parseFloat(weightInput.value);

    const height =
        parseFloat(heightInput.value);

    const activity =
        parseFloat(activityInput.value);


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        showError(
            result,
            "Silakan lengkapi umur, berat badan dan tinggi badan dengan benar."
        );

        return;
    }


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


    const tdee =
        bmr * activity;


    result.className =
        "kal-result energy-result";


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


/* =========================================================
   MACRO CALCULATOR
   ========================================================= */

function calculateMacros() {

    const gender =
        document.getElementById("macroGender");

    const ageInput =
        document.getElementById("macroAge");

    const weightInput =
        document.getElementById("macroWeight");

    const heightInput =
        document.getElementById("macroHeight");

    const activityInput =
        document.getElementById("macroActivity");

    const goalInput =
        document.getElementById("macroGoal");

    const result =
        document.getElementById("macroResult");


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


    const age =
        parseFloat(ageInput.value);

    const weight =
        parseFloat(weightInput.value);

    const height =
        parseFloat(heightInput.value);

    const activity =
        parseFloat(activityInput.value);


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        showError(
            result,
            "Silakan lengkapi semua data tubuh dengan benar."
        );

        return;
    }


    /* =====================================================
       BMR
    ===================================================== */

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


    /* =====================================================
       TDEE
    ===================================================== */

    const tdee =
        bmr * activity;


    /* =====================================================
       GOAL
    ===================================================== */

    let calories;
    let goalText;


    if (goalInput.value === "fatloss") {

        calories =
            tdee * 0.80;

        goalText =
            "Fat Loss";

    }

    else if (goalInput.value === "bulking") {

        calories =
            tdee * 1.10;

        goalText =
            "Muscle Gain / Bulking";

    }

    else {

        calories =
            tdee;

        goalText =
            "Maintenance";
    }


    /* =====================================================
       MACRO
    ===================================================== */

    /*
       Protein = 1.8 g/kg
    */

    const protein =
        weight * 1.8;


    /*
       Lemak = 25% kalori
    */

    const fatCalories =
        calories * 0.25;

    const fat =
        fatCalories / 9;


    /*
       Karbohidrat = sisa kalori
    */

    const proteinCalories =
        protein * 4;

    const carbCalories =
        calories -
        proteinCalories -
        fatCalories;

    const carbs =
        Math.max(0, carbCalories / 4);


    /* =====================================================
       PERCENTAGE PROGRESS
    ===================================================== */

    const proteinCaloriesFinal =
        protein * 4;

    const carbsCaloriesFinal =
        carbs * 4;

    const fatCaloriesFinal =
        fat * 9;


    const totalMacroCalories =
        proteinCaloriesFinal +
        carbsCaloriesFinal +
        fatCaloriesFinal;


    const proteinPercent =
        Math.round(
            (proteinCaloriesFinal / totalMacroCalories) * 100
        );

    const carbsPercent =
        Math.round(
            (carbsCaloriesFinal / totalMacroCalories) * 100
        );

    const fatPercent =
        Math.round(
            (fatCaloriesFinal / totalMacroCalories) * 100
        );


    /* =====================================================
       RESULT
    ===================================================== */

    result.className =
        "kal-result macro-result";


    result.innerHTML = `

        <div class="macro-result-header">

            <div>

                <span class="result-title">
                    TARGET MAKROS HARIAN
                </span>

                <strong class="macro-target-calories">
                    ${Math.round(calories)}
                    <small>kkal</small>
                </strong>

            </div>

        </div>


        <div class="macro-progress-list">


            <!-- PROTEIN -->

            <div class="macro-progress-item">

                <div class="macro-progress-header">

                    <span>
                        Protein
                    </span>

                    <strong>
                        ${Math.round(protein)} g
                    </strong>

                </div>


                <div class="macro-progress-track">

                    <div
                        class="macro-progress-fill protein-fill"
                        style="width:${proteinPercent}%"
                    ></div>

                </div>


                <div class="macro-progress-footer">

                    <span>
                        ${proteinPercent}% energi
                    </span>

                    <span>
                        ${Math.round(proteinCaloriesFinal)} kkal
                    </span>

                </div>

            </div>



            <!-- KARBOHIDRAT -->

            <div class="macro-progress-item">

                <div class="macro-progress-header">

                    <span>
                        Karbohidrat
                    </span>

                    <strong>
                        ${Math.round(carbs)} g
                    </strong>

                </div>


                <div class="macro-progress-track">

                    <div
                        class="macro-progress-fill carbs-fill"
                        style="width:${carbsPercent}%"
                    ></div>

                </div>


                <div class="macro-progress-footer">

                    <span>
                        ${carbsPercent}% energi
                    </span>

                    <span>
                        ${Math.round(carbsCaloriesFinal)} kkal
                    </span>

                </div>

            </div>



            <!-- LEMAK -->

            <div class="macro-progress-item">

                <div class="macro-progress-header">

                    <span>
                        Lemak
                    </span>

                    <strong>
                        ${Math.round(fat)} g
                    </strong>

                </div>


                <div class="macro-progress-track">

                    <div
                        class="macro-progress-fill fat-fill"
                        style="width:${fatPercent}%"
                    ></div>

                </div>


                <div class="macro-progress-footer">

                    <span>
                        ${fatPercent}% energi
                    </span>

                    <span>
                        ${Math.round(fatCaloriesFinal)} kkal
                    </span>

                </div>

            </div>

        </div>


        <div class="macro-summary">

            <div>

                <span>
                    Tujuan
                </span>

                <strong>
                    ${goalText}
                </strong>

            </div>


            <div>

                <span>
                    Estimasi TDEE
                </span>

                <strong>
                    ${Math.round(tdee)} kkal
                </strong>

            </div>

        </div>


        <p class="result-description">

            Pembagian makronutrien ini merupakan estimasi
            sederhana untuk tujuan edukasi. Kebutuhan
            individu dapat berbeda.

        </p>

    `;
}


/* =========================================================
   AUTO ENTER SUPPORT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const inputs =
        document.querySelectorAll(
            ".kal-form input"
        );


    inputs.forEach(function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    const form =
                        input.closest(".kal-form");

                    if (!form) {
                        return;
                    }


                    const button =
                        form.querySelector(".kal-button");

                    if (button) {

                        button.click();

                    }

                }

            }
        );

    });

});
