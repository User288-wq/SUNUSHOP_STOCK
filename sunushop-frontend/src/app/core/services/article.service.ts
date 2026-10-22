import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../shared/models/article.model';

// 1. On définit l'interface qui correspond au retour de Spring Boot
export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'https://sunushop-backend.onrender.com/api/v2/articles';

  constructor(private http: HttpClient) {}

  // 2. On modifie getAll pour accepter la pagination et la recherche
  getAll(page: number = 0, size: number = 10, search: string = ''): Observable<PageResponse<Article>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PageResponse<Article>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  create(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }
}
