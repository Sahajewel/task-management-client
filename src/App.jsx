import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Login from './Routes/Login';
import { AuthContext } from './Routes/AuthProvider';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  flex-wrap: wrap; // Allow columns to wrap on smaller screens

  @media (max-width: 768px) {
    flex-direction: column; // Stack columns vertically on mobile
    align-items: center; // Center columns horizontally
    padding: 10px; // Reduce padding on mobile
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    justify-content: space-evenly; // Distribute columns evenly on tablet
    padding: 15px; // Adjust padding on tablet
  }
`;

const Column = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  width: 300px;
  min-height: 400px;
  margin-bottom: 20px; // Add spacing between columns on mobile

  @media (max-width: 768px) {
    width: 95%; // Make columns take up most of the screen width on mobile
    min-height: auto; // Allow columns to adjust height based on content
    padding: 8px; // Reduce padding on mobile
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 45%; // Adjust column width on tablet
    min-height: 300px; // Adjust min-height on tablet
    padding: 12px; // Adjust padding on tablet
  }
`;


const Task = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 8px;
  width: 95%;

  @media (max-width: 768px) {
    padding: 8px; // Reduce padding on mobile
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 10px; // Adjust padding on tablet
  }
`;
// const Input = styled.input`
//   width: 90%;
//   padding: 8px;
//   margin-bottom: 8px;

//   @media (max-width: 768px) {
//     width: 95%;
//   }
// `;

const TaskDetails = styled.div`
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 0.9em; // Adjust font size on mobile
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 1em; // Adjust font size on tablet
  }
`;
const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Make it take up the full viewport height */
`
const TaskTimestamp = styled.div`
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
`;
const Heading = styled.div`
  font-size: 20px;
  color: #888;
  padding-top: 25px;
  text-align: center
`;
function App() {
  const [tasks, setTasks] = useState([]);


  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [newTask, setNewTask] = useState({
    'To-Do': { title: '', description: '' },
    'In Progress': { title: '', description: '' },
    'Done': { title: '', description: '' }
  });
  const handleInputChange = (category, field, value) => {
    setNewTask((prev) => ({
      ...prev, // Keep existing state
      [category]: { ...prev[category], [field]: value } // Update only the specific category's input field
    }));
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://task-manager-backend-three-roan.vercel.app/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleAddTask = async (category) => {
    try {
      await axios.post('https://task-manager-backend-three-roan.vercel.app/tasks', {
        title: newTask[category].title,
        description: newTask[category].description,
        category: category,
      });

      // Reset only the specific category's input fields
      setNewTask((prev) => ({
        ...prev,
        [category]: { title: '', description: '' }
      }));

      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`https://task-manager-backend-three-roan.vercel.app/tasks/${editTaskId}`, {
        title: editTaskTitle,
        description: editTaskDescription,
      });
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://task-manager-backend-three-roan.vercel.app/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const updatedTasks = [...tasks];
    const draggedTaskIndex = updatedTasks.findIndex((task) => task._id === draggableId);
    const draggedTask = updatedTasks[draggedTaskIndex];

    updatedTasks.splice(draggedTaskIndex, 1);
    const destinationIndex = updatedTasks.findIndex((task) => task.category === destination.droppableId && updatedTasks.indexOf(task) >= destination.index);

    if (destinationIndex === -1) {
      updatedTasks.push({ ...draggedTask, category: destination.droppableId });
    } else {
      updatedTasks.splice(destinationIndex, 0, { ...draggedTask, category: destination.droppableId });
    }

    setTasks(updatedTasks);

    try {
      await axios.put(`https://task-manager-backend-three-roan.vercel.app/tasks/${draggableId}`, {
        category: destination.droppableId,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task category', error);
    }
  };

  const getTasksByCategory = (category) => {
    return tasks.filter((task) => task.category === category);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
     
    <Login></Login>
    
      <Heading>
        <h1>Task Management App</h1>
      </Heading>
     
      <AppWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Container>
            {['To-Do', 'In Progress', 'Done'].map((category) => (
              <Droppable droppableId={category} key={category}>
                {(provided) => (
                  <Column ref={provided.innerRef} {...provided.droppableProps}>
                    <h2>{category}</h2>
                    {getTasksByCategory(category).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <Task
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {editTaskId === task._id ? (
                              <div>
                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={editTaskTitle} // Correct state variable!
                                  onChange={(e) => setEditTaskTitle(e.target.value)} // Correct handler!
                                />
                                <input
                                  type="text"
                                  placeholder="Description"
                                  value={editTaskDescription} // Correct state variable!
                                  onChange={(e) => setEditTaskDescription(e.target.value)} // Correct handler!
                                />
                                <button onClick={handleSaveEdit}>Save</button>
                              </div>
                            ) : (
                              <div>
                                {task.title}
                                <TaskDetails>
                                  {task.description}
                                </TaskDetails>
                                <TaskTimestamp>{formatDate(task.timestamp)}</TaskTimestamp>
                                <button onClick={() => handleEditTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                              </div>
                            )}
                          </Task>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <div>
                      <input
                        type="text"
                        placeholder="Title"
                        value={newTask[category]?.title || ''}
                        onChange={(e) => handleInputChange(category, 'title', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newTask[category]?.description || ''}
                        onChange={(e) => handleInputChange(category, 'description', e.target.value)}
                      />
                      <button onClick={() => handleAddTask(category)}>Add Task</button>
                    </div>
                  </Column>
                )}
              </Droppable>
            ))}
          </Container>
        </DragDropContext>
      </AppWrapper>
    </div>
   

  );
}

export default App;