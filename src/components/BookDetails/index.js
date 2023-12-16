import Cookies from 'js-cookie'
import {useState, useEffect} from 'react'
import {useRouteMatch} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'
import ContactUs from '../ContactsUs'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const BookDetails = props => {
  const match = useRouteMatch()
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  let renderResult

  const getBookDetails = async () => {
    setApiResponse({
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,
    })
    const jwt_token = Cookies.get('jwt_token')

    const id = match.params.id

    const url = `https://apis.ccbp.in/book-hub/books/${id}`
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
          getBookDetails()
        }}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {data} = apiResponse
    const bookDetails = data.book_details
    console.log(data)
    return (
      <div className="wraper">
        <div className="book-details">
          <img
            src={bookDetails.cover_pic}
            alt={bookDetails.title}
            className="book-img"
          />
          <div>
            <h1>{bookDetails.title}</h1>
            <p>{bookDetails.author_name}</p>
            <p>
              Avg Rating <BsFillStarFill style={{color: 'yellow'}} />
              {bookDetails.rating}
            </p>
            <p>Status: {bookDetails.read_status}</p>
          </div>
        </div>
        <hr />
        <h1>About Author</h1>
        <p>{bookDetails.about_author}</p>
        <h1>About Book</h1>
        <p>{bookDetails.about_book}</p>
      </div>
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

  useEffect(() => {
    console.log('called')
    getBookDetails()
  }, [])

  const x = 0
  return (
    <div className="bg2">
      <Header activeTab="none" />
      <div className="book-info">{renderResult}</div>
      <ContactUs />
    </div>
  )
}

export default BookDetails
