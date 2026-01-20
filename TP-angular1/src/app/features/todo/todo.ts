import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo.interface';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css'
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  newTodoTitle = signal('');
  todos = this.todoService.todoList; 
  newTodoDescription = signal('');

  ngOnInit(): void {
    this.todoService.getTodo();
  }

  addTodo(): void {
    const title = this.newTodoTitle().trim();
    const description = this.newTodoDescription().trim();
    
    if (title) {
      // On envoie les deux champs au service
      this.todoService.addTodo(title, description); 
      this.newTodoTitle.set('');
      this.newTodoDescription.set('');
    }
  }

  saveEdit(todo: Todo, newTitle: string, newDescription: string): void {
    if (newTitle.trim()) {
      todo.title = newTitle;
      todo.description = newDescription;
      this.todoService.updateTodo(todo);
    }
    todo.isEditing = false;
    this.todoService.todoList.update(items => [...items]);
  }


  toggleTodo(todo: Todo): void {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo); 
  }

  editTodo(todo: Todo): void {
    this.todos().forEach(t => t.isEditing = false);
    
    todo.isEditing = true;

    this.todoService.todoList.update(items => [...items]);
  }

  cancelEdit(todo: Todo): void {
    todo.isEditing = false;
    this.todoService.todoList.update(items => [...items]);
  }

  deleteTodo(id: number): void {
    if (confirm('Supprimer cette tâche ?')) {
      this.todoService.deleteTodo(id);
    }
  }
}