import * as questionController from '../controllers/QuestionController.js'
import { textValidator, banValidator } from '../controllers/validators/QuestionValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'
import RoleEnum from '../enum/RoleEnum.js'
import { verifyOptionalUser, verifyUser } from '../middlewares/AuthMiddleware.js'

export default function (app) {

  /**
  * Get trip's questions
  *    Required role: None
  * Post new question
  *    Required role: None
  * @sections questions
  * @type get post
  * @url /trips/:id/questions
  */
  app.route('/v1/trips/:id/questions')
  .get(
    questionController.getTripQuestions
  )
  .post(
    textValidator,
    handleExpressValidation,
    questionController.createQuestion
  )
  app.route('/v2/trips/:id/questions')
    .get(
      questionController.getTripQuestions
    )
    .post(
      verifyOptionalUser(),
      textValidator,
      handleExpressValidation,
      questionController.createQuestion
    )

  /**
  * Get all questions from user's applied trips
  *    Required role: None
  * @sections questions
  * @type get
  * @url /questions
  */
  app.route('/v1/questions')
  .get(
    questionController.getUserQuestionsNoAuth
  )
  app.route('/v2/questions')
    .get(
      verifyUser([RoleEnum.EXPLORER]),
      questionController.getUserQuestions
    )

  /**
  * Post new reply
  *    Required roles: Manager (trip owner) or Explorer (with application accepted)
  * @sections questions
  * @type post
  * @url /questions/:id/reply
  */
  app.route('/v1/questions/:id/reply')
  .post(
    textValidator,
    handleExpressValidation,
    questionController.createReplyNoAuth
  )
  app.route('/v2/questions/:id/reply')
    .post(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.MANAGER]),
      textValidator,
      handleExpressValidation,
      questionController.createReply
    )

  /**
  * Modify question text
  *    Required roles: Manager (trip owner) or Explorer (with application accepted), being the author
  * @sections questions
  * @type post
  * @url /questions/:id/edit
  */
  app.route('/v1/questions/:id/edit')
  .patch(
    questionController.modifyQuestion
  )
  app.route('/v2/questions/:id/edit')
    .patch(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.MANAGER]),
      questionController.modifyQuestion
    )

  /**
  * Modify reply text
  *    Required roles: Manager (trip owner) or Explorer (with application accepted), being the author
  * @sections questions
  * @type post
  * @url /replies/:id/edit
  */
  app.route('/v1/replies/:id/edit')
  .patch(
    questionController.modifyReply
  )
  app.route('/v2/replies/:id/edit')
    .patch(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.MANAGER]),
      questionController.modifyReply
    )

  /**
  * Ban a question
  *    Required roles: Manager (trip owner)
  * @sections questions
  * @type patch
  * @url '/questions/:id/ban'
  */
  app.route('/v1/questions/:id/ban')
  .patch(
    banValidator,
    handleExpressValidation,
    questionController.banQuestion
  )
  app.route('/v2/questions/:id/ban')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      banValidator,
      handleExpressValidation,
      questionController.banQuestion
    )

  /**
  * Ban a reply
  *    Required roles: Manager (trip owner)
  * @sections questions
  * @type patch
  * @url '/replies/:id/ban'
  */
  app.route('/v1/replies/:id/ban')
  .patch(
    banValidator,
    handleExpressValidation,
    questionController.banReply
  )
  app.route('/v2/replies/:id/ban')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      banValidator,
      handleExpressValidation,
      questionController.banReply
    )

  /**
  * Get dashboard
  *   Role: Admin
  * @sections questions
  * @type get
  * @url /dashboard/questions
  */
  app.route('/v1/dashboard/questions')
  .get(
    questionController.getTripQuestionDashboard
  )
  app.route('/v2/dashboard/questions')
    .get(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      questionController.getTripQuestionDashboard
    )

}