package dev.mfazio.tworooms

import com.microsoft.azure.functions.HttpRequestMessage
import com.microsoft.azure.functions.HttpResponseMessage
import com.microsoft.azure.functions.HttpStatus
import dev.mfazio.tworooms.types.api.APIResponse
import java.util.*

fun HttpRequestMessage<String?>.respond(
    status: HttpStatus,
    message: String? = null
): HttpResponseMessage? =
    this.createResponseBuilder(status)
        .body(APIResponse<Any?>(message, null))
        .header("Content-Type", "application/json")
        .build()

fun <T> HttpRequestMessage<String?>.respond(
    status: HttpStatus,
    message: String? = null,
    data: T? = null
): HttpResponseMessage? =
    this.createResponseBuilder(status)
        .body(APIResponse<Any?>(message, data))
        .header("Content-Type", "application/json")
        .build()

fun HttpRequestMessage<String?>.badRequest(message: String): HttpResponseMessage? =
    this.respond<Any?>(HttpStatus.BAD_REQUEST, message)

fun HttpRequestMessage<String?>.serverError(message: String, exception: Exception): HttpResponseMessage? =
    this.respond(HttpStatus.INTERNAL_SERVER_ERROR, message, exception)