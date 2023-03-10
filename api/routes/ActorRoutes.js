import { listActors, createActor, readActor, updateActor, deleteActor, banActor, unbanActor } from '../controllers/ActorController.js'
import { creationValidator } from '../controllers/validators/ActorValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get an actor
  *    Required role: None
  * Post an actor
  *    RequiredRoles: Manager
  *
  * @section actors
  * @type get post
  * @url /v1/actors
  */
  app.route('/v1/actors')
    .get(listActors)
    .post(
      creationValidator,
      handleExpressValidation,
      createActor
    )

  /**
  * Put an actor
  *    RequiredRoles: to be manager
  * Get an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get put
  * @url /v1/actors/:id
  */
  app.route('/v1/actors/:id')
    .get(readActor)
    .put(updateActor)
    .delete(deleteActor)

  /**
   * Ban an actor
   *   RequiredRoles: to be manager
   * @section actors
   * @type patch
   * @url /v1/actors/:id/ban
   */
  app.route('/v1/actors/:id/ban')
    .patch(banActor)

  /**
   * Unban an actor
   *  RequiredRoles: to be manager
   * @section actors
   * @type patch
   * @url /v1/actors/:id/unban
   */
  app.route('/v1/actors/:id/unban')
    .patch(unbanActor)

}