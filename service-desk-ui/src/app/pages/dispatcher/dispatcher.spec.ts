import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispatcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatcher.html',
  styleUrl: './dispatcher.css'
})
export class DispatcherComponent {
  requests: any[] = [];
  engineers: any[] = [];
  search = '';
  selectedStatus = '';

  constructor(private http: HttpClient, private router: Router) {
    this.loadRequests();
    this.loadEngineers();
  }

  get newCount() {
    return this.requests.filter(x => x.status === 'Новая').length;
  }

  get workCount() {
    return this.requests.filter(x => x.status === 'В работе').length;
  }

  get doneCount() {
    return this.requests.filter(x => x.status === 'Выполнена' || x.status === 'Закрыта').length;
  }

  loadRequests() {
    this.http.get<any[]>('http://localhost:3000/requests')
      .subscribe(data => {
        this.requests = data;
      });
  }

  loadEngineers() {
    this.http.get<any[]>('http://localhost:3000/engineers')
      .subscribe(data => {
        this.engineers = data;
      });
  }

  filteredRequests() {
    return this.requests.filter(r => {
      const matchesSearch = !this.search ||
        String(r.id_request).includes(this.search) ||
        (r.client ?? '').toLowerCase().includes(this.search.toLowerCase());
      const matchesStatus = !this.selectedStatus || r.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  assignEngineer(request: any) {}

  updateStatus(request: any) {}

  save(request: any) {
    this.http.patch(`http://localhost:3000/requests/${request.id_request}`, {
      engineer_id: request.engineer_id,
      status: request.status
    }).subscribe(() => {
      alert('Изменения сохранены');
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}