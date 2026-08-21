function calculateBMI() {

    const weight =
        Number(
            document.getElementById("weight").value
        );

    const height =
        Number(
            document.getElementById("height").value
        );


    if (
        !weight ||
        !height ||
        weight <= 0 ||
        height <= 0
    ) {

        document.getElementById("bmiResult").innerHTML =
            "Silakan masukkan berat dan tinggi badan yang valid.";

        return;
    }


    const heightMeter =
        height / 100;


    const bmi =
        weight /
        (heightMeter * heightMeter);


    let category;


    if (bmi < 18.5) {

        category = "Underweight";

    } else if (bmi < 25) {

        category = "Normal";

    } else if (bmi < 30) {

        category = "Overweight";

    } else {

        category = "Obese";

    }


    document.getElementById("bmiResult").innerHTML =

        `BMI kamu: ${bmi.toFixed(1)}
        <br>
        Kategori: ${category}`;
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
