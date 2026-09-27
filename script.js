// Connect the welcome screen, status check, and empty next-section marker.
const welcomeScreen = document.querySelector("#welcome-screen");
const revealButton = document.querySelector("#reveal-button");
const reaction = document.querySelector("#reaction");
const damageButton = document.querySelector("#damage-button");
const damageScreen = document.querySelector("#damage-screen");
const damageTitle = document.querySelector("#damage-title");
const quizScreen = document.querySelector("#quiz-screen");
const quizTitle = document.querySelector("#quiz-title");
const memeBreakScreen = document.querySelector("#meme-break-screen");
const memeBreakTitle = document.querySelector("#meme-break-title");
const incidentScreen = document.querySelector("#incident-screen");
const incidentTitle = document.querySelector("#incident-title");
const confidenceScreen = document.querySelector("#confidence-screen");
const confidenceTitle = document.querySelector("#confidence-title");
const finalScreen = document.querySelector("#final-screen");
const finalTitle = document.querySelector("#final-title");
const finalStatus = document.querySelector("#final-status");
const finalParagraphs = Array.from(document.querySelectorAll("[data-final-paragraph]"));
const finalPhotoImage = document.querySelector("#final-photo-image");
const finalPhotoPlaceholder = document.querySelector("#final-photo-placeholder");
const finalReadyButton = document.querySelector("#final-ready-button");
const finalReadyLabel = finalReadyButton.querySelector("span:first-child");
const shutdownMessage = document.querySelector("#shutdown-message");
const shutdownStatus = document.querySelector("#shutdown-status");
const shutdownLine = document.querySelector("#shutdown-line");
const shutdownEnd = document.querySelector("#shutdown-end");
const restartButton = document.querySelector("#restart-button");
const celebration = document.querySelector("#celebration");

const confidenceValue = document.querySelector("#confidence-value");
const sleepValue = document.querySelector("#sleep-value");
const stressValue = document.querySelector("#stress-value");
const confidenceMeter = document.querySelector(".status-card__meter");
const checkAgainButton = document.querySelector("#check-again-button");
const checkAgainLabel = checkAgainButton.querySelector("span:first-child");
const reassurance = document.querySelector("#reassurance");
const nextButton = document.querySelector("#next-button");
const quizNextButton = document.querySelector("#quiz-next-button");
const breakPhotoFrame = document.querySelector("#break-photo-frame");
const breakPhotoImage = document.querySelector("#break-photo-image");
const breakPhotoPlaceholder = document.querySelector("#break-photo-placeholder");
const breakPhotoPath = document.querySelector("#break-photo-path");
const breakPhotoCounter = document.querySelector("#break-photo-counter");
const breakHelpButton = document.querySelector("#break-help-button");
const breakMessage = document.querySelector("#break-message");
const anotherPhotoButton = document.querySelector("#another-photo-button");
const breakFinale = document.querySelector("#break-finale");
const backToBusinessButton = document.querySelector("#back-to-business-button");
const incidentEntries = Array.from(document.querySelectorAll("[data-report-entry]"));
const incidentAssessment = document.querySelector("#incident-assessment");
const incidentInvestigation = document.querySelector("#incident-investigation");
const investigateButton = document.querySelector("#investigate-button");
const excuseArea = document.querySelector("#excuse-area");
const excuseBubble = document.querySelector("#excuse-bubble");
const oneMoreExcuseButton = document.querySelector("#one-more-excuse-button");
const incidentFinale = document.querySelector("#incident-finale");
const fairEnoughButton = document.querySelector("#fair-enough-button");
const confidenceTrack = document.querySelector("#confidence-track");
const confidenceFill = document.querySelector("#confidence-fill");
const confidencePercent = document.querySelector("#confidence-percent");
const confidenceMessage = document.querySelector("#confidence-message");
const boostConfidenceButton = document.querySelector("#boost-confidence-button");
const boostConfidenceLabel = boostConfidenceButton.querySelector("span:first-child");
const confidenceCompletion = document.querySelector("#confidence-completion");
const whatThenButton = document.querySelector("#what-then-button");
const confidenceRecovery = document.querySelector("#confidence-recovery");
const readyButton = document.querySelector("#ready-button");

const personalPhoto = document.querySelector("#personal-photo");
const photoPlaceholder = document.querySelector("#photo-placeholder");
const SCREEN_TRANSITION_MS = 360;
const QUESTION_TRANSITION_MS = 320;
const REPORT_ENTRY_DELAY_MS = 580;
const CONFIDENCE_STEP_DELAY_MS = 560;
const MAX_DODGES_PER_BUTTON = 3;
const MAX_EXCUSE_CLICKS = 5;
const TEAMMATE_EXCUSES = [
  "I was about to do it.",
  "My internet was slow.",
  "I thought you were doing that part.",
  "I'll send it later.",
  "I forgot.",
  "Wait, which part was mine again? 💀",
];
const BREAK_MESSAGES = [
  "Productivity has left the chat.",
  "That was definitely an important break.",
  "Okay, back to pretending we're productive.",
  "Your brain requested this break.",
  "10/10 use of study time. Probably.",
];
const DODGE_POSITIONS = [
  { x: -9, y: -2, rotation: -1.5 },
  { x: 9, y: 2, rotation: 1.5 },
  { x: -7, y: 2, rotation: 1 },
  { x: 7, y: -2, rotation: -1 },
];
let screenTransitionInProgress = false;
let questionTransitionInProgress = false;
let currentBreakPhoto = 1;
let previousBreakMessage = "";
let previousExcuse = "";
let excuseClickCount = 0;
let reportTimers = [];
let confidenceTimers = [];
let finalTimers = [];
let shutdownTimers = [];
let finalSequenceStarted = false;

function transitionToScreen(currentScreen, nextScreenElement, nextHeading) {
  if (screenTransitionInProgress) {
    return false;
  }

  screenTransitionInProgress = true;
  currentScreen.classList.add("screen--leaving");
  nextScreenElement.hidden = false;
  nextScreenElement.classList.add("screen--entering");

  window.setTimeout(() => {
    currentScreen.hidden = true;
    currentScreen.classList.remove("screen--leaving");
    nextScreenElement.classList.remove("screen--entering");
    nextHeading.focus();
    screenTransitionInProgress = false;
  }, SCREEN_TRANSITION_MS);
  return true;
}

function updateStatusValue(element, value) {
  element.classList.remove("status-value--changing");
  element.textContent = value;
  void element.offsetWidth;
  element.classList.add("status-value--changing");
}

function showPhoto() {
  personalPhoto.hidden = false;
  photoPlaceholder.hidden = true;
}

function showPhotoPlaceholder() {
  personalPhoto.hidden = true;
  photoPlaceholder.hidden = false;
}

function setBreakPhoto(photoNumber) {
  const imagePath = `images/photo${photoNumber}.jpg`;
  breakPhotoImage.hidden = true;
  breakPhotoPlaceholder.hidden = false;
  breakPhotoPath.textContent = imagePath;
  breakPhotoImage.dataset.requestedSource = imagePath;
  breakPhotoImage.src = imagePath;
}

function showBreakPhoto() {
  breakPhotoImage.hidden = false;
  breakPhotoPlaceholder.hidden = true;
}

function showBreakPhotoPlaceholder() {
  breakPhotoImage.hidden = true;
  breakPhotoPlaceholder.hidden = false;
}

function showRandomBreakMessage() {
  const availableMessages = BREAK_MESSAGES.filter(
    (message) => message !== previousBreakMessage,
  );
  const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
  previousBreakMessage = message;
  breakMessage.textContent = message;
  breakMessage.hidden = false;
}

function startMemeBreak() {
  currentBreakPhoto = 1;
  previousBreakMessage = "";
  breakPhotoCounter.textContent = "01 / 03";
  breakMessage.textContent = "";
  breakMessage.hidden = true;
  breakFinale.hidden = true;
  breakHelpButton.hidden = false;
  breakHelpButton.disabled = false;
  anotherPhotoButton.hidden = true;
  anotherPhotoButton.querySelector("span:first-child").textContent = "ANOTHER ONE";
  breakPhotoFrame.classList.remove("is-bouncing", "is-changing");
  setBreakPhoto(currentBreakPhoto);
}

function resetIncidentReport() {
  reportTimers.forEach((timer) => window.clearTimeout(timer));
  reportTimers = [];
  incidentEntries.forEach((entry) => {
    entry.hidden = true;
    entry.classList.remove("incident-entry--revealed");
  });
  incidentAssessment.hidden = true;
  incidentAssessment.classList.remove("incident-assessment--revealed");
  incidentInvestigation.hidden = true;
  investigateButton.hidden = false;
  excuseArea.hidden = true;
  excuseBubble.textContent = "";
  oneMoreExcuseButton.hidden = false;
  incidentFinale.hidden = true;
  previousExcuse = "";
  excuseClickCount = 0;
}

function startIncidentReport() {
  resetIncidentReport();
  incidentEntries.forEach((entry, index) => {
    const timer = window.setTimeout(() => {
      entry.hidden = false;
      entry.classList.add("incident-entry--revealed");

      if (index === incidentEntries.length - 1) {
        const assessmentTimer = window.setTimeout(() => {
          incidentAssessment.hidden = false;
          incidentAssessment.classList.add("incident-assessment--revealed");
          incidentInvestigation.hidden = false;
          investigateButton.focus();
        }, 330);
        reportTimers.push(assessmentTimer);
      }
    }, REPORT_ENTRY_DELAY_MS * (index + 1));
    reportTimers.push(timer);
  });
}

function setConfidenceLevel(level, message) {
  const safeLevel = Math.max(30, Math.min(100, level));
  confidencePercent.textContent = `${safeLevel}%`;
  confidenceFill.style.width = `${safeLevel}%`;
  confidenceTrack.setAttribute("aria-valuenow", String(safeLevel));
  confidenceMessage.textContent = message;
}

function resetConfidenceBoost() {
  confidenceTimers.forEach((timer) => window.clearTimeout(timer));
  confidenceTimers = [];
  setConfidenceLevel(30, "LOADING...");
  boostConfidenceButton.disabled = false;
  boostConfidenceLabel.textContent = "BOOST MY CONFIDENCE";
  confidenceCompletion.hidden = true;
  confidenceRecovery.hidden = true;
}

function startConfidenceBoost() {
  if (boostConfidenceButton.disabled) {
    return;
  }

  boostConfidenceButton.disabled = true;
  boostConfidenceLabel.textContent = "BOOSTING CONFIDENCE...";
  setConfidenceLevel(30, "Still loading...");

  const levels = [
    { percent: 50, message: "Getting there..." },
    { percent: 70, message: "Okay, we're cooking." },
    { percent: 85, message: "Panelist detected. Confidence increasing." },
    { percent: 100, message: "YOU GOT THIS. 💙" },
  ];

  levels.forEach(({ percent, message }, index) => {
    const timer = window.setTimeout(() => {
      setConfidenceLevel(percent, message);

      if (percent === 100) {
        boostConfidenceLabel.textContent = "CONFIDENCE BOOSTED";
        confidenceCompletion.hidden = false;
        whatThenButton.focus();
      }
    }, CONFIDENCE_STEP_DELAY_MS * (index + 1));
    confidenceTimers.push(timer);
  });
}

function clearTimers(timers) {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.length = 0;
}

function showFinalPhoto() {
  finalPhotoImage.hidden = false;
  finalPhotoPlaceholder.hidden = true;
}

function showFinalPhotoPlaceholder() {
  finalPhotoImage.hidden = true;
  finalPhotoPlaceholder.hidden = false;
}

function revealFinalMessage() {
  clearTimers(finalTimers);
  finalParagraphs.forEach((paragraph) => {
    paragraph.hidden = true;
    paragraph.classList.remove("final-paragraph--revealed");
  });
  finalReadyButton.disabled = true;
  finalStatus.classList.remove("final-status--active");

  finalParagraphs.forEach((paragraph, index) => {
    const timer = window.setTimeout(() => {
      paragraph.hidden = false;
      paragraph.classList.add("final-paragraph--revealed");

      if (index === finalParagraphs.length - 1) {
        finalReadyButton.disabled = false;
        finalReadyButton.focus();
      }
    }, 560 * (index + 1));
    finalTimers.push(timer);
  });

  const statusTimer = window.setTimeout(() => {
    finalStatus.classList.add("final-status--active");
  }, 100);
  finalTimers.push(statusTimer);
}

function launchCelebration() {
  const symbols = ["✦", "✧", "✦", "·", "✧", "✦", "✧", "·", "✦", "✧", "✦", "·"];
  const colors = ["#d5efff", "#a9dcff", "#c3f1d9", "#ffe3a9"];

  celebration.replaceChildren(
    ...symbols.map((symbol, index) => {
      const particle = document.createElement("span");
      particle.className = "celebration__particle";
      particle.textContent = symbol;
      particle.style.setProperty("--particle-index", String(index));
      particle.style.setProperty("--particle-color", colors[index % colors.length]);
      particle.style.setProperty("--particle-offset-x", `${(index - 5.5) * 38}px`);
      particle.style.setProperty("--particle-offset-y", `${120 + (index % 3) * 18}px`);
      particle.style.setProperty("--particle-rotation", `${index * 34}deg`);
      return particle;
    }),
  );
  celebration.classList.remove("celebration--active");
  void celebration.offsetWidth;
  celebration.classList.add("celebration--active");
}

function startShutdownSequence() {
  if (finalSequenceStarted) {
    return;
  }

  finalSequenceStarted = true;
  finalReadyButton.disabled = true;
  finalReadyLabel.textContent = "GOOD LUCK! ✓";
  launchCelebration();
  shutdownMessage.hidden = false;
  shutdownStatus.textContent = "";
  shutdownLine.textContent = "";
  shutdownEnd.hidden = true;
  restartButton.hidden = true;

  const shutdownSteps = [
    { delay: 450, status: "SUPPORT PROTOCOL SHUTTING DOWN..." },
    { delay: 1100, line: "Drink water." },
    { delay: 1750, line: "Get some rest." },
    { delay: 2400, line: "Then go do your thing. 😭" },
    { delay: 3100, end: true },
    { delay: 3650, restart: true },
  ];

  shutdownSteps.forEach((step) => {
    const timer = window.setTimeout(() => {
      if (step.status) {
        shutdownStatus.textContent = step.status;
        shutdownStatus.classList.add("shutdown-line--revealed");
      }
      if (step.line) {
        shutdownLine.textContent = step.line;
        shutdownLine.classList.remove("shutdown-line--revealed");
        void shutdownLine.offsetWidth;
        shutdownLine.classList.add("shutdown-line--revealed");
      }
      if (step.end) {
        shutdownEnd.hidden = false;
        shutdownEnd.classList.add("shutdown-line--revealed");
      }
      if (step.restart) {
        restartButton.hidden = false;
        restartButton.focus();
      }
    }, step.delay);
    shutdownTimers.push(timer);
  });
}

function resetAllSections() {
  clearTimers(reportTimers);
  clearTimers(confidenceTimers);
  clearTimers(finalTimers);
  clearTimers(shutdownTimers);
  screenTransitionInProgress = false;
  questionTransitionInProgress = false;
  finalSequenceStarted = false;

  document.querySelectorAll(".page > section").forEach((section) => {
    section.classList.remove("screen--entering", "screen--leaving");
  });
  welcomeScreen.hidden = false;
  revealButton.hidden = false;
  reaction.hidden = true;

  damageScreen.hidden = true;
  confidenceValue.textContent = "Loading... 73%";
  sleepValue.textContent = "Last seen: somewhere yesterday";
  stressValue.textContent = "Please do not refresh.";
  confidenceMeter.classList.remove("is-improving");
  reassurance.hidden = true;
  nextButton.hidden = true;
  checkAgainButton.disabled = false;
  checkAgainLabel.textContent = "CHECK AGAIN 😭";

  quizScreen.hidden = true;
  document.querySelectorAll(".quiz-question").forEach((question, index) => {
    question.hidden = index !== 0;
    question.classList.remove("question--entering", "question--leaving");
    question.querySelector(".answer-hint").textContent = "";
    question.querySelector(".answer-result").hidden = true;
    question.querySelectorAll(".answer-button").forEach((button) => {
      button.disabled = false;
      button.dataset.dodgeCount = "0";
      delete button.dataset.dodgePosition;
      button.style.transform = "";
      button.classList.remove("is-dodging");
    });
  });
  document.querySelectorAll("[data-progress-step]").forEach((step, index) => {
    step.classList.toggle("is-current", index === 0);
    step.classList.remove("is-complete");
  });

  startMemeBreak();
  memeBreakScreen.hidden = true;
  incidentScreen.hidden = true;
  resetIncidentReport();
  resetConfidenceBoost();

  finalScreen.hidden = true;
  finalParagraphs.forEach((paragraph) => {
    paragraph.hidden = true;
    paragraph.classList.remove("final-paragraph--revealed");
  });
  finalStatus.classList.remove("final-status--active");
  finalReadyButton.disabled = true;
  finalReadyLabel.textContent = "I'M READY 💙";
  shutdownMessage.hidden = true;
  shutdownStatus.textContent = "";
  shutdownStatus.classList.remove("shutdown-line--revealed");
  shutdownLine.textContent = "";
  shutdownLine.classList.remove("shutdown-line--revealed");
  shutdownEnd.hidden = true;
  shutdownEnd.classList.remove("shutdown-line--revealed");
  restartButton.hidden = true;
  celebration.classList.remove("celebration--active");
  celebration.replaceChildren();
}

function showRandomExcuse() {
  const availableExcuses = TEAMMATE_EXCUSES.filter(
    (excuse) => excuse !== previousExcuse,
  );
  const excuse = availableExcuses[Math.floor(Math.random() * availableExcuses.length)];
  previousExcuse = excuse;
  excuseBubble.textContent = excuse;
  excuseBubble.classList.remove("excuse-bubble--pop");
  void excuseBubble.offsetWidth;
  excuseBubble.classList.add("excuse-bubble--pop");
  excuseClickCount += 1;

  if (excuseClickCount >= MAX_EXCUSE_CLICKS) {
    oneMoreExcuseButton.hidden = true;
    window.setTimeout(() => {
      incidentFinale.hidden = false;
      fairEnoughButton.focus();
    }, 320);
    return;
  }

  oneMoreExcuseButton.querySelector("span:first-child").textContent = "ONE MORE EXCUSE";
}

function chooseNextBreakPhoto() {
  currentBreakPhoto += 1;
  breakPhotoCounter.textContent = `0${currentBreakPhoto} / 03`;
  breakPhotoFrame.classList.remove("is-changing");
  void breakPhotoFrame.offsetWidth;
  breakPhotoFrame.classList.add("is-changing");
  setBreakPhoto(currentBreakPhoto);
  showRandomBreakMessage();

  if (currentBreakPhoto === 3) {
    anotherPhotoButton.hidden = true;
    breakHelpButton.hidden = true;
    window.setTimeout(() => {
      breakFinale.hidden = false;
      backToBusinessButton.focus();
    }, 470);
    return;
  }

  anotherPhotoButton.querySelector("span:first-child").textContent = "ONE MORE";
}

function moveWrongAnswer(button, question) {
  const dodgeCount = Number(button.dataset.dodgeCount || 0);
  const hint = question.querySelector(".answer-hint");

  if (dodgeCount >= MAX_DODGES_PER_BUTTON) {
    hint.textContent = "Nice try 😭 Honest answer's still there.";
    return;
  }

  const previousDodgePosition = Number(button.dataset.dodgePosition ?? -1);
  const availablePositions = DODGE_POSITIONS
    .map((position, index) => ({ ...position, index }))
    .filter((position) => position.index !== previousDodgePosition);
  const nextPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

  button.dataset.dodgeCount = String(dodgeCount + 1);
  button.dataset.dodgePosition = String(nextPosition.index);
  button.style.transform =
    `translate(${nextPosition.x}px, ${nextPosition.y}px) rotate(${nextPosition.rotation}deg)`;
  button.classList.add("is-dodging");
  window.setTimeout(() => button.classList.remove("is-dodging"), 260);

  hint.textContent = dodgeCount + 1 === MAX_DODGES_PER_BUTTON
    ? "NOPE. That's your last dodge. The honest answer is still right there. 😭"
    : ["NOPE.", "Try again 💀", "Nice try 😭"][dodgeCount];
}

function acceptAnswer(question) {
  question.querySelectorAll(".answer-button").forEach((button) => {
    button.disabled = true;
  });
  question.querySelector(".answer-hint").textContent = "";
  question.querySelector(".answer-result").hidden = false;
  question.querySelector(".question-next, #quiz-next-button")?.focus();
}

function goToQuestion(currentQuestion, nextQuestion) {
  if (questionTransitionInProgress) {
    return;
  }

  questionTransitionInProgress = true;
  currentQuestion.classList.add("question--leaving");
  nextQuestion.hidden = false;
  nextQuestion.classList.add("question--entering");

  window.setTimeout(() => {
    currentQuestion.hidden = true;
    currentQuestion.classList.remove("question--leaving");
    nextQuestion.classList.remove("question--entering");
    nextQuestion.querySelector("h2").focus();

    const activeStep = Number(nextQuestion.dataset.question);
    document.querySelectorAll("[data-progress-step]").forEach((step) => {
      const stepNumber = Number(step.dataset.progressStep);
      step.classList.toggle("is-current", stepNumber === activeStep);
      step.classList.toggle("is-complete", stepNumber < activeStep);
    });
    questionTransitionInProgress = false;
  }, QUESTION_TRANSITION_MS);
}

revealButton.addEventListener("click", () => {
  revealButton.hidden = true;
  reaction.hidden = false;
  damageButton.focus();
});

damageButton.addEventListener("click", () => {
  transitionToScreen(welcomeScreen, damageScreen, damageTitle);
});

checkAgainButton.addEventListener("click", () => {
  checkAgainButton.disabled = true;
  checkAgainLabel.textContent = "RUNNING DIAGNOSTICS...";
  reassurance.hidden = true;
  nextButton.hidden = true;
  confidenceMeter.classList.remove("is-improving");
  updateStatusValue(confidenceValue, "Loading... 73%");
  updateStatusValue(sleepValue, "Last seen: somewhere yesterday");
  updateStatusValue(stressValue, "Please do not refresh.");

  window.setTimeout(() => {
    updateStatusValue(confidenceValue, "87%");
    updateStatusValue(sleepValue, "Status unknown");
    updateStatusValue(stressValue, "WHY ARE YOU REFRESHING 😭");
    confidenceMeter.classList.add("is-improving");
  }, 520);

  window.setTimeout(() => {
    updateStatusValue(confidenceValue, "99%");
    reassurance.hidden = false;
    nextButton.hidden = false;
    checkAgainButton.disabled = false;
    checkAgainLabel.textContent = "CHECK AGAIN 😭";
    nextButton.focus();
  }, 1120);
});

nextButton.addEventListener("click", () => {
  transitionToScreen(damageScreen, quizScreen, quizTitle);
});

document.querySelectorAll(".quiz-question").forEach((question, questionIndex) => {
  const board = question.querySelector(".answer-board");

  board.querySelectorAll(".answer-button").forEach((button) => {
    button.style.gridRow = button.dataset.position;
    button.addEventListener("click", () => {
      if (question.hidden || questionTransitionInProgress) {
        return;
      }

      if (button.dataset.correct === "true") {
        acceptAnswer(question);
        return;
      }

      moveWrongAnswer(button, question);
    });
  });

  question.querySelector(".question-next")?.addEventListener("click", () => {
    goToQuestion(question, document.querySelector(`#question-${questionIndex + 2}`));
  });
});

quizNextButton.addEventListener("click", () => {
  startMemeBreak();
  transitionToScreen(quizScreen, memeBreakScreen, memeBreakTitle);
});

breakHelpButton.addEventListener("click", () => {
  breakPhotoFrame.classList.remove("is-bouncing");
  void breakPhotoFrame.offsetWidth;
  breakPhotoFrame.classList.add("is-bouncing");
  showRandomBreakMessage();
  anotherPhotoButton.hidden = false;
});

anotherPhotoButton.addEventListener("click", chooseNextBreakPhoto);

backToBusinessButton.addEventListener("click", () => {
  startIncidentReport();
  transitionToScreen(memeBreakScreen, incidentScreen, incidentTitle);
});

investigateButton.addEventListener("click", () => {
  investigateButton.hidden = true;
  excuseArea.hidden = false;
  showRandomExcuse();
});

oneMoreExcuseButton.addEventListener("click", showRandomExcuse);

fairEnoughButton.addEventListener("click", () => {
  resetConfidenceBoost();
  transitionToScreen(incidentScreen, confidenceScreen, confidenceTitle);
});

boostConfidenceButton.addEventListener("click", startConfidenceBoost);

whatThenButton.addEventListener("click", () => {
  confidenceRecovery.hidden = false;
  readyButton.focus();
});

readyButton.addEventListener("click", () => {
  if (transitionToScreen(confidenceScreen, finalScreen, finalTitle)) {
    window.setTimeout(revealFinalMessage, SCREEN_TRANSITION_MS + 40);
  }
});

finalReadyButton.addEventListener("click", startShutdownSequence);

restartButton.addEventListener("click", () => {
  resetAllSections();
  transitionToScreen(finalScreen, welcomeScreen, welcomeScreen.querySelector("h1"));
});

personalPhoto.addEventListener("load", () => {
  if (personalPhoto.naturalWidth > 0) {
    showPhoto();
  }
});

personalPhoto.addEventListener("error", showPhotoPlaceholder);
breakPhotoImage.addEventListener("load", () => {
  if (
    breakPhotoImage.naturalWidth > 0
    && breakPhotoImage.dataset.requestedSource === breakPhotoImage.getAttribute("src")
  ) {
    showBreakPhoto();
  }
});
breakPhotoImage.addEventListener("error", () => {
  if (breakPhotoImage.dataset.requestedSource === breakPhotoImage.getAttribute("src")) {
    showBreakPhotoPlaceholder();
  }
});

finalPhotoImage.addEventListener("load", () => {
  if (finalPhotoImage.naturalWidth > 0) {
    showFinalPhoto();
  }
});
finalPhotoImage.addEventListener("error", showFinalPhotoPlaceholder);

if (personalPhoto.complete) {
  if (personalPhoto.naturalWidth > 0) {
    showPhoto();
  } else {
    showPhotoPlaceholder();
  }
}

if (finalPhotoImage.complete) {
  if (finalPhotoImage.naturalWidth > 0) {
    showFinalPhoto();
  } else {
    showFinalPhotoPlaceholder();
  }
}
