package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class JoinGameAPIRequest(
    val name: String,
    val gameCode: String
)