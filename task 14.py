class TaskManager:
    def __init__(self):
        self.tasks = {}
        self.menu_options = {
            "1": self.add_task,
            "2": self.edit_task,
            "3": self.delete_task,
            "4": self.view_tasks,
            "5": self.exit_program
        }

    def add_task(self):
        task_number = input("Enter task number: ")
        task_description = input("Enter task description: ")
        self.tasks[task_number] = task_description
        print(f"Task {task_number} added: {task_description}")

    def edit_task(self):
        task_number = input("Enter task number to edit: ")
        new_description = input("Enter new task description: ")
        if task_number in self.tasks:
            self.tasks[task_number] = new_description
            print(f"Task {task_number} edited: {new_description}")
        else:
            print(f"Task {task_number} not found.")

    def delete_task(self):
        task_number = input("Enter task number to delete: ")
        if task_number in self.tasks:
            del self.tasks[task_number]
            print(f"Task {task_number} deleted.")
        else:
            print(f"Task {task_number} not found.")

    def view_tasks(self):
        if not self.tasks:
            print("No tasks available.")
        else:
            print("\nTask List:")
            for task_number, task_description in self.tasks.items():
                print(f"Task {task_number}: {task_description}")

    def exit_program(self):
        print("Exiting Task Manager. Goodbye!")
        exit()

def main():
    task_manager = TaskManager()

    while True:
        print("\nTask Manager Menu:")
        print("1. Add Task\n2. Edit Task\n3. Delete Task\n4. View Tasks\n5. Exit")

        choice = input("Enter your choice (1-5): ")

        # Use the menu_options dictionary to call the corresponding method
        menu_function = task_manager.menu_options.get(choice)
        if menu_function:
            menu_function()
        else:
            print("Invalid choice. Please enter a number between 1 and 5.")

if __name__ == "__main__":
    main()
