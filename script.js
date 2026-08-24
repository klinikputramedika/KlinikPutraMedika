/* =========================================================
   KLINIK PUTRA MEDIKA
   HEALTH CALCULATOR
   BMI → BMR → TDEE → MACRO
   ========================================================= */


/* =========================================================
   HELPER
   ========================================================= */

function getNumber(id) {
    const element = document.getElementById(id);

    if (!element) {
        return NaN;
    }

    return parseFloat(element.value);
}


function showError(result, message) {

    result.className = "kal-result result result-error";

    result.innerHTML = `
        <div class="result-title">
            PERHATIAN
        </div>

        <p>
            ${message}
        </p>
    `;
}


function scrollToElement(id) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   BMI
   ========================================================= */

function calculateBMI() {

    const weight = getNumber("weight");
    const heightCm = getNumber("height");
    const result = document.getElementById("bmiResult");

    if (!result) {
        return;
    }

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

    const bmi =
        weight /
        (heightM * heightM);


    let category;
    let resultClass;
    let description;


    if (bmi < 18.5) {

        category = "Berat badan kurang";
        resultClass = "result-underweight";

        description =
            "BMI berada di bawah 18,5. Perhatikan kecukupan energi dan nutrisi serta pertimbangkan konsultasi dengan tenaga kesehatan bila diperlukan.";

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


    result.className =
        `kal-result result ${resultClass}`;


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
                Berat badan
                <strong>
                    ${weight.toFixed(1)} kg
                </strong>
            </p>

            <p>
                Tinggi badan
                <strong>
                    ${heightCm.toFixed(0)} cm
                </strong>
            </p>

        </div>

        <p class="result-description">
            ${description}
        </p>

        <div class="result-next-step">

            <span>
                ✓
            </span>

            <div>
                <strong>
                    Data siap digunakan
                </strong>

                <small>
                    Berat dan tinggi badan akan digunakan
                    untuk perhitungan BMR & TDEE.
                </small>
            </div>

        </div>

    `;


    /* =====================================================
       TERUSKAN DATA KE BMR
       ===================================================== */

    const weightBMR =
        document.getElementById("weightBMR");

    const heightBMR =
        document.getElementById("heightBMR");


    if (weightBMR) {
        weightBMR.value = weight;
    }

    if (heightBMR) {
        heightBMR.value = heightCm;
    }


    /* =====================================================
       TERUSKAN DATA KE MACRO
       ===================================================== */

    const macroWeight =
        document.getElementById("macroWeight");

    const macroHeight =
        document.getElementById("macroHeight");


    if (macroWeight) {
        macroWeight.value = weight;
    }

    if (macroHeight) {
        macroHeight.value = heightCm;
    }
}


/* =========================================================
   BMR & TDEE
   ========================================================= */

function calculateTDEE() {

    const gender =
        document.getElementById("gender");

    const age =
        getNumber("age");

    const weight =
        getNumber("weightBMR");

    const height =
        getNumber("heightBMR");

    const activity =
        getNumber("activity");

    const result =
        document.getElementById("tdeeResult");


    if (!result || !gender) {
        return;
    }


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        isNaN(activity) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        showError(
            result,
            "Silakan lengkapi umur, berat, tinggi dan aktivitas dengan benar."
        );

        return;
    }


    /* =====================================================
       MIFflin-St Jeor
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


    const tdee =
        bmr * activity;


    result.className =
        "kal-result result energy-result";


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


        <div class="result-next-step">

            <span>
                ✓
            </span>

            <div>

                <strong>
                    TDEE siap digunakan
                </strong>

                <small>
                    Nilai TDEE akan menjadi dasar untuk
                    menentukan target kalori dan makronutrien.
                </small>

            </div>

        </div>

    `;


    /* =====================================================
       TERUSKAN DATA KE MACRO
       ===================================================== */

    const macroGender =
        document.getElementById("macroGender");

    const macroAge =
        document.getElementById("macroAge");

    const macroWeight =
        document.getElementById("macroWeight");

    const macroHeight =
        document.getElementById("macroHeight");

    const macroActivity =
        document.getElementById("macroActivity");


    if (macroGender) {
        macroGender.value = gender.value;
    }

    if (macroAge) {
        macroAge.value = age;
    }

    if (macroWeight) {
        macroWeight.value = weight;
    }

    if (macroHeight) {
        macroHeight.value = height;
    }

    if (macroActivity) {
        macroActivity.value = activity;
    }


    /* =====================================================
       SIMPAN TDEE
       ===================================================== */

    window.lastTDEE = tdee;
    window.lastBMR = bmr;


    /* =====================================================
       SIMPAN DATA UNTUK MACRO
       ===================================================== */

    window.calculatorData = {

        gender: gender.value,
        age: age,
        weight: weight,
        height: height,
        activity: activity,
        bmr: bmr,
        tdee: tdee

    };
}


/* =========================================================
   MACRO CALCULATOR
   ========================================================= */

function calculateMacros() {

    const gender =
        document.getElementById("macroGender");

    const age =
        getNumber("macroAge");

    const weight =
        getNumber("macroWeight");

    const height =
        getNumber("macroHeight");

    const activity =
        getNumber("macroActivity");

    const goalInput =
        document.getElementById("macroGoal");

    const result =
        document.getElementById("macroResult");


    if (!result || !gender || !goalInput) {
        return;
    }


    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        isNaN(activity) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        showError(
            result,
            "Silakan lengkapi semua data dengan benar."
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
       TARGET KALORI
       ===================================================== */

    let calories;
    let goalText;
    let calorieAdjustment;


    if (goalInput.value === "fatloss") {

        calories = tdee * 0.80;

        goalText = "Fat Loss";

        calorieAdjustment = "-20% dari TDEE";

    }

    else if (goalInput.value === "bulking") {

        calories = tdee * 1.10;

        goalText = "Muscle Gain / Bulking";

        calorieAdjustment = "+10% dari TDEE";

    }

    else {

        calories = tdee;

        goalText = "Maintenance";

        calorieAdjustment = "Sama dengan TDEE";
    }


    /* =====================================================
       PROTEIN
       ===================================================== */

    const protein =
        weight * 1.8;


    const proteinCalories =
        protein * 4;


    /* =====================================================
       FAT
       ===================================================== */

    const fatCalories =
        calories * 0.25;


    const fat =
        fatCalories / 9;


    /* =====================================================
       CARBOHYDRATE
       ===================================================== */

    const carbCalories =
        calories -
        proteinCalories -
        fatCalories;


    const carbs =
        Math.max(0, carbCalories / 4);


    /* =====================================================
       TOTAL
       ===================================================== */

    const totalCalories =
        proteinCalories +
        (carbs * 4) +
        fatCalories;


    /* =====================================================
       RESULT
       ===================================================== */

    result.className =
        "kal-result result macro-result";


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
                kkal / hari
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
                    ${Math.round(proteinCalories)} kkal
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
                    ${Math.round(fatCalories)} kkal
                </small>

            </div>


        </div>


        <div class="result-details">

            <p>

                Tujuan

                <strong>
                    ${goalText}
                </strong>

            </p>


            <p>

                Penyesuaian kalori

                <strong>
                    ${calorieAdjustment}
                </strong>

            </p>


            <p>

                Estimasi TDEE

                <strong>
                    ${Math.round(tdee)} kkal
                </strong>

            </p>


            <p>

                Protein

                <strong>
                    1,8 g/kg BB
                </strong>

            </p>

        </div>


        <p class="result-description">

            Pembagian makronutrien ini merupakan estimasi
            sederhana untuk tujuan edukasi. Kebutuhan
            energi dan nutrisi setiap individu dapat berbeda.

        </p>

    `;
}


/* =========================================================
   AUTO-FILL DARI BMI
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const weight =
            document.getElementById("weight");

        const height =
            document.getElementById("height");


        if (!weight || !height) {
            return;
        }


        /* =================================================
           KETIKA BERAT / TINGGI BMI BERUBAH
           ================================================= */

        function syncBodyData() {

            const weightValue =
                parseFloat(weight.value);

            const heightValue =
                parseFloat(height.value);


            if (
                !isNaN(weightValue) &&
                weightValue > 0
            ) {

                const weightBMR =
                    document.getElementById("weightBMR");

                const macroWeight =
                    document.getElementById("macroWeight");


                if (weightBMR) {
                    weightBMR.value = weightValue;
                }

                if (macroWeight) {
                    macroWeight.value = weightValue;
                }
            }


            if (
                !isNaN(heightValue) &&
                heightValue > 0
            ) {

                const heightBMR =
                    document.getElementById("heightBMR");

                const macroHeight =
                    document.getElementById("macroHeight");


                if (heightBMR) {
                    heightBMR.value = heightValue;
                }

                if (macroHeight) {
                    macroHeight.value = heightValue;
                }
            }
        }


        weight.addEventListener(
            "input",
            syncBodyData
        );


        height.addEventListener(
            "input",
            syncBodyData
        );

    }
);
