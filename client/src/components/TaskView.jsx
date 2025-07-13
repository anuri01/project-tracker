import React from 'react';

function TaskView({ 
  selectedProject, 
  setSelectedProject, 
  tasks, 
  newTaskContent, 
  setNewTaskContent, 
  handleCreateTask, 
  handleToggleTask, 
  handleDeleteTask 
}) {
  return (
    <div className='task-view'>
      <button className="button-primary" onClick={() => setSelectedProject(null)}>← 프로젝트 목록으로 돌아가기</button>
      <h2>{selectedProject.name}</h2>
      <p>{selectedProject.description}</p>
      
      <div className='task-creator'>
        <form onSubmit={handleCreateTask}>
          <input
            className="form-input"
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder='새 작업 추가...'
          />
          <button className='button-primary' type="submit">추가</button>
        </form>
      </div>

      <div className='task-list'>
        {tasks.length > 0 ? (
          <ul className='task-list-items'>
            {tasks.map(task => (
              <li key={task._id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                <div className='task-content'>
                  <input
                    type='checkbox'
                    checked={task.isCompleted}
                    onChange={() => handleToggleTask(task._id, task.isCompleted)}
                  />
                  <span>{task.content}</span>
                </div>
                <button
                  className='delete-button-small'
                  onClick={() => handleDeleteTask(task._id)}
                >삭제</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>이 프로젝트에는 아직 작업이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default TaskView;