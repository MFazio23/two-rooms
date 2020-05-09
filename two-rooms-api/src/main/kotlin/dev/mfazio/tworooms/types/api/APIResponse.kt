package dev.mfazio.tworooms.types.api

data class APIResponse<T>(
    val message: String? = null,
    val data: T? = null
)