import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface Client {
  id_client: number;
  full_name: string;
  phone: string;
  email: string;
  login: string;
  password: string;
}

interface Equipment {
  id_equipment: number;
  name: string;
  serial_number: string;
  model?: string;
}

interface Category {
  id_category: number;
  name: string;
  description?: string;
}

interface Comment {
  id_comment: number;
  id_request: number;
  text: string;
  created_at: string;
}

interface RequestChange {
  date: string;
  status: string;
  comment?: string;
  old_title?: string;
  new_title?: string;
  old_description?: string;
  new_description?: string;
  old_equipment?: string;
  new_equipment?: string;
  old_category?: string;
  new_category?: string;
}

interface Request {
  id_request: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string;
  equipment?: string;
  equipment_id?: number;
  category?: string;
  category_id?: number;
  changes?: RequestChange[];
  comments?: Comment[];
}

interface User {
  id: number;
  login: string;
  role?: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class ClientsComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  apiUrl = 'http://localhost:3000';

  activeTab: 'profile' | 'create' | 'requests' | 'history' = 'profile';

  user: User = { id: 0, login: '' };
  
  originalClient: Client = {
    id_client: 0,
    full_name: '',
    phone: '',
    email: '',
    login: '',
    password: ''
  };

  client: Client = {
    id_client: 0,
    full_name: '',
    phone: '',
    email: '',
    login: '',
    password: ''
  };

  newPassword = '';
  equipments: Equipment[] = [];
  categories: Category[] = [];
  requests: Request[] = [];
  history: Request[] = [];
  filteredRequests: Request[] = [];

  newRequest = {
    title: '',
    description: '',
    equipmentId: null as number | null,
    categoryId: null as number | null,
    files: [] as File[]
  };

  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  isLoading = false;
  errorMessage = '';

  // Модальное окно редактирования
  editModalVisible = false;
  editingRequest: Request | null = null;
  editForm = {
    title: '',
    description: '',
    equipmentId: null as number | null,
    categoryId: null as number | null,
    status: ''
  };

  ngOnInit(): void {
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.user = JSON.parse(localUser);
    } catch (e) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.user.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadAllData();
  }

  loadAllData(): void {
    this.loadClient();
    this.loadEquipments();
    this.loadCategories();
    this.loadRequests();
  }

  loadClient(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const url = `${this.apiUrl}/clients/${this.user.id}`;
    
    this.http.get<Client>(url).subscribe({
      next: (data) => {
        if (data && data.id_client) {
          this.client = data;
          this.originalClient = { ...data };
        } else {
          this.errorMessage = 'Данные клиента не найдены';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.errorMessage = 'Сервер недоступен. Проверьте, запущен ли бэкенд сервер.';
        } else if (error.status === 404) {
          this.errorMessage = `Клиент с ID ${this.user.id} не найден`;
          this.showAvailableClients();
        } else {
          this.errorMessage = `Ошибка: ${error.message}`;
        }
      }
    });
  }

  showAvailableClients(): void {
    this.http.get<Client[]>(`${this.apiUrl}/clients`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const ids = data.map(c => `${c.id_client}: ${c.full_name} (${c.login})`).join('\n');
          alert(`Доступные клиенты:\n${ids}\n\nИспользуйте один из этих ID в localStorage.`);
        } else {
          alert('В базе данных нет клиентов.');
        }
      },
      error: () => {
        alert('Не удалось получить список клиентов');
      }
    });
  }

  loadEquipments(): void {
    this.http.get<Equipment[]>(`${this.apiUrl}/equipment`).subscribe({
      next: (data) => {
        this.equipments = data || [];
      },
      error: () => {
        this.equipments = [];
      }
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${this.apiUrl}/categories`).subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  loadRequests(): void {
    if (!this.user.id) {
      return;
    }
    
    this.http.get<any[]>(`${this.apiUrl}/requests/client/${this.user.id}`).subscribe({
      next: (data) => {
        const requests = (data || []).map((req: any) => ({
          id_request: req.id_request,
          title: req.title || req.description || 'Без названия',
          description: req.description || '',
          status: req.status || 'new',
          created_at: req.created_at,
          equipment: req.equipment || '-',
          equipment_id: req.equipment_id || undefined,
          category: req.category || '-',
          category_id: req.category_id || undefined,
          changes: req.changes || [],
          comments: []
        }));
        
        this.requests = requests;
        this.history = requests.map(req => ({
          ...req,
          changes: req.changes || [],
          comments: []
        }));
        this.filteredRequests = [...requests];
        
        this.loadCommentsForRequests();
      },
      error: () => {
        this.requests = [];
        this.history = [];
        this.filteredRequests = [];
      }
    });
  }

  loadCommentsForRequests(): void {
    this.requests.forEach(req => {
      this.http.get<Comment[]>(`${this.apiUrl}/comments/request/${req.id_request}`).subscribe({
        next: (comments) => {
          req.comments = comments || [];
          const hist = this.history.find(h => h.id_request === req.id_request);
          if (hist) {
            hist.comments = comments || [];
          }
        },
        error: () => {
          req.comments = [];
        }
      });
    });
  }

  getEquipmentName(id: number | null): string {
    if (!id) return '-';
    const eq = this.equipments.find(e => e.id_equipment === id);
    return eq ? eq.name : '-';
  }

  getCategoryName(id: number | null): string {
    if (!id) return '-';
    const cat = this.categories.find(c => c.id_category === id);
    return cat ? cat.name : '-';
  }

  openEditModal(req: Request): void {
    this.editingRequest = req;
    
    let equipmentId = req.equipment_id || null;
    let categoryId = req.category_id || null;
    
    if (!equipmentId && req.equipment && req.equipment !== '-') {
      const found = this.equipments.find(e => e.name === req.equipment);
      if (found) {
        equipmentId = found.id_equipment;
      }
    }
    
    if (!categoryId && req.category && req.category !== '-') {
      const found = this.categories.find(c => c.name === req.category);
      if (found) {
        categoryId = found.id_category;
      }
    }
    
    this.editForm = {
      title: req.title,
      description: req.description,
      equipmentId: equipmentId,
      categoryId: categoryId,
      status: req.status
    };
    
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
    this.editingRequest = null;
    this.editForm = {
      title: '',
      description: '',
      equipmentId: null,
      categoryId: null,
      status: ''
    };
  }

  saveEditModal(): void {
    if (!this.editingRequest) return;

    if (!this.editForm.title || !this.editForm.title.trim()) {
      alert('Название не может быть пустым');
      return;
    }

    const oldTitle = this.editingRequest.title;
    const oldDescription = this.editingRequest.description;
    const oldEquipment = this.editingRequest.equipment || '-';
    const oldCategory = this.editingRequest.category || '-';
    
    const newTitle = this.editForm.title.trim();
    const newDescription = this.editForm.description.trim();
    
    const selectedEquipment = this.equipments.find(e => e.id_equipment === this.editForm.equipmentId);
    const selectedCategory = this.categories.find(c => c.id_category === this.editForm.categoryId);
    const newEquipment = selectedEquipment ? selectedEquipment.name : '-';
    const newCategory = selectedCategory ? selectedCategory.name : '-';

    if (oldTitle === newTitle && oldDescription === newDescription && 
        oldEquipment === newEquipment && oldCategory === newCategory) {
      this.closeEditModal();
      return;
    }

    this.isLoading = true;

    const updateData = {
      title: newTitle,
      description: newDescription,
      equipmentId: this.editForm.equipmentId,
      categoryId: this.editForm.categoryId
    };

    this.http.put(`${this.apiUrl}/requests/${this.editingRequest.id_request}`, updateData).subscribe({
      next: () => {
        if (this.editingRequest) {
          const req = this.requests.find(r => r.id_request === this.editingRequest!.id_request);
          if (req) {
            req.title = newTitle;
            req.description = newDescription;
            req.equipment = newEquipment;
            req.equipment_id = this.editForm.equipmentId || undefined;
            req.category = newCategory;
            req.category_id = this.editForm.categoryId || undefined;
          }

          const hist = this.history.find(h => h.id_request === this.editingRequest!.id_request);
          if (hist) {
            hist.title = newTitle;
            hist.description = newDescription;
            hist.equipment = newEquipment;
            hist.equipment_id = this.editForm.equipmentId || undefined;
            hist.category = newCategory;
            hist.category_id = this.editForm.categoryId || undefined;
            
            if (!hist.changes) {
              hist.changes = [];
            }
            
            let changeComment = 'Изменена заявка';
            const changes: string[] = [];
            if (oldTitle !== newTitle) changes.push(`название: "${oldTitle}" → "${newTitle}"`);
            if (oldDescription !== newDescription) changes.push('описание');
            if (oldEquipment !== newEquipment) changes.push(`оборудование: "${oldEquipment}" → "${newEquipment}"`);
            if (oldCategory !== newCategory) changes.push(`категория: "${oldCategory}" → "${newCategory}"`);
            
            if (changes.length > 0) {
              changeComment = 'Изменено: ' + changes.join(', ');
            }
            
            hist.changes.push({
              date: new Date().toISOString(),
              status: this.editingRequest!.status,
              comment: changeComment,
              old_title: oldTitle,
              new_title: newTitle,
              old_description: oldDescription,
              new_description: newDescription,
              old_equipment: oldEquipment,
              new_equipment: newEquipment,
              old_category: oldCategory,
              new_category: newCategory
            });
          }

          this.filteredRequests = [...this.requests];
        }

        this.isLoading = false;
        this.closeEditModal();
        alert('Заявка обновлена!');
      },
      error: () => {
        this.isLoading = false;
        alert('Ошибка обновления заявки');
      }
    });
  }

  applyFilters(): void {
    this.filteredRequests = this.requests.filter(req => {
      let match = true;
      if (this.filters.status) {
        match = match && req.status === this.filters.status;
      }
      if (this.filters.dateFrom) {
        const dateFrom = new Date(this.filters.dateFrom);
        const reqDate = new Date(req.created_at);
        match = match && reqDate >= dateFrom;
      }
      if (this.filters.dateTo) {
        const dateTo = new Date(this.filters.dateTo);
        dateTo.setHours(23, 59, 59);
        const reqDate = new Date(req.created_at);
        match = match && reqDate <= dateTo;
      }
      return match;
    });
  }

  clearFilters(): void {
    this.filters = { status: '', dateFrom: '', dateTo: '' };
    this.filteredRequests = [...this.requests];
  }

  saveProfile(): void {
    if (!this.client.id_client) {
      alert('Ошибка: данные клиента не загружены');
      return;
    }

    if (!this.newPassword || this.newPassword.trim() === '') {
      alert('Введите новый пароль');
      return;
    }

    if (this.newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }

    this.isLoading = true;
    const body = { password: this.newPassword };

    this.http.put(`${this.apiUrl}/clients/${this.client.id_client}`, body).subscribe({
      next: () => {
        alert('Пароль успешно изменен!');
        this.client.password = this.newPassword;
        this.originalClient.password = this.newPassword;
        this.newPassword = '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Ошибка смены пароля. Попробуйте позже.');
      }
    });
  }

  resetProfile(): void {
    if (this.newPassword && this.newPassword.trim() !== '') {
      if (confirm('Очистить поле ввода пароля?')) {
        this.newPassword = '';
      }
    } else {
      this.newPassword = '';
    }
  }

  clearForm(): void {
    if (confirm('Вы уверены, что хотите очистить форму?')) {
      this.newRequest = {
        title: '',
        description: '',
        equipmentId: null,
        categoryId: null,
        files: []
      };
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.type.startsWith('image/')) {
          this.newRequest.files.push(file);
        }
      }
    }
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.newRequest.files.length) {
      this.newRequest.files.splice(index, 1);
    }
  }

  createRequest(): void {
    if (!this.newRequest.title || !this.newRequest.title.trim()) {
      alert('Введите название заявки');
      return;
    }

    if (!this.newRequest.description || !this.newRequest.description.trim()) {
      alert('Опишите проблему');
      return;
    }

    if (!this.newRequest.equipmentId) {
      alert('Выберите оборудование');
      return;
    }

    if (!this.newRequest.categoryId) {
      alert('Выберите категорию услуги');
      return;
    }

    if (!this.client.id_client) {
      alert('Ошибка: данные клиента не загружены');
      return;
    }

    this.isLoading = true;

    const requestData = {
      clientId: this.client.id_client,
      engineerId: 1,
      equipmentId: this.newRequest.equipmentId,
      categoryId: this.newRequest.categoryId,
      statusId: 1,
      title: this.newRequest.title.trim(),
      description: this.newRequest.description.trim()
    };

    this.http.post(`${this.apiUrl}/requests`, requestData).subscribe({
      next: () => {
        alert('Заявка успешно создана!');
        
        this.newRequest = {
          title: '',
          description: '',
          equipmentId: null,
          categoryId: null,
          files: []
        };
        
        this.isLoading = false;
        this.loadRequests();
        this.activeTab = 'requests';
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        
        let errorMsg = 'Ошибка создания заявки. ';
        if (error.status === 0) {
          errorMsg += 'Сервер недоступен. Проверьте, запущен ли бэкенд сервер.';
        } else if (error.status === 400) {
          errorMsg += 'Некорректные данные. Проверьте заполнение полей.';
        } else if (error.status === 404) {
          errorMsg += 'Эндпоинт не найден. Проверьте URL.';
        } else if (error.status === 500) {
          errorMsg += 'Ошибка на сервере. Проверьте логи.';
        } else {
          errorMsg += error.message;
        }
        
        alert(errorMsg);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'new': 'status-new',
      'in_progress': 'status-work',
      'waiting': 'status-wait',
      'completed': 'status-done'
    };
    return statusMap[status] || 'status-new';
  }

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      'new': 'Новая',
      'in_progress': 'В работе',
      'waiting': 'Ожидание',
      'completed': 'Завершена'
    };
    return statusMap[status] || status;
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

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}