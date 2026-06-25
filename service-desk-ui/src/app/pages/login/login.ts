import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  apiUrl = 'http://localhost:3000';

  activeTab: 'login' | 'register' = 'login';

  login = '';
  password = '';

  registerData = {
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  isBlocked = false;
  blockTimeLeft = 0;
  blockTimer: any;
  blockedUser = '';

  loginAttempts = 0;
  maxAttempts = 3;
  blockDurationHours = 24;

  ngOnInit(): void {
    this.isBlocked = false;
    this.blockedUser = '';
  }

  checkUserBlock(): void {
    if (!this.login) {
      this.isBlocked = false;
      this.errorMessage = '';
      this.blockedUser = '';
      return;
    }

    const blockKey = `block_until_${this.login}`;
    const attemptsKey = `login_attempts_${this.login}`;
    const blockUntil = localStorage.getItem(blockKey);
    
    if (blockUntil) {
      const blockTime = new Date(blockUntil);
      const now = new Date();
      if (blockTime > now) {
        this.isBlocked = true;
        this.blockedUser = this.login;
        this.startBlockTimer(blockTime);
        this.errorMessage = `Пользователь ${this.login} заблокирован`;
        return;
      } else {
        localStorage.removeItem(blockKey);
        localStorage.removeItem(attemptsKey);
        this.isBlocked = false;
        this.errorMessage = '';
        this.blockedUser = '';
      }
    }

    const attempts = localStorage.getItem(attemptsKey);
    this.loginAttempts = attempts ? parseInt(attempts) : 0;
    this.isBlocked = false;
    this.blockedUser = '';
  }

  onLogin(): void {
    if (!this.login || !this.password) {
      alert('Заполните все поля');
      return;
    }

    const blockKey = `block_until_${this.login}`;
    const blockUntil = localStorage.getItem(blockKey);
    if (blockUntil) {
      const blockTime = new Date(blockUntil);
      const now = new Date();
      if (blockTime > now) {
        this.isBlocked = true;
        this.blockedUser = this.login;
        this.startBlockTimer(blockTime);
        this.errorMessage = `Пользователь ${this.login} заблокирован`;
        return;
      } else {
        localStorage.removeItem(blockKey);
        localStorage.removeItem(`login_attempts_${this.login}`);
        this.isBlocked = false;
        this.errorMessage = '';
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      login: this.login,
      password: this.password
    };

    this.http.post<any>(`${this.apiUrl}/users/login`, credentials).subscribe({
      next: (user) => {
        console.log('Успешный вход в users:', user);
        this.resetLoginAttempts(this.login);
        
        if (user.role === 'ENGINEER') {
          // Получаем данные инженера по id_user
          this.http.get<any[]>(`${this.apiUrl}/engineers/user/${user.id_user}`).subscribe({
            next: (engineers) => {
              console.log('Найденные инженеры:', engineers);
              if (engineers && engineers.length > 0) {
                const engineer = engineers[0];
                // Сохраняем с правильным fullName
                const userData = {
                  id: engineer.id_engineer,
                  id_user: user.id_user,
                  login: user.login,
                  fullName: engineer.full_name,
                  role: 'ENGINEER'
                };
                console.log('Сохраняем инженера:', userData);
                localStorage.setItem('user', JSON.stringify(userData));
                this.router.navigate(['/engineers']);
              } else {
                // Если инженер не найден, сохраняем как есть
                const userData = {
                  id: user.id_user,
                  login: user.login,
                  fullName: user.login || 'Инженер',
                  role: 'ENGINEER'
                };
                localStorage.setItem('user', JSON.stringify(userData));
                this.router.navigate(['/engineers']);
              }
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Ошибка получения инженера:', err);
              const userData = {
                id: user.id_user,
                login: user.login,
                fullName: user.login || 'Инженер',
                role: 'ENGINEER'
              };
              localStorage.setItem('user', JSON.stringify(userData));
              this.router.navigate(['/engineers']);
              this.isLoading = false;
            }
          });
        } else {
          const userData = {
            id: user.id_user,
            login: user.login,
            fullName: user.fullName || user.login,
            role: user.role
          };
          localStorage.setItem('user', JSON.stringify(userData));
          this.navigateByRole(user.role);
          this.isLoading = false;
        }
      },
      error: () => {
        // Если не получилось - пробуем как клиента
        this.http.post<any>(`${this.apiUrl}/clients/login`, credentials).subscribe({
          next: (client) => {
            console.log('Успешный вход в clients:', client);
            this.resetLoginAttempts(this.login);
            const userData = {
              id: client.id_client,
              login: client.login,
              fullName: client.fullName || client.login,
              role: 'CLIENT'
            };
            localStorage.setItem('user', JSON.stringify(userData));
            this.router.navigate(['/clients']);
            this.isLoading = false;
          },
          error: () => {
            this.handleFailedLogin(this.login);
            this.isLoading = false;
          }
        });
      }
    });
  }

  private handleFailedLogin(login: string): void {
    const attemptsKey = `login_attempts_${login}`;
    const blockKey = `block_until_${login}`;
    
    const currentAttempts = localStorage.getItem(attemptsKey);
    this.loginAttempts = currentAttempts ? parseInt(currentAttempts) + 1 : 1;
    
    localStorage.setItem(attemptsKey, String(this.loginAttempts));

    const remainingAttempts = this.maxAttempts - this.loginAttempts;

    if (this.loginAttempts >= this.maxAttempts) {
      this.blockUser(login);
    } else {
      this.errorMessage = `Неверный логин или пароль. Осталось попыток: ${remainingAttempts}`;
      this.isBlocked = false;
    }
  }

  private blockUser(login: string): void {
    const blockKey = `block_until_${login}`;
    const attemptsKey = `login_attempts_${login}`;
    
    const blockUntil = new Date();
    blockUntil.setHours(blockUntil.getHours() + this.blockDurationHours);
    
    localStorage.setItem(blockKey, blockUntil.toISOString());
    localStorage.setItem(attemptsKey, String(this.loginAttempts));
    
    this.isBlocked = true;
    this.blockedUser = login;
    this.errorMessage = `Вы превысили лимит попыток входа. Доступ заблокирован на ${this.blockDurationHours} часов.`;
    
    this.startBlockTimer(blockUntil);
  }

  private startBlockTimer(blockUntil: Date): void {
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = blockUntil.getTime() - now.getTime();
      
      if (diff <= 0) {
        this.isBlocked = false;
        this.blockedUser = '';
        const login = this.blockedUser || this.login;
        if (login) {
          localStorage.removeItem(`block_until_${login}`);
          localStorage.removeItem(`login_attempts_${login}`);
        }
        clearInterval(this.blockTimer);
        this.errorMessage = 'Блокировка снята. Можете войти.';
        return;
      }
      
      this.blockTimeLeft = Math.floor(diff / 1000);
    };

    updateTimer();
    this.blockTimer = setInterval(updateTimer, 1000);
  }

  getBlockTimeString(): string {
    const hours = Math.floor(this.blockTimeLeft / 3600);
    const minutes = Math.floor((this.blockTimeLeft % 3600) / 60);
    const seconds = this.blockTimeLeft % 60;
    return `${hours}ч ${minutes}м ${seconds}с`;
  }

  private resetLoginAttempts(login: string): void {
    if (!login) return;
    const attemptsKey = `login_attempts_${login}`;
    const blockKey = `block_until_${login}`;
    
    localStorage.removeItem(attemptsKey);
    localStorage.removeItem(blockKey);
    this.loginAttempts = 0;
    this.isBlocked = false;
    this.blockedUser = '';
    this.errorMessage = '';
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
    }
  }

  private navigateByRole(role: string): void {
    switch (role) {
      case 'CLIENT':
        this.router.navigate(['/clients']);
        break;
      case 'DISPATCHER':
        this.router.navigate(['/dispatcher']);
        break;
      case 'ENGINEER':
        this.router.navigate(['/engineers']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        alert('Неизвестная роль пользователя');
        this.router.navigate(['/login']);
        break;
    }
  }

  onRegister(): void {
    if (!this.registerData.fullName.trim()) {
      alert('Введите ФИО');
      return;
    }

    if (!this.registerData.email.trim()) {
      alert('Введите Email');
      return;
    }

    if (!this.registerData.phone.trim()) {
      alert('Введите телефон');
      return;
    }

    if (!this.registerData.username.trim()) {
      alert('Введите логин');
      return;
    }

    if (!this.registerData.password) {
      alert('Введите пароль');
      return;
    }

    if (this.registerData.password.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    this.isLoading = true;

    const clientData = {
      full_name: this.registerData.fullName.trim(),
      email: this.registerData.email.trim(),
      phone: this.registerData.phone.trim(),
      login: this.registerData.username.trim(),
      password: this.registerData.password
    };

    this.http.post(`${this.apiUrl}/clients`, clientData).subscribe({
      next: () => {
        alert('Регистрация выполнена успешно! Теперь войдите в систему.');
        
        this.registerData = {
          fullName: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          confirmPassword: ''
        };
        
        this.activeTab = 'login';
        this.isLoading = false;
        this.login = clientData.login;
      },
      error: (error) => {
        console.error('Ошибка регистрации:', error);
        this.isLoading = false;
        
        let errorMsg = 'Ошибка регистрации. ';
        if (error.status === 0) {
          errorMsg += 'Сервер недоступен. Проверьте, запущен ли бэкенд сервер.';
        } else if (error.status === 400) {
          errorMsg += 'Некорректные данные. Проверьте заполнение полей.';
        } else if (error.status === 409) {
          errorMsg += 'Пользователь с таким логином или email уже существует.';
        } else {
          errorMsg += error.message;
        }
        
        alert(errorMsg);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
    }
  }
}