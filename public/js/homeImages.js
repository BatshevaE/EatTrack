document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section .background');
    const images = [
        'https://domf5oio6qrcr.cloudfront.net/medialibrary/13503/bigstock-Health-food-selection-super-foods-fruits-veggies.jpg',
        'https://www.apa.org/images/2023-06-continuing-education-nutrition-tile_tcm7-316328.jpg',
        'https://images.squarespace-cdn.com/content/v1/59f0e6beace8641044d76e9c/1572359931877-CE6Q9BP8DCXEWCV18FIY/Nutrition+Basics.jpeg'
    ];
    
    let currentIndex = 0;

    // Set initial background image
    heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;

    // Function to change background image
    function changeBackground() {
        currentIndex = (currentIndex + 1) % images.length; // Loop through images
        heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    }

    // Change background on click
    heroSection.addEventListener('click', changeBackground);
});