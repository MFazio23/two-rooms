package dev.mfazio.tworooms

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.AuthorizationLevel
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.HttpTrigger
import dev.mfazio.tworooms.types.TwoRoomsRole
import dev.mfazio.tworooms.types.api.CreateGameAPIRequest
import java.util.*

class Functions {
    private val gson = Gson()

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
                ?: return@runFun request.badRequest("The roles for a new game are required.")

            val createGameAPIRequest = gson.fromJson<CreateGameAPIRequest>(requestBody)

            val response = FirebaseHandler.createGame(
                createGameAPIRequest.name,
                TwoRoomsRole.fromMap(createGameAPIRequest.roles)
            )

            return@runFun if(response.error == null) {
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
            val gameCode = request.queryParameters["gameCode"]
                ?: return@runFun request.badRequest("The 'gameCode' query string parameter is required.")

            return@runFun request.respond(HttpStatus.OK, "Entered game code is [${gameCode}].")
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
            val gameCode = request.queryParameters["gameCode"]
                ?: return@runFun request.badRequest("The 'gameCode' query string parameter is required.")

            return@runFun request.respond(HttpStatus.OK, "Entered game code is [${gameCode}].")
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
            val gameCode = request.queryParameters["gameCode"]
                ?: return@runFun request.badRequest("The 'gameCode' query string parameter is required.")

            return@runFun request.respond(HttpStatus.OK, "Entered game code is [${gameCode}].")
        }

    @FunctionName("gameWinners")
    fun gameWinners(
        @HttpTrigger(
            name = "gameWinners",
            methods = [HttpMethod.POST, HttpMethod.PUT],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<String?>,
        context: ExecutionContext
    ): HttpResponseMessage? =
        runFun(request, context) {
            val gameCode = request.queryParameters["gameCode"]
                ?: return@runFun request.badRequest("The 'gameCode' query string parameter is required.")

            return@runFun request.respond(HttpStatus.OK, "Entered game code is [${gameCode}].")
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