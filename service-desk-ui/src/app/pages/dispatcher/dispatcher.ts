import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispatcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatcher.html',
  styleUrl: './dispatcher.css'
})
export class DispatcherComponent implements OnInit {
  requests: any[] = [];
  engineers: any[] = [];
  search = '';
  selectedStatus = '';
  selectedEngineer = '';

  commentModalVisible = false;
  commentRequest: any = null;
  commentText = '';

  originalValues: Map<number, { engineer_id: any, status: string }> = new Map();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
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
    this.http.get<any[]>('http://localhost:3000/requests').subscribe({
      next: (data) => {
        this.requests = data.map((req: any) => ({
          ...req,
          // Если engineer_name нет, показываем "Не назначен"
          engineer_display: req.engineer_name || 'Не назначен',
          // Преобразуем engineer_id в число или null
          engineer_id: req.engineer_id ? Number(req.engineer_id) : null
        }));
        
        this.requests.forEach(req => {
          this.originalValues.set(req.id_request, {
            engineer_id: req.engineer_id,
            status: req.status
          });
        });
        this.loadCommentsForRequests();
      },
      error: (error) => {
        console.error('Ошибка загрузки заявок:', error);
      }
    });
  }

  loadCommentsForRequests() {
    this.requests.forEach(req => {
      this.http.get<any[]>(`http://localhost:3000/comments/request/${req.id_request}`).subscribe({
        next: (comments) => {
          req.comments = comments || [];
        },
        error: () => {
          req.comments = [];
        }
      });
    });
  }

  loadEngineers() {
    this.http.get<any[]>('http://localhost:3000/engineers').subscribe({
      next: (data) => {
        this.engineers = data;
      },
      error: (error) => {
        console.error('Ошибка загрузки инженеров:', error);
      }
    });
  }

  filteredRequests() {
    return this.requests.filter(r => {
      const matchesSearch = !this.search ||
        String(r.id_request).includes(this.search) ||
        (r.client ?? '').toLowerCase().includes(this.search.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || r.status === this.selectedStatus;
      
      const matchesEngineer = !this.selectedEngineer || r.engineer_id === +this.selectedEngineer;
      
      return matchesSearch && matchesStatus && matchesEngineer;
    });
  }

  hasChanges(request: any): boolean {
    const original = this.originalValues.get(request.id_request);
    if (!original) return false;
    return original.engineer_id !== request.engineer_id || original.status !== request.status;
  }

  save(request: any) {
    if (!this.hasChanges(request)) {
      alert('Нет изменений для сохранения');
      return;
    }

    const updateData = {
      engineer_id: request.engineer_id,
      status: request.status
    };

    console.log('📤 Отправка данных:', updateData);

    this.http.patch(`http://localhost:3000/requests/${request.id_request}`, updateData).subscribe({
      next: (response) => {
        console.log('Успешно сохранено:', response);
        alert('Изменения сохранены!');
        this.originalValues.set(request.id_request, {
          engineer_id: request.engineer_id,
          status: request.status
        });
        this.loadRequests();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка сохранения изменений. Попробуйте позже.');
        this.cancelChanges(request);
      }
    });
  }

  cancelChanges(request: any) {
    const original = this.originalValues.get(request.id_request);
    if (original) {
      request.engineer_id = original.engineer_id;
      request.status = original.status;
    }
  }

  assignEngineer(request: any) {
    if (request.engineer_id) {
      request.status = 'В работе';
    }
  }

  updateStatus(request: any) {
    if (request.status === 'Новая') {
      request.engineer_id = null;
    }
  }

  getStatusSelectClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Новая': 'status-select-new',
      'В работе': 'status-select-work',
      'Ожидание': 'status-select-wait',
      'Выполнена': 'status-select-done',
      'Закрыта': 'status-select-closed'
    };
    return statusMap[status] || '';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openCommentModal(request: any) {
    this.commentRequest = request;
    this.commentText = '';
    this.commentModalVisible = true;
  }

  closeCommentModal() {
    this.commentModalVisible = false;
    this.commentRequest = null;
    this.commentText = '';
  }

  addComment() {
    if (!this.commentText.trim()) {
      alert('Введите комментарий');
      return;
    }

    const commentData = {
      request_id: this.commentRequest.id_request,
      text: this.commentText.trim()
    };

    this.http.post('http://localhost:3000/comments', commentData).subscribe({
      next: () => {
        alert('Комментарий добавлен!');
        
        if (this.commentRequest) {
          if (!this.commentRequest.comments) {
            this.commentRequest.comments = [];
          }
          this.commentRequest.comments.push({
            id_comment: Date.now(),
            id_request: this.commentRequest.id_request,
            text: this.commentText.trim(),
            created_at: new Date().toISOString()
          });
        }
        
        this.commentText = '';
        this.loadRequests();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка добавления комментария:', error);
        alert('Ошибка добавления комментария. Попробуйте позже.');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}