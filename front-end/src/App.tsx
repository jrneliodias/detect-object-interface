import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/users")
    setArray(response.data.users)
  }
  const [array, setArray] = useState([])

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>

      {array.map((user, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', textAlign: 'center' }}>
          <span > {user}</span>
        </div>
      ))}



    </>
  )
}

export default App
''