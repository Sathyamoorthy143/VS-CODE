def find_largest_and_smallest(numbers):
    if not numbers:
        print("No numbers entered.")
        return

    largest = float('-inf')  # Set to negative infinity initially
    smallest = float('inf')  # Set to positive infinity initially

    for num in numbers:
        if num > largest:
            largest = num
        if num < smallest:
            smallest = num

    print(f"Largest number: {largest}")
    print(f"Smallest number: {smallest}")

if __name__ == "__main__":
    try:
        num_count = int(input("Enter the number of inputs: "))
        if num_count <= 0:
            print("Please enter a positive number.")
        else:
            numbers = [float(input(f"Enter number {i + 1}: ")) for i in range(num_count)]
            find_largest_and_smallest(numbers)
    except ValueError:
        print("Invalid input. Please enter a valid number.")
