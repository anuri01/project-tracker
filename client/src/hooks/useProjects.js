import { useState, useEffect, use } from 'react';
import api from '../api/axiosConfig';

// 프로젝트 관련 로직을 담을 커스텀 훅
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. 로딩 상태 추가

  const fetchProjects = async () => {
    setIsLoading(true); // 2. 데이터 요청 시작 시 true로 설정
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("프로젝트 목록을 불러오는 데 실패했습니다:", error);
    } finally {
      setIsLoading(false); // 3. 요청이 성공하든 실패하든 끝나면 false로 설정
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setEditingProjectId(project._id);
    setEditName(project.name);
    setEditDesc(project.description);
  };

  const handleUpdateSubmit = async (e, projectId) => {
    e.preventDefault();
    if (!editName) return alert("프로젝트 이름은 필수 입니다.");
    if (!window.confirm('정말로 프로젝트를 업데이트 하시겠어요?')) return;
    
    try {
      await api.put(`/projects/${projectId}`, { name: editName, description: editDesc });
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("프로젝트 수정에 실패했습니다.", error);
    }
  };

  const handleDeleteProject = async (e, idToDelete) => {
    e.stopPropagation();
    if (!window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/projects/${idToDelete}`);
      fetchProjects();
    } catch (error) {
      console.error("프로젝트 삭제에 실패했습니다:", error);
    }
  };

  // 훅이 관리하는 상태와 함수들을 객체 형태로 반환
  return {
    projects,
    editingProjectId,
    editName,
    editDesc,
    isLoading,
    setEditName,
    setEditDesc,
    setEditingProjectId,
    handleEditClick,
    handleUpdateSubmit,
    handleDeleteProject,
    fetchProjects // 프로젝트 생성 후 목록을 새로고침하기 위해 이것도 반환합니다.
  };
}