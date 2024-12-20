import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { map } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  private mockArticles: Article[] = [
    {
      slug: "article-1",
      title: "Article 1",
      description: "This is the article 1",
      body: "Content of the article 1.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tagList: ["mock", "article"],
      author: { username: "Lera", bio: "21", image: "", following: false },
      favorited: false,
      favoritesCount: 10,
    },
    {
      slug: "article-2",
      title: " Article 2",
      description: "This is the article 2.",
      body: "Content of the Article 2.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tagList: ["test", "sample"],
      author: { username: "Lera", bio: "22", image: "", following: false },
      favorited: true,
      favoritesCount: 25,
    },
  ];

  query(
    config: ArticleListConfig
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    const limit = config.filters.limit || this.mockArticles.length;
    const offset = config.filters.offset || 0;

    const articles = this.mockArticles.slice(offset, offset + limit);

    return of({
      articles: articles,
      articlesCount: this.mockArticles.length,
    });
  }

  get(slug: string): Observable<Article> {
    const article = this.mockArticles.find((a) => a.slug === slug);
    return of(article!);
  }

  create(article: Partial<Article>): Observable<Article> {
    const newArticle: Article = {
      ...article,
      slug: `article-${this.mockArticles.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tagList: article.tagList || [],
      author: {
        username: "mockAuthorNew",
        bio: "New Author Bio",
        image: "",
        following: false,
      },
      favorited: false,
      favoritesCount: 0,
    } as Article;

    this.mockArticles.push(newArticle);
    return of(newArticle);
  }

  update(article: Partial<Article>): Observable<Article> {
    const index = this.mockArticles.findIndex((a) => a.slug === article.slug);
    if (index !== -1) {
      const updatedArticle = { ...this.mockArticles[index], ...article };
      this.mockArticles[index] = updatedArticle;
      return of(updatedArticle);
    }
    throw new Error("Article not found");
  }

  delete(slug: string): Observable<void> {
    this.mockArticles = this.mockArticles.filter((a) => a.slug !== slug);
    return of(undefined);
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
