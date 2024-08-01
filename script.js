let currentSlideIndex = 0;
let images = [];

// Fungsi untuk menampilkan indikator loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
}

// Fungsi untuk menyembunyikan indikator loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

// Event listener untuk form submit
document.getElementById('downloadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showLoading();  // Tampilkan loading sebelum memulai fetch

    const url = document.getElementById('tiktokUrl').value;
    fetch(`https://api.tiklydown.eu.org/api/download/v3?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            hideLoading();  // Sembunyikan loading setelah data diterima

            if (data.status === 200) {
                const result = data.result;
                document.getElementById('userAvatar').src = result.author.avatar || "";
                document.getElementById('username').innerText = result.author.nickname || "Tidak diketahui";
                document.getElementById('description').innerText = result.desc || "Tidak ada deskripsi";
                document.getElementById('statistics').innerText = `Likes: ${result.statistics.likeCount}, Comments: ${result.statistics.commentCount}, Shares: ${result.statistics.shareCount}`;

                images = result.images || [];
                loadMediaContent(images);

                document.getElementById('downloadLink1').innerText = images.length > 0 ? "Download this slide" : "No images available";
                document.getElementById('downloadLink1').style.display = images.length > 0 ? "inline" : "none";
                document.getElementById('downloadLink2').innerText = "Download as video";
                document.getElementById('downloadLink2').href = result.video || "#";
                document.getElementById('downloadLink2').style.display = result.video ? "inline" : "none";
                document.getElementById('downloadLink3').innerText = "Download MP3";
                document.getElementById('downloadLink3').href = result.music || "#";
                document.getElementById('downloadLink3').style.display = result.music ? "inline" : "none";

                document.getElementById('result').style.display = 'block';
                currentSlideIndex = 0;
                updateSlidePosition();
                updateDots();
            } else {
                alert('Failed to fetch download links. Please check the URL and try again');
            }
        })
        .catch(error => {
            hideLoading();  // Sembunyikan loading jika ada error
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
});

function changeSlide(n) {
    currentSlideIndex += n;
    updateSlidePosition();
    updateDots();
}

function updateSlidePosition() {
    const slidesContainer = document.getElementById('slidesContainer');
    const totalSlides = slidesContainer.children.length;
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    }
    if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

function updateDownloadLink() {
    if (images.length > 0) {
        document.getElementById('downloadLink1').href = images[currentSlideIndex] || "#";
    }
}

function updateDots() {
    const dotsContainer = document.getElementById('dotsContainer');
    dotsContainer.innerHTML = '';
    const totalSlides = document.getElementById('slidesContainer').children.length;
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => setCurrentSlide(i));
        dotsContainer.appendChild(dot);
    }
    setActiveDot();
}

function setActiveDot() {
    const dots = document.getElementsByClassName('dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
    }
    if (dots.length > 0) {
        dots[currentSlideIndex].className += ' active';
    }
}

function setCurrentSlide(index) {
    currentSlideIndex = index;
    updateSlidePosition();
}

function loadMediaContent(images) {
    const slidesContainer = document.getElementById('slidesContainer');
    slidesContainer.innerHTML = '';

    if (images && images.length > 0) {
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            slidesContainer.appendChild(imgElement);
        });
        updateDots();
    }
}