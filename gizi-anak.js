/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR GIZI ANAK
   ========================================================= */


/* =========================================================
   FUNGSI UTAMA
   ========================================================= */

function hitungGiziAnak() {

    const gender = document.getElementById("jenisKelaminAnak");
    const umur = document.getElementById("umurAnak");
    const berat = document.getElementById("beratAnak");
    const tinggi = document.getElementById("tinggiAnak");
    const hasil = document.getElementById("hasilGiziAnak");

    /* Pastikan semua elemen tersedia */
    if (!gender || !umur || !berat || !tinggi || !hasil) {

        console.error(
            "Elemen kalkulator gizi anak tidak ditemukan."
        );

        return;
    }


    /* Ambil nilai */
    const jenisKelamin = gender.value;
    const umurBulan = parseFloat(umur.value);
    const beratKg = parseFloat(berat.value);
    const tinggiCm = parseFloat(tinggi.value);


    /* =====================================================
       VALIDASI
    ===================================================== */

    if (
        isNaN(umurBulan) ||
        isNaN(beratKg) ||
        isNaN(tinggiCm)
    ) {

        tampilkanError(
            hasil,
            "Silakan lengkapi semua data terlebih dahulu."
        );

        return;
    }


    if (
        umurBulan < 0 ||
        umurBulan > 228 ||
        beratKg <= 0 ||
        tinggiCm <= 0
    ) {

        tampilkanError(
            hasil,
            "Pastikan umur, berat badan dan tinggi badan valid."
        );

        return;
    }


    /*
       Kalkulator ini menggunakan pendekatan
       edukatif berbasis IMT menurut umur.

       Untuk penggunaan klinis, penilaian status gizi
       anak sebaiknya menggunakan kurva pertumbuhan
       WHO sesuai umur dan jenis kelamin.
    */


    /* =====================================================
       HITUNG IMT
    ===================================================== */

    const tinggiMeter = tinggiCm / 100;

    const imt =
        beratKg /
        (tinggiMeter * tinggiMeter);


    /* =====================================================
       TENTUKAN KATEGORI SEDERHANA
       BERDASARKAN IMT

       Catatan:
       Untuk penilaian klinis anak, kategori final
       harus berdasarkan IMT menurut umur (IMT/U)
       menggunakan standar WHO.
    ===================================================== */

    let kategori = "";
    let derajat = "";
    let warnaClass = "";
    let deskripsi = "";


    /*
       Karena nilai cut-off IMT anak bergantung
       pada umur dan jenis kelamin, kita tidak
       menggunakan cut-off BMI dewasa.

       Untuk sementara hasil diberikan sebagai
       estimasi edukatif dan mengingatkan pengguna
       bahwa interpretasi klinis membutuhkan
       kurva pertumbuhan.
    */


    if (imt < 13) {

        kategori = "Berat badan sangat rendah";
        derajat = "Perlu evaluasi lebih lanjut";
        warnaClass = "status-severe";
        deskripsi =
            "Nilai IMT relatif rendah. Perlu dilakukan penilaian pertumbuhan berdasarkan IMT menurut umur dan jenis kelamin.";

    }

    else if (imt < 15) {

        kategori = "Berat badan relatif rendah";
        derajat = "Perlu perhatian";
        warnaClass = "status-warning";
        deskripsi =
            "Nilai IMT relatif rendah dan perlu dibandingkan dengan kurva pertumbuhan sesuai umur dan jenis kelamin.";

    }

    else if (imt < 18) {

        kategori = "Rentang relatif sesuai";
        derajat = "Evaluasi dengan kurva pertumbuhan";
        warnaClass = "status-normal";
        deskripsi =
            "Nilai IMT berada pada rentang yang relatif sesuai, namun status gizi anak harus dinilai berdasarkan IMT menurut umur.";

    }

    else if (imt < 20) {

        kategori = "Berat badan relatif tinggi";
        derajat = "Perlu perhatian";
        warnaClass = "status-warning";
        deskripsi =
            "Nilai IMT relatif tinggi. Bandingkan dengan kurva IMT menurut umur untuk menentukan status gizi.";

    }

    else {

        kategori = "Berat badan sangat tinggi";
        derajat = "Perlu evaluasi lebih lanjut";
        warnaClass = "status-severe";
        deskripsi =
            "Nilai IMT relatif tinggi dan memerlukan penilaian lebih lanjut berdasarkan IMT menurut umur.";

    }


    /* =====================================================
       HASIL
    ===================================================== */

    hasil.className =
        "gizi-anak-result " + warnaClass;


    hasil.innerHTML = `

        <div class="gizi-result-header">

            <div>

                <span class="gizi-result-label">
                    HASIL PENILAIAN
                </span>

                <h3>
                    Status Gizi Anak
                </h3>

            </div>

            <div class="gizi-result-icon">
                📊
            </div>

        </div>


        <div class="gizi-status">

            <span>
                Status
            </span>

            <strong>
                ${kategori}
            </strong>

            <small>
                ${derajat}
            </small>

        </div>


        <div class="gizi-data-grid">


            <div class="gizi-data">

                <span>
                    Umur
                </span>

                <strong>
                    ${formatUmur(umurBulan)}
                </strong>

            </div>


            <div class="gizi-data">

                <span>
                    Jenis kelamin
                </span>

                <strong>
                    ${jenisKelamin === "laki-laki"
                        ? "Laki-laki"
                        : "Perempuan"}
                </strong>

            </div>


            <div class="gizi-data">

                <span>
                    Berat badan
                </span>

                <strong>
                    ${beratKg.toFixed(1)} kg
                </strong>

            </div>


            <div class="gizi-data">

                <span>
                    Tinggi badan
                </span>

                <strong>
                    ${tinggiCm.toFixed(1)} cm
                </strong>

            </div>


            <div class="gizi-data gizi-data-full">

                <span>
                    IMT
                </span>

                <strong>
                    ${imt.toFixed(1)} kg/m²
                </strong>

            </div>


        </div>


        <div class="gizi-result-description">

            <span>
                💡
            </span>

            <p>
                ${deskripsi}
            </p>

        </div>


        <div class="gizi-medical-note">

            <strong>
                Catatan medis
            </strong>

            <p>
                Pada anak, status gizi tidak ditentukan
                menggunakan batas IMT dewasa. Penilaian
                yang tepat menggunakan indikator
                <strong>IMT menurut umur (IMT/U)</strong>
                berdasarkan umur dan jenis kelamin,
                kemudian dibandingkan dengan standar
                pertumbuhan yang sesuai.
            </p>

        </div>

    `;


    /* Scroll ke hasil */

    hasil.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================================
   FORMAT UMUR
   ========================================================= */

function formatUmur(bulan) {

    if (bulan < 12) {

        return `${bulan} bulan`;

    }


    const tahun = Math.floor(bulan / 12);

    const sisaBulan = bulan % 12;


    if (sisaBulan === 0) {

        return `${tahun} tahun`;

    }


    return `${tahun} tahun ${sisaBulan} bulan`;

}


/* =========================================================
   ERROR
   ========================================================= */

function tampilkanError(element, pesan) {

    element.className =
        "gizi-anak-result status-error";


    element.innerHTML = `

        <div class="gizi-error">

            <div class="gizi-error-icon">
                ⚠️
            </div>

            <div>

                <strong>
                    Data belum lengkap
                </strong>

                <p>
                    ${pesan}
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   EVENT LISTENER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const tombol =
            document.getElementById(
                "btnHitungGiziAnak"
            );


        if (tombol) {

            tombol.addEventListener(
                "click",
                hitungGiziAnak
            );

        }


        /*
           Enter pada input juga dapat menjalankan
           kalkulator.
        */

        const inputIds = [
            "umurAnak",
            "beratAnak",
            "tinggiAnak"
        ];


        inputIds.forEach(function (id) {

            const input =
                document.getElementById(id);


            if (input) {

                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter"
                        ) {

                            hitungGiziAnak();

                        }

                    }
                );

            }

        });

    }
);
