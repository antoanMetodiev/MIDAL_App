import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"
import DiscoverPage from './components/DiscoverPage/DiscoverPage'

const baseURL = '';

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<DiscoverPage />
		</>
	)
}

export default App;
