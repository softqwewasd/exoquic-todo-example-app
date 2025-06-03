import TodoApp from '@/components/TodoApp';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0f0ff 100%)',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Todo App
        </h1>
        <p style={{
          color: '#6b7280'
        }}>
          Stay organized and productive with Exoquic Todo App
        </p>
      </div>
      <TodoApp />
    </main>
  )
}
