package dev.mfazio.tworooms.types.api

data class PickWinnersAPIRequest(
    val gameCode: String,
    val token: String,
    val winners: List<String>
)