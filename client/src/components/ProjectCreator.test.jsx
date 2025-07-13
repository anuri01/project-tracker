import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // 👈 user-event 불러오기
import { describe, it, expect, vi } from 'vitest';
import ProjectCreator from './ProjectCreator';
import api from '../api/axiosConfig'; // 👈 api 객체를 불러옵니다.

// api.post 함수를 가짜 함수로 대체하겠다고 Vitest에 알립니다.
vi.mock('../api/axiosConfig');

describe('ProjectCreator 컴포넌트', () => {
it('사용자가 입력창에 타이핑하면 값이 변경된다', async () => {
  // 1. Arrange (준비)
  const user = userEvent.setup();
  const mockOnProjectCreated = () => {};
  render(<ProjectCreator onProjectCreated={mockOnProjectCreated} />);
  const nameInput = screen.getByPlaceholderText('프로젝트 이름을 입력하세요.');

  // 2. Act (실행)
  // 사용자가 nameInput에 '새로운 테스트 프로젝트'라고 타이핑하는 행동
  await user.type(nameInput, '새로운 테스트 프로젝트');
  
  // 3. Assert (검증)
  // nameInput의 값이 '새로운 테스트 프로젝트'일 것이라고 기대하고 확인
  expect(nameInput.value).toBe('새로운 테스트 프로젝트');
});
it('프로젝트 이름 입력 후 생성 버튼을 누르면 onProjectCreated 함수가 호출된다', async () => {
    const user = userEvent.setup();
    const mockOnProjectCreated = vi.fn();

    // Arrange (준비)
    // api.post가 호출되면, 성공적인 응답(Promise)을 반환하도록 설정합니다.
    const mockPost = vi.spyOn(api, 'post').mockResolvedValue({});
    
    render(<ProjectCreator onProjectCreated={mockOnProjectCreated} />);
    
    const nameInput = screen.getByPlaceholderText('프로젝트 이름을 입력하세요.');
    const createButton = screen.getByRole('button', { name: '생성하기' });

    // Act (실행)
    await user.type(nameInput, '새로운 프로젝트');
    await user.click(createButton);

    // Assert (검증)
    // api.post가 성공한 것으로 처리되었으므로, onProjectCreated가 호출됩니다.
    expect(mockOnProjectCreated).toHaveBeenCalled();

    // 사용이 끝난 mock을 복원합니다.
    mockPost.mockRestore();
  });
});