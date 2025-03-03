import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom"
import HospitalCreationForm from './components/HospitalCreationForm'
import HospitalsByCity from './components/HospitalsByCity'
import HospitalDetails from './components/HospitalDetails'
import EditHospitalForm from './components/EditHospitalForm'
import HomePage from './components/HomePage'
function App() {

  return (
   <div>
    <Router>  
         <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/city" element={<HospitalsByCity/>}/>
            <Route path="/create" element={<HospitalCreationForm/>}/>
            <Route path="/details/:_id" element={<HospitalDetails/>}/>
            <Route path="/edit/:_id" element={<EditHospitalForm/>}/>
         </Routes>
      </Router>
   </div>
  )
}

export default App
