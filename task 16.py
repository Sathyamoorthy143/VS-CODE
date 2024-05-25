import random
import string

def generate_unique_passwords(num_passwords, password_length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    passwords = set()

    while len(passwords) < num_passwords:
        password = ''.join(random.sample(characters, password_length))
        passwords.add(password)

    return list(passwords)

if __name__ == "__main__":
    num_passwords = 10

    unique_passwords = generate_unique_passwords(num_passwords)

    print("Generated unique passwords:")
    for i, password in enumerate(unique_passwords, start=1):
        print(f"Password {i}: {password}")
