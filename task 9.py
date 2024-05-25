def get_period(timetable, time):
    time = time.upper()  # Convert input time to uppercase for case-insensitivity
    for period_time, period_name in timetable.items():
        start_time, end_time = map(str.upper, period_time.split(" - "))
        if start_time <= time <= end_time:
            return period_name
    return "No class at this time."

def main():
    # Define the college timetable
    college_timetable = {
        "08:00 AM - 09:00 AM": "Period 1: Mathematics",
        "09:00 AM - 10:00 AM": "Period 2: Physics",
        "10:00 AM - 10:15 AM": "Break",
        "10:15 AM - 11:15 AM": "Period 3: Chemistry",
        "11:15 AM - 12:15 PM": "Period 4: English",
        "12:15 PM - 01:15 PM": "Lunch",
        "01:15 PM - 02:15 PM": "Period 5: Computer Science",
        "02:15 PM - 03:15 PM": "Period 6: History",
        "03:15 PM - 03:30 PM": "Break",
        "03:30 PM - 04:30 PM": "Period 7: Physical Education",
        # Add more periods or adjust timings as needed
    }

    # Get user input for time
    input_time = input("Enter the time (HH:MM AM/PM): ")

    # Get and print the corresponding period
    period = get_period(college_timetable, input_time)
    print(f"At {input_time}, you have: {period}")

if __name__ == "__main__":
    main()
