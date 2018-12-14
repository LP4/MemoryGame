// Waits until the whole document has loaded
document.addEventListener("DOMContentLoaded", function() {
    // Gets all the card elements
    let cards = document.getElementsByClassName("card");
    // Keeps track of the number of cards with a symbol
    let run = 0;
    // The symbol that the cards have
    let symbol = ["!", "@", "£", "$", "%", "^", "&", "*", "!", "@", "£", "$", "%", "^", "&", "*"];
    // Watches whether the you are flipping over a single card or
    // you are flipping a second card to check against another one
    let currentPair = 0;
    // The amount of cards that have been matched
    let matchCount = 0;
    // The first card flipped
    let previousCard;
    // Records when the first card was clicked
    let firstClick = 0;
    // Records the amount of time past since the first card was clicked
    let seconds = document.getElementById("seconds");
    // A variable that will run every second to record the time past
    let tick;
    // Records the star rating
    let stars = document.getElementById("stars");

    let matched = document.getElementById("matched");
    let moveCount = document.getElementById("moveCount");

    // When you click the restart button element...
    document.getElementById("restart").addEventListener("click", function() {
        // ...refresh the page
        window.location.reload();
    });

    // Lops through all the cards
    for (let i = 0; i < cards.length; i++) {
        addSymbol();
    }

    function addSymbol() {
        let a = Math.floor(Math.random() * 16);

        // If the random card chosen has no symbol...
        if (cards[a].textContent === "") {
            // Add a symbol
            cards[a].textContent = symbol[run];
            // Give it an id
            cards[a].id = `match${run + 1}`;

            // Increments the run count
            ++run;
        } else {
            // ...repeat the function until an empty card is found
            addSymbol();
        }
    }

    function cardClick() {
            // Selects a specific card to the check for a match attempt
            matchAttempt(this);
    }

    function matchAttempt(currentCard) {
        // Increment the move count
        moveCount.textContent = Number(moveCount.textContent) + 1;

        if (firstClick === 0) {
            // Start the timer after the first card is clicked
            ++firstClick;
            startTimer();
        }

        // If it is the first of the two cards that will be flipped...
        if (currentPair == 0) {
            // Increment the currentPair value
            currentPair++;
            // The card clicked is now the previous card
            previousCard = currentCard;

            // Reveal the card's symbol by changing the text color
            previousCard.style.color = "#000000";
        } else {
            // Decrement the currentPair value
            currentPair--;
            // Reveal the card's symbol by changing the text color
            currentCard.style.color = "#000000";

            // After 250 milliseconds...
            setTimeout(function() {
                // If the two cards flipped:
                // Have the same symbol
                // Are not the same card
                if (previousCard.textContent == currentCard.textContent && previousCard.id !== currentCard.id) {
                    // Increment the match count
                    matchCount++;

                    // Change the background color of the two flipped cards (Chartreuse)
                    previousCard.style.backgroundColor = "#7FFF00";
                    currentCard.style.backgroundColor = "#7FFF00";

                    // Change the text color of the two flipped cards (Carmine)
                    previousCard.style.color = "#FF0033";
                    currentCard.style.color = "#FF0033";

                    // Disable the cards
                    previousCard.removeEventListener("click", cardClick);
                    currentCard.removeEventListener("click", cardClick);

                    // If all cards have been matched...
                    if (matchCount == 8) {
                        gameComplete();
                    }

                    // Increment the displayed match count
                    matched.textContent = matchCount;
                } else {
                    // Hide the cards
                    previousCard.style.color = "#FFA500";
                    currentCard.style.color = "#FFA500";
                }
            }, 200);
        }
    }

    function startTimer() {
        // Update the displayed time every second
        tick = setInterval(function() {
            seconds.textContent = Number(seconds.textContent) + 1;

            // Change the star rating after 25, 35, 45 and 50 seconds
            if (String(stars.textContent).length > 1 &&
                (seconds.textContent == 20 ||
                seconds.textContent == 30 ||
                seconds.textContent == 45 ||
                seconds.textContent == 60)) {
                // Get all the displayed stars and put them into an array
                let newStars = String(stars.textContent).split("");
                // Remove one star
                newStars.pop();
                
                // The displayed star rating is now decreased by one
                stars.textContent = newStars.join("");
            }
        }, 1000);
    }

    function gameComplete() {
        // Stop the timer
        clearInterval(tick);

	    // Get the element current displaying the move count
	    let messageBox = document.getElementById("gameStatus");
        // Change the element's id to change the styling (via the css file)
        messageBox.id = "gameComplete";
	    // Change the text
	    messageBox.textContent = "You win!";

        // setTimeout allows the styling on the last two cards and the game
        // status box to be updated before the alert box appears
        setTimeout(function() {
	        // Ask if the user wants to play again
	        let playAgain = confirm(`Congratulations, you win!\nYou used: ${moveCount.textContent} moves\nYou took: ${seconds.textContent} seconds\nYour star rating is: ${stars.textContent.length}\n\nWould you like to play again?`);

	        // If true...
	        if (playAgain) {
	            // Reload the page...
	            window.location.reload();
	        }
	    }, 0);
    }

    for (let i = 0; i < cards.length; i++) {
        // Add an event listener to each of the cards
        cards[i].addEventListener("click", cardClick);
    }
});