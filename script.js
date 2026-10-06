/* =====================================================
   KONFIGURASI
===================================================== */

const TOTAL_SCENES = 14;

let currentScene = 0;
let isAnimating = false;


/* =====================================================
   ELEMENT
===================================================== */

const sceneTrack = document.getElementById("sceneTrack");

const scenes = document.querySelectorAll(".scene");

const menuPanel = document.getElementById("menuPanel");

const menuButton = document.getElementById("menuButton");

const musicButton = document.getElementById("musicButton");

const music = document.getElementById("music");

const openInvitation =
    document.getElementById("openInvitation");

const pageNumber =
    document.getElementById("currentPage");

const galleryModal =
    document.getElementById("galleryModal");

const galleryImage =
    document.getElementById("galleryImage");


/* =====================================================
   LOADING CEPAT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loadingScreen =
        document.getElementById("loadingScreen");

    setTimeout(() => {

        if (loadingScreen) {
            loadingScreen.classList.add("hide");
        }

    }, 600);

});


/*
   Pengaman agar loading tidak pernah
   tertahan karena gambar/musik.
*/

setTimeout(() => {

    const loadingScreen =
        document.getElementById("loadingScreen");

    if (loadingScreen) {
        loadingScreen.classList.add("hide");
    }

}, 2500);


/* =====================================================
   SCENE NAVIGATION
===================================================== */

function showScene(index, instant = false) {

    index = Math.max(
        0,
        Math.min(index, TOTAL_SCENES - 1)
    );

    if (isAnimating && !instant) {
        return;
    }

    currentScene = index;

    if (instant) {
        sceneTrack.style.transition = "none";
    } else {
        sceneTrack.style.transition =
            "transform 1.15s cubic-bezier(.77,0,.18,1)";
    }

    sceneTrack.style.transform =
        `translate3d(-${currentScene * 100}vw, 0, 0)`;


    scenes.forEach((scene, i) => {

        scene.classList.toggle(
            "active",
            i === currentScene
        );

    });


    pageNumber.textContent =
        String(currentScene + 1).padStart(2, "0");


    if (!instant) {

        isAnimating = true;

        setTimeout(() => {
            isAnimating = false;
        }, 1150);

    }


    closeMenu();
}


function nextScene() {

    if (currentScene < TOTAL_SCENES - 1) {
        showScene(currentScene + 1);
    }

}


function previousScene() {

    if (currentScene > 0) {
        showScene(currentScene - 1);
    }

}


/* =====================================================
   TOMBOL BERIKUTNYA
===================================================== */

document.querySelectorAll("[data-next]")
    .forEach(button => {

        button.addEventListener("click", () => {

            nextScene();

        });

    });


/* =====================================================
   MENU
===================================================== */

function openMenu() {
    menuPanel.classList.add("open");
}

function closeMenu() {
    menuPanel.classList.remove("open");
}

menuButton.addEventListener("click", () => {

    menuPanel.classList.toggle("open");

});


document.querySelectorAll("[data-go]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                Number(button.dataset.go);

            showScene(target);

        });

    });


/* =====================================================
   MUSIK
===================================================== */

async function startMusic() {

    try {

        await music.play();

        musicButton.classList.add("playing");

        musicButton.title = "Matikan musik";

    } catch (error) {

        console.log(
            "Musik belum dapat diputar:",
            error
        );

    }

}


function stopMusic() {

    music.pause();

    musicButton.classList.remove("playing");

    musicButton.title = "Putar musik";

}


musicButton.addEventListener("click", () => {

    if (music.paused) {

        startMusic();

    } else {

        stopMusic();

    }

});


/*
   Tombol buka undangan:
   Musik langsung dimulai dari interaksi pengguna.
*/

openInvitation.addEventListener("click", async () => {

    await startMusic();

    showScene(1);

});


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener("keydown", event => {

    if (
        galleryModal &&
        galleryModal.classList.contains("open")
    ) {

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowRight") {
            nextGallery();
        }

        if (event.key === "ArrowLeft") {
            previousGallery();
        }

        return;
    }


    if (event.key === "ArrowRight") {
        nextScene();
    }

    if (event.key === "ArrowLeft") {
        previousScene();
    }

    if (event.key === "Escape") {
        closeMenu();
    }

});


/* =====================================================
   SWIPE HP
===================================================== */

let touchStartX = 0;
let touchEndX = 0;

sceneTrack.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


sceneTrack.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;

    if (Math.abs(distance) < 60) {
        return;
    }

    if (distance < 0) {
        nextScene();
    } else {
        previousScene();
    }

}


/* =====================================================
   WHEEL
===================================================== */

let wheelLock = false;

window.addEventListener(
    "wheel",
    event => {

        if (
            galleryModal &&
            galleryModal.classList.contains("open")
        ) {
            return;
        }

        if (wheelLock) {
            return;
        }

        if (Math.abs(event.deltaY) < 25) {
            return;
        }

        wheelLock = true;

        if (event.deltaY > 0) {
            nextScene();
        } else {
            previousScene();
        }

        setTimeout(() => {

            wheelLock = false;

        }, 1100);

    },
    { passive: true }
);


/* =====================================================
   COUNTDOWN
===================================================== */

const weddingDate =
    new Date("2026-10-13T16:00:00+08:00");


function updateCountdown() {

    const now = new Date();

    const difference =
        weddingDate.getTime() - now.getTime();


    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

    const minutes =
        Math.floor(
            (difference / (1000 * 60)) % 60
        );

    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =====================================================
   RSVP WHATSAPP
===================================================== */

const whatsappNumber =
    "6282141275231";


function openWhatsApp(message) {

    if (
        whatsappNumber.includes("X") ||
        whatsappNumber.length < 10
    ) {

        alert(
            "Silakan isi nomor WhatsApp terlebih dahulu di script.js."
        );

        return;

    }

    const url =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


document.getElementById("attendButton")
    .addEventListener("click", () => {

        const message =
`Halo Allsen & Atik,

Saya dengan senang hati akan hadir dalam pernikahan kalian pada 13 Oktober 2026.

Semoga semuanya berjalan lancar dan menjadi hari yang penuh kebahagiaan.

Salam dan doa terbaik. 🙏`;

        openWhatsApp(message);

    });


document.getElementById("notAttendButton")
    .addEventListener("click", () => {

        const message =
`Halo Allsen & Atik,

Mohon maaf saya belum dapat hadir dalam pernikahan kalian pada 13 Oktober 2026.

Saya tetap mengirimkan doa dan kasih untuk kalian.

Semoga Tuhan memberkati perjalanan rumah tangga kalian dan memberikan kebahagiaan selalu. 🙏`;

        openWhatsApp(message);

    });


/* =====================================================
   UCAPAN & DOA
===================================================== */

const wishForm =
    document.getElementById("wishForm");

const wishMessage =
    document.getElementById("wishMessage");


wishForm.addEventListener("submit", event => {

    event.preventDefault();


    const name =
        document.getElementById("guestName").value.trim();

    const wish =
        document.getElementById("guestWish").value.trim();


    if (!name || !wish) {
        return;
    }


    /*
       Untuk versi lokal/static:
       ucapan belum dikirim ke database.

       Untuk sementara dibuat pesan WhatsApp
       agar langsung dapat dikirim kepada pasangan.
    */


    const message = 
`Ucapan untuk Allsen & Atik

Nama:
${name}

Ucapan & Doa:
${wish}`;


    openWhatsApp(message);


    wishMessage.textContent =
        "Terima kasih atas ucapan dan doa yang diberikan.";


    wishForm.reset();

});


/* =====================================================
   SALIN REKENING
===================================================== */

const copyAccount =
    document.getElementById("copyAccount");


copyAccount.addEventListener("click", async () => {

    const account =
        document.getElementById("accountNumber")
        .textContent
        .replace(/\s/g, "");


    try {

        await navigator.clipboard.writeText(account);

        copyAccount.textContent =
            "Berhasil Disalin";

        setTimeout(() => {

            copyAccount.textContent =
                "Salin Nomor Rekening";

        }, 2000);

    } catch (error) {

        alert(
            "Nomor rekening: " + account
        );

    }

});


/* =====================================================
   GALLERY
===================================================== */

const galleryItems =
    document.querySelectorAll(".gallery-item");


const galleryImages =
    Array.from(galleryItems)
        .map(item => item.dataset.image);


let currentGalleryIndex = 0;


galleryItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        currentGalleryIndex = index;

        showGallery();

    });

});


function showGallery() {

    galleryImage.src =
        galleryImages[currentGalleryIndex];

    galleryModal.classList.add("open");

}


function closeGallery() {

    galleryModal.classList.remove("open");

}


function nextGallery() {

    currentGalleryIndex++;

    if (
        currentGalleryIndex >=
        galleryImages.length
    ) {
        currentGalleryIndex = 0;
    }

    showGallery();

}


function previousGallery() {

    currentGalleryIndex--;

    if (currentGalleryIndex < 0) {
        currentGalleryIndex =
            galleryImages.length - 1;
    }

    showGallery();

}


document.getElementById("closeGallery")
    .addEventListener(
        "click",
        closeGallery
    );


document.getElementById("galleryNext")
    .addEventListener(
        "click",
        nextGallery
    );


document.getElementById("galleryPrev")
    .addEventListener(
        "click",
        previousGallery
    );


galleryModal.addEventListener(
    "click",
    event => {

        if (event.target === galleryModal) {
            closeGallery();
        }

    }
);


/* =====================================================
   RESTART
===================================================== */

document.getElementById("restartButton")
    .addEventListener("click", () => {

        showScene(0);

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    });

    

/* =====================================================
   INITIAL
===================================================== */



showScene(0, true);
/* =====================================================
   ✦ LUXURY WEDDING ANIMATION
===================================================== */

(function createLuxuryWeddingAnimation() {

    /* CONTAINER */

    const decor =
        document.createElement("div");

    decor.className =
        "luxury-decor";

    document.body.appendChild(decor);


    /* =================================================
       GOLD PARTICLES
    ================================================= */

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "luxury-particle";

        particle.style.left =
            Math.random() * 100 + "vw";

        particle.style.animationDuration =
            (6 + Math.random() * 8) + "s";

        particle.style.animationDelay =
            (-Math.random() * 12) + "s";

        const size =
            2 + Math.random() * 4;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        decor.appendChild(particle);
    }


    /* =================================================
       FALLING PETALS
    ================================================= */

    for (let i = 0; i < 12; i++) {

        const petal =
            document.createElement("span");

        petal.className =
            "luxury-petal";

        petal.style.left =
            Math.random() * 100 + "vw";

        petal.style.animationDuration =
            (9 + Math.random() * 8) + "s";

        petal.style.animationDelay =
            (-Math.random() * 15) + "s";

        decor.appendChild(petal);
    }


    /* =================================================
       FLOATING STARS
    ================================================= */

    const starSymbols = [
        "✦",
        "✧",
        "⋆",
        "✦",
        "✧",
        "⋆",
        "✦",
        "✧"
    ];

    starSymbols.forEach(function(symbol) {

        const star =
            document.createElement("span");

        star.className =
            "luxury-star";

        star.textContent =
            symbol;

        star.style.left =
            (5 + Math.random() * 90) + "vw";

        star.style.top =
            (10 + Math.random() * 80) + "vh";

        star.style.fontSize =
            (10 + Math.random() * 14) + "px";

        star.style.animationDuration =
            (3 + Math.random() * 4) + "s";

        star.style.animationDelay =
            (-Math.random() * 5) + "s";

        decor.appendChild(star);
    });


    /* =================================================
       GOLD LIGHT
    ================================================= */

    const glow =
        document.createElement("div");

    glow.className =
        "luxury-glow";

    document.body.appendChild(glow);


    console.log(
        "✦ Luxury wedding animation aktif"
    );

})();