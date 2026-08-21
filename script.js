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


    // Validasi input

    if (
        !weight ||
        !height ||
        weight <= 0 ||
        height <= 0
    ) {

        result.className = "result result-error";

        result.innerHTML = `
            <strong>Data belum lengkap</strong>
            <p>
                Silakan masukkan berat dan tinggi
                badan yang valid.
            </p>
        `;

        return;
    }


    // Konversi tinggi dari cm menjadi meter

    const heightMeter =
        height / 100;


    // Rumus BMI

    const bmi =
        weight /
        (heightMeter * heightMeter);


    // Menentukan kategori

    let category;
    let description;
    let resultClass;


    if (bmi < 18.5) {

        category = "Underweight";

        description =
            "BMI berada di bawah rentang berat badan sehat.";

        resultClass = "result-underweight";


    } else if (bmi < 25) {

        category = "Normal";

        description =
            "BMI berada dalam rentang berat badan sehat.";

        resultClass = "result-normal";


    } else if (bmi < 30) {

        category = "Overweight";

        description =
            "BMI berada di atas rentang berat badan sehat.";

        resultClass = "result-overweight";


    } else {

        category = "Obesity";

        description =
            "BMI berada pada kategori obesitas.";

        resultClass = "result-obesity";

    }


    // Menampilkan hasil

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


    if (
        !age ||
        !weight ||
        !height
    ) {

        document.getElementById("tdeeResult").innerHTML =
            "Silakan lengkapi semua data.";

        return;
    }


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


    const tdee =
        bmr * activity;


    document.getElementById("tdeeResult").innerHTML =

        `BMR: ${Math.round(bmr)} kcal/hari
        <br>
        TDEE: ${Math.round(tdee)} kcal/hari`;
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
