import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'
import ContactsUs from '../ContactsUs'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const Shelf = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  const [bookshelfName, setbookshelfName] = useState('ALL')
  const filteredbookShelflabel = bookshelvesList.filter(
    book => book.value === bookshelfName,
  )
  const bookShelflabel = filteredbookShelflabel[0].label
  const [searchText, setsearchText] = useState('')

  let renderResult

  const getBooksData = async () => {
    setApiResponse({
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,
    })
    const jwt_token = Cookies.get('jwt_token')
    console.log(jwt_token)
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchText}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    }

    const response = await fetch(url, options)
    const responseData = await response.json()
    if (response.ok) {
      setApiResponse(prevApiDetails => ({
        ...prevApiDetails,
        status: apiStatusConstants.success,
        data: responseData,
      }))
    } else {
      setApiResponse(prevApiDetails => ({
        ...prevApiDetails,
        status: apiStatusConstants.failure,
        errorMsg: responseData.error_msg,
      }))
    }
  }

  const renderFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dkxxgpzd8/image/upload/v1647250727/Screenshot_30_uavmge.png"
        alt="failure view"
      />

      <p className="top-rated-books-failure-heading">
        Something Went wrong. Please try again.
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={() => {
          getBooksData()
        }}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {data} = apiResponse
    if (data.total === 0) {
      return (
        <div className="resultsNotFound">
          <img src="./resultsNotFound.png" alt="no books" />
          <p>Your search for {searchText} did not find any matches.</p>
        </div>
      )
    }
    return (
      <ul className="books">
        {data.books.map(book => (
          <Link to={`/books/${book.id}`} className="link">
            <li className="book" key={book.id}>
              <img src={book.cover_pic} className="coverImg" alt={book.title} />
              <div className="info">
                <h1 className="bookTitle">{book.title}</h1>
                <p>{book.author_name}</p>
                <p>
                  Avg Rating <BsFillStarFill style={{color: 'yellow'}} />
                  {book.rating}
                </p>
                <p>
                  Status:
                  <span style={{color: 'blue'}}>{book.read_status}</span>
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  const renderLoadingView = () => (
    <div className="loadingContainer" testid="loader">
      <Loader type="TailSpin" color="grey" height="40" width="40" />
    </div>
  )
  if (apiResponse.status === apiStatusConstants.inProgress) {
    renderResult = renderLoadingView()
  } else if (apiResponse.status === apiStatusConstants.success) {
    renderResult = renderSuccessView()
  } else if (apiResponse.status === apiStatusConstants.failure) {
    renderResult = renderFailureView()
  } else {
    renderResult = null
  }

  const onChangesearchText = e => {
    setsearchText(e.target.value)
  }

  useEffect(() => {
    getBooksData()
  }, [bookshelfName])

  return (
    <div className="content2">
      <Header activeTab="shelf" />
      <div className="shelf-page-content">
        <div>
          <h1>Bookshelves</h1>
          <ul className="items">
            {bookshelvesList.map(bookshelf => {
              const activeTabClassName =
                bookshelfName === bookshelf.value ? 'activeShelf' : ''
              return (
                <button
                  className="shelf-button"
                  type="button"
                  onClick={() => {
                    setbookshelfName(bookshelf.value)
                  }}
                >
                  <li
                    key={bookshelf.id}
                    className={`shelf-item ${activeTabClassName}`}
                  >
                    {bookshelf.label}
                  </li>
                </button>
              )
            })}
          </ul>
        </div>
        <div className="books-results">
          <div className="search-header">
            <h1>{bookShelflabel} Books</h1>
            <div className="search-container">
              <input
                className="searchEL"
                value={searchText}
                onChange={onChangesearchText}
                type="search"
              />
              <button
                testid="searchButton"
                type="button"
                className="searchBtn"
                onClick={getBooksData}
              >
                <BsSearch />
              </button>
            </div>
          </div>
          {renderResult}
        </div>
      </div>
      <ContactsUs />
    </div>
  )
}

export default Shelf
