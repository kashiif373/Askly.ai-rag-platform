import React from "react";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { tomorrow }
from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  FaRobot,
  FaUserCircle
} from "react-icons/fa";

function MessageBubble({ msg }) {

  return (

    <div
      className={
        msg.type === "user"
          ? "userWrapper"
          : "aiWrapper"
      }
    >

      <div className="avatar">

        {
          msg.type === "user"
            ? <FaUserCircle />
            : <FaRobot />
        }

      </div>

      <div
        className={
          msg.type === "user"
            ? "userBubble"
            : "aiBubble"
        }
      >

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }) {

              const match =
                /language-(\w+)/.exec(className || "");

              return !inline && match ? (

                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >

                  {String(children).replace(/\n$/, "")}

                </SyntaxHighlighter>

              ) : (

                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >

          {msg.text}

        </ReactMarkdown>

      </div>

    </div>
  );
}

export default MessageBubble;