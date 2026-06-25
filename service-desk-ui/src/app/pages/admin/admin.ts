import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  clients: any[] = [];
  equipment: any[] = [];
  categories: any[] = [];
  spareParts: any[] = [];
  logs: any[] = [];
  filteredLogs: any[] = [];
  isLoading = false;
  isSaving = false;
  user: any = {};
  activeTab: string = 'clients';

  logDateFrom: string = '';
  logDateTo: string = '';

  modalVisible = false;
  modalTitle = '';
  modalType = '';
  modalFields: any[] = [];
  modalEditId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

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
    if (this.user.role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;

    this.http.get<any[]>('http://localhost:3000/clients')
      .subscribe({ 
        next: (data) => { this.clients = data || []; }, 
        error: () => { this.clients = []; } 
      });

    this.http.get<any[]>('http://localhost:3000/equipment')
      .subscribe({ 
        next: (data) => { this.equipment = data || []; }, 
        error: () => { this.equipment = []; } 
      });

    this.http.get<any[]>('http://localhost:3000/categories')
      .subscribe({ 
        next: (data) => { this.categories = data || []; }, 
        error: () => { this.categories = []; } 
      });

    this.http.get<any[]>('http://localhost:3000/spare-parts')
      .subscribe({ 
        next: (data) => { this.spareParts = data || []; }, 
        error: () => { this.spareParts = []; } 
      });

    this.http.get<any[]>('http://localhost:3000/action-log')
      .subscribe({ 
        next: (data) => { 
          this.logs = data || []; 
          this.filteredLogs = [...this.logs];
        }, 
        error: () => { this.logs = []; this.filteredLogs = []; } 
      });

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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

  filterLogs() {
    this.filteredLogs = this.logs.filter(log => {
      const logDate = new Date(log.created_at);
      let match = true;
      if (this.logDateFrom) {
        const from = new Date(this.logDateFrom);
        from.setHours(0, 0, 0, 0);
        match = match && logDate >= from;
      }
      if (this.logDateTo) {
        const to = new Date(this.logDateTo);
        to.setHours(23, 59, 59, 999);
        match = match && logDate <= to;
      }
      return match;
    });
  }

  clearLogFilters() {
    this.logDateFrom = '';
    this.logDateTo = '';
    this.filteredLogs = [...this.logs];
  }

  openAddModal(type: string) {
    this.modalType = type;
    this.modalEditId = null;
    this.modalFields = this.getFieldsForType(type);
    this.modalTitle = 'Добавить ' + this.getTypeLabel(type);
    this.modalVisible = true;
  }

  openEditModal(type: string, item: any) {
    this.modalType = type;
    this.modalEditId = this.getIdFromItem(type, item);
    this.modalFields = this.getFieldsForType(type, item);
    this.modalTitle = 'Редактировать ' + this.getTypeLabel(type);
    this.modalVisible = true;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'client': 'клиента',
      'equipment': 'оборудование',
      'category': 'категорию',
      'part': 'запчасть'
    };
    return labels[type] || type;
  }

  getIdFromItem(type: string, item: any): number {
    const idMap: Record<string, string> = {
      'client': 'id_client',
      'equipment': 'id_equipment',
      'category': 'id_category',
      'part': 'id_part'
    };
    const key = idMap[type] || 'id';
    return item[key] || item.id;
  }

  getFieldsForType(type: string, data?: any): any[] {
    const fields: Record<string, any[]> = {
      'client': [
        { name: 'full_name', label: 'ФИО', value: data?.full_name || '', type: 'text' },
        { name: 'login', label: 'Логин', value: data?.login || '', type: 'text' },
        { name: 'phone', label: 'Телефон', value: data?.phone || '', type: 'text' },
        { name: 'email', label: 'Email', value: data?.email || '', type: 'text' },
        { name: 'password', label: 'Пароль', value: '', type: 'password', placeholder: 'Оставьте пустым' }
      ],
      'equipment': [
        { name: 'name', label: 'Название', value: data?.name || '', type: 'text' },
        { name: 'model', label: 'Модель', value: data?.model || '', type: 'text' },
        { name: 'serial_number', label: 'Серийный номер', value: data?.serial_number || '', type: 'text' }
      ],
      'category': [
        { name: 'name', label: 'Название', value: data?.name || '', type: 'text' },
        { name: 'description', label: 'Описание', value: data?.description || '', type: 'textarea' }
      ],
      'part': [
        { name: 'name', label: 'Название', value: data?.name || '', type: 'text' },
        { name: 'quantity', label: 'Количество', value: data?.quantity || 0, type: 'number' },
        { name: 'price', label: 'Цена', value: data?.price || 0, type: 'number' }
      ]
    };
    return fields[type] || [];
  }

  getEndpoint(type: string): string {
    const endpoints: Record<string, string> = {
      'client': 'clients',
      'equipment': 'equipment',
      'category': 'categories',
      'part': 'spare-parts'
    };
    return endpoints[type] || type + 's';
  }

  closeModal() {
    this.modalVisible = false;
    this.modalFields = [];
    this.modalEditId = null;
  }

  saveModal() {
    const endpoint = this.getEndpoint(this.modalType);
    const data: any = {};
    this.modalFields.forEach(field => {
      if (field.name === 'password' && !field.value) return;
      data[field.name] = field.value;
    });

    this.isSaving = true;

    if (this.modalEditId) {
      this.http.put(`http://localhost:3000/${endpoint}/${this.modalEditId}`, data)
        .subscribe({
          next: () => {
            alert('Запись обновлена');
            this.closeModal();
            this.loadAllData();
            this.isSaving = false;
          },
          error: (err) => {
            console.error('Ошибка обновления:', err);
            alert('Ошибка обновления');
            this.isSaving = false;
          }
        });
    } else {
      this.http.post(`http://localhost:3000/${endpoint}`, data)
        .subscribe({
          next: () => {
            alert('Запись добавлена');
            this.closeModal();
            this.loadAllData();
            this.isSaving = false;
          },
          error: (err) => {
            console.error('Ошибка добавления:', err);
            alert('Ошибка добавления');
            this.isSaving = false;
          }
        });
    }
  }

  deleteItem(endpoint: string, id: number) {
    if (!confirm('Удалить запись?')) return;
    this.http.delete(`http://localhost:3000/${endpoint}/${id}`)
      .subscribe({
        next: () => {
          alert('Запись удалена');
          this.loadAllData();
        },
        error: (err) => {
          console.error('Ошибка удаления:', err);
          alert('Ошибка удаления');
        }
      });
  }

  generateReport(type: string) {
    this.isLoading = true;
    
    const reportUrls: Record<string, string> = {
      'requests': 'http://localhost:3000/reports/requests',
      'engineers': 'http://localhost:3000/reports/engineers',
      'parts': 'http://localhost:3000/reports/parts',
      'avg-time': 'http://localhost:3000/reports/avg-time'
    };

    const url = reportUrls[type];
    if (!url) {
      alert('Отчет не найден');
      this.isLoading = false;
      return;
    }

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        alert('Отчет сгенерирован');
      },
      error: (error) => {
        console.error('Ошибка генерации отчета:', error);
        this.isLoading = false;
        alert('Ошибка генерации отчета');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}