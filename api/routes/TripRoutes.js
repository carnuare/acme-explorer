import { listTrips, createTrip, readTrip, updateTrip, deleteTrip, publishTrip, cancelTrip, listTripApplications, createTripApplication, createTripSponsorship, updateTripSponsorships } from '../controllers/TripController.js'
import { creationValidator as tripCreationValidator, updateValidator, publishValidator, cancelValidator, sponsorshipsValidator } from '../controllers/validators/TripValidator.js'
import { creationValidator as appCreationValidator } from '../controllers/validators/ApplicationValidator.js'
import { creationValidator as sponsorshipCreationValidator } from '../controllers/validators/SponsorshipValidator.js'
import { filterValidator } from '../controllers/validators/FinderValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {

  /**
  * Get a trip
  *    Required role: None
  * Post an actor
  *    RequiredRoles: Manager
  *
  * @section trips
  * @type get post
  * @url /v1/trips
  */
  app.route('/v1/trips')
    .get(
      filterValidator,
      handleExpressValidation,
      listTrips
    ).post(
      tripCreationValidator,
      handleExpressValidation,
      createTrip
    )

  /**
  * Put a trip
  *    RequiredRoles: to be manager who created the trip
  * Get a trip
  *    RequiredRoles: None
  *
  * @section trips
  * @type get put
  * @url /v1/trips/:id
  */
  app.route('/v1/trips/:id')
    .get(readTrip)
    .put(
      updateValidator,
      handleExpressValidation,
      updateTrip
    ).delete(deleteTrip)

  /**
  * Publish a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /v1/trips/:id/publish
  */
  app.route('/v1/trips/:id/publish')
    .patch(
      publishValidator,
      handleExpressValidation,
      publishTrip
    )

  /**
  * Cancel a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /v1/trips/:id/cancel
  */
  app.route('/v1/trips/:id/cancel')
    .patch(
      cancelValidator,
      handleExpressValidation,
      cancelTrip
    )

  /**
  *
  * APPLICATIONS
  *
  */

  /**
  * Get trip's applications
  *    RequiredRoles: to be manager who created the trip
  * Post application
  *    RequiredRoles: Explorer
  *
  * @section trips
  * @type get post
  * @url /v1/trips/:id/applications
  */
  app.route('/v1/trips/:id/applications')
  .get(listTripApplications)
  .post(
    appCreationValidator,
    handleExpressValidation,
    createTripApplication
  )

  /**
  *
  * SPONSORSHIPS
  *
  */

  /**
  * Add new sponsorship
  *   RequiredRoles: Sponsor
  *
  * Update trip's sponsorships
  *    RequiredRoles: Manager
  *
  * @section trips
  * @type post patch
  * @url /v1/trips/:id/sponsorships
  */
  app.route('/v1/trips/:id/sponsorships')
  .post(
    sponsorshipCreationValidator,
    handleExpressValidation,
    createTripSponsorship
  ).patch(
    sponsorshipsValidator,
    handleExpressValidation,
    updateTripSponsorships
  )

}