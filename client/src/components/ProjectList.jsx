import React from 'react';

function ProjectList({ 
  projects, 
  editingProjectId, 
  editName, 
  editDesc, 
  setEditName, 
  setEditDesc, 
  handleUpdateSubmit, 
  setEditingProjectId, 
  handleEditClick, 
  handleDeleteProject, 
  setSelectedProject 
}) {
  return (
    <div className="project-list">
      <h2>프로젝트 목록</h2>
      {projects.length > 0 ? (
        projects.map(project => (
          <div key={project._id} className="project-card" onClick={() => setSelectedProject(project)}>
            {editingProjectId === project._id ? (
              <form className="edit-form" onSubmit={(e) => handleUpdateSubmit(e, project._id)} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
                <div className="edit-form-buttons">
                  <button type="submit">저장</button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setEditingProjectId(null); }}>취소</button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="card-buttons">
                  <button className="button-primary" onClick={(e) => handleEditClick(e, project)}>수정</button>
                  <button className="delete-button" onClick={(e) => handleDeleteProject(e, project._id)}>삭제</button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>등록된 프로젝트가 없습니다.</p>
      )}
    </div>
  );
}

export default ProjectList;