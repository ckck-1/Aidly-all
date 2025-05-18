
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isRecording: boolean;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  isRecording: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setIsRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const { addMessage, clearMessages, setIsTyping, setIsRecording } = chatSlice.actions;
export default chatSlice.reducer;
