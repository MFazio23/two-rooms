package dev.mfazio.tworooms

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.AuthorizationLevel
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.HttpTrigger
import dev.mfazio.tworooms.types.TwoRoomsRole
import dev.mfazio.tworooms.types.TwoRoomsTeam
import dev.mfazio.tworooms.types.api.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration

class Functions {
    private val json = Json(JsonConfiguration.Stable)

    @FunctionName("findGame")
    fun findGame(
        @HttpTrigger(
            name = "findGame",
            methods = [HttpMethod.GET],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val gameCode = request.queryParameters["gameCode"]
                ?: return@runFun request.badRequest("The 'gameCode' query string parameter is required.")

            val response = FirebaseHandler.findFullGame(gameCode)

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("createGame")
    fun createGame(
        @HttpTrigger(
            name = "createGame",
            methods = [HttpMethod.POST],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val createGameAPIRequest = json.parse(CreateGameAPIRequest.serializer(), (requestBody))

            val response = FirebaseHandler.createGame(
                createGameAPIRequest.name,
                TwoRoomsRole.fromMap(createGameAPIRequest.roles)
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.CREATED,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("joinGame")
    fun joinGame(
        @HttpTrigger(
            name = "joinGame",
            methods = [HttpMethod.POST],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val joinGameAPIRequest = json.parse(JoinGameAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.joinGame(
                joinGameAPIRequest.gameCode,
                joinGameAPIRequest.name
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("addRandomPlayers")
    fun addRandomPlayers(
        @HttpTrigger(
            name = "addRandomPlayers",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val addRandomPlayersAPIRequest = json.parse(AddRandomPlayersAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.addRandomPlayers(
                addRandomPlayersAPIRequest.gameCode,
                addRandomPlayersAPIRequest.count
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("removePlayer")
    fun removePlayer(
        @HttpTrigger(
            name = "removePlayer",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val removePlayerAPIRequest = json.parse(RemovePlayerAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.removePlayer(
                removePlayerAPIRequest.gameCode,
                removePlayerAPIRequest.uid,
                removePlayerAPIRequest.token
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("startGame")
    fun startGame(
        @HttpTrigger(
            name = "startGame",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val startGameAPIRequest = json.parse(UpdateGameAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.startGame(
                startGameAPIRequest.gameCode,
                startGameAPIRequest.token
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("endGame")
    fun endGame(
        @HttpTrigger(
            name = "endGame",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val endGameAPIRequest = json.parse(UpdateGameAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.endGame(
                endGameAPIRequest.gameCode,
                endGameAPIRequest.token
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("cancelGame")
    fun cancelGame(
        @HttpTrigger(
            name = "cancelGame",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val cancelGameAPIRequest = json.parse(UpdateGameAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.cancelGame(
                cancelGameAPIRequest.gameCode,
                cancelGameAPIRequest.token
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("startRound")
    fun startRound(
        @HttpTrigger(
            name = "startRound",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val updateRoundAPIRequest = json.parse(UpdateRoundAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.startRound(
                updateRoundAPIRequest.gameCode,
                updateRoundAPIRequest.token,
                updateRoundAPIRequest.roundNumber
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("nextRound")
    fun nextRound(
        @HttpTrigger(
            name = "nextRound",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val updateRoundAPIRequest = json.parse(UpdateRoundAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.nextRound(
                updateRoundAPIRequest.gameCode,
                updateRoundAPIRequest.token,
                updateRoundAPIRequest.roundNumber
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    @FunctionName("pickWinners")
    fun pickWinners(
        @HttpTrigger(
            name = "pickWinners",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val requestBody = request.body
                ?: return@runFun request.badRequest("The entered body is empty.")

            val pickWinnersAPIRequest = json.parse(PickWinnersAPIRequest.serializer(), requestBody)

            val response = FirebaseHandler.pickWinners(
                pickWinnersAPIRequest.gameCode,
                pickWinnersAPIRequest.token,
                TwoRoomsTeam.fromStringList(pickWinnersAPIRequest.winners)
            )

            return@runFun if (response.error == null) {
                request.respond(
                    HttpStatus.OK,
                    null,
                    response.data
                )
            } else {
                request.badRequest(response.error)
            }
        }

    private fun runFun(
        request: HttpRequestMessage<String?>,
        context: ExecutionContext,
        function: () -> HttpResponseMessage?
    ): HttpResponseMessage? = try {
        function()
    } catch (ex: Exception) {
        request.serverError("An exception occurred from the request.", ex)
    }
}