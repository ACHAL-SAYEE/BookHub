import './App.css'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Shelf from './components/Shelf'
import ProtectedRoute from './components/ProtectedRoute'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'
// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/shelf" component={Shelf} />
      <ProtectedRoute exact path="/books/:id" component={BookDetails} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
