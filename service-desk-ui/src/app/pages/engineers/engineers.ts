import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-engineer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './engineers.html',
  styleUrl: './engineers.css'
})
export class EngineerComponent implements OnInit {
  assignedRequests: any[] = [];
  spareParts: any[] = [];
  completedWorks: any[] = [];
  comments: any[] = [];
  selectedRequest: any = null;
  newComment = '';
  selectedPart: any = null;
  partQuantity = 1;
  isLoading = false;
  user: any = {};
  engineerId: number = 0;

  // Модальное окно комментариев
  commentModalVisible = false;
  commentRequest: any = null;
  commentText = '';

  // Модальное окно деталей заявки
  detailsModalVisible = false;
  detailsRequest: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      this.user = JSON.parse(localUser);
      console.log('Пользователь из localStorage:', this.user);
    } catch (e) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Проверяем оба варианта: id или id_user
    this.engineerId = this.user.id || this.user.id_user;
    
    if (!this.engineerId) {
      console.error('ID инженера не найден. user:', this.user);
      alert('Ошибка: ID инженера не найден');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('ID инженера:', this.engineerId);
    this.loadData();
  }

  get completedCount() {
    return this.completedWorks.length;
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

  loadData() {
    this.isLoading = true;
    console.log('Загрузка заявок для инженера с ID:', this.engineerId);

    // Загрузка заявок инженера
    this.http.get<any[]>(`http://localhost:3000/requests/engineer/${this.engineerId}`)
      .subscribe({
        next: (data) => {
          console.log('Заявки получены:', data);
          this.assignedRequests = data || [];
          if (this.assignedRequests.length > 0 && !this.selectedRequest) {
            this.selectedRequest = this.assignedRequests[0];
            this.loadComments(this.selectedRequest.id_request);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки заявок:', err);
          // Пробуем альтернативный способ
          this.loadRequestsAlternative();
        }
      });

    // Загрузка запчастей
    this.http.get<any[]>('http://localhost:3000/spare-parts')
      .subscribe({
        next: (data) => {
          this.spareParts = data || [];
          if (this.spareParts.length > 0 && !this.selectedPart) {
            this.selectedPart = this.spareParts[0];
          }
        },
        error: (err) => {
          console.error('Ошибка загрузки запчастей:', err);
          this.spareParts = [];
        }
      });

    // Загрузка выполненных работ
    this.http.get<any[]>(`http://localhost:3000/requests/completed/engineer/${this.engineerId}`)
      .subscribe({
        next: (data) => {
          console.log('Выполненные работы:', data);
          this.completedWorks = data || [];
        },
        error: (err) => {
          console.error('Ошибка загрузки выполненных работ:', err);
          this.completedWorks = [];
        }
      });
  }

  loadRequestsAlternative() {
    // Получаем все заявки и фильтруем по engineer_id
    this.http.get<any[]>('http://localhost:3000/requests')
      .subscribe({
        next: (data) => {
          console.log('Все заявки:', data);
          this.assignedRequests = (data || []).filter(req => req.engineer_id === this.engineerId);
          console.log('Отфильтрованные заявки:', this.assignedRequests);
          
          if (this.assignedRequests.length > 0 && !this.selectedRequest) {
            this.selectedRequest = this.assignedRequests[0];
            this.loadComments(this.selectedRequest.id_request);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки заявок (альтернативный способ):', err);
          this.assignedRequests = [];
          this.isLoading = false;
        }
      });
  }

  loadComments(requestId: number) {
    this.http.get<any[]>(`http://localhost:3000/comments/request/${requestId}`)
      .subscribe({
        next: (data) => {
          this.comments = data || [];
        },
        error: (err) => {
          console.error('Ошибка загрузки комментариев:', err);
          this.comments = [];
        }
      });
  }

  // ==================== МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ====================

  openRequestDetails(request: any) {
    this.detailsRequest = request;
    this.detailsModalVisible = true;
  }

  closeDetailsModal() {
    this.detailsModalVisible = false;
    this.detailsRequest = null;
  }

  // ==================== МОДАЛЬНОЕ ОКНО КОММЕНТАРИЕВ ====================

  openCommentModal(request: any) {
    this.commentRequest = request;
    this.commentText = '';
    this.commentModalVisible = true;
    this.http.get<any[]>(`http://localhost:3000/comments/request/${request.id_request}`)
      .subscribe({
        next: (data) => {
          this.commentRequest.comments = data || [];
        },
        error: () => {
          this.commentRequest.comments = [];
        }
      });
  }

  closeCommentModal() {
    this.commentModalVisible = false;
    this.commentRequest = null;
    this.commentText = '';
  }

  addCommentModal() {
    if (!this.commentText.trim()) {
      alert('Введите комментарий');
      return;
    }

    const body = {
      request_id: this.commentRequest.id_request,
      text: this.commentText.trim()
    };

    this.http.post('http://localhost:3000/comments', body)
      .subscribe({
        next: () => {
          alert('Комментарий добавлен!');
          if (!this.commentRequest.comments) {
            this.commentRequest.comments = [];
          }
          this.commentRequest.comments.push({
            id_comment: Date.now(),
            id_request: this.commentRequest.id_request,
            text: this.commentText.trim(),
            created_at: new Date().toISOString(),
            author: this.user.fullName || 'Инженер'
          });
          this.commentText = '';
          this.loadComments(this.commentRequest.id_request);
        },
        error: (err) => {
          console.error('Ошибка добавления комментария:', err);
          alert('Не удалось добавить комментарий');
        }
      });
  }

  startWork(request: any) {
    if (!confirm('Начать работу над заявкой?')) return;
    
    request.status = 'В работе';
    this.http.patch(`http://localhost:3000/requests/${request.id_request}`, { status: 'В работе' })
      .subscribe({
        next: () => {
          alert('Работа начата!');
          this.loadData();
        },
        error: (err) => {
          console.error('Ошибка начала работы:', err);
          alert('Не удалось начать работу');
        }
      });
  }

  completeWork(request: any) {
    if (!confirm('Завершить работу над заявкой?')) return;
    
    const note = prompt('Введите результат работы:');
    
    request.status = 'Выполнена';
    this.http.patch(`http://localhost:3000/requests/${request.id_request}`, { status: 'Выполнена' })
      .subscribe({
        next: () => {
          alert('Работа завершена!');
          this.loadData();
          
          if (note) {
            this.completedWorks.unshift({
              request_id: request.id_request,
              description: note || 'Работа выполнена',
              date: new Date().toISOString()
            });
          }
        },
        error: (err) => {
          console.error('Ошибка завершения работы:', err);
          alert('Не удалось завершить работу');
        }
      });
  }

  writeOffPart() {
    if (!this.selectedPart) {
      alert('Выберите запчасть');
      return;
    }
    
    if (this.partQuantity < 1) {
      alert('Количество должно быть больше 0');
      return;
    }
    
    if (this.selectedPart.quantity < this.partQuantity) {
      alert(`Недостаточно запчастей на складе. Доступно: ${this.selectedPart.quantity} шт.`);
      return;
    }
    
    if (!this.selectedRequest) {
      alert('Выберите заявку для списания');
      return;
    }

    if (!confirm(`Списать ${this.partQuantity} шт. "${this.selectedPart.name}" по заявке #${this.selectedRequest.id_request}?`)) {
      return;
    }

    this.isLoading = true;
    
    const body = {
      part_id: this.selectedPart.id_part || this.selectedPart.id,
      quantity: Number(this.partQuantity),
      request_id: Number(this.selectedRequest.id_request)
    };

    console.log('Отправка списания:', body);
    console.log('URL:', 'http://localhost:3000/write-offs');

    this.http.post('http://localhost:3000/write-offs', body)
      .subscribe({
        next: (response: any) => {
          this.selectedPart.quantity -= this.partQuantity;
          alert(`Списано ${this.partQuantity} шт. "${this.selectedPart.name}"`);
          console.log('Списание выполнено:', response);
          this.isLoading = false;
          this.loadData();
        },
        error: (err) => {
          console.error('Ошибка списания запчасти:', err);
          console.error('Статус:', err.status);
          console.error('Текст ошибки:', err.error);
          
          let errorMsg = 'Ошибка списания запчасти. ';
          if (err.error && typeof err.error === 'object' && err.error.message) {
            errorMsg += err.error.message;
          } else if (err.status === 400) {
            errorMsg += 'Некорректные данные. Проверьте заполнение полей.';
          } else if (err.status === 404) {
            errorMsg += 'Запчасть не найдена.';
          } else if (err.status === 500) {
            errorMsg += 'Внутренняя ошибка сервера. Проверьте логи.';
          } else {
            errorMsg += err.message || 'Попробуйте позже.';
          }
          
          alert(errorMsg);
          this.isLoading = false;
        }
      });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}