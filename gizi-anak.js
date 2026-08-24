document.addEventListener("DOMContentLoaded", function () {

    console.log("GIZI-ANAK.JS BERHASIL DIMUAT");


    /* =========================================
       CARI SEMUA ELEMEN
    ========================================= */

    const semuaInput =
        document.querySelectorAll("input");

    const semuaSelect =
        document.querySelectorAll("select");

    const semuaButton =
        document.querySelectorAll("button");


    console.log("Jumlah input:", semuaInput.length);
    console.log("Jumlah select:", semuaSelect.length);
    console.log("Jumlah button:", semuaButton.length);


    /* =========================================
       CARI INPUT TANGGAL
    ========================================= */

    let tanggalLahir = null;
    let tanggalPeriksa = null;


    semuaInput.forEach(function (input) {

        if (input.type === "date") {

            if (!tanggalLahir) {

                tanggalLahir = input;

            } else if (!tanggalPeriksa) {

                tanggalPeriksa = input;

            }

        }

    });


    console.log(
        "Tanggal lahir:",
        tanggalLahir
    );

    console.log(
        "Tanggal pemeriksaan:",
        tanggalPeriksa
    );


    /* =========================================
       CARI BAGIAN USIA
    ========================================= */

    const semuaText =
        document.querySelectorAll(
            "div, span, p, strong"
        );


    let usiaElement = null;


    semuaText.forEach(function (element) {

        const text =
            element.textContent.trim();


        if (
            text === "Belum dihitung" &&
            !usiaElement
        ) {

            usiaElement = element;

        }

    });


    console.log(
        "Elemen usia:",
        usiaElement
    );


    /* =========================================
       HITUNG USIA
    ========================================= */

    function hitungUsia() {

        if (
            !tanggalLahir ||
            !tanggalPeriksa ||
            !usiaElement
        ) {

            console.error(
                "Elemen tanggal atau usia tidak ditemukan."
            );

            return;

        }


        if (
            !tanggalLahir.value ||
            !tanggalPeriksa.value
        ) {

            usiaElement.textContent =
                "Belum dihitung";

            return;

        }


        const lahir =
            new Date(
                tanggalLahir.value + "T00:00:00"
            );


        const periksa =
            new Date(
                tanggalPeriksa.value + "T00:00:00"
            );


        if (periksa < lahir) {

            usiaElement.textContent =
                "Tanggal tidak valid";

            return;

        }


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

            const hariBulanSebelumnya =
                new Date(
                    periksa.getFullYear(),
                    periksa.getMonth(),
                    0
                ).getDate();

            hari +=
                hariBulanSebelumnya;

        }


        if (bulan < 0) {

            tahun--;

            bulan += 12;

        }


        const totalBulan =
            tahun * 12 + bulan;


        usiaElement.innerHTML =
            `${tahun} tahun ${bulan} bulan ${hari} hari
             <small>(${totalBulan} bulan)</small>`;


        console.log(
            "USIA:",
            tahun,
            "tahun",
            bulan,
            "bulan",
            hari,
            "hari"
        );

    }


    /* =========================================
       EVENT TANGGAL
    ========================================= */

    if (tanggalLahir) {

        tanggalLahir.addEventListener(
            "change",
            hitungUsia
        );

    }


    if (tanggalPeriksa) {

        tanggalPeriksa.addEventListener(
            "change",
            hitungUsia
        );

    }


    /* =========================================
       CARI TOMBOL NILAI STATUS GIZI
    ========================================= */

    let tombolHitung = null;


    semuaButton.forEach(function (button) {

        const text =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            text.includes("nilai status gizi")
        ) {

            tombolHitung = button;

        }

    });


    console.log(
        "Tombol hitung:",
        tombolHitung
    );


    /* =========================================
       CARI AREA HASIL
    ========================================= */

    let hasil = null;


    semuaText.forEach(function (element) {

        const text =
            element.textContent.trim();


        if (
            text ===
            "Hasil status gizi akan muncul setelah data dihitung."
        ) {

            hasil = element.parentElement;

        }

    });


    console.log(
        "Area hasil:",
        hasil
    );


    /* =========================================
       TOMBOL HITUNG
    ========================================= */

    if (tombolHitung) {

        tombolHitung.addEventListener(
            "click",
            function () {

                console.log(
                    "TOMBOL STATUS GIZI DIKLIK"
                );


                /* Update usia */

                hitungUsia();


                /* =================================
                   CARI ANGKA BERAT & TINGGI
                ================================= */

                const angka =
                    document.querySelectorAll(
                        'input[type="number"]'
                    );


                let berat = null;
                let tinggi = null;


                if (angka.length >= 1) {

                    berat =
                        parseFloat(
                            angka[0].value
                        );

                }


                if (angka.length >= 2) {

                    tinggi =
                        parseFloat(
                            angka[1].value
                        );

                }


                console.log(
                    "Berat:",
                    berat
                );

                console.log(
                    "Tinggi:",
                    tinggi
                );


                if (
                    !berat ||
                    !tinggi
                ) {

                    if (hasil) {

                        hasil.innerHTML = `

                            <div class="gizi-error">

                                ⚠️

                                <strong>
                                    Data belum lengkap
                                </strong>

                                <p>
                                    Silakan masukkan
                                    berat badan dan
                                    tinggi/panjang badan.
                                </p>

                            </div>

                        `;

                    }

                    return;

                }


                /* =================================
                   HITUNG IMT
                ================================= */

                const tinggiMeter =
                    tinggi / 100;


                const imt =
                    berat /
                    (
                        tinggiMeter *
                        tinggiMeter
                    );


                /* =================================
                   TAMPILKAN HASIL
                ================================= */

                if (hasil) {

                    hasil.innerHTML = `

                        <div class="gizi-result-header">

                            <div>

                                <span>
                                    HASIL PENILAIAN
                                </span>

                                <h3>
                                    Status Gizi Anak
                                </h3>

                            </div>

                            <div>
                                📊
                            </div>

                        </div>


                        <div class="gizi-status">

                            <span>
                                IMT
                            </span>

                            <strong>
                                ${imt.toFixed(1)}
                                kg/m²
                            </strong>

                            <small>
                                Hasil perhitungan awal
                            </small>

                        </div>


                        <div class="gizi-result-description">

                            <p>

                                Kalkulator berhasil
                                membaca data anak.

                            </p>

                        </div>


                    `;

                }

            }
        );

    }


});
