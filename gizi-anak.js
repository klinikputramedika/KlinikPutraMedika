/* =========================================================
   KLINIK PUTRA MEDIKA
   KALKULATOR GIZI ANAK
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const tanggalLahir = document.getElementById("tanggalLahir");
    const tanggalPeriksa = document.getElementById("tanggalPeriksa");
    const usiaDisplay = document.getElementById("usiaAnak");

    const tombolHitung = document.getElementById("btnHitungGizi");

    const jenisKelamin = document.getElementById("jenisKelamin");
    const beratBadan = document.getElementById("beratBadan");
    const tinggiBadan = document.getElementById("tinggiBadan");
    const jenisPengukuran = document.getElementById("jenisPengukuran");

    const hasil = document.getElementById("hasilGizi");


    /* =====================================================
       CEK ELEMEN
    ===================================================== */

    console.log("Kalkulator Gizi Anak aktif.");

    console.log({
        tanggalLahir,
        tanggalPeriksa,
        usiaDisplay,
        tombolHitung,
        jenisKelamin,
        beratBadan,
        tinggiBadan,
        jenisPengukuran,
        hasil
    });


    /* =====================================================
       TANGGAL HARI INI
    ===================================================== */

    if (tanggalPeriksa) {

        const today = new Date();

        tanggalPeriksa.value =
            formatDateInput(today);

    }


    /* =====================================================
       HITUNG USIA OTOMATIS
    ===================================================== */

    function updateUsia() {

        if (
            !tanggalLahir ||
            !tanggalPeriksa ||
            !usiaDisplay
        ) {
            return;
        }


        if (
            !tanggalLahir.value ||
            !tanggalPeriksa.value
        ) {

            usiaDisplay.textContent =
                "Belum dihitung";

            return;
        }


        const lahir =
            parseLocalDate(tanggalLahir.value);

        const periksa =
            parseLocalDate(tanggalPeriksa.value);


        if (
            !lahir ||
            !periksa ||
            periksa < lahir
        ) {

            usiaDisplay.textContent =
                "Tanggal tidak valid";

            return;
        }


        const usia =
            hitungUsia(lahir, periksa);


        usiaDisplay.innerHTML = `

            <strong>
                ${usia.tahun} tahun
                ${usia.bulan} bulan
                ${usia.hari} hari
            </strong>

            <small>
                (${usia.totalBulan} bulan)
            </small>

        `;
    }


    tanggalLahir?.addEventListener(
        "change",
        updateUsia
    );


    tanggalPeriksa?.addEventListener(
        "change",
        updateUsia
    );


    /* =====================================================
       TOMBOL HITUNG
    ===================================================== */

    if (tombolHitung) {

        tombolHitung.addEventListener(
            "click",
            hitungGizi
        );

    }


    /* =====================================================
       FUNGSI HITUNG GIZI
    ===================================================== */

    function hitungGizi() {

        if (
            !tanggalLahir ||
            !tanggalPeriksa ||
            !jenisKelamin ||
            !beratBadan ||
            !tinggiBadan ||
            !hasil
        ) {

            console.error(
                "Elemen kalkulator tidak lengkap."
            );

            return;
        }


        const lahir =
            parseLocalDate(tanggalLahir.value);

        const periksa =
            parseLocalDate(tanggalPeriksa.value);

        const berat =
            parseFloat(beratBadan.value);

        const tinggi =
            parseFloat(tinggiBadan.value);


        /* ================================================
           VALIDASI
        ================================================ */

        if (!lahir || !periksa) {

            tampilkanError(
                "Silakan masukkan tanggal lahir dan tanggal pemeriksaan."
            );

            return;
        }


        if (periksa < lahir) {

            tampilkanError(
                "Tanggal pemeriksaan tidak boleh lebih awal daripada tanggal lahir."
            );

            return;
        }


        if (
            isNaN(berat) ||
            berat <= 0
        ) {

            tampilkanError(
                "Masukkan berat badan yang valid."
            );

            return;
        }


        if (
            isNaN(tinggi) ||
            tinggi <= 0
        ) {

            tampilkanError(
                "Masukkan tinggi atau panjang badan yang valid."
            );

            return;
        }


        /* ================================================
           USIA
        ================================================ */

        const usia =
            hitungUsia(lahir, periksa);


        updateUsia();


        /* ================================================
           IMT
        ================================================ */

        const tinggiMeter =
            tinggi / 100;

        const imt =
            berat /
            (tinggiMeter * tinggiMeter);


        /* ================================================
           KATEGORI EDUKATIF

           Catatan:
           Penilaian klinis anak harus menggunakan
           IMT/U berdasarkan standar WHO.
        ================================================ */

        let status;
        let derajat;
        let statusClass;
        let penjelasan;


        if (imt < 13) {

            status =
                "Berat badan sangat rendah";

            derajat =
                "Perlu evaluasi lebih lanjut";

            statusClass =
                "status-kurang";

            penjelasan =
                "Nilai IMT relatif rendah. Hasil perlu dibandingkan dengan standar pertumbuhan menurut umur dan jenis kelamin.";

        }

        else if (imt < 15) {

            status =
                "Berat badan relatif rendah";

            derajat =
                "Perlu perhatian";

            statusClass =
                "status-waspada";

            penjelasan =
                "Nilai IMT relatif rendah. Penilaian lebih akurat membutuhkan interpretasi IMT menurut umur.";

        }

        else if (imt < 18) {

            status =
                "Rentang relatif sesuai";

            derajat =
                "Perlu dibandingkan dengan standar";

            statusClass =
                "status-normal";

            penjelasan =
                "Nilai IMT berada pada rentang relatif sesuai, namun status gizi anak tetap harus dinilai berdasarkan umur dan jenis kelamin.";

        }

        else if (imt < 20) {

            status =
                "Berat badan relatif tinggi";

            derajat =
                "Perlu perhatian";

            statusClass =
                "status-lebih";

            penjelasan =
                "Nilai IMT relatif tinggi dan perlu dibandingkan dengan standar IMT menurut umur.";

        }

        else {

            status =
                "Berat badan sangat tinggi";

            derajat =
                "Perlu evaluasi lebih lanjut";

            statusClass =
                "status-obesitas";

            penjelasan =
                "Nilai IMT relatif tinggi. Diperlukan penilaian lebih lanjut menggunakan standar pertumbuhan anak.";

        }


        /* ================================================
           HASIL
        ================================================ */

        hasil.className =
            "gizi-result " + statusClass;


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
                    Status gizi
                </span>

                <strong>
                    ${status}
                </strong>

                <small>
                    ${derajat}
                </small>

            </div>


            <div class="gizi-data-grid">


                <div class="gizi-data">

                    <span>
                        Usia
                    </span>

                    <strong>
                        ${usia.tahun} tahun
                        ${usia.bulan} bulan
                    </strong>

                </div>


                <div class="gizi-data">

                    <span>
                        Jenis kelamin
                    </span>

                    <strong>
                        ${
                            jenisKelamin.value === "laki-laki"
                            ? "Laki-laki"
                            : "Perempuan"
                        }
                    </strong>

                </div>


                <div class="gizi-data">

                    <span>
                        Berat badan
                    </span>

                    <strong>
                        ${berat.toFixed(1)} kg
                    </strong>

                </div>


                <div class="gizi-data">

                    <span>
                        Tinggi / panjang
                    </span>

                    <strong>
                        ${tinggi.toFixed(1)} cm
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
                    ${penjelasan}
                </p>

            </div>


            <div class="gizi-medical-note">

                <strong>
                    Catatan medis
                </strong>

                <p>

                    Pada anak, status gizi tidak dinilai
                    menggunakan batas IMT dewasa.
                    Interpretasi klinis menggunakan
                    indikator antropometri menurut
                    umur dan jenis kelamin.

                </p>

            </div>

        `;


        hasil.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function tampilkanError(pesan) {

        hasil.className =
            "gizi-result status-error";


        hasil.innerHTML = `

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


    /* =====================================================
       HITUNG USIA
    ===================================================== */

    function hitungUsia(lahir, periksa) {

        let tahun =
            periksa.getFullYear() -
            lahir.getFullYear();

        let bulan =
            periksa.getMonth() -
            lahir.getMonth();

        let hari =
            periksa.getDate() -
            lahir.getDate();


        if (hari < 0) {

            bulan--;

            const jumlahHariBulanSebelumnya =
                new Date(
                    periksa.getFullYear(),
                    periksa.getMonth(),
                    0
                ).getDate();

            hari +=
                jumlahHariBulanSebelumnya;
        }


        if (bulan < 0) {

            tahun--;
            bulan += 12;

        }


        const totalBulan =
            tahun * 12 + bulan;


        return {
            tahun,
            bulan,
            hari,
            totalBulan
        };

    }


    /* =====================================================
       PARSE DATE LOCAL
    ===================================================== */

    function parseLocalDate(value) {

        if (!value) {
            return null;
        }


        const parts =
            value.split("-");


        if (parts.length !== 3) {
            return null;
        }


        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    }


    /* =====================================================
       FORMAT DATE INPUT
    ===================================================== */

    function formatDateInput(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    }

});
