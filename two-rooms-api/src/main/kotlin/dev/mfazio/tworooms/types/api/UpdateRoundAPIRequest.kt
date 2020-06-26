package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class UpdateRoundAPIRequest(
    val gameCode: String,
    val token: String,
    val roundNumber: Int
)