"use strict";

const screens = document.querySelectorAll(".screen");
const nextButtons = document.querySelectorAll("[data-next]");
const previousButtons = document.querySelectorAll("[data-prev]");
const faqItems = document.querySelectorAll(".faq-item");

const approveButton = document.querySelector("#approve-button");
const counterButton = document.querySelector("#counter-button");
const declineButton = document.querySelector("#decline-button");

const counterofferForm = document.querySelector("#counteroffer-form");
const counterofferInput = document.querySelector("#counteroffer-input");
const submitCounterofferButton = document.querySelector(
  "#submit-counteroffer"
);

const resultMessage = document.querySelector("#result-message");
const dateButtons = document.querySelectorAll(".date-option");
const dateResult = document.querySelector("#date-result");
const celebrationVideo = document.querySelector("#celebration-video");
const chosenDateMessage = document.querySelector("#chosen-date-message");
const continueToSurpriseButton = document.querySelector(
  "#continue-to-surprise"
);
const celebrationAudio = document.querySelector("#celebration-audio");

let selectedDate = "";

function showScreen(screenNumber) {
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const targetScreen = document.querySelector(
    `#screen-${screenNumber}`
  );

  if (!targetScreen) {
    console.error(`Screen ${screenNumber} was not found.`);
    return;
  }

  targetScreen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next);
  });
});

previousButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.prev);
  });
});

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

approveButton.addEventListener("click", () => {
  counterofferForm.classList.add("hidden");
  resultMessage.textContent = "";
  showScreen(8);
});

dateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dateButtons.forEach((dateButton) => {
      dateButton.classList.remove("selected");
      dateButton.setAttribute("aria-pressed", "false");
    });

    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    selectedDate = button.dataset.date;
    dateResult.textContent = `${selectedDate} selected! Keep going, one last page.`;
    continueToSurpriseButton.classList.remove("hidden");
  });
});

continueToSurpriseButton.addEventListener("click", () => {
  if (!selectedDate) {
    return;
  }

  chosenDateMessage.textContent = `Spider-Man night: ${selectedDate} 🎉`;
  showScreen(9);

  celebrationVideo.currentTime = 0;
  celebrationVideo.play().catch(() => {
    // The visible controls allow playback if a browser blocks autoplay.
  });

  celebrationAudio.currentTime = 0;
  celebrationAudio.play().catch(() => {
    // Some browsers may still require the user to adjust their sound settings.
  });

  launchConfetti();
});

counterButton.addEventListener("click", () => {
  counterofferForm.classList.toggle("hidden");

  resultMessage.textContent =
    "Counteroffers will be reviewed by the proposal committee.";
});

submitCounterofferButton.addEventListener("click", () => {
  const counteroffer = counterofferInput.value.trim();

  if (!counteroffer) {
    resultMessage.textContent =
      "Please enter at least one revised term.";
    return;
  }

  resultMessage.textContent =
    "Counteroffer received. Please screenshot this and send it to the applicant.";

  counterofferInput.disabled = true;
  submitCounterofferButton.disabled = true;
});

let declineAttempts = 0;

declineButton.addEventListener("mouseenter", moveDeclineButton);
declineButton.addEventListener("click", moveDeclineButton);
declineButton.addEventListener("touchstart", moveDeclineButton);

function moveDeclineButton(event) {
  event.preventDefault();

  declineAttempts += 1;

  const horizontalMovement =
    Math.random() * 220 - 110;

  const verticalMovement =
    Math.random() * 120 - 60;

  declineButton.style.transform =
    `translate(${horizontalMovement}px, ${verticalMovement}px)`;

  if (declineAttempts === 1) {
    declineButton.textContent = "Are you sure?";
  } else if (declineAttempts === 2) {
    declineButton.textContent = "Interesting choice...";
  } else if (declineAttempts >= 3) {
    declineButton.textContent = "Submit Counteroffer Instead";
  }
}

function launchConfetti() {
  const canvas = document.querySelector("#confetti-canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#e63946",
    "#ffffff",
    "#f1b84b",
    "#37c978",
    "#5577ff"
  ];

  const pieces = Array.from(
    { length: 180 },
    (_, index) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      width: Math.random() * 7 + 5,
      height: Math.random() * 11 + 7,
      speed: Math.random() * 4 + 2,
      rotation: Math.random() * Math.PI,
      rotationSpeed: Math.random() * 0.08 - 0.04,
      color: colors[index % colors.length]
    })
  );

  let frameCount = 0;

  function animateConfetti() {
    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.rotation += piece.rotationSpeed;

      context.save();

      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.fillStyle = piece.color;

      context.fillRect(
        -piece.width / 2,
        -piece.height / 2,
        piece.width,
        piece.height
      );

      context.restore();
    });

    frameCount += 1;

    if (frameCount < 300) {
      window.requestAnimationFrame(animateConfetti);
    } else {
      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  animateConfetti();
}

window.addEventListener("resize", () => {
  const canvas = document.querySelector("#confetti-canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
