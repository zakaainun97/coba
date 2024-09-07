let images = [];
const thumbnails = document.querySelectorAll(".thumbnail");
const variants = document.querySelectorAll(".variant");

// Mengisi array gambar dari thumbnail dan variant
thumbnails.forEach((thumbnail) => {
  images.push(thumbnail.src.replace("150", "600")); // Mengubah URL dari thumbnail ke ukuran slider
});

variants.forEach((variant) => {
  images.push(variant.src.replace("100x100", "600x300")); // Menambahkan URL varian ke array images
});

let currentIndex = 0;
const slider = document.getElementById("main-slider");
const sliderContainer = document.getElementById("main-slider-container");
const dots = document.querySelectorAll(".dot");
const fullscreenSlider = document.getElementById("fullscreen-slider");
const fullscreenContainer = document.getElementById("fullscreen-container");
const closeBtn = document.getElementById("close-btn");

let startX = 0;
let endX = 0;

// Fungsi untuk mengupdate dots sesuai posisi slide
function updateDots(index) {
  const totalImages = images.length;

  // Reset semua dots
  dots.forEach((dot) => (dot.className = "dot"));

  let dotIndex;

  if (index === 0) {
    dotIndex = 0; // Dot gelap di posisi pertama
  } else if (index === 1) {
    dotIndex = 1; // Dot gelap di posisi kedua
  } else if (index >= 2 && index <= totalImages - 3) {
    dotIndex = 2; // Dot gelap di posisi ketiga untuk gambar tengah
  } else if (index === totalImages - 2) {
    dotIndex = 3; // Dot gelap di posisi keempat saat gambar mendekati akhir
  } else if (index >= totalImages - 1) {
    dotIndex = 4; // Dot gelap di posisi kelima ketika mencapai akhir
  }

  dots.forEach((dot, i) => {
    if (i === dotIndex) {
      dot.classList.add("active"); // Dot yang gelap di posisi saat ini
    } else if (i === dotIndex - 1 || i === dotIndex + 1) {
      dot.classList.add("mid"); // Dot di samping kanan dan kiri
    } else {
      dot.classList.add("small"); // Dot yang paling luar
    }
  });
}

// Fungsi untuk menampilkan gambar dengan animasi slide in/slide out
function showSlide(index, direction) {
  slider.style.transition = "none";
  slider.style.transform = `translateX(${
    direction === "left" ? "100%" : "-100%"
  })`;

  setTimeout(() => {
    slider.src = images[index];
    slider.style.transition = "transform 0.5s ease-in-out";
    slider.style.transform = "translateX(0)";
    updateDots(index); // Update posisi dots
  }, 50);
}

// Event touchstart untuk swipe (gestur geser kanan/kiri)
sliderContainer.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

sliderContainer.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

sliderContainer.addEventListener("touchend", () => {
  const threshold = 50; // Ambang batas untuk menentukan swipe

  if (startX - endX > threshold) {
    currentIndex = (currentIndex + 1) % images.length; // Looping ke awal jika mencapai akhir
    showSlide(currentIndex, "left"); // Ganti gambar ke kiri (slide kanan)
  } else if (endX - startX > threshold) {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Looping ke akhir jika mencapai awal
    showSlide(currentIndex, "right"); // Ganti gambar ke kanan (slide kiri)
  }
});

// Fungsi untuk membuka fullscreen saat klik main slider
slider.addEventListener("click", () => {
  fullscreenSlider.src = slider.src; // Mengambil gambar saat ini di main slider
  fullscreenContainer.style.display = "flex"; // Menampilkan fullscreen
});

// Close fullscreen
closeBtn.addEventListener("click", () => {
  fullscreenContainer.style.display = "none"; // Menutup fullscreen
});

// Swipe di fullscreen
fullscreenSlider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

fullscreenSlider.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

fullscreenSlider.addEventListener("touchend", () => {
  const threshold = 50;

  if (startX - endX > threshold) {
    currentIndex = (currentIndex + 1) % images.length;
    showFullscreenSlide(currentIndex, "left"); // Ganti gambar ke kiri saat di fullscreen
  } else if (endX - startX > threshold) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showFullscreenSlide(currentIndex, "right"); // Ganti gambar ke kanan saat di fullscreen
  }
});

// Fungsi klik pada thumbnail dan variant tetap berfungsi
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    const direction = index > currentIndex ? "left" : "right";
    currentIndex = index;
    showSlide(currentIndex, direction);
  });
});

variants.forEach((variant, index) => {
  variant.addEventListener("click", () => {
    const variantIndex = index + thumbnails.length;
    const direction = variantIndex > currentIndex ? "left" : "right";
    currentIndex = variantIndex;
    showSlide(currentIndex, direction);
  });
});
