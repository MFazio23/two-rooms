package dev.mfazio.tworooms.types.api

data class UpdateGameAPIRequest(
    val gameCode: String,
    val token: String
)