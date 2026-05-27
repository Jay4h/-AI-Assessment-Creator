import Link from "next/link";
import type { ContentNode } from "@vedaai/content";
import clsx from "clsx";

const textStyles: Record<string, string> = {
  display: "text-[28px] font-bold tracking-[-0.06em] text-[var(--color-text-primary)]",
  title: "text-xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]",
  subtitle: "text-base font-bold text-[var(--color-text-primary)]",
  body: "text-base text-[var(--color-text-primary)]",
  muted: "text-base text-[var(--color-text-muted)] leading-relaxed",
  label: "text-sm font-medium text-[var(--color-text-primary)]",
  caption: "text-sm text-[var(--color-text-secondary)]",
};

function TextNode({ node }: { node: Extract<ContentNode, { type: "text" }> }) {
  const Tag = node.as ?? "p";
  return <Tag className={textStyles[node.variant]}>{node.value}</Tag>;
}

function BadgeNode({ node }: { node: Extract<ContentNode, { type: "badge" }> }) {
  const tones: Record<string, string> = {
    orange: "bg-[var(--color-accent-orange)] text-white",
    neutral: "bg-[var(--color-bg-off-white-20)] text-[var(--color-text-primary)]",
    "difficulty-easy": "bg-emerald-100 text-emerald-800",
    "difficulty-moderate": "bg-amber-100 text-amber-900",
    "difficulty-hard": "bg-rose-100 text-rose-900",
  };
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[node.tone ?? "neutral"],
      )}
    >
      {node.label}
    </span>
  );
}

function renderNode(node: ContentNode, key: number): React.ReactNode {
  switch (node.type) {
    case "text":
      return <TextNode key={key} node={node} />;
    case "stack":
      return (
        <div
          key={key}
          className={clsx(
            "flex",
            node.direction === "row" ? "flex-row" : "flex-col",
            node.gap !== undefined && `gap-${node.gap}`,
            node.align && `items-${node.align}`,
          )}
          style={node.gap ? { gap: `${node.gap * 4}px` } : undefined}
        >
          {node.children.map((child, i) => renderNode(child, i))}
        </div>
      );
    case "badge":
      return <BadgeNode key={key} node={node} />;
    case "divider":
      return <hr key={key} className="border-[var(--color-bg-off-white-20)]" />;
    case "list": {
      const ListTag = node.ordered ? "ol" : "ul";
      return (
        <ListTag
          key={key}
          className={clsx("space-y-2", node.ordered && "list-decimal pl-6")}
        >
          {node.items.map((item, i) => (
            <li key={i}>{renderNode(item, i)}</li>
          ))}
        </ListTag>
      );
    }
    case "field-line":
      return (
        <p key={key} className="text-lg font-semibold text-[var(--color-text-primary)]">
          {node.label}
          <span className="underline decoration-[var(--color-text-disabled)] decoration-1 underline-offset-4">
            {node.placeholder ?? "________________"}
          </span>
        </p>
      );
    case "link":
      if (node.variant === "button") {
        return (
          <Link
            key={key}
            href={node.href}
            className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-bg-charcoal)] px-6 py-3 text-base font-medium text-white border border-white/50"
          >
            <span aria-hidden>+</span>
            {node.label}
          </Link>
        );
      }
      return (
        <Link key={key} href={node.href} className="text-[var(--color-accent-orange)] underline">
          {node.label}
        </Link>
      );
    default:
      return null;
  }
}

export function ContentRenderer({ nodes }: { nodes: ContentNode[] }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {nodes.map((node, i) => renderNode(node, i))}
    </div>
  );
}
