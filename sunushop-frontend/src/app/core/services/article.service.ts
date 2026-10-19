import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../shared/models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'https://sunushop-backend.onrender.com/api/v2/articles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  create(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }
}
