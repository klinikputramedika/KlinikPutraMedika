/* =========================================================
   KLINIK PUTRA MEDIKA
   GIZI ANAK
   ========================================================= */


/* =========================================================
   CHILD NUTRITION CALCULATOR
   ========================================================= */

function calculateChildNutrition() {

    const genderInput =
        document.getElementById("anakGender");

    const ageInput =
        document.getElementById("anakAge");

    const weightInput =
        document.getElementById("anakWeight");

    const heightInput =
        document.getElementById("anakHeight");

    const result =
        document.getElementById("anakResult");


    if (
        !genderInput ||
        !ageInput ||
        !weightInput ||
        !heightInput ||
        !result
    ) {
        return;
    }


    const gender =
        genderInput.value;

    const age =
        parseFloat(ageInput.value);

    const weight =
        parseFloat(weightInput.value);

    const heightCm =
        parseFloat(heightInput.value);


    /* =====================================================
       VALIDATION
    ====================================================== */

    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(heightCm) ||
        age < 0 ||
        age > 19 ||
        weight <= 0 ||
        heightCm <= 0
    ) {

        showChildError(
            result,
            "Silakan lengkapi semua data dengan benar."
        );

        return;
    }


    /* =====================================================
       BMI
    ====================================================== */

    const heightM =
        heightCm / 100;

    const bmi =
        weight / (heightM * heightM);


    /* =====================================================
       GENDER TEXT
    ====================================================== */

    const genderText =
        gender === "male"
            ? "Laki-laki"
            : "Perempuan";


    /* =====================================================
       AGE GROUP
    ====================================================== */

    let ageGroup = "";

    if (age < 5) {

        ageGroup =
            "0–4 tahun";

    } else {

        ageGroup =
            "5–19 tahun";

    }


    /* =====================================================
       RESULT
    ====================================================== */

    result.className =
        "anak-result anak-result-success";


    result.innerHTML = `

        <div class="anak-result-title">
            HASIL PENGUKURAN
        </div>


        <div class="anak-result-main">

            <div class="anak-bmi-value">

                <span>
                    BMI / IMT
                </span>

                <strong>
                    ${bmi.toFixed(1)}
                </strong>

                <small>
                    kg/m²
                </small>

            </div>


            <div class="anak-basic-data">

                <div>

                    <span>
                        Jenis kelamin
                    </span>

                    <strong>
                        ${genderText}
                    </strong>

                </div>


                <div>

                    <span>
                        Usia
                    </span>

                    <strong>
                        ${age} tahun
                    </strong>

                </div>


                <div>

                    <span>
                        Berat
                    </span>

                    <strong>
                        ${weight.toFixed(1)} kg
                    </strong>

                </div>


                <div>

                    <span>
                        Tinggi
                    </span>

                    <strong>
                        ${heightCm.toFixed(1)} cm
                    </strong>

                </div>

            </div>

        </div>


        <div class="anak-age-group">

            <span>
                Kelompok usia
            </span>

            <strong>
                ${ageGroup}
            </strong>

        </div>


        <div class="anak-pending">

            <span>
                📊
            </span>

            <div>

                <strong>
                    Interpretasi pertumbuhan
                </strong>

                <p>
                    Penilaian status gizi anak harus
                    mempertimbangkan BMI/berat/tinggi
                    terhadap usia dan jenis kelamin.
                    Modul standar pertumbuhan sedang
                    dipersiapkan.
                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   ERROR
========================================================= */

function showChildError(result, message) {

    result.className =
        "anak-result anak-result-error";


    result.innerHTML = `

        <div class="anak-error-content">

            <span>
                ⚠️
            </span>

            <div>

                <strong>
                    Perhatian
                </strong>

                <p>
                    ${message}
                </p>

            </div>

        </div>

    `;
}
