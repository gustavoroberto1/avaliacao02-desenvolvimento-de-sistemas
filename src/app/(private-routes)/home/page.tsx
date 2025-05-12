'use client'

import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { MdAdd, MdCancel, MdCheckCircle, MdDelete } from 'react-icons/md';
import { Task } from '../../../types/Task';
import styles from './styles.module.css';

export default function MarketList() {
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadItens();
  }, [])


  async function loadItens() {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem('access_token')

      const response = await axios.get('http://localhost:3333/task', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setTasks(response.data);
    }catch (error) {
      console.error('Erro ao carregar os itens:', error);
    }finally{
      setIsLoading(false);
    }
  }

  async function handleAddItem() {
    try {
      setIsLoading(true);
      const newTask = {
        text: newTaskText,
      }
      await axios.post('http://localhost:3333/task', newTask);
      loadItens();
    }catch (error) {
      console.error('Problema ao criar item:', error);
    }finally{
      setIsLoading(false);
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3333/task/${id}`);
      loadItens();
    }catch (error) {
      console.error('Problema ao deletar item:', error);
    }finally{
      setIsLoading(false);
    }
  }

  async function handleCheckTask(id: string) {
    try {
      setIsLoading(true);
      await axios.patch(`http://localhost:3333/task/${id}/completed`);
      loadItens();
    }catch (error) {
      console.error('Problema ao check item:', error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
     <div className={styles.container}>
        <h1>ToDo List</h1>
        <div className={styles.groupInput}>
            <input 
              type="text" 
              placeholder="Adicionar uma nova tarefa" 
              className={styles.inputTask} 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <button className={styles.addTask} onClick={handleAddItem}>
                <MdAdd />
            </button>
        </div>



        <div className={styles.list}>
          {isLoading ? 
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          : (
            <div>
              {tasks.map((task) => (
                <div key={task.id} className={task.completed ? `${styles.item} ${styles.completed}` : styles.item}>
                    <span>{task.text}</span>
                    <div className={styles.actions}>
                        <button onClick={() => handleCheckTask(task.id)} className={styles.check}>
                            {task.completed ? <MdCancel /> : <MdCheckCircle />}
                        </button>
                        <button onClick={() => handleRemoveItem(task.id)} className={styles.delete}>
                            <MdDelete />
                        </button>
                    </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
    </div>
  );
}
