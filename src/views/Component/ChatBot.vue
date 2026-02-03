<template>
  <div class="chatbot-wrapper">
    <!-- Chat Button -->
    <button 
      @click="toggleChat"
      class="chat-button"
    >
      <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <h3>Chat Assistant</h3>
        <button @click="toggleChat" class="close-btn">
          ✕
        </button>
      </div>

      <!-- Messages -->
      <div class="messages-container" ref="messagesContainer">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="welcome-message">
          <p>Hello! How can I help you today?</p>
        </div>

        <!-- Messages List -->
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.sender === 'user' ? 'user-message' : 'bot-message']"
        >
          <div class="message-content">
            {{ message.text }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <form @submit.prevent="sendMessage" class="message-form">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Type your message..."
            :disabled="loading"
            class="message-input"
          />
          <button 
            type="submit" 
            :disabled="!inputMessage.trim() || loading"
            class="send-button"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SimpleChatBot',
  
  data() {
    return {
      isOpen: false,
      inputMessage: '',
      messages: [],
      loading: false,
      apiBaseUrl: 'http://192.168.4.152:8907/api' // Update with your Laravel API URL
    }
  },

  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        // Focus input when chat opens
        this.$nextTick(() => {
          this.scrollToBottom()
          const input = this.$el.querySelector('.message-input')
          if (input) input.focus()
        })
      }
    },

    async sendMessage() {
      if (!this.inputMessage.trim()) return

      // Add user message
      const userMessage = {
        text: this.inputMessage,
        sender: 'user',
        timestamp: new Date()
      }
      this.messages.push(userMessage)
      
      const question = this.inputMessage
      this.inputMessage = ''
      this.loading = true

      try {
        // Send to Laravel API
        const response = await axios.post(`${this.apiBaseUrl}/chat`, {
          message: question
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        // Add bot response
        const botMessage = {
          text: response.data.response || response.data.message || 'No response received',
          sender: 'bot',
          timestamp: new Date()
        }
        this.messages.push(botMessage)

      } catch (error) {
        console.error('Error sending message:', error)
        
        // Add error message
        const errorMessage = {
          text: 'Sorry, there was an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }
        this.messages.push(errorMessage)

      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  },

  mounted() {
    // Add welcome message
    this.messages.push({
      text: "Hello! I'm here to help. Ask me anything!",
      sender: 'bot',
      timestamp: new Date()
    })
  }
}
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chat-button:hover {
  background: #2563eb;
  transform: scale(1.05);
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #3b82f6;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 0.8;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9fafb;
}

.welcome-message {
  text-align: center;
  color: #6b7280;
  padding: 20px 0;
}

.message {
  margin-bottom: 15px;
  max-width: 80%;
}

.user-message {
  margin-left: auto;
}

.bot-message {
  margin-right: auto;
}

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.user-message .message-content {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 5px;
}

.bot-message .message-content {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 5px;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.user-message .message-time {
  text-align: right;
}

.loading-indicator {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

.typing-dots {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  border-bottom-left-radius: 5px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background: #6b7280;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.input-area {
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.message-form {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.message-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.message-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #2563eb;
}

.send-button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>