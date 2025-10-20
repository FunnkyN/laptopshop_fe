import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './chatbot.css';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const speed = text.length > 200 ? 5 : 15;

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
        ),
        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

const ChatMessages = ({ messages }) => {
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatboxRef}
      id="chatbox"
      className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 text-sm"
      style={{ scrollbarWidth: 'thin' }}
    >
      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;
        const isBot = msg.sender === 'bot';
        const shouldType = isBot && isLastMessage;

        return (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-xl shadow max-w-[85%] break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {shouldType ? (
                <Typewriter text={msg.text} />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    a: ({node, ...props}) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className={msg.sender === 'user' ? 'text-white underline' : 'text-blue-600 hover:underline'} />
                    ),
                    p: ({ node, ...props }) => <p {...props} className="mb-1 last:mb-0" />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;