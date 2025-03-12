import { cn } from '@/lib/utils/utils';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Code blocks
        code({ node, className, children, ...props }) {
          return (
            <div className='my-2'>
              <code
                className={cn(
                  className,
                  'block p-4 rounded-lg bg-gray-800 text-gray-100 font-mono overflow-x-auto',
                  'border border-gray-700 shadow-sm',
                )}
                {...props}
              >
                {children}
              </code>
            </div>
          );
        },

        // Links
        a({ href, children }) {
          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-700 underline decoration-2 decoration-blue-300 hover:decoration-blue-400'
            >
              {children}
            </a>
          );
        },

        // Blockquotes
        blockquote({ children }) {
          return (
            <blockquote className='pl-4 my-4 border-l-4 border-gray-300 bg-gray-50 p-2 rounded-r-lg'>
              {children}
            </blockquote>
          );
        },

        // Unordered Lists
        ul({ children }) {
          return (
            <ul className='list-disc pl-5 my-2 text-gray-800'>{children}</ul>
          );
        },

        // Ordered Lists
        ol({ children }) {
          return (
            <ol className='list-decimal pl-5 my-2 text-gray-800'>{children}</ol>
          );
        },

        // List Items
        li({ children }) {
          return <li className='my-1 leading-relaxed'>{children}</li>;
        },

        // Headings
        h1({ children }) {
          return <h1 className='text-2xl font-bold my-4'>{children}</h1>;
        },
        h2({ children }) {
          return <h2 className='text-xl font-bold my-3'>{children}</h2>;
        },
        h3({ children }) {
          return <h3 className='text-lg font-bold my-2'>{children}</h3>;
        },
        h4({ children }) {
          return <h4 className='text-base font-bold my-2'>{children}</h4>;
        },

        // Paragraphs
        p({ children }) {
          return <p className='my-2 text-gray-800'>{children}</p>;
        },

        // Horizontal Rule
        hr() {
          return <hr className='my-4 border-t border-gray-300' />;
        },

        // Tables
        table({ children }) {
          return (
            <div className='my-4 overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-300'>
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className='border border-gray-300 p-2 bg-gray-100 text-left font-semibold'>
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className='border border-gray-300 p-2'>{children}</td>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
