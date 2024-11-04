import { useEffect, useState } from "react";

const API_URL = 'http://localhost:5000/api/todos';

export default function useFetchAPiTodo() {
  const [todoes, setTodoes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadTodo() {
    try {
      const response = await fetch(API_URL);
      const todoList = await response.json();
      setTodoes([...todoList.data]);
    } catch (e) {
      console.error(e);
    }
  }

  async function addTodo(newData) {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to add todo');      
      setTodoes(prev => [data.data, ...prev])        
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function completeTodo(id, updatedData) {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update todo');
      loadTodo(); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTodo(id) {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      loadTodo();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function bulkTodoes(bulkAction) {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/all`, {
        method: 'POST',
        body: JSON.stringify(bulkAction)
      });
      await response.json();
      if (!response.ok) throw new Error('Failed to bulk action todo');
      loadTodo();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodo();
  }, []);

  useEffect(() => {
    
  }, [todoes]);

  return { todoes, setTodoes, loading, addTodo, completeTodo, deleteTodo, bulkTodoes };
}
