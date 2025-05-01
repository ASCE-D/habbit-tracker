import type React from "react";

interface MDXContentProps {
  content: string;
}

const MDXContent: React.FC<MDXContentProps> = ({ content }) => {
  return (
    <div
      className="mdx-content prose prose-lg prose-headings:font-semibold 
      prose-headings:text-foreground prose-h1:text-3xl
      prose-h1:leading-tight prose-h2:text-2xl prose-h2:leading-tight prose-h3:text-xl
      prose-h4:text-lg prose-a:text-primaryOrange
      prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4
      prose-blockquote:border-primaryOrange prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-code:text-primaryOrange
      prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted
      prose-pre:rounded-lg prose-pre:p-4 prose-img:rounded-lg
      prose-img:shadow-md prose-ol:list-decimal
      prose-ul:list-disc prose-li:marker:text-primaryOrange
      prose-table:border
      prose-table:border-border prose-th:bg-muted
      prose-th:p-2 prose-th:border prose-th:border-border prose-td:p-2
      prose-td:border prose-td:border-border prose-strong:font-semibold
      prose-strong:text-foreground prose-hr:border-border
      max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MDXContent;
