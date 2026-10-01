import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { Article } from '../../shared/models/article.model';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  const mockArticles: Article[] = [
    { id: 1, reference: 'PP-A4-75G', designation: 'Papier A4 75g', category: 'Papier', currentStockPhysical: 200, currentStockReserved: 0, currentStockAvailable: 200 },
    { id: 2, reference: 'CAR-EP-100', designation: 'Cartouche EPSON 100', category: 'Cartouche', currentStockPhysical: 50, currentStockReserved: 10, currentStockAvailable: 40 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService]
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait retourner la liste des articles', () => {
    service.getAll().subscribe(articles => {
      expect(articles.length).toBe(2);
      expect(articles[0].reference).toBe('PP-A4-75G');
    });

    const req = httpMock.expectOne('/api/v2/articles');
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });

  it('devrait retourner un article par ID', () => {
    service.getById(1).subscribe(article => {
      expect(article.reference).toBe('PP-A4-75G');
    });

    const req = httpMock.expectOne('/api/v2/articles/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles[0]);
  });

  it('devrait creer un article', () => {
    const newArticle: Article = {
      reference: 'NEW-001',
      designation: 'Nouvel article',
      category: 'Papier',
      currentStockPhysical: 0,
      currentStockReserved: 0,
      currentStockAvailable: 0
    };

    service.create(newArticle).subscribe(article => {
      expect(article.reference).toBe('NEW-001');
    });

    const req = httpMock.expectOne('/api/v2/articles');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...newArticle });
  });
});