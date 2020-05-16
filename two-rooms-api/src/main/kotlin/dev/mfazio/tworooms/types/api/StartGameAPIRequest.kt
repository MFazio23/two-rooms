package dev.mfazio.tworooms.types.api

data class StartGameAPIRequest(
    val gameCode: String,
    val token: String
)