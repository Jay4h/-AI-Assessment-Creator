/** Declarative content nodes — mapped to React via ContentRenderer (render.json style). */

export type TextVariant =
  | "display"
  | "title"
  | "subtitle"
  | "body"
  | "muted"
  | "label"
  | "caption";

export type ContentNode =
  | { type: "text"; variant: TextVariant; value: string; as?: "p" | "span" | "h1" | "h2" | "h3" }
  | { type: "stack"; direction?: "row" | "column"; gap?: number; align?: string; children: ContentNode[] }
  | { type: "badge"; label: string; tone?: "orange" | "neutral" | "difficulty-easy" | "difficulty-moderate" | "difficulty-hard" }
  | { type: "divider" }
  | { type: "list"; ordered?: boolean; items: ContentNode[] }
  | { type: "field-line"; label: string; placeholder?: string }
  | { type: "link"; href: string; label: string; variant?: "button" | "text" };

export interface PageContent {
  id: string;
  title: string;
  description?: string;
  nodes: ContentNode[];
}
