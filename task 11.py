import random

def play_guessing_game():
    # Generate a random number between 1 and 9
    random_number = random.randint(1, 9)

    # Get user input for a number
    user_guess = int(input("Guess a number between 1 and 9: "))

    # Compare the numbers and print the result
    if user_guess == random_number:
        print(f"Congratulations! You guessed it right. The number was {random_number}. You win!")
    else:
        print(f"Sorry, you didn't guess correctly.and try sgain the game {random_number}. Try again!")

if __name__ == "__main__":
    play_guessing_game()
