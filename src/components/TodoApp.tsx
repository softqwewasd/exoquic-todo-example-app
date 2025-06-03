"use client";

import React, { useEffect, useState } from 'react';
import { Exoquic } from "@exoquic/browser-sdk";

interface Todo {
  id: number;
  text: string;
  type: string; // completed, pending, removed.
  createdAt: Date;
}

const exoquic = new Exoquic({
  jwtProvider: async () => (await fetch("/api/v1/exo/auth", { method: "POST"})).text(),
  url: "https://dev.exoquic.com/v3/connect"
});

function toggleTodoState(todos: Todo[], todoEvent: Todo): Todo[] {
  if (todoEvent.type == "removed") {
    return todos.filter(todo => todo.id != todoEvent.id);
  }

  if (todos.find(todo => todo.id == todoEvent.id)) {
    return todos.map(currentTodo => {
      if (currentTodo.id == todoEvent.id) {
        currentTodo.type = todoEvent.type;
      }
      return currentTodo;
    })
  }
  return [...todos, todoEvent];
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const initSubscriber = async () => {
      exoquic.subscribe(["todos"], (eventBatch: any) => {
        eventBatch.forEach((jsonEvent: string) => {
          const todoEvent: Todo = JSON.parse(jsonEvent);
          setTodos(currentTodos => toggleTodoState(currentTodos, todoEvent))
        })
      })
    }

    initSubscriber();

    return () => {
      exoquic.close();
    }
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      type: "pending",
      createdAt: new Date()
    };
    exoquic.publishJson("todos", todo);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    
    const toggledTodo = todos.find(todo => todo.id == id);
    if (!toggledTodo) return;
    
    if (toggledTodo.type == "pending") {
      toggledTodo.type = "completed";
      exoquic.publishJson("todos", toggledTodo);
    } else {
      toggledTodo.type = "pending"
      exoquic.publishJson("todos", toggledTodo);
    }
  };

  const deleteTodo = (id: number) => {
    
    const todo = todos.find(todo => todo.id == id);
    if (!todo) return;
    
    todo.type = "removed"
    exoquic.publishJson("todos", todo);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const pendingTodos = todos.filter(todo => todo.type == "pending");
  const completedTodos = todos.filter(todo => todo.type == "completed");

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const todoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '8px'
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
      {/* Add Todo Section */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
          Add New Todo
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            style={inputStyle}
          />
          <button onClick={addTodo} style={buttonStyle}>
            <span style={{ fontSize: '14px' }}>+</span>
            <span>Add</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Pending Todos */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            Pending ({pendingTodos.length})
          </h3>
          {pendingTodos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
              <p>No pending todos!</p>
              <p style={{ fontSize: '14px' }}>Add a new task to get started.</p>
            </div>
          ) : (
            <div>
              {pendingTodos.map((todo) => (
                <div key={todo.id} style={todoItemStyle}>
                  <input
                    type="checkbox"
                    checked={todo.type === "completed"}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ flex: 1, color: '#374151' }}>{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Todos */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            Completed ({completedTodos.length})
          </h3>
          {completedTodos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
              <p>No completed todos yet!</p>
              <p style={{ fontSize: '14px' }}>Complete some tasks to see them here.</p>
            </div>
          ) : (
            <div>
              {completedTodos.map((todo) => (
                <div key={todo.id} style={{...todoItemStyle, backgroundColor: '#f0fdf4'}}>
                  <input
                    type="checkbox"
                    checked={todo.type === "completed"}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ flex: 1, color: '#6b7280', textDecoration: 'line-through' }}>{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {todos.length > 0 && (
        <div style={{...cardStyle, marginTop: '24px'}}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '14px', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{todos.length}</div>
              <div>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{pendingTodos.length}</div>
              <div>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{completedTodos.length}</div>
              <div>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0}%
              </div>
              <div>Progress</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <p style={{fontWeight: "bold"}}>Why another todo app?</p>
          This simple todo application showcases exoquic's core real-time features. In this demo you'll see:
        <ul>
          <li>
            Sub-10 ms real-time updates (P50) across Sweden and Germany.
          </li>
          <li>
            Efficient client-side caching - subscribers only receive events they haven't yet stored locally.
          </li>
        </ul>
        <p style={{fontWeight: "bold"}}>What is Exoquic?</p>
        Exoquic came about because building real-time pipelines was way too painful. You end up juggling Kafka clusters,
        connector configs, custom scaling hacks, and it never feels done.
        
        Exoquic bundles it all into one platform. No more stitching services together, no more one-off scripts. Just a
        simple API that handles provisioning, scaling, and monitoring so you can focus on building real-time features.
        <p/>
        <ul>
          <li>Blazing fast updates to tens of millions of devices simultaneously.</li>
          <li>Cost effective event storage: persist petabytes of data for as little as <b>$0.008/GB/month</b> (more than 60% cheaper than AWS)</li>
          <li>Full Kafka, Streams and Connect compatibility. <b>Maintenance handled by us at no extra cost</b>.</li>
          <li>Seamless protocol support: MQTT out of the box, with Google Pub/Sub, AMQP and many more coming soon.</li>
          <li><b>Protocol interoperability</b>: publish via one protocol (e.g. MQTT) and consume via another (e.g. WebSocket, Kafka, AMQP) without extra glue code.</li>
          <li>Built-in observability: Loki for logs, InfluxDB for metrics, and Grafana dashboards <b>included free.</b></li>
          <li>One-click CDC integration: connect <b>Postgres, MySQL, or Cassandra</b> and stream updates in real time. <b>Also completely free.</b></li>
          <li>Offline-first support, so your apps handle disconnects gracefully without extra code.</li>

        </ul>  
        <p style={{fontWeight: "bold"}}>How do I start using Exoquic?</p>
        <ol>
          <li>Login with Github at <a href="https://exoquic.com">exoquic.com</a></li>
          <li>Generate an API key (dev or prod)</li>
          <li>Connect to Exoquic through your webapp, mobile-app, server or smart device.</li>
        </ol>
        <p>Thats it! It's that easy.</p>
      </div>
    </div>
  );
};

export default TodoApp;
