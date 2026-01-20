import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './todo.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  todoList = signal<Todo[]>([]);

  getTodo() {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todoList.set(data),
      error: (err) => console.error('Erreur lors de la récupération des tâches. Vérifie que tu es connecté !', err)
    });
  }

  addTodo(title: string, description: string) {
    const newEntry = { title, description, completed: false };
    
    this.http.post<Todo>(this.apiUrl, newEntry).subscribe({
        next: (addedTodo) => {
        this.todoList.update(current => [...current, addedTodo]);
        },
        error: (err) => console.error("Erreur lors de l'ajout", err)
    });
    }

    updateTodo(todo: Todo) {
    const url = `${this.apiUrl}/${todo.id}`; 
    
    return this.http.patch<Todo>(url, { 
        title: todo.title, 
        completed: todo.completed 
    }).subscribe({
        next: (val) => console.log('Mise à jour réussie sur le serveur', val),
        error: (err) => console.error('Erreur lors du PATCH', err)
    });
    }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todoList.update(current => current.filter(t => t.id !== id));
      },
      error: (err) => console.error("Erreur lors de la suppression", err)
    });
  }
}