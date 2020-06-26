package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class PickWinnersAPIRequest(
    val gameCode: String,
    val token: String,
    val winners: List<String>
)