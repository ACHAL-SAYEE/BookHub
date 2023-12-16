import './index.css'
import {Link, withRouter, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const history = useHistory()
  const onClickLogout = () => {
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  const {activeTab} = props
  const homeLinkClass = activeTab === 'home' ? 'activeTab' : ''
  const shelvesLinkClass = activeTab === 'shelf' ? 'activeTab' : ''

  return (
    <nav>
      <div className="nav-content">
        <Link to="/">
          <img className="website-logo" src="./logo.png" alt="website logo" />
        </Link>
        <div className="nav-right-items">
          <ul className="nav-menu">
            <Link to="/" className={`nav-link ${homeLinkClass}`}>
              <li> Home</li>
            </Link>

            <Link to="/shelf" className={`nav-link ${shelvesLinkClass}`}>
              <li> Bookshelves</li>
            </Link>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
export default withRouter(Header)
