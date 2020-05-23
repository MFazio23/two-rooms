package dev.mfazio.tworooms.types.api

data class UpdateRoundAPIRequest(
    val gameCode: String,
    val token: String,
    val roundNumber: Int
)