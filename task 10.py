def analyze_paragraph(paragraph):
    # Calculate number of letters
    num_letters = sum(c.isalpha() for c in paragraph)

    # Split the paragraph into words
    words = paragraph.split()

    # Calculate number of words
    num_words = len(words)

    # Count the repetition of each word
    word_counts = {}
    for word in words:
        word_counts[word] = word_counts.get(word, 0) + 1

    print(f"Number of letters: {num_letters}")
    print(f"Number of words: {num_words}")
    print("\nWord counts and repetitions:")
    for word, count in word_counts.items():
        print(f"{word}: Count = {count}")

if __name__ == "__main__":
    # Get user input for the paragraph
    input_paragraph = input("Enter a paragraph:\n")

    # Analyze and print the results
    analyze_paragraph(input_paragraph)
