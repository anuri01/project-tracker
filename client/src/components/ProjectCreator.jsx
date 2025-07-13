import React, { useState } from 'react';
import api from '../api/axiosConfig';

// onProjectCreated 라는 함수를 props로 받습니다.
function ProjectCreator({ onProjectCreated }) {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }
    try {
      await api.post('/projects', { name: projectName, description: projectDesc });
      
      // 상태를 초기화하고, 부모에게 "프로젝트 생성 끝났어!" 라고 알립니다.
      setProjectName('');
      setProjectDesc('');
      onProjectCreated(); // 부모로부터 받은 함수를 실행
    } catch (error) {
      console.error("프로젝트 생성에 실패했습니다:", error);
    }
  };

  return (
    <div className="project-creator">
      <h2>새 프로젝트 생성</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="프로젝트 이름을 입력하세요."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          className="form-input"
          type="text"
          placeholder="프로젝트 설명을 입력하세요."
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />
        <button className="button-primary" type="submit">생성하기</button>
      </form>
    </div>
  );
}

export default ProjectCreator;