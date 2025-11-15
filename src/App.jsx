import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Plus, Check } from 'lucide-react';

function App() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingPageName, setEditingPageName] = useState(null);
  const [tempPageName, setTempPageName] = useState('');

  useEffect(() => {
    const savedPages = localStorage.getItem('pages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      const initialPages = [
        { id: '1', name: 'Page 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { id: '2', name: 'Page 2', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
      ];
      setPages(initialPages);
      localStorage.setItem('pages', JSON.stringify(initialPages));
    }
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem('pages', JSON.stringify(pages));
    }
  }, [pages]);

  const handleCreatePage = () => {
    const newPage = {
      id: Date.now().toString(),
      name: `Page ${pages.length + 1}`,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    };
    setPages([...pages, newPage]);
  };

  const handleCheckboxChange = (pageId) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPages.size === pages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(pages.map(p => p.id)));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const newPages = pages.filter(page => !selectedPages.has(page.id));
    setPages(newPages);
    setSelectedPages(new Set());
    setShowDeleteConfirm(false);
  };

  const handlePageClick = (page) => {
    if (!isEditMode && editingPageName !== page.id) {
      setCurrentPage(page);
      setEditContent(page.content);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedPages = pages.map(page =>
      page.id === currentPage.id ? { ...page, content: editContent } : page
    );
    setPages(updatedPages);
    setCurrentPage({ ...currentPage, content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(currentPage.content);
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedPages(new Set());
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);

    setPages(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handlePageNameEdit = (pageId, currentName) => {
    setEditingPageName(pageId);
    setTempPageName(currentName);
  };

  const handlePageNameSave = (pageId) => {
    const updatedPages = pages.map(page =>
      page.id === pageId ? { ...page, name: tempPageName } : page
    );
    setPages(updatedPages);
    setEditingPageName(null);
    setTempPageName('');
  };

  const handlePageNameCancel = () => {
    setEditingPageName(null);
    setTempPageName('');
  };

  if (currentPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setCurrentPage(null)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Pages</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{currentPage.name}</h1>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {!isEditing ? (
              <p className="text-gray-700 leading-relaxed text-lg">{currentPage.content}</p>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter content..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Page Manager</h1>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Pages</h2>
            <div className="flex gap-3">
              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isEditMode
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isEditMode ? <Check size={18} /> : <Edit2 size={18} />}
                <span>{isEditMode ? 'Done' : 'Edit'}</span>
              </button>
              <button
                onClick={handleCreatePage}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={18} />
                <span>New Page</span>
              </button>
            </div>
          </div>

          {isEditMode && pages.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-3">
              <span className="font-medium text-gray-700">Select All</span>
              <input
                type="checkbox"
                checked={selectedPages.size === pages.length}
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-3">
            {pages.map((page, index) => (
              <div
                key={page.id}
                draggable={isEditMode}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-all ${
                  isEditMode ? 'cursor-move hover:shadow-md' : 'hover:bg-gray-50'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                {editingPageName === page.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempPageName}
                      onChange={(e) => setTempPageName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePageNameSave(page.id);
                        if (e.key === 'Escape') handlePageNameCancel();
                      }}
                    />
                    <button
                      onClick={() => handlePageNameSave(page.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handlePageNameCancel}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePageClick(page)}
                    className="flex-1 text-left font-medium text-gray-700 hover:text-blue-600"
                  >
                    {page.name}
                  </button>
                )}
                
                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <button
                      onClick={() => handlePageNameEdit(page.id, page.name)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <input
                    type="checkbox"
                    checked={selectedPages.has(page.id)}
                    onChange={() => handleCheckboxChange(page.id)}
                    className={`w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isEditMode
                        ? 'opacity-100'
                        : selectedPages.has(page.id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {isEditMode && selectedPages.size > 0 && (
            <div className="mt-6 flex justify-end animate-[slideUp_0.3s_ease-out]">
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete Selected ({selectedPages.size})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
          <div className="fixed inset-0 bg-white/25 bg-opacity-25 backdrop-blur-lg flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] border border-white border-opacity-20 shadow-xl">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full animate-[scaleIn_0.3s_ease-out]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedPages.size} page{selectedPages.size > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;