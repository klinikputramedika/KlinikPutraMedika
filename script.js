/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR KESEHATAN TERPADU
========================================================= */


/* =========================================================
   MAIN CALCULATOR
========================================================= */

function calculateHealth() {

    const gender = document.getElementById("gender");
    const ageInput = document.getElementById("age");
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const activityInput = document.getElementById("activity");
    const goalInput = document.getElementById("goal");

    const errorBox = document.getElementById("formError");

    const healthResult = document.getElementById("healthResult");
    const macroResult = document.getElementById("macroResult");


    /* -----------------------------------------------------
       CEK ELEMENT
    ----------------------------------------------------- */

    if (
        !gender ||
        !ageInput ||
        !weightInput ||
        !heightInput ||
        !activityInput ||
        !goalInput
    ) {
        return;
    }


    /* -----------------------------------------------------
       AMBIL DATA
    ----------------------------------------------------- */

    const age = parseFloat(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    const activity = parseFloat(activityInput.value);

    const goal = goalInput.value;


    /* -----------------------------------------------------
       VALIDASI
    ----------------------------------------------------- */

    let errorMessage = "";


    if (
        isNaN(age) ||
        age < 18 ||
        age > 120
    ) {

        errorMessage =
            "Masukkan umur antara 18–120 tahun.";

    }

    else if (
        isNaN(weight) ||
        weight <= 0 ||
        weight > 500
    ) {

        errorMessage =
            "Masukkan berat badan yang valid.";

    }

    else if (
        isNaN(height) ||
        height < 50 ||
        height > 250
    ) {

        errorMessage =
            "Masukkan tinggi badan yang valid.";

    }


    if (errorMessage !== "") {

        errorBox.textContent = errorMessage;

        errorBox.classList.add("show");

        return;

    }


    errorBox.textContent = "";

    errorBox.classList.remove("show");


    /* =====================================================
       BMI
    ===================================================== */

    const heightMeter = height / 100;

    const bmi =
        weight /
        (heightMeter * heightMeter);


    let bmiCategory = "";


    if (bmi < 18.5) {

        bmiCategory = "Berat badan kurang";

    }

    else if (bmi < 25) {

        bmiCategory = "Berat badan normal";

    }

    else if (bmi < 30) {

        bmiCategory = "Berat badan berlebih";

    }

    else {

        bmiCategory = "Obesitas";

    }


    /* =====================================================
       BMR
       Mifflin-St Jeor
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
       TARGET KALORI
    ===================================================== */

    let calories;
    let goalText;


    if (goal === "fatloss") {

        calories = tdee * 0.80;

        goalText = "Fat Loss";

    }

    else if (goal === "bulking") {

        calories = tdee * 1.10;

        goalText = "Muscle Gain";

    }

    else {

        calories = tdee;

        goalText = "Maintenance";

    }


    /* =====================================================
       PROTEIN
       1.8 g/kg
    ===================================================== */

    const protein =
        weight * 1.8;


    const proteinCalories =
        protein * 4;


    /* =====================================================
       FAT
       25% KALORI
    ===================================================== */

    const fatCalories =
        calories * 0.25;

    const fat =
        fatCalories / 9;


    /* =====================================================
       CARBOHYDRATE
       SISA KALORI
    ===================================================== */

    const carbCalories =
        calories -
        proteinCalories -
        fatCalories;


    const carbs =
        Math.max(0, carbCalories / 4);


    /* =====================================================
       UPDATE HEALTH RESULT
    ===================================================== */

    healthResult.style.display = "block";

    document.querySelector(".result-placeholder").style.display =
        "none";


    healthResult.innerHTML = `

        <div class="health-summary-title">
            HASIL PERHITUNGAN ANDA
        </div>


        <div class="health-metrics">

            <div class="health-metric">

                <span>
                    BMI
                </span>

                <strong>
                    ${bmi.toFixed(1)}
                </strong>

                <small>
                    Indeks massa tubuh
                </small>

                <div class="bmi-category">
                    ${bmiCategory}
                </div>

            </div>


            <div class="health-metric">

                <span>
                    BMR
                </span>

                <strong>
                    ${Math.round(bmr)}
                </strong>

                <small>
                    kkal / hari
                </small>

            </div>


            <div class="health-metric">

                <span>
                    TDEE
                </span>

                <strong>
                    ${Math.round(tdee)}
                </strong>

                <small>
                    kkal / hari
                </small>

            </div>

        </div>


        <div class="energy-summary">

            <div class="energy-card">

                <span>
                    TARGET KALORI
                </span>

                <strong>
                    ${Math.round(calories)}
                </strong>

                <small>
                    kkal / hari
                </small>

            </div>


            <div class="energy-card">

                <span>
                    TUJUAN
                </span>

                <strong>
                    ${goalText}
                </strong>

                <small>
                    berdasarkan pilihan Anda
                </small>

            </div>

        </div>

    `;


    /* =====================================================
       UPDATE MACRO
    ===================================================== */

    renderMacroResult(
        calories,
        protein,
        carbs,
        fat,
        goalText,
        tdee
    );


    /* =====================================================
       SCROLL HASIL
    ===================================================== */

    setTimeout(() => {

        document
            .getElementById("hasil")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }, 100);

}


/* =========================================================
   MACRO RESULT
========================================================= */

function renderMacroResult(
    calories,
    protein,
    carbs,
    fat,
    goalText,
    tdee
) {

    const macroResult =
        document.getElementById("macroResult");


    if (!macroResult) {
        return;
    }


    const proteinKcal =
        protein * 4;

    const carbsKcal =
        carbs * 4;

    const fatKcal =
        fat * 9;


    /*
       Persentase visual.
       Dibuat relatif terhadap makro terbesar
       agar progress bar terlihat jelas.
    */

    const maxMacro =
        Math.max(
            protein,
            carbs,
            fat
        );


    const proteinPercent =
        (protein / maxMacro) * 100;

    const carbsPercent =
        (carbs / maxMacro) * 100;

    const fatPercent =
        (fat / maxMacro) * 100;


    macroResult.className =
        "macro-result";


    macroResult.innerHTML = `

        <div class="macro-target">

            <span class="macro-target-label">
                TARGET HARIAN
            </span>

            <strong>
                ${Math.round(calories)}
            </strong>

            <small>
                kkal / hari
            </small>

            <div class="macro-goal">
                ${goalText}
            </div>

        </div>


        <div class="macro-progress-list">


            <!-- PROTEIN -->

            <div class="macro-progress-item">

                <div class="macro-progress-top">

                    <span class="macro-name">
                        Protein
                    </span>

                    <span class="macro-value">
                        ${Math.round(protein)} g
                    </span>

                </div>


                <div class="macro-track">

                    <div
                        class="macro-fill protein"
                        style="width: ${proteinPercent}%"
                    ></div>

                </div>


                <div class="macro-kcal">

                    <span>
                        ${Math.round(proteinKcal)} kkal
                    </span>

                    <span>
                        ${Math.round(
                            (proteinKcal / calories) * 100
                        )}%
                    </span>

                </div>

            </div>


            <!-- CARBOHYDRATE -->

            <div class="macro-progress-item">

                <div class="macro-progress-top">

                    <span class="macro-name">
                        Karbohidrat
                    </span>

                    <span class="macro-value">
                        ${Math.round(carbs)} g
                    </span>

                </div>


                <div class="macro-track">

                    <div
                        class="macro-fill carbs"
                        style="width: ${carbsPercent}%"
                    ></div>

                </div>


                <div class="macro-kcal">

                    <span>
                        ${Math.round(carbsKcal)} kkal
                    </span>

                    <span>
                        ${Math.round(
                            (carbsKcal / calories) * 100
                        )}%
                    </span>

                </div>

            </div>


            <!-- FAT -->

            <div class="macro-progress-item">

                <div class="macro-progress-top">

                    <span class="macro-name">
                        Lemak
                    </span>

                    <span class="macro-value">
                        ${Math.round(fat)} g
                    </span>

                </div>


                <div class="macro-track">

                    <div
                        class="macro-fill fat"
                        style="width: ${fatPercent}%"
                    ></div>

                </div>


                <div class="macro-kcal">

                    <span>
                        ${Math.round(fatKcal)} kkal
                    </span>

                    <span>
                        ${Math.round(
                            (fatKcal / calories) * 100
                        )}%
                    </span>

                </div>

            </div>

        </div>


        <div class="macro-summary">

            <div class="macro-summary-box">

                <strong>
                    ${Math.round(protein)} g
                </strong>

                <span>
                    Protein
                </span>

            </div>


            <div class="macro-summary-box">

                <strong>
                    ${Math.round(carbs)} g
                </strong>

                <span>
                    Karbohidrat
                </span>

            </div>


            <div class="macro-summary-box">

                <strong>
                    ${Math.round(fat)} g
                </strong>

                <span>
                    Lemak
                </span>

            </div>

        </div>

    `;

}


/* =========================================================
   ENTER KEY
   Memudahkan pengguna menghitung dari keyboard
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const inputs =
            document.querySelectorAll(
                "#data input"
            );


        inputs.forEach(function (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        calculateHealth();

                    }

                }
            );

        });

    }
);
