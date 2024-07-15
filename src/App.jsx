import { Outlet } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
//import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import { Footer } from './components/Footer'
//import '../node_modules/bootstrap/dist/js/bootstrap.js'

function App() {

    return (
        <>
            <Outlet />
        </>
    )
}

export default App
