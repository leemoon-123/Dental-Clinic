"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  ChevronDown,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    name: string
    page: number
  }>
}

const suggestedQuestions = [
  "Nhổ răng có đau không?",
  "Chi phí niềng răng?",
  "Cần chuẩn bị gì trước khi nhổ răng?",
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Xin chào! Tôi là trợ lý AI của DentaCare. Tôi có thể giúp bạn tìm hiểu về các dịch vụ nha khoa, đặt lịch hẹn, hoặc giải đáp các thắc mắc về sức khỏe răng miệng. Bạn cần hỗ trợ gì?",
  },
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, { content: string; sources?: Message["sources"] }> = {
        "Nhổ răng có đau không?": {
          content:
            "Nhổ răng hiện đại không đau như bạn nghĩ! Tại DentaCare, chúng tôi sử dụng thuốc tê tại chỗ và có thể kết hợp thuốc an thần nếu cần. Sau khi nhổ, bạn có thể cảm thấy hơi đau nhẹ trong 1-2 ngày, nhưng sẽ được kê đơn thuốc giảm đau phù hợp.",
          sources: [
            { name: "Hướng dẫn nhổ răng an toàn.pdf", page: 3 },
            { name: "FAQ Dịch vụ nha khoa.pdf", page: 12 },
          ],
        },
        "Chi phí niềng răng?": {
          content:
            "Chi phí niềng răng tại DentaCare từ 15.000.000đ - 50.000.000đ tùy vào loại niềng và tình trạng răng. Chúng tôi có các gói:\n\n• Niềng kim loại: 15-25 triệu\n• Niềng sứ: 25-35 triệu\n• Niềng trong suốt Invisalign: 40-50 triệu\n\nChúng tôi hỗ trợ trả góp 0% lãi suất!",
          sources: [
            { name: "Bảng giá dịch vụ 2024.pdf", page: 5 },
            { name: "Chính sách trả góp.pdf", page: 1 },
          ],
        },
        "Cần chuẩn bị gì trước khi nhổ răng?": {
          content:
            "Trước khi nhổ răng, bạn nên:\n\n1. Ăn nhẹ trước 2 giờ (không nhổ khi đói)\n2. Không uống rượu bia 24h trước\n3. Mang theo đơn thuốc đang dùng (nếu có)\n4. Thông báo nếu có bệnh tim, tiểu đường, hoặc đang mang thai\n5. Nghỉ ngơi đầy đủ đêm trước\n\nBạn có muốn đặt lịch khám tư vấn không?",
          sources: [
            { name: "Hướng dẫn trước và sau nhổ răng.pdf", page: 1 },
          ],
        },
      }

      const response = responses[messageText] || {
        content:
          "Cảm ơn bạn đã liên hệ! Để được tư vấn chi tiết hơn, bạn có thể đặt lịch hẹn với bác sĩ hoặc gọi hotline 028-1234-5678. Tôi có thể giúp gì thêm cho bạn?",
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        sources: response.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          isOpen && "hidden"
        )}
        aria-label="Mở chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] transform transition-all duration-300",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        )}
      >
        <Card className="flex h-[500px] max-h-[calc(100vh-100px)] flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <CardHeader className="flex flex-row items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
            <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">
                Trợ Lý AI DentaCare
              </CardTitle>
              <p className="text-xs text-primary-foreground/70">
                Luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <div
              className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
              ref={scrollRef}
            >
              <div className="flex flex-col gap-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border bg-card text-card-foreground shadow-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <Collapsible className="mt-3">
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                            <FileText className="h-3 w-3" />
                            <span>Nguồn tham khảo ({message.sources.length})</span>
                            <ChevronDown className="h-3 w-3" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-1.5">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-xs"
                              >
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="flex-1 truncate">
                                  {source.name}
                                </span>
                                <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                  tr.{source.page}
                                </Badge>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="border-t bg-muted/30 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Câu hỏi gợi ý:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
