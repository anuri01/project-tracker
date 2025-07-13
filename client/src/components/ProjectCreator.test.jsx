import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCreator from './ProjectCreator';

describe('ProjectCreator 컴포넌트', () => {
  it('h2 제목이 올바르게 렌더링된다', () => {
    // ProjectCreator는 onProjectCreated 함수를 props로 받으므로, 
    // 테스트 시에는 비어있는 가짜 함수를 전달해줘야 에러가 나지 않습니다.
    const mockOnProjectCreated = () => {};

    render(<ProjectCreator onProjectCreated={mockOnProjectCreated} />);
    
    const headingElement = screen.getByText('새 프로젝트 생성');
    
    expect(headingElement).toBeInTheDocument();
  });
});