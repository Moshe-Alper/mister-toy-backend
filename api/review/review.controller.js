import { logger } from '../../services/logger.service.js'
import { authService } from '../auth/auth.service.js'
import { toyService } from '../toy/toy.service.js'
import { reviewService } from './review.service.js'

export async function getReviews(req, res) {
  try {
    const reviews = await reviewService.query(req.query)
    res.send(reviews)
  } catch (err) {
    logger.error('Cannot get reviews', err)
    res.status(400).send({ err: 'Failed to get reviews' })
  }
}

export async function deleteReview(req, res) {
  const { id: reviewId } = req.params

  try {
    await reviewService.remove(reviewId)

    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete review', err)
    res.status(400).send({ err: 'Failed to delete review' })
  }
}

export async function addReview(req, res) {
  var { loggedinUser } = req

  try {
    var review = req.body
    const { aboutToyId } = review
    review.byUserId = loggedinUser._id
    review = await reviewService.add(review)

    // Update user score in login token as well
    const loginToken = authService.getLoginToken(loggedinUser)
    res.cookie('loginToken', loginToken)

    //* prepare the updated review for sending out
    review.byUser = loggedinUser
    review.aboutToy = await toyService.getById(aboutToyId)
    review.createdAt = review._id.getTimestamp()

    delete review.aboutToyId
    delete review.byUserId
    res.send(review)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(400).send({ err: 'Failed to add review' })
  }
}
