import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Определение колонок для канбан-доски
const columns: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'К выполнению' },
  { id: 'IN_PROGRESS', title: 'В процессе' },
  { id: 'DONE', title: 'Выполнено' }
];

export default function TaskBoard() {
  // Получаем задачи и функции из хранилища
  const { tasks, moveTask, fetchTasks, isLoading, error } = useTaskStore();
  // Состояние для отслеживания перетаскиваемой задачи
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  // Состояние модального окна для новой задачи
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // Состояние для задачи, которая редактируется
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Загружаем задачи при монтировании компонента
  useEffect(() => {
    fetchTasks().catch(error => {
      console.error('Error loading tasks:', error);
    });
  }, []); // Убираем fetchTasks и tasks из зависимостей

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-foreground">Загрузка задач...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Ошибка</div>
          <p className="text-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Добавляем логирование для отладки рендеринга
  // console.log('Current tasks in TaskBoard:', tasks);
  // console.log('Tasks by status:', {
  //   TODO: tasks.filter(t => t.status === 'TODO'),
  //   IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
  //   DONE: tasks.filter(t => t.status === 'DONE')
  // });

  // Обработчик начала перетаскивания
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Обработчик перетаскивания над областью
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Обработчик отпускания задачи
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  // Обработчик отправки формы задачи (теперь только закрывает модальное окно)
  const handleTaskFormClose = () => {
    setIsNewTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="p-6">
      {/* Заголовок доски и кнопка добавления задачи */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">DevFlow</h1>
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center px-6 py-2 rounded-full border border-accent bg-surface text-accent font-medium shadow-md hover:bg-accent/10 transition-colors duration-200 focus:outline-none"
        >
          <Plus className="w-5 h-5 mr-2" />
          Новая задача
        </button>
      </div>

      {/* Сетка колонок для задач */}
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            layout
            className="flex-1 min-w-[300px] bg-surface rounded-lg shadow-sm border border-border"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{column.title}</h2>
            </div>
            <div
              className="p-4 min-h-[200px]"
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {tasks
                .filter((task: Task) => task.status === column.id && task.id)
                .map((task: Task) => (
                  <div key={task.id || `temp-${Math.random()}`}>
                    <TaskCard
                      task={task}
                      onEdit={(taskToEdit: Task) => {
                        setEditingTask(taskToEdit);
                        setIsNewTaskModalOpen(true);
                      }}
                      onDragStart={(e: React.DragEvent, task: Task) => handleDragStart(e, task)}
                    />
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модальное окно для новой задачи */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={handleTaskFormClose}
        title={editingTask ? 'Редактировать задачу' : 'Новая задача'}
      >
        <NewTaskForm 
          onClose={handleTaskFormClose}
          existingTask={editingTask || undefined}
        />
      </Modal>
    </div>
  );
} 
