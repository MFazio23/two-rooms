package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class UpdateGameAPIRequest(
    val gameCode: String,
    val token: String
)