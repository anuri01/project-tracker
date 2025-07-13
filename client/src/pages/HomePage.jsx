import { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../api/axiosConfig';
import ProjectList from '../components/ProjectList'; // projectList 컴포넌트 불러오기
import TaskView from '../components/TaskView'; // TaksView 컴포넌트 불러오기
import ProjectCreator from '../components/ProjectCreator'; 
import { useProjects } from '../hooks/useProjects'; // 👈 훅 불러오기

function HomePage() {
  const {
    projects,
    editingProjectId,
    editName,
    editDesc,
    setEditName,
    setEditDesc,
    setEditingProjectId,
    handleEditClick,
    handleUpdateSubmit,
    handleDeleteProject,
    fetchProjects
  } = useProjects();
 
  const [selectedProject, setSelectedProject] = useState(null); //현재 선택된 프로젝트 객체
  const [tasks, setTasks] = useState([]); // 선택된 프로젝트의 작업 목록
  const [newTaskContent, setNewTaskContent] = useState(''); // 새 작업 입력창의 내용
  // ---

// 특정 프로젝트의 작업 목록을 불러오는 함수
const fetchTasks = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/tasks`);
    setTasks(response.data);
  } catch (error) {
    console.error("작업 목록을 불러오는 데 실패했습니다:", error);
    setTasks([]); // 에러 발생 시 빈 배열로 초기화
  }
};

 useEffect(() => {
  if (selectedProject) {
    fetchTasks(selectedProject._id);
  }
}, [selectedProject]);

// 새 작업을 생성하는 함수
const handleCreateTask = async (e) => {
  e.preventDefault();
  if (!newTaskContent) {
    return;
  }

  try {
    await api.post(`/projects/${selectedProject._id}/tasks`, { content: newTaskContent });
    fetchTasks(selectedProject._id);
    setNewTaskContent('');
  } catch (error) {
    console.error('작업 생성에 실패 했습니다.', error);
  }
};

// 작업(Task) 완료 상태를 토글하는 함수
const handleToggleTask = async(taskId, currentStatus) => {
  try {
    // 서버에 isCompleted 상태를 반대로 바꿔달라고 요청
    await api.patch(`/tasks/${taskId}`, {isCompleted: !currentStatus });

    // 서버에 다시 요청하지 않고, 프론트엔의 상태를 직접 업데이트해 ui 즉시변경
    setTasks(currentTask => 
      currentTask.map(task => 
        task._id === taskId ? { ...task, isCompleted: !currentStatus} : task
      )
    );
  } catch (error) {
    console.error("작업 상태 변경에 실패했어요.", error);
  }
};

// 작업(Task)을 삭제하는 함수
const handleDeleteTask = async (taskId) => {
  if(!window.confirm('정말 삭제하시겠어요?')) return;

  try {
  await api.delete(`/tasks/${taskId}`);
   // 프론트엔드 상태에서 삭제된 작업을 제거하여 UI를 즉시 변경
  setTasks(currentTasks => currentTasks.filter(task => task._id !== taskId));
  } catch(error) {
    console.error('작업 삭제에 실패했습니다.', error);
  }
};

  return (
    <>  
          { /*조건부 랜더링 : 선택된 프로젝트가 있는지 확인 --- */ }
          {selectedProject ? (
            //선택된 프로젝트가 있을 때: 작업(Task) 뷰를 보여줌
          <TaskView 
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          tasks={tasks}
          newTaskContent={newTaskContent}
          setNewTaskContent={setNewTaskContent}
          handleCreateTask={handleCreateTask}
          handleToggleTask={handleToggleTask}
          handleDeleteTask={handleDeleteTask}
        />
          ) : (
            // 선택된 프로젝트가 없을때 : // 프로젝트 목록 뷰를 보여줌(기존 UI) 
          <div className='project-view'>
               {/* 👇 기존의 form을 이 컴포넌트로 대체합니다. */}
          <ProjectCreator onProjectCreated={fetchProjects} />

          {/* 👇 여기가 기존의 길고 복잡했던 코드를 대체한 부분입니다. */}
          <ProjectList 
            projects={projects}
            editingProjectId={editingProjectId}
            editName={editName}
            editDesc={editDesc}
            setEditName={setEditName}
            setEditDesc={setEditDesc}
            handleUpdateSubmit={handleUpdateSubmit}
            setEditingProjectId={setEditingProjectId}
            handleEditClick={handleEditClick}
            handleDeleteProject={handleDeleteProject}
            setSelectedProject={setSelectedProject}
          />
      </div>
)}            
    </>
  );
}

export default HomePage;
