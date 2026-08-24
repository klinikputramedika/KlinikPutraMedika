/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR KESEHATAN
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   01 - BMI CALCULATOR
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


    /* VALIDASI */

    if (
        isNaN(weight) ||
        isNaN(heightCm) ||
        weight <= 0 ||
        heightCm <= 0
    ) {

        result.className = "kal-result result-error";

        result.innerHTML = `

            <div class="macro-error">

                <span class="macro-error-icon">
                    ⚠️
                </span>

                <div>

                    <strong>
                        Data belum lengkap
                    </strong>

                    <p>
                        Silakan masukkan berat dan tinggi
                        badan yang valid.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    /* HITUNG BMI */

    const heightM = heightCm / 100;

    const bmi =
        weight /
        (heightM * heightM);


    /* KATEGORI */

    let category;
    let resultClass;
    let description;


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


    /* HASIL */

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
                Berat badan:
                <strong>
                    ${weight.toFixed(1)} kg
                </strong>
            </p>

            <p>
                Tinggi badan:
                <strong>
                    ${heightCm.toFixed(0)} cm
                </strong>
            </p>

        </div>


        <p class="result-description">
            ${description}
        </p>

    `;
}



/* =========================================================
   02 - BMR & TDEE CALCULATOR
   Mifflin-St Jeor
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


    /* VALIDASI */

    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0 ||
        isNaN(activity)
    ) {

        result.className =
            "kal-result result-error";

        result.innerHTML = `

            <div class="macro-error">

                <span class="macro-error-icon">
                    ⚠️
                </span>

                <div>

                    <strong>
                        Data belum lengkap
                    </strong>

                    <p>
                        Silakan lengkapi semua data
                        dengan benar.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    /* HITUNG BMR */

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


    /* HITUNG TDEE */

    const tdee =
        bmr * activity;


    /* HASIL */

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

            <strong>BMR</strong>
            adalah estimasi energi yang dibutuhkan
            tubuh ketika beristirahat.

            <br><br>

            <strong>TDEE</strong>
            adalah estimasi kebutuhan energi harian
            setelah memperhitungkan aktivitas.

        </p>

    `;
}



/* =========================================================
   03 - MACRO CALCULATOR
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


    /* AMBIL DATA */

    const age =
        parseFloat(ageInput.value);

    const weight =
        parseFloat(weightInput.value);

    const height =
        parseFloat(heightInput.value);

    const activity =
        parseFloat(activityInput.value);


    /* =====================================================
       VALIDASI
       ===================================================== */

    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(height) ||
        isNaN(activity) ||
        age <= 0 ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className =
            "kal-result result-error";


        result.innerHTML = `

            <div class="macro-error">

                <span class="macro-error-icon">
                    ⚠️
                </span>


                <div>

                    <strong>
                        Data belum lengkap
                    </strong>

                    <p>
                        Silakan lengkapi semua data
                        dengan benar sebelum menghitung
                        kebutuhan makronutrien.
                    </p>

                </div>

            </div>

        `;

        return;
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
       GOAL / TUJUAN
       ===================================================== */

    let calories;
    let goalText;


    if (goalInput.value === "fatloss") {

        /*
         Defisit sekitar 20%
        */

        calories =
            tdee * 0.80;

        goalText =
            "Fat Loss";

    }


    else if (goalInput.value === "bulking") {

        /*
         Surplus sekitar 10%
        */

        calories =
            tdee * 1.10;

        goalText =
            "Muscle Gain";

    }


    else {

        calories =
            tdee;

        goalText =
            "Maintenance";

    }



    /* =====================================================
       PROTEIN
       1.8 g / kg berat badan
       ===================================================== */

    const protein =
        weight * 1.8;


    const proteinCalories =
        protein * 4;



    /* =====================================================
       LEMAK
       25% TOTAL KALORI
       ===================================================== */

    const fatCalories =
        calories * 0.25;


    const fat =
        fatCalories / 9;



    /* =====================================================
       KARBOHIDRAT
       SISA KALORI
       ===================================================== */

    const carbCalories =
        calories -
        proteinCalories -
        fatCalories;


    const carbs =
        Math.max(
            0,
            carbCalories / 4
        );



    /* =====================================================
       PERSENTASE KALORI
       ===================================================== */

    const proteinPercent =
        Math.min(
            (proteinCalories / calories) * 100,
            100
        );


    const carbsPercent =
        Math.min(
            (carbCalories / calories) * 100,
            100
        );


    const fatPercent =
        Math.min(
            (fatCalories / calories) * 100,
            100
        );



    /* =====================================================
       HASIL
       ===================================================== */

    result.className =
        "kal-result macro-result";


    result.innerHTML = `


        <!-- ===============================================
             HEADER
        ================================================ -->

        <div class="macro-result-header">

            <div>

                <span class="macro-result-label">
                    TARGET KALORI HARIAN
                </span>


                <strong class="macro-calorie-number">

                    ${Math.round(calories)}

                    <small>
                        kkal
                    </small>

                </strong>

            </div>


            <span class="macro-goal-badge">

                ${goalText}

            </span>

        </div>



        <div class="macro-divider"></div>



        <!-- ===============================================
             PROTEIN
        ================================================ -->

        <div class="macro-progress-item">


            <div class="macro-progress-header">

                <span class="macro-name">
                    Protein
                </span>


                <strong>
                    ${Math.round(protein)} g
                </strong>

            </div>


            <div
                class="macro-progress-track"
                role="progressbar"
                aria-label="Protein"
                aria-valuenow="${Math.round(proteinPercent)}"
                aria-valuemin="0"
                aria-valuemax="100"
            >

                <div
                    class="macro-progress-fill protein-fill"
                    style="width: ${proteinPercent}%"
                ></div>

            </div>


            <div class="macro-progress-footer">

                <span>
                    ${Math.round(proteinCalories)} kkal
                </span>


                <span>
                    ${Math.round(proteinPercent)}%
                </span>

            </div>

        </div>



        <!-- ===============================================
             KARBOHIDRAT
        ================================================ -->

        <div class="macro-progress-item">


            <div class="macro-progress-header">

                <span class="macro-name">
                    Karbohidrat
                </span>


                <strong>
                    ${Math.round(carbs)} g
                </strong>

            </div>


            <div
                class="macro-progress-track"
                role="progressbar"
                aria-label="Karbohidrat"
                aria-valuenow="${Math.round(carbsPercent)}"
                aria-valuemin="0"
                aria-valuemax="100"
            >

                <div
                    class="macro-progress-fill carbs-fill"
                    style="width: ${carbsPercent}%"
                ></div>

            </div>


            <div class="macro-progress-footer">

                <span>
                    ${Math.round(carbCalories)} kkal
                </span>


                <span>
                    ${Math.round(carbsPercent)}%
                </span>

            </div>

        </div>



        <!-- ===============================================
             LEMAK
        ================================================ -->

        <div class="macro-progress-item">


            <div class="macro-progress-header">

                <span class="macro-name">
                    Lemak
                </span>


                <strong>
                    ${Math.round(fat)} g
                </strong>

            </div>


            <div
                class="macro-progress-track"
                role="progressbar"
                aria-label="Lemak"
                aria-valuenow="${Math.round(fatPercent)}"
                aria-valuemin="0"
                aria-valuemax="100"
            >

                <div
                    class="macro-progress-fill fat-fill"
                    style="width: ${fatPercent}%"
                ></div>

            </div>


            <div class="macro-progress-footer">

                <span>
                    ${Math.round(fatCalories)} kkal
                </span>


                <span>
                    ${Math.round(fatPercent)}%
                </span>

            </div>

        </div>



        <!-- ===============================================
             SUMMARY
        ================================================ -->

        <div class="macro-summary">


            <div>

                <span>
                    Estimasi TDEE
                </span>


                <strong>
                    ${Math.round(tdee)} kkal
                </strong>

            </div>


            <div>

                <span>
                    Tujuan
                </span>


                <strong>
                    ${goalText}
                </strong>

            </div>


        </div>



        <!-- ===============================================
             NOTE
        ================================================ -->

        <p class="macro-note">

            Pembagian makronutrien merupakan estimasi
            untuk tujuan edukasi. Kebutuhan individu
            dapat berbeda berdasarkan kondisi dan
            tujuan masing-masing.

        </p>


    `;
}



/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

/*
   Memungkinkan pengguna menekan ENTER
   untuk menghitung sesuai bagian kalkulator.
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* BMI */

        const bmiInputs = [
            document.getElementById("weight"),
            document.getElementById("height")
        ];


        bmiInputs.forEach(
            function (input) {

                if (!input) {
                    return;
                }


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (event.key === "Enter") {

                            event.preventDefault();

                            calculateBMI();

                        }

                    }
                );

            }
        );



        /* BMR */

        const bmrInputs = [
            document.getElementById("age"),
            document.getElementById("weightBMR"),
            document.getElementById("heightBMR")
        ];


        bmrInputs.forEach(
            function (input) {

                if (!input) {
                    return;
                }


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (event.key === "Enter") {

                            event.preventDefault();

                            calculateTDEE();

                        }

                    }
                );

            }
        );



        /* MACRO */

        const macroInputs = [
            document.getElementById("macroAge"),
            document.getElementById("macroWeight"),
            document.getElementById("macroHeight")
        ];


        macroInputs.forEach(
            function (input) {

                if (!input) {
                    return;
                }


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (event.key === "Enter") {

                            event.preventDefault();

                            calculateMacros();

                        }

                    }
                );

            }
        );

    }
);
