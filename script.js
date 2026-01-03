// Question Class - Generates math questions based on difficulty level
class Question {
    constructor(level) {
        this.level = level;
        this.operators = ['+', '-', '*', '/'];
        this.operator = this.getRandomOperator();
        this.generateOperands();
        this.correctAnswer = this.calculateAnswer();
    }

    // Get random operator from array
    getRandomOperator() {
        var randomIndex = Math.floor(Math.random() * this.operators.length);
        return this.operators[randomIndex];
    }

    // Generate operands based on level difficulty
    generateOperands() {
        var maxNumber = this.getMaxNumber();

        if (this.operator === '-') {
            // Ensure no negative results for subtraction
            this.operand1 = this.getRandomNumber(1, maxNumber);
            this.operand2 = this.getRandomNumber(1, this.operand1);
        } else if (this.operator === '/') {
            // Ensure whole number results for division
            this.operand2 = this.getRandomNumber(1, maxNumber);
            var multiplier = this.getRandomNumber(1, Math.floor(maxNumber / this.operand2));
            this.operand1 = this.operand2 * multiplier;
        } else {
            this.operand1 = this.getRandomNumber(1, maxNumber);
            this.operand2 = this.getRandomNumber(1, maxNumber);
        }
    }

    // Get maximum number based on level
    getMaxNumber() {
        if (this.level === 1) {
            return 5;
        } else if (this.level === 2) {
            return 8;
        } else if (this.level === 3) {
            return 10;
        } else {
            return 10;
        }
    }

    // Get random number in range
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Calculate correct answer
    calculateAnswer() {
        var result = 0;

        if (this.operator === '+') {
            result = this.operand1 + this.operand2;
        } else if (this.operator === '-') {
            result = this.operand1 - this.operand2;
        } else if (this.operator === '*') {
            result = this.operand1 * this.operand2;
        } else if (this.operator === '/') {
            result = this.operand1 / this.operand2;
        }

        return result;
    }

    // Get formatted question text
    getQuestionText() {
        return this.operand1 + ' ' + this.operator + ' ' + this.operand2;
    }

    // Get correct answer
    getAnswer() {
        return this.correctAnswer;
    }
}

// Timer Class - Manages countdown timer
class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.timeRemaining = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.intervalId = null;
    }

    // Start timer countdown
    start() {
        var self = this;
        this.intervalId = setInterval(function() {
            self.timeRemaining--;
            self.onTick(self.timeRemaining);

            if (self.timeRemaining <= 0) {
                self.stop();
                self.onComplete();
            }
        }, 1000);
    }

    // Stop timer
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Reset timer to initial duration
    reset() {
        this.stop();
        this.timeRemaining = this.duration;
    }

    // Format time as MM:SS
    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        var formattedSeconds = secs < 10 ? '0' + secs : secs;
        return formattedMinutes + ':' + formattedSeconds;
    }
}

// UI Class - Handles DOM manipulation
class UI {
    constructor() {
        // Get DOM element references
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.questionDisplay = document.getElementById('questionDisplay');
        this.answerDisplay = document.getElementById('answerDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.finalScore = document.getElementById('finalScore');
        this.finalLevel = document.getElementById('finalLevel');
        this.numberButtons = document.querySelectorAll('.number-btn');
        this.clearButton = document.getElementById('clearBtn');
        this.submitButton = document.getElementById('submitBtn');
    }

    // Show specific screen
    showScreen(screen) {
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');

        if (screen === 'start') {
            this.startScreen.classList.remove('hidden');
        } else if (screen === 'game') {
            this.gameScreen.classList.remove('hidden');
        } else if (screen === 'gameover') {
            this.gameOverScreen.classList.remove('hidden');
        }
    }

    // Update question display
    updateQuestion(text) {
        this.questionDisplay.textContent = text;
    }

    // Update answer display
    updateAnswer(text) {
        this.answerDisplay.textContent = text;
    }

    // Update score display
    updateScore(score) {
        this.scoreDisplay.textContent = score;
    }

    // Update level display
    updateLevel(level) {
        this.levelDisplay.textContent = level;
    }

    // Update timer display
    updateTimer(timeText) {
        this.timerDisplay.textContent = timeText;
    }

    // Clear answer display
    clearAnswer() {
        this.answerDisplay.textContent = '';
    }

    // Show game over screen with final stats
    showGameOver(score, level) {
        this.finalScore.textContent = score;
        this.finalLevel.textContent = level;
        this.showScreen('gameover');
    }

    // Enable calculator buttons
    enableButtons() {
        var i;
        for (i = 0; i < this.numberButtons.length; i++) {
            this.numberButtons[i].disabled = false;
        }
        this.clearButton.disabled = false;
        this.submitButton.disabled = false;
    }

    // Disable calculator buttons
    disableButtons() {
        var i;
        for (i = 0; i < this.numberButtons.length; i++) {
            this.numberButtons[i].disabled = true;
        }
        this.clearButton.disabled = true;
        this.submitButton.disabled = true;
    }
}

// Game Class - Main game controller
class Game {
    constructor() {
        this.ui = new UI();
        this.score = 0;
        this.level = 1;
        this.correctAnswers = 0;
        this.isPlaying = false;
        this.currentQuestion = null;
        this.timer = null;
        this.userAnswer = '';
        this.TIMER_DURATION = 30;
        this.ANSWERS_PER_LEVEL = 5;
        this.MAX_LEVEL = 3;

        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        var self = this;

        // Start button
        document.getElementById('startBtn').addEventListener('click', function() {
            self.start();
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', function() {
            self.reset();
            self.ui.showScreen('start');
        });

        // Number buttons - using loop
        var i;
        for (i = 0; i < this.ui.numberButtons.length; i++) {
            this.ui.numberButtons[i].addEventListener('click', function(e) {
                var number = e.target.getAttribute('data-number');
                self.handleNumberClick(number);
            });
        }

        // Clear button
        this.ui.clearButton.addEventListener('click', function() {
            self.handleClear();
        });

        // Submit button
        this.ui.submitButton.addEventListener('click', function() {
            self.handleSubmit();
        });
    }

    // Start new game
    start() {
        this.isPlaying = true;
        this.ui.showScreen('game');
        this.ui.enableButtons();
        this.nextQuestion();
    }

    // Generate and display next question
    nextQuestion() {
        this.userAnswer = '';
        this.ui.clearAnswer();
        this.currentQuestion = new Question(this.level);
        this.ui.updateQuestion(this.currentQuestion.getQuestionText());
        this.startTimer();
    }

    // Start countdown timer
    startTimer() {
        var self = this;

        if (this.timer) {
            this.timer.stop();
        }

        this.timer = new Timer(
            this.TIMER_DURATION,
            function(timeRemaining) {
                var formattedTime = self.timer.formatTime(timeRemaining);
                self.ui.updateTimer(formattedTime);
            },
            function() {
                self.gameOver();
            }
        );

        this.timer.start();
        this.ui.updateTimer(this.timer.formatTime(this.TIMER_DURATION));
    }

    // Handle number button click
    handleNumberClick(number) {
        if (!this.isPlaying) {
            return;
        }

        this.userAnswer = this.userAnswer + number;
        this.ui.updateAnswer(this.userAnswer);
    }

    // Handle clear button click
    handleClear() {
        if (!this.isPlaying) {
            return;
        }

        this.userAnswer = '';
        this.ui.clearAnswer();
    }

    // Handle submit button click
    handleSubmit() {
        if (!this.isPlaying || this.userAnswer === '') {
            return;
        }

        this.checkAnswer(parseInt(this.userAnswer));
    }

    // Check if answer is correct
    checkAnswer(userAnswer) {
        var correctAnswer = this.currentQuestion.getAnswer();

        if (userAnswer === correctAnswer) {
            this.score = this.score + 10;
            this.correctAnswers = this.correctAnswers + 1;
            this.ui.updateScore(this.score);

            // Check if completed all levels
            if (this.level === this.MAX_LEVEL && this.correctAnswers % this.ANSWERS_PER_LEVEL === 0) {
                this.timer.stop();
                this.gameOver();
                return;
            }

            // Check if should level up
            if (this.correctAnswers % this.ANSWERS_PER_LEVEL === 0) {
                this.levelUp();
            }

            this.timer.stop();
            this.nextQuestion();
        } else {
            // Wrong answer - clear and try again
            this.userAnswer = '';
            this.ui.clearAnswer();
        }
    }

    // Increase level
    levelUp() {
        this.level = this.level + 1;
        this.ui.updateLevel(this.level);
    }

    // End game
    gameOver() {
        this.isPlaying = false;
        this.timer.stop();
        this.ui.disableButtons();
        this.ui.showGameOver(this.score, this.level);
    }

    // Reset game state
    reset() {
        this.score = 0;
        this.level = 1;
        this.correctAnswers = 0;
        this.userAnswer = '';
        this.ui.updateScore(this.score);
        this.ui.updateLevel(this.level);
        this.ui.clearAnswer();
    }
}

function startGame() {
    new Game();
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('readystatechange', function() {
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                startGame();
            }
        });
    } else {
        startGame();
    }
} else {
    startGame();
}
