import React from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import UserList from './features/user'

function App(): JSX.Element {
    return (
        <div className="App">
            <UserList />
        </div>
    )
}

export default App
