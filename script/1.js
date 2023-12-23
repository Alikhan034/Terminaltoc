const classData = {
  "Class 1": "Class 1 description.",
  "Class 2": "Class 2 description.",
  // Add more class data as needed
};

var mySwiper = new Swiper('.swiper-container', {
  loop: true, // Enable loop mode for infinite sliding
  navigation: {
      nextEl: '.swiper-button-next', // Add navigation arrows if you want
      prevEl: '.swiper-button-prev',
  },
});

function showClassData(className, description) {
  document.getElementById('class-name').innerText = className;
  document.getElementById('class-description').innerText = description;
}
