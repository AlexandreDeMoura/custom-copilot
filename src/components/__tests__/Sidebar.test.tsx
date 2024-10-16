import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n.test';
import Sidebar from '../Sidebar';
import { Conversation } from '../../types/types';

// Mock the SVG imports
jest.mock('../../img/chat-icon.svg', () => ({ ReactComponent: () => <div>ChatIcon</div> }));
jest.mock('../../img/new-chat.svg', () => ({ ReactComponent: () => <div>NewChatIcon</div> }));
jest.mock('../../img/saved-conv.svg', () => ({ ReactComponent: () => <div>SavedConvIcon</div> }));
jest.mock('../../img/more-line.svg', () => ({ ReactComponent: () => <div>MoreLineIcon</div> }));

const mockConversations = [
  { id: '1', title: 'Conversation 1', messages: [], lastUpdated: new Date() },
  { id: '2', title: 'Conversation 2', messages: [], lastUpdated: new Date() },
];

const renderSidebar = (theme: 'light' | 'dark') => {
  localStorage.setItem('theme', theme);
  return render(
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Sidebar
          conversations={mockConversations as unknown as Conversation[]}
          currentConversation="1"
          startNewChat={() => {}}
          selectConversation={() => {}}
        />
      </I18nextProvider>
    </ThemeProvider>
  );
};

describe('Sidebar', () => {
  it('renders correctly in light theme', () => {
    renderSidebar('light');
    const sidebarElement = screen.getByTestId('sidebar');
    expect(sidebarElement).toHaveClass('bg-white');
    expect(sidebarElement).not.toHaveClass('bg-gray-800');
  });

  it('renders correctly in dark theme', () => {
    renderSidebar('dark');
    const sidebarElement = screen.getByTestId('sidebar');
    expect(sidebarElement).toHaveClass('bg-gray-800');
    expect(sidebarElement).not.toHaveClass('bg-white');
  });

  it('displays conversation titles', () => {
    renderSidebar('light');
    expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    expect(screen.getByText('Conversation 2')).toBeInTheDocument();
  });

  it('highlights the current conversation', () => {
    renderSidebar('light');
    const currentConversation = screen.getByText('Conversation 1').closest('div');
    expect(currentConversation).toHaveClass('truncate text-indigo-700');
  });

  it('renders the "Start new chat" button', () => {
    renderSidebar('light');
    expect(screen.getByText('Start new chat')).toBeInTheDocument();
  });

  it('renders the profile section', () => {
    renderSidebar('light');
    expect(screen.getByText('Alexandre')).toBeInTheDocument();
  });
});
