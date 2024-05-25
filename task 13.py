from datetime import datetime

def calculate_age(birth_date):
    # Get the current date and time
    current_date = datetime.now()

    # Calculate the age
    age = current_date - birth_date

    # Extract years, months, and days from the age
    years = age.days // 365
    months = (age.days % 365) // 30
    days = (age.days % 365) % 30
    minutes = age.seconds // 60

    return years, months, days, minutes

if __name__ == "__main__":
    # Get user input for date of birth
    dob_str = input("Enter your date of birth (YYYY-MM-DD): ")

    # Convert the input string to a datetime object
    try:
        dob = datetime.strptime(dob_str, "%Y-%m-%d")
    except ValueError:
        print("Invalid date format. Please use YYYY-MM-DD.")
        exit()

    # Calculate and print the age
    years, months, days, minutes = calculate_age(dob)
    print(f"Total Years: {years} years")
    print(f"Total Months: {months} months")
    print(f"Total Days: {days} days")
    print(f"Total Minutes: {minutes} minutes")
