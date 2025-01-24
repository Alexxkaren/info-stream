export interface ArticleDataDtoBase {
  id: number;
  title: string;
  content: string;
  category: string;
}

export interface ArticlesResponse {
  articles: ArticleDataDtoBase[];
}
