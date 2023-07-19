import type { CollectionEntry } from "astro:content";

interface ListItem<T> {
    id: string;
    key: string;
    value: T;
}

interface List<T> {
    total_rows: number,
    offset: number,
    rows: T[]
}

export interface ArticleDoc {
    _id: string,
    _rev: string,
    type: string,
    author: string,
    dateTime: string,
    htmlContent: string,
    pictureAltText: string,
    pictureSubText: string,
    pictureURL: string,
    published: boolean,
    readableKey: string,
    title: string,
    tags: string[],
    theme: string
}


export interface CommentDoc {
    _id: string,
    _rev: string,
    type: string,
    name: string,
    dateTime: string,
    comment: string
}

export interface AdminBlogpost {
    id: string;
    key: [boolean, string],
    value: {
        title: string;
    }
}

export interface ArticlePage {
    page: number;
    articles: CollectionEntry<"blog">[];
}

export type PagedArticleList = ArticlePage[];

export type Article = ListItem<ArticleDoc>;

export type Comment = ListItem<CommentDoc>;

export type ArticleList = List<Article>;

export type AdminBlogpostList = List<AdminBlogpost>;

export interface ArticleWithComments {
    rows: [Article, ...Comment[]]
}