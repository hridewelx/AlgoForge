import { useState, useRef, useEffect } from "react";
import axiosClient from "../../utilities/axiosClient";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

const ChatAi = ({ problem }) => {
  const { isDark } = useTheme();
  // console.log("problem", problem);
  const [copiedStates, setCopiedStates] = useState({});
  const { isAuthenticated } = useSelector(
    (state) => state.authentication
  );
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to AlgoForge AI. I'm here to assist you with coding challenges, algorithm design, and technical problem-solving. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    if (!isAuthenticated) {
      setIsLoading(false);
     toast.error("You must be logged in to use AlgoForge AI.", {
  style: {
    borderColor: "#ef4444",
  },
});

      return;
    }

    try {
      const response = await axiosClient.post("/algoforgeai/chat", {
        problemId: problem._id,
        message: inputMessage.trim(),
      });

      console.log("Full API Response:", response); // Check this in console

      let aiResponseData = {
        text: "",
        code: null,
        after_text: null,
      };

      // Handle the JSON string response
      if (response.data && typeof response.data === "object") {
        // If response.data is already an object
        if (
          response.data.response &&
          typeof response.data.response === "string"
        ) {
          // Case: response.data.response is a JSON string
          try {
            const parsedResponse = JSON.parse(response.data.response);
            aiResponseData = {
              text: parsedResponse.text || "",
              code: parsedResponse.code,
              after_text: parsedResponse.after_text,
            };
          } catch (parseError) {
            console.error("Failed to parse nested JSON:", parseError);
            aiResponseData.text = response.data.response;
          }
        } else if (
          response.data.response &&
          typeof response.data.response === "object"
        ) {
          // Case: response.data.response is already an object
          aiResponseData = {
            text: response.data.response.text || "",
            code: response.data.response.code,
            after_text: response.data.response.after_text,
          };
        } else if (response.data.text) {
          // Case: response.data has direct fields
          aiResponseData = {
            text: response.data.text || "",
            code: response.data.code,
            after_text: response.data.after_text,
          };
        } else {
          // Case: response.data is the direct object
          aiResponseData = {
            text: response.data.text || "",
            code: response.data.code,
            after_text: response.data.after_text,
          };
        }
      }

      // Fallback if no text found
      if (!aiResponseData.text.trim()) {
        aiResponseData.text = "I received an empty response. Please try again.";
      }

      const aiMessage = {
        id: Date.now() + 1,
        ...aiResponseData,
        sender: "ai",
        timestamp: new Date(),
        // Only treat as "structured" if there's actual code content
        type: "structured",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm experiencing connection issues. Please check your connection and try again.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Copy code to clipboard
  const copyToClipboard = (code, messageId) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  const renderStructuredMessage = (message) => {
    // Format markdown (bold, inline code, and headers) - theme aware
    const formatMarkdown = (text) => {
      if (!text) return "";

      let formattedText = text;

      // Theme-aware colors
      const headingColor = isDark ? 'text-white' : 'text-slate-900';
      const textColor = isDark ? 'text-slate-300' : 'text-slate-600';
      const strongColor = isDark ? 'text-white' : 'text-slate-900';
      const codeBg = isDark ? 'bg-slate-700' : 'bg-slate-200';
      const codeBorder = isDark ? 'border-slate-600' : 'border-slate-300';
      const codeText = isDark ? 'text-amber-300' : 'text-amber-600';

      // Handle headers first
      formattedText = formattedText.replace(
        /### (.*?)(?:\n|$)/g,
        `<h3 class="text-lg font-bold ${headingColor} mt-4 mb-2">$1</h3>`
      );
      formattedText = formattedText.replace(
        /## (.*?)(?:\n|$)/g,
        `<h2 class="text-xl font-bold ${headingColor} mt-4 mb-2">$1</h2>`
      );

      // Handle bullet point test cases - simple formatting
      formattedText = formattedText.replace(
        /\*\s+\*\*Test Case (\d+):\*\*\s*`([^`]+)`/g,
        `<div class="mt-3"><strong class="${strongColor}">Test Case $1:</strong> <code class="${codeBg} px-2 py-1 rounded ${codeText} font-mono text-sm ml-2">$2</code></div>`
      );

      // Handle bullet point explanations (like "*   **Explanation:**")
      formattedText = formattedText.replace(
        /\*\s+\*\*Explanation:\*\*\s*(.*?)(?=\n\*|\n\n|\n*$)/g,
        `<div class="mt-1 ${textColor} text-sm"><strong>Explanation:</strong> $1</div>`
      );

      // Handle Input/Output with various formats
      formattedText = formattedText.replace(
        /\*\*Input String:\*\*\s*`([^`]+)`/g,
        `<div class="mt-2"><strong class="text-green-500">Input String:</strong> <code class="${codeBg} px-2 py-1 rounded ${codeText} font-mono text-sm ml-2">$1</code></div>`
      );

      formattedText = formattedText.replace(
        /\*\*Output String:\*\*\s*`([^`]+)`/g,
        `<div class="mt-1"><strong class="text-blue-500">Output String:</strong> <code class="${codeBg} px-2 py-1 rounded ${codeText} font-mono text-sm ml-2">$1</code></div>`
      );

      // Handle bold text
      formattedText = formattedText.replace(
        /\*\*([^*]+)\*\*/g,
        `<strong class="font-semibold ${strongColor}">$1</strong>`
      );

      // Handle inline code
      formattedText = formattedText.replace(
        /`([^`]+)`/g,
        `<code class="${codeBg} px-1.5 py-0.5 rounded ${codeText} font-mono text-sm border ${codeBorder}">$1</code>`
      );

      // Handle line breaks
      formattedText = formattedText.replace(/\n/g, "<br>");

      return formattedText;
    };

    return (
      <div className="space-y-4">
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            border: isDark ? "1px solid #475569" : "1px solid #e2e8f0"
          },
        }}
      />

        {/* Text Section - Always render this */}
        {message.text && (
          <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
            <div
              className={`leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(message.text),
              }}
            />
          </div>
        )}

        {/* Code Section - Only if code exists */}
        {message.code &&
          message.code !== null &&
          message.code !== "null" &&
          message.code.trim() !== "" && (
            <div className="relative">
              <div className={`flex items-center justify-between px-4 py-2 rounded-t-lg border-b ${isDark ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
                <span className="text-xs font-mono font-semibold">
                  Solution Code
                </span>
                <button
                  onClick={() => copyToClipboard(message.code, message.id)}
                  className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'}`}
                  title="Copy code"
                >
                  {copiedStates[message.id] ? (
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {copiedStates[message.id] ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className={`p-4 rounded-b-lg overflow-x-auto text-sm font-mono border border-t-0 ${isDark ? 'bg-slate-800 text-emerald-300 border-slate-600' : 'bg-slate-100 text-emerald-600 border-slate-300'}`}>
                <code>{message.code}</code>
              </pre>
            </div>
          )}

        {/* After Text Section - Only if after_text exists */}
        {message.after_text &&
          message.after_text !== null &&
          message.after_text !== "null" && (
            <div className={`pt-4 border-t ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
              <div
                className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(message.after_text),
                }}
              />
            </div>
          )}
      </div>
    );
  };

  const handleTextareaChange = (e) => {
    setInputMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Welcome to AlgoForge AI. I'm here to assist you with coding challenges, algorithm design, and technical problem-solving. How can I help you today?",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ]);
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
          },
        }}
      />
      {/* Header */}
      <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b px-4 py-3 md:px-6 md:py-4`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <h1 className={`text-base md:text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                AlgoForge AI
              </h1>
            </div>
            <div className={`hidden sm:block h-4 w-px ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
            <span className="hidden sm:inline text-xs md:text-sm font-semibold text-emerald-500">
              Assistant
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearChat}
              className={`text-xs transition-colors px-3 py-1 border rounded-lg ${isDark ? 'text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500' : 'text-slate-500 hover:text-slate-700 border-slate-300 hover:border-slate-400'}`}
            >
              Clear Chat
            </button>
            <div className={`flex items-center space-x-3 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="hidden md:inline">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
              <span className="text-emerald-500 font-semibold">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Messages Container */}
        <section
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}
        >
          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto w-full">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex gap-3 md:gap-4 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm font-semibold ${
                      message.sender === "ai"
                        ? "bg-blue-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {message.sender === "ai" ? "AF" : "You"}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0 max-w-full">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <span
                      className={`text-xs md:text-sm font-medium ${
                        message.sender === "ai"
                          ? "text-blue-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {message.sender === "ai" ? "AlgoForge AI" : "You"}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  <div
                    className={`p-3 md:p-4 rounded-xl ${
                      message.sender === "user"
                        ? isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-900"
                        : isDark ? "bg-slate-800/80" : "bg-slate-100/80"
                    }`}
                  >
                    {message.type === "structured" ? (
                      renderStructuredMessage(message)
                    ) : (
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-500 flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                    AF
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-medium text-blue-500 mb-1 md:mb-2">
                    AlgoForge AI
                  </div>
                  <div className={`rounded-xl p-3 md:p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Processing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Input Area */}
        <section className={`border-t ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/30'} p-4 md:p-6`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe your coding challenge or question..."
                    className={`w-full border rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-blue-500 resize-none text-sm ${isDark ? 'bg-slate-800 text-slate-100 border-slate-600 placeholder-slate-400' : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'}`}
                    rows="1"
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className={`absolute bottom-2 right-2 text-xs hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    ⏎ Enter to send
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="w-12 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Status Bar */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3 md:mt-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="flex items-center gap-2 md:gap-4">
                <span>Messages: {messages.length}</span>
                <div className={`hidden sm:block w-1 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
                <span className="hidden sm:inline">Secure Connection</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <span>AlgoForge AI v2.0</span>
                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
                <span
                  className={isLoading ? "text-blue-500" : "text-emerald-500"}
                >
                  {isLoading ? "Processing" : "Ready"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatAi;
