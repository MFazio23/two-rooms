package dev.mfazio.tworooms.types.api

data class CreateGameAPIRequest(
    val name: String,
    val roles: Map<String, Boolean>
)