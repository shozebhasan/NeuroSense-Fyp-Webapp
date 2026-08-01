import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function formatMessage(content) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          />
        ),

        h1: ({ ...props }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
        ),

        h2: ({ ...props }) => (
          <h2 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),

        h3: ({ ...props }) => (
          <h3 className="text-lg font-bold mt-3 mb-2" {...props} />
        ),

        ul: ({ ...props }) => (
          <ul className="list-disc pl-5 space-y-1" {...props} />
        ),

        ol: ({ ...props }) => (
          <ol className="list-decimal pl-5 space-y-1" {...props} />
        ),

        li: ({ ...props }) => <li className="ml-2" {...props} />,

        p: ({ ...props }) => (
          <p className="mb-2 leading-7" {...props} />
        ),

        strong: ({ ...props }) => (
          <strong className="font-bold" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}